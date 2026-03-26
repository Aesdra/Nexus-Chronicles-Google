/**
 * @file inventorySelectors.ts
 * @description
 * This module contains selector functions for the Zustand store, focused on accessing
 * and processing data related to the player's inventory and equipment. These selectors
 * provide a clean, reusable, and centralized way for components to get the item data
 * they need without needing to know the underlying state structure.
 */
import { GameStore, InventorySlotData } from '../../types';

/** Selects the player's entire inventory array. */
export const selectInventory = (state: GameStore) => state.player?.inventory || [];

/** Selects the player's entire equipment record. */
export const selectEquipment = (state: GameStore) => state.player?.equipment || {};

/**
 * Selects and filters only the consumable items from the player's inventory.
 * This is useful for UI elements like the item selection menu in combat.
 * @param state The global GameStore state.
 * @returns An array of objects, where each object contains the inventory slot data
 *          and its original index in the inventory array.
 */
export const selectConsumableItems = (state: GameStore): { slot: InventorySlotData, index: number }[] => {
    if (!state.player) return [];
    return state.player.inventory
        .map((slot, index) => ({ slot, index }))
        .filter((data): data is { slot: InventorySlotData, index: number } => 
            !!data.slot && data.slot.item.type === 'consumable'
        );
};