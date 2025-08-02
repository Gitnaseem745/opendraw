import { Shape } from "@/types";
import { canvasUtils } from "./canvasUtils";

/**
 * Finds the shape at a given position and returns it with position information
 * @param x - X coordinate to check
 * @param y - Y coordinate to check
 * @param shapes - Array of shapes to check against
 * @returns Shape with position information, or undefined if none found
 */
export const getShapeAtPosition = (
  x: number,
  y: number, 
  shapes: Shape[]
) => {
  // Sort shapes by zIndex in descending order to find topmost shape first
  return shapes
    .slice() // Create copy to avoid mutating original array
    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0)) // Sort by zIndex descending
    .map(shape => ({
      ...shape,
      position: positionWithinshape(x, y, shape)
    }))
    .find(shape => shape.position !== null);
};

/**
 * Determines the position of a point relative to a shape
 * @param x - X coordinate of the point
 * @param y - Y coordinate of the point
 * @param shape - Shape to check against
 * @returns Position string or null if not within shape
 */
const positionWithinshape = (x: number, y: number, shape: Shape) => {
  const { type, x1, x2, y1, y2 } = shape;
  
  switch (type) {
    case "rectangle":
      // Check corners for resizing
      if (canvasUtils.isPointNear(x, y, x1, y1, 5, "topLeft")) return "topLeft";
      if (canvasUtils.isPointNear(x, y, x2, y1, 5, "topRight")) return "topRight";
      if (canvasUtils.isPointNear(x, y, x1, y2, 5, "bottomLeft")) return "bottomLeft";
      if (canvasUtils.isPointNear(x, y, x2, y2, 5, "bottomRight")) return "bottomRight";
      
      // Check if inside rectangle
      return canvasUtils.isPointInRectangle(x, y, x1, y1, x2, y2) ? "inside" : null;
      
    case "circle":
      // Check corners for resizing (bounding box corners)
      if (canvasUtils.isPointNear(x, y, x1, y1, 5, "topLeft")) return "topLeft";
      if (canvasUtils.isPointNear(x, y, x2, y1, 5, "topRight")) return "topRight";
      if (canvasUtils.isPointNear(x, y, x1, y2, 5, "bottomLeft")) return "bottomLeft";
      if (canvasUtils.isPointNear(x, y, x2, y2, 5, "bottomRight")) return "bottomRight";
      
      // Check if inside circle
      return canvasUtils.isPointInCircle(x, y, x1, y1, x2, y2, 5) ? "inside" : null;
      
    case "triangle":
      // Check corners for resizing
      const triangleTopX = (x1 + x2) / 2;
      const triangleTopY = y1;
      if (canvasUtils.isPointNear(x, y, x1, y2, 5, "bottomLeft")) return "bottomLeft";
      if (canvasUtils.isPointNear(x, y, x2, y2, 5, "bottomRight")) return "bottomRight";
      if (canvasUtils.isPointNear(x, y, triangleTopX, triangleTopY, 5, "top")) return "top";
      
      // Check if inside triangle using point-in-triangle algorithm
      const isInsideTriangle = canvasUtils.isPointInTriangle(
        x, y,
        x1, y2,           // Bottom left
        triangleTopX, triangleTopY,  // Top center
        x2, y2            // Bottom right
      );
      return isInsideTriangle ? "inside" : null;
      
    case "diamond":
      // Check corners for resizing
      const diamondCenterX = (x1 + x2) / 2;
      const diamondCenterY = (y1 + y2) / 2;
      if (canvasUtils.isPointNear(x, y, diamondCenterX, y1, 5, "top")) return "top";
      if (canvasUtils.isPointNear(x, y, x2, diamondCenterY, 5, "right")) return "right";
      if (canvasUtils.isPointNear(x, y, diamondCenterX, y2, 5, "bottom")) return "bottom";
      if (canvasUtils.isPointNear(x, y, x1, diamondCenterY, 5, "left")) return "left";
      
      // Check if inside diamond
      const isInsideDiamond = canvasUtils.isPointInDiamond(x, y, x1, y1, x2, y2);
      return isInsideDiamond ? "inside" : null;
      
    case "line":
      // Check endpoints
      if (canvasUtils.isPointNear(x, y, x1, y1, 5, "start")) return "start";
      if (canvasUtils.isPointNear(x, y, x2, y2, 5, "end")) return "end";
      
      // Check if on line
      return canvasUtils.isPointOnLine(x1, y1, x2, y2, x, y) ? "inside" : null;

    case "arrow":
      // Check endpoints (same as line)
      if (canvasUtils.isPointNear(x, y, x1, y1, 5, "start")) return "start";
      if (canvasUtils.isPointNear(x, y, x2, y2, 5, "end")) return "end";
      
      // Check if on line (arrow is essentially a line with an arrowhead)
      return canvasUtils.isPointOnLine(x1, y1, x2, y2, x, y) ? "inside" : null;

    case "text":
      // For text, check if point is within the text bounding box
      // Use the shape's bounds (x1, y1, x2, y2)
      return canvasUtils.isPointInRectangle(x, y, x1, y1, x2, y2) ? "inside" : null;

    case "pencil":
      // Check if near any segment of the drawn path
      return shape.points!.some((point, index) => {
        const nextPoint = shape.points![index + 1];
        if (!nextPoint) return false;
        return canvasUtils.isPointOnLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5);
      }) ? "inside" : null;
      
    default:
      return null;
  }
};
