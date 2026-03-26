# Nexus Chronicles: Sistema de Misiones (Quests)

Este documento explica cómo funciona el sistema de misiones en *Nexus Chronicles*, desde su definición en los datos hasta cómo el jugador interactúa con ellas y cómo se actualizan sus estados.

---

## I. Estructura de una Misión (`Quest`)

Las misiones se definen en el archivo `data/quests.ts` y siguen la interfaz `Quest` definida en `types.ts`.

### Propiedades de una Misión
- **`id`**: Identificador único de la misión (ej: `'rat_extermination'`).
- **`title`**: El nombre de la misión que se muestra en el diario del jugador.
- **`description`**: El texto narrativo que explica el contexto y el objetivo general de la misión.
- **`objectives`**: Un array de objetos `QuestObjective` que representan los pasos individuales necesarios para completarla.
- **`status`**: El estado actual de la misión. Puede ser:
  - `'active'`: La misión está en curso.
  - `'completed'`: La misión ha sido terminada con éxito.
  - `'failed'`: La misión ha fracasado (uso futuro/opcional).

### Estructura de un Objetivo (`QuestObjective`)
- **`id`**: Identificador único del objetivo dentro de la misión (ej: `'kill_rats'`).
- **`text`**: La descripción del paso a seguir (ej: "Derrota a las ratas gigantes en la bodega").
- **`isCompleted`**: Booleano que indica si este paso específico ya se ha cumplido.

---

## II. Ciclo de Vida de una Misión

El ciclo de vida de una misión se gestiona a través de las acciones del jugador en las escenas (definidas en `data/scenes.ts`) y se procesa en el estado global (`store/questSlice.ts`).

### 1. Iniciar una Misión (`startsQuest`)
Una misión se añade al diario del jugador cuando elige una opción de diálogo que contiene la propiedad `startsQuest`.

**Ejemplo en `data/scenes.ts`:**
```typescript
{
  text: "Acepto el trabajo. Me encargaré de esas ratas.",
  nextScene: 'tavern_cellar',
  startsQuest: 'rat_extermination' // Inicia la misión con este ID
}
```
*Lógica interna*: El `questSlice` busca la plantilla de la misión en `data/quests.ts`, la copia al estado del jugador (`gameState.quests`) y le asigna el estado `'active'`.

### 2. Actualizar Objetivos (`updatesQuest`)
A medida que el jugador avanza, los objetivos individuales se marcan como completados usando la propiedad `updatesQuest`.

**Ejemplo en `data/scenes.ts`:**
```typescript
{
  text: "Regresar a la taberna.",
  nextScene: 'tavern_main',
  updatesQuest: { 
    questId: 'rat_extermination', 
    objectiveId: 'kill_rats', 
    status: true // Marca el objetivo como completado
  }
}
```

### 3. Completar una Misión (`completesQuest` y `effectId`)
Cuando se cumplen todos los requisitos narrativos, la misión se marca como completada. Esto suele ir acompañado de una recompensa (experiencia, oro, objetos) gestionada por un `effectId`.

**Ejemplo en `data/scenes.ts`:**
```typescript
{
  text: "Aquí tienes, las ratas ya no serán un problema.",
  nextScene: 'tavern_main_after_rats',
  completesQuest: 'rat_extermination', // Marca la misión entera como 'completed'
  effectId: 'RECEIVE_BARKEEP_REWARD' // Otorga la recompensa al jugador
}
```

---

## III. Recompensas y Consecuencias

El sistema de misiones está fuertemente acoplado al sistema de efectos (`services/effectRegistry.ts`) para manejar las recompensas.

### Otorgar Recompensas
Las recompensas no se definen directamente en el objeto `Quest`. En su lugar, se crea una función en el `EFFECT_REGISTRY` que modifica el estado del jugador.

**Ejemplo en `services/effectRegistry.ts`:**
```typescript
'RECEIVE_BARKEEP_REWARD': (gameState) => {
    if (!gameState.player) return gameState;
    
    // 1. Añadir objetos al inventario
    const { inventory: newInventory } = addItemToInventory(gameState.player.inventory, ITEMS['rusty-sword']);
    
    // 2. Añadir experiencia o dinero
    const newPlayer = { 
        ...gameState.player, 
        inventory: newInventory,
        xp: gameState.player.xp + 100 // Otorga 100 XP
    };
    
    // 3. Actualizar flags globales (opcional, para cambiar diálogos futuros)
    const newFlags = { ...gameState.globalFlags, completed_rat_extermination: true };
    
    return { ...gameState, player: newPlayer, globalFlags: newFlags };
}
```

---

## IV. Ramificaciones y Condiciones (`Checks`)

Las misiones pueden tener múltiples finales o caminos dependiendo de las elecciones del jugador. Esto se logra combinando misiones con el sistema de condiciones (`services/conditionRegistry.ts`).

### 1. Diálogos Condicionales
Puedes hacer que un NPC responda de manera diferente dependiendo del estado de una misión.

**Ejemplo en `services/conditionRegistry.ts`:**
```typescript
// Verifica si el objetivo específico está completado
'QUEST_RATS_KILLED': (gs) => gs.quests['rat_extermination']?.objectives.find(o => o.id === 'kill_rats')?.isCompleted === true,

// Verifica si la misión entera está completada
'QUEST_RATS_COMPLETED': (gs) => gs.quests['rat_extermination']?.status === 'completed',
```

**Uso en `data/scenes.ts`:**
```typescript
choices: [
  {
    text: "Ya maté a las ratas.",
    nextScene: 'get_reward',
    condition: 'QUEST_RATS_KILLED' // Solo aparece si el objetivo se cumplió
  }
]
```

### 2. Misiones Mutuamente Excluyentes (Ramificación)
Si una elección en una misión bloquea otra ruta, puedes usar `globalFlags` para controlar el flujo.
- Opción A: Salvar al prisionero -> Activa `FLAG_SAVED_PRISONER`.
- Opción B: Ejecutar al prisionero -> Activa `FLAG_KILLED_PRISONER`.
- Las escenas posteriores usarán estas flags como `condition` para mostrar resultados diferentes.

---

## V. Guía Rápida: Cómo Crear una Nueva Misión

1. **Definir la Misión**: Añade la estructura base en `data/quests.ts` (ID, título, descripción, objetivos).
2. **Iniciar la Misión**: En `data/scenes.ts`, añade `startsQuest: 'tu_mision_id'` a la opción de diálogo que la activa.
3. **Actualizar Progreso**: En las escenas relevantes, añade `updatesQuest: { questId: 'tu_mision_id', objectiveId: 'tu_objetivo_id' }` para marcar pasos.
4. **Crear Recompensa**: Define una función en `services/effectRegistry.ts` que otorgue los objetos/XP deseados.
5. **Finalizar Misión**: En el diálogo final, añade `completesQuest: 'tu_mision_id'` y enlaza tu recompensa con `effectId: 'TU_EFECTO_RECOMPENSA'`.
