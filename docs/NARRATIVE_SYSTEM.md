# Nexus Chronicles: Sistema de Narrativa y Escenas

Este documento detalla el funcionamiento del motor narrativo de *Nexus Chronicles*. Explica cómo se estructuran las escenas, cómo se gestionan las elecciones del jugador y cómo las condiciones y consecuencias crean una historia reactiva.

---

## I. Estructura de una Escena (`Scene`)

Las escenas son los bloques fundamentales del juego. Se definen en `data/scenes.ts` y siguen la interfaz `Scene`.

### Propiedades Principales
- **`id`**: Identificador único de la escena (ej: `'tavern_intro'`).
- **`type`**: Define el comportamiento de la escena:
  - `VISUAL_NOVEL`: Escena estándar con texto y opciones.
  - `COMBAT`: Inicia un encuentro de combate.
  - `POINT_AND_CLICK`: Escena interactiva con áreas clickeables.
  - `PROCEDURAL`: Escena generada dinámicamente por IA.
- **`text`**: El cuerpo narrativo que se muestra al jugador.
- **`backgroundImageUrl`**: La imagen de fondo de la escena.
- **`choices`**: Un array de opciones (`Choice`) disponibles para el jugador.
- **`musicTrack` / `particleTheme`**: Define la atmósfera auditiva y visual.

---

## II. Elecciones y Ramificación (`Choice`)

Cada opción en una escena puede llevar a diferentes resultados, misiones o cambios de estado.

### Anatomía de una Elección
```typescript
{
  text: "Atacar al guardia.",
  nextScene: 'combat_with_guard', // Destino (Opcional si hay acción)
  condition: 'PLAYER_IS_AGGRESSIVE', // ¿Cuándo aparece? (ID o Función)
  effectId: 'GAIN_INFAMY', // Ejecuta lógica en effectRegistry.ts
  reputationChange: { 'city_watch': -10 }, // Cambio inmediato de reputación
  startsQuest: 'prison_break', // ID de la misión a iniciar
  updatesQuest: { questId: 'main', objectiveId: 'find_key' }, // Progresa una misión
  completesQuest: 'tutorial', // Finaliza una misión
  action: 'trade', // Abre una interfaz especial (trade, play_dice, etc.)
  unlocks: { lore: ['guard_secrets'] } // Desbloquea entradas en el Códice
}
```

---

## III. Tipos de Escenas Especiales

### 1. Point and Click (`POINT_AND_CLICK`)
Permite al jugador interactuar con elementos visuales de la imagen de fondo en lugar de usar botones de texto.
- **`clickableAreas`**: Define rectángulos (`x, y, width, height`) que actúan como botones invisibles sobre la imagen.
- **Uso**: Ideal para puzles, investigación de habitaciones o navegación por mapas.

### 2. Combate (`COMBAT`)
Transiciona el juego al motor de combate por turnos.
- **`enemies`**: Lista de IDs de enemigos y su cantidad.
- **`onVictoryScene` / `onDefeatScene`**: Define a dónde va la historia tras el resultado del combate.

---

## IV. Condiciones (`Checks`)

El sistema utiliza un registro centralizado en `services/conditionRegistry.ts` para determinar si una opción es visible o si un evento ocurre.

### Tipos de Checks
1.  **Flags Globales**: Verifican si algo ya sucedió (`MET_LYRA`, `HAS_TAVERN_ROOM`).
2.  **Checks de Inventario**: Verifican si el jugador posee un objeto (`HAS_ORNATE_KEY`).
3.  **Checks de Clase/Trasfondo**: Opciones exclusivas para ciertas clases (`BG_SOLDIER`, `IS_WIZARD`).
4.  **Checks de Afinidad**: Basados en la relación con compañeros (`LYRA_AFFINITY_HIGH_70`).
5.  **Checks de Misión**: Verifican el estado de una misión (`QUEST_RATS_KILLED`).

---

## IV. Consecuencias y Efectos (`Flags`)

Cuando un jugador elige una opción, el estado del mundo cambia mediante efectos definidos en `services/effectRegistry.ts`.

### 1. Flags Globales
Son booleanos que persisten en el tiempo. Se activan mediante efectos:
- `FLAG_MET_VORLAG`: Marca que el jugador conoce al capitán.
- `FLAG_CRYPT_DOOR_OPENED`: Cambia permanentemente el acceso a una zona.

### 2. Efectos de Estado (`EffectFunction`)
Funciones que modifican el `GameState` de forma pura:
- **Curación/Daño**: Modifican los stats del jugador.
- **Añadir Objetos**: `addItemToPlayerInventory`.
- **Modificar Afinidad**: Cambian la lealtad de un compañero.

---

## V. Sistema de Diálogo de Compañeros

A diferencia de las escenas de mundo, los diálogos con compañeros en el campamento o mediante interjecciones usan la interfaz `CompanionDialogue`.

- **Prioridad**: Determina qué diálogo aparece primero si hay varios disponibles.
- **Un solo uso (`isOneTime`)**: Diálogos que desaparecen tras ser leídos.
- **Nodos de Diálogo**: Estructura de árbol (`rootNode` -> `choices` -> `nextNode`).

---

## VI. Guía de Implementación: Crear una Rama Narrativa

### Paso 1: Definir la Escena en `data/scenes.ts`
```typescript
my_new_scene: {
  id: 'my_new_scene',
  type: SceneType.VISUAL_NOVEL,
  text: "Te encuentras frente a una puerta sellada con magia.",
  choices: [
    { 
      text: "[Mago] Disipar el sello.", 
      nextScene: 'room_unlocked', 
      condition: 'IS_WIZARD' 
    },
    { 
      text: "Intentar forzarla.", 
      nextScene: 'door_broken', 
      effectId: 'DAMAGE_PLAYER_STAMINA' 
    }
  ]
}
```

### Paso 2: Registrar la Condición (si es nueva)
En `services/conditionRegistry.ts`:
```typescript
'IS_WIZARD': (gs) => gs.player?.characterClass.id === 'wizard',
```

### Paso 3: Registrar el Efecto (si es nuevo)
En `services/effectRegistry.ts`:
```typescript
'DAMAGE_PLAYER_STAMINA': (gs) => {
  if (!gs.player) return gs;
  return { 
    ...gs, 
    player: { 
      ...gs.player, 
      stats: { ...gs.player.stats, stamina: gs.player.stats.stamina - 10 } 
    } 
  };
},
```

---

## VII. Resumen de Lógica Narrativa

| Concepto | Ubicación | Función |
| :--- | :--- | :--- |
| **Escenas** | `data/scenes.ts` | Datos puros de la historia. |
| **Condiciones** | `services/conditionRegistry.ts` | Lógica de visibilidad y checks. |
| **Efectos** | `services/effectRegistry.ts` | Lógica de cambio de estado y consecuencias. |
| **Flags** | `GameState.globalFlags` | Memoria a largo plazo del juego. |
| **Misiones** | `GameState.quests` | Seguimiento de objetivos y progreso. |
