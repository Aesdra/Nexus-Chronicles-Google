/**
 * @file questSelectors.ts
 * @description
 * This module provides selector functions for the Zustand store, specifically for querying
 * the player's quest log. By centralizing the filtering logic here, we ensure that any
 * component needing to display active or completed quests can do so easily and consistently,
 * without duplicating filtering logic.
 */
import { GameStore, Quest } from '../../types';

/**
 * Selects all quests with the status 'active'.
 * The result of this selector is an array, so components using it will re-render if the
 * array's contents or length change.
 * @param state The global GameStore state.
 * @returns An array of active Quest objects.
 */
export const selectActiveQuests = (state: GameStore): Quest[] => {
    return Object.values(state.quests).filter((q: Quest) => q.status === 'active');
};

/**
 * Selects all quests with the status 'completed'.
 * @param state The global GameStore state.
 * @returns An array of completed Quest objects.
 */
export const selectCompletedQuests = (state: GameStore): Quest[] => {
    return Object.values(state.quests).filter((q: Quest) => q.status === 'completed');
};