import { useEffect, useRef, useCallback } from 'react';
import { useDrawingStore } from '@/store/drawingStore';
import { useUIStore } from '@/store/uiStore';
import { drawShape } from '@/lib/draw-shape';
import { canvasUtils } from '@/lib/canvasUtils';
import { Shape } from '@/types';

/**
 * Draws selection indicators around a shape
 */
const drawSelectionIndicator = (ctx: CanvasRenderingContext2D, shape: Shape, isMultiSelect: boolean) => {
  if (!shape) return;
  
  ctx.save();
  ctx.strokeStyle = '#3b82f6'; // Blue selection color
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  const padding = 5;
  const x1 = Math.min(shape.x1, shape.x2) - padding;
  const y1 = Math.min(shape.y1, shape.y2) - padding;
  const x2 = Math.max(shape.x1, shape.x2) + padding;
  const y2 = Math.max(shape.y1, shape.y2) + padding;
  
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  
  // Draw corner handles for single selection only
  if (!isMultiSelect) {
    ctx.fillStyle = '#3b82f6';
    ctx.setLineDash([]);
    const handleSize = 6;
    
    // Corner handles
    const corners = [
      [x1, y1], [x2, y1], [x2, y2], [x1, y2]
    ];
    
    corners.forEach(([x, y]) => {
      ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize);
    });
  }
  
  ctx.restore();
};

/**
 * Draws a grid overlay on the canvas
 */
const drawGrid = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.save();
  
  // Grid settings
  const gridSize = 20; // Grid cell size in pixels
  const gridColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--border')
    .trim() || '#e5e5e5';
  
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5; // Make grid semi-transparent
  
  // Draw vertical lines
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  ctx.restore();
};

/**
 * Custom hook that handles canvas rendering and re-rendering.
 * Manages canvas transformations (scale, pan), renders all shapes,
 * and ensures the canvas is updated when the drawing state changes.
 * 
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef - Reference to the canvas element
 * @returns {void} - This hook doesn't return anything but manages canvas rendering
 */
export const useCanvasRenderer = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { shapes, selectedShape, selectedShapes, action, scale, panOffset } = useDrawingStore();
  const { showGrid } = useUIStore();
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const performRender = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Calculate scale offset
    const scaleOffset = canvasUtils.calculateScaleOffset(canvas.width, canvas.height, scale);
    
    // Update scale offset in store
    const { setScaleOffset } = useDrawingStore.getState();
    setScaleOffset(scaleOffset);

    // Setup canvas context with transformations
    const result = canvasUtils.setupCanvasContext(canvas, panOffset, scale, scaleOffset);
    if (!result) return;
    
    const { ctx, roughCanvas } = result;
    
    // Draw grid if enabled (draw without transformations)
    if (showGrid) {
      ctx.save();
      // Reset transformations temporarily for grid drawing
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawGrid(ctx, canvas);
      ctx.restore();
      // After restore, we're back to the transformed state from setupCanvasContext
    }
    
    // Sort shapes by zIndex for proper rendering order
    const sortedShapes = [...shapes].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    
    // Render shapes
    sortedShapes.forEach(shape => {
      if (action === "writing") return;
      drawShape(roughCanvas, ctx, shape);
    });
    
    // Draw selection indicators for all selected shapes
    // Use the actual shapes from the main array to ensure current positions are used
    const selectedShapeIds = selectedShapes.length > 0 
      ? selectedShapes.map(s => s.id) 
      : (selectedShape ? [selectedShape.id] : []);
    
    const allSelectedShapes = shapes.filter(shape => selectedShapeIds.includes(shape.id));
    const isMultiSelect = selectedShapes.length > 1;
    allSelectedShapes.forEach(shape => {
      drawSelectionIndicator(ctx, shape, isMultiSelect);
    });
    
    ctx.restore();
  }, [canvasRef, shapes, selectedShape, selectedShapes, action, scale, panOffset, showGrid]);
  
  useEffect(() => {
    // Clear any pending render timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    // For panning operations, throttle rendering to reduce flickering
    if (action === "panning") {
      renderTimeoutRef.current = setTimeout(() => {
        performRender();
      }, 16); // ~60fps
    } else if (action === "moving") {
      // For moving operations, slight delay to ensure state updates are complete
      renderTimeoutRef.current = setTimeout(() => {
        performRender();
      }, 1); // Minimal delay for state synchronization
    } else {
      // For all other operations, render immediately
      performRender();
    }

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [action, performRender]);
};
