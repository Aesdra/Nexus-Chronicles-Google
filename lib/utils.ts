import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Item, InventorySlotData } from "../types";
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function markdownToHtml(text: string): string {
  // This is a simplified markdown-to-HTML converter that mimics the styling from MarkdownRenderer.
  // It handles paragraphs (separated by double newlines) and inline bold/italic.
  const paragraphs = text.split('\n\n');

  const rawHtml = paragraphs.map(p => {
    // Process inline markdown within each paragraph
    const inlineProcessed = p
      // Bold: **text** -> <strong>...</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-amber-200">$1</strong>')
      // Italic: *text* -> <em>...</em>
      .replace(/\*(.*?)\*/g, '<em class="italic text-amber-100/90">$1</em>');
    
    // Wrap in a paragraph tag and handle single newlines as <br>
    return `<p class="mb-4 last:mb-0">${inlineProcessed.replace(/\n/g, '<br />')}</p>`;
  }).join('');
  
  // Sanitize the generated HTML to prevent XSS attacks, but allow the classes we use for styling.
  return DOMPurify.sanitize(rawHtml, { 
    ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
    ALLOWED_ATTR: ['class'] 
  });
}

export const totalCurrencyInCopper = (currency: { gp: number, sp: number, cp: number }): number => {
    return (currency.gp * 100) + (currency.sp * 10) + currency.cp;
}

/**
 * Converts a total number of copper pieces into an object of gp, sp, and cp.
 * @param totalCopper The total value in copper.
 * @returns An object with gp, sp, and cp values.
 */
export function formatCurrencyFromCopper(totalCopper: number): { gp: number; sp: number; cp: number } {
  const gp = Math.floor(totalCopper / 100);
  const remainder = totalCopper % 100;
  const sp = Math.floor(remainder / 10);
  const cp = remainder % 10;
  return { gp, sp, cp };
}

export const addItemToInventory = (inventory: (InventorySlotData | null)[], itemToAdd: Item): { success: boolean, inventory: (InventorySlotData | null)[] } => {
    const newInventory: (InventorySlotData | null)[] = JSON.parse(JSON.stringify(inventory));

    // If item is stackable, try to add to an existing stack
    if (itemToAdd.stackable) {
        for (let i = 0; i < newInventory.length; i++) {
            const slot = newInventory[i];
            if (slot && slot.item.id === itemToAdd.id && slot.quantity < (slot.item.maxStackSize || 99)) {
                slot.quantity += 1;
                return { success: true, inventory: newInventory };
            }
        }
    }

    // If no stack found (or item is not stackable), find an empty slot
    const emptySlotIndex = newInventory.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
        newInventory[emptySlotIndex] = { item: itemToAdd, quantity: 1 };
        return { success: true, inventory: newInventory };
    }
    
    console.warn(`Inventory is full. Could not add item: ${itemToAdd.name}`);
    return { success: false, inventory: inventory }; // Return original inventory on failure
};


/**
 * Updates an inventory by adding or removing a specific quantity of an item.
 * This is more robust than addItemToInventory for handling stack logic.
 * @param inventory The inventory to modify.
 * @param itemToUpdate The item to add or remove.
 * @param quantityDelta Positive to add, negative to remove.
 * @returns An object with the result of the operation and the new inventory state.
 */
export const updateInventoryByQuantity = (
  inventory: (InventorySlotData | null)[],
  itemToUpdate: Item,
  quantityDelta: number
): { success: boolean; inventory: (InventorySlotData | null)[] } => {
  const newInventory = JSON.parse(JSON.stringify(inventory));

  if (quantityDelta > 0) {
    // ADDING ITEMS
    let remainingToAdd = quantityDelta;
    // 1. Try to add to existing stacks
    if (itemToUpdate.stackable) {
      for (let i = 0; i < newInventory.length && remainingToAdd > 0; i++) {
        const slot = newInventory[i];
        if (slot && slot.item.id === itemToUpdate.id) {
          const canAdd = (slot.item.maxStackSize || 99) - slot.quantity;
          const toAdd = Math.min(remainingToAdd, canAdd);
          if (toAdd > 0) {
            slot.quantity += toAdd;
            remainingToAdd -= toAdd;
          }
        }
      }
    }
    // 2. Fill empty slots
    while (remainingToAdd > 0) {
      const emptySlotIndex = newInventory.findIndex((slot: InventorySlotData | null) => slot === null);
      if (emptySlotIndex === -1) {
        console.warn(`Inventory is full. Could not add ${remainingToAdd} of ${itemToUpdate.name}`);
        return { success: false, inventory: inventory }; // Return original on partial failure
      }
      const toAdd = itemToUpdate.stackable ? Math.min(remainingToAdd, itemToUpdate.maxStackSize || 99) : 1;
      newInventory[emptySlotIndex] = { item: itemToUpdate, quantity: toAdd };
      remainingToAdd -= toAdd;
      if (!itemToUpdate.stackable) {
        // If not stackable, repeat loop for next item
      }
    }
    return { success: true, inventory: newInventory };
  } else if (quantityDelta < 0) {
    // REMOVING ITEMS
    let remainingToRemove = Math.abs(quantityDelta);
    // Remove from stacks, starting from the end to handle partial stacks correctly
    for (let i = newInventory.length - 1; i >= 0 && remainingToRemove > 0; i--) {
      const slot = newInventory[i];
      if (slot && slot.item.id === itemToUpdate.id) {
        const toRemove = Math.min(remainingToRemove, slot.quantity);
        slot.quantity -= toRemove;
        remainingToRemove -= toRemove;
        if (slot.quantity <= 0) {
          newInventory[i] = null;
        }
      }
    }
    if (remainingToRemove > 0) {
      console.error(`Could not find enough items to remove: ${remainingToRemove} of ${itemToUpdate.name}`);
      return { success: false, inventory: inventory }; // Return original if not enough items found
    }
    return { success: true, inventory: newInventory };
  }

  return { success: true, inventory: newInventory }; // No change
};