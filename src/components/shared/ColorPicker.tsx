/**
 * @fileoverview Color picker component for selecting canvas background colors
 * @description Provides a grid-based color selection interface with visual feedback
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ColorPicker />
 * ```
 * 
 * @features
 * - Grid-based color selection
 * - Visual feedback for selected color
 * - Responsive grid layout
 * - Hover effects and transitions
 * - Accessibility support
 */

import { useCanvasStore } from "@/store/canvasStore";

/**
 * Color picker component for canvas background selection
 * 
 * Displays available colors in a responsive grid layout with visual feedback
 * for the currently selected color. Features smooth transitions and hover effects.
 * 
 * @returns {JSX.Element} The rendered color picker component
 */
export const ColorPicker = () => {
    const { currentChecked, setCurrentChecked, colors } = useCanvasStore();
    
    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {colors.map((colorClass, index) => {
                const isSelected = currentChecked === index;
                
                return (
                    <div
                        key={index}
                        className={`
                            w-7 h-7 sm:w-8 sm:h-8 
                            rounded cursor-pointer 
                            border-2 transition-all duration-200 
                            ${colorClass} 
                            ${isSelected
                                ? 'border-foreground scale-110 shadow-lg ring-2 ring-ring/20' 
                                : 'border-border hover:border-muted-foreground hover:scale-105'
                            }
                            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                        `}
                        onClick={() => setCurrentChecked(index)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setCurrentChecked(index);
                            }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select color ${index + 1}`}
                        title={`Select color ${index + 1}`}
                    />
                );
            })}
        </div>
    )
}
