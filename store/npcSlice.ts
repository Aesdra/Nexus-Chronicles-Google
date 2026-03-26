import { StateCreator } from 'zustand';
// FIX: The GameStore type is defined in `types.ts`, not exported from the store module. Corrected the import path.
import { GameStore, NpcSlice } from '../types';
import { getNpcData } from '../services/dataService';
import { formatCurrencyFromCopper, totalCurrencyInCopper, addItemToInventory } from '../lib/utils';

/**
 * Creates a slice of the store for managing dynamic NPC state.
 * This includes ensuring an NPC's state (like inventory and attitude) is initialized.
 * The logic for handling active trade sessions has been moved to `tradeSlice.ts`.
 * @param set - Zustand's `set` function.
 * @param get - Zustand's `get` function.
 * @returns An object containing the NPC-related actions.
 */
export const createNpcSlice: StateCreator<GameStore, [], [], NpcSlice> = (set, get, api) => ({
    ensureNpcState: (npcId) => {
        set(state => {
            if (state.npcState[npcId]) return state;
            const npcData = getNpcData(npcId);
            if (!npcData) return state;
            
            const newNpcState = { 
                ...state.npcState, 
                [npcId]: { 
                    inventory: JSON.parse(JSON.stringify(npcData.inventory || [])), 
                    attitude: npcData.attitude || 0, 
                } 
            };
            return { npcState: newNpcState };
        });
    },
});
