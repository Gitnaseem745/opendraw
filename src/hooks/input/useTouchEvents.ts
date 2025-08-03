import { useCallback, useRef } from 'react';
import { useDrawingStore } from '@/store/drawingStore';
import { canvasUtils } from '@/lib/canvasUtils';

/**
 * Custom hook for handling touch events on the canvas
 * Provides touch drawing, pinch zoom, and pan gesture support
 * 
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef - Reference to the canvas element
 * @returns {object} - Object containing touch event handlers
 */
export const useTouchEvents = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const {
    scale,
    panOffset,
    scaleOffset,
    setScale,
    setPanOffset,
    setScaleOffset
  } = useDrawingStore();

  // Track touch state
  const lastTouchDistance = useRef<number>(0);
  const lastTouchCenter = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPanPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isTwoFingerGesture = useRef<boolean>(false);
  const initialTouchDistance = useRef<number>(0);
  const initialScale = useRef<number>(1);

  /**
   * Gets touch coordinates relative to canvas
   */
  const getTouchCoordinates = useCallback((touch: React.Touch, canvasRect: DOMRect) => {
    const clientX = touch.clientX - canvasRect.left;
    const clientY = touch.clientY - canvasRect.top;
    return canvasUtils.getMouseCoordinates(
      { clientX: clientX + canvasRect.left, clientY: clientY + canvasRect.top },
      panOffset,
      scale,
      scaleOffset
    );
  }, [panOffset, scale, scaleOffset]);

  /**
   * Calculates distance between two touches
   */
  const getTouchDistance = useCallback((touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  /**
   * Calculates center point between two touches
   */
  const getTouchCenter = useCallback((touch1: React.Touch, touch2: React.Touch): { x: number; y: number } => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }, []);

  /**
   * Handles touch start events
   */
  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const touches = event.touches;

    if (touches.length === 1) {
      // Single touch - prepare for drawing or panning
      const touch = touches[0];
      const coords = getTouchCoordinates(touch, canvasRect);
      lastPanPosition.current = { x: coords.clientX, y: coords.clientY };
      isTwoFingerGesture.current = false;
      
      // Simulate mouse down for drawing
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
        buttons: 1
      });
      
      // Dispatch to canvas element to trigger existing mouse handlers
      canvas.dispatchEvent(mouseEvent);
      
    } else if (touches.length === 2) {
      // Two finger gesture - prepare for pinch/zoom
      isTwoFingerGesture.current = true;
      
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      const distance = getTouchDistance(touch1, touch2);
      const center = getTouchCenter(touch1, touch2);
      
      initialTouchDistance.current = distance;
      lastTouchDistance.current = distance;
      lastTouchCenter.current = center;
      initialScale.current = scale;
      
      // Simulate mouse up to stop any drawing action
      const mouseEvent = new MouseEvent('mouseup', {
        clientX: touch1.clientX,
        clientY: touch1.clientY,
        button: 0,
        buttons: 0
      });
      canvas.dispatchEvent(mouseEvent);
    }
  }, [canvasRef, getTouchCoordinates, getTouchDistance, getTouchCenter, scale]);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touches = event.touches;

    if (touches.length === 1 && !isTwoFingerGesture.current) {
      // Single touch - handle drawing or panning
      const touch = touches[0];
      
      // Simulate mouse move for drawing
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        button: 0,
        buttons: 1
      });
      canvas.dispatchEvent(mouseEvent);
      
    } else if (touches.length === 2) {
      // Two finger gesture - handle pinch zoom and pan
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      const currentDistance = getTouchDistance(touch1, touch2);
      const currentCenter = getTouchCenter(touch1, touch2);
      
      // Calculate zoom
      if (initialTouchDistance.current > 0) {
        const scaleChange = currentDistance / initialTouchDistance.current;
        const newScale = Math.max(0.1, Math.min(5, initialScale.current * scaleChange));
        
        // Update scale
        setScale(newScale);
        
        // Update scale offset for centered zooming around touch point
        const canvas = canvasRef.current;
        if (canvas) {
          const newScaleOffset = canvasUtils.calculateScaleOffset(
            canvas.width,
            canvas.height,
            newScale
          );
          setScaleOffset(newScaleOffset);
        }
      }
      
      // Calculate pan
      const deltaX = currentCenter.x - lastTouchCenter.current.x;
      const deltaY = currentCenter.y - lastTouchCenter.current.y;
      
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        const newPanOffset = {
          x: panOffset.x + deltaX / scale,
          y: panOffset.y + deltaY / scale
        };
        setPanOffset(newPanOffset);
      }
      
      // Update last values
      lastTouchDistance.current = currentDistance;
      lastTouchCenter.current = currentCenter;
    }
  }, [
    canvasRef,
    getTouchDistance,
    getTouchCenter,
    panOffset,
    scale,
    setScale,
    setPanOffset,
    setScaleOffset
  ]);

  /**
   * Handles touch end events
   */
  const handleTouchEnd = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touches = event.touches;

    if (touches.length === 0) {
      // All touches ended
      isTwoFingerGesture.current = false;
      
      // Simulate mouse up to end drawing
      const mouseEvent = new MouseEvent('mouseup', {
        clientX: lastPanPosition.current.x,
        clientY: lastPanPosition.current.y,
        button: 0,
        buttons: 0
      });
      canvas.dispatchEvent(mouseEvent);
      
    } else if (touches.length === 1 && isTwoFingerGesture.current) {
      // Went from two finger to one finger gesture
      isTwoFingerGesture.current = false;
      const touch = touches[0];
      const canvasRect = canvas.getBoundingClientRect();
      const coords = getTouchCoordinates(touch, canvasRect);
      lastPanPosition.current = { x: coords.clientX, y: coords.clientY };
    }
  }, [canvasRef, getTouchCoordinates]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};
