/**
 * @fileoverview Reusable input component with variants and error states
 * @description Provides a flexible input component with multiple sizes and error handling
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <Input
 *   placeholder="Enter value"
 *   variant="md"
 *   error={false}
 *   type="text"
 * />
 * ```
 * 
 * @features
 * - Multiple size variants (sm, md, lg)
 * - Error state styling
 * - Responsive design
 * - Accessibility support
 * - Theme integration
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props interface for Input component
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
    error?: boolean;
    variant?: "sm" | "md" | "lg"; 
    type?: string;
    className?: string;
}

/**
 * Input component for user input with multiple variants and states
 * 
 * @param {InputProps} props - Input component props
 * @param {string} [props.placeholder="Enter text here..."] - Placeholder text
 * @param {boolean} [props.error=false] - Error state indicator
 * @param {"sm" | "md" | "lg"} [props.variant="md"] - Size variant
 * @param {string} [props.type] - Input type
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.disabled] - Disabled state
 * @returns {JSX.Element} Rendered input component
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, placeholder = "Enter text here...", error, variant = "md", type, disabled, ...props }, ref) => {
        const variantClasses = {
            sm: "p-2 text-sm w-full max-w-32 sm:max-w-40 h-8",
            md: "p-2 text-base w-full max-w-40 sm:max-w-52 h-10",
            lg: "p-3 text-lg w-full max-w-48 sm:max-w-64 h-12",
        };

        return (
            <input
                ref={ref}
                type={type}
                aria-label={placeholder}
                aria-invalid={error}
                disabled={disabled}
                className={cn(
                    "border rounded-md focus:outline-none focus:ring-2 bg-background text-foreground",
                    "transition-all duration-200 ease-in-out",
                    error 
                        ? "border-destructive focus:ring-destructive/50 text-destructive" 
                        : "border-border focus:ring-ring hover:border-muted-foreground",
                    disabled && "opacity-50 cursor-not-allowed bg-muted",
                    variantClasses[variant],
                    className
                )}
                placeholder={placeholder}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };
export default Input;
