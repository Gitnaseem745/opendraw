import { Shape } from '@/types';
import { canvasUtils } from './canvasUtils';

/**
 * Creates a new shape object with appropriate rough.js elements
 * @param shape - Shape configuration object
 * @param strokeColor - Stroke color for the shape
 * @param fillColor - Fill color for the shape
 * @param strokeWidth - Stroke width for the shape
 * @returns Complete shape object with rough.js elements
 */
export const createShape = ({
    id,
    x1,
    x2,
    y1,
    y2,
    type,
}: Shape, strokeColor = "#000000", fillColor = "transparent", strokeWidth = 2, zIndex = 0) => {
    const generator = canvasUtils.createRoughGenerator();
    
    // Common rough.js options
    const roughOptions = {
        stroke: strokeColor,
        fill: fillColor === "transparent" ? "transparent" : fillColor,
        fillStyle: 'solid',
        // fillWeight: 3,
        strokeWidth: strokeWidth,
        roughness: 1.1,
        bowing: 0.5,
        // strokeLineDash: [5, 10]
    };

    switch (type) {
        case "line":
            return {
                id,
                x1,
                y1,
                x2,
                y2,
                type,
                strokeColor,
                fillColor,
                strokeWidth,
                zIndex,
                roughShape: generator.line(x1, y1, x2, y2, roughOptions)
            };
        case "rectangle":
            return {
                id, x1, y1, x2, y2, type,
                strokeColor,
                fillColor,
                strokeWidth,
                zIndex,
                roughShape: generator.rectangle(x1, y1, x2 - x1, y2 - y1, roughOptions)
            };
        case "circle":
            const { centerX, centerY, radius } = canvasUtils.calculateCircleProperties(x1, y1, x2, y2);
            return {
                id,
                x1,
                y1,
                x2,
                y2,
                type,
                strokeColor,
                fillColor,
                strokeWidth,
                zIndex,
                roughShape: generator.circle(centerX, centerY, radius, roughOptions)
            };
        case "triangle":
            const trianglePoints: [number, number][] = [
                [x1, y2],          // Bottom left
                [(x1 + x2) / 2, y1], // Top center
                [x2, y2]           // Bottom right
            ];
            return {
                id, x1, y1, x2, y2, type,
                strokeColor,
                fillColor,
                strokeWidth,
                zIndex,
                roughShape: generator.polygon(trianglePoints, roughOptions)
            };
        case "diamond":
            const diamondPoints: [number, number][] = [
                [(x1 + x2) / 2, y1], // Top
                [x2, (y1 + y2) / 2], // Right
                [(x1 + x2) / 2, y2], // Bottom
                [x1, (y1 + y2) / 2]  // Left
            ];
            return {
                id, x1, y1, x2, y2, type,
                strokeColor,
                fillColor,
                strokeWidth,
                zIndex,
                roughShape: generator.polygon(diamondPoints, roughOptions)
            };
        case "arrow":
            // For arrow, we'll use a line with arrow head drawn separately
            const arrowLine = generator.line(x1, y1, x2, y2, roughOptions);
            return {
                id, x1, y1, x2, y2, type,
                strokeColor,
                fillColor,
                strokeWidth,
                zIndex,
                roughShape: arrowLine
            };
        case "pencil":
            return {
                id, x1: 0, y1: 0, x2: 0, y2: 0, type,
                strokeColor,
                fillColor: "transparent", // Pencil doesn't use fill
                strokeWidth,
                zIndex,
                points: [{ x: x1, y: y1 }],
                roughShape: null
            };
        case "text":
            return {
                id, x1, y1, x2, y2, type,
                strokeColor,
                fillColor: "transparent", // Text doesn't use fill typically
                strokeWidth,
                zIndex,
                text: "",
            };
        default:
            console.log(`Unknown shape type: ${type}`);
            // Return a default shape to prevent undefined
            return {
                id, x1, y1, x2, y2, type,
                strokeColor,
                fillColor,
                strokeWidth,
                roughShape: generator.line(x1, y1, x2, y2, roughOptions)
            };
    }
};
