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
            ctx.textBaseline = "top";
            ctx.font = "20px Arial";
            ctx.fillStyle = shape.strokeColor || "#000000";
            ctx.fillText(shape.text || "", shape.x1, shape.y1);
            break;
    }
};
