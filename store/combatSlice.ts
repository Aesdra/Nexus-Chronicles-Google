
/**
 * @file combatSlice.ts
 * @description
 * This file contains the Zustand slice responsible for managing the state and logic of a combat encounter.
 * It encapsulates all functionality previously handled by the `CombatManager` class, adapting it to a
 * functional, state-driven pattern that is idiomatic to Zustand.
 *
 * The slice manages the entire lifecycle of a combat encounter, including:
 * - Starting combat and setting up combatants.
 * - Processing a queue of combat events in a turn-based manner.
 * - Handling player and AI actions.
 * - Calculating damage, healing, and status effects.
 * - Determining the outcome of the combat and applying rewards.
 * - Managing the transient UI state for player action selection.
 */
import { StateCreator } from 'zustand';
// FIX: The GameStore type is defined in `types.ts`, not exported from the store module. Corrected the import path.
import { 
    GameStore,
    CombatSlice, CombatState, Combatant, PlayerCharacter, Companion,
    Enemy, Ally, DamageType, CombatEvent, ActionDetails, Spell,
    MartialAbility, LogType, CombatLogEntry, StatusEffect,
    Item, PlayerActionState
} from '../types';
import { getEnemy, getAlly, getSpell, getItem } from '../services/dataService';
import { getAIAction } from '../services/aiService';
import { MARTIAL_ABILITIES } from '../data/martialAbilities';
import { ACTION_REGISTRY } from '../services/actionRegistry';
import { COMPANIONS } from '../data/companions';

const getModifier = (statValue: number) => Math.floor((statValue - 10) / 2);

const createLogEntry = (message: string, type: LogType, abilityId?: string): CombatLogEntry => ({
  id: `${Date.now()}-${Math.random()}`,
  message,
  type,
  abilityId,
});

export const createCombatSlice: StateCreator<GameStore, [], [], CombatSlice> = (set, get, api) => ({
    startCombat: (scene) => {
        const { player, party } = get();
        if (!player) return;

        const combatants: Combatant[] = [];
        const createCombatantFromPlayer = (p: PlayerCharacter): Combatant => ({
            id: 'player', originalId: 'player', name: p.name, spriteUrl: p.spriteUrl || '', type: 'player',
            maxHp: p.stats.maxHp, currentHp: p.stats.hp, maxMana: p.stats.maxMana, currentMana: p.stats.mana,
            maxStamina: p.stats.maxStamina, currentStamina: p.stats.stamina,
            speed: p.stats.dexterity, armorClass: 10 + getModifier(p.stats.dexterity), // simplified AC
            attackBonus: 4 + getModifier(p.stats[p.characterClass.scalesWith?.[0] || 'strength']),
            damage: p.equipment.mainHand?.damage || { amount: 1 + getModifier(p.stats.strength), type: DamageType.BLUDGEONING },
            isDefeated: false, statusEffects: [],
            martialAbilities: p.martialAbilities, spells: p.spells,
        });

        const createCombatantFromCompanion = (c: Companion): Combatant => ({
            id: c.id, originalId: c.id, name: c.name, spriteUrl: c.spriteUrl || '', type: 'companion',
            maxHp: c.stats.maxHp, currentHp: c.stats.hp, maxStamina: c.stats.maxStamina, currentStamina: c.stats.stamina,
            speed: c.stats.dexterity, armorClass: 10 + getModifier(c.stats.dexterity),
            attackBonus: 3 + getModifier(c.stats[COMPANIONS[c.id].characterClass === 'Ranger' ? 'dexterity' : 'strength']),
            damage: c.equipment.mainHand?.damage || { amount: 1 + getModifier(c.stats.strength), type: DamageType.BLUDGEONING },
            isDefeated: false, statusEffects: [],
            martialAbilities: c.martialAbilities, spells: c.spells, personality: c.personality,
        });

        const createCombatantFromEnemy = (e: Enemy, uniqueId: string): Combatant => ({
            id: uniqueId, originalId: e.id, name: e.name, spriteUrl: e.imageUrl, type: 'enemy',
            maxHp: e.stats.maxHp, currentHp: e.stats.maxHp, maxMana: e.stats.maxMana, currentMana: e.stats.maxMana,
            maxStamina: e.stats.maxStamina, currentStamina: e.stats.maxStamina,
            speed: e.stats.speed, armorClass: e.stats.armorClass, attackBonus: e.stats.attackBonus, damage: e.stats.damage,
            isDefeated: false, statusEffects: [],
            martialAbilities: e.stats.martialAbilities, personality: e.stats.personality,
        });

        const createCombatantFromAlly = (a: Ally, uniqueId: string): Combatant => ({
            id: uniqueId, originalId: a.id, name: a.name, spriteUrl: a.imageUrl, type: 'companion',
            maxHp: a.stats.maxHp, currentHp: a.stats.maxHp, maxStamina: a.stats.maxStamina, currentStamina: a.stats.maxStamina,
            speed: a.stats.speed, armorClass: a.stats.armorClass, attackBonus: a.stats.attackBonus, damage: a.stats.damage,
            isDefeated: false, statusEffects: [],
            martialAbilities: a.stats.martialAbilities, personality: a.stats.personality,
        });
        
        combatants.push(createCombatantFromPlayer(player));
        
        // Add all party members to combat
        party.forEach(companion => {
            combatants.push(createCombatantFromCompanion(companion));
        });

        scene.enemies.forEach(({ enemyId, count }) => {
            const enemyData = getEnemy(enemyId);
            if (enemyData) for (let i = 0; i < count; i++) combatants.push(createCombatantFromEnemy(enemyData, `${enemyId}_${i}`));
        });
        scene.temporaryCompanions?.forEach(({ allyId, count }) => {
            const allyData = getAlly(allyId);
            if (allyData) for (let i = 0; i < count; i++) combatants.push(createCombatantFromAlly(allyData, `${allyId}_${i}`));
        });

        const turnOrder = [...combatants].sort((a, b) => b.speed - a.speed).map(c => c.id);
        const initialCombatState: CombatState = {
            combatants, turnOrder, currentTurnId: turnOrder[0], isProcessingEvent: false, eventQueue: [],
            log: [createLogEntry('Combat begins!', 'system')],
            onVictoryScene: scene.onVictoryScene, onDefeatScene: scene.onDefeatScene,
            isFinished: null, rewards: null,
            playerActionState: { type: null, isAwaitingTarget: false },
        };
        const firstEvent: CombatEvent = { type: 'TURN_START', combatantId: turnOrder[0] };

        set({ combatState: { ...initialCombatState, eventQueue: [firstEvent] } });
    },
    
    setPlayerAction: (action) => {
        set(state => {
            if (!state.combatState) return state;
            return {
                combatState: {
                    ...state.combatState,
                    playerActionState: action,
                }
            };
        });
    },

    playerChooseAction: (action, targetId) => {
        const { combatState } = get();
        if (!combatState || combatState.currentTurnId !== 'player') return;
        const addCombatEvent = (event: CombatEvent, atStart = false) => {
            set(state => {
                if (!state.combatState) return state;
                const newQueue = atStart ? [event, ...state.combatState.eventQueue] : [...state.combatState.eventQueue, event];
                return { combatState: { ...state.combatState, eventQueue: newQueue } };
            });
        };
        addCombatEvent({ type: 'ACTION_CHOSEN', sourceId: 'player', targetId, action });
    },

    processNextCombatEvent: async () => {
        const { combatState } = get();
        if (!combatState || combatState.isProcessingEvent || combatState.eventQueue.length === 0) return;

        set(state => ({ combatState: { ...state.combatState!, isProcessingEvent: true } }));

        const event = get().combatState!.eventQueue[0];
        set(state => ({ combatState: { ...state.combatState!, eventQueue: state.combatState!.eventQueue.slice(1) }}));

        let newEvents: CombatEvent[] = [];
        const currentCombatState = get().combatState!;

        const addCombatEvent = (event: CombatEvent, atStart = false) => {
            if (atStart) newEvents.unshift(event);
            else newEvents.push(event);
        };

        switch (event.type) {
            case 'TURN_START': {
                const combatant = currentCombatState.combatants.find(c => c.id === event.combatantId)!;
                addCombatEvent({ type: 'LOG_MESSAGE', message: `${combatant.name}'s turn.`, logType: 'system' });
                
                if (combatant.statusEffects.some(e => e.type === 'STUNNED')) {
                    addCombatEvent({ type: 'LOG_MESSAGE', message: `${combatant.name} is stunned!`, logType: 'info' });
                    addCombatEvent({ type: 'TURN_END', combatantId: combatant.id });
                } else if (combatant.type !== 'player') {
                    const aiAction = await getAIAction(combatant, currentCombatState);
                    if (aiAction.type === 'idle') {
                        addCombatEvent({ type: 'LOG_MESSAGE', message: `${combatant.name} hesitates.`, logType: 'info' });
                        addCombatEvent({ type: 'TURN_END', combatantId: combatant.id });
                    } else {
                        const { targetId, ...actionDetails } = aiAction;
                        addCombatEvent({ type: 'ACTION_CHOSEN', sourceId: combatant.id, targetId: targetId, action: actionDetails });
                    }
                }
                break;
            }
            case 'ACTION_CHOSEN': {
                const { sourceId, targetId, action } = event;
                if (!action) break;
                const source = currentCombatState.combatants.find(c => c.id === sourceId)!;
                const target = currentCombatState.combatants.find(c => c.id === targetId)!;
                let actionId: string | undefined;

                if (action.type === 'attack') actionId = 'basic-attack';
                else if (action.type === 'spell' && action.spellSlug) {
                    const spellData = await getSpell(action.spellSlug);
                    if (spellData && (source.currentMana || 0) >= spellData.manaCost) {
                        set(state => ({ combatState: { ...state.combatState!, combatants: state.combatState!.combatants.map(c => c.id === sourceId ? { ...c, currentMana: (c.currentMana || 0) - spellData.manaCost } : c) } }));
                        actionId = spellData.actionId;
                    } else addCombatEvent({ type: 'LOG_MESSAGE', message: `${source.name} does not have enough mana.`, logType: 'info' });
                } else if (action.type === 'ability' && action.abilityId) {
                    const abilityData = MARTIAL_ABILITIES[action.abilityId];
                    if (abilityData && (source.currentStamina || 0) >= abilityData.staminaCost) {
                        set(state => ({ combatState: { ...state.combatState!, combatants: state.combatState!.combatants.map(c => c.id === sourceId ? { ...c, currentStamina: (c.currentStamina || 0) - abilityData.staminaCost } : c) } }));
                        actionId = abilityData.actionId;
                    } else addCombatEvent({ type: 'LOG_MESSAGE', message: `${source.name} does not have enough stamina.`, logType: 'info' });
                }

                if (actionId && ACTION_REGISTRY[actionId]) {
                    const generatedEvents = ACTION_REGISTRY[actionId].resolve(source, target, currentCombatState.combatants);
                    newEvents.push(...generatedEvents);
                }
                addCombatEvent({ type: 'TURN_END', combatantId: sourceId });
                break;
            }
             case 'ATTACK_RESOLVED': {
                if (event.hit) {
                    const abilityName = event.abilityId ? (MARTIAL_ABILITIES[event.abilityId]?.name || (await getSpell(event.abilityId))?.name || event.abilityId) : '';
                    const sourceName = currentCombatState.combatants.find(c=>c.id === event.sourceId)?.name || 'Unknown';
                    const targetName = currentCombatState.combatants.find(c=>c.id === event.targetId)?.name || 'Unknown';

                    const message = `${sourceName} ${abilityName ? `uses ${abilityName} and ` : ''}hits ${targetName} for ${event.damage || 0} ${event.damageType} damage.`;
                    addCombatEvent({ type: 'LOG_MESSAGE', message, logType: 'damage' });
                    
                    let targetDefeated = false;
                    set(state => {
                        const newCombatants = state.combatState!.combatants.map(c => {
                            if (c.id === event.targetId) {
                                const newHp = Math.max(0, c.currentHp - (event.damage || 0));
                                if (newHp <= 0) targetDefeated = true;
                                return {...c, currentHp: newHp};
                            }
                            return c;
                        });
                        return { combatState: {...state.combatState!, combatants: newCombatants}};
                    });
                    if (targetDefeated) addCombatEvent({ type: 'COMBATANT_DEFEATED', combatantId: event.targetId });
                } else {
                     const sourceName = currentCombatState.combatants.find(c=>c.id === event.sourceId)?.name || 'Unknown';
                     const targetName = currentCombatState.combatants.find(c=>c.id === event.targetId)?.name || 'Unknown';
                    addCombatEvent({ type: 'LOG_MESSAGE', message: `${sourceName} misses ${targetName}.`, logType: 'miss' });
                }
                break;
            }
            case 'HEAL_RESOLVED': {
                 const sourceName = currentCombatState.combatants.find(c=>c.id === event.sourceId)?.name || 'Unknown';
                 const targetName = currentCombatState.combatants.find(c=>c.id === event.targetId)?.name || 'Unknown';
                 addCombatEvent({ type: 'LOG_MESSAGE', message: `${sourceName} heals ${targetName} for ${event.amount || 0} HP.`, logType: 'heal' });
                 set(state => {
                     const newCombatants = state.combatState!.combatants.map(c => c.id === event.targetId ? {...c, currentHp: Math.min(c.maxHp, c.currentHp + (event.amount || 0))} : c);
                     return { combatState: {...state.combatState!, combatants: newCombatants}};
                 });
                 break;
            }
            case 'STATUS_APPLIED': {
                 const targetName = currentCombatState.combatants.find(c=>c.id === event.targetId)?.name || 'Unknown';
                 if (event.effect) {
                    addCombatEvent({ type: 'LOG_MESSAGE', message: `${targetName} is now ${event.effect.name}.`, logType: 'status' });
                    set(state => {
                        const newCombatants = state.combatState!.combatants.map(c => c.id === event.targetId ? {...c, statusEffects: [...c.statusEffects, event.effect!]} : c);
                        return { combatState: {...state.combatState!, combatants: newCombatants}};
                    });
                 }
                 break;
            }
            case 'COMBATANT_DEFEATED': {
                const defeatedName = currentCombatState.combatants.find(c=>c.id === event.combatantId)?.name || 'Unknown';
                addCombatEvent({ type: 'LOG_MESSAGE', message: `${defeatedName} has been defeated!`, logType: 'system' });
                
                let partyAlive = false;
                let enemiesAlive = false;
                set(state => {
                     const newCombatants = state.combatState!.combatants.map(c => c.id === event.combatantId ? {...c, isDefeated: true, currentHp: 0} : c);
                     partyAlive = newCombatants.some(c => (c.type === 'player' || c.type === 'companion') && !c.isDefeated);
                     enemiesAlive = newCombatants.some(c => c.type === 'enemy' && !c.isDefeated);
                     return { combatState: {...state.combatState!, combatants: newCombatants}};
                 });

                if (!partyAlive) addCombatEvent({ type: 'COMBAT_END', outcome: 'defeat' }, true);
                else if (!enemiesAlive) addCombatEvent({ type: 'COMBAT_END', outcome: 'victory' }, true);

                break;
            }
            case 'TURN_END': {
                if (!event.combatantId) break;
                const combatant = currentCombatState.combatants.find(c => c.id === event.combatantId)!;
                const updatedEffects = combatant.statusEffects
                    .map(effect => ({ ...effect, duration: effect.duration - 1 }))
                    .filter(effect => {
                        if (effect.duration <= 0) {
                            addCombatEvent({ type: 'LOG_MESSAGE', message: `${effect.name} has worn off for ${combatant.name}.`, logType: 'status' });
                            return false;
                        }
                        return true;
                    });
                set(state => ({ combatState: { ...state.combatState!, combatants: state.combatState!.combatants.map(c => c.id === event.combatantId ? {...c, statusEffects: updatedEffects} : c) }}));
                
                const turnOrder = currentCombatState.turnOrder;
                const currentIndex = turnOrder.indexOf(event.combatantId);
                let nextIndex = (currentIndex + 1) % turnOrder.length;
                let nextCombatant = get().combatState!.combatants.find(c => c.id === turnOrder[nextIndex])!;
                
                while (nextCombatant.isDefeated) {
                    nextIndex = (nextIndex + 1) % turnOrder.length;
                    nextCombatant = get().combatState!.combatants.find(c => c.id === turnOrder[nextIndex])!;
                }
                
                addCombatEvent({ type: 'TURN_START', combatantId: nextCombatant.id }, true);
                set(state => ({ combatState: {...state.combatState!, currentTurnId: nextCombatant.id }}));
                break;
            }
            case 'COMBAT_END': {
                if (event.outcome === 'victory') {
                    const defeatedEnemies = currentCombatState.combatants.filter(c => c.type === 'enemy' && c.isDefeated && c.originalId);
                    const xp = defeatedEnemies.reduce((total, c) => {
                        const enemyData = getEnemy(c.originalId!);
                        return total + (enemyData?.stats?.xpValue || 0);
                    }, 0);
                    
                    const lootPromises = defeatedEnemies.flatMap(c => {
                        const enemyData = getEnemy(c.originalId!);
                        return enemyData?.stats?.lootTable?.map(async (lootItem) => {
                            if (Math.random() < lootItem.dropChance) {
                                const item = await getItem(lootItem.itemId);
                                if (item) {
                                    return { item, quantity: 1 };
                                }
                            }
                            return null;
                        }) || [];
                    });
            
                    const resolvedLoot = (await Promise.all(lootPromises)).filter((l): l is { item: Item, quantity: number } => l !== null);
                    
                    const consolidatedLoot = resolvedLoot.reduce((acc, drop) => {
                        const existing = acc.find(l => l.item.id === drop.item.id);
                        if (existing) {
                            existing.quantity += drop.quantity;
                        } else {
                            acc.push(drop);
                        }
                        return acc;
                    }, [] as { item: Item, quantity: number }[]);
            
                    set(state => ({ combatState: {...state.combatState!, isFinished: event.outcome ?? null, rewards: { xp, loot: consolidatedLoot } }}));
                } else {
                    set(state => ({ combatState: {...state.combatState!, isFinished: event.outcome ?? null, rewards: null }}));
                }
                break;
            }
            case 'LOG_MESSAGE': {
                 if (event.message && event.logType) {
                    set(state => ({ combatState: {...state.combatState!, log: [...state.combatState!.log, createLogEntry(event.message!, event.logType!)] }}));
                 }
                break;
            }
        }
        
        set(state => {
            if (!state.combatState) return state;
            const newQueue = [...newEvents, ...state.combatState.eventQueue];
            return { combatState: { ...state.combatState, eventQueue: newQueue, isProcessingEvent: false } };
        });
    },

    concludeCombat: () => {
        const { combatState, player, gainXp, addItemsToPlayerInventory, advanceScene, triggerAutosave } = get();
        if (!combatState || !combatState.isFinished) return;

        if (combatState.isFinished === 'victory' && combatState.rewards) {
            gainXp(combatState.rewards.xp);
            if (combatState.rewards.loot.length > 0) {
                addItemsToPlayerInventory(combatState.rewards.loot);
            }
        }

        const newPlayerStats = { ...player!.stats };
        const playerInCombat = combatState.combatants.find(c => c.id === 'player');
        if (playerInCombat) {
            newPlayerStats.hp = playerInCombat.currentHp;
            newPlayerStats.mana = playerInCombat.currentMana!;
        }

        const sceneId = combatState.isFinished === 'victory' ? combatState.onVictoryScene : combatState.onDefeatScene;
        
        set({ combatState: null });
        
        // Trigger autosave before advancing scene
        triggerAutosave().then(() => {
            advanceScene({ text: 'Combat Ends', nextScene: sceneId });
        });
    },
});
