/**
 * @file factionSelectors.ts
 * @description
 * This module contains selector functions for the Zustand store related to factions and reputation.
 * It centralizes the logic for calculating the player's standing with various factions, including
 * determining their current rank based on reputation thresholds. This makes the data readily available
 * to any UI component without requiring them to perform these calculations themselves.
 */
import { GameStore } from '../../types';
import { FACTIONS } from '../../data/factions';

/**
 * Selects all factions the player has a non-zero reputation with, calculates their
 * current rank with that faction, and returns a sorted list.
 * @param state The global GameStore state.
 * @returns An array of objects, each containing faction details, player reputation, and rank name,
 *          sorted from highest to lowest reputation.
 */
export const selectKnownFactions = (state: GameStore) => {
    if (!state.player?.reputation) return [];
    
    return Object.entries(state.player.reputation)
        .filter(([_, rep]) => rep !== 0)
        .map(([factionId, repValue]) => {
            const faction = FACTIONS.find(f => f.id === factionId);
            let rankName = 'Neutral'; // Default rank name

            if (faction && faction.ranks) {
                // Find the highest rank the player has achieved by sorting ranks descending and finding the first match.
                const currentRank = [...faction.ranks]
                    .reverse() // Sorts from highest threshold to lowest
                    .find(rank => repValue >= rank.reputationThreshold);
                
                rankName = currentRank ? currentRank.name : 'Unknown';
            }

            return {
                id: factionId,
                name: faction?.name || factionId,
                reputation: repValue,
                rankName,
            };
        })
        .sort((a, b) => b.reputation - a.reputation);
};