import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Shape, Tools, Actions, Group } from '@/types';
import { createShape } from '@/lib/create-shape';

/**
 * Helper function to calculate bounding box for a group of shapes
 */
const calculateGroupBounds = (shapes: Shape[]) => {
  if (shapes.length === 0) return { x1: 0, y1: 0, x2: 0, y2: 0 };
  
  const x1 = Math.min(...shapes.map(s => Math.min(s.x1, s.x2)));
  const y1 = Math.min(...shapes.map(s => Math.min(s.y1, s.y2)));
  const x2 = Math.max(...shapes.map(s => Math.max(s.x1, s.x2)));
  const y2 = Math.max(...shapes.map(s => Math.max(s.y1, s.y2)));
  
  return { x1, y1, x2, y2 };
};

interface DrawingState {
  // Core drawing state
  shapes: Shape[];
  selectedShape: Shape | null;
  selectedShapes: Shape[]; // For multi-selection
  tool: Tools;
  action: Actions;
  
  // Drawing properties
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  
  // Grouping state
  groups: Group[];
  
  // View state
  scale: number;
  panOffset: { x: number; y: number };
  scaleOffset: { x: number; y: number };
  
  // History state
  history: Shape[][];
  historyIndex: number;
  
  // Shape actions
  setShapes: (shapes: Shape[], addToHistory?: boolean) => void;
  setSelectedShape: (element: Shape | null) => void;
  setSelectedShapes: (shapes: Shape[]) => void;
  updateShape: (id: number, updates: Partial<Shape>) => void;
  deleteShape: (id: number) => void;
  duplicateShapes: (shapes: Shape[], offsetX?: number, offsetY?: number, saveToHistory?: boolean) => Shape[];

  // Grouping actions
  groupShapes: (shapeIds: number[]) => string;
  ungroupShapes: (groupId: string) => void;
  getGroupedShapes: (groupId: string) => Shape[];
  
  // Layer management actions
  bringToFront: (shapeId: number) => void;
  sendToBack: (shapeId: number) => void;
  bringForward: (shapeId: number) => void;
  sendBackward: (shapeId: number) => void;
  clearCanvas: () => void;

  // Tool actions
  setTool: (tool: Tools) => void;
  setAction: (action: Actions) => void;

  // Drawing property actions
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  updateUIColorsFromShape: (shape: Shape) => void;

  // View actions
  setScale: (scale: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setScaleOffset: (offset: { x: number; y: number }) => void;
  resetView: () => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

/**
 * Main Zustand store for managing the drawing application state.
 * Handles shapes, tools, view transformations, and undo/redo history.
 * Uses subscribeWithSelector middleware for performance optimization.
 */
export const useDrawingStore = create<DrawingState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    shapes: [],
    selectedShape: null,
    selectedShapes: [],
    tool: Tools.selection,
    action: "none",
    strokeColor: "#000000",
    fillColor: "transparent",
    strokeWidth: 2,
    groups: [],
    scale: 1,
    panOffset: { x: 0, y: 0 },
    scaleOffset: { x: 0, y: 0 },
    history: [[]],
    historyIndex: 0,

    // Shape actions
    setShapes: (shapes, addToHistory = false) => set((state) => {
      if (addToHistory) {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(shapes);
        return {
          shapes,
          history: newHistory.slice(-30), // Limit history size
          historyIndex: Math.min(newHistory.length - 1, 29)
        };
      }
      return { shapes: shapes };
    }),

    setSelectedShape: (selectedShape) => set({ selectedShape }),
    setSelectedShapes: (selectedShapes) => set({ selectedShapes }),
    setTool: (tool) => set({ tool }),
    setAction: (action) => set({ action }),

    // Drawing property actions
    setStrokeColor: (strokeColor) => set((state) => {
      // Update selected shapes with new stroke color
      const updatedShapes = state.shapes.map(shape => {
        if (state.selectedShapes.some(selected => selected.id === shape.id)) {
          // Recreate shape with new stroke color if it's selected
          if (shape.type !== 'pencil' && shape.type !== 'text') {
            const recreatedShape = createShape(
              {
                id: shape.id,
                x1: shape.x1,
                y1: shape.y1,
                x2: shape.x2,
                y2: shape.y2,
                type: shape.type
              },
              strokeColor, // Use new stroke color
              shape.fillColor,
              shape.strokeWidth,
              shape.zIndex
            );
            return {
              ...shape,
              strokeColor,
              roughShape: recreatedShape.roughShape
            };
          } else {
            // For pencil and text, just update the color property
            return {
              ...shape,
              strokeColor
            };
          }
        }
        return shape;
      });
      
      return { 
        strokeColor,
        shapes: updatedShapes
      };
    }),
    
    setFillColor: (fillColor) => set((state) => {
      // Update selected shapes with new fill color
      const updatedShapes = state.shapes.map(shape => {
        if (state.selectedShapes.some(selected => selected.id === shape.id)) {
          // Recreate shape with new fill color if it's selected
          if (shape.type !== 'pencil' && shape.type !== 'text') {
            const recreatedShape = createShape(
              {
                id: shape.id,
                x1: shape.x1,
                y1: shape.y1,
                x2: shape.x2,
                y2: shape.y2,
                type: shape.type
              },
              shape.strokeColor,
              fillColor, // Use new fill color
              shape.strokeWidth,
              shape.zIndex
            );
            return {
              ...shape,
              fillColor,
              roughShape: recreatedShape.roughShape
            };
          } else {
            // For pencil and text, just update the color property
            return {
              ...shape,
              fillColor
            };
          }
        }
        return shape;
      });
      
      return { 
        fillColor,
        shapes: updatedShapes
      };
    }),
    
    setStrokeWidth: (strokeWidth) => set((state) => {
      const validStrokeWidth = Math.max(1, Math.min(strokeWidth, 50));
      
      // Update selected shapes with new stroke width
      const updatedShapes = state.shapes.map(shape => {
        if (state.selectedShapes.some(selected => selected.id === shape.id)) {
          // Recreate shape with new stroke width if it's selected
          if (shape.type !== 'pencil' && shape.type !== 'text') {
            const recreatedShape = createShape(
              {
                id: shape.id,
                x1: shape.x1,
                y1: shape.y1,
                x2: shape.x2,
                y2: shape.y2,
                type: shape.type
              },
              shape.strokeColor,
              shape.fillColor,
              validStrokeWidth, // Use new stroke width
              shape.zIndex
            );
            return {
              ...shape,
              strokeWidth: validStrokeWidth,
              roughShape: recreatedShape.roughShape
            };
          } else {
            // For pencil and text, just update the width property
            return {
              ...shape,
              strokeWidth: validStrokeWidth
            };
          }
        }
        return shape;
      });
      
      return { 
        strokeWidth: validStrokeWidth,
        shapes: updatedShapes
      };
    }),

    // Update UI colors to match selected shape's properties
    updateUIColorsFromShape: (shape: Shape) => set({
      strokeColor: shape.strokeColor || "#000000",
      fillColor: shape.fillColor || "transparent", 
      strokeWidth: shape.strokeWidth || 2
    }),

  updateShape: (id, updates) => set((state) => ({
    shapes: state.shapes.map(el =>
      el.id === id ? { ...el, ...updates } : el
    )
  })),

    deleteShape: (id) => set((state) => ({
      shapes: state.shapes.filter(el => el.id !== id)
    })),

    duplicateShapes: (shapesToDuplicate, offsetX = 20, offsetY = 20, saveToHistory = false) => {
      const { shapes } = get();
      const maxId = Math.max(...shapes.map(s => s.id), -1);
      const maxZ = Math.max(...shapes.map(s => s.zIndex || 0), 0);
      
      const duplicatedShapes = shapesToDuplicate.map((shape, index) => {
        const newId = maxId + 1 + index;
        const newZIndex = maxZ + 1 + index;
        
        // Handle different shape types for positioning
        if (shape.type === 'pencil' && shape.points) {
          // For pencil tool, offset all points
          return {
            ...shape,
            id: shapes.length + 1,
            zIndex: newZIndex,
            // Clear grouping info for duplicated shapes
            groupId: null,
            isGrouped: false,
            points: shape.points.map(point => ({
              x: point.x + offsetX,
              y: point.y + offsetY
            }))
          };
        } else {
          // For other shapes, offset x1, y1, x2, y2 and recreate roughShape
          const newX1 = shape.x1 + offsetX;
          const newY1 = shape.y1 + offsetY;
          const newX2 = shape.x2 + offsetX;
          const newY2 = shape.y2 + offsetY;
          
          // Recreate roughShape with new coordinates for proper rendering
          if (shape.type !== 'text' && shape.type !== 'pencil') {
            const recreatedShape = createShape(
              {
                id: newId,
                x1: newX1,
                y1: newY1,
                x2: newX2,
                y2: newY2,
                type: shape.type
              },
              shape.strokeColor,
              shape.fillColor,
              shape.strokeWidth,
              newZIndex
            );
            
            return {
              ...shape,
              id: newId,
              zIndex: newZIndex,
              groupId: null,
              isGrouped: false,
              x1: newX1,
              y1: newY1,
              x2: newX2,
              y2: newY2,
              roughShape: recreatedShape.roughShape
            };
          } else {
            // For text shapes, just update coordinates
            return {
              ...shape,
              id: newId,
              zIndex: newZIndex,
              groupId: null,
              isGrouped: false,
              x1: newX1,
              y1: newY1,
              x2: newX2,
              y2: newY2
            };
          }
        }
      });
      
      set((state) => {
        const newShapes = [...state.shapes, ...duplicatedShapes];
        
        if (saveToHistory) {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(newShapes);
          return {
            shapes: newShapes,
            selectedShapes: duplicatedShapes,
            selectedShape: duplicatedShapes[0] || null,
            history: newHistory.slice(-30), // Limit history size
            historyIndex: Math.min(newHistory.length - 1, 29)
          };
        }
        
        return {
          shapes: newShapes,
          selectedShapes: duplicatedShapes,
          selectedShape: duplicatedShapes[0] || null
        };
      }, false);
      
      return duplicatedShapes;
    },

    // Grouping actions
    groupShapes: (shapeIds) => {
      const groupId = `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      set((state) => {
        const groupedShapes = state.shapes.map(shape => 
          shapeIds.includes(shape.id) 
            ? { ...shape, groupId, isGrouped: true }
            : shape
        );
        const selectedShapes = groupedShapes.filter(shape => shape.groupId === groupId);
        const bounds = calculateGroupBounds(selectedShapes);
        
        const newGroup: Group = {
          id: groupId,
          shapeIds,
          ...bounds,
          created: Date.now()
        };

        return {
          shapes: groupedShapes,
          groups: [...state.groups, newGroup],
          selectedShapes: selectedShapes,
          selectedShape: null
        };
      });
      return groupId;
    },

    ungroupShapes: (groupId) => set((state) => ({
      shapes: state.shapes.map(shape => 
        shape.groupId === groupId 
          ? { ...shape, groupId: null, isGrouped: false }
          : shape
      ),
      groups: state.groups.filter(group => group.id !== groupId),
      selectedShapes: [],
      selectedShape: null
    })),

    getGroupedShapes: (groupId) => {
      const state = get();
      return state.shapes.filter(shape => shape.groupId === groupId);
    },

    // Layer management actions
    bringToFront: (shapeId) => set((state) => {
      const maxZ = Math.max(...state.shapes.map(s => s.zIndex || 0));
      return {
        shapes: state.shapes.map(shape =>
          shape.id === shapeId 
            ? { ...shape, zIndex: maxZ + 1 }
            : shape
        )
      };
    }),

    sendToBack: (shapeId) => set((state) => {
      const minZ = Math.min(...state.shapes.map(s => s.zIndex || 0));
      return {
        shapes: state.shapes.map(shape =>
          shape.id === shapeId 
            ? { ...shape, zIndex: minZ - 1 }
            : shape
        )
      };
    }),

    bringForward: (shapeId) => set((state) => {
      const shape = state.shapes.find(s => s.id === shapeId);
      if (!shape) return state;
      
      const currentZ = shape.zIndex || 0;
      const higherShapes = state.shapes.filter(s => (s.zIndex || 0) > currentZ);
      const nextZ = higherShapes.length > 0 
        ? Math.min(...higherShapes.map(s => s.zIndex || 0))
        : currentZ + 1;
      
      return {
        shapes: state.shapes.map(s =>
          s.id === shapeId 
            ? { ...s, zIndex: nextZ + 1 }
            : s
        )
      };
    }),

    sendBackward: (shapeId) => set((state) => {
      const shape = state.shapes.find(s => s.id === shapeId);
      if (!shape) return state;
      
      const currentZ = shape.zIndex || 0;
      const lowerShapes = state.shapes.filter(s => (s.zIndex || 0) < currentZ);
      const nextZ = lowerShapes.length > 0 
        ? Math.max(...lowerShapes.map(s => s.zIndex || 0))
        : currentZ - 1;
      
      return {
        shapes: state.shapes.map(s =>
          s.id === shapeId 
            ? { ...s, zIndex: nextZ - 1 }
            : s
        )
      };
    }),  // Clear canvas function (used by reset button)
  clearCanvas: () => set(() => ({
    shapes: [],
    selectedShape: null,
    history: [[]],
    historyIndex: 0,
    action: "none"
  })),    // View actions
    setScale: (scale) => set({ scale: Math.min(Math.max(scale, 0.1), 20) }),
    setPanOffset: (panOffset) => set({ panOffset }),
    setScaleOffset: (scaleOffset) => set({ scaleOffset }),
    resetView: () => set({ scale: 1, panOffset: { x: 0, y: 0 } }),
    
    // History actions
    undo: () => set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          historyIndex: newIndex,
          shapes: state.history[newIndex]
        };
      }
      return state;
    }),
    
    redo: () => set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          historyIndex: newIndex,
          shapes: state.history[newIndex]
        };
      }
      return state;
    }),
    
    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,
  }))
);
