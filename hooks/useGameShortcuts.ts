import React, { useEffect } from 'react';
import { useModalStore } from '../store/modalStore';
import { useGameStore } from '../store/store';
import { Choice } from '../types';

/**
 * A custom hook to manage global keyboard shortcuts for the game.
 * It centralizes input logic, making it easy to manage and preventing conflicts.
 * Handles the 'Escape' key for menus and new shortcuts for modals and choices.
 * @param {boolean} showLevelUpScreen - A flag indicating if the non-modal level-up screen is active.
 * @param {Choice[]} choices - The currently available choices for the player.
 * @param {(choice: Choice) => void} onChoice - The handler to execute a choice.
 */
export const useGameShortcuts = (
    showLevelUpScreen: boolean,
    choices: Choice[],
    onChoice: (choice: Choice) => void
) => {
    const { activeModal, openModal, closeModal } = useModalStore();
    const { combatState, isLevelUpPending, companionLevelUpInfo } = useGameStore(state => ({
        combatState: state.combatState,
        isLevelUpPending: state.isLevelUpPending,
        companionLevelUpInfo: state.companionLevelUpInfo,
    }));

    useEffect(() => {
        /**
         * Handles the keydown event for global shortcuts.
         * @param {KeyboardEvent} e - The keyboard event.
         */
        const handleKeyDown = (e: KeyboardEvent) => {
            const isGameBlocked = combatState || isLevelUpPending || showLevelUpScreen || companionLevelUpInfo;
            
            // Handle Escape key for menu/modal management
            if (e.key === 'Escape') {
                if (isGameBlocked) return;
                if (activeModal) {
                    closeModal();
                } else {
                    openModal('gameMenu');
                }
                return; // Prevent other actions when Esc is pressed
            }
            
            // Disable other shortcuts if a modal is open or the game is in a blocked state
            if (activeModal || isGameBlocked) return;

            // Handle number keys for choices
            const choiceIndex = parseInt(e.key) - 1;
            if (choiceIndex >= 0 && choiceIndex < 9 && choices[choiceIndex]) {
                e.preventDefault();
                onChoice(choices[choiceIndex]);
                return;
            }

            // Handle modal shortcuts
            switch(e.key.toLowerCase()) {
                case 'i':
                    openModal('inventory');
                    break;
                case 'j':
                    openModal('journal');
                    break;
                case 'c':
                    openModal('characterSheet');
                    break;
                case 'k':
                    openModal('codex');
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Cleanup function to remove the event listener when the component unmounts.
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeModal, closeModal, openModal, combatState, isLevelUpPending, showLevelUpScreen, companionLevelUpInfo, choices, onChoice]);
};
