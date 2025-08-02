/**
 * @fileoverview Main drawing canvas component for handling user drawing interactions
 * @description Core canvas component that manages drawing events, tool interactions, and visual feedback
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <DrawingCanvas />
 * ```
 * 
 * @features
 * - Mouse event handling for drawing
 * - Tool-specific interactions
 * - Eraser visual indicator
 * - Canvas rendering integration
 * - Responsive positioning
 * - Custom cursor support
 */

'use client';
import { useCanvasEvents } from '@/hooks/canvas/useCanvasEvents';
import { useCanvasRenderer } from '@/hooks/canvas/useCanvasRenderer';
import { useCanvasStore } from '@/store/canvasStore';
import { useDrawingStore } from '@/store/drawingStore';
import { Tools } from '@/types';
import { useState } from 'react';

/**
 * Main drawing canvas component
 * 
 * Handles all drawing interactions including mouse events, tool-specific behaviors,
 * and visual feedback. Integrates with custom hooks for event handling and rendering.
 * 
 * @returns {JSX.Element} The rendered drawing canvas component
 */
export const DrawingCanvas = () => {
  const { canvasRef, colors, currentChecked } = useCanvasStore();
  const { tool } = useDrawingStore();
  const [eraserPosition, setEraserPosition] = useState<{ x: number; y: number } | null>(null);
  
  // Custom hooks handle the complex logic
  const { handleMouseDown, handleMouseMove, handleMouseUp } = useCanvasEvents(canvasRef as React.RefObject<HTMLCanvasElement>);
  useCanvasRenderer(canvasRef as React.RefObject<HTMLCanvasElement>);
  
  /**
   * Handles mouse movement with eraser position tracking
   * @param {React.MouseEvent<HTMLCanvasElement>} event - Mouse move event
   */
  const handleMouseMoveWithEraser = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // Update eraser position for visual indicator
    if (tool === Tools.eraser) {
      const rect = event.currentTarget.getBoundingClientRect();
      setEraserPosition({ 
        x: event.clientX - rect.left, 
        y: event.clientY - rect.top 
      });
    } else {
      setEraserPosition(null);
    }
    
    handleMouseMove(event);
  };
  
  /**
   * Handles mouse leave event to hide eraser indicator
   */
  const handleMouseLeave = () => {
    setEraserPosition(null);
  };

  /**
   * Gets the appropriate cursor class based on the current tool
   * @returns {string} CSS cursor class
   */
  const getCursorClass = (): string => {
    switch (tool) {
      case Tools.eraser:
        return 'cursor-none'; // Hide cursor when showing custom eraser indicator
      case Tools.text:
        return 'cursor-text';
      case Tools.pan:
      case Tools.hand:
        return 'cursor-grab';
      case Tools.selection:
        return 'cursor-default';
      default:
        return 'cursor-crosshair';
    }
  };
  
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveWithEraser}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={`absolute inset-0 ${colors[currentChecked]} ${getCursorClass()}`}
        style={{ 
          position: "absolute", 
          zIndex: 1,
          touchAction: 'none' // Prevent default touch behaviors
        }}
        aria-label="Drawing canvas"
        role="img"
      />
      
      {/* Eraser cursor indicator */}
      {eraserPosition && tool === Tools.eraser && (
        <div
          className="pointer-events-none absolute rounded-full border-2 border-red-500 bg-red-100/50 backdrop-blur-sm"
          style={{
            left: eraserPosition.x - 12,
            top: eraserPosition.y - 12,
            width: 24,
            height: 24,
            zIndex: 10,
            transform: 'translate(-50%, -50%)',
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
