import { Shape } from "@/types";
import { RoughCanvas } from "roughjs/bin/canvas";
import { canvasUtils } from "./canvasUtils";

/**
 * Draws a shape on the canvas using the appropriate rendering method
 * @param roughCanvas - RoughJS canvas instance for sketch-style shapes
 * @param ctx - Canvas 2D rendering context
 * @param shape - Shape object to render
 */
export const drawShape = (
    roughCanvas: RoughCanvas,
    ctx: CanvasRenderingContext2D,
    shape: Shape
) => {
    switch (shape.type) {
        case "line":
        case "rectangle": 
        case "circle":
        case "triangle":
        case "diamond":
            if (shape.roughShape) {
                roughCanvas.draw(shape.roughShape);
            }
            break;
        case "arrow":
            if (shape.roughShape) {
                roughCanvas.draw(shape.roughShape);
                // Draw arrowhead
                canvasUtils.drawArrowHead(ctx, shape.x1, shape.y1, shape.x2, shape.y2, shape.strokeColor, shape.strokeWidth);
            }
            break;
        case "pencil": 
            if (shape.points) {
                // Set stroke color for pencil
                ctx.strokeStyle = shape.strokeColor || "#000000";
                ctx.lineWidth = shape.strokeWidth || 2;
                canvasUtils.renderPencilStroke(ctx, shape.points);
            }
            break;
        case "text": 
            if (shape.text && shape.text.trim() !== "") {
                ctx.save();
                ctx.textBaseline = "top";
                // Use responsive font size like TextEditor
                const fontSize = Math.max(16, 24); // Default responsive size
                ctx.font = `${fontSize}px sans-serif`; // Match TextEditor font family
                ctx.fillStyle = shape.strokeColor || "#000000";
                ctx.fillText(shape.text, shape.x1, shape.y1);
                ctx.restore();
            } else {
                // Show placeholder for empty text during editing
                ctx.save();
                ctx.textBaseline = "top";
                const fontSize = Math.max(16, 24);
                ctx.font = `${fontSize}px sans-serif`;
                ctx.fillStyle = shape.strokeColor ? `${shape.strokeColor}40` : "#00000040"; // Semi-transparent
                ctx.fillText("", shape.x1, shape.y1);
                ctx.restore();
            }
            break;
    }
};
