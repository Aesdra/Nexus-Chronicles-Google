# Guía de Clases y Subclases: Implementación y Lógica

Este documento profundiza en el sistema de clases y subclases, explicando no solo cómo crearlas, sino la lógica mecánica que siguen dentro de *Nexus Chronicles*.

## 1. Definición Técnica

Las clases se definen mediante la interfaz `CharacterClass` en `types.ts`.

```typescript
export interface CharacterClass {
  id: string;          // Identificador único (ej: 'fighter', 'wizard')
  name: string;        // Nombre visible en la UI
  description: string; // Texto descriptivo para el usuario
  imageUrl: string;    // URL de la imagen (vía IMAGE_ASSETS)
  scalesWith: Stat[];  // Lista de atributos que potencian a esta clase
  subclasses?: SubClass[]; // Lista opcional de especializaciones
}
```

### El Atributo `scalesWith` (Lógica de Juego)
Este es el campo más importante para la mecánica de combate y progresión:
- **Bono de Ataque**: El primer atributo en la lista de `scalesWith` se considera el **Atributo Principal**. Se utiliza para calcular el `attackBonus` en combate.
  - *Ejemplo*: Si un Guerrero tiene `scalesWith: ['strength', 'dexterity']`, su bono de ataque se basará en su Fuerza.
- **Progresión Automática**: Al subir de nivel (`applyAutomaticLevelUp`), el juego incrementa automáticamente el primer atributo de esta lista.

---

## 2. Cómo Crear una Nueva Clase

### Paso 1: Registrar el Asset Visual
Asegúrate de tener una URL para la imagen de la clase y agrégala a `/data/assets.ts`.

```typescript
// data/assets.ts
export const IMAGE_ASSETS = {
  // ...
  CLASS_NECROMANCER: 'https://...',
  SUBCLASS_BLOOD_MAGE: 'https://...',
};
```

### Paso 2: Definir la Clase en `data/classes.ts`
Agrega la nueva clase al array `CLASSES`.

```typescript
// data/classes.ts
{
  id: 'necromancer',
  name: 'Necromancer',
  description: 'A master of life and death...',
  imageUrl: IMAGE_ASSETS.CLASS_NECROMANCER,
  scalesWith: ['intelligence'], // Su poder depende de su Inteligencia
  subclasses: [
    { 
      id: 'blood-mage', 
      name: 'Blood Mage', 
      description: 'Uses their own vitality to fuel spells.', 
      imageUrl: IMAGE_ASSETS.SUBCLASS_BLOOD_MAGE 
    }
  ]
}
```

---

## 3. Implementación de Lógica Específica

### Habilidades y Hechizos
Las clases no "contienen" sus habilidades directamente en el objeto `CharacterClass`. En su lugar, las habilidades se filtran por el ID de la clase en otros sistemas:

1.  **Habilidades Marciales**: Definidas en `/data/martialAbilities.ts`.
2.  **Hechizos**: Definidos en `/data/spells.ts`.

**Para implementar lógica de clase en habilidades:**
Al crear una habilidad o hechizo, puedes usar el campo `requirements` (si existe en el tipo de objeto) o simplemente filtrar en la UI de nivel subida (`LevelUpPrompt`) basándote en `player.characterClass.id`.

### Generación de Sprites (IA)
Para que la IA genere un sprite acorde a la nueva clase, debes actualizar `/services/geminiService.ts`.

Busca la función `generateCharacterSprite` y añade un caso al `switch` que define el equipo visual:

```typescript
// services/geminiService.ts
switch (characterClass.id) {
  case 'necromancer':
    equipmentDesc = "wearing dark tattered robes, holding a skull-topped staff, surrounded by a faint green mist";
    break;
  // ...
}
```

---

## 4. Lógica de Subclases

Las subclases son actualmente **especializaciones narrativas y visuales**. 
- **Visual**: Afectan el prompt de la IA en `generateCharacterSprite`.
- **Narrativo**: Pueden usarse para desbloquear opciones de diálogo específicas mediante condiciones:
  ```typescript
  condition: (state) => state.player.subClass?.id === 'blood-mage'
  ```

### Sugerencia para Futura Expansión
Si deseas que las subclases otorguen bonos mecánicos, podrías extender la interfaz `SubClass` en `types.ts` para incluir un campo `statBonuses` o `grantedAbilities`, similar a como funcionan las Razas.

---

## Checklist de Implementación
- [ ] Imagen añadida a `IMAGE_ASSETS`.
- [ ] Clase/Subclase añadida a `CLASSES` en `data/classes.ts`.
- [ ] Atributo principal definido en el primer lugar de `scalesWith`.
- [ ] Descripción de equipo añadida a `geminiService.ts` para la IA.
- [ ] (Opcional) Nuevas habilidades creadas en `martialAbilities.ts` o `spells.ts`.
