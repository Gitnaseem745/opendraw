/**
 * @fileoverview View control buttons for canvas manipulation
 * @description Provides zoom, pan, grid, and ruler controls for canvas interaction
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ViewControls />
 * ```
 * 
 * @features
 * - Zoom in/out controls
 * - Reset view functionality
 * - Grid toggle
 * - Ruler toggle
 * - Responsive design
 * - Keyboard shortcut support
 */

import { useDrawingStore } from '@/store/drawingStore';
import { useUIStore } from '@/store/uiStore';
import { ToolButton } from '../shared/ToolButton';
import { Grid, Home, Ruler, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * View controls component for canvas manipulation
 * 
 * Provides comprehensive view controls including zoom, reset, grid toggle,
 * and ruler toggle functionality. Features responsive design and proper
 * state management.
 * 
 * @returns {JSX.Element} The rendered view controls component
 */
export const ViewControls = () => {
  const { resetView, scale, setScale } = useDrawingStore();
  const { showGrid, showRulers, toggleGrid, toggleRulers } = useUIStore();
  
  /**
   * Zoom in by 20% with maximum limit
   */
  const zoomIn = () => {
    setScale(Math.min(scale * 1.2, 20));
  };
  
  /**
   * Zoom out by 20% with minimum limit
   */
  const zoomOut = () => {
    setScale(Math.max(scale / 1.2, 0.1));
  };

  /**
   * View control tools configuration
   */
  const tools = [
    { 
      icon: <ZoomOut size={18} />, 
      label: 'Zoom Out (-)', 
      onClick: zoomOut, 
      isActive: scale > 0.1,
      disabled: scale <= 0.1 
    },
    { 
      icon: <ZoomIn size={18} />, 
      label: 'Zoom In (+)', 
      onClick: zoomIn, 
      isActive: scale < 20,
      disabled: scale >= 20 
    },
    { 
      icon: <Home size={18} />, 
      label: 'Reset View (Ctrl+0)', 
      onClick: resetView, 
      isActive: true,
      disabled: false 
    },
    { 
      icon: <Grid size={18} />, 
      label: 'Toggle Grid (G)', 
      onClick: toggleGrid, 
      isActive: showGrid,
      disabled: false 
    },
    { 
      icon: <Ruler size={18} />, 
      label: 'Toggle Rulers (R)', 
      onClick: toggleRulers, 
      isActive: showRulers,
      disabled: false 
    },
  ];
  
  return (
    <div className="flex gap-2 p-1">
        {tools.map(({ icon, label, onClick, isActive, disabled }) => (
          <ToolButton
            key={label}
            isActive={isActive}
            onClick={onClick}
            disabled={disabled}
            label={label}
          >
            {icon}
          </ToolButton>
        ))}
    </div>
  );
};
