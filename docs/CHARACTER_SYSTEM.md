# Sistema de Personajes: Razas, Clases y Subclases

Este documento detalla cómo está implementado el sistema de creación de personajes en el proyecto, permitiendo a futuros desarrolladores extender o modificar las opciones disponibles.

## Estructura de Datos (Types)

Toda la lógica de tipos se encuentra en `/types.ts`. Las interfaces principales son:

### Razas (`Race` y `SubRace`)
```typescript
export interface Race {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  statBonuses: Partial<Record<Stat, number>>; // Bonos base de la raza
  subRaces?: SubRace[];
  customizationOptions: {
    ageRange: { min: number; max: number; typical: number };
    heightRange: { min: number; max: number };
    skinColors: string[];
    eyeColors: string[];
    hairColors: string[];
  };
}

export interface SubRace {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  statBonuses: Partial<Record<Stat, number>>; // Bonos adicionales de la subraza
}
```

### Clases (`CharacterClass` y `SubClass`)
```typescript
export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  scalesWith: Stat[]; // Atributos principales para el escalado de daño/habilidades
  subclasses?: SubClass[];
}

export interface SubClass {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}
```

---

## Ubicación de los Datos

Los datos reales están centralizados en la carpeta `/data/`:

1.  **`/data/races.ts`**: Contiene la constante `RACES`, una lista de todas las razas y sus subrazas.
2.  **`/data/classes.ts`**: Contiene la constante `CLASSES`, una lista de todas las clases y sus subclases.
3.  **`/data/assets.ts`**: Contiene `IMAGE_ASSETS`, un objeto que mapea IDs de imágenes a URLs de CDNs. **Es obligatorio agregar las URLs aquí antes de usarlas en los datos.**

---

## Cómo agregar una nueva Raza

1.  **Imagen**: Sube la imagen a un servicio (como ImgBB o Cloudinary) y agrégala a `IMAGE_ASSETS` en `/data/assets.ts`.
    ```typescript
    // data/assets.ts
    export const IMAGE_ASSETS = {
      // ...
      RACE_MY_NEW_RACE: 'https://url-de-tu-imagen.jpg',
      SUBRACE_MY_NEW_SUBRACE: 'https://url-de-tu-subraza.jpg',
    };
    ```

2.  **Datos**: Abre `/data/races.ts` y agrega un nuevo objeto al array `RACES`.
    ```typescript
    // data/races.ts
    {
      id: 'mi-nueva-raza',
      name: 'Mi Nueva Raza',
      description: 'Una descripción épica.',
      imageUrl: IMAGE_ASSETS.RACE_MY_NEW_RACE,
      statBonuses: { strength: 1 },
      subRaces: [
        { 
          id: 'mi-subraza', 
          name: 'Mi Subraza', 
          description: '...', 
          imageUrl: IMAGE_ASSETS.SUBRACE_MY_NEW_SUBRACE, 
          statBonuses: { wisdom: 1 } 
        }
      ],
      customizationOptions: {
        ageRange: { min: 20, max: 200, typical: 50 },
        heightRange: { min: 50, max: 70 },
        skinColors: ['Azul', 'Verde'],
        eyeColors: ['Rojo'],
        hairColors: ['Blanco'],
      }
    }
    ```

---

## Cómo agregar una nueva Clase

1.  **Imagen**: Agrega las URLs a `IMAGE_ASSETS` en `/data/assets.ts`.
2.  **Datos**: Abre `/data/classes.ts` y agrega un nuevo objeto al array `CLASSES`.
    ```typescript
    // data/classes.ts
    {
      id: 'mi-nueva-clase',
      name: 'Mi Nueva Clase',
      description: 'Descripción de la clase.',
      imageUrl: IMAGE_ASSETS.CLASS_MY_NEW_CLASS,
      scalesWith: ['dexterity'],
      subclasses: [
        { 
          id: 'mi-subclase', 
          name: 'Mi Subclase', 
          description: '...', 
          imageUrl: IMAGE_ASSETS.SUBCLASS_MY_NEW_SUBCLASS 
        }
      ]
    }
    ```

---

## Flujo de Implementación en la UI

La pantalla de creación de personajes (`/screens/CharacterCreationScreen.tsx`) utiliza un **Zustand Store** dedicado: `/store/characterCreationStore.ts`.

-   **Modularidad**: Cada paso de la creación es un componente separado en `/components/CharacterCreation/`.
-   **Selección**: Al seleccionar una raza o clase, el store actualiza el `characterInProgress`.
-   **Sub-pasos**: Si una raza tiene `subRaces` o una clase tiene `subclasses`, la UI automáticamente inserta un paso intermedio (ej. paso 1.5 para subrazas) antes de continuar al siguiente paso principal.

## Consideraciones de IA (Gemini)

Cuando se completa la creación, se llama a `generateCharacterSprite` en `/services/geminiService.ts`. Esta función:
1.  Toma la raza, subraza, clase y subclase.
2.  Construye un prompt detallado para **Imagen 4.0**.
3.  Genera un sprite único basado en las selecciones del usuario.

Si agregas nuevas razas o clases, asegúrate de revisar el `switch` dentro de `generateCharacterSprite` para agregar descripciones de equipo específicas para la IA, de modo que el sprite generado sea coherente con la nueva clase.
