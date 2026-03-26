# Nexus Chronicles: Sistema de Inventario y Equipamiento

Este documento detalla la arquitectura, el flujo de datos y las reglas del sistema de inventario y equipamiento del jugador. Está diseñado para guiar a futuros desarrolladores sobre cómo mantener, modificar y expandir este sistema crítico.

---

## I. Estructura de Datos Base (`types.ts`)

El inventario no es una lista dinámica que crece infinitamente, sino un array de tamaño fijo (definido por `INVENTORY_SIZE` en `constants.ts`). Esto simula una cuadrícula clásica de RPG.

### 1. El Inventario
```typescript
export interface InventorySlotData {
  item: Item;
  quantity: number;
}

// En el PlayerCharacter:
inventory: (InventorySlotData | null)[]; 
```
*   **Regla de Oro**: Un espacio vacío siempre es `null`. El tamaño del array siempre debe ser igual a `INVENTORY_SIZE`.

### 2. El Equipamiento
El equipo es un objeto (Record) que mapea ranuras específicas (`EquipmentSlot`) a un objeto `Item` o `null`.
```typescript
export type EquipmentSlot = 'head' | 'chest' | 'legs' | 'feet' | 'hands' | 'mainHand' | 'offHand' | 'ring' | 'amulet';

// En el PlayerCharacter:
equipment: Record<EquipmentSlot, Item | null>;
```

---

## II. Lógica Central (`store/inventorySlice.ts`)

Toda la manipulación del inventario ocurre en este slice de Zustand. **Nunca se debe mutar el inventario directamente desde un componente.**

### Acciones Principales:
1.  **`equipItem(inventoryIndex, targetSlot)`**:
    *   Verifica si el objeto puede ir en esa ranura.
    *   **Intercambio (Swapping)**: Si ya hay un objeto equipado, intenta desequiparlo primero (requiere espacio en el inventario).
    *   **Armas a Dos Manos (`handedness: 'two'`)**: Si se equipa en `mainHand`, automáticamente desequipa lo que haya en `offHand`. Bloquea equipar algo en `offHand` si hay un arma a dos manos en `mainHand`.
2.  **`unequipItem(sourceSlot)`**:
    *   Mueve el objeto del equipo al inventario.
    *   **Fallo**: Si el inventario está lleno, la acción se cancela y muestra un `console.warn`.
3.  **`useItem(itemIndex)`**:
    *   Lee los `onUseEffectIds` del objeto.
    *   Ejecuta la lógica correspondiente en `services/itemEffectRegistry.ts`.
    *   Reduce la `quantity` en 1. Si llega a 0, el slot se vuelve `null`.

---

## III. Funciones Auxiliares Críticas (`lib/utils.ts`)

Para añadir o quitar objetos, **siempre** se deben usar estas funciones puras. Manejan la lógica compleja de apilamiento (stacking) y búsqueda de espacios vacíos.

### `addItemToInventory(inventory, itemToAdd)`
*   Busca si el objeto ya existe y es apilable (`stackable: true`).
*   Respeta el límite de apilamiento (`maxStackSize`). Si el stack se llena, busca otro slot para el sobrante.
*   Si no es apilable, busca el primer slot `null`.
*   **Retorno**: `{ success: boolean, inventory: newInventory }`. Si devuelve `success: false`, el inventario está lleno.

### `updateInventoryByQuantity(inventory, item, quantityChange)`
*   Permite sumar o restar cantidades específicas (ej. restar 5 pociones de golpe).
*   Maneja la eliminación del slot (volverlo `null`) si la cantidad llega a 0 o menos.

---

## IV. Reglas Estrictas (Lo que DEBE mantenerse)

Si vas a modificar este sistema, respeta estas reglas para no romper el juego:

1.  **Inmutabilidad**: Zustand requiere que devuelvas un nuevo array/objeto. Nunca hagas `state.player.inventory.push(...)`. Usa el operador spread `[...inventory]` o las funciones de `utils.ts`.
2.  **Tamaño Fijo**: La UI (`components/Inventory.tsx`) renderiza una cuadrícula basada en la longitud del array. Si añades un objeto sin usar `addItemToInventory` y haces un `.push()`, romperás la cuadrícula visual.
3.  **Desequipar requiere espacio**: La lógica de `equipItem` y `unequipItem` asume que el objeto que te quitas va al inventario. Si el inventario está lleno, la acción **debe** fallar para evitar la pérdida de objetos.

---

## V. Guía de Modificación

### 1. Cómo añadir una nueva ranura de equipamiento (ej. 'Capa' / 'Cloak')
1.  Añade `'cloak'` al type `EquipmentSlot` en `types.ts`.
2.  Añade `cloak: null` al estado inicial del jugador en `store/gameSlice.ts` (en `initializeNewGame`) y en `dev/dummySave.ts`.
3.  Actualiza la UI en `components/CharacterSheet/EquipmentPane.tsx` para renderizar el nuevo slot.

### 2. Cómo cambiar el tamaño del inventario
1.  Cambia el valor de `INVENTORY_SIZE` en `constants.ts`.
2.  Asegúrate de que el CSS Grid en `components/Inventory.tsx` se adapte bien al nuevo número (ej. cambiando las columnas de `grid-cols-5` a `grid-cols-6`).

---

## VI. Posibles Ampliaciones (Para futuros desarrolladores)

El sistema actual es robusto, pero está diseñado para poder expandirse. Aquí hay ideas de implementación:

1.  **Sistema de Peso (Encumbrance)**:
    *   *Implementación*: Añadir `weight: number` a la interfaz `Item`. Crear un selector en `store/selectors/playerSelectors.ts` que sume el peso del inventario y equipo. Si supera un límite (basado en Fuerza), aplicar un estado `SLOWED` al jugador.
2.  **Filtros y Ordenamiento (Sorting)**:
    *   *Implementación*: En `components/Inventory.tsx`, añadir botones para ordenar el array por `type`, `rarity` o `name`. **Ojo**: Al ordenar, asegúrate de mantener los slots `null` al final del array.
3.  **Bancos o Alijos (Stash)**:
    *   *Implementación*: Crear un nuevo array `stash: (InventorySlotData | null)[]` en el `GameState`. Crear acciones en un nuevo slice (`stashSlice.ts`) para mover objetos entre `player.inventory` y `stash`.
4.  **Durabilidad de Objetos**:
    *   *Implementación*: Cambiar `Item` en el inventario para que sea una instancia única con estado (ej. añadir `currentDurability`). Esto requeriría cambiar cómo se apilan los objetos (los objetos con durabilidad no deberían ser apilables).
5.  **Comparación de Estadísticas (Tooltips)**:
    *   *Implementación*: En el componente del Tooltip del inventario, buscar el objeto equipado en la misma ranura y mostrar texto verde/rojo (ej. `Ataque: 15 (+3)`).
