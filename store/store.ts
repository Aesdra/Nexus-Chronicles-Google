
import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { GameState, PlayerCharacter, Choice, Item, EquipmentSlot, Companion, GameSave, InventorySlotData, Quest, Stat, PlayerSlice, InventorySlice, QuestSlice, NpcSlice, GameSlice, TradeSlice, GameStore, CombatSlice, DialogueSlice } from '../types';

// Import slice creators
import { createPlayerSlice } from './playerSlice';
import { createInventorySlice } from './inventorySlice';
import { createQuestSlice } from './questSlice';
import { createNpcSlice } from './npcSlice';
import { createGameSlice } from './gameSlice';
import { createTradeSlice } from './tradeSlice';
import { createCombatSlice } from './combatSlice';
import { createDialogueSlice } from './dialogueSlice';

/**
 * The main Zustand store for the game.
 * This store is created by composing multiple "slices" of state and actions.
 * Each slice is responsible for a specific domain of the game (e.g., player, inventory, quests).
 * This modular approach keeps the store organized and easier to maintain.
 */
export const useGameStore = createWithEqualityFn<GameStore>()(
  (set, get, api) => {
    return {
      // --- INITIAL STATE ---
      player: null,
      party: [],
      currentSceneId: 'start',
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

      // --- SLICES ---
      // Spread in the actions and state from each modular slice.
      ...createGameSlice(set, get, api),
      ...createPlayerSlice(set, get, api),
      ...createInventorySlice(set, get, api),
      ...createQuestSlice(set, get, api),
      ...createNpcSlice(set, get, api),
      ...createTradeSlice(set, get, api),
      ...createCombatSlice(set, get, api),
      ...createDialogueSlice(set, get, api),
    };
  },
  shallow
);
