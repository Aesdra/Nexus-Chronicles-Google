# Nexus Chronicles: Hechizos y Habilidades

Este documento explica cómo se definen, configuran y desbloquean los hechizos (Spells), habilidades marciales (Martial Abilities) y habilidades pasivas (Skills/Feats) en *Nexus Chronicles*.

---

## I. Hechizos (Spells)

Los hechizos consumen **Maná** (`manaCost`) y están definidos en `data/spells.ts`. Siguen la interfaz `Spell` de `types.ts`.

### 1. Estructura de un Hechizo
```typescript
{
    slug: 'fire-bolt',
    name: 'Fire Bolt',
    desc: 'Lanza una mota de fuego arremolinado a una criatura.',
    higher_level: 'El daño aumenta en niveles superiores.',
    range: '120 feet',
    components: 'V, S',
    material: '',
    ritual: false,
    duration: 'Instantaneous',
    concentration: false,
    casting_time: '1 action',
    level: 0, // 0 = Truco (Cantrip), 1+ = Hechizo de nivel
    school: 'Evocation',
    dnd_class: 'Sorcerer, Wizard', // Clases que pueden aprenderlo
    manaCost: 5,
    targetType: 'enemy', // 'enemy', 'ally', 'self'
    actionId: 'fire-bolt', // Enlace con la lógica de combate
}
```

### 2. Requisitos de Clase y Nivel
El sistema de subida de nivel (`components/LevelUpPrompt.tsx` o selectores similares) filtra los hechizos disponibles para el jugador basándose en dos propiedades clave:
*   `dnd_class`: Una cadena separada por comas (ej. `'Sorcerer, Wizard'`). Si el `id` o `name` de la clase del jugador está en esta lista, el hechizo es elegible.
*   `level`: El nivel del hechizo. El jugador solo puede aprender hechizos de un nivel igual o inferior al nivel máximo de hechizo que su clase le permite lanzar en su nivel actual.

---

## II. Habilidades Marciales (Martial Abilities)

Las habilidades marciales consumen **Stamina** (`staminaCost`) y están definidas en `data/martialAbilities.ts`. Siguen la interfaz `MartialAbility`.

### 1. Estructura de una Habilidad Marcial
```typescript
{
    id: 'power-strike',
    name: 'Power Strike',
    description: 'Un ataque concentrado y poderoso que inflige daño adicional.',
    staminaCost: 5,
    targetType: 'enemy', // 'enemy', 'ally', 'self'
    actionId: 'power-strike', // Enlace con la lógica de combate
}
```

### 2. Desbloqueo de Habilidades Marciales
A diferencia de los hechizos, las habilidades marciales suelen estar ligadas a clases cuerpo a cuerpo (Fighter, Barbarian, Rogue). El juego otorga estas habilidades durante la creación del personaje o al subir de nivel, basándose en la progresión específica de la clase o subclase del jugador.

---

## III. Habilidades Pasivas (Skills / Feats)

Las habilidades pasivas otorgan bonificaciones permanentes a las estadísticas o modifican mecánicas del juego sin requerir una acción en combate. Se definen en `data/skills.ts` o `data/feats.ts` (dependiendo de la implementación específica).

### 1. Estructura de una Habilidad Pasiva (Skill)
```typescript
{
    id: 'stealth',
    name: 'Stealth',
    description: 'Capacidad para moverse sin ser detectado.',
    attribute: 'dexterity', // Atributo base que modifica la habilidad
}
```

### 2. Dotes (Feats)
Las Dotes son habilidades especiales que el jugador puede elegir en ciertos niveles (ej. nivel 4, 8, 12).
```typescript
{
    id: 'tough',
    name: 'Tough',
    description: 'Tu máximo de puntos de golpe aumenta en 2 por cada nivel.',
    prerequisites: [], // Requisitos (ej. Fuerza 13+)
    applyEffect: (player) => { ... } // Función que modifica permanentemente al jugador
}
```

---

## IV. Cómo Implementar un Nuevo Hechizo o Habilidad (Guía Paso a Paso)

Para añadir un nuevo poder al juego, debes seguir estos dos pasos obligatorios. **Separar los datos de la lógica es fundamental en esta arquitectura.**

### Paso 1: Definir los Datos (El "Qué")
1.  Abre `data/spells.ts` (si es mágico) o `data/martialAbilities.ts` (si es físico).
2.  Crea un nuevo objeto siguiendo la interfaz correspondiente.
3.  Asigna un `actionId` único (ej. `'mi-nuevo-ataque'`).
4.  Configura el coste (`manaCost` o `staminaCost`), el tipo de objetivo (`targetType`) y las clases permitidas (`dnd_class`).

### Paso 2: Programar la Lógica (El "Cómo")
1.  Abre `services/actionRegistry.ts`.
2.  Añade una nueva entrada al objeto `ACTION_REGISTRY` usando el `actionId` exacto que definiste en el Paso 1.
3.  Escribe la función `resolve(source, target, combatants)`.
4.  La función **DEBE** retornar un array de eventos (`CombatEvent[]`) que el motor de combate procesará.

**Ejemplo de Implementación Completa:**

*En `data/spells.ts`:*
```typescript
'rayo-congelante': {
    slug: 'rayo-congelante',
    name: 'Rayo Congelante',
    desc: 'Lanza un rayo de hielo. Puede ralentizar al objetivo.',
    // ... otros campos ...
    manaCost: 8,
    targetType: 'enemy',
    actionId: 'rayo-congelante', // <--- CLAVE
}
```

*En `services/actionRegistry.ts`:*
```typescript
'rayo-congelante': { // <--- DEBE COINCIDIR
    resolve: (source, target) => {
        const events: CombatEvent[] = [];
        
        // 1. Daño de Frío
        events.push({
            type: 'ATTACK_RESOLVED',
            sourceId: source.id,
            targetId: target.id,
            hit: true,
            damage: 12,
            damageType: DamageType.COLD,
            abilityId: 'rayo-congelante'
        });

        // 2. Efecto de Ralentización (50% de probabilidad)
        if (Math.random() < 0.50) { 
            events.push({
                type: 'STATUS_APPLIED',
                targetId: target.id,
                effect: {
                    name: 'Congelado',
                    type: 'SLOWED',
                    duration: 1,
                    sourceId: source.id,
                }
            });
        }
        return events;
    }
}
```

Con estos dos pasos, el hechizo aparecerá en el menú de combate, consumirá maná correctamente, aplicará el daño y los estados alterados, y se registrará en el log de batalla.
