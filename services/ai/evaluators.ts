import { AIContext, TargetEvaluator, ConditionEvaluator } from './types';
// FIX: Changed import to the correct spell data source and aliased it to match existing code.
import { SPELLS as SPELL_EFFECTS } from '../../data/spells';
import { Combatant } from '../../types';
import { MARTIAL_ABILITIES } from '../../data/martialAbilities';
import { getEnemy } from '../../services/dataService';


// --- Condition Evaluators ---

/**
 * Checks if the AI combatant's health is below a certain threshold.
 * @param threshold The percentage threshold (e.g., 0.4 for 40%).
 */
export const isHealthBelow = (threshold: number): ConditionEvaluator => (context) => {
    return (context.self.currentHp / context.self.maxHp) < threshold;
};

/**
 * Checks if any ally's health is below a certain threshold.
 * @param threshold The percentage threshold.
 */
export const isAllyHealthBelow = (threshold: number): ConditionEvaluator => (context) => {
    return context.allies.some(ally => (ally.currentHp / ally.maxHp) < threshold);
};

/**
 * Checks if the AI has enough mana to cast a specific spell.
 * @param spellSlug The slug of the spell to check.
 */
export const canCastSpell = (spellSlug: string): ConditionEvaluator => (context) => {
    const spell = SPELL_EFFECTS[spellSlug];
    if (!spell || context.self.currentMana === undefined) return false;
    return context.self.currentMana >= spell.manaCost;
};

/**
 * Checks if the AI is currently under a specific status effect (by name).
 * @param effectName The name of the status effect (e.g., "Poisoned").
 */
export const hasStatusEffect = (effectName: string): ConditionEvaluator => (context) => {
    return context.self.statusEffects.some(e => e.name === effectName);
};

/**
 * A condition that always returns true, used for default actions.
 */
export const alwaysTrue: ConditionEvaluator = () => true;

/**
 * Checks if the AI combatant is disarmed.
 */
export const isDisarmed: ConditionEvaluator = (context) => {
    return context.self.statusEffects.some(e => e.type === 'DISARMED');
}

/**
 * Checks if the AI has enough stamina to use a specific martial ability.
 * @param abilityId The ID of the ability to check.
 */
export const canUseAbility = (abilityId: string): ConditionEvaluator => (context) => {
    const ability = MARTIAL_ABILITIES[abilityId];
    if (!ability || context.self.currentStamina === undefined) return false;
    return context.self.currentStamina >= ability.staminaCost;
};

// --- Target Evaluators ---

/**
 * Finds the enemy with the lowest absolute current HP.
 */
export const findLowestHpEnemy: TargetEvaluator = (context) => {
    if (context.enemies.length === 0) return [];
    const target = [...context.enemies].sort((a, b) => a.currentHp - b.currentHp)[0];
    return [target];
};

/**
 * Finds the enemy with the highest absolute current HP.
 */
export const findHighestHpEnemy: TargetEvaluator = (context) => {
    if (context.enemies.length === 0) return [];
    const target = [...context.enemies].sort((a, b) => b.currentHp - a.currentHp)[0];
    return [target];
};

/**
 * Finds the player character, if they are a valid target.
 */
export const findPlayer: TargetEvaluator = (context) => {
    const player = context.enemies.find(e => e.id === 'player');
    return player ? [player] : [];
};

/**
 * Finds an enemy that can be disarmed. Prioritizes the player.
 */
export const findDisarmableEnemy: TargetEvaluator = (context) => {
    // Defender's primary goal is to neutralize the player.
    const player = context.enemies.find(e => e.id === 'player');
    // For now, assume player is the only/primary disarmable target.
    // A more complex system could check if the player has a weapon equipped.
    return player ? [player] : [];
};


/**
 * Finds the ally (including self) with the lowest HP percentage.
 */
export const findMostInjuredAlly: TargetEvaluator = (context) => {
    if (context.allies.length === 0) return [];
    const target = [...context.allies].sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp))[0];
    return [target];
};

/**
 * Targets the AI combatant itself.
 */
export const findSelf: TargetEvaluator = (context) => {
    return [context.self];
};

/**
 * Finds a random enemy target.
 */
export const findRandomEnemy: TargetEvaluator = (context) => {
    if (context.enemies.length === 0) return [];
    const randomIndex = Math.floor(Math.random() * context.enemies.length);
    return [context.enemies[randomIndex]];
};

/**
 * Finds the source of a 'Taunted' effect.
 */
export const findTaunter = (context: AIContext): Combatant | undefined => {
    const tauntEffect = context.self.statusEffects.find(e => e.type === 'TAUNTED');
    if (tauntEffect?.sourceId) {
        return context.enemies.find(e => e.id === tauntEffect.sourceId);
    }
    return undefined;
};
