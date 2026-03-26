# Sistema de Lore y Códex

El sistema de Lore (o Códex) es el encargado de almacenar, gestionar y presentar la información del mundo del juego (historia, facciones, mecánicas, etc.). 

Este sistema tiene un doble propósito fundamental:
1. **Para el Jugador:** Sirve como una enciclopedia in-game donde el jugador puede leer sobre el mundo que está explorando.
2. **Para la IA (LLM):** Sirve como **contexto dinámico**. El sistema alimenta al modelo de lenguaje (Gemini) *únicamente* con el lore que el jugador ha desbloqueado, asegurando que los NPCs no hablen de temas que el jugador aún no ha descubierto.

---

## 1. Estructura de Datos (`types.ts`)

Cada entrada de lore está definida por la interfaz `Lore` y pertenece a una categoría específica (`LoreCategory`).

```typescript
// Categorías disponibles para organizar el Códex
export type LoreCategory = 'World' | 'Factions' | 'History' | 'Mechanics';

// Estructura de una entrada de Lore
export interface Lore {
  id: string;          // Identificador único (ej. 'lore_arathis_history')
  title: string;       // Título visible en el Códex (ej. 'La Caída de Arathis')
  content: string;     // Contenido/texto de la entrada (soporta Markdown)
  category: LoreCategory; // Categoría a la que pertenece
}
```

---

## 2. Definición de Entradas (`data/lore.ts`)

Todas las entradas de lore base del juego se definen en el archivo `data/lore.ts` dentro de un array constante llamado `LORE`.

**Ejemplo de definición:**
```typescript
import { Lore } from '../types';

export const LORE: Lore[] = [
  {
    id: 'world_arathis',
    title: 'El Reino de Arathis',
    content: 'Arathis fue una vez la joya del continente, conocida por sus altos chapiteles de cristal...',
    category: 'World'
  },
  {
    id: 'faction_crimson_blade',
    title: 'La Hoja Carmesí',
    content: 'Un grupo de mercenarios de élite que operan en los bordes de la ley...',
    category: 'Factions'
  }
];
```

---

## 3. Mecánica de Desbloqueo

El progreso del Códex se guarda en el estado global del juego (`GameState` en `store/store.ts`).

### Estado Global
```typescript
// Dentro de GameState
unlockedLoreIds: string[]; // Array con los IDs del lore descubierto
```

### ¿Cómo se desbloquea?
El lore se desbloquea principalmente a través de la propiedad `unlocks` presente en **Escenas** (`Scene`) o en **Opciones** (`Choice`). Cuando el jugador llega a una escena o toma una decisión que contiene `unlocks.lore`, el motor (`store/gameSlice.ts`) añade automáticamente esos IDs al array `unlockedLoreIds`.

**Ejemplo en una Escena:**
```typescript
{
  id: 'scene_library_secret',
  text: 'Encuentras un tomo polvoriento que habla sobre la magia prohibida.',
  unlocks: {
    lore: ['mechanics_forbidden_magic'] // Se desbloquea al entrar a la escena
  },
  choices: [ ... ]
}
```

**Ejemplo en una Opción:**
```typescript
{
  id: 'ask_about_ruins',
  text: '"¿Qué pasó en esas ruinas?"',
  unlocks: {
    lore: ['history_ruins_fall'] // Se desbloquea solo si el jugador elige preguntar
  }
}
```

---

## 4. Uso del Lore en el Juego

El lore desbloqueado no es solo texto para leer; afecta activamente al gameplay y a la narrativa.

### A. Como Condición (`services/conditionRegistry.ts`)
Puedes usar el conocimiento del jugador para bloquear o desbloquear opciones de diálogo o rutas.
```typescript
// Ejemplo en conditionRegistry.ts
'KNOWS_ABOUT_MALAKOR': (gs) => gs.unlockedLoreIds.includes('lore_malakor_madness'),

// Uso en una opción:
{
  id: 'confront_malakor',
  text: '"Sé lo que hiciste, Malakor. Conozco tu locura."',
  condition: 'KNOWS_ABOUT_MALAKOR' // Solo aparece si el jugador leyó/desbloqueó ese lore
}
```

### B. Como Contexto para la IA (`services/geminiService.ts`)
Esta es una de las características más potentes. Antes de enviar un prompt a la IA, el servicio filtra el lore:
```typescript
// Lógica interna en geminiService.ts
const knownLore = LORE.filter(l => unlockedLoreIds.includes(l.id));
// knownLore se inyecta en el System Prompt de la IA.
```
*Consecuencia:* Si el jugador no ha desbloqueado `'faction_crimson_blade'`, la IA actuará como si el jugador no supiera nada de ellos, o directamente el NPC no mencionará detalles profundos a menos que sea parte de su propia instrucción.

---

## 5. Guía para el Desarrollador: Cómo añadir nuevo Lore

Si deseas agregar nueva información al mundo, sigue estos pasos:

1. **Crear la entrada:**
   Abre `data/lore.ts` y añade un nuevo objeto al array `LORE`.
   ```typescript
   {
     id: 'creatures_shadow_stalker',
     title: 'Acechador de las Sombras',
     content: 'Bestias nacidas de la oscuridad pura. Son ciegas pero huelen el miedo...',
     category: 'World' // O crea una nueva categoría en types.ts si es necesario
   }
   ```

2. **Asignar el desbloqueo:**
   Ve a tus archivos de historia (ej. `data/story.ts` o donde definas tus escenas) y decide en qué momento el jugador aprende esto.
   ```typescript
   choices: [
     {
       id: 'inspect_claw_marks',
       text: 'Inspeccionar las marcas de garras en la pared.',
       unlocks: {
         lore: ['creatures_shadow_stalker']
       }
     }
   ]
   ```

3. **(Opcional) Crear reactividad:**
   Si quieres que saber esto sea útil, añade una condición en `conditionRegistry.ts`:
   ```typescript
   'HAS_SHADOW_STALKER_KNOWLEDGE': (gs) => gs.unlockedLoreIds.includes('creatures_shadow_stalker')
   ```
   Y úsala para darle al jugador una ventaja en un combate o un diálogo futuro.

## Consideraciones Adicionales
* **Evita Spoilers en los Títulos:** Si un lore se muestra en una lista de "bloqueados" (dependiendo de la UI), asegúrate de que el título no revele demasiado si el ID aún no está en `unlockedLoreIds`.
* **Tamaño del Contexto:** Ten en cuenta que inyectar *todo* el lore desbloqueado en el prompt de la IA consume tokens. Si el juego crece mucho, considera en el futuro filtrar el lore inyectado a la IA basándote en la relevancia (ej. solo inyectar lore de la categoría 'Factions' si el jugador está hablando con un líder de facción).
