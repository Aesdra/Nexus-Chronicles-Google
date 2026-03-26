# Nexus Chronicles: Referencia de Rangos de Facciones

Este documento es una guía de referencia rápida sobre los rangos desbloqueables actuales para las facciones del juego, los umbrales de reputación necesarios para alcanzarlos y las recompensas asociadas (objetos desbloqueados en las tiendas de los NPCs).

---

## Facciones con Rangos Definidos

Actualmente, tres facciones tienen un sistema de progresión de rangos completamente definido en `data/factions.ts` y recompensas asignadas en `data/npcs.ts`.

### 1. El Sindicato de las Sombras (The Shadow Syndicate)
*Organización criminal que controla el mercado negro y el contrabando.*

| Rango | Reputación Necesaria | Recompensas Desbloqueadas (Tiendas) |
| :--- | :--- | :--- |
| **Outsider** | -100 | *(Hostil)* |
| **Neutral** | 0 | *(Rango inicial)* |
| **Asset** | 10 | - |
| **Agent** | 25 | **Venomous Dagger** (Vendido por *Elara Meadowlight*) |
| **Shadow** | 50 | - |
| **Mastermind** | 75 | **Hexblade's Shadow-Touched Blade** (Vendido por *Elara Meadowlight*) |

---

### 2. Las Espadas Carmesí (The Crimson Blades)
*Compañía de mercenarios conocida por su brutalidad y lealtad a los contratos.*

| Rango | Reputación Necesaria | Recompensas Desbloqueadas (Tiendas) |
| :--- | :--- | :--- |
| **Outsider** | -100 | *(Hostil)* |
| **Neutral** | 0 | *(Rango inicial)* |
| **Hopeful** | 5 | - |
| **Recruit** | 15 | - |
| **Blade** | 30 | **Mercenary's Plate** (Vendido por *Captain Vorlag*) |
| **Veteran** | 50 | **Vorlag's Battleaxe** (Vendido por *Captain Vorlag*) |
| **Honored** | 75 | - |

---

### 3. El Gremio de Canteros (The Stonecarvers' Guild)
*Poderoso gremio de artesanos y mineros con el monopolio de la piedra y los metales.*

| Rango | Reputación Necesaria | Recompensas Desbloqueadas (Tiendas) |
| :--- | :--- | :--- |
| **Stranger** | -100 | *(Hostil)* |
| **Neutral** | 0 | *(Rango inicial)* |
| **Client** | 10 | - |
| **Friend-of-the-Forge**| 25 | **Greatsword of the Peaks** (Vendido por *Thrain Ironforge*) |
| **Stone-Sworn** | 50 | - |
| **Venerated** | 75 | **Barbarian's Greataxe** (Vendido por *Thrain Ironforge*) |

---

## Facciones Pendientes de Implementación

Las siguientes facciones están marcadas en el código como unibles (`joinable: true`), pero **aún no tienen el array de `ranks` definido** en `data/factions.ts`. 

Para el próximo desarrollador, estas son las facciones que necesitan atención para expandir el sistema de reputación:

1. **Guardians of the Threshold** (Guardianes del Umbral)
2. **The Legion of the Shattered Aegis** (La Legión de la Égida Rota)
3. **The Mariner's Guild** (El Gremio de Marineros)

### ¿Cómo añadir rangos a estas facciones?

1. Abre `data/factions.ts`.
2. Busca la facción deseada.
3. Añade la propiedad `ranks` siguiendo este formato:
   ```typescript
   ranks: [
     { name: 'Enemigo', reputationThreshold: -100 },
     { name: 'Neutral', reputationThreshold: 0 },
     { name: 'Iniciado', reputationThreshold: 20 },
     { name: 'Veterano', reputationThreshold: 50 },
     { name: 'Maestro', reputationThreshold: 80 },
   ]
   ```
4. Ve a `data/npcs.ts`, busca un mercader que pertenezca a esa facción y añade la propiedad `factionRankInventory` para darle recompensas exclusivas a los jugadores que alcancen esos rangos.
