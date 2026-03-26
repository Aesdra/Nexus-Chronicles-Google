/**
 * @file itemEffectRegistry.ts
 * @description
 * This file serves as a centralized registry for all game logic effects that can be triggered
 * when a consumable item is used. By decoupling the logic from the item data in `data/items.ts`,
 * we create a scalable, data-driven system.
 *
 * The `ITEM_EFFECT_REGISTRY` object maps a unique string identifier (e.g., 'HEAL_25_HP')
 * to a function that takes the current `GameState` and returns the modified `GameState`.
 * The inventory system (`store/inventorySlice.ts`) uses this registry to execute effects based on the
 * `onUseEffectIds` property in an item's data.
 */
import { GameState } from '../types';

type EffectFunction = (gameState: GameState) => GameState;

export const ITEM_EFFECT_REGISTRY: Record<string, EffectFunction> = {
    'HEAL_25_HP': (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player };
        newPlayer.stats.hp = Math.min(newPlayer.stats.maxHp, newPlayer.stats.hp + 25);
        return { ...gameState, player: newPlayer };
    },
    'RESTORE_20_MANA': (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player };
        newPlayer.stats.mana = Math.min(newPlayer.stats.maxMana, newPlayer.stats.mana + 20);
        return { ...gameState, player: newPlayer };
    },
    'RESTORE_15_STAMINA': (gameState) => {
        if (!gameState.player) return gameState;
        const newPlayer = { ...gameState.player };
        newPlayer.stats.stamina = Math.min(newPlayer.stats.maxStamina, newPlayer.stats.stamina + 15);
        return { ...gameState, player: newPlayer };
    },
};