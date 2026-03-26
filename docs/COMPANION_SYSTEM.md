# Nexus Chronicles: Sistema de Compañeros

Este documento describe el diseño y la implementación del sistema de compañeros, centrándose en hacer que los compañeros se sientan como personajes vivos y reactivos en lugar de simples mascotas de combate.

## Filosofía Principal

1.  **Compañeros como Entidades Paralelas:** Cada compañero es tratado como un personaje paralelo al jugador. Tienen sus propias estadísticas, motivaciones y reacciones al mundo. Su propósito principal es enriquecer la narrativa y proporcionar una perspectiva diferente sobre el viaje del jugador.

2.  **La Afinidad como Mecánica Central:** El sistema central que rige la relación jugador-compañero es la **Afinidad**. Este es un valor numérico de 0 a 100 que representa la confianza, la lealtad y el sentimiento general del compañero hacia el jugador.

3.  **Reactividad Narrativa:** Los compañeros no son compañeros silenciosos. Su aprobación o desaprobación de las acciones del jugador impulsa la relación, desbloqueando nuevo contenido y alterando las interacciones existentes.

## I. Reclutamiento (Cómo entran al grupo)

Los compañeros no se unen automáticamente; el jugador debe encontrarlos en el mundo y tomar decisiones que permitan su reclutamiento.

1.  **Encuentro Narrativo:** El jugador interactúa con el NPC en una escena específica (ej. encontrar a Lyra en el bosque o a Vespera en una emboscada).
2.  **Decisión del Jugador:** A través de las opciones de diálogo (`choices`), el jugador puede invitar al NPC a unirse, rechazarlo, o incluso atacarlo.
3.  **Ejecución del Efecto:** Si el jugador elige reclutarlo, se dispara un efecto en `services/effectRegistry.ts` (ej. `LYRA_JOINS_PARTY` o `RECRUIT_VESPERA`).
    *   Este efecto busca los datos base del compañero en `data/companions.ts`.
    *   Añade el objeto del compañero al array `gameState.party`.
    *   Actualiza los `globalFlags` (ej. `metLyra: true`, `recruited_vespera: true`) para que el juego recuerde esta decisión y no vuelva a mostrar la escena de reclutamiento.

## II. Afinidad y Decisiones

La Afinidad es la medida de tu relación con un compañero. Se ve influenciada por:

-   **Opciones de Diálogo (Decisiones):** Respuestas empáticas, respetuosas o de apoyo generalmente aumentarán la afinidad. Respuestas agresivas, despectivas o egoístas la disminuirán.
-   **Acciones del Jugador:** Las decisiones morales importantes en las misiones (ej. mostrar piedad vs. ser despiadado) tendrán un impacto significativo en la afinidad, dependiendo de la personalidad del compañero.
-   **Misiones de Compañero:** Completar con éxito la línea de misiones personales de un compañero proporcionará un gran aumento de afinidad.

### Rangos de Afinidad

| Rango | Nivel | Efecto Narrativo | Efecto Mecánico |
| :--- | :--- | :--- | :--- |
| 0 - 20 | **Hostil** | Se niega a hablar; puede abandonar el grupo. | -10% Rendimiento en Combate (Planeado). |
| 21 - 40 | **Frío** | Diálogo mínimo; estrictamente profesional. | Sin bonificaciones. |
| 41 - 60 | **Neutral** | Interacciones estándar. | Sin bonificaciones. |
| 61 - 80 | **Amistoso** | Comparte su historia; desbloquea misiones personales. | +5% Bonificación de Estadísticas (Planeado). |
| 81 - 100 | **Leal** | Confía plenamente en el jugador; posible romance. | **Beneficio de Afinidad (Sinergia)** activo. |

### Beneficios de Afinidad y Sinergias (Activo)
Cuando un compañero alcanza el rango **Leal** (81+ Afinidad), otorga al jugador una bonificación pasiva o sinergia (calculada en `playerSelectors.ts`):
-   **Lyra:** +2 Sabiduría (Sentidos agudos). Sinergia ideal para clases basadas en Sabiduría (Clérigo, Druida) o para mejorar la percepción en diálogos.
-   **Vespera:** +2 Destreza (Hipervigilancia). Sinergia ideal para clases marciales ágiles (Pícaro, Explorador) o para atacar primero en combate.

## III. Personalidad y Arquetipos

Cada compañero está construido alrededor de un perfil psicológico central definido por tres medidores (0.0 a 1.0):

-   **Agresividad:** Probabilidad de sugerir soluciones violentas o tomar riesgos en combate.
-   **Precaución:** Valor otorgado a la supervivencia y la planificación.
-   **Altruismo:** Disposición para ayudar a otros a un costo personal.

### Compañeros Actuales
-   **Lyra (Exploradora Pragmática):** Alta Precaución (0.6), Agresividad Moderada (0.7), Bajo Altruismo (0.4). Valora la eficiencia y los resultados.
-   **Vespera (Fantasma Traumatizada):** Muy Alta Agresividad (0.9), Muy Alta Precaución (0.9), Muy Bajo Altruismo (0.1). Hipervigilante y hostil; ve la amabilidad como una amenaza.

## IV. Implementación Técnica

### Estructuras de Datos (`types.ts`)
La interfaz `Companion` es un modelo de personaje completo:
```typescript
export interface Companion {
  id: string;
  name: string;
  affinity: number;
  personality: { aggression: number; caution: number; altruism: number };
  stats: Record<Stat, number> & { hp: number; maxHp: number; ... };
  // ... equipo, hechizos, habilidades
}
```

### Gestión del Estado (`store/gameSlice.ts`)
El estado del juego gestiona un array de compañeros:
```typescript
export interface GameState {
  party: Companion[]; // Grupo activo actual
  // ...
}
```

### Cálculo de Estadísticas (`store/selectors/playerSelectors.ts`)
Los beneficios de afinidad se aplican en `selectFinalStats` durante la derivación final de las estadísticas.

### Comprobación de Condiciones (`services/conditionRegistry.ts`)
Las comprobaciones de presencia y afinidad se manejan a través del `CONDITION_REGISTRY`.
-   `IS_LYRA`: Comprueba si Lyra está en el grupo.
-   `LYRA_AFFINITY_HIGH_80`: Comprueba si la afinidad de Lyra es 80 o superior.

### Modificar la Afinidad (`services/effectRegistry.ts`)
Los cambios de afinidad se manejan a través del `EFFECT_REGISTRY`. Esto asegura que la lógica esté desacoplada de los datos de la escena.
```typescript
// Ejemplo: Aumentar la afinidad de Lyra
LYRA_AFFINITY_PLUS_10: (gameState) => {
    const newParty = gameState.party.map(c => {
        if (c.id === 'lyra') {
            return { ...c, affinity: Math.min(100, c.affinity + 10) };
        }
        return c;
    });
    return { ...gameState, party: newParty };
},
```

## V. Diálogos e Intervenciones de Compañeros (Activo)

Los compañeros pueden intervenir en las escenas, ofreciendo diálogos únicos u opciones basadas en su presencia en el grupo.

### 1. Ejemplo de Implementación
En `data/scenes.ts`, se puede añadir una opción (`choice`) que solo aparezca si un compañero específico está en el grupo:
```typescript
{ 
  text: "[Lyra] 'Esa figura... la he visto antes.'", 
  nextScene: 'lyra_remark_herald', 
  condition: 'IS_LYRA' 
}
```
Esto permite una narrativa dinámica donde los compañeros reaccionan al entorno y a las acciones del jugador, lo que potencialmente afecta su Afinidad.

### 2. Texto Dinámico (Planeado)
En el futuro, el texto de la `Scene` podría procesarse para incluir comentarios de los compañeros directamente en la descripción:
`"La puerta está cerrada a cal y canto. {lyra: 'Podría intentar forzarla, pero parece que tiene una trampa.'}"`

## VI. Expansión Futura

-   **Misiones de Compañero:** Rastreables a través de `questlineId`.
-   **Romance:** Impulsado por `sexualOrientation` y `Afinidad >= 90`.
-   **IA de Combate:** Usar los valores de `personalidad` para dictar el comportamiento (ej. Vespera priorizando objetivos con bajos HP debido a su alta agresividad).
-   **Interacciones en el Campamento:** Un tipo de escena dedicada para hablar con los compañeros durante un descanso largo.
