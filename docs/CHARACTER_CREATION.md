# Nexus Chronicles: Sistema de Creación de Personaje

El sistema de creación de personaje es un asistente (wizard) multipaso que guía al jugador a través de la configuración de su avatar. Este documento detalla la arquitectura del sistema, el flujo de datos, cómo se calculan las estadísticas finales y cómo añadir nuevo contenido.

---

## I. Arquitectura y Gestión de Estado

La creación de personaje está desacoplada del estado principal del juego (`useGameStore`) para mantener la limpieza. Utiliza su propio gestor de estado temporal y un formulario para los detalles de texto.

### 1. El Store Temporal (`store/characterCreationStore.ts`)
Utiliza Zustand para manejar un estado transitorio (`characterInProgress`).
*   **`step`**: Un número que indica la pantalla actual (1, 1.5, 2, 2.5, etc.). Los pasos intermedios (como 1.5) se usan para selecciones dependientes (ej. elegir Subraza solo después de elegir Raza).
*   **`points`**: Los puntos restantes para la compra de atributos (Point Buy, por defecto 27).
*   **`characterInProgress`**: Un objeto parcial que se va llenando a medida que el jugador avanza (raza, clase, trasfondo, stats base).

### 2. El Orquestador (`screens/CharacterCreationScreen.tsx`)
Este componente actúa como el controlador principal.
*   Lee el `step` del store y renderiza el componente correspondiente (ej. `<RaceSelectionStep />`).
*   Utiliza `react-hook-form` para manejar los inputs de texto complejos en los pasos finales (Apariencia y Nombre), validando datos como la edad, altura, color de ojos, etc.
*   Contiene la lógica crítica de **Finalización (`onSubmit`)** que ensambla el personaje final.

---

## II. El Flujo de Pasos (Steps)

1.  **Paso 1: Raza (`data/races.ts`)** -> *Paso 1.5: Subraza (Si aplica)*
    *   Define bonificadores de estadísticas (`statBonuses`) y opciones de personalización visual (rangos de edad, altura, colores).
2.  **Paso 2: Clase (`data/classes.ts`)** -> *Paso 2.5: Subclase (Si aplica)*
    *   Define el rol principal.
3.  **Paso 3: Trasfondo (`data/backgrounds.ts` o API)** -> *Paso 3.5: Trasfondo Personalizado*
    *   Otorga habilidades, idiomas y herramientas.
4.  **Paso 4: Atributos (Point Buy)**
    *   El jugador reparte 27 puntos entre STR, DEX, CON, INT, WIS, CHA. Todos empiezan en 8.
5.  **Paso 5: Apariencia**
    *   Formulario reactivo (`react-hook-form`) que usa las opciones de personalización definidas en la raza seleccionada.
6.  **Paso 6: Nombre**
7.  **Paso 7: Resumen y Generación**
    *   Muestra un resumen y dispara el `onSubmit`.

---

## III. Lógica de Finalización (`onSubmit`)

Cuando el jugador pulsa "Comenzar Aventura", ocurre lo siguiente en `CharacterCreationScreen.tsx`:

1.  **Generación de Avatar (IA)**: Llama a `generateCharacterSprite` (Gemini API) pasándole la raza, clase, subclase y los detalles de apariencia (color de pelo, cicatrices, etc.) para generar un retrato único en base64.
2.  **Cálculo de Estadísticas Finales**:
    *   Suma los puntos comprados en el Paso 4 con los `statBonuses` de la Raza y la Subraza.
3.  **Cálculo de Derivados (HP, Mana, Stamina)**:
    *   **Max HP**: `80 + (Modificador de Constitución * 10)`.
    *   **Max Mana**: `40 + (Modificador de Inteligencia * 10)`.
    *   **Max Stamina**: Depende de la clase. Los marciales (Fighter, Barbarian) obtienen `20 + (CON * 2)`. Los híbridos (Ranger, Rogue) obtienen `15 + (CON * 2)`. Los mágicos obtienen `5 + CON`.
4.  **Habilidades y Hechizos Iniciales**:
    *   Asigna hechizos fijos (ej. *Magic Missile*, *Fire Bolt*) si la clase es mágica (Wizard, Sorcerer).
    *   Asigna habilidades marciales (ej. *Power Strike*) si la clase es física.
5.  **Creación del Objeto `PlayerCharacter`**: Ensambla todo, inicializa el inventario vacío (`Array(INVENTORY_SIZE).fill(null)`), establece el nivel en 1 y el oro inicial (15 GP).
6.  **Transición**: Llama a `onCharacterCreated`, lo que le dice a `App.tsx` que guarde el personaje en la base de datos (`initializeNewGame`) y cambie la pantalla a `GAMEPLAY`.

---

## IV. Guía: Cómo Modificar o Añadir Contenido

### 1. Añadir una Nueva Raza o Clase
Es el cambio más sencillo, ya que el sistema está impulsado por datos (Data-Driven).
*   **Nueva Raza**: Abre `data/races.ts` y añade un nuevo objeto al array `RACES`. Asegúrate de definir `statBonuses` y `customizationOptions` (colores de piel, pelo, etc., para que el formulario del Paso 5 funcione).
*   **Nueva Clase**: Abre `data/classes.ts` y añade un nuevo objeto.
    *   *¡Importante!*: Si añades una nueva clase, **DEBES** ir a `CharacterCreationScreen.tsx` (línea ~150) y actualizar el `switch (characterClass.id)` para asignarle Stamina, Hechizos y Habilidades iniciales.

### 2. Modificar el Sistema de Atributos (Point Buy -> Tirada de Dados)
Si quieres cambiar el sistema de 27 puntos por tiradas de dados (Roll 4d6 drop lowest):
1.  Modifica `store/characterCreationStore.ts` para quitar `points` y añadir una función `rollStats()`.
2.  Reescribe `components/CharacterCreation/AttributeAssignmentStep.tsx` para mostrar un botón de "Tirar Dados" en lugar de los botones de "+" y "-".

### 3. Añadir un Nuevo Paso al Asistente (Ej. Elegir Alineamiento)
1.  Añade el estado necesario en `store/characterCreationStore.ts` (ej. `alignment: null`, `selectAlignment: (aln) => void`).
2.  Crea el componente visual `components/CharacterCreation/AlignmentStep.tsx`.
3.  En `CharacterCreationScreen.tsx`, ajusta la función `renderCurrentStep()` para incluir tu nuevo paso (ej. `case 3.8: return <AlignmentStep />;`).
4.  Asegúrate de que el paso anterior llame a `goToStep(3.8)` en lugar de saltar directamente al paso 4.

---

## V. Sugerencias e Implementaciones Futuras

Para el próximo desarrollador, aquí hay áreas clave que pueden mejorarse o expandirse:

1.  **Selección de Equipamiento Inicial (Starting Equipment)**
    *   *Estado Actual*: El inventario empieza vacío y el equipo es `null`.
    *   *Mejora*: Añadir un "Paso 6.5" donde el jugador elija entre un "Paquete de Explorador" o un "Paquete de Erudito", o reciba armas base dependiendo de su clase (ej. un Fighter recibe una espada larga y escudo). Esto requeriría importar la base de datos de items y asignarlos al array `inventory` en el `onSubmit`.
2.  **Selección Manual de Habilidades/Hechizos**
    *   *Estado Actual*: Los hechizos y habilidades marciales iniciales están *hardcodeados* en el `switch` del `onSubmit`.
    *   *Mejora*: Crear un paso en el wizard donde el jugador pueda elegir 2 hechizos de una lista filtrada por su clase, dándole más control sobre su *build* inicial.
3.  **Retratos Locales (Fallback Visual)**
    *   *Estado Actual*: Depende 100% de la API de Gemini para generar el avatar. Si falla, usa una imagen por defecto de la raza.
    *   *Mejora*: Permitir al jugador subir su propia imagen local recortándola, o elegir de una galería de avatares pre-renderizados si no quieren usar la generación por IA.
4.  **Impacto del Trasfondo (Background)**
    *   *Estado Actual*: El trasfondo se guarda, pero mecánicamente no afecta mucho al inicio más allá del rol.
    *   *Mejora*: Hacer que el trasfondo otorgue proficiencias reales (ej. +2 a Persuasión) que se guarden en el array `skills` del `PlayerCharacter` y se usen en los chequeos de diálogo.
