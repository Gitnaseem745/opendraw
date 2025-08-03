/**
 * @fileoverview Mobile-optimized tool panel for touch devices
 * @description Provides a compact, touch-friendly toolbar optimized for mobile devices
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <MobileToolPanel />
 * ```
 * 
 * @features
 * - Touch-optimized button sizes
 * - Swipeable tool selection
 * - Compact layout for mobile screens
 * - Essential tools only
 * - Gesture-friendly interaction
 */

import { useDrawingStore } from '@/store/drawingStore';
import { useMobileOptimization } from '@/hooks/input';
import { Tools } from '@/types';
import { UndoRedoButtons } from './UndoRedoButtons';
import { 
  ArrowRight, 
  Circle, 
  Diamond, 
  Eraser, 
  Hand, 
  Minus, 
  MousePointer2, 
  Pencil, 
  Square, 
  Triangle, 
  TypeOutline,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useState } from 'react';

/**
 * Mobile-optimized tool panel component
 * 
 * Provides essential drawing tools in a touch-friendly interface optimized for mobile devices.
 * Features larger touch targets, simplified layout, and swipeable tool categories.
 * 
 * @returns {JSX.Element} The rendered mobile tool panel component
 */
export const MobileToolPanel = () => {
  const { tool, setTool, scale, setScale, resetView } = useDrawingStore();
  const { provideTouchFeedback } = useMobileOptimization();
  const [activeTab, setActiveTab] = useState<'draw' | 'shapes' | 'view'>('draw');
  
  /**
   * Handle tool selection with haptic feedback
   */
  const handleToolSelect = (selectedTool: Tools) => {
    setTool(selectedTool);
    provideTouchFeedback('light');
  };

  /**
   * Handle zoom with haptic feedback
   */
  const handleZoom = (zoomIn: boolean) => {
    const newScale = zoomIn 
      ? Math.min(scale * 1.25, 5) 
      : Math.max(scale / 1.25, 0.1);
    setScale(newScale);
    provideTouchFeedback('medium');
  };

  /**
   * Drawing tools for mobile
   */
  const drawingTools = [
    { type: Tools.selection, icon: <MousePointer2 size={24} />, label: 'Select' },
    { type: Tools.pencil, icon: <Pencil size={24} />, label: 'Draw' },
    { type: Tools.eraser, icon: <Eraser size={24} />, label: 'Erase' },
    { type: Tools.text, icon: <TypeOutline size={24} />, label: 'Text' },
  ];

  const shapeTools = [
    { type: Tools.line, icon: <Minus size={24} />, label: 'Line' },
    { type: Tools.rectangle, icon: <Square size={24} />, label: 'Rectangle' },
    { type: Tools.circle, icon: <Circle size={24} />, label: 'Circle' },
    { type: Tools.triangle, icon: <Triangle size={24} />, label: 'Triangle' },
    { type: Tools.diamond, icon: <Diamond size={24} />, label: 'Diamond' },
    { type: Tools.arrow, icon: <ArrowRight size={24} />, label: 'Arrow' },
  ];

  const viewTools = [
    { type: Tools.pan, icon: <Hand size={24} />, label: 'Pan' },
  ];

  /**
   * Get current tool set based on active tab
   */
  const getCurrentTools = () => {
    switch (activeTab) {
      case 'draw': return drawingTools;
      case 'shapes': return shapeTools;
      case 'view': return viewTools;
      default: return drawingTools;
    }
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      {/* Tab Navigation */}
      <div className="flex border-b border-border">
        {[
          { id: 'draw', label: 'Draw' },
          { id: 'shapes', label: 'Shapes' },
          { id: 'view', label: 'View' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id as 'draw' | 'shapes' | 'view');
              provideTouchFeedback('light');
            }}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'text-primary border-b-2 border-primary bg-primary/10'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tool Grid */}
      <div className="p-3">
        {activeTab === 'view' ? (
          // View controls layout
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <UndoRedoButtons />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToolSelect(Tools.pan)}
                className={`h-12 w-12 rounded-md border flex items-center justify-center transition-all duration-200 ${
                  tool === Tools.pan
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-background hover:bg-accent/50'
                }`}
                aria-label="Pan"
              >
                <Hand size={24} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleZoom(false)}
                className="h-12 w-12 rounded-md border bg-background hover:bg-accent/50 flex items-center justify-center transition-all duration-200"
                aria-label="Zoom Out"
              >
                <ZoomOut size={24} />
              </button>
              
              <button
                onClick={() => handleZoom(true)}
                className="h-12 w-12 rounded-md border bg-background hover:bg-accent/50 flex items-center justify-center transition-all duration-200"
                aria-label="Zoom In"
              >
                <ZoomIn size={24} />
              </button>
              
              <button
                onClick={() => {
                  resetView();
                  provideTouchFeedback('medium');
                }}
                className="h-12 w-12 rounded-md border bg-background hover:bg-accent/50 flex items-center justify-center transition-all duration-200"
                aria-label="Reset View"
              >
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
        ) : (
          // Regular tool grid
          <div className={`grid gap-3 ${
            activeTab === 'shapes' ? 'grid-cols-3' : 'grid-cols-4'
          }`}>
            {getCurrentTools().map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => handleToolSelect(type)}
                className={`h-16 w-full rounded-md border flex flex-col items-center justify-center gap-1 touch-manipulation transition-all duration-200 ${
                  tool === type
                    ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                    : 'bg-background hover:bg-accent/50 border-border'
                }`}
                aria-label={label}
              >
                <span className="block">{icon}</span>
                <span className="text-xs text-center leading-none">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions for Draw Tab */}
      {activeTab === 'draw' && (
        <div className="px-3 pb-3 pt-1 border-t border-border">
          <div className="flex items-center justify-center gap-2">
            <UndoRedoButtons />
          </div>
        </div>
      )}
    </div>
  );
};
