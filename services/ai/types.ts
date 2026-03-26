import { Combatant, CombatState, Personality } from '../../types';

/**
 * Provides a snapshot of the current combat situation for AI decision-making.
 * This context is passed to all evaluator functions.
 */
export interface AIContext {
    self: Combatant;
    allies: Combatant[];
    enemies: Combatant[];
    state: CombatState;
}

/**
 * An evaluator function that returns a list of potential targets based on the context.
 * The list is typically ordered by preference.
 * @param context The current AI context.
 * @returns An array of `Combatant` objects.
 */
export type TargetEvaluator = (context: AIContext) => Combatant[];

/**
 * An evaluator function that returns a boolean, representing whether a certain condition is true.
 * @param context The current AI context.
 * @returns A boolean value.
 */
export type ConditionEvaluator = (context: AIContext) => boolean;

/**
 * Defines a single, atomic piece of AI logic. It contains a condition to check,
 * a way to select a target, the action to perform, and a priority level.
 */
export interface Strategy {
    name: string;
    // Condition to check if this strategy is viable.
    condition: ConditionEvaluator;
    // Function to select a target (or targets).
    selectTarget: TargetEvaluator;
    // The action to perform on the selected target.
    action: (self: Combatant, target: Combatant) => AIAction;
    // Priority of this strategy. Can be a static number or a function that calculates a dynamic priority.
    priority: ((context: AIContext) => number) | number;
}

/**
 * Represents the final decision made by the AI for its turn.
 */
export type AIAction = 
  | { type: 'attack', targetId: string }
  | { type: 'spell', spellSlug: string, targetId: string }
  | { type: 'ability', abilityId: string, targetId: string }
  | { type: 'idle' };

/**
 * A `RoleBehavior` is an array of strategies, ordered by priority, that defines
 * the complete decision-making process for an AI role.
 */
export type RoleBehavior = Strategy[];
