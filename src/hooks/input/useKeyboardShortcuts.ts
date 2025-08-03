import { resetCanvas } from '@/lib/canvasUtils';
import { useKeyboard } from './useKeyboard';
import { useDrawingStore } from '@/store/drawingStore';
import { useUIStore } from '@/store/uiStore';
import { Tools } from '@/types';
import { useCanvasStore } from '@/store/canvasStore';

/**
 * Custom hook that manages keyboard shortcuts for the drawing application.
 * Provides shortcuts for undo/redo, view controls, tool selection, and more.
 * 
 * Available shortcuts:
 * 
 * === TOOLS ===
 * V - Selection tool
 * P - Pencil tool
 * L - Line tool
 * R - Rectangle tool
 * U - Triangle tool
 * C - Circle tool
 * D - Diamond tool
 * A - Arrow tool
 * T - Text tool
 * H - Pan tool
 * E - Eraser tool
 * K - Lock tool
 * 
 * === VIEW CONTROLS ===
 * Ctrl+0 or 0 - Reset view to fit canvas
 * G - Toggle grid
 * Ctrl+; - Toggle rulers
 * +, =, Ctrl++, Ctrl+= - Zoom in (prevents browser zoom)
 * -, Ctrl+- - Zoom out (prevents browser zoom)
 * Space (hold) - Pan mode (when not typing)
 * 
 * === EDIT OPERATIONS ===
 * Ctrl+Z - Undo
 * Ctrl+Y or Ctrl+Shift+Z - Redo
 * Ctrl+A - Select all shapes
 * Delete or Backspace - Delete selected shapes
 * Ctrl+D - Duplicate selected shapes
 * Escape - Deselect all shapes
 * 
 * === GROUPING ===
 * Ctrl+G - Group selected shapes
 * Ctrl+Shift+G - Ungroup selected shapes
 * 
 * === LAYER MANAGEMENT ===
 * Ctrl+] - Bring forward
 * Ctrl+[ - Send backward
 * Ctrl+Shift+] - Bring to front
 * Ctrl+Shift+[ - Send to back
 * Ctrl+Shift+. - Bring to front (alternative)
 * Ctrl+Shift+, - Send to back (alternative)
 * Alt + mouse click - Duplicate Shapes
 *  
 * === FILE OPERATIONS ===
 * Ctrl+S - Export drawing
 * Ctrl+O - Import drawing
 * N - New canvas (clear current)
 * 
 * @returns {void} - This hook doesn't return anything but sets up keyboard listeners
 */
export const useKeyboardShortcuts = () => {
  const { 
    undo, redo, setTool, resetView, action, 
    selectedShapes, groupShapes, ungroupShapes,
    bringForward, sendBackward, bringToFront, sendToBack,
    setSelectedShapes, shapes, duplicateShapes, deleteShape,
    clearCanvas, setScale, scale
  } = useDrawingStore();
  const { toggleGrid, toggleRulers, setShowExportModal, setShowImportModal } = useUIStore();
  const { canvasRef } = useCanvasStore()
  
  // Helper function to check if user is typing in an input field
  const isTypingInInput = (event: KeyboardEvent): boolean => {
    const target = event.target as HTMLElement;
    const tagName = target?.tagName?.toLowerCase();
    const isContentEditable = target?.contentEditable === 'true';
    const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
    const isWriting = action === 'writing';
    
    return isInput || isContentEditable || isWriting;
  };
  
  // Reset Canvas shortcuts
  useKeyboard({
    keys: 'n',
    callback: (e) => {
      if (isTypingInInput(e)) {
        return;
      }
      e.preventDefault();
      const resetDrawing = confirm("Are you sure you want to create a new canvas? This action cannot be undone.");
      if (resetDrawing) {
        resetCanvas(canvasRef, true, clearCanvas);
      }
    },
    preventDefault: true
  })

  // Undo/Redo shortcuts
  useKeyboard({
    keys: ['Control', 'z'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', 'y'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      redo();
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', 'Shift', 'z'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      redo();
    },
    preventDefault: true
  });

  // View shortcuts
  useKeyboard({
    keys: ['Control', '0'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      resetView();
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'v',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.selection);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'p',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.pencil);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'l',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.line);
    },
    preventDefault: true
  });
  
  useKeyboard({
    keys: ['k'],
    callback: (e) => {
        if(isTypingInInput(e)) return;
        e.preventDefault();
        setTool(Tools.lock);
    },
    preventDefault: true
  })

  useKeyboard({
    keys: 'r',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.rectangle);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 't',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.text);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'h',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.pan);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'c',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.circle);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'a',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.arrow);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'e',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.eraser);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'd',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.diamond);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'u',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setTool(Tools.triangle);
    },
    preventDefault: true
  });

  // Grouping shortcuts
  useKeyboard({
    keys: ['Control', 'g'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length >= 2) {
        const shapeIds = selectedShapes.map(shape => shape.id);
        groupShapes(shapeIds);
      }
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', 'Shift', 'g'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length > 0) {
        const groupId = selectedShapes[0]?.groupId;
        if (groupId) {
          ungroupShapes(groupId);
        }
      }
    },
    preventDefault: true
  });

  // Layer management shortcuts
  useKeyboard({
    keys: ['Control', ']'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length === 1) {
        bringForward(selectedShapes[0].id);
      }
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', '['],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length === 1) {
        sendBackward(selectedShapes[0].id);
      }
    },
    preventDefault: true
  });

  // Additional layer management shortcuts with alternative key combinations
  useKeyboard({
    keys: ['Ctrl', 'Shift', ']'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length === 1) {
        bringToFront(selectedShapes[0].id);
      }
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Ctrl', 'Shift', '['],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length === 1) {
        sendToBack(selectedShapes[0].id);
      }
    },
    preventDefault: true
  });

  // Alternative layer shortcuts using different key combinations
  useKeyboard({
    keys: ['Control', 'Shift', '.'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length === 1) {
        bringToFront(selectedShapes[0].id);
      }
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', 'Shift', ','],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length === 1) {
        sendToBack(selectedShapes[0].id);
      }
    },
    preventDefault: true
  });

  // View control shortcuts
  useKeyboard({
    keys: 'g',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      toggleGrid();
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', ';'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      toggleRulers();
    },
    preventDefault: true
  });

  // Zoom shortcuts - handle multiple key variations and prevent browser zoom
  useKeyboard({
    keys: '=',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setScale(Math.min(scale * 1.2, 20));
    },
    preventDefault: true
  });

  useKeyboard({
    keys: '+',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setScale(Math.min(scale * 1.2, 20));
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', '='],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setScale(Math.min(scale * 1.2, 20));
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', '+'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setScale(Math.min(scale * 1.2, 20));
    },
    preventDefault: true
  });

  useKeyboard({
    keys: '-',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setScale(Math.max(scale / 1.2, 0.1));
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', '-'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setScale(Math.max(scale / 1.2, 0.1));
    },
    preventDefault: true
  });

  useKeyboard({
    keys: '0',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      resetView();
    },
    preventDefault: true
  });

  // File operation shortcuts
  useKeyboard({
    keys: ['Control', 's'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setShowExportModal(true);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', 'o'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setShowImportModal(true);
    },
    preventDefault: true
  });

  // Selection and editing shortcuts
  useKeyboard({
    keys: ['Control', 'a'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setSelectedShapes(shapes);
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'Delete',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      if (selectedShapes.length > 0) {
        selectedShapes.forEach(shape => deleteShape(shape.id));
        setSelectedShapes([]);
      }
    },
  });

  useKeyboard({
    keys: 'Backspace',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      if (selectedShapes.length > 0) {
        e.preventDefault();
        selectedShapes.forEach(shape => deleteShape(shape.id));
        setSelectedShapes([]);
      }
    },
    preventDefault: true
  });

  useKeyboard({
    keys: ['Control', 'd'],
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      if (selectedShapes.length > 0) {
        const duplicated = duplicateShapes(selectedShapes, 20, 20, true);
        setSelectedShapes(duplicated);
      }
    },
    preventDefault: true
  });

  useKeyboard({
    keys: 'Escape',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      e.preventDefault();
      setSelectedShapes([]);
    },
    preventDefault: true
  });
};
