# Nexus Chronicles: Arquitectura de Interfaz y Modales (UI)

Este documento detalla cómo está estructurada la interfaz de usuario (UI) del juego, cómo se manejan las diferentes pantallas y, lo más importante, cómo funciona el sistema centralizado de ventanas emergentes (Modales).

---

## I. Flujo de Pantallas Principales (`App.tsx`)

El juego no utiliza un enrutador tradicional como `react-router`. En su lugar, `App.tsx` actúa como el controlador principal que renderiza una de las tres pantallas principales basándose en el estado local `currentScreen` (del tipo `GameScreen` en `types.ts`):

1.  **`MAIN_MENU`**: La pantalla de inicio (Nueva Partida, Continuar, Cargar).
2.  **`CHARACTER_CREATION`**: El flujo de creación de personaje.
3.  **`GAMEPLAY`**: El juego en sí (`GameScreen.tsx`).

*Regla de seguridad*: `App.tsx` tiene un `useEffect` que vigila si intentas entrar a `GAMEPLAY` sin un jugador cargado en el estado (`!player`). Si esto ocurre, te devuelve forzosamente al `MAIN_MENU` para evitar crasheos.

---

## II. El Hub del Juego (`GameScreen.tsx`)

Una vez dentro de la partida, `GameScreen.tsx` toma el control. Su diseño está dividido en capas visuales:

1.  **Fondo (Background)**: La imagen de la escena actual o del combate.
2.  **Partículas**: Efectos visuales superpuestos (`ParticleBackground`).
3.  **Cabecera (`GameHeader`)**: La barra superior con los botones para abrir el Inventario, Hoja de Personaje, Diario, etc.
4.  **Áreas Clicables**: Si la escena es de tipo `POINT_AND_CLICK`, renderiza las zonas interactivas sobre el fondo.
5.  **Pie de página (`GameFooter`)**: La caja de texto (diálogo) y los botones de opciones (Choices).
6.  **Gestor de Modales (`ModalManager`)**: El componente invisible que se encarga de renderizar cualquier ventana emergente.

---

## III. El Sistema de Modales (¡CRÍTICO!)

En juegos de rol complejos, manejar múltiples ventanas (Inventario, Comercio, Códex, Opciones) puede convertirse rápidamente en un infierno de `z-index` y estados booleanos (`isInventoryOpen`, `isTradeOpen`, etc.).

Para solucionar esto, *Nexus Chronicles* utiliza un patrón de **Gestor Centralizado**.

### 1. El Estado (`store/modalStore.ts`)
Utilizamos un store de Zustand dedicado exclusivamente a la UI.
*   **`activeModal`**: Solo puede haber **UN** modal activo a la vez (es un string union type `ModalType`, ej. `'inventory' | 'trade' | 'codex'`). Si abres el inventario, `activeModal` pasa a ser `'inventory'`. Si luego abres el Códex, `activeModal` cambia a `'codex'` (cerrando automáticamente el inventario).
*   **Payloads (Datos adjuntos)**: Algunos modales necesitan datos para abrirse. Por ejemplo, el modal de comercio necesita saber con qué NPC estás hablando. El store guarda estos datos temporales (`tradeNpc`, `saveLoadMode`, `analysisFile`).

### 2. El Renderizador (`components/ModalManager.tsx`)
Este componente se coloca al final de `GameScreen.tsx`. Importa TODOS los modales del juego y los renderiza condicionalmente basándose en el store:

```tsx
// Ejemplo simplificado de ModalManager.tsx
export const ModalManager = () => {
    const { activeModal, closeModal } = useModalStore();

    return (
        <>
            <InventoryModal isOpen={activeModal === 'inventory'} onClose={closeModal} />
            <TradeModal isOpen={activeModal === 'trade'} onClose={closeModal} />
            <CodexModal isOpen={activeModal === 'codex'} onClose={closeModal} />
            {/* ... otros 15 modales ... */}
        </>
    );
};
```

---

## IV. Guía: Cómo crear y añadir un NUEVO Modal

Si necesitas crear una nueva ventana (por ejemplo, un "Minijuego de Pesca"), sigue **ESTRICTAMENTE** estos pasos:

1.  **Añadir el Tipo (`types.ts`)**:
    Busca el type `ModalType` y añade tu nuevo modal:
    ```typescript
    export type ModalType = 'inventory' | 'trade' | ... | 'fishingMinigame';
    ```
    *(Opcional)* Si tu modal necesita recibir datos al abrirse, añádelo a la interfaz `ModalPayloads` en el mismo archivo.

2.  **Crear el Componente (`components/FishingModal.tsx`)**:
    Crea tu componente. Asegúrate de que reciba las props `isOpen` y `onClose`. Usa un contenedor con fondo oscuro (`bg-black/80`) y un `z-index` alto (ej. `z-50`) para oscurecer el juego detrás.

3.  **Registrar en el Manager (`components/ModalManager.tsx`)**:
    Importa tu nuevo componente y añádelo al JSX del `ModalManager`:
    ```tsx
    <FishingModal isOpen={activeModal === 'fishingMinigame'} onClose={closeModal} />
    ```

4.  **Abrir el Modal (Desde cualquier parte)**:
    Usa el hook del store para abrirlo, por ejemplo, desde un botón en el `GameHeader` o como resultado de una opción de diálogo:
    ```tsx
    const { openModal } = useModalStore();
    // ...
    <button onClick={() => openModal('fishingMinigame')}>Pescar</button>
    ```

---

## V. Reglas Estrictas (Lo que DEBE mantenerse)

1.  **Exclusividad Mutua**: El diseño actual dicta que **no se pueden superponer modales**. Abrir un modal cierra el anterior. Esto previene bugs visuales y problemas de foco (accesibilidad). Si necesitas que un modal abra otro modal "por encima", debes rediseñar la experiencia para que sea una transición (Modal A -> Modal B -> Modal A).
2.  **Limpieza de Estado**: La función `closeModal` en `modalStore.ts` se encarga de limpiar los payloads (`tradeNpc = null`, etc.). Si añades un nuevo payload al store, **asegúrate de resetearlo en `closeModal`**.
3.  **Z-Index**: Los modales deben tener un `z-50` o superior para asegurar que cubren el `GameHeader` y el `GameFooter`.

---

## VI. Posibles Ampliaciones y Modificaciones

1.  **Historial de Modales (Navegación "Atrás")**:
    *   *Problema actual*: Si estás en el Inventario, abres el Códex para leer algo, y cierras el Códex, vuelves al juego (no al Inventario).
    *   *Implementación*: Modificar `modalStore.ts` para que `activeModal` sea un array (una pila/stack). `openModal` hace un `.push()`. `closeModal` hace un `.pop()`. El modal visible siempre es el último elemento del array.
2.  **Modales No Bloqueantes (Draggables)**:
    *   *Implementación*: Si se requiere que el jugador pueda ver el Inventario y la Hoja de Personaje al mismo tiempo (estilo MMO clásico), el sistema de `activeModal` único debe ser reemplazado por un array de objetos `{ id: string, isOpen: boolean, zIndex: number, position: {x, y} }`. Requeriría una reescritura significativa del `ModalManager`.
3.  **Transiciones y Animaciones**:
    *   *Implementación*: Actualmente los modales aparecen de golpe. Se podría integrar `framer-motion` en los componentes base de los modales para añadir efectos de *fade-in* o *slide-up* al cambiar el `activeModal`.
