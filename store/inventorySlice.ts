import { StateCreator } from 'zustand';
// FIX: The GameStore type is defined in `types.ts`, not exported from the store module. Corrected the import path.
import { GameStore, InventorySlice, Item, EquipmentSlot, InventorySlotData, Stat, GameState } from '../types';
import { addItemToInventory, updateInventoryByQuantity } from '../lib/utils';
import { ITEM_EFFECT_REGISTRY } from '../services/itemEffectRegistry';

/**
 * Creates a slice of the store that manages all state and actions related to the player's inventory and equipment.
 * This includes adding items, using consumables, and equipping/unequipping gear.
 * @param set - Zustand's `set` function.
 * @param get - Zustand's `get` function.
 * @returns An object containing the inventory-related state and actions.
 */
export const createInventorySlice: StateCreator<GameStore, [], [], InventorySlice> = (set, get, api) => ({
    addItemToPlayerInventory: (itemToAdd: Item) => {
        set(state => {
            if (!state.player) return state;
            const { inventory: newInventory } = addItemToInventory(state.player.inventory, itemToAdd);
            return { player: { ...state.player, inventory: newInventory } };
        });
    },
    
    addItemsToPlayerInventory: (itemsToAdd) => {
        set(state => {
            if (!state.player) return state;
            let tempInventory = [...state.player.inventory];
            for (const { item, quantity } of itemsToAdd) {
                const result = updateInventoryByQuantity(tempInventory, item, quantity);
                if (result.success) {
                    tempInventory = result.inventory;
                }
            }
            return { player: { ...state.player, inventory: tempInventory } };
        });
    },

    updateInventoryAndEquipment: (inventory, equipment) => get().updatePlayer({ inventory, equipment }),

    useItem: (itemIndex: number) => {
      set(state => {
        if (!state.player) return state;
        const slotData = state.player.inventory[itemIndex];
        if (!slotData || !slotData.item.onUseEffectIds) return state;

        let finalGameState: GameState = { ...state };

        // --- LOGIC DECOUPLING ---
        // Instead of a hardcoded switch statement, we now iterate through the effect IDs
        // and execute the corresponding logic from the central registry.
        for (const effectId of slotData.item.onUseEffectIds) {
            if (ITEM_EFFECT_REGISTRY[effectId]) {
                finalGameState = ITEM_EFFECT_REGISTRY[effectId](finalGameState as GameStore);
            }
        }

        // Now, handle item consumption
        const newInventory = [...finalGameState.player!.inventory];
        const updatedSlot = { ...newInventory[itemIndex]! };
        
        if (updatedSlot.quantity > 1) {
            updatedSlot.quantity -= 1;
            newInventory[itemIndex] = updatedSlot;
        } else {
            newInventory[itemIndex] = null;
        }

        return { 
            ...finalGameState, 
            player: { 
                ...finalGameState.player!, 
                inventory: newInventory 
            } 
        };
      });
    },
    
    equipItem: (inventoryIndex: number, targetSlot: EquipmentSlot) => {
        set(state => {
            if (!state.player) return state;

            const itemToEquip = state.player.inventory[inventoryIndex]?.item;
            if (!itemToEquip || !itemToEquip.slot) return state;
            
            const isWeaponSlot = ['mainHand', 'offHand'].includes(targetSlot);
            const isCorrectSlot = itemToEquip.slot === targetSlot;
            const isWeaponInWeaponSlot = itemToEquip.type === 'weapon' && isWeaponSlot;
            
            // Allow equipping if the item's slot matches, or if it's a weapon being put in a hand slot.
            if (!isCorrectSlot && !isWeaponInWeaponSlot) {
                console.warn(`Attempted to equip ${itemToEquip.name} in wrong slot type.`);
                return state;
            }

            const newInventory = [...state.player.inventory];
            const newEquipment = { ...state.player.equipment };
            let tempInventory = [...newInventory];

            // Unequip current item in the target slot
            const currentlyEquippedItem = newEquipment[targetSlot];
            if (currentlyEquippedItem) {
                const { success, inventory: invAfterUnequip } = addItemToInventory(tempInventory, currentlyEquippedItem);
                if (!success) {
                    console.warn("Could not equip item: Not enough space to unequip current item.");
                    return state;
                }
                tempInventory = invAfterUnequip;
            }
            
            // Handle two-handed weapons
            if (itemToEquip.handedness === 'two' && targetSlot === 'mainHand') {
                const offHandItem = newEquipment['offHand'];
                if (offHandItem) {
                    const { success, inventory: invAfterOffhand } = addItemToInventory(tempInventory, offHandItem);
                     if (!success) {
                        console.warn("Could not equip two-handed weapon: Not enough space to unequip off-hand item.");
                        return state;
                    }
                    tempInventory = invAfterOffhand;
                    newEquipment['offHand'] = null;
                }
            }
            
            // Prevent equipping off-hand if main hand is two-handed
            if (targetSlot === 'offHand' && newEquipment['mainHand']?.handedness === 'two') {
                 console.warn("Cannot equip off-hand item while a two-handed weapon is equipped.");
                 return state;
            }

            // Remove item from inventory and equip it
            const originalSlotData = tempInventory[inventoryIndex];
            if (originalSlotData && originalSlotData.quantity > 1) {
                tempInventory[inventoryIndex] = { ...originalSlotData, quantity: originalSlotData.quantity - 1 };
            } else {
                tempInventory[inventoryIndex] = null;
            }
            
            newEquipment[targetSlot] = itemToEquip;

            return { player: { ...state.player, inventory: tempInventory, equipment: newEquipment } };
        });
    },

    unequipItem: (sourceSlot: EquipmentSlot) => {
        set(state => {
            if (!state.player) return state;
            
            const itemToUnequip = state.player.equipment[sourceSlot];
            if (!itemToUnequip) return state;

            const { success, inventory: newInventory } = addItemToInventory(state.player.inventory, itemToUnequip);

            if (!success) {
                console.warn("Could not unequip item: Inventory is full.");
                return state; // Inventory is full
            }

            const newEquipment = { ...state.player.equipment, [sourceSlot]: null };
            return { player: { ...state.player, inventory: newInventory, equipment: newEquipment } };
        });
    },
});