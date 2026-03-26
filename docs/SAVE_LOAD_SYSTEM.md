# Nexus Chronicles: Sistema de Guardado y Persistencia

El sistema de guardado es uno de los pilares más críticos de un RPG. En *Nexus Chronicles*, utilizamos una combinación de **Zustand** (para el estado en memoria) e **IndexedDB a través de Dexie** (para la persistencia en el navegador).

Este documento explica cómo funciona el ciclo de guardado/carga y, lo más importante, **cómo modificar el estado del juego sin corromper las partidas guardadas de los jugadores**.

---

## I. Arquitectura General

El juego maneja dos conceptos principales de estado:

1.  **`GameState` (Estado en Memoria):** Es la interfaz completa que vive en Zustand (`store/store.ts`). Contiene absolutamente todo lo que está pasando en el juego en este milisegundo.
2.  **`GameSave` (Estado Persistente):** Es una versión "limpia" del `GameState` que se guarda en la base de datos. Excluye datos temporales (transient state) que no deberían guardarse.

### ¿Qué NO se guarda? (Transient State)
Si miras la función `savableState` en `store/gameSlice.ts`, verás que omitimos cosas como:
*   `combatState`: Si el jugador cierra el navegador en medio de un combate, al volver aparecerá antes de que empezara el combate.
*   `tradeSession`: Las ventanas de comercio activas.
*   `isHydrated` / `autosaveNotificationVisible`: Estados puramente de la UI.

---

## II. La Base de Datos (`db.ts`)

Utilizamos **Dexie.js** como un wrapper sobre IndexedDB.

### Versionado (¡CRÍTICO!)
IndexedDB es estricto con los esquemas. Si necesitas añadir una nueva "tabla" (store) a la base de datos, **NUNCA** modifiques la versión actual. Debes crear una nueva versión y re-declarar todas las tablas anteriores.

```typescript
// Ejemplo en db.ts
// Versión actual
db.version(4).stores({
  gameSaves: '&id',
  spells: '&slug',
  backgrounds: '&slug',
  currencies: '&slug',
  items: '&id',
});

// Si mañana añades una tabla de 'achievements':
db.version(5).stores({
  gameSaves: '&id',
  spells: '&slug',
  backgrounds: '&slug',
  currencies: '&slug',
  items: '&id',
  achievements: '&id', // NUEVA TABLA
});
```
*Nota: Para el estado del jugador (`GameSave`), no necesitas cambiar la versión de la base de datos si solo añades una nueva propiedad al objeto JSON del jugador. El versionado es solo para nuevas tablas o índices.*

---

## III. El Ciclo de Guardado (`saveGameToSlot`)

Ubicado en `store/gameSlice.ts`.

1.  **Extracción:** Se llama a `savableState(get())` para limpiar el estado actual.
2.  **Escritura:** Se usa `db.gameSaves.put(...)` para guardar o sobrescribir el slot.
3.  **Autoguardado (`triggerAutosave`):** El juego guarda automáticamente en el `slot 1` cuando ocurren eventos importantes en `advanceScene` (ej. cambiar de fondo/escenario, empezar o completar una misión).

---

## IV. El Ciclo de Carga (Hidratación)

Ubicado en la función `hydrate` de `store/gameSlice.ts`. Este es el punto más delicado del sistema.

Cuando el juego carga una partida de IndexedDB, inyecta ese objeto directamente en Zustand. **Si el jugador tiene un save de hace 3 meses, ese objeto no tendrá las variables que tú programaste ayer.**

### Manejo de Partidas Antiguas (Legacy Saves)
Siempre debes proporcionar valores por defecto (fallbacks) en la función `hydrate` para evitar que el juego crashee al leer propiedades `undefined`.

**Ejemplo real del código:**
En el pasado, el juego solo soportaba un compañero (`savedState.companion`). Luego se actualizó para soportar múltiples (`savedState.party`). Mira cómo `hydrate` maneja la migración:

```typescript
// En hydrate(savedState)
let party = savedState.party || [];
// Si no hay party, pero existe el viejo 'companion', lo convertimos:
if (!party.length && (savedState as any).companion) {
    party = [(savedState as any).companion];
}

set({ 
    ...savedState, 
    party, // Usamos la variable migrada
    npcState: savedState.npcState || {}, // Fallback si no existía
    quests: savedState.quests || {},     // Fallback si no existía
    isHydrated: true 
});
```

---

## V. Guía: Cómo añadir una nueva variable al estado

Si necesitas que el juego recuerde algo nuevo (ej. `totalDeaths: number`), sigue **ESTRICTAMENTE** estos 4 pasos:

1.  **Añadir a los Tipos (`types.ts`):**
    Añade `totalDeaths: number` a la interfaz `GameState` y a `GameSave`.
2.  **Añadir al Estado Inicial (`store/gameSlice.ts`):**
    Dentro de `initializeNewGame`, añade `totalDeaths: 0` al `initialState`.
3.  **Añadir a `savableState` (`store/gameSlice.ts`):**
    Asegúrate de incluirlo en el objeto que retorna la función para que se guarde en la BD.
    ```typescript
    const savableState = (state: GameStore) => ({
      // ...
      totalDeaths: state.totalDeaths,
    });
    ```
4.  **Añadir Fallback en `hydrate` (¡El paso que todos olvidan!):**
    ```typescript
    hydrate: (savedState) => {
      set({ 
          ...savedState, 
          // Si el save es viejo, totalDeaths será undefined. Le damos un 0.
          totalDeaths: savedState.totalDeaths || 0, 
          isHydrated: true 
      });
    }
    ```

---

## VI. Posibles Ampliaciones (Para futuros desarrolladores)

Actualmente el sistema guarda automáticamente en el `slot 1`. Aquí hay ideas para expandirlo:

1.  **Múltiples Slots de Guardado (UI):**
    *   *Implementación*: Crear un modal en el menú principal que lea todos los registros de `db.gameSaves.toArray()`. Permitir al jugador elegir en qué `slotId` guardar (1, 2, 3...) llamando a `saveGameToSlot(id)`.
2.  **Exportar/Importar Partidas (JSON):**
    *   *Implementación*: Añadir un botón en opciones que haga un `JSON.stringify` del `GameSave` y lo descargue como un archivo `.txt` o `.json`. Para importar, leer el archivo, parsearlo y pasarlo a la función `hydrate`. ¡Ideal para que los jugadores compartan partidas o hagan backups!
3.  **Guardado en la Nube (Firebase/Supabase):**
    *   *Implementación*: Si se añade autenticación de usuarios, se puede crear un middleware que, cada vez que se llame a `saveGameToSlot`, envíe una copia del `GameSave` a una base de datos remota. Al iniciar sesión en otro dispositivo, se descarga el JSON y se llama a `hydrate`.
