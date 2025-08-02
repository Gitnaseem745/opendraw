/**
 * @fileoverview Object manipulation controls for grouping and layer management
 * @description Provides UI controls for grouping/ungrouping shapes and managing layers
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ObjectControls />
 * ```
 * 
 * @features
 * - Group/ungroup selected shapes
 * - Layer management (bring forward, send backward)
 * - Keyboard shortcut integration
 * - Visual feedback for available actions
 * - Responsive design
 */

import { useDrawingStore } from '@/store/drawingStore';
import { ToolButton } from '../shared/ToolButton';
import { 
  Group, 
  Ungroup, 
  ChevronUp, 
  ChevronDown, 
  Layers3 
} from 'lucide-react';

/**
 * Object manipulation controls component
 * 
 * Provides controls for grouping/ungrouping shapes and managing layer order.
 * Only visible when shapes are selected.
 * 
 * @returns {JSX.Element} The rendered object controls component
 */
export const ObjectControls = () => {
  const { 
    selectedShapes, 
    groupShapes, 
    ungroupShapes, 
    bringForward, 
    sendBackward 
  } = useDrawingStore();

  // Don't render if no shapes are selected
  if (selectedShapes.length === 0) return null;

  const hasGroupedShapes = selectedShapes.some(shape => shape.isGrouped);
  const canGroup = selectedShapes.length >= 2 && !hasGroupedShapes;
  const canUngroup = selectedShapes.length > 0 && hasGroupedShapes;
  const canManageLayers = selectedShapes.length === 1;

  /**
   * Handles grouping selected shapes
   */
  const handleGroup = () => {
    if (canGroup) {
      const shapeIds = selectedShapes.map(shape => shape.id);
      groupShapes(shapeIds);
    }
  };

  /**
   * Handles ungrouping selected shapes
   */
  const handleUngroup = () => {
    if (canUngroup) {
      const groupId = selectedShapes.find(shape => shape.groupId)?.groupId;
      if (groupId) {
        ungroupShapes(groupId);
      }
    }
  };

  /**
   * Handles bringing shape forward
   */
  const handleBringForward = () => {
    if (canManageLayers) {
      bringForward(selectedShapes[0].id);
    }
  };

  /**
   * Handles sending shape backward
   */
  const handleSendBackward = () => {
    if (canManageLayers) {
      sendBackward(selectedShapes[0].id);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
        <Layers3 size={12} />
        <span>Object Controls</span>
      </div>
      
      <div className="flex gap-1">
        {/* Grouping Controls */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded">
          <ToolButton
            isActive={false}
            onClick={handleGroup}
            disabled={!canGroup}
            label="Group (Ctrl+G)"
          >
            <Group size={16} />
          </ToolButton>
          
          <ToolButton
            isActive={false}
            onClick={handleUngroup}
            disabled={!canUngroup}
            label="Ungroup (Ctrl+Shift+G)"
          >
            <Ungroup size={16} />
          </ToolButton>
        </div>

        {/* Layer Management Controls */}
        {canManageLayers && (
          <div className="flex gap-1 p-1 bg-muted/50 rounded">
            <ToolButton
              isActive={false}
              onClick={handleBringForward}
              label="Bring Forward (Ctrl+])"
            >
              <ChevronUp size={16} />
            </ToolButton>
            
            <ToolButton
              isActive={false}
              onClick={handleSendBackward}
              label="Send Backward (Ctrl+[)"
            >
              <ChevronDown size={16} />
            </ToolButton>
          </div>
        )}
      </div>
      
      {/* Selection Info */}
      <div className="text-xs text-muted-foreground border-t border-border pt-2">
        {selectedShapes.length === 1 ? (
          <span>1 shape selected</span>
        ) : (
          <span>{selectedShapes.length} shapes selected</span>
        )}
        {hasGroupedShapes && (
          <span className="ml-2 text-primary">• Grouped</span>
        )}
      </div>
    </div>
  );
};
