# Nexus Chronicles: Sistema de Campamento y Descanso

El sistema de campamento está diseñado para ser un punto de progresión, recuperación y gestión de recursos para el jugador y su grupo (party). 

Actualmente, el juego cuenta con la **infraestructura de mejoras del campamento (Camp Upgrades)**, pero la acción mecánica de **Descansar (Rest)** está pendiente de implementación. Este documento detalla cómo funciona lo que ya existe y proporciona una guía paso a paso para implementar el resto del sistema.

---

## I. Estado Actual del Sistema

### 1. Mejoras de Campamento (Camp Upgrades)
El juego permite comprar mejoras para un campamento base (actualmente tematizado alrededor de la facción *Crimson Blades*).
*   **Datos (`data/campUpgrades.ts`)**: Define las mejoras disponibles (ej. `field_kitchen`, `training_grounds`, `infirmary`), su coste en oro (GP) y la descripción de sus efectos.
*   **Estado (`store/gameSlice.ts`)**: El array `campUpgrades: string[]` guarda las IDs de las mejoras que el jugador ha comprado. La función `unlockCampUpgrade(id)` descuenta el oro y añade la mejora al array.
*   **Interfaz (`components/CampUpgradeModal.tsx`)**: Una ventana modal donde el jugador puede ver y comprar estas mejoras.

### 2. El Problema Actual
Las mejoras se pueden comprar y se guardan correctamente en la partida, pero **los efectos descritos (ej. "Resting heals 100% HP") no hacen nada todavía porque la acción de "Descansar" no existe en el código.**

---

## II. Guía de Implementación: Cómo crear la función "Descansar"

Para que el campamento sea funcional, el próximo desarrollador debe implementar la lógica de descanso. Aquí tienes la hoja de ruta recomendada:

### Paso 1: Crear la acción en el Store (`store/playerSlice.ts`)

Debes crear una función `rest()` que cure al jugador y a la party, leyendo el array de `campUpgrades` para aplicar bonificadores.

```typescript
// Sugerencia de implementación para añadir a PlayerSlice
rest: () => {
    set(state => {
        if (!state.player) return state;
        
        let newPlayer = { ...state.player };
        let newParty = [...state.party];
        
        // 1. Curación Base (Ej: 50% de HP/Mana sin mejoras)
        let healPercentage = 0.5; 
        
        // 2. Leer las mejoras de campamento activas
        const hasInfirmary = state.campUpgrades.includes('infirmary');
        const hasTraining = state.campUpgrades.includes('training_grounds');
        const hasKitchen = state.campUpgrades.includes('field_kitchen');

        // Aplicar efecto de la Enfermería (Cura 100%)
        if (hasInfirmary) {
            healPercentage = 1.0; 
            // TODO: Lógica para limpiar debuffs cuando exista el sistema de estados
        }
        
        // Aplicar efecto de los Terrenos de Entrenamiento (Da XP)
        if (hasTraining) {
            newPlayer.xp += 50;
            newParty = newParty.map(c => ({ ...c, xp: c.xp + 50 }));
            // Nota: Habría que comprobar si suben de nivel aquí, 
            // similar a la función gainXp().
        }
        
        // Aplicar efecto de la Cocina de Campaña (Buff "Well Fed")
        if (hasKitchen) {
            // TODO: Añadir buff temporal al jugador
        }

        // 3. Ejecutar la curación matemática
        newPlayer.stats.hp = Math.min(newPlayer.stats.maxHp, newPlayer.stats.hp + (newPlayer.stats.maxHp * healPercentage));
        newPlayer.stats.mana = Math.min(newPlayer.stats.maxMana, newPlayer.stats.mana + (newPlayer.stats.maxMana * healPercentage));
        
        newParty = newParty.map(c => ({
            ...c,
            stats: {
                ...c.stats,
                hp: Math.min(c.stats.maxHp, c.stats.hp + (c.stats.maxHp * healPercentage))
            }
        }));

        // Opcional: Forzar un autoguardado al descansar
        // get().triggerAutosave();

        return { player: newPlayer, party: newParty };
    });
}
```

### Paso 2: Añadir el botón a la Interfaz (UI)

El jugador necesita una forma de accionar el descanso. Tienes varias opciones dependiendo del diseño del juego:

*   **Opción A (Botón Global)**: Añadir un icono de una hoguera en el `GameHeader.tsx` o dentro del menú de pausa (`GameMenuModal.tsx`).
*   **Opción B (Basado en Nodos/Escenas)**: Hacer que el descanso solo sea posible mediante una opción de diálogo (`Choice`) en escenas específicas (ej. una escena llamada "Campamento Base").
    *   *Implementación*: Añadir una nueva acción a los `Choice` en `types.ts` (ej. `action: 'rest'`) y capturarla en el `handleChoice` de `GameScreen.tsx`.

---

## III. Sugerencias y Modificaciones Posibles (Sistemas Avanzados)

Una vez que el descanso básico esté funcionando, aquí hay ideas para darle profundidad táctica y narrativa al juego:

### 1. Restricciones de Descanso (Zonas Seguras)
No debería ser posible descansar en medio de la guarida de un dragón.
*   **Implementación**: Añadir una propiedad `isSafeZone?: boolean` a la interfaz `Scene` en `types.ts`.
*   Si el jugador intenta pulsar el botón de descansar en una escena donde `isSafeZone` es falso o `undefined`, mostrar una notificación: *"No es seguro descansar aquí"*.

### 2. Coste de Recursos (Raciones)
Para evitar que el jugador "spamee" el botón de descanso después de cada pelea, el descanso debería consumir recursos.
*   **Implementación**: Crear un objeto "Raciones de Viaje" en la base de datos de items.
*   Al llamar a `rest()`, comprobar si hay raciones en el inventario. Si no hay, el descanso cura mucho menos (ej. 10%) o aplica un debuff de "Fatiga".

### 3. Diálogos de Campamento (Estilo Baldur's Gate / Dragon Age)
El campamento es el lugar ideal para desarrollar a los personajes.
*   **Implementación**: Al pulsar "Descansar", en lugar de solo curar los números, el juego hace un `advanceScene` a una escena procedimental de campamento.
*   En esta escena, aparecen opciones de diálogo para hablar con tus compañeros (`party`). Dependiendo de los eventos recientes, pueden tener iconos de exclamación para revelar su historia de fondo (Lore) o dar misiones personales.

### 4. Emboscadas Nocturnas
Si permites descansar en zonas peligrosas, añade un riesgo.
*   **Implementación**: En la función `rest()`, tirar un dado (ej. `Math.random()`). Si sale < 0.20 (20% de probabilidad), el descanso se interrumpe y se llama a `startCombat()` con enemigos aleatorios basados en la zona actual.

### 5. Nuevas Mejoras de Campamento
Para expandir `data/campUpgrades.ts`:
*   **Mesa de Cartografía (Cartographer's Table)**: Revela opciones de diálogo ocultas o atajos en ciertas escenas.
*   **Puesto de Alquimia (Alchemy Station)**: Desbloquea un nuevo Modal (`activeModal: 'crafting'`) accesible solo desde el campamento para crear pociones.
*   **Tienda del Mercader (Quartermaster)**: Un NPC que se une permanentemente a tu campamento y renueva su inventario cada vez que descansas o subes de nivel.
