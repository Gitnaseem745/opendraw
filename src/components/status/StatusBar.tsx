/**
 * displaying drawing state information
 * @description Shows current tool, canvas metrics, zoom level, and other drawing state information
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <StatusBar />
 * ```
 * 
 * @features
 * - Current tool display
 * - Canvas dimensions and zoom level
 * - Shape count and stroke width
 * - Lock status indicator
 * - Responsive design (hidden on mobile)
 * - Real-time state updates
 */

'use client';
import { useCanvasStore } from "@/store/canvasStore";
import { useDrawingStore } from "@/store/drawingStore";
import { Tools } from "@/types";

/**
 * Application status bar component
 * 
 * Displays comprehensive information about the current drawing state including
 * active tool, canvas metrics, zoom level, and other relevant status information.
 * Hidden on mobile devices to preserve screen space.
 * 
 * @returns {JSX.Element} The rendered status bar component
 */
export const StatusBar = () => {
    const { canvasRef } = useCanvasStore();
    const { tool, scale, shapes, strokeWidth, strokeColor, fillColor } = useDrawingStore();

    /**
     * Formats the tool name for display
     * @param {string} toolName - The tool name to format
     * @returns {string} The formatted tool name
     */
    const formatToolName = (toolName: string): string => {
        return toolName.charAt(0).toUpperCase() + toolName.slice(1);
    };

    /**
     * Gets the canvas lock status
     * @returns {string} Lock status text
     */
    const getLockStatus = (): string => {
        return tool === Tools.lock ? 'Canvas: Locked' : 'Canvas: Unlocked';
    };

    /**
     * Gets the canvas dimensions
     * @returns {string} Canvas dimensions or 'N/A' if unavailable
     */
    const getCanvasDimensions = (): string => {
        if (!canvasRef.current) return 'Canvas Size: N/A';
        return `Canvas Size: ${canvasRef.current.width}x${canvasRef.current.height}`;
    };

    return (
        <div className="max-md:hidden fixed bottom-2 right-4 z-10 w-fit">
            <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
                <div className="flex gap-4 items-center justify-center text-sm text-foreground flex-wrap">
                    {/* Current Tool */}
                    <span className="font-medium">
                        Mode: <span className="text-primary">{formatToolName(tool)}</span>
                    </span>
                    
                    {/* Shape Count */}
                    <span>
                        Shapes: <span className="text-muted-foreground">{shapes.length}</span>
                    </span>
                    
                    {/* Stroke Width and Color */}
                    <span className="flex items-center gap-2">
                        Stroke: <span className="text-muted-foreground">{strokeWidth}px</span>
                        <div 
                            className="w-3 h-3 rounded border border-border" 
                            style={{ backgroundColor: strokeColor }}
                            title={`Stroke color: ${strokeColor}`}
                        />
                    </span>
                    
                    {/* Fill Color */}
                    <span className="flex items-center gap-2">
                        Fill: 
                        {fillColor === 'transparent' ? (
                            <span className="text-muted-foreground">None</span>
                        ) : (
                            <>
                                <span className="text-muted-foreground">Yes</span>
                                <div 
                                    className="w-3 h-3 rounded border border-border" 
                                    style={{ backgroundColor: fillColor }}
                                    title={`Fill color: ${fillColor}`}
                                />
                            </>
                        )}
                    </span>
                    
                    {/* Lock Status */}
                    <span className={tool === Tools.lock ? 'text-orange-500' : 'text-muted-foreground'}>
                        {getLockStatus()}
                    </span>
                    
                    {/* Canvas Dimensions */}
                    <span className="text-muted-foreground">
                        {getCanvasDimensions()}
                    </span>
                    
                    {/* Zoom Level */}
                    <span>
                        Zoom: <span className="text-accent-foreground">{Math.round(scale * 100)}%</span>
                    </span>
                </div>
            </div>
        </div>
    )
}
