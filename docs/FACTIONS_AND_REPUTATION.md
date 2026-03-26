# Nexus Chronicles: Sistema de Facciones y Reputación

Este documento es la guía definitiva sobre cómo funcionan las facciones, la reputación y las relaciones políticas en *Nexus Chronicles*. Está diseñado para que cualquier desarrollador pueda entender, modificar, agregar o eliminar elementos de este sistema.

---

## I. Conceptos Básicos y Estructura de Datos

Las facciones representan grupos de interés en el mundo del juego. Su información base se define en `data/factions.ts` siguiendo la interfaz `Faction`.

### 1. Definición de una Facción
```typescript
{
  id: 'stonecarvers_guild',
  name: "Gremio de Canteros",
  description: "Enanos expertos en forja y minería...",
  motives: "Proteger sus secretos comerciales.",
  relations: {
    allies: ['mariners_guild'], // Facciones aliadas
    enemies: ['shadow_syndicate'] // Facciones enemigas
  },
  ranks: [ // Umbrales de reputación
    { name: 'Desconocido', reputationThreshold: -100 },
    { name: 'Neutral', reputationThreshold: 0 },
    { name: 'Amigo de la Forja', reputationThreshold: 25 },
    { name: 'Venerado', reputationThreshold: 75 }
  ]
}
```

### 2. El Estado del Jugador
La reputación actual del jugador con cada facción se guarda en `GameState.player.reputation`:
```typescript
reputation: {
  'stonecarvers_guild': 15,
  'shadow_syndicate': -5
}
```
*   **Valores Positivos**: Buena reputación (aliado, respetado).
*   **Valores Negativos**: Mala reputación (odiado, criminal).
*   **Cero (0)**: Neutral.

---

## II. Cómo Sube o Baja la Reputación

La reputación cambia principalmente a través de las decisiones del jugador en las escenas (`data/scenes.ts`).

### 1. Modificación Directa (`reputationChange`)
En cualquier `Choice` (opción de diálogo) o `Scene`, puedes incluir la propiedad `reputationChange`.

```typescript
{
  text: "Ayudar a los guardias a repeler el ataque.",
  nextScene: 'guard_combat',
  reputationChange: { 
    'city_watch': 10,       // Sube 10 puntos con la guardia
    'shadow_syndicate': -15 // Baja 15 puntos con el sindicato
  }
}
```

### 2. Efecto Cascada (Alianzas y Enemistades)
El motor del juego (`store/gameSlice.ts`) procesa automáticamente las relaciones políticas. Cuando ganas o pierdes reputación con la Facción A:
- Ganas la **mitad** de esos puntos con todos los `allies` de la Facción A.
- Pierdes la **mitad** de esos puntos con todos los `enemies` de la Facción A.

*Ejemplo*: Si ganas +10 con el Gremio de Canteros, automáticamente ganas +5 con el Gremio de Marineros (aliados) y pierdes -5 con el Sindicato de las Sombras (enemigos).

---

## III. Efectos en el Juego (Consecuencias)

La reputación no es solo un número; afecta mecánicamente al mundo de tres formas principales:

### 1. Rutas Narrativas y Diálogos (Condiciones)
Puedes bloquear o desbloquear opciones de diálogo dependiendo de la reputación del jugador. Esto se hace usando el sistema de condiciones (`services/conditionRegistry.ts`).

**Ejemplo de Condición:**
```typescript
// En conditionRegistry.ts
'REP_STONECARVERS_HIGH': (gs) => (gs.player?.reputation['stonecarvers_guild'] || 0) >= 25,
```
**Uso en Escena (`data/scenes.ts`):**
```typescript
choices: [
  {
    text: "[Amigo de la Forja] Déjame pasar, Borin me conoce.",
    nextScene: 'secret_forge',
    condition: 'REP_STONECARVERS_HIGH' // Solo visible si la reputación es >= 25
  }
]
```

### 2. Tiendas y Precios (Economía)
La reputación afecta directamente los precios de compra y venta en el sistema de comercio (`store/tradeSlice.ts`).

- **Fórmula**: El juego calcula un modificador basado en la `attitude` (actitud personal del NPC) y la `reputation` (reputación con la facción del NPC).
- **Buena Reputación**: Otorga descuentos al comprar y mejores precios al vender (hasta un 50% de beneficio).
- **Mala Reputación**: Los precios de compra son más caros y te pagan menos por tus objetos.

### 3. Inventarios Desbloqueables (Umbrales y Rangos)
Al alcanzar ciertos umbrales de reputación (definidos en el array `ranks` de la facción), los NPCs mercaderes pueden ofrecer objetos exclusivos.

**Implementación en `data/npcs.ts`:**
```typescript
// NPC Borin (Pertenece a 'stonecarvers_guild')
factionRankInventory: {
  'Amigo de la Forja': [ // Nombre exacto del rango
    { itemId: 'dwarven_hammer', stock: 1 }
  ],
  'Venerado': [
    { itemId: 'legendary_armor', stock: 1 }
  ]
}
```
*Lógica*: Cuando el jugador abre la tienda de Borin, el juego revisa su rango actual. Si es "Amigo de la Forja", el `dwarven_hammer` se añade dinámicamente a la lista de objetos en venta.

---

## IV. Relaciones Dinámicas (Diplomacia y Sabotaje)

Las alianzas entre facciones no son estáticas. El jugador puede forjar nuevas alianzas o destruir las existentes mediante misiones.

### El Estado `factionRelationsOverrides`
El juego guarda las modificaciones políticas en `GameState.factionRelationsOverrides`. Esto sobrescribe las relaciones por defecto de `data/factions.ts`.

### Cómo Cambiar una Relación (Guía de Implementación)
Para cambiar una alianza, debes crear un Efecto en `services/effectRegistry.ts`.

**Ejemplo: Romper una alianza**
```typescript
'BREAK_ALLIANCE_MARINERS_STONECARVERS': (gameState) => {
    // 1. Clonar los overrides actuales
    const newOverrides = JSON.parse(JSON.stringify(gameState.factionRelationsOverrides || {}));

    // 2. Función auxiliar para eliminar un aliado
    const removeAlly = (factionId: string, allyIdToRemove: string) => {
        if (!newOverrides[factionId]) newOverrides[factionId] = {};
        if (!newOverrides[factionId].allies) {
            // Si no hay override, copiar los aliados por defecto primero
            newOverrides[factionId].allies = FACTIONS.find(f => f.id === factionId)?.relations?.allies?.slice() || [];
        }
        // Filtrar el aliado que queremos eliminar
        newOverrides[factionId].allies = newOverrides[factionId].allies.filter(ally => ally !== allyIdToRemove);
    };

    // 3. Aplicar la ruptura de forma bilateral
    removeAlly('mariners_guild', 'stonecarvers_guild');
    removeAlly('stonecarvers_guild', 'mariners_guild');

    // 4. Retornar el nuevo estado
    return { ...gameState, factionRelationsOverrides: newOverrides };
}
```
Luego, simplemente llamas a este `effectId` desde la opción de diálogo final de tu misión de sabotaje.

---

## V. Guía de Mantenimiento (Para futuros desarrolladores)

### Agregar una Nueva Facción
1. Abre `data/factions.ts`.
2. Añade un nuevo objeto al array `FACTIONS` con su `id`, `name`, `relations` y `ranks`.
3. Actualiza las `relations` de otras facciones si la nueva facción es su aliada o enemiga desde el inicio.

### Eliminar una Facción
1. Bórrala de `data/factions.ts`.
2. Busca su `id` en todo el proyecto y elimínalo de las `relations` de otras facciones.
3. Elimina cualquier `reputationChange` en `data/scenes.ts` que haga referencia a esa facción.
4. Revisa `data/npcs.ts` y reasigna o elimina los NPCs que pertenecían a esa facción (`factionId`).

### Modificar Umbrales (Rangos)
1. Ve a `data/factions.ts` y edita el array `ranks` de la facción deseada.
2. Si cambias el `name` de un rango, **DEBES** ir a `data/npcs.ts` y actualizar las claves en `factionRankInventory` para que coincidan exactamente con el nuevo nombre.
