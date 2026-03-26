
import { StateCreator } from 'zustand';
// FIX: The GameStore type is defined in `types.ts`, not exported from the store module. Corrected the import path.
import { GameStore, PlayerSlice, PlayerCharacter, Stat } from '../types';
import { audioManager } from '../services/audioService';
import { FEATS } from '../data/feats';
import { LYRA_PROGRESSION, VESPERA_PROGRESSION } from '../data/companions';

const getModifier = (statValue: number) => Math.floor((statValue - 10) / 2);

/**
 * Creates a slice of the store that manages all state and actions directly related to the player character.
 * This includes XP gain, leveling up, applying feats, and direct updates to the player object.
 * @param set - Zustand's `set` function.
 * @param get - Zustand's `get` function.
 * @returns An object containing the player-related state and actions.
 */
export const createPlayerSlice: StateCreator<GameStore, [], [], PlayerSlice> = (set, get, api) => ({
    updatePlayer: (playerUpdate) => {
      set(state => {
          if (!state.player) return state;
          const update = typeof playerUpdate === 'function' ? playerUpdate(state.player) : playerUpdate;
          return { player: { ...state.player, ...update } };
      });
    },
    
    gainXp: (amount) => {
        set(state => {
            if (!state.player) return state;
            const newPlayerXp = state.player.xp + amount;
            let isPlayerLevelUp = state.isLevelUpPending;
            if (newPlayerXp >= state.player.xpToNextLevel) {
                isPlayerLevelUp = true;
            }

            // Distribute XP to all party members
            const updatedParty = state.party.map(companion => {
                const newCompanionXp = companion.xp + amount;
                const companionXpToNextLevel = Math.floor(100 * Math.pow(companion.level, 1.5));
                
                // Check if this specific companion leveled up
                if (newCompanionXp >= companionXpToNextLevel) {
                    // Only trigger level up modal if one isn't already pending
                    // In a real app, we might want a queue, but for now first one wins
                    if (!state.companionLevelUpInfo) {
                        const newLevel = companion.level + 1;
                        let choices: { type: 'ability' | 'spell'; id: string }[] = [];
                        
                        // Select progression based on ID
                        if (companion.id === 'lyra' && LYRA_PROGRESSION[newLevel]) {
                            choices = LYRA_PROGRESSION[newLevel].choices;
                        } else if (companion.id === 'vespera' && VESPERA_PROGRESSION[newLevel]) {
                            choices = VESPERA_PROGRESSION[newLevel].choices;
                        }

                        if (choices.length > 0) {
                            // Set pending level up state
                             // We don't update the companion object yet; wait for modal confirmation
                             set({ companionLevelUpInfo: {
                                companionId: companion.id,
                                level: newLevel,
                                choices: choices,
                            }});
                            return companion; // Return original companion, update happens in applyCompanionLevelUp
                        } else {
                            // Auto-level stats if no choices defined
                            const excessXp = newCompanionXp - companionXpToNextLevel;
                            return {
                                ...companion,
                                level: newLevel,
                                xp: excessXp,
                                stats: { ...companion.stats, maxHp: companion.stats.maxHp + 10, hp: companion.stats.maxHp + 10, dexterity: companion.stats.dexterity + 1, }
                            };
                        }
                    }
                }
                return { ...companion, xp: newCompanionXp };
            });

            return { player: { ...state.player, xp: newPlayerXp }, isLevelUpPending: isPlayerLevelUp, party: updatedParty };
        });
    },

    applyAutomaticLevelUp: () => {
        set(state => {
            if (!state.player || !state.isLevelUpPending) return state;
            audioManager.playSound('levelUp');

            let newPlayer = { ...state.player };
            const excessXp = newPlayer.xp - newPlayer.xpToNextLevel;
            newPlayer.level += 1;
            newPlayer.xp = excessXp;
            newPlayer.xpToNextLevel = Math.floor(100 * Math.pow(newPlayer.level, 1.5));
            
            const conModifier = getModifier(newPlayer.stats.constitution);
            const intModifier = getModifier(newPlayer.stats.intelligence);
            newPlayer.stats.maxHp += 10 + conModifier;
            newPlayer.stats.maxMana += 5 + intModifier;
            newPlayer.stats.hp = newPlayer.stats.maxHp;
            newPlayer.stats.mana = newPlayer.stats.maxMana;

            const primaryStat = newPlayer.characterClass.scalesWith?.[0] || 'strength';
            newPlayer.stats[primaryStat]++;
            
            return { player: newPlayer, isLevelUpPending: false };
        });
    },

    applyManualLevelUp: (choices) => {
        set(state => {
            if (!state.player || !state.isLevelUpPending) return state;
            audioManager.playSound('levelUp');

            let newPlayer = { ...state.player };
            const excessXp = newPlayer.xp - newPlayer.xpToNextLevel;
            newPlayer.level += 1;
            newPlayer.xp = excessXp;
            newPlayer.xpToNextLevel = Math.floor(100 * Math.pow(newPlayer.level, 1.5));
            
            const conModifier = getModifier(newPlayer.stats.constitution);
            const intModifier = getModifier(newPlayer.stats.intelligence);
            newPlayer.stats.maxHp += 10 + conModifier;
            newPlayer.stats.maxMana += 5 + intModifier;
            newPlayer.stats.hp = newPlayer.stats.maxHp;
            newPlayer.stats.mana = newPlayer.stats.maxMana;

            newPlayer.stats[choices.attribute]++;
            if (choices.featId) {
                newPlayer.feats = [...newPlayer.feats, choices.featId];
                const feat = FEATS[choices.featId];
                if (feat?.effects.stats) {
                    for (const [stat, value] of Object.entries(feat.effects.stats)) {
                         (newPlayer.stats as any)[stat] += value;
                    }
                }
            }

            return { player: newPlayer, isLevelUpPending: false };
        });
    },

    applyCompanionLevelUp: (abilityChoice) => {
        set(state => {
            if (!state.party.length || !state.companionLevelUpInfo) return state;
            
            const { companionId, level: newLevel } = state.companionLevelUpInfo;
            
            const updatedParty = state.party.map(c => {
                if (c.id !== companionId) return c;

                const companionXpToNextLevel = Math.floor(100 * Math.pow(c.level, 1.5));
                const excessXp = c.xp - companionXpToNextLevel;

                let newCompanion = { 
                    ...c, 
                    level: newLevel, 
                    xp: excessXp, 
                    stats: { 
                        ...c.stats, 
                        maxHp: c.stats.maxHp + 10, 
                        hp: c.stats.maxHp + 10, 
                        dexterity: c.stats.dexterity + 1, 
                        wisdom: c.stats.wisdom + (newLevel % 4 === 0 ? 1 : 0), 
                    } 
                };
                
                if (abilityChoice.type === 'spell') {
                    newCompanion.spells = [...newCompanion.spells, abilityChoice.id];
                } else {
                    newCompanion.martialAbilities = [...newCompanion.martialAbilities, abilityChoice.id];
                }
                return newCompanion;
            });

            return { party: updatedParty, companionLevelUpInfo: null };
        });
    },

    addFeat: (featId) => {
        set(state => {
            if (!state.player) return state;
            const newPlayer = { ...state.player };
            if (!newPlayer.feats.includes(featId)) {
                newPlayer.feats.push(featId);
            }
            return { player: newPlayer };
        });
    },
});
