/**
 * @fileoverview Main tool panel component for drawing tool selection
 * @description Provides a comprehensive toolbar with drawing tools, undo/redo, and view controls
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ToolPanel />
 * ```
 * 
 * @features
 * - Complete set of drawing tools
 * - Undo/redo functionality
 * - View controls (zoom, pan, grid)
 * - Responsive design (hidden on mobile)
 * - Tool state management
 * - Accessibility support
 */

import { useDrawingStore } from '@/store/drawingStore';
import { Tools } from '@/types';
import { ToolButton } from '../shared/ToolButton';
import { UndoRedoButtons } from './UndoRedoButtons';
import { ViewControls } from './ViewControls';
import { ArrowRight, Circle, Diamond, Eraser, Hand, Lock, Minus, MousePointer2, Pencil, Square, Triangle, TypeOutline } from 'lucide-react';

/**
 * Main tool panel component
 * 
 * Provides a comprehensive toolbar with all drawing tools, undo/redo functionality,
 * and view controls. Features responsive design and is hidden on mobile devices
 * to preserve screen space.
 * 
 * @returns {JSX.Element} The rendered tool panel component
 */
export const ToolPanel = () => {
  const { tool, setTool } = useDrawingStore();
  
  /**
   * Available drawing tools configuration
   */
  const tools = [
    { type: Tools.selection, icon: <MousePointer2 size={20} />, label: 'Select (V)' },
    { type: Tools.pencil, icon: <Pencil size={20} />, label: 'Pencil (P)' },
    { type: Tools.line, icon: <Minus size={20} />, label: 'Line (L)' },
    { type: Tools.rectangle, icon: <Square size={20} />, label: 'Rectangle (R)' },
    { type: Tools.triangle, icon: <Triangle size={20} />, label: 'Triangle (U)' },
    { type: Tools.circle, icon: <Circle size={20} />, label: 'Circle (C)' },
    { type: Tools.diamond, icon: <Diamond size={20} />, label: 'Diamond (D)' },
    { type: Tools.arrow, icon: <ArrowRight size={20} />, label: 'Arrow (A)' },
    { type: Tools.text, icon: <TypeOutline size={20} />, label: 'Text (T)' },
    { type: Tools.pan, icon: <Hand size={20} />, label: 'Pan (H)' },
    { type: Tools.eraser, icon: <Eraser size={20} />, label: 'Eraser (E)' },
    { type: Tools.lock, icon: <Lock size={20} />, label: 'Lock' },
  ];
  
  return (
    <div className="flex flex-col gap-3 sm:gap-4 absolute top-2 right-2 sm:top-4 sm:right-4 z-10 max-sm:hidden">
        {/* Main Tools Grid */}
        <div className="grid grid-cols-6 gap-1 sm:gap-2 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
            {tools.map(({ type, icon, label }) => (
                <ToolButton
                    key={type}
                    isActive={tool === type}
                    onClick={() => setTool(type)}
                    label={label}
                >
                    <span className="text-lg" title={label}>{icon}</span>
                </ToolButton>
            ))}
        </div>

        {/* Action Controls */}
        <div className="flex gap-2 justify-center">
            <div className="flex gap-1 p-2 items-center bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
                <UndoRedoButtons />
            </div>
            <div className="flex gap-1 p-1 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
                <ViewControls />
            </div>
        </div>
    </div>
  );
};
