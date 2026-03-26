# Nexus Chronicles: Items & Inventory System

This document explains the design, implementation, and logic of the items system in *Nexus Chronicles*. It covers how items are structured, how trading works, and how to implement new items and effects.

---

## I. Item Structure (`types.ts`)

All items in the game follow the `Item` interface. This structure is designed to be data-driven, allowing for a wide variety of equipment, consumables, and quest items.

### 1. Core Properties
- **`id`**: A unique string identifier (e.g., `'rusty-sword'`).
- **`name`**: The display name of the item.
- **`description`**: A detailed flavor text or functional description.
- **`type`**: The category of the item:
  - `weapon`: Equippable in `mainHand` or `offHand`.
  - `armor`: Equippable in `head`, `chest`, `legs`, etc.
  - `consumable`: Can be used to trigger an effect (e.g., healing).
  - `quest`: Items required for progression, usually non-sellable.
  - `misc`: General items, often used for crafting or selling.
- **`rarity`**: `Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`.
- **`value`**: The base value in copper pieces (100cp = 1sp, 100sp = 1gp).

### 2. Equipment Properties
- **`slot`**: The `EquipmentSlot` where the item can be equipped (e.g., `mainHand`, `chest`, `amulet`).
- **`stats`**: A map of stat bonuses granted when equipped (e.g., `{ strength: 1, armor: 2 }`).
- **`requirements`**: Conditions the player must meet to equip the item (e.g., `{ stats: { strength: 16 }, class: ['fighter'] }`).
- **`handedness`**: `'one'` or `'two'`. Two-handed weapons block the `offHand` slot.
- **`damage`**: For weapons, defines the base damage and type (e.g., `{ amount: 6, type: DamageType.SLASHING }`).

### 3. Consumable Properties
- **`onUseEffectIds`**: An array of string IDs that map to logic in `services/itemEffectRegistry.ts`.
- **`stackable`**: Boolean indicating if the item can be stacked in a single inventory slot.
- **`maxStackSize`**: The maximum number of items in a stack.

---

## II. Inventory & Equipment Logic

### 1. Storage
The player's inventory is an array of `InventorySlotData | null`:
```typescript
export interface InventorySlotData {
  item: Item;
  quantity: number;
}
```
Equipment is stored as a record mapping slots to items:
```typescript
equipment: Record<EquipmentSlot, Item | null>;
```

### 2. Equipping Rules (`store/inventorySlice.ts`)
- **Slot Matching**: Items can only be equipped in their designated `slot`.
- **Two-Handed Weapons**: Equipping a two-handed weapon in the `mainHand` will automatically unequip the `offHand` item.
- **Off-Hand Restriction**: You cannot equip an `offHand` item if a two-handed weapon is in the `mainHand`.
- **Inventory Space**: Unequipping an item requires at least one empty slot in the inventory.

---

## III. Trading & Bartering (`store/tradeSlice.ts`)

The game uses a barter-based trading system where players and NPCs exchange items and currency.

### 1. Merchant Inventory
NPCs have their own inventory defined in `data/npcs.ts`. This can be a static list or a rank-locked list:
```typescript
inventory: [{ itemId: 'potion-of-healing', stock: 5 }];
factionRankInventory: {
  'Rank Name': [{ itemId: 'rare-sword', stock: 1 }]
};
```

### 2. Price Calculation
Prices are not fixed; they are dynamically calculated based on:
- **Base Value**: The `value` property of the item.
- **NPC Attitude**: A value from 0-100 (higher is better).
- **Faction Reputation**: The player's standing with the NPC's faction (-100 to 100).

**Formula:**
- **Buy Price**: `Base Value * (1 - Total Modifier)`
- **Sell Price**: `(Base Value / 2) * (1 + Total Modifier)`
- **Total Modifier**: `(Attitude / 100 * 0.25) + (Reputation / 100 * 0.25)`, capped at +/- 50%.

---

## IV. Unlockable & Special Items

### 1. Faction Rank Rewards
Some items are "unlocked" only when the player reaches a certain reputation rank with a faction. These items do not appear in a merchant's inventory until the requirement is met.
- **Logic**: Handled via the `factionRankInventory` property in `NPCData`.
- **Reference**: See `docs/FACTION_RANKS.md` for full details on how to implement rank-locked items.

### 2. Quest Rewards
Items can be granted directly to the player as rewards for completing quests or making specific dialogue choices.
- **Implementation**: Use the `ADD_ITEM_[ID]` effect in `services/effectRegistry.ts`.
- **Example**: A quest completion might trigger an effect that calls `addItemToPlayerInventory(ITEMS['legendary-ring'])`.

### 3. Hidden & World Items
Items can also be found in the world (e.g., in chests or as loot).
- **Implementation**: These are typically handled by scene transitions or interaction effects that add items to the player's inventory.

---

## V. Implementation Guide

### 1. Adding a New Item
1. Open `data/items.ts`.
2. Add a new entry to the `ITEMS` constant.
```typescript
'my-new-item': {
  id: 'my-new-item',
  name: 'Epic Sword',
  description: 'A glowing blade of light.',
  type: 'weapon',
  slot: 'mainHand',
  damage: { amount: 15, type: DamageType.RADIANT },
  rarity: 'Epic',
  value: 25000,
  handedness: 'one',
},
```

### 2. Adding a Consumable Effect
1. Open `services/itemEffectRegistry.ts`.
2. Define the logic for your effect.
```typescript
'MY_CUSTOM_EFFECT': (gameState) => {
    // Logic to modify gameState
    return { ...gameState, /* changes */ };
},
```
3. Assign the ID to an item in `data/items.ts`:
```typescript
onUseEffectIds: ['MY_CUSTOM_EFFECT'],
```

### 3. Making an Item Buyable
1. Open `data/npcs.ts`.
2. Add the item ID to the NPC's `inventory` array.
```typescript
inventory: [
  { itemId: 'my-new-item', stock: 1 },
],
```

---

## V. Restrictions & Constraints

1. **Weight & Encumbrance**: (Currently not implemented) The system supports adding weight properties in the future.
2. **Quest Items**: Quest items usually have a `value` of 0 and cannot be sold in the trade interface.
3. **Stacking**: Items like potions should have `stackable: true` and a reasonable `maxStackSize` (e.g., 20) to save inventory space.
4. **Validation**: The `finalizeTrade` action in `tradeSlice.ts` performs robust validation to ensure the player has the items and currency they are offering before committing the transaction.
