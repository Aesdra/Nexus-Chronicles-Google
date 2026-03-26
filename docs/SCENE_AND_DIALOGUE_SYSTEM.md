# Nexus Chronicles: Sistema de Escenas y Diálogos

El sistema de escenas y diálogos es el **motor narrativo principal** de *Nexus Chronicles*. Permite la creación de historias ramificadas, interacciones con NPCs, eventos de combate y la progresión del jugador a través de nodos de texto y elecciones.

Este documento detalla la estructura de las escenas, cómo se gestionan las transiciones, el uso de registros para mantener los datos puros, y cómo extender el sistema.

---

## I. Arquitectura y Estructura de Datos

El sistema está diseñado bajo el principio de **Data-Driven Design** (Diseño Orientado a Datos) y **Data Purity** (Pureza de Datos). Esto significa que los archivos de historia (`data/scenes.ts`) son objetos planos (similares a JSON) sin funciones complejas incrustadas, lo que permite que el juego se pueda guardar y cargar fácilmente.

### 1. La Escena (`Scene` en `types.ts`)
Una escena representa un punto en la narrativa. Sus propiedades clave son:

*   **`id`**: Identificador único y obligatorio (ej. `'town_square_intro'`).
*   **`type`**: El tipo de escena (`SceneType`).
    *   `VISUAL_NOVEL`: Texto y opciones de diálogo (el más común).
    *   `COMBAT`: Inicia un encuentro de combate.
    *   `POINT_AND_CLICK`: Escenas interactivas visuales.
    *   `PROCEDURAL`: Escenas generadas dinámicamente.
*   **`text`**: El texto narrativo principal.
*   **`choices`**: Array de objetos `Choice` que el jugador puede seleccionar.
*   **`backgroundImageUrl` / `backgroundKey`**: Imagen de fondo.
*   **`musicTrack`**: Pista de audio a reproducir.
*   **`enemies` / `temporaryCompanions`**: Si es de tipo `COMBAT`, define quién pelea. Requiere `onVictoryScene` y `onDefeatScene`.
*   **`effectId`**: Llama a una función del `EFFECT_REGISTRY` al entrar a la escena.
*   **`reputationChange`**: Modifica la reputación de facciones automáticamente.
*   **`startsQuest` / `updatesQuest` / `completesQuest`**: Ganchos para el sistema de misiones.

### 2. La Elección (`Choice` en `types.ts`)
Representa una opción que el jugador puede tomar.

*   **`text`**: El texto del botón.
*   **`nextScene`**: El `id` de la escena a la que lleva esta opción.
*   **`condition`**: Un string que se evalúa en el `CONDITION_REGISTRY` para decidir si la opción es visible/seleccionable (ej. `'has_iron_key'`).
*   **`action`**: Acciones de UI especiales (ej. `'trade'`, `'manage_camp'`).
*   **`effectId`**: Llama a una función del `EFFECT_REGISTRY` al hacer clic.
*   **`reputationChange`, `startsQuest`, etc.**: Igual que en `Scene`, pero se aplican solo si se elige esta opción.

---

## II. El Motor de Transición (`advanceScene`)

La función `advanceScene(choice)` en `store/gameSlice.ts` es el corazón del sistema. Cuando un jugador hace clic en una opción, ocurre lo siguiente en este orden exacto:

1.  **Gestión de Misiones**: Revisa si la elección (`choice`) o la nueva escena (`nextScene`) inician, actualizan o completan misiones, y llama a las funciones correspondientes.
2.  **Aplicación de Efectos**: Busca si hay un `effectId` en la elección o en la nueva escena. Si lo hay, busca la función en `services/effectRegistry.ts` y muta el estado del juego (ej. dar oro, quitar un objeto, curar al jugador).
3.  **Cambio de Reputación**: Aplica los modificadores de reputación de facciones.
4.  **Actualización de Estado**: Cambia el `currentSceneId` al nuevo destino y guarda el `previousSceneId`.
5.  **Autosave**: Dispara `triggerAutosave()` para guardar la partida automáticamente.

---

## III. Reglas Estrictas (Lo que debe tener SÍ o SÍ)

Para evitar que el juego se rompa o que las partidas guardadas se corrompan, debes seguir estas reglas de oro:

1.  **Cero Callejones sin Salida (No Dead Ends)**: Toda escena de tipo `VISUAL_NOVEL` **debe** tener al menos un `choice` válido. Si no, el jugador se quedará atascado para siempre.
2.  **Transiciones de Combate Obligatorias**: Toda escena de tipo `COMBAT` **debe** definir `onVictoryScene` y `onDefeatScene`. Si falta alguna, el juego crasheará al terminar la pelea.
3.  **Pureza de Datos en `scenes.ts`**: **NUNCA** escribas funciones anónimas directamente dentro de `data/scenes.ts` (ej. `effect: (state) => { state.gold += 10 }`). Esto rompe la serialización de Redux/Zustand y corrompe los *save files*. Usa SIEMPRE `effectId` y regístralo en `effectRegistry.ts`.
4.  **IDs Únicos**: Los `id` de las escenas deben ser únicos en todo el proyecto. Se recomienda usar prefijos (ej. `'act1_forest_intro'`, `'npc_blacksmith_talk'`).

---

## IV. Guía: Cómo Añadir Nuevo Contenido

### 1. Crear una Escena con Opciones
Abre `data/scenes.ts` y añade tu objeto:
```typescript
{
  id: 'taberna_intro',
  type: SceneType.VISUAL_NOVEL,
  text: 'Entras a la taberna. Huele a cerveza y leña.',
  backgroundImageUrl: '/images/bg/tavern.jpg',
  choices: [
    { text: 'Hablar con el tabernero', nextScene: 'taberna_hablar' },
    { text: 'Salir', nextScene: 'plaza_central' }
  ]
}
```

### 2. Crear una Opción Condicional (Ej. Requiere Oro)
1. Ve a `services/conditionRegistry.ts` y añade:
   ```typescript
   'has_10_gold': (gameState) => totalCurrencyInCopper(gameState.player.currency) >= 1000
   ```
2. En tu escena en `scenes.ts`:
   ```typescript
   choices: [
     { text: 'Comprar cerveza (10 Oro)', nextScene: 'taberna_beber', condition: 'has_10_gold' }
   ]
   ```

### 3. Crear un Efecto (Ej. Dar un Objeto)
1. Ve a `services/effectRegistry.ts` y añade:
   ```typescript
   'GIVE_MAGIC_SWORD': (gameState) => {
       const { inventory } = addItemToInventory(gameState.player.inventory, ITEMS['magic-sword']);
       return { ...gameState, player: { ...gameState.player, inventory } };
   }
   ```
2. En tu escena en `scenes.ts`:
   ```typescript
   choices: [
     { text: 'Tomar la espada de la piedra', nextScene: 'cueva_salida', effectId: 'GIVE_MAGIC_SWORD' }
   ]
   ```

---

## V. Sugerencias e Implementaciones Futuras (Modificaciones Posibles)

Aquí hay ideas para expandir el sistema y hacerlo digno de un RPG AAA:

### 1. Interpolación de Texto Dinámico (Variables en el texto)
*   **Problema**: Actualmente el texto es estático. No puedes decir "Hola, [Nombre del Jugador]".
*   **Implementación**: Crear una función utilitaria `parseSceneText(text, gameState)` que se llame en la UI antes de renderizar. Esta función buscaría tokens como `{{player.name}}` o `{{player.class}}` y los reemplazaría por los valores reales del estado.

### 2. Tiradas de Habilidad en Diálogos (Skill Checks)
*   **Problema**: Las opciones condicionales son binarias (las tienes o no las tienes).
*   **Implementación**: Añadir a `Choice` propiedades como `skillCheck: { stat: 'charisma', dc: 15, successScene: 'convince_guard', failScene: 'jail' }`. En la UI, al hacer clic, se tiraría un d20 + modificador. Si pasa, va a `successScene`, si no, a `failScene`.

### 3. Sistema de Afinidad de NPCs (Relaciones)
*   **Problema**: Usamos `globalFlags` para saber si le caemos bien a alguien, lo cual se vuelve desordenado.
*   **Implementación**: Expandir `npcState` en el `GameState`. Crear efectos como `AFFINITY_UP_BARTENDER`. En las condiciones, permitir leer `npcState['bartender'].affinity > 50` para desbloquear opciones de romance o descuentos.

### 4. Nodos de Diálogo tipo "Hub" (Volver atrás)
*   **Problema**: A veces quieres hacer 3 preguntas a un NPC y luego despedirte, pero crear la lógica de "volver al menú de preguntas" es tedioso.
*   **Implementación**: Añadir un flag en la escena `isHub: true`. Al elegir opciones que no avanzan la historia (ej. "Cuéntame sobre la ciudad"), la `nextScene` muestra el texto, pero al terminar, un botón de "Volver" lee el `previousSceneId` y te regresa al Hub automáticamente.

### 5. Herramienta de Creación Visual (Node Editor)
*   **Problema**: Escribir JSON/TS a mano para historias ramificadas gigantes es propenso a errores (typos en los `nextScene`).
*   **Implementación**: A largo plazo, crear una pequeña herramienta interna (usando librerías como React Flow) que permita arrastrar y conectar nodos visualmente, y que exporte el archivo `scenes.ts` automáticamente.
