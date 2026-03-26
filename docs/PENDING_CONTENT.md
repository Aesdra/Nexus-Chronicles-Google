
# Pending Content Registry

This document tracks assets, characters, factions, and lore that have been added to the game's database files (`data/*.ts`) but have not yet been implemented in the active game logic (scenes, quests, dialogues, or mechanics).

Use this as a reference when designing future updates.

## Characters

### Vespera 'Gutter-Rot' Thorne
*   **Role:** Companion / Rogue (Phantom)
*   **Race:** Levistus Tiefling
*   **Files:**
    *   `data/npcs.ts`: Full NPC definition (`vespera_gutter_rot`).
    *   `data/companions.ts`: Companion stats and progression (`vespera`, `VESPERA_PROGRESSION`).
    *   `data/assets.ts`: Placeholder sprite.
*   **Lore:** Escaped thrall of the Gilded Cage. Deeply traumatized, volatile, and anti-social. Uses "Milk of the Poppy" for pain management.
*   **Status:** Data exists. Needs to be added to a scene (likely an encounter in a city alley or sewer) to be recruitable.

### The Curator
*   **Role:** Antagonist / Faction Leader
*   **Files:** `data/npcs.ts` (`the_curator`).
*   **Lore:** The Lich-like leader of the Gilded Cage. Views people as clay to be sculpted.
*   **Status:** Defined as an NPC. Needs a location (The Ivory Sanctum?) and a questline involving Vespera.

## Factions

### The Sodality of the Gilded Cage
*   **Type:** Criminal Syndicate / Arcanist Cult
*   **Files:**
    *   `data/factions.ts`: Faction definition, beliefs, and structure (`the_gilded_cage`).
    *   `data/lore.ts`: Deep lore entry detailing their hierarchy, "The Methodology of Breaking," and twisted economy.
*   **Key Concepts:** "Perfection Through Subjugation," "Agony Siphons," "Leviathan Tears."
*   **Status:** Fully defined in lore/faction data. No quests or reputation mechanics currently utilize this faction.

## Items

### Weapons
*   **'The Mercy'**: Vespera's signature shank. (Rare Dagger, causes bleeding). Defined in `data/items.ts`.

### Consumables
*   **Milk of the Poppy**: Potent painkiller. Defined in `data/items.ts`.
*   **Leviathan Tears**: Mana potion made from suffering. Defined in `data/items.ts`.

### Misc / Quest Items
*   **Charred Finger-bones**: Vespera's soul trinkets. Defined in `data/items.ts`.
*   **Gilded Birdcage Key**: Key to pocket dimensions. Defined in `data/items.ts`.
*   **Agony Siphon**: Crystal implant. Defined in `data/items.ts`.

## Mechanics

### Phantom Rogue Subclass
*   **Context:** Vespera's subclass.
*   **Files:** `data/classes.ts` (Subclass definition exists), `data/lore.ts` (Lore entry added).
*   **Status:** The lore exists, but the specific combat mechanics (using "soul trinkets" to deal necrotic damage or phase through objects) need to be implemented in `services/combatManager.ts` or `data/actions.ts` if Vespera becomes a playable party member.

## Future Implementation Ideas

1.  **Encounter:** Player finds Vespera cornered by "Keepers" from the Gilded Cage in a dark alley of Silverwind or Threshold. Helping her unlocks her as a companion.
2.  **Quest:** "The Art of Breaking" - Vespera asks the player to help her hunt down a "Sculptor" operating in the city.
3.  **Location:** A hidden "Gallery" dungeon accessible only via the *Gilded Birdcage Key*.
