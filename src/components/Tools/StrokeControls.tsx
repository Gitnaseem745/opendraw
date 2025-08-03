/**
 * @fileoverview Stroke and fill controls component for drawing customization
 * @description Provides stroke color, fill color, and stroke width controls with minimal sleek UI
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <StrokeControls />
 * ```
 * 
 * @features
 * - Stroke color picker with compact color palette
 * - Fill color picker with transparency option
 * - Stroke width controls with visual preview
 * - Minimal and sleek design matching toolbar
 */

import { useDrawingStore } from '@/store/drawingStore';
import { Minus, Plus, X } from 'lucide-react';
import { ToolButton } from '../shared/ToolButton';

/**
 * Stroke and fill controls component
 * 
 * Provides minimal and sleek controls for customizing stroke color, fill color,
 * and stroke width with an interface that matches the main toolbar design.
 * 
 * @returns {JSX.Element} The rendered stroke controls component
 */
export const StrokeControls = () => {
  const { 
    strokeColor, 
    fillColor, 
    strokeWidth, 
    setStrokeColor, 
    setFillColor, 
    setStrokeWidth 
  } = useDrawingStore();

  /**
   * Compact color palette for stroke and fill
   */
  const colorPalette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', 
    '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
  ];

  /**
   * Handles stroke width adjustment
   * @param {number} delta - Amount to change stroke width by
   */
  const adjustStrokeWidth = (delta: number) => {
    const newWidth = Math.max(1, Math.min(20, strokeWidth + delta));
    setStrokeWidth(newWidth);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Stroke Color Section */}
      <div className="flex gap-1 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <div className="flex items-center gap-1">
          {/* Current stroke color indicator */}
          <div 
            className="w-6 h-6 rounded border border-border cursor-pointer flex-shrink-0"
            style={{ backgroundColor: strokeColor }}
            title={`Current stroke: ${strokeColor}`}
          />
          {/* Compact color palette */}
          {colorPalette.map((color) => (
            <button
              key={`stroke-${color}`}
              onClick={() => setStrokeColor(color)}
              className={`w-5 h-5 rounded border cursor-pointer hover:scale-110 transition-transform ${
                strokeColor === color ? 'ring-1 ring-ring' : 'border-border/50'
              }`}
              style={{ backgroundColor: color }}
              title={`Set stroke to ${color}`}
              aria-label={`Set stroke color to ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Fill Color Section */}
      <div className="flex gap-1 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <div className="flex items-center gap-1">
          {/* Current fill color indicator or no-fill indicator */}
          <div className="relative w-6 h-6 rounded border border-border cursor-pointer flex-shrink-0">
            <div 
              className="w-full h-full rounded"
              style={{ 
                backgroundColor: fillColor === 'transparent' ? 'transparent' : fillColor,
                backgroundImage: fillColor === 'transparent' 
                  ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                  : 'none',
                backgroundSize: fillColor === 'transparent' ? '4px 4px' : 'auto',
                backgroundPosition: fillColor === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : 'auto'
              }}
              title={fillColor === 'transparent' ? 'No fill' : `Current fill: ${fillColor}`}
            />
            {fillColor === 'transparent' && (
              <X size={12} className="absolute inset-0 m-auto text-red-500" />
            )}
          </div>
          
          {/* No fill button */}
          <ToolButton
            isActive={fillColor === 'transparent'}
            onClick={() => setFillColor('transparent')}
            label="No Fill"
          >
            <X size={16} />
          </ToolButton>
          
          {/* Compact color palette */}
          {colorPalette.slice(0, 6).map((color) => (
            <button
              key={`fill-${color}`}
              onClick={() => setFillColor(color)}
              className={`w-5 h-5 rounded border cursor-pointer hover:scale-110 transition-transform ${
                fillColor === color ? 'ring-1 ring-ring' : 'border-border/50'
              }`}
              style={{ backgroundColor: color }}
              title={`Set fill to ${color}`}
              aria-label={`Set fill color to ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Stroke Width Section */}
      <div className="flex gap-1 p-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-lg">
        <div className="flex items-center gap-1">
          <ToolButton
            isActive={false}
            onClick={() => adjustStrokeWidth(-1)}
            disabled={strokeWidth <= 1}
            label="Decrease width"
          >
            <Minus size={16} />
          </ToolButton>
          
          {/* Width preview */}
          <div className="flex items-center justify-center w-8 h-8 bg-muted/50 rounded border border-border">
            <div 
              className="rounded-full bg-foreground"
              style={{ 
                width: `${Math.max(Math.min(strokeWidth * 2, 16), 2)}px`, 
                height: `${Math.max(Math.min(strokeWidth * 2, 16), 2)}px` 
              }}
              title={`Width: ${strokeWidth}px`}
            />
          </div>
          
          <ToolButton
            isActive={false}
            onClick={() => adjustStrokeWidth(1)}
            disabled={strokeWidth >= 20}
            label="Increase width"
          >
            <Plus size={16} />
          </ToolButton>
          
          {/* Width value indicator */}
          <div className="px-2 py-1 bg-muted/50 rounded border border-border text-xs font-mono min-w-[2.5rem] text-center">
            {strokeWidth}
          </div>
        </div>
      </div>
    </div>
  );
};
