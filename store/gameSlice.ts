




import { StateCreator } from 'zustand';
// FIX: The GameStore type is defined in `types.ts`, not exported from the store module. Corrected the import path.
import { GameStore, GameSlice, GameState, GameSave, PlayerCharacter, Choice, Companion } from '../types';
import { getScene } from '../services/dataService';
import { db } from '../db';
import { addItemToInventory, formatCurrencyFromCopper, totalCurrencyInCopper } from '../lib/utils';
import { INVENTORY_SIZE } from '../constants';
import { EFFECT_REGISTRY } from '../services/effectRegistry';
import { FACTIONS } from '../data/factions';
import { CAMP_UPGRADES } from '../data/campUpgrades';

/**
 * Extracts the savable parts of the game state to be stored in the database.
 * Transient states like `combatState` are excluded.
 * @param state The current GameStore state.
 * @returns A `GameSave` object.
 */
const savableState = (state: GameStore): Omit<GameSave, 'id' | 'saveTimestamp'> => ({
  player: state.player,
  party: state.party,
  currentSceneId: state.currentSceneId,
  previousSceneId: state.previousSceneId,
  globalFlags: state.globalFlags,
  unlockedLoreIds: state.unlockedLoreIds,
  encounteredCreatureIds: state.encounteredCreatureIds,
  encounteredNpcIds: state.encounteredNpcIds,
  npcState: state.npcState,
  quests: state.quests,
  actionCounters: state.actionCounters,
  isLevelUpPending: state.isLevelUpPending,
  companionLevelUpInfo: state.companionLevelUpInfo,
  factionRelationsOverrides: state.factionRelationsOverrides,
  readDialogueIds: state.readDialogueIds,
  campUpgrades: state.campUpgrades,
});

/**
 * Creates a slice of the store that manages the core game flow.
 * This includes initializing a new game, advancing scenes, managing companions,
 * and handling save/load functionality. It acts as an orchestrator, calling
 * actions from other slices when necessary.
 * @param set - Zustand's `set` function.
 * @param get - Zustand's `get` function.
 * @returns An object containing the core game flow state and actions.
 */
export const createGameSlice: StateCreator<GameStore, [], [], GameSlice> = (set, get, api) => ({
    isHydrated: false,
    autosaveNotificationVisible: false,

    hydrate: (savedState) => {
      // Handle legacy saves that might have a single 'companion' instead of 'party'
      let party = savedState.party || [];
      if (!party.length && (savedState as any).companion) {
          party = [(savedState as any).companion];
      }

      set({ 
          ...savedState, 
          party, 
          combatState: null, 
          npcState: savedState.npcState || {}, 
          quests: savedState.quests || {}, 
          factionRelationsOverrides: savedState.factionRelationsOverrides || {}, 
          readDialogueIds: savedState.readDialogueIds || [], 
          campUpgrades: savedState.campUpgrades || [], 
          isHydrated: true 
        });
    },

    initializeNewGame: async (character: PlayerCharacter) => {
      const initialInventory = Array(INVENTORY_SIZE).fill(null);
      const populatedInventory = [...initialInventory];
      
      if(character.inventory) {
          character.inventory.forEach(slotData => {
              if (slotData) {
                  for(let i = 0; i < slotData.quantity; i++) {
                     const { inventory: newInv } = addItemToInventory(populatedInventory, slotData.item);
                     for(let j=0; j<newInv.length; j++) populatedInventory[j] = newInv[j];
                  }
              }
          })
      }

      const initialState: GameState = {
        player: {
            ...character,
            inventory: populatedInventory,
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            skills: [],
            feats: [],
            reputation: {},
        },
        party: [],
        currentSceneId: 'intro_portal',
        previousSceneId: null,
        globalFlags: {},
        unlockedLoreIds: [],
        encounteredCreatureIds: [],
        encounteredNpcIds: [],
        npcState: {},
        combatState: null,
        tradeSession: null,
        quests: {},
        isLevelUpPending: false,
        companionLevelUpInfo: null,
        actionCounters: {},
        factionRelationsOverrides: {},
        readDialogueIds: [],
        campUpgrades: [],
      };
      
      set({ ...initialState, isHydrated: true });
      await get().triggerAutosave();
    },

    advanceScene: async (choice) => {
      const { startQuest, updateQuest, completeQuest, triggerAutosave } = get();
      const previousScene = getScene(get().currentSceneId);
      const nextScene = await getScene(choice.nextScene || get().currentSceneId);

      // Handle quest state changes triggered by the choice
      if (choice.startsQuest) startQuest(choice.startsQuest);
      if (choice.updatesQuest) updateQuest(choice.updatesQuest.questId, choice.updatesQuest.objectiveId, choice.updatesQuest.status);
      if (choice.completesQuest) completeQuest(choice.completesQuest);
      
      // Handle quest state changes triggered by the upcoming scene
      if (nextScene?.startsQuest) startQuest(nextScene.startsQuest);
      if (nextScene?.updatesQuest) updateQuest(nextScene.updatesQuest.questId, nextScene.updatesQuest.objectiveId, nextScene.updatesQuest.status);
      if (nextScene?.completesQuest) completeQuest(nextScene.completesQuest);

      set(state => {
        let nextGameState = { ...state } as GameState;
        
        nextGameState = {
            ...nextGameState,
            previousSceneId: state.currentSceneId,
            currentSceneId: choice.nextScene || state.currentSceneId,
        };
        
        // --- LOGIC DECOUPLING ---
        // Instead of executing functions directly from data objects, we now use IDs
        // to look up and execute the corresponding logic from a centralized registry.
        
        // Apply effect from the selected choice, if it has one.
        if (choice.effectId && EFFECT_REGISTRY[choice.effectId]) {
          nextGameState = EFFECT_REGISTRY[choice.effectId](nextGameState);
        }
        // Apply effect from the upcoming scene, if it has one.
        if (nextScene?.effectId && EFFECT_REGISTRY[nextScene.effectId]) {
          nextGameState = EFFECT_REGISTRY[nextScene.effectId](nextGameState);
        }

        // --- Reputation Logic ---
        if (nextGameState.player) {
            let newReputation = { ...nextGameState.player.reputation };

            const applyReputationChange = (change: Record<string, number>) => {
                for (const factionId in change) {
                    const value = change[factionId];
                    // Direct change
                    newReputation[factionId] = (newReputation[factionId] || 0) + value;

                    // Cascading changes
                    const staticFactionData = FACTIONS.find(f => f.id === factionId);
                    const overrideData = nextGameState.factionRelationsOverrides?.[factionId];

                    // Merge static and override relations. Override takes precedence.
                    const finalRelations = {
                        allies: overrideData?.allies ?? staticFactionData?.relations?.allies ?? [],
                        enemies: overrideData?.enemies ?? staticFactionData?.relations?.enemies ?? []
                    };

                    if (value > 0) { // Gaining rep
                        finalRelations.allies.forEach(allyId => {
                            newReputation[allyId] = (newReputation[allyId] || 0) + Math.ceil(value / 2);
                        });
                        finalRelations.enemies.forEach(enemyId => {
                            newReputation[enemyId] = (newReputation[enemyId] || 0) - Math.ceil(value / 2);
                        });
                    } else if (value < 0) { // Losing rep
                        finalRelations.allies.forEach(allyId => {
                            newReputation[allyId] = (newReputation[allyId] || 0) + Math.floor(value / 2); // value is negative
                        });
                        finalRelations.enemies.forEach(enemyId => {
                            newReputation[enemyId] = (newReputation[enemyId] || 0) - Math.floor(value / 2); // gains rep with enemies
                        });
                    }
                }
            };
            if (choice.reputationChange) applyReputationChange(choice.reputationChange);
            if (nextScene?.reputationChange) applyReputationChange(nextScene.reputationChange);
            
            nextGameState.player.reputation = newReputation;
        }


        // Handle unlocks
        const unlocks = { ...choice.unlocks, ...nextScene?.unlocks };
        const loreToUnlock = new Set<string>(nextGameState.unlockedLoreIds);
        const creaturesToUnlock = new Set<string>(nextGameState.encounteredCreatureIds);
        const npcsToUnlock = new Set<string>(nextGameState.encounteredNpcIds);
            
        unlocks.lore?.forEach(id => loreToUnlock.add(id));
        unlocks.creatures?.forEach(id => creaturesToUnlock.add(id));
        unlocks.npcs?.forEach(id => npcsToUnlock.add(id));
    
        nextGameState.unlockedLoreIds = Array.from(loreToUnlock);
        nextGameState.encounteredCreatureIds = Array.from(creaturesToUnlock);
        nextGameState.encounteredNpcIds = Array.from(npcsToUnlock);
        
        return nextGameState;
      });
      
      // Check for auto-save triggers after state update
      const shouldAutosave = (
        (nextScene?.backgroundImageUrl !== previousScene?.backgroundImageUrl) ||
        (nextScene?.backgroundKey !== previousScene?.backgroundKey) ||
        choice.startsQuest || choice.completesQuest ||
        nextScene?.startsQuest || nextScene?.completesQuest
      );
      if (shouldAutosave) {
        triggerAutosave();
      }
    },

    addCompanion: (companion: Companion) => set(state => ({ party: [...state.party, companion] })),
    setCompanion: (companion: Companion) => set(state => ({ 
        party: state.party.map(c => c.id === companion.id ? companion : c) 
    })),
    saveGameToSlot: async (slotId) => {
      try {
        const state = get();
        if (!state.player) {
          console.error("Cannot save game without a player.");
          return false;
        }
        await db.gameSaves.put({ ...savableState(state), id: slotId, saveTimestamp: Date.now() });
        return true;
      } catch (error) {
        console.error(`Failed to save game to slot ${slotId}:`, error);
        return false;
      }
    },
    
    triggerAutosave: async () => {
        const { saveGameToSlot } = get();
        set({ autosaveNotificationVisible: true });
        await saveGameToSlot(1); // Always autosave to slot 1
        setTimeout(() => {
            set({ autosaveNotificationVisible: false });
        }, 3000);
    },

    unlockCampUpgrade: (upgradeId: string) => {
        set(state => {
            if (!state.player) return state;
            const upgrade = CAMP_UPGRADES.find(u => u.id === upgradeId);
            if (!upgrade) return state;

            const currentCopper = totalCurrencyInCopper(state.player.currency);
            const costInCopper = upgrade.cost * 100; // Assuming cost is in GP

            if (currentCopper < costInCopper) return state; // Should be checked by UI, but double check here

            const newCurrency = formatCurrencyFromCopper(currentCopper - costInCopper);
            const newUpgrades = [...state.campUpgrades, upgradeId];

            return {
                player: { ...state.player, currency: newCurrency },
                campUpgrades: newUpgrades,
            };
        });
    }
});
