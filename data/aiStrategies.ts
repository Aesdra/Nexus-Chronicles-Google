import { Strategy, RoleBehavior, AIAction, AIContext } from '../services/ai/types';
import { 
    isHealthBelow, 
    isAllyHealthBelow,
    canCastSpell,
    canUseAbility,
    hasStatusEffect,
    alwaysTrue,
    isDisarmed,
    findLowestHpEnemy,
    findHighestHpEnemy,
    findMostInjuredAlly,
    findSelf,
    findPlayer,
    findDisarmableEnemy
} from '../services/ai/evaluators';

// --- Default Personality ---
const defaultPersonality = { aggression: 0.5, caution: 0.5, altruism: 0.5 };

// --- Reusable Action Creators ---

const createAttackAction = (self: any, target: { id: any; }): AIAction => ({ type: 'attack', targetId: target.id });
const createSpellAction = (spellSlug: string) => (self: any, target: { id: any; }): AIAction => ({ type: 'spell', spellSlug, targetId: target.id });
const createAbilityAction = (abilityId: string) => (self: any, target: { id: any; }): AIAction => ({ type: 'ability', abilityId, targetId: target.id });

// --- Individual Strategy Definitions ---

const HEAL_SELF_STRATEGY: Strategy = {
    name: 'Heal Self',
    priority: (ctx: AIContext) => 100 + ((ctx.self.personality?.caution || defaultPersonality.caution) * 20),
    condition: (context) => 
        isHealthBelow(0.4)(context) && 
        canCastSpell('cure-wounds')(context) &&
        !hasStatusEffect('Heal Cooldown')(context),
    selectTarget: findSelf,
    action: createSpellAction('cure-wounds'),
};

const HEAL_ALLY_STRATEGY: Strategy = {
    name: 'Heal Ally',
    priority: (ctx: AIContext) => 90 + ((ctx.self.personality?.altruism || defaultPersonality.altruism) * 20),
    condition: (context) =>
        isAllyHealthBelow(0.7)(context) &&
        canCastSpell('cure-wounds')(context) &&
        !hasStatusEffect('Heal Cooldown')(context),
    selectTarget: findMostInjuredAlly,
    action: createSpellAction('cure-wounds'),
};

const ATTACK_LOWEST_HP_STRATEGY: Strategy = {
    name: 'Attack Weakest',
    priority: (ctx: AIContext) => 50 + ((ctx.self.personality?.aggression || defaultPersonality.aggression) * 10),
    condition: (context) => !isDisarmed(context),
    selectTarget: findLowestHpEnemy,
    action: createAttackAction,
};

const ATTACK_PLAYER_STRATEGY: Strategy = {
    name: 'Attack Player',
    priority: (ctx: AIContext) => {
        const p = ctx.self.personality || defaultPersonality;
        return 60 + (p.aggression * 10) + (p.altruism * 5); // altruism can mean protecting allies by attacking the main threat
    },
    condition: (context) => !isDisarmed(context),
    selectTarget: findPlayer,
    action: createAttackAction,
};

const ATTACK_HIGHEST_HP_STRATEGY: Strategy = {
    name: 'Attack Strongest',
    priority: (ctx: AIContext) => 50 + ((ctx.self.personality?.aggression || defaultPersonality.aggression) * 15),
    condition: (context) => !isDisarmed(context),
    selectTarget: findHighestHpEnemy,
    action: createAttackAction,
};

const USE_POWER_STRIKE_STRATEGY: Strategy = {
    name: 'Use Power Strike',
    priority: (ctx: AIContext) => 55 + ((ctx.self.personality?.aggression || defaultPersonality.aggression) * 25),
    condition: (context) => 
        !isDisarmed(context) &&
        canUseAbility('power-strike')(context),
    selectTarget: findHighestHpEnemy,
    action: createAbilityAction('power-strike'),
};

const USE_DISARMING_STRIKE_STRATEGY: Strategy = {
    name: 'Use Disarming Strike',
    priority: (ctx: AIContext) => 65 + ((ctx.self.personality?.caution || defaultPersonality.caution) * 15),
    condition: (context) => 
        !isDisarmed(context) &&
        canUseAbility('disarming-strike')(context),
    selectTarget: findDisarmableEnemy,
    action: createAbilityAction('disarming-strike'),
};

const BASIC_ATTACK_STRATEGY: Strategy = {
    name: 'Basic Attack',
    priority: 10,
    condition: alwaysTrue,
    selectTarget: findLowestHpEnemy, // Default to lowest HP if no other strategy applies
    action: createAttackAction,
};


// --- Role Behavior Definitions ---

// The order of strategies in these arrays is no longer important, as they will be dynamically sorted by priority.
const STRIKER_BEHAVIOR: RoleBehavior = [
    HEAL_SELF_STRATEGY,
    USE_POWER_STRIKE_STRATEGY,
    ATTACK_HIGHEST_HP_STRATEGY, // Strikers focus on the biggest threat
    BASIC_ATTACK_STRATEGY,
];

const DEFENDER_BEHAVIOR: RoleBehavior = [
    HEAL_SELF_STRATEGY,
    USE_DISARMING_STRIKE_STRATEGY,
    ATTACK_PLAYER_STRATEGY, // Defenders prioritize protecting others by targeting the player
    ATTACK_LOWEST_HP_STRATEGY,
    BASIC_ATTACK_STRATEGY,
];

const SUPPORT_BEHAVIOR: RoleBehavior = [
    HEAL_ALLY_STRATEGY, // Highest priority for support
    HEAL_SELF_STRATEGY,
    ATTACK_LOWEST_HP_STRATEGY, // When not healing, picks off weak targets
    BASIC_ATTACK_STRATEGY,
];

const OPPORTUNIST_BEHAVIOR: RoleBehavior = [
    HEAL_SELF_STRATEGY,
    ATTACK_LOWEST_HP_STRATEGY, // Opportunists always go for the weakest link
    BASIC_ATTACK_STRATEGY,
];

/**
 * A record mapping each AI role to its corresponding behavior set.
 * The `aiService` uses this map to select the correct set of strategies for a combatant.
 */
export const ROLE_BEHAVIORS: Record<string, RoleBehavior> = {
    striker: STRIKER_BEHAVIOR,
    defender: DEFENDER_BEHAVIOR,
    support: SUPPORT_BEHAVIOR,
    opportunist: OPPORTUNIST_BEHAVIOR,
};