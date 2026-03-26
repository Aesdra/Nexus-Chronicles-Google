import { Combatant, StatusEffect, CombatEvent, StatusEffectType, LogType } from '../types';

/**
 * Defines the modular logic for different types of status effects.
 * Each handler can modify combat calculations or trigger events during a combatant's turn.
 */
interface EffectHandlers {
    /**
     * Triggers at the start or end of a combatant's turn, based on the effect's 'trigger' property.
     * @returns An object containing the updated target and any new events to be processed (e.g., damage events).
     */
    onTurnTick?: (target: Combatant, effect: StatusEffect) => { updatedTarget: Combatant, events: CombatEvent[] };
    
    // --- Passive Modifiers ---
    /**
     * Modifies a combatant's attack bonus before an attack roll.
     * @returns The new attack bonus.
     */
    modifyAttackBonus?: (bonus: number, effect: StatusEffect) => number;

    /**
     * Modifies a combatant's Armor Class.
     * @returns The new Armor Class.
     */
    modifyArmorClass?: (ac: number, effect: StatusEffect) => number;
    
    /**
     * Modifies the damage amount of a combatant's attack.
     * @returns An object with the new damage amount.
     */
    modifyDamageDealt?: (damage: { amount: number }, effect: StatusEffect) => { amount: number };
}

/**
 * A central registry mapping each StatusEffectType to its corresponding logic handlers.
 * This modular system allows new effects to be added without altering the core combat engine.
 */
export const EFFECT_HANDLERS: Record<StatusEffectType, EffectHandlers> = {
    DAMAGE_OVER_TIME: {
        onTurnTick: (target, effect) => {
            const events: CombatEvent[] = [];
            if (effect.damage) {
                // Generate a new ATTACK_RESOLVED event for the damage tick.
                // This ensures damage over time is properly logged and processed by the event queue.
                events.push({
                    type: 'ATTACK_RESOLVED',
                    sourceId: effect.sourceId || 'environment',
                    targetId: target.id,
                    hit: true, // Damage over time always hits.
                    damage: effect.damage.amount,
                    damageType: effect.damage.type,
                    abilityId: effect.name // Use effect name for logging purposes.
                });
            }
            return { updatedTarget: target, events };
        }
    },
    ATTACK_BUFF: {
        modifyAttackBonus: (bonus, effect) => bonus + (effect.bonus || 0),
    },
    ATTACK_DEBUFF: {
        modifyAttackBonus: (bonus, effect) => bonus - (effect.bonus || 0),
    },
    ARMOR_BUFF: {
        modifyArmorClass: (ac, effect) => ac + (effect.bonus || 0),
    },
    ARMOR_DEBUFF: {
        modifyArmorClass: (ac, effect) => ac - (effect.bonus || 0),
    },
    STUNNED: {
        // Stun is a special-cased control effect handled directly in the TURN_START event logic.
        // It prevents the AI from choosing an action and skips the player's turn.
    },
    TAUNTED: {
        // Taunt is a special-cased control effect handled by the AI targeting service.
        // It forces the AI to target the source of the taunt.
    },
    DISARMED: {
        // Reduces outgoing damage by a multiplier.
        modifyDamageDealt: (damage, effect) => {
            // This effect's 'bonus' is treated as a direct multiplier for damage.
            // e.g., a bonus of 0.5 results in 50% damage.
            return { amount: Math.floor(damage.amount * (effect.bonus !== undefined ? effect.bonus : 0.5)) };
        }
    },
    SLOWED: {
        // Applies a penalty to Armor Class.
        modifyArmorClass: (ac, effect) => ac - (effect.bonus || 0),
    },
    MAX_HP_BUFF: {
        // Logic for max HP buff if needed, currently placeholder or handled by game logic
    }
};