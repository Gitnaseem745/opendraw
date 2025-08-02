/**
 * @fileoverview Theme toggle component for switching between light, dark, and system themes
 * @description Provides intuitive theme selection with visual indicators and responsive design
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ToggleTheme />
 * ```
 * 
 * @features
 * - Three theme options: light, dark, system
 * - Visual theme indicators with icons
 * - Responsive button sizing
 * - Accessibility support
 */

'use client';

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

/**
 * Theme toggle component for switching application themes
 * 
 * Provides buttons for switching between light, dark, and system themes.
 * Features responsive design and clear visual indicators for the active theme.
 * 
 * @returns {JSX.Element} The rendered theme toggle component
 */
export const ToggleTheme = () => {
    const { theme, setTheme } = useTheme();

    /**
     * Icon mapping for different theme options
     */
    const themeIcons = {
        light: <Sun className="text-foreground" size={16} />,
        dark: <Moon className="text-foreground" size={16} />,
        system: <Monitor className="text-foreground" size={16} />
    };

    /**
     * Available theme options
     */
    const themeOptions = ['light', 'dark', 'system'] as const;

    return (
        <div className="px-3 sm:px-4 py-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">Themes</div>
            <div className="flex gap-1 flex-wrap">
                {themeOptions.map((themeOption) => (
                    <Button
                        key={themeOption}
                        size="icon"
                        variant="outline"
                        onClick={() => setTheme(themeOption)}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                            theme === themeOption 
                                ? 'bg-muted text-muted-foreground border-border' 
                                : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        aria-label={`Switch to ${themeOption} theme`}
                        title={`Switch to ${themeOption} theme`}
                    >
                        {themeIcons[themeOption]}
                    </Button>
                ))}
            </div>
        </div>
    )
}
