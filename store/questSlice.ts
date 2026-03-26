import { StateCreator } from 'zustand';
// FIX: The GameStore type is defined in `types.ts`, not exported from the store module. Corrected the import path.
import { GameStore, QuestSlice } from '../types';
import { QUESTS } from '../data/quests';

/**
 * Creates a slice of the store for managing quests.
 * It provides actions to start, update objectives for, and complete quests,
 * modifying the `quests` object in the main game state.
 * @param set - Zustand's `set` function.
 * @param get - Zustand's `get` function.
 * @returns An object containing the quest-related actions.
 */
export const createQuestSlice: StateCreator<GameStore, [], [], QuestSlice> = (set, get, api) => ({
    startQuest: (questId) => {
        set(state => {
            if (state.quests[questId]) return state; // Don't restart an existing quest
            const questTemplate = QUESTS[questId];
            if (!questTemplate) {
                console.warn(`Quest template with id "${questId}" not found.`);
                return state;
            }
            const newQuests = {
                ...state.quests,
                [questId]: { ...JSON.parse(JSON.stringify(questTemplate)), status: 'active' }
            };
            return { quests: newQuests };
        });
    },

    updateQuest: (questId, objectiveId, status = true) => {
        set(state => {
            const quest = state.quests[questId];
            if (!quest) {
                console.warn(`Attempted to update non-existent quest: "${questId}"`);
                return state;
            }
            const objectiveIndex = quest.objectives.findIndex(o => o.id === objectiveId);
            if (objectiveIndex === -1) {
                console.warn(`Objective "${objectiveId}" not found in quest "${questId}"`);
                return state;
            }
            const newQuests = { ...state.quests };
            newQuests[questId].objectives[objectiveIndex].isCompleted = status;
            return { quests: newQuests };
        });
    },

    completeQuest: (questId) => {
        set(state => {
            if (!state.quests[questId]) {
                console.warn(`Attempted to complete non-existent quest: "${questId}"`);
                return state;
            }
            const newQuests = { ...state.quests };
            newQuests[questId].status = 'completed';
            return { quests: newQuests };
        });
    },
});
