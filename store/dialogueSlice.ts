
import { StateCreator } from 'zustand';
import { GameStore, DialogueSlice } from '../types';
import { EFFECT_REGISTRY } from '../services/effectRegistry';

export const createDialogueSlice: StateCreator<GameStore, [], [], DialogueSlice> = (set, get, api) => ({
    activeDialogue: null,
    currentDialogueNode: null,

    startDialogue: (dialogue) => {
        set({ 
            activeDialogue: dialogue,
            currentDialogueNode: dialogue.rootNode
        });
    },

    advanceDialogue: (choice) => {
        const { activeDialogue } = get();
        
        // execute effect if present
        if (choice.effectId && EFFECT_REGISTRY[choice.effectId]) {
            set(state => EFFECT_REGISTRY[choice.effectId!](state));
        }

        if (choice.nextNode) {
            set({ currentDialogueNode: choice.nextNode });
        } else {
            // End of conversation
            get().endDialogue();
        }
    },

    endDialogue: () => {
        const { activeDialogue } = get();
        if (activeDialogue && activeDialogue.isOneTime) {
            set(state => ({
                readDialogueIds: [...(state.readDialogueIds || []), activeDialogue.id]
            }));
        }
        set({ activeDialogue: null, currentDialogueNode: null });
    }
});
