# Changelog

## [Feature] - Secrets & Cheats (The Whispering Shade)

### Overview
Implemented a diegetic cheat code system integrated into the game world via a mysterious NPC. This allows for testing, debugging, and player rewards through secret "Words of Power".

### New Features
*   **Cipher, The Keeper of Secrets:** A new NPC located in a hidden alley off the City Square.
*   **Cheat Code Interface:** A thematic modal (`CheatCodeModal`) that accepts text input to trigger game effects.
*   **Words of Power:**
    *   `MAMMON`: Grants 1000 Gold.
    *   `EUREKA`: Grants enough XP to level up.
    *   `AMBROSIA`: Fully restores HP, Mana, and Stamina.
    *   `CHRONOS`: Resets daily action counters (e.g., performing at the tavern).

### Technical Implementation
*   **`services/cheatService.ts`:** Centralized logic for parsing codes and applying effects to the global store.
*   **`components/CheatCodeModal.tsx`:** New UI component for inputting codes with a specific visual theme (Void/Purple).
*   **`types.ts`:** Added `input_code` to `Choice` actions and `cheatCode` to `ModalType`.
*   **`data/scenes.ts`:** Added `hidden_alley` scene connecting the City Square to the new feature.

---

## [Refactoring Phase 1] - UI & Data Architecture

### Features & Refactoring

#### 1. Unified Item Rendering (`ItemSlot`)
*   **New Component**: Created `components/ItemSlot.tsx`.
*   **Purpose**: Replaced disparate item rendering logic in `InventoryModal`, `TradeModal`, and `CombatScreen` with a single, flexible component.
*   **Benefits**:
    *   **Consistency**: Standardized visual appearance of items (rarity borders, size, tooltips) across the entire game.
    *   **Maintainability**: Drag-and-Drop logic and click handlers are now centralized.
*   **Changes**:
    *   Refactored `InventoryModal` to use `ItemSlot`.
    *   Refactored `TradeModal` to use `ItemSlot`.
    *   Refactored `CombatScreen` (Loot section) to use `ItemSlot`.
    *   *Removed*: `components/InventorySlot.tsx` (Obsolete).

#### 2. Condition Registry (`ConditionRegistry`)
*   **New Service**: Created `services/conditionRegistry.ts`.
*   **Purpose**: Decoupled game logic functions from static data files (`data/scenes.ts`, `data/dialogues/*.ts`) to ensure data serializability.
*   **Benefits**:
    *   **Serialization**: Scene data is now JSON-compatible (using string IDs instead of inline functions), enabling easier saving/loading and potential external content editors.
    *   **Debugging**: Conditions are easier to log and track by their string IDs (e.g., `'QUEST_RATS_KILLED'`).
*   **Changes**:
    *   Updated `types.ts` to allow `condition` properties to be strings.
    *   Refactored `data/scenes.ts` to replace all inline arrow functions with Registry IDs.
    *   Refactored `data/dialogues/lyra.ts` to use Registry IDs.
    *   Updated `screens/GameScreen.tsx` and `store/selectors/dialogueSelectors.ts` to use the `checkCondition` helper function.

### Next Steps (Planned)
*   **Scene Modularization**: Split the monolithic `data/scenes.ts` into region-based files (e.g., `scenes/tavern.ts`, `scenes/crypt.ts`).
*   **Combat Logic Registry**: Move inline combat logic from `data/actions.ts` to a centralized service.