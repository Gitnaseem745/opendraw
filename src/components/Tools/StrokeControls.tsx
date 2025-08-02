/**
 * @fileoverview Stroke and fill controls component for drawing customization
 * @description Provides stroke color, fill color, and stroke width controls
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <StrokeControls />
 * ```
 * 
 * @features
 * - Stroke color picker
 * - Fill color picker with transparency option
 * - Stroke width slider
 * - Color presets
 * - Visual feedback
 */

import { useDrawingStore } from '@/store/drawingStore';
import { Minus, Plus } from 'lucide-react';

/**
 * Stroke and fill controls component
 * 
 * Provides comprehensive controls for customizing stroke color, fill color,
 * and stroke width with an intuitive interface.
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
   * Predefined color palette
   */
  const colorPalette = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff',
    '#ff0080', '#80ff00', '#0080ff', '#808080', '#c0c0c0'
  ];

  /**
   * Handles stroke width adjustment
   * @param {number} delta - Amount to change stroke width by
   */
  const adjustStrokeWidth = (delta: number) => {
    setStrokeWidth(strokeWidth + delta);
  };

  return (
    <div className="absolute top-20 left-0 flex flex-col gap-3 p-3 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg">
      {/* Stroke Color */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground">Stroke</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="w-8 h-8 rounded border border-border cursor-pointer"
            title="Stroke Color"
          />
          <div className="flex flex-wrap gap-1">
            {colorPalette.slice(0, 8).map((color) => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-4 h-4 rounded border cursor-pointer hover:scale-110 transition-transform ${
                  strokeColor === color ? 'ring-2 ring-ring ring-offset-1' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                title={`Set stroke to ${color}`}
                aria-label={`Set stroke color to ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fill Color */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground">Fill</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="color"
              value={fillColor === 'transparent' ? '#ffffff' : fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              disabled={fillColor === 'transparent'}
              className="w-8 h-8 rounded border border-border cursor-pointer disabled:opacity-50"
              title="Fill Color"
            />
            {fillColor === 'transparent' && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-red-500 font-bold pointer-events-none">
                ✕
              </div>
            )}
          </div>
          <button
            onClick={() => setFillColor('transparent')}
            className={`w-8 h-8 rounded border cursor-pointer flex items-center justify-center text-xs font-bold transition-all ${
              fillColor === 'transparent' 
                ? 'bg-muted border-ring ring-2 ring-ring ring-offset-1' 
                : 'border-border hover:bg-muted'
            }`}
            title="No Fill"
            aria-label="Set no fill"
          >
            ✕
          </button>
          <div className="flex flex-wrap gap-1">
            {colorPalette.slice(0, 6).map((color) => (
              <button
                key={color}
                onClick={() => setFillColor(color)}
                className={`w-4 h-4 rounded border cursor-pointer hover:scale-110 transition-transform ${
                  fillColor === color ? 'ring-2 ring-ring ring-offset-1' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                title={`Set fill to ${color}`}
                aria-label={`Set fill color to ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stroke Width */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-muted-foreground">Width</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustStrokeWidth(-1)}
            disabled={strokeWidth <= 1}
            className="w-6 h-6 rounded border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Decrease stroke width"
            aria-label="Decrease stroke width"
          >
            <Minus size={12} />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              title={`Stroke width: ${strokeWidth}px`}
            />
            <span className="text-xs font-mono min-w-[2rem] text-center">
              {strokeWidth}px
            </span>
          </div>
          <button
            onClick={() => adjustStrokeWidth(1)}
            disabled={strokeWidth >= 20}
            className="w-6 h-6 rounded border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Increase stroke width"
            aria-label="Increase stroke width"
          >
            <Plus size={12} />
          </button>
        </div>
        {/* Stroke Width Preview */}
        <div className="flex justify-center">
          <div 
            className="rounded-full bg-foreground"
            style={{ 
              width: `${Math.max(strokeWidth, 2)}px`, 
              height: `${Math.max(strokeWidth, 2)}px` 
            }}
            title={`Stroke width preview: ${strokeWidth}px`}
          />
        </div>
      </div>
    </div>
  );
};
