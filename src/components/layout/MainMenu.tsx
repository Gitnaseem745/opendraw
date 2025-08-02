/**
 * @fileoverview Main menu component with application actions
 * @description Provides access to file operations, social links, theme controls, and canvas settings
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <MainMenu />
 * ```
 * 
 * @features
 * - File operations (save, reset)
 * - Social media links
 * - Theme selector
 * - Canvas background color picker
 * - Responsive design with proper z-indexing
 */

'use client';
import { useCanvasStore } from "@/store/canvasStore";
import { Menu, Download, Trash2, Github, Linkedin, Twitter } from "lucide-react"
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown";
import Toast from "../ui/toast";
import { ToggleTheme } from "../theme";
import { ColorPicker } from "../shared";
import { config } from "@/config";
import { canvasUtils } from "@/lib/canvasUtils";
import { useDrawingStore } from "@/store/drawingStore";

/**
 * Interface for menu action items
 */
interface MenuAction {
    icon: React.ReactNode;
    label: string;
    action: () => void;
    shortcut?: string;
}

/**
 * Interface for social media links
 */
interface SocialLink {
    name: string;
    icon: React.ReactNode;
    url: string;
}

/**
 * Main application menu component
 * 
 * Provides a dropdown menu with file operations, social links, theme controls,
 * and canvas configuration options. Features responsive design and proper
 * accessibility support.
 * 
 * @returns {JSX.Element} The rendered main menu component
 */
export const MainMenu = () => {
    const [toastOpen, setToastOpen] = useState<boolean>(false);

    const { canvasRef, saveAsImage } = useCanvasStore();
    const { clearCanvas: clearCanvasStore, } = useDrawingStore();

    /**
     * Clears the canvas after user confirmation
     */
    const clearCanvas = () => {
        const resetDrawing = confirm("Are you sure you want to reset the canvas? This action cannot be undone.");
        if (!resetDrawing) return;
        canvasUtils.resetCanvas(canvasRef, resetDrawing, clearCanvasStore);
        setToastOpen(true);
    };

    /**
     * Opens a URL in a new browser tab
     * @param {string} url - The URL to open
     */
    const openUrl = (url: string) => {
        window.open(url, "_blank");
    };

    const menuActions: MenuAction[] = [
        {
            icon: <Download size={16} />,
            label: "Save as Image...",
            action: () => saveAsImage(canvasRef),
            shortcut: "Ctrl+S"
        },
        {
            icon: <Trash2 size={16} />,
            label: "Reset the canvas",
            action: clearCanvas
        }
    ];

    const socialLinks: SocialLink[] = config.socials.map((social) => ({
        name: social.name,
        icon: social.name === "GitHub" ? <Github size={16} /> :
              social.name === "LinkedIn" ? <Linkedin size={16} /> :
              <Twitter size={16} />,
        url: social.url
    }));

    return (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-8 z-[1000]">
            <DropdownMenu>
                <DropdownMenuTrigger 
                    className="bg-accent rounded-md p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
                    aria-label="Open main menu"
                >
                    <Menu size={20} className="sm:w-6 sm:h-6" />
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                align="start"
                    className="w-56 sm:w-64 bg-background border border-border rounded-md shadow-lg max-h-96 overflow-y-auto"
                >
                    {/* File Operations */}
                    {menuActions.map((action, index) => (
                        <DropdownMenuItem 
                            key={index}
                            onClick={action.action} 
                            className="flex text-foreground items-center gap-3 px-3 sm:px-4 py-2 hover:bg-accent focus:bg-accent transition-colors duration-150"
                        >
                            {action.icon}
                            <span className="text-sm sm:text-base">{action.label}</span>
                            {action.shortcut && (
                                <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">{action.shortcut}</span>
                            )}
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    {/* Social Links Section */}
                    <div className="px-3 sm:px-4 py-2 text-sm font-medium text-muted-foreground">
                        Socials
                    </div>

                    {/* Social Links */}
                    {socialLinks.map((social) => (
                        <DropdownMenuItem 
                            key={social.name}
                            onClick={() => openUrl(social.url)} 
                            className="flex items-center gap-3 px-3 sm:px-4 py-2 hover:bg-accent focus:bg-accent transition-colors duration-150"
                        >
                            {social.icon}
                            <span className="text-sm sm:text-base">{social.name}</span>
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />

                    {/* Theme Controls */}
                    <ToggleTheme />
                    <DropdownMenuSeparator />

                    {/* Canvas Background Settings */}
                    <div className="px-3 sm:px-4 py-2">
                        <div className="text-sm font-medium text-muted-foreground mb-2">Canvas background</div>
                        <ColorPicker />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Success Toast */}
            <Toast
                message="Canvas cleaned successfully!"
                isOpen={toastOpen}
                onClose={() => setToastOpen(false)}
                duration={2000}
                type="success"
            />
        
        </div>
    )
}
