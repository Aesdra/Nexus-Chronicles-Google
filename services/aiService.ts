import { Combatant, CombatState } from '../types';
import { getEnemy, getAlly } from './dataService';
import { AIContext, AIAction } from './ai/types';
import { ROLE_BEHAVIORS } from '../data/aiStrategies';
import { findTaunter } from './ai/evaluators';
import { COMPANIONS } from '../data/companions';

/**
 * Determines the next action for an AI-controlled combatant using a dynamic,
 * role-based, strategy-driven system. This replaces the previous hardcoded logic.
 * 
 * The process is as follows:
 * 1. Build a context object (`AIContext`) containing all relevant information for decision-making.
 * 2. Check for overriding conditions, such as being taunted, which force a specific action.
 * 3. Select the appropriate behavior set (an array of strategies) based on the combatant's role.
 * 4. Dynamically calculate the priority of each strategy based on the AI's personality and the current context.
 * 5. Sort the strategies by their calculated priority in descending order.
 * 6. Iterate through the sorted strategies. For the first valid one (condition met and target found), generate and return the action.
 * 7. If no strategy yields a valid action, return a default 'idle' action.
 * 
 * @param combatant The AI combatant taking the turn.
 * @param state The current state of the combat.
 * @returns A promise that resolves to an AIAction object.
 */
export const getAIAction = async (combatant: Combatant, state: CombatState): Promise<AIAction> => {
    // 1. Build Context
    const isPlayerTeam = combatant.type === 'player' || combatant.type === 'companion';
    
    const allies = isPlayerTeam
        ? state.combatants.filter(c => !c.isDefeated && (c.type === 'player' || c.type === 'companion'))
        : state.combatants.filter(c => !c.isDefeated && c.type === 'enemy');

    const enemies = isPlayerTeam
        ? state.combatants.filter(c => !c.isDefeated && c.type === 'enemy')
        : state.combatants.filter(c => !c.isDefeated && (c.type === 'player' || c.type === 'companion'));

    const context: AIContext = {
        self: combatant,
        allies: allies,
        enemies: enemies,
        state: state
    };


    // 2. Handle Forced Actions (e.g., Taunt)
    const taunter = findTaunter(context);
    if (taunter) {
        return { type: 'attack', targetId: taunter.id };
    }

    // 3. Get Behavior Set
    let role = 'opportunist'; // Default role
    if (combatant.type === 'enemy') {
        role = getEnemy(combatant.originalId!)?.stats.role || 'opportunist';
    } else if (combatant.type === 'companion') {
        const mainCompanionData = COMPANIONS[combatant.originalId!];
        if (mainCompanionData) {
            role = mainCompanionData.role || 'opportunist';
        } else {
            const allyData = getAlly(combatant.originalId!);
            role = allyData?.stats.role || 'opportunist';
        }
    }

    const behavior = ROLE_BEHAVIORS[role];

    if (!behavior) {
        console.warn(`No behavior defined for role: ${role}. Defaulting to basic attack.`);
        const defaultTarget = context.enemies[0];
        return defaultTarget ? { type: 'attack', targetId: defaultTarget.id } : { type: 'idle' };
    }

    // 4. Calculate dynamic priorities and sort strategies
    const sortedBehavior = behavior
        .map(strategy => ({
            strategy,
            // Calculate priority, whether it's a number or a function
            priority: typeof strategy.priority === 'function' ? strategy.priority(context) : strategy.priority,
        }))
        .sort((a, b) => b.priority - a.priority)
        .map(item => item.strategy);

    // 5. Evaluate Sorted Strategies
    for (const strategy of sortedBehavior) {
        if (strategy.condition(context)) {
            const potentialTargets = strategy.selectTarget(context);
            if (potentialTargets.length > 0) {
                const target = potentialTargets[0];
                console.log(`AI '${combatant.name}' chose strategy '${strategy.name}' targeting '${target.name}'`);
                return strategy.action(context.self, target);
            }
        }
    }

    // 6. Default Action
    console.warn(`AI '${combatant.name}' (Role: ${role}) found no valid action. Idling.`);
    return { type: 'idle' };
};