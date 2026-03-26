


import { create } from 'zustand';
import { ModalType, ModalPayloads, NPCData } from '../types';

/**
 * Defines the shape of the state for the modal store.
 */
interface ModalState {
  /** The identifier of the currently active modal, or null if none are open. */
  activeModal: ModalType | null;
  /** The current mode for the save/load modal ('save' or 'load'). */
  saveLoadMode: 'save' | 'load';
  /** The NPC data required for the trade modal. */
  tradeNpc: NPCData | null;
  /** The NPC data required for the dice game modal. */
  diceNpc: NPCData | null;
  /** The file object to be analyzed by the analysis modal. */
  analysisFile: File | null;
  /** A simple counter to trigger the file input from anywhere in the app. */
  analysisFileInputTrigger: number;
}

/**
 * Defines the actions available to manipulate the modal state.
 */
interface ModalActions {
  /**
   * Opens a modal of a specific type.
   * @param modal The type of modal to open.
   * @param payload Optional data required by certain modals (e.g., trade NPC, save/load mode).
   */
  openModal: <T extends ModalType>(modal: T, payload?: T extends keyof ModalPayloads ? ModalPayloads[T] : never) => void;
  /** Closes any currently active modal and resets associated data. */
  closeModal: () => void;
  /** Increments the trigger counter to activate the hidden file input for item analysis. */
  triggerAnalysisFileInput: () => void;
}

/**
 * A Zustand store dedicated to managing the state of all UI modals.
 * This centralizes modal logic, making it easy to open, close, and manage
 * modals from any component in the application without prop drilling.
 */
export const useModalStore = create<ModalState & ModalActions>((set) => ({
  // Initial State
  activeModal: null,
  saveLoadMode: 'save',
  tradeNpc: null,
  diceNpc: null,
  analysisFile: null,
  analysisFileInputTrigger: 0,

  // Actions
  openModal: (modal, payload) => {
    set(state => {
      const newState: Partial<ModalState> = { activeModal: modal };
      // Handle payload for specific modals
      if (modal === 'saveLoad' && payload) {
        newState.saveLoadMode = (payload as ModalPayloads['saveLoad']).mode;
      }
      if (modal === 'trade' && payload) {
        newState.tradeNpc = (payload as ModalPayloads['trade']).npc;
      }
      if (modal === 'diceGame' && payload) {
        newState.diceNpc = (payload as ModalPayloads['diceGame']).npc;
      }
      if (modal === 'analysis' && payload) {
        newState.analysisFile = (payload as ModalPayloads['analysis']).file;
      }
      return newState;
    });
  },

  closeModal: () => {
    // Reset all modal-specific data when closing
    set({ activeModal: null, tradeNpc: null, diceNpc: null, analysisFile: null });
  },
  
  triggerAnalysisFileInput: () => set(state => ({ analysisFileInputTrigger: state.analysisFileInputTrigger + 1 })),
}));
