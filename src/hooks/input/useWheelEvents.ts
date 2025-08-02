import { useEffect, useRef } from 'react';
import { useDrawingStore } from '@/store/drawingStore';
import { useKeyboard } from './useKeyboard';

/**
 * Custom hook that handles mouse wheel events for zooming and panning.
 * When Ctrl/Cmd is held, wheel events trigger zoom functionality.
 * Otherwise, wheel events trigger panning functionality.
 * 
 * @returns {void} - This hook doesn't return anything but sets up wheel event listeners
 */
export const useWheelEvents = () => {
  const { scale, setScale, panOffset, setPanOffset } = useDrawingStore();
  const isCtrlPressed = useRef(false);
  const isCmdPressed = useRef(false);
  
  // Track Ctrl key
  useKeyboard({
    keys: 'Control',
    callback: () => {
      isCtrlPressed.current = true;
    },
    eventType: 'keydown'
  });

  useKeyboard({
    keys: 'Control',
    callback: () => {
      isCtrlPressed.current = false;
    },
    eventType: 'keyup'
  });

  // Track Cmd key (Mac)
  useKeyboard({
    keys: 'Meta',
    callback: () => {
      isCmdPressed.current = true;
    },
    eventType: 'keydown'
  });

  useKeyboard({
    keys: 'Meta',
    callback: () => {
      isCmdPressed.current = false;
    },
    eventType: 'keyup'
  });
  
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isCtrlPressed.current || isCmdPressed.current) {
        // Zoom
        event.preventDefault();
        event.stopPropagation();
        const zoomDelta = event.deltaY * -0.01;
        const newScale = Math.min(Math.max(scale + zoomDelta, 0.1), 20);
        setScale(newScale);
      } else {
        // Pan
        setPanOffset({
          x: panOffset.x - event.deltaX,
          y: panOffset.y - event.deltaY,
        });
      }
    };

    document.addEventListener("wheel", handleWheel);
    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [scale, setScale, panOffset, setPanOffset]);
};
