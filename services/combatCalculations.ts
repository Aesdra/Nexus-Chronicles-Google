/**
 * @file combatCalculations.ts
 * @description
 * This file contains pure utility functions for calculating combat-related values that can be
 * modified by status effects.
 *
 * This logic was extracted from `combatManager.ts` to resolve a circular dependency. The
 * `actionRegistry.ts` needs these calculation functions to resolve actions, but the
 * `combatManager.ts` also needs to import the `actionRegistry`. By placing these
 * shared functions in a separate file, both modules can import from here without issue.
 */
import { Combatant, StatusEffect, StatusEffectType } from '../types';
import { EFFECT_HANDLERS } from '../data/effects';

/**
 * Applies all passive modifiers from a combatant's status effects to a given value.
 * This function is exported so it can be used by other systems, like `actionRegistry`,
 * to calculate real-time stats during an action resolution.
 * @param initialValue The base value before modifications.
 * @param combatant The combatant whose effects should be applied.
 * @param modifierKey The key of the modifier function in EFFECT_HANDLERS to apply.
 * @returns The value after all relevant status effect modifiers have been applied.
 */
export const applyModifiers = <T>(
    initialValue: T,
    combatant: Combatant,
    modifierKey: 'modifyAttackBonus' | 'modifyArmorClass' | 'modifyDamageDealt'
): T => {
    return combatant.statusEffects.reduce((currentValue, effect) => {
        const handler = EFFECT_HANDLERS[effect.type]?.[modifierKey];
        if (handler) {
            return (handler as unknown as (value: T, effect: StatusEffect) => T)(currentValue, effect);
        }
        return currentValue;
    }, initialValue);
};

/**
 * Calculates a combatant's final Armor Class after applying all relevant status effects.
 * @param combatant The combatant to calculate for.
 * @returns The modified Armor Class.
 */
export const getModifiedArmorClass = (combatant: Combatant): number => {
    return applyModifiers(combatant.armorClass, combatant, 'modifyArmorClass');
};

/**
 * Calculates a combatant's final attack bonus after applying all relevant status effects.
 * @param combatant The combatant to calculate for.
 * @returns The modified attack bonus.
 */
export const getModifiedAttackBonus = (combatant: Combatant): number => {
    return applyModifiers(combatant.attackBonus, combatant, 'modifyAttackBonus');
};

/**
 * Calculates a combatant's final damage output after applying all relevant status effects.
 * @param combatant The combatant dealing the damage.
 * @param baseDamage The base damage object before modifications.
 * @returns The modified damage object.
 */
export const getModifiedDamage = (combatant: Combatant, baseDamage: { amount: number }): { amount: number } => {
    return applyModifiers(baseDamage, combatant, 'modifyDamageDealt');
};
