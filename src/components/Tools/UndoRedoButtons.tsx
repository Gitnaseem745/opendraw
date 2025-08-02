/**
 * @fileoverview Undo and redo action buttons component
 * @description Provides undo and redo functionality with visual state indicators
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <UndoRedoButtons />
 * ```
 * 
 * @features
 * - Undo/redo state management
 * - Visual feedback for available actions
 * - Keyboard shortcut support
 * - Disabled state handling
 * - Accessibility support
 */

import { useDrawingStore } from '@/store/drawingStore';
import { ToolButton } from '../shared/ToolButton';
import { Redo, Undo } from 'lucide-react';

/**
 * Undo and redo buttons component
 * 
 * Provides undo and redo functionality with proper state management and
 * visual feedback. Buttons are automatically disabled when actions are
 * not available.
 * 
 * @returns {JSX.Element} The rendered undo/redo buttons component
 */
export const UndoRedoButtons = () => {
  const undo = useDrawingStore(state => state.undo);
  const redo = useDrawingStore(state => state.redo);
  const canUndo = useDrawingStore(state => state.historyIndex > 0);
  const canRedo = useDrawingStore(state => state.historyIndex < state.history.length - 1);
  
  return (
    <div className="flex gap-1">
      <ToolButton
        isActive={canUndo}
        onClick={undo}
        disabled={!canUndo}
        label="Undo (Ctrl+Z)"
      >
        <Undo size={20} />
      </ToolButton>
      <ToolButton
        isActive={canRedo}
        onClick={redo}
        disabled={!canRedo}
        label="Redo (Ctrl+Y)"
      >
        <Redo size={20} />
      </ToolButton>
    </div>
  );
};
