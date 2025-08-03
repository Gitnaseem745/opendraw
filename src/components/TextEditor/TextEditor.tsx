/**
 * @fileoverview Text editor component for in-canvas text editing
 * @description Provides inline text editing functionality for text tools with responsive positioning
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <TextEditor />
 * ```
 * 
 * @features
 * - Inline text editing
 * - Responsive text sizing
 * - Canvas-relative positioning
 * - Automatic focus management
 * - Text measurement integration
 * - State synchronization
 */

import { useRef, useEffect } from 'react';
import { useDrawingStore } from '@/store/drawingStore';
import { canvasUtils } from '@/lib/canvasUtils';
import { useCanvasStore } from '@/store/canvasStore';

/**
 * Text editor component for in-canvas text editing
 * 
 * Provides a textarea overlay that appears when text editing is active.
 * Features responsive positioning, automatic sizing, and seamless integration
 * with the drawing store.
 * 
 * @returns {JSX.Element | null} The rendered text editor or null when inactive
 */
export const TextEditor = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isInitializing = useRef(false);
  const { selectedShape, action, scale, panOffset, scaleOffset, setAction, setSelectedShape, shapes, setShapes } = useDrawingStore();
  const { canvasRef } = useCanvasStore();
  
  /**
   * Effect to focus and initialize text area when writing mode is activated
   */
  useEffect(() => {
    if (action === "writing" && textAreaRef.current && selectedShape) {
      isInitializing.current = true;
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.focus();
          textAreaRef.current.value = selectedShape.text || '';
          // Position cursor at end of text
          const length = textAreaRef.current.value.length;
          textAreaRef.current.setSelectionRange(length, length);
          // Allow blur events after a short delay
          setTimeout(() => {
            isInitializing.current = false;
          }, 200);
        }
      }, 100); // Increased timeout to prevent immediate blur
    }
  }, [action, selectedShape]);
  
  /**
   * Handles text area blur event to save text and exit editing mode
   * @param {React.FocusEvent<HTMLTextAreaElement>} e - Blur event
   */
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // Ignore blur events during initialization to prevent immediate exit
    if (isInitializing.current) {
      e.preventDefault();
      return;
    }
    
    if (selectedShape) {
      const { id, x1, y1 } = selectedShape;
      const textValue = e.target.value;

      setAction("none");
      setSelectedShape(null);
      
      // Update the shape with the new text
      // Use canvas from store instead of querySelector
      const canvas = canvasRef.current;
      if (!canvas) return;
      let textWidth = 100; // Default width
      let textHeight = 24; // Default height
      
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const fontSize = Math.max(16, 24 * scale); // Responsive font size
          const measured = canvasUtils.measureText(context, textValue, fontSize);
          textWidth = measured.width;
          textHeight = measured.height;
        }
      }
      
      // Get current state and update
      const shapesCopy = [...shapes];
      shapesCopy[id] = {
        ...shapesCopy[id],
        text: textValue,
        x2: x1 + textWidth,
        y2: y1 + textHeight
      };
      setShapes(shapesCopy, true);
    }
  };

  /**
   * Handles keyboard events for text editing
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent canvas shortcuts when typing
    e.stopPropagation();
    
    // Exit editing on Escape
    if (e.key === 'Escape') {
      e.currentTarget.blur();
    }
  };

  /**
   * Prevent mouse events from propagating to canvas
   * @param {React.MouseEvent<HTMLTextAreaElement>} e - Mouse event
   */
  const handleMouseEvents = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
  };
  
  // Don't render if not in writing mode or no selected shape
  if (action !== "writing" || !selectedShape) {
    return null;
  }

  // Calculate responsive positioning and sizing
  const fontSize = Math.max(12, 24 * scale);
  const minWidth = Math.max(200, 300 * scale);
  const minHeight = Math.max(24, 30 * scale);
  
  return (
    <textarea
      ref={textAreaRef}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseEvents}
      onClick={handleMouseEvents}
      onMouseUp={handleMouseEvents}
      className="absolute outline-none resize-none overflow-hidden whitespace-pre-wrap break-words text-foreground shadow-sm"
      style={{
        top: selectedShape
          ? (selectedShape.y1 - 2) * scale + panOffset.y * scale - scaleOffset.y
          : 0,
        left: selectedShape
          ? selectedShape.x1 * scale + panOffset.x * scale - scaleOffset.x
          : 0,
        fontSize: `${fontSize}px`,
        fontFamily: 'sans-serif',
        width: `${minWidth}px`,
        minHeight: `${minHeight}px`,
        zIndex: 1000,
      }}
      placeholder=""
      autoFocus
      spellCheck={false}
    />
  );
};
