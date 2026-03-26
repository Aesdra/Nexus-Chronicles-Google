# Nexus Chronicles: AI System Architecture

This document outlines the design of the game's AI system, which has been refactored from a simple, hardcoded logic tree into a more robust, data-driven, and extensible architecture. The new system is inspired by concepts from both **Utility AI** and **Behavior Trees**.

## Core Philosophy

The goal is to create AI that is:
1.  **Modular:** AI logic is broken down into small, reusable pieces.
2.  **Data-Driven:** The decision-making process for an AI role is defined in a configuration file (`data/aiStrategies.ts`), not in the core engine code. This allows for easy tweaking and creation of new AI behaviors.
3.  **Extensible:** Adding new actions (like a new spell or ability) or new decision-making logic is straightforward and does not require rewriting the main AI service.
4.  **Readable:** The "intent" of an AI's behavior should be easy to understand by reading its strategy configuration.
5.  **Dynamic:** The AI's decisions should be influenced by its personality, not just a static list of priorities.

## Key Components

The system is composed of several key concepts that work together to produce a final action for an AI's turn.

### 1. `AIContext`
This is a snapshot of the current combat situation provided to the AI at the start of its turn. It contains all the information needed to make a decision:
-   `self`: The AI combatant that is currently acting. This includes its `personality` traits.
-   `allies`: A list of all friendly combatants on the field.
-   `enemies`: A list of all hostile combatants on the field.
-   `state`: The complete `CombatState` object from the game store.

### 2. Evaluators (`services/ai/evaluators.ts`)
These are small, pure functions that take an `AIContext` and return a specific piece of information. They form the building blocks of our AI's senses. There are two types:

-   **`ConditionEvaluator`**: Returns a `boolean`. Used to answer questions like "Is my health below 40%?" or "Can I cast the 'Heal' spell?".
-   **`TargetEvaluator`**: Returns an array of `Combatant`s, typically sorted by preference. Used to answer questions like "Who is the most injured ally?" or "Which enemy has the lowest health?".

### 3. Personality Traits
Defined in `types.ts`, the `Personality` object gives an AI a behavioral leaning.
```typescript
interface Personality {
    aggression: number; // 0-1, tendency to attack
    caution: number;    // 0-1, tendency to defend or heal self
    altruism: number;   // 0-1, tendency to help allies
}
```
These values are defined on NPCs in the `data` files and are used to dynamically calculate the priority of a `Strategy`.

### 4. `Strategy` (`data/aiStrategies.ts`)
A `Strategy` is a single, atomic "play" that an AI can consider. It binds together the "why," "who," and "what" of an action. Each strategy has:
-   `name`: A descriptive name (e.g., "Heal Critically Injured Ally").
-   `priority`: A **function** that takes the `AIContext` and returns a number. This is the core of the dynamic system. It allows a strategy's importance to change based on the AI's personality and the situation.
-   `condition`: A `ConditionEvaluator` function. The strategy is only considered if this returns `true`.
-   `selectTarget`: A `TargetEvaluator` function. If the condition is met, this function is called to find a valid target.
-   `action`: A function that takes the AI and the chosen target and returns a final `AIAction` object.

**Example of a Dynamic Priority:**
The priority for using a powerful attack might be calculated like this:
```typescript
priority: (ctx) => 55 + ((ctx.self.personality?.aggression || 0.5) * 25)
```
An AI with high `aggression` will give a much higher score to this strategy, making it more likely to choose it.

### 5. `RoleBehavior` (`data/aiStrategies.ts`)
A `RoleBehavior` is an array of `Strategy` objects. Each AI role (e.g., `striker`, `support`, `defender`) is assigned a `RoleBehavior`. This array defines all possible actions for that role. **The order in this array is no longer important**, as the strategies are sorted dynamically on each turn.

### 6. The AI Engine (`services/aiService.ts`)
The `getAIAction` function is the engine that drives the system. On an AI's turn, it performs the following steps:
1.  **Build Context:** Creates the `AIContext` for the current turn.
2.  **Check for Overrides:** Looks for mandatory actions, like being affected by a `Taunt`, which bypass the normal strategy evaluation.
3.  **Select Behavior:** Retrieves the `RoleBehavior` array based on the AI's role (e.g., `striker`).
4.  **Calculate & Sort:** It iterates through the behavior array, calculates the dynamic `priority` for each strategy using the current context, and then sorts the strategies from highest to lowest priority.
5.  **Execute First Valid Strategy:** It iterates through the newly **sorted** list. For the first strategy where the `condition` is met and a valid `target` is found, it generates the `action` and returns it, ending the decision process.
6.  **Fallback:** If no strategies produce a valid action, it returns a default "idle" action.

## Future Expansion & Potential Optimizations

This architecture is designed for growth. Here are some ways it can be improved:

-   **AI Blackboard:** For more complex team coordination, a shared "blackboard" object could be added to the `AIContext`, allowing AIs to communicate intent (e.g., "I am targeting the healer," "I am low on mana").
-   **Probabilistic Actions:** Instead of always picking the highest priority action, the engine could collect all valid strategies within a certain priority range and choose one based on a weighted probability, adding even more variety to AI behavior.
-   **Combat Memory:** Each AI combatant could be given a small memory object that persists for the duration of a battle, tracking data like "damage taken from player" or "times ally was healed." This would allow for more reactive and less stateless decision-making.