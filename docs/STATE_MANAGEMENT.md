# Nexus Chronicles: State Management Architecture (Zustand)

This document provides a detailed overview of the global state management strategy used in *Nexus Chronicles*, built upon the **Zustand** library. The architecture is designed to be modular, scalable, and performant.

## Core Philosophy

1.  **Single Source of Truth:** A single, global Zustand store holds the entire `GameState`. This prevents data synchronization issues and provides a unified view of the application's state at any given moment.
2.  **Modularity via Slices:** The store is not a monolithic object. Its logic and state are broken down into "slices," where each slice is responsible for a specific domain of the game (e.g., player, inventory, quests). This makes the codebase easier to navigate, maintain, and test.
3.  **Decoupling with Selectors:** Components do not access the raw state object directly. Instead, they use **selectors**—small, reusable functions—to extract or compute the specific data they need. This decouples components from the shape of the state, making future refactoring much safer and easier.
4.  **Performance Optimization:** Selectors, combined with Zustand's `shallow` comparison function, are used to prevent unnecessary re-renders, ensuring the UI remains snappy and responsive.

## I. The Store Structure

### 1. The Main Store (`store/store.ts`)

This file is the entry point for our state. It uses Zustand's `create` function to initialize the store and combines all the different slices into one cohesive whole.

```typescript
// store/store.ts
export const useGameStore = create<GameStore>()((set, get) => ({
    // ... initial state properties ...

    // ... combined actions and state from all slices ...
    ...createGameSlice(set, get),
    ...createPlayerSlice(set, get),
    // ... etc.
}));
```

### 2. Slices (`store/*.ts`)

Each slice is a separate file (e.g., `playerSlice.ts`, `inventorySlice.ts`) that exports a "creator" function. This function defines a piece of the initial state and all the actions that can modify that piece.

**Example (`questSlice.ts`):**
```typescript
export const createQuestSlice: StateCreator<GameStore, [], [], QuestSlice> = (set, get) => ({
    startQuest: (questId) => {
        set(state => {
            // ... logic to add a new quest to the state.quests object ...
        });
    },
    // ... other quest-related actions
});
```
This pattern keeps related state and logic grouped together, adhering to the principle of high cohesion.

## II. Accessing State: The Selector Pattern

The most important pattern in our architecture is the use of selectors. Instead of a component doing this:

```jsx
// ANTI-PATTERN: Direct access, component is coupled to state shape
const playerHp = useGameStore(state => state.player.stats.hp);
const finalStrength = useMemo(() => { /* complex calculation */ }, [player.stats, player.equipment]);
```

We do this:

```jsx
// GOOD PATTERN: Using selectors
import { selectVitals, selectFinalStats } from '../store/selectors/playerSelectors';
import { shallow } from 'zustand/shallow';

const { hp } = useGameStore(selectVitals, shallow); // Optimized for performance
const finalStats = useGameStore(selectFinalStats); // Centralized logic
```

### The `selectors` Directory (`store/selectors/`)

All selectors are organized by domain into files within this directory (e.g., `playerSelectors.ts`, `inventorySelectors.ts`).

**What is a selector?**
A selector is simply a function that takes the entire state and returns a specific part of it. It can also compute *derived state*.

**Example (`playerSelectors.ts`):**
```typescript
// Simple selector
export const selectPlayer = (state: GameStore) => state.player;

// Selector for derived state
export const selectFinalStats = (state: GameStore) => {
    if (!state.player) return null;
    const finalStats = { ...state.player.stats };
    // ... logic to add bonuses from equipment, effects, etc. ...
    return finalStats;
};
```

### Benefits of Selectors

1.  **Centralized Logic:** Complex calculations (like `selectFinalStats`) are written once and reused everywhere. If the calculation needs to change, it's only changed in one place.
2.  **Component Decoupling:** Components no longer need to know that `hp` is located at `state.player.stats.hp`. They just ask for `selectVitals`. If you later refactor the state shape, you only need to update the selector, not every component that uses it.
3.  **Performance with `shallow`:** For selectors that return objects, using Zustand's `shallow` equality check is crucial.
    ```jsx
    // This component will ONLY re-render if hp, maxHp, mana, etc. change.
    const { hp, maxHp, mana, maxMana } = useGameStore(selectVitals, shallow);
    ```
    Without `shallow`, the component would re-render every time *any* part of the global state changes, because `selectVitals` returns a new object on every call.

## III. For Future Developers: How to Work with the Store

### How to Add a New Piece of State

1.  **Decide which slice it belongs to.** If it's a new domain, create a new slice file (e.g., `timeSlice.ts`).
2.  **Update the types.** Add the new state property to the appropriate slice interface in `types.ts` and to the main `GameStore` interface.
3.  **Add the state and actions** to the slice creator function.
4.  **Integrate the slice** into the main store in `store/store.ts`.

### How to Access State in a Component

1.  **Check for an existing selector.** Look in `store/selectors/` to see if a selector already exists for the data you need.
2.  **Create a new selector if needed.** If you need a new piece of derived data, add a new selector function to the appropriate file in `store/selectors/`.
3.  **Use the selector in your component.**
    ```jsx
    import { useGameStore } from '../store/store';
    import { yourNewSelector } from '../store/selectors/yourDomainSelectors';
    
    // Inside your component...
    const data = useGameStore(yourNewSelector);
    ```
4.  **Consider performance.** If your selector returns an object or array, and your component doesn't need to re-render unless the contents of that object/array change, use `shallow`:
    ```jsx
    const { valueA, valueB } = useGameStore(yourSelector, shallow);
    ```

By adhering to this slice-and-selector pattern, we ensure that the state management of *Nexus Chronicles* remains robust, performant, and a pleasure to work with as the project grows.