/**
 * @file playerSelectors.ts
 * @description
 * This module contains a collection of selector functions for the Zustand store, specifically
 * for accessing and deriving data related to the player character. Selectors are pure functions
 * that take the entire game state and return a specific, often computed, piece of that state.
 *
 * Using selectors provides several benefits:
 * 1.  **Decoupling:** Components don't need to know the complex shape of the game state. They can
 *     just use a selector to get the data they need (e.g., `useGameStore(selectFinalStats)`).
 * 2.  **Centralization:** Logic for deriving state (like calculating final stats with bonuses) is
 *     centralized here, rather than being scattered across multiple components in `useMemo` hooks.
 * 3.  **Performance:** When used with a shallow equality check (e.g., `useGameStore(selectVitals, shallow)`),
 *     selectors can prevent unnecessary re-renders by ensuring components only update when the
 *     specific data they depend on has actually changed.
 * 4.  **Reusability:** The same selector can be used by any component that needs that piece of data.
 */
import { GameStore, PlayerCharacter, Stat } from '../../types';

/** Selects the entire player character object. */
export const selectPlayer = (state: GameStore): PlayerCharacter | null => state.player;

/**
 * Calculates and returns the player's final stats after applying all modifications,
 * such as bonuses from equipped items.
 * @param state The global GameStore state.
 * @returns An object containing the player's final, calculated stats, or null if there is no player.
 */
export const selectFinalStats = (state: GameStore): Record<Stat, number> | null => {
    if (!state.player) return null;
    
    // Start with a copy of base stats
    const finalStats: Record<Stat, number> = { ...state.player.stats };

    // 1. Add equipment bonuses
    for (const slot in state.player.equipment) {
        const item = state.player.equipment[slot as keyof typeof state.player.equipment];
        if (item && item.stats) {
            for (const stat in item.stats) {
                // Ensure the stat from the item exists on our finalStats object before adding
                if (stat in finalStats) {
                    finalStats[stat as Stat] += (item.stats as any)[stat] || 0;
                }
            }
        }
    }

    // 2. Add Companion Affinity Perks
    // If a companion is in the party and has high affinity (Loyal rank), they grant a passive bonus.
    state.party.forEach(companion => {
        if (companion.affinity >= 80) {
            switch (companion.id) {
                case 'lyra':
                    finalStats.wisdom += 2; // Lyra's keen senses rub off on you
                    break;
                case 'vespera':
                    finalStats.dexterity += 2; // Vespera's hyper-vigilance keeps you on your toes
                    break;
                // Add more companion perks here
            }
        }
    });
    
    // 3. (Future-proofing) Add bonuses/penalties from status effects
    // for (const effect of state.player.statusEffects) { ... }

    return finalStats;
};

/**
 * Selects the player's primary vital statistics (HP, Mana, Stamina).
 * Designed to be used with `shallow` comparison in components to optimize re-renders.
 * @param state The global GameStore state.
 * @returns An object with the player's current and maximum vitals.
 */
export const selectVitals = (state: GameStore) => {
    if (!state.player) return { hp: 0, maxHp: 0, mana: 0, maxMana: 0, stamina: 0, maxStamina: 0 };
    const { hp, maxHp, mana, maxMana, stamina, maxStamina } = state.player.stats;
    return { hp, maxHp, mana, maxMana, stamina, maxStamina };
};

/**
 * Selects the player's experience and level information.
 * Designed to be used with `shallow` comparison in components.
 * @param state The global GameStore state.
 * @returns An object with the player's current XP, XP needed for the next level, and current level.
 */
export const selectExperience = (state: GameStore) => {
    if (!state.player) return { xp: 0, xpToNextLevel: 100, level: 1 };
    const { xp, xpToNextLevel, level } = state.player;
    return { xp, xpToNextLevel, level };
};

/** Selects the array of spell slugs known by the player. */
export const selectPlayerSpells = (state: GameStore) => state.player?.spells || [];

/** Selects the array of martial ability IDs known by the player. */
export const selectPlayerMartialAbilities = (state: GameStore) => state.player?.martialAbilities || [];