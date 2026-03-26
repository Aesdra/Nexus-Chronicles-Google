# Nexus Chronicles: Sistema de Combate

Este documento explica el funcionamiento interno del sistema de combate por turnos en *Nexus Chronicles*. Está diseñado para que los desarrolladores entiendan el flujo de batalla, cómo se procesan las acciones y cómo interactúan los diferentes sistemas.

---

## I. Arquitectura General (El Bucle de Combate)

El combate es una máquina de estados gestionada por Zustand en `store/combatSlice.ts`. No funciona con llamadas directas, sino a través de una **Cola de Eventos (`eventQueue`)**.

### 1. Inicio del Combate (`startCombat`)
Cuando una escena desencadena un combate, se llama a `startCombat(scene)`.
*   **Conversión a Combatientes**: El jugador, los compañeros (`party`), los enemigos y los aliados temporales se convierten en objetos estandarizados de tipo `Combatant`. Esto unifica sus estadísticas (HP, Mana, Stamina, Speed, Armor Class).
*   **Orden de Turnos (`turnOrder`)**: Se calcula ordenando a todos los combatientes de mayor a menor `speed` (basado en la Destreza).
*   **Primer Evento**: Se inyecta el evento inicial `{ type: 'TURN_START', combatantId: ... }` en la cola.

### 2. La Cola de Eventos (`processNextCombatEvent`)
El motor procesa los eventos uno a uno. Los tipos de eventos (`CombatEvent`) más importantes son:
*   `TURN_START`: Inicia el turno. Si el combatiente está aturdido (`STUNNED`), salta el turno. Si es la IA, decide su acción (`getAIAction`).
*   `ACTION_CHOSEN`: El jugador o la IA han decidido qué hacer (Atacar, Hechizo, Habilidad). Aquí se descuenta el Maná o Stamina.
*   `ATTACK_RESOLVED` / `HEAL_RESOLVED`: Aplica el daño o la curación matemática al estado de los combatientes.
*   `STATUS_APPLIED`: Aplica un estado alterado (ej. Veneno, Quemadura).
*   `COMBATANT_DEFEATED`: Marca a un combatiente como derrotado (HP <= 0). Comprueba si el combate ha terminado.
*   `TURN_END`: Reduce la duración de los estados alterados y pasa el turno al siguiente combatiente vivo en el `turnOrder`.
*   `COMBAT_END`: Finaliza el combate, otorga recompensas (XP, Loot) y redirige a la escena de victoria o derrota.

---

## II. Resolución de Acciones (`actionRegistry.ts`)

Para mantener el código modular, la definición de un hechizo/habilidad está separada de su lógica. Cuando se procesa un `ACTION_CHOSEN`, el motor busca el `actionId` en `services/actionRegistry.ts`.

### El Registro de Acciones
El `ACTION_REGISTRY` es un diccionario donde cada clave es un `actionId` y su valor es una función `resolve`.

**Ejemplo de Lógica (Bola de Fuego):**
```typescript
'fire-bolt': {
    resolve: (source, target) => {
        const events: CombatEvent[] = [];
        
        // 1. Evento de daño directo
        events.push({
            type: 'ATTACK_RESOLVED',
            sourceId: source.id,
            targetId: target.id,
            hit: true,
            damage: 10,
            damageType: DamageType.FIRE,
            abilityId: 'fire-bolt'
        });

        // 2. Probabilidad del 25% de aplicar quemadura
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
        return events; // Estos eventos se inyectan en la cola
    }
}
```

---

## III. Cálculos de Combate (`combatCalculations.ts`)

Toda la matemática de combate (tiradas de ataque, cálculo de armadura, modificadores de daño) se centraliza en `services/combatCalculations.ts`.
*   `getModifiedAttackBonus(combatant)`: Suma el bonus base + modificadores de estados alterados (ej. `ATTACK_BUFF`).
*   `getModifiedArmorClass(combatant)`: Suma la AC base + modificadores (ej. `ARMOR_DEBUFF`).
*   `getModifiedDamage(combatant, baseDamage)`: Calcula el daño final.

---

## IV. Estados Alterados (Status Effects)

Los estados alterados se guardan en el array `statusEffects` de cada `Combatant`.

### Estructura de un Estado
```typescript
{
    name: 'Corroding',
    type: 'ARMOR_DEBUFF', // Tipo de estado
    duration: 2,          // Turnos restantes
    bonus: 2,             // Valor del efecto (ej. reduce 2 de armadura)
    sourceId: 'player'
}
```

### Tipos de Estados Soportados (`StatusEffectType`)
*   `DAMAGE_OVER_TIME`: Causa daño periódico (Veneno, Fuego).
*   `ATTACK_BUFF` / `ATTACK_DEBUFF`: Modifica la tirada de ataque.
*   `ARMOR_BUFF` / `ARMOR_DEBUFF`: Modifica la Clase de Armadura (AC).
*   `STUNNED`: Hace que el combatiente pierda su turno.
*   `TAUNTED`: Obliga al combatiente a atacar a un objetivo específico (aggro).
*   `DISARMED`: Reduce el daño del arma.
*   `SLOWED`: (Actualmente conceptual, podría afectar el `turnOrder`).
*   `MAX_HP_BUFF`: Aumenta temporalmente la vida máxima.

### Ciclo de Vida del Estado
1.  Se aplica mediante el evento `STATUS_APPLIED`.
2.  Sus efectos pasivos (como `ARMOR_DEBUFF`) son leídos automáticamente por `combatCalculations.ts`.
3.  Sus efectos activos (como `DAMAGE_OVER_TIME`) se procesan al inicio o final del turno (dependiendo del `trigger`).
4.  En el evento `TURN_END`, su `duration` se reduce en 1. Si llega a 0, se elimina.
