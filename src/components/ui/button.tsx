import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode; 
}

const buttonVariants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80 active:bg-primary/70 focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 active:bg-destructive/70 focus:ring-2 focus:ring-destructive/50 transition-all duration-200 ease-in-out",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/90 focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70 active:bg-secondary/60 focus:ring-2 focus:ring-secondary/50 transition-all duration-200 ease-in-out",
    ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/90 focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out",
    link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 active:text-primary/70 focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out",
};

const buttonSizes: Record<string, string> = {
  default: "h-10 px-6 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

/**
 * Button component for rendering a button with various styles and sizes.
 * @param {string} variant - The variant of the button (default, destructive, outline, secondary, ghost, link).
 * @param {string} size - The size of the button (default, sm, lg, icon).
 * @param {React.ReactNode} children - The content of the button.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Additional button attributes.
 * @returns {JSX.Element}  The rendered button element.
 * @example
 * <Button variant="destructive" size="default">Delete</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
