# Design Document: Companion Interaction System (The "Camp" Mechanic)

## Overview
This system allows players to engage in deep, context-aware conversations with their companions in specific "Safe Zones" (e.g., Taverns, Campsites), similar to *Baldur's Gate 3* or *Dragon Age*. It separates "World Gameplay" from "Character Development," giving players a dedicated space to explore relationships.

---

## I. Core Architecture

### 1. The `Dialogue` Data Structure
Instead of using standard `Scenes`, we will define `Dialogues`. This prevents `data/scenes.ts` from becoming unmanageable.

```typescript
// Concept Type Definition
interface CompanionDialogue {
  id: string;
  companionId: string;
  
  // Triggers & Conditions
  condition: (gameState: GameState) => boolean; // e.g., Has defeated the Rat King?
  priority: number; // High (Plot) > Medium (Personal Quest) > Low (Flavor)
  isOneTime: boolean; // Does this disappear after reading?
  
  // Content
  rootNode: DialogueNode; // The start of the conversation tree
}

interface DialogueNode {
  id: string;
  text: string; // What the companion says
  choices: DialogueChoice[];
}

interface DialogueChoice {
  text: string; // What the player says
  nextNodeId?: string; // Where the conversation goes
  effect?: string; // Affinity changes, flag updates
  endConversation?: boolean; // Returns to the main hub
}
```

### 2. The "Safe Zone" Flag
We will update the `Scene` type to include a property `isSafeZone: boolean`.
*   **When `true`:** A "Companions" or "Camp" button appears in the Game Header.
*   **Function:** Clicking this opens the **Companion Hub Modal**.

---

## II. User Interface Flow

### 1. The Notification System (Status Bubbles)
To avoid "menu fatigue," the UI must clearly signal when new content is available.

#### A. Global Indicator (GameHeader)
*   **Location:** The "Camp/Party" button in the main top bar.
*   **Behavior:** If *any* companion has a dialogue available where `condition(state) === true` AND it hasn't been read:
    *   Show a **Notification Badge** (small circle on the button corner).
    *   **Priority Colors:**
        *   **Gold (!):** Critical Story / Personal Quest update.
        *   **White (💬):** Ambient commentary / "Fluff".

#### B. Individual Indicator (Companion Hub Modal)
*   **Location:** Inside the modal, overlaying the specific companion's portrait.
*   **Behavior:**
    *   **Vespera** has a Gold `!` -> She initiates the conversation immediately upon selection.
    *   **Lyra** has no icon -> Selecting her opens the standard "Hub Menu" (Trade, generic questions).

---

## III. The Companion Hub Modal
A specialized modal that displays your current party members (or all recruited companions at the camp).
*   **Visuals:** Displays the companion's sprite, name, and current Affinity bar.
*   **Selection:** Clicking a companion enters "Conversation Mode".

---

## IV. Conversation Mode
This replaces the standard Game Footer temporarily.
*   It displays the **Dialogue Tree** defined in the data structure above.
*   It allows for looping conversations (e.g., "Tell me about your past" -> returns to topic list) or linear scenes (e.g., A romance event).

---

## V. Interaction Types

The system will support three types of interactions:

### A. "New" Dialogues (The Stack)
These are one-time conversations triggered by events.
*   *Example:* After finding the Crimson Blades Banner, Vorlag has a specific speech about it.
*   *Mechanic:* These appear at the top of the topic list, often gold-colored.

### B. "Perm" Dialogues (The Hub)
Standard questions that are always available until exhausted.
*   *Examples:* "How are you holding up?", "What do you think of our current objective?", "Let's trade gear."

### C. Actions (Non-Verbal)
Specific actions available based on inventory or context.
*   **Gift Giving:** Opens a sub-menu to select an item from inventory to give. (Logic: Checks item tags for affinity boost. e.g., Giving *Wine* to a *Dwarf*).
*   **Sparring/Training:** Only available in Camp scenes. Costs Stamina, grants small XP.

---

## VI. Implementation Roadmap

### Phase 1: Data & State
1.  Create `types/dialogue.ts`.
2.  Create `data/dialogues/index.ts` (Registry).
3.  Update `GameState` to include `readDialogueIds: string[]`.
4.  Create `dialogueSlice.ts` in the store to handle fetching valid topics.

### Phase 2: UI Integration
1.  Update `Scene` type.
2.  Add "Companions" button to `GameHeader`.
3.  Create `CompanionHubModal.tsx`.

### Phase 3: Content Migration
1.  Move existing Lyra conversations (currently in `scenes.ts`) into the new Dialogue system to test it.
2.  Implement the "Alert (!)" system logic.

---

## VII. Example: How it looks in code

**File:** `data/dialogues/lyra.ts`

```typescript
export const lyraDialogues: CompanionDialogue[] = [
  {
    id: 'lyra_react_crypt',
    companionId: 'lyra',
    priority: 10,
    isOneTime: true,
    condition: (gs) => gs.globalFlags.visitedCryptEntrance && !gs.readDialogueIds.includes('lyra_react_crypt'),
    rootNode: {
      id: 'start',
      text: "That place... the Crypt. It felt familiar to you, didn't it? I saw the way you looked at the gate.",
      choices: [
        { text: "It called to me.", nextNodeId: 'called', effect: 'LYRA_AFFINITY_UP' },
        { text: "It's just a tomb, Lyra.", nextNodeId: 'dismiss' }
      ]
    }
  }
];
```