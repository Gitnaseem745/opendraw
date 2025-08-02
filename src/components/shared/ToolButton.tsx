/**
 * @fileoverview Reusable tool button component for drawing tools and actions
 * @description Provides consistent styling and behavior for tool selection buttons
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ToolButton 
 *   isActive={true}
 *   onClick={handleClick}
 *   label="Pencil Tool"
 *   disabled={false}
 * >
 *   <Pencil size={20} />
 * </ToolButton>
 * ```
 * 
 * @features
 * - Active state styling
 * - Disabled state support
 * - Accessibility support with labels
 * - Responsive sizing
 * - Smooth transitions
 */

import { ToolButtonProps } from "@/types";
import { Button } from "../ui/button";

/**
 * Reusable tool button component
 * 
 * Provides consistent styling and behavior for tool selection buttons.
 * Features active state indication, disabled state support, and accessibility.
 * 
 * @param {ToolButtonProps} props - Tool button configuration
 * @param {boolean} props.isActive - Whether the tool is currently active
 * @param {() => void} props.onClick - Click handler function
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} props.label - Accessibility label for the button
 * @param {React.ReactNode} props.children - Button content (usually an icon)
 * @returns {JSX.Element} The rendered tool button component
 */
export const ToolButton = ({ 
    isActive, 
    onClick, 
    disabled = false, 
    label,
    children 
}: ToolButtonProps) => (
    <Button
        aria-label={label}
        title={label}
        size="icon"
        variant="outline" 
        className={`
            transition-all duration-200 ease-in-out
            ${isActive 
                ? 'opacity-100 bg-accent text-accent-foreground border-accent shadow-sm' 
                : 'opacity-60 hover:opacity-80 hover:bg-accent/50'
            }
            ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            w-9 h-9 sm:w-10 sm:h-10
            focus:ring-2 focus:ring-ring focus:ring-offset-2
        `} 
        onClick={onClick} 
        disabled={disabled}
    >
        <span className="flex items-center justify-center">
            {children}
        </span>
    </Button>
);
