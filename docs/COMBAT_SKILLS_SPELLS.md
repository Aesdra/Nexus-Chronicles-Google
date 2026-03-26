# Nexus Chronicles: Sistema de Combate, Habilidades y Hechizos

El sistema de combate de *Nexus Chronicles* es un motor de combate por turnos, impulsado por eventos y gestionado por un estado centralizado en Zustand. Está diseñado para ser altamente modular, separando los datos (definiciones de hechizos) de la lógica (cómo se resuelven los ataques).

Este documento detalla la arquitectura del motor de combate, cómo se procesan los turnos, y cómo añadir nuevas habilidades, hechizos y estados alterados.

---

## I. Arquitectura del Motor de Combate

El combate está encapsulado en el slice `store/combatSlice.ts`. Cuando se inicia un combate, se crea un objeto `CombatState` temporal que vive dentro del estado global del juego.

### 1. El Estado de Combate (`CombatState`)
*   **`combatants`**: Un array de objetos `Combatant`. Aquí se copian el jugador, los compañeros (party) y los enemigos. *Nota: Las estadísticas se copian al inicio del combate. Los cambios de HP/Mana durante el combate ocurren aquí, y solo se sincronizan con el jugador real al finalizar el combate.*
*   **`turnOrder`**: Un array de IDs de combatientes ordenados por su estadística de Velocidad (Iniciativa).
*   **`currentTurnId`**: El ID del combatiente que está actuando actualmente.
*   **`eventQueue`**: El corazón del sistema. Un array de `CombatEvent` que se procesan secuencialmente.
*   **`log`**: Un historial de texto de lo que ocurre en el combate (ej. "Player hits Goblin for 5 damage").

### 2. El Bucle de Eventos (Event-Driven Combat)
El combate no ocurre de forma instantánea. Funciona mediante una cola de eventos (`eventQueue`) procesada por la función `processNextCombatEvent`.

Los tipos de eventos principales son:
*   `TURN_START`: Inicia el turno de un personaje. Si es la IA, decide su acción aquí.
*   `ACTION_CHOSEN`: El jugador o la IA han elegido qué hacer (Atacar, Hechizo, Habilidad). Esto deduce el coste (Mana/Stamina) y llama al `ACTION_REGISTRY` para generar los eventos resultantes.
*   `ATTACK_RESOLVED` / `HEAL_RESOLVED`: Aplica el daño o la curación a los HP del objetivo.
*   `STATUS_APPLIED`: Aplica un buff o debuff a un combatiente.
*   `COMBATANT_DEFEATED`: Marca a un combatiente como derrotado. Comprueba si el combate ha terminado.
*   `TURN_END`: Reduce la duración de los estados alterados (Status Effects) y pasa el turno al siguiente combatiente vivo.
*   `COMBAT_END`: Finaliza el combate, calcula la experiencia (XP) y el botín (Loot).

---

## II. Habilidades Marciales y Hechizos

El juego separa estrictamente la *descripción* de una habilidad de su *ejecución*.

### 1. Los Datos (`data/spells.ts` y `data/martialAbilities.ts`)
Aquí se definen los metadatos visuales y de coste.
*   **`slug` / `id`**: El identificador único.
*   **`name`, `desc`**: Textos para la interfaz.
*   **`manaCost` / `staminaCost`**: El coste del recurso.
*   **`targetType`**: `'enemy'`, `'ally'`, o `'self'`. Define a quién puedes hacer clic en la UI.
*   **`actionId`**: **¡CRÍTICO!** Este es el puente hacia la lógica. Indica qué función del `ACTION_REGISTRY` debe ejecutarse.

### 2. La Lógica (`services/actionRegistry.ts`)
El `ACTION_REGISTRY` es un diccionario que mapea un `actionId` a una función `resolve(source, target, allCombatants)`.

Esta función **no modifica el estado directamente**. Su único trabajo es devolver un array de `CombatEvent` que el motor de combate procesará a continuación.

**Ejemplo: Cómo funciona `fire-bolt`**
```typescript
'fire-bolt': {
    resolve: (source, target) => {
        const events: CombatEvent[] = [];
        // 1. Evento de Daño Base
        events.push({
            type: 'ATTACK_RESOLVED',
            sourceId: source.id,
            targetId: target.id,
            hit: true,
            damage: 10,
            damageType: DamageType.FIRE,
            abilityId: 'fire-bolt'
        });

        // 2. Efecto Secundario (25% de probabilidad de Quemar)
        if (Math.random() < 0.25) { 
            events.push({
                type: 'STATUS_APPLIED',
                targetId: target.id,
                effect: {
                    name: 'Burning',
                    type: 'DAMAGE_OVER_TIME',
                    duration: 2,
                    damage: { amount: 3, type: DamageType.FIRE },
                    trigger: 'start-of-turn',
                    sourceId: source.id,
                }
            });
        }
        return events;
    }
}
```

---

## III. Guía: Cómo Añadir un Nuevo Hechizo o Habilidad

Añadir una nueva habilidad requiere exactamente dos pasos:

1.  **Definir los Datos**:
    *   Para hechizos: Añade un objeto a `SPELLS` en `data/spells.ts`.
    *   Para habilidades físicas: Añade un objeto a `MARTIAL_ABILITIES` en `data/martialAbilities.ts`.
    *   Asegúrate de darle un `actionId` único (ej. `actionId: 'mi-nuevo-hechizo'`).
2.  **Definir la Lógica**:
    *   Abre `services/actionRegistry.ts`.
    *   Añade una nueva entrada al objeto `ACTION_REGISTRY` usando el `actionId` que creaste en el paso 1.
    *   Escribe la función `resolve` para que devuelva los eventos de daño, curación o estado correspondientes.

---

## IV. Estados Alterados (Status Effects)

Los estados alterados (Buffs/Debuffs) se aplican mediante el evento `STATUS_APPLIED`.
Actualmente, el motor soporta los siguientes tipos (`StatusEffectType` en `types.ts`):

*   `DAMAGE_OVER_TIME`: (Ej. Veneno, Quemadura). *Nota: Actualmente la lógica de aplicar el daño al inicio del turno está pendiente de implementarse en el `TURN_START` de `combatSlice.ts`.*
*   `STUNNED`: Salta el turno del combatiente. (Implementado en `TURN_START`).
*   `ATTACK_BUFF` / `ATTACK_DEBUFF`: Modifica la tirada de ataque. (Implementado en `services/combatCalculations.ts`).
*   `ARMOR_BUFF` / `ARMOR_DEBUFF`: Modifica la Clase de Armadura (AC). (Implementado en `services/combatCalculations.ts`).
*   `TAUNTED`: Obliga a atacar a un objetivo específico.
*   `DISARMED`: Reduce el daño infligido.
*   `SLOWED`: Reduce la AC o la iniciativa.

---

## V. Sugerencias e Implementaciones Futuras

Para el próximo desarrollador, aquí hay áreas clave para expandir el sistema de combate:

### 1. Implementar el Daño en el Tiempo (DoT)
*   **Problema**: El estado `DAMAGE_OVER_TIME` se puede aplicar, pero el daño no se resta automáticamente.
*   **Solución**: En `store/combatSlice.ts`, dentro del `case 'TURN_START':`, iterar sobre `combatant.statusEffects`. Si hay un efecto de tipo `DAMAGE_OVER_TIME`, inyectar un evento `ATTACK_RESOLVED` (o crear un nuevo evento `DOT_TICK`) al principio de la cola de eventos antes de que el combatiente actúe.

### 2. Sistema de Resistencias y Vulnerabilidades
*   **Problema**: El daño elemental (`DamageType.FIRE`, `ICE`, etc.) existe en los eventos, pero los enemigos reciben el daño completo independientemente de su tipo.
*   **Solución**: Añadir `resistances: DamageType[]` y `vulnerabilities: DamageType[]` a la interfaz `Enemy` y `Combatant`. En `combatSlice.ts`, dentro de `case 'ATTACK_RESOLVED':`, multiplicar el `event.damage` por 0.5 si es resistente, o por 2 si es vulnerable, antes de restarlo de los HP.

### 3. Hechizos de Área de Efecto (AoE) Reales
*   **Problema**: Hechizos como *Fireball* requerirían seleccionar múltiples objetivos. Actualmente `targetType` solo permite seleccionar a un enemigo.
*   **Solución**: Añadir un `targetType: 'all_enemies'`. En la UI (`CombatScreen.tsx`), si se selecciona un hechizo AoE, omitir la fase de "seleccionar objetivo" y pasar un array de IDs (o un flag especial) a `playerChooseAction`. En el `actionRegistry`, iterar sobre todos los enemigos vivos y generar un evento `ATTACK_RESOLVED` para cada uno.

### 4. IA de Enemigos Más Inteligente
*   **Problema**: Actualmente, la IA (`services/aiService.ts`) elige acciones de forma muy básica.
*   **Solución**: Expandir `aiService.ts` para que los enemigos evalúen el estado del combate. Por ejemplo, si un aliado tiene menos del 30% de HP, usar una habilidad de curación. Si el jugador tiene un buff poderoso, usar una habilidad de "Dispel".

### 5. Fórmulas de Daño Dinámicas
*   **Problema**: El daño en `actionRegistry.ts` a menudo está *hardcodeado* (ej. `damage: 10`).
*   **Solución**: Modificar la función `resolve` para que lea las estadísticas del `source` (ej. `source.stats.intelligence`) y calcule el daño dinámicamente (ej. `damage: 1d10 + getModifier(source.stats.intelligence)`). Se puede crear una función de utilidad `rollDice(count, sides)` para esto.
