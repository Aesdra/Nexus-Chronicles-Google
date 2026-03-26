import { useEffect, useRef } from 'react';

interface GamepadInputCallbacks {
  onUp: () => void;
  onDown: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  onStart: () => void;
}

const AXIS_THRESHOLD = 0.7; // How far the stick needs to be pushed
const AXIS_COOLDOWN = 200; // ms to wait before registering another stick movement

/**
 * A custom hook to manage gamepad input for the application.
 * It polls the gamepad state using requestAnimationFrame and triggers callbacks for specific actions.
 * @param {GamepadInputCallbacks} callbacks - An object of functions to call on specific inputs.
 */
export const useGamepadInput = (callbacks: GamepadInputCallbacks) => {
  const animationFrameId = useRef<number | undefined>(undefined);
  const prevButtons = useRef<readonly boolean[]>([]);
  const axisCooldownTimer = useRef<number>(0);

  const wasButtonPressed = (buttonIndex: number, buttons: readonly GamepadButton[]) => {
    return buttons[buttonIndex]?.pressed && !prevButtons.current[buttonIndex];
  };
  
  // FIX: Added the timestamp parameter to match the requestAnimationFrame callback signature.
  const gamepadLoop = (timestamp: number) => {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0]; // Use the first connected gamepad

    if (gp) {
      const now = performance.now();
      const buttons = gp.buttons;

      // --- Button Presses (for single-fire actions) ---
      if (wasButtonPressed(0, buttons)) callbacks.onConfirm(); // 'A' on Xbox, 'X' on PlayStation
      if (wasButtonPressed(1, buttons)) callbacks.onCancel();  // 'B' on Xbox, 'O' on PlayStation
      if (wasButtonPressed(9, buttons)) callbacks.onStart();   // 'Start' or 'Options' button

      // --- Directional Input (with cooldown) ---
      const canProcessAxis = now > axisCooldownTimer.current;

      if (canProcessAxis) {
        // D-Pad
        if (wasButtonPressed(12, buttons)) { // D-Pad Up
          callbacks.onUp();
          axisCooldownTimer.current = now + AXIS_COOLDOWN;
        } else if (wasButtonPressed(13, buttons)) { // D-Pad Down
          callbacks.onDown();
          axisCooldownTimer.current = now + AXIS_COOLDOWN;
        } else {
            // Left Analog Stick (usually axis 1 for vertical)
            const leftStickY = gp.axes[1];
            if (leftStickY < -AXIS_THRESHOLD) { // Stick pushed up
              callbacks.onUp();
              axisCooldownTimer.current = now + AXIS_COOLDOWN;
            } else if (leftStickY > AXIS_THRESHOLD) { // Stick pushed down
              callbacks.onDown();
              axisCooldownTimer.current = now + AXIS_COOLDOWN;
            }
        }
      }
      
      prevButtons.current = buttons.map(b => b.pressed);
    }
    
    animationFrameId.current = requestAnimationFrame(gamepadLoop);
  };
  
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(gamepadLoop);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount
};