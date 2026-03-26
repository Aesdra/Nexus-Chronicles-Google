/**
 * @file tradeSlice.ts
 * @description
 * This file contains the Zustand slice responsible for managing the state and logic of a trade (barter) session.
 * It encapsulates all transient state related to a trade, such as player and NPC offers, and the calculated
 * value of those offers. This centralizes the complex logic of trading, making the `TradeModal` component
 * purely presentational and ensuring that the rules of bartering are consistently enforced.
 */
import { StateCreator } from 'zustand';
// FIX: The GameStore type is defined in `types.ts`, not exported from the store module. Corrected the import path.
import { GameStore, TradeSlice, TradeSession, Item, NPCData, InventorySlotData } from '../types';
import { totalCurrencyInCopper, formatCurrencyFromCopper, updateInventoryByQuantity } from '../lib/utils';
import { NPCS } from '../data/npcs';

/**
 * Calculates the value of a trade offer based on the NPC's attitude and player's faction reputation.
 * @param items - The items in the offer.
 * @param currencyInCopper - The currency in the offer (in copper).
 * @param attitude - The NPC's base attitude towards the player (0-100).
 * @param reputation - The player's reputation with the NPC's faction (-100 to 100).
 * @param type - Whether the calculation is for a 'buy' (from NPC) or 'sell' (to NPC) price.
 * @returns The total calculated value of the offer in copper pieces.
 */
const calculateOfferValue = (items: InventorySlotData[], currencyInCopper: number, attitude: number, reputation: number, type: 'buy' | 'sell'): number => {
    // Attitude provides a disposition modifier (e.g., up to +/- 25%)
    const attitudeModifier = (attitude / 100) * 0.25; 
    // Reputation provides another disposition modifier (e.g., up to +/- 25%)
    const reputationModifier = (reputation / 100) * 0.25;
    // Total modifier can swing prices significantly, capped at +/- 50%
    const totalModifier = Math.max(-0.5, Math.min(0.5, attitudeModifier + reputationModifier));

    let itemsValue = items.reduce((total, slot) => {
        const item = slot.item;
        const quantity = slot.quantity;
        if (type === 'buy') {
            // Player is buying from NPC, a positive modifier gives a discount
            return total + Math.floor(item.value * quantity * (1 - totalModifier));
        } else {
            // Player is selling to NPC, a positive modifier gives a better price
            const baseSellPrice = item.value / 2; // Base sell price is half the value
            return total + Math.floor(baseSellPrice * quantity * (1 + totalModifier));
        }
    }, 0);

    return itemsValue + currencyInCopper;
};

/**
 * Creates a slice of the store for managing an active trade session.
 * @param set - Zustand's `set` function.
 * @param get - Zustand's `get` function.
 * @returns An object containing the trade-related state and actions.
 */
export const createTradeSlice: StateCreator<GameStore, [], [], TradeSlice> = (set, get, api) => ({
    startTradeSession: (npc) => {
        get().ensureNpcState(npc.id);
        const newSession: TradeSession = {
            npcId: npc.id,
            playerOffer: { items: [], currency: { gp: 0, sp: 0, cp: 0 } },
            npcOffer: { items: [], currency: { gp: 0, sp: 0, cp: 0 } },
            playerValue: 0,
            npcValue: 0,
        };
        set({ tradeSession: newSession });
    },
    endTradeSession: () => set({ tradeSession: null }),

    // A helper to update values whenever an offer changes
    _recalculateValues: () => {
        set(state => {
            if (!state.tradeSession || !state.player) return state;
            const npcId = state.tradeSession.npcId;
            const npcFactionId = NPCS[npcId]?.factionId;
            const attitude = state.npcState[npcId]?.attitude || 0;
            const reputation = (npcFactionId && state.player.reputation[npcFactionId]) || 0;

            const newPlayerValue = calculateOfferValue(state.tradeSession.playerOffer.items, totalCurrencyInCopper(state.tradeSession.playerOffer.currency), attitude, reputation, 'sell');
            const newNpcValue = calculateOfferValue(state.tradeSession.npcOffer.items, totalCurrencyInCopper(state.tradeSession.npcOffer.currency), attitude, reputation, 'buy');
            return {
                tradeSession: {
                    ...state.tradeSession,
                    playerValue: newPlayerValue,
                    npcValue: newNpcValue,
                }
            };
        });
    },

    addItemToPlayerOffer: (item, quantity) => {
        set(state => {
            if (!state.tradeSession) return state;
            const newOfferItems = [...state.tradeSession.playerOffer.items];
            const existingItemIndex = newOfferItems.findIndex(slot => slot.item.id === item.id);

            if (existingItemIndex > -1) {
                newOfferItems[existingItemIndex].quantity += quantity;
            } else {
                newOfferItems.push({ item, quantity });
            }

            return {
                tradeSession: {
                    ...state.tradeSession,
                    playerOffer: {
                        ...state.tradeSession.playerOffer,
                        items: newOfferItems,
                    }
                }
            };
        });
        get()._recalculateValues();
    },

    removeItemFromPlayerOffer: (itemIndex, quantity) => {
        set(state => {
            if (!state.tradeSession) return state;
            const newItems = [...state.tradeSession.playerOffer.items];
            const slot = newItems[itemIndex];
            if (!slot) return state;

            if (quantity === undefined || quantity >= slot.quantity) {
                // Remove the whole stack
                newItems.splice(itemIndex, 1);
            } else {
                // Reduce quantity
                newItems[itemIndex] = { ...slot, quantity: slot.quantity - quantity };
            }
            
            return {
                tradeSession: {
                    ...state.tradeSession,
                    playerOffer: {
                        ...state.tradeSession.playerOffer,
                        items: newItems,
                    }
                }
            };
        });
        get()._recalculateValues();
    },

    addItemToNpcOffer: (item, quantity) => {
        set(state => {
            if (!state.tradeSession) return state;
            const newOfferItems = [...state.tradeSession.npcOffer.items];
            const existingItemIndex = newOfferItems.findIndex(slot => slot.item.id === item.id);
            
            if (existingItemIndex > -1) {
                newOfferItems[existingItemIndex].quantity += quantity;
            } else {
                newOfferItems.push({ item, quantity });
            }

            return {
                tradeSession: {
                    ...state.tradeSession,
                    npcOffer: {
                        ...state.tradeSession.npcOffer,
                        items: newOfferItems,
                    }
                }
            };
        });
        get()._recalculateValues();
    },

    removeItemFromNpcOffer: (itemIndex, quantity) => {
        set(state => {
            if (!state.tradeSession) return state;
            const newItems = [...state.tradeSession.npcOffer.items];
            const slot = newItems[itemIndex];
            if (!slot) return state;

            if (quantity === undefined || quantity >= slot.quantity) {
                // Remove the whole stack
                newItems.splice(itemIndex, 1);
            } else {
                // Reduce quantity
                newItems[itemIndex] = { ...slot, quantity: slot.quantity - quantity };
            }

            return {
                tradeSession: {
                    ...state.tradeSession,
                    npcOffer: {
                        ...state.tradeSession.npcOffer,
                        items: newItems,
                    }
                }
            };
        });
        get()._recalculateValues();
    },

    updatePlayerOfferCurrency: (currency) => {
        set(state => {
            if (!state.tradeSession) return state;
            return {
                tradeSession: {
                    ...state.tradeSession,
                    playerOffer: { ...state.tradeSession.playerOffer, currency }
                }
            };
        });
        get()._recalculateValues();
    },

    updateNpcOfferCurrency: (currency) => {
        set(state => {
            if (!state.tradeSession) return state;
            return {
                tradeSession: {
                    ...state.tradeSession,
                    npcOffer: { ...state.tradeSession.npcOffer, currency }
                }
            };
        });
        get()._recalculateValues();
    },

    clearOffers: () => {
        set(state => {
            if (!state.tradeSession) return state;
            return {
                tradeSession: {
                    ...state.tradeSession,
                    playerOffer: { items: [], currency: { gp: 0, sp: 0, cp: 0 } },
                    npcOffer: { items: [], currency: { gp: 0, sp: 0, cp: 0 } },
                }
            };
        });
        get()._recalculateValues();
    },

    finalizeTrade: () => {
        const { tradeSession, player, npcState } = get();
        if (!tradeSession || !player) return;

        const playerOfferCopper = totalCurrencyInCopper(tradeSession.playerOffer.currency);
        const npcOfferCopper = totalCurrencyInCopper(tradeSession.npcOffer.currency);

        // --- ROBUST VALIDATION ---
        // 1. Validate player has enough currency.
        if (totalCurrencyInCopper(player.currency) < playerOfferCopper) {
            console.error("Trade failed: Player does not have enough currency.");
            return;
        }
        // 2. Validate player has the offered items.
        const playerItemCounts = player.inventory.reduce((acc, slot) => {
            if(slot) acc[slot.item.id] = (acc[slot.item.id] || 0) + slot.quantity;
            return acc;
        }, {} as Record<string, number>);

        for (const slot of tradeSession.playerOffer.items) {
            if (!playerItemCounts[slot.item.id] || playerItemCounts[slot.item.id] < slot.quantity) {
                console.error(`Trade failed: Player does not have enough of '${slot.item.name}'. Have ${playerItemCounts[slot.item.id] || 0}, need ${slot.quantity}`);
                return;
            }
        }
        
        // --- If validation passes, proceed with the trade ---
        set(state => {
            let newPlayer = { ...state.player! };
            let newNpcInv = [...(state.npcState[tradeSession.npcId].inventory || [])];
            let tempPlayerInv = [...newPlayer.inventory];

            // 1. Exchange items
            tradeSession.playerOffer.items.forEach(slot => {
                const result = updateInventoryByQuantity(tempPlayerInv, slot.item, -slot.quantity);
                if (result.success) tempPlayerInv = result.inventory;
            });
            tradeSession.npcOffer.items.forEach(slot => {
                const result = updateInventoryByQuantity(tempPlayerInv, slot.item, slot.quantity);
                if (result.success) tempPlayerInv = result.inventory;
            });
            newPlayer.inventory = tempPlayerInv;

            // 3. Exchange currency
            const playerTotalCopper = totalCurrencyInCopper(newPlayer.currency);
            const newPlayerTotalCopper = playerTotalCopper - playerOfferCopper + npcOfferCopper;
            newPlayer.currency = formatCurrencyFromCopper(newPlayerTotalCopper);
            
            // 4. Update NPC inventory
            tradeSession.npcOffer.items.forEach(slot => {
                const stockItem = newNpcInv.find(i => i.itemId === slot.item.id);
                if (stockItem && stockItem.stock !== -1) stockItem.stock -= slot.quantity;
            });
            tradeSession.playerOffer.items.forEach(slot => {
                const stockItem = newNpcInv.find(i => i.itemId === slot.item.id);
                if (stockItem && stockItem.stock !== -1) stockItem.stock += slot.quantity;
                else if (!stockItem) newNpcInv.push({ itemId: slot.item.id, stock: slot.quantity });
            });

            const newNpcState = { 
                ...state.npcState, 
                [tradeSession.npcId]: { 
                    ...state.npcState[tradeSession.npcId], 
                    inventory: newNpcInv.filter(item => item.stock !== 0), 
                } 
            };
            
            get().endTradeSession(); // Finalize and close session
            return { player: newPlayer, npcState: newNpcState };
        });
    },
});