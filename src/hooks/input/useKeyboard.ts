import { useEffect } from "react";

type KeyCombo = string | string[];

interface UseKeyboardOptions {
  /**
   * The key or key combo(s) to listen for.
   * Example: 'Escape' or ['Control', 'k']
   */
  keys: KeyCombo;

  /**
   * The callback function to run when the key(s) are pressed.
   */
  callback: (event: KeyboardEvent) => void;

  /**
   * Listen on 'keydown' or 'keyup'. Defaults to 'keydown'.
   */
  eventType?: "keydown" | "keyup";

  /**
   * Whether the listener should be global (on window) or scoped to an element.
   */
  target?: HTMLElement | Window | null;

  /**
   * Set to true if you want the event to trigger only once until released.
   */
  once?: boolean;

  /**
   * Optional: Whether to prevent the default action on key press.
   */
  preventDefault?: boolean;
}

/**
 * Custom hook for handling keyboard events with support for key combinations.
 * Supports modifier keys like Ctrl, Shift, Alt, and Meta/Cmd.
 * 
 * @param {UseKeyboardOptions} options - Configuration object for keyboard handling
 * @param {KeyCombo} options.keys - The key or key combination to listen for
 * @param {function} options.callback - Function to execute when keys are pressed
 * @param {string} [options.eventType='keydown'] - Type of keyboard event to listen for
 * @param {HTMLElement|Window|null} [options.target=window] - Element to attach listener to
 * @param {boolean} [options.once=false] - Whether to execute callback only once
 * @param {boolean} [options.preventDefault=false] - Whether to prevent default behavior
 * @returns {void} - This hook doesn't return anything but sets up event listeners
 */
export function useKeyboard({
  keys,
  callback,
  eventType = "keydown",
  target = typeof window !== "undefined" ? window : null,
  once = false,
  preventDefault = false,
}: UseKeyboardOptions) {
  useEffect(() => {
    if (!target) return;

    const combo = Array.isArray(keys) ? keys.map(k => k.toLowerCase()) : [keys.toLowerCase()];

    const handler = (event: Event) => {
      const keyEvent = event as KeyboardEvent;
      const pressedKey = keyEvent.key.toLowerCase();

      // If it's a multi-key combo, check all keys are pressed
      const comboMatch = combo.every(key => {
        switch (key) {
          case "ctrl":
          case "control":
            return keyEvent.ctrlKey;
          case "shift":
            return keyEvent.shiftKey;
          case "alt":
            return keyEvent.altKey;
          case "meta":
          case "cmd":
          case "command":
            return keyEvent.metaKey;
          default:
            return key === pressedKey;
        }
      });

      if (comboMatch) {
        if (preventDefault) keyEvent.preventDefault();
        callback(keyEvent);
        if (once) target.removeEventListener(eventType, handler);
      }
    };

    target.addEventListener(eventType, handler);
    return () => {
      target.removeEventListener(eventType, handler);
    };
  }, [keys, callback, eventType, target, once, preventDefault]);
}
