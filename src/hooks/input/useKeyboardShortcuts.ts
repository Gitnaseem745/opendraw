import { useKeyboard } from './useKeyboard';
import { useDrawingStore } from '@/store/drawingStore';
import { Tools } from '@/types';

/**
 * Custom hook that manages keyboard shortcuts for the drawing application.
 * Provides shortcuts for undo/redo, view controls, and tool selection.
 * 
 * @returns {void} - This hook doesn't return anything but sets up keyboard listeners
 */
export const useKeyboardShortcuts = () => {
  const { 
    undo, redo, setTool, resetView, action, 
    selectedShapes, groupShapes, ungroupShapes, groups,
    bringForward, sendBackward 
  } = useDrawingStore();
  
  // Helper function to check if user is typing in an input field
  const isTypingInInput = (event: KeyboardEvent): boolean => {
    const target = event.target as HTMLElement;
    const tagName = target?.tagName?.toLowerCase();
    const isContentEditable = target?.contentEditable === 'true';
    const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
    const isWriting = action === 'writing';
    
    return isInput || isContentEditable || isWriting;
  };
  
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

  // Tool shortcuts - only work when not typing
  useKeyboard({
    keys: 'v',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.selection);
    },
  });

  useKeyboard({
    keys: 'p',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.pencil);
    },
  });

  useKeyboard({
    keys: 'l',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.line);
    },
  });

  useKeyboard({
    keys: 'r',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.rectangle);
    },
  });

  useKeyboard({
    keys: 't',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.text);
    },
  });

  useKeyboard({
    keys: 'h',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.pan);
    },
  });

  useKeyboard({
    keys: 'c',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.circle);
    },
  });

  useKeyboard({
    keys: 'a',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.arrow);
    },
  });

  useKeyboard({
    keys: 'e',
    callback: (e) => {
      if (isTypingInInput(e)) return;
      setTool(Tools.eraser);
    },
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
};
