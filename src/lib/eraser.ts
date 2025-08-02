import { Shape, Tools } from "@/types";

/**
 * Gets the topmost shape to erase at the given position
 * Only returns the shape with the highest zIndex to prevent multiple deletions
 */
export const getShapesToErase = (
  x: number,
  y: number,
  shapes: Shape[],
  eraserSize: number = 20
): number[] => {
  // Find all shapes that intersect with the eraser
  const intersectingShapes = shapes.filter(shape => 
    shouldEraseShape(x, y, shape, eraserSize)
  );
  
  // If no shapes intersect, return empty array
  if (intersectingShapes.length === 0) {
    return [];
  }
  
  // Find the shape with the highest zIndex (topmost shape)
  const topmostShape = intersectingShapes.reduce((topShape, currentShape) => {
    const topZIndex = topShape.zIndex || 0;
    const currentZIndex = currentShape.zIndex || 0;
    return currentZIndex > topZIndex ? currentShape : topShape;
  });
  
  // Return only the topmost shape's ID
  return [topmostShape.id];
};

/**
 * Checks if an eraser cursor intersects with a shape
 */
export const shouldEraseShape = (
  x: number,
  y: number,
  shape: Shape,
  eraserSize: number = 20
): boolean => {
  const { type, x1, x2, y1, y2 } = shape;
  
  switch (type) {
    case Tools.rectangle:
      return isPointInRectangle(x, y, x1, y1, x2, y2, eraserSize);
      
    case Tools.circle:
      return isPointInCircle(x, y, x1, y1, x2, y2, eraserSize);
      
    case Tools.line:
    case Tools.arrow:
      return isPointNearLine(x, y, x1, y1, x2, y2, eraserSize);
      
    case Tools.triangle:
      return isPointInTriangle(x, y, x1, y1, x2, y2, eraserSize);
      
    case Tools.diamond:
      return isPointInDiamond(x, y, x1, y1, x2, y2, eraserSize);
      
    case Tools.pencil:
      return isPointNearPencilPath(x, y, shape.points || [], eraserSize);
      
    case Tools.text:
      return isPointInTextBounds(x, y, x1, y1, x2, y2, eraserSize);
      
    default:
      return false;
  }
};

const isPointInRectangle = (
  px: number, py: number,
  x1: number, y1: number, x2: number, y2: number,
  tolerance: number
): boolean => {
  const minX = Math.min(x1, x2) - tolerance;
  const maxX = Math.max(x1, x2) + tolerance;
  const minY = Math.min(y1, y2) - tolerance;
  const maxY = Math.max(y1, y2) + tolerance;
  
  return px >= minX && px <= maxX && py >= minY && py <= maxY;
};

const isPointInCircle = (
  px: number, py: number,
  x1: number, y1: number, x2: number, y2: number,
  tolerance: number
): boolean => {
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radiusX = Math.abs(x2 - x1) / 2;
  const radiusY = Math.abs(y2 - y1) / 2;
  
  const dx = px - centerX;
  const dy = py - centerY;
  const distance = (dx * dx) / ((radiusX + tolerance) * (radiusX + tolerance)) +
                   (dy * dy) / ((radiusY + tolerance) * (radiusY + tolerance));
  
  return distance <= 1;
};

const isPointNearLine = (
  px: number, py: number,
  x1: number, y1: number, x2: number, y2: number,
  tolerance: number
): boolean => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    return Math.sqrt(A * A + B * B) <= tolerance;
  }

  const param = dot / lenSq;
  
  let xx, yy;
  
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  
  return Math.sqrt(dx * dx + dy * dy) <= tolerance;
};

const isPointInTriangle = (
  px: number, py: number,
  x1: number, y1: number, x2: number, y2: number,
  tolerance: number
): boolean => {
  const triangleTopX = (x1 + x2) / 2;
  const triangleTopY = y1;
  
  return isPointNearLine(px, py, x1, y2, triangleTopX, triangleTopY, tolerance) ||
         isPointNearLine(px, py, triangleTopX, triangleTopY, x2, y2, tolerance) ||
         isPointNearLine(px, py, x2, y2, x1, y2, tolerance) ||
         isPointInTriangleArea(px, py, x1, y2, triangleTopX, triangleTopY, x2, y2);
};

const isPointInDiamond = (
  px: number, py: number,
  x1: number, y1: number, x2: number, y2: number,
  tolerance: number
): boolean => {
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const halfWidth = Math.abs(x2 - x1) / 2;
  const halfHeight = Math.abs(y2 - y1) / 2;
  
  const dx = Math.abs(px - centerX);
  const dy = Math.abs(py - centerY);
  
  const toleranceRatio = tolerance / Math.min(halfWidth, halfHeight);
  return (dx / (halfWidth + tolerance) + dy / (halfHeight + tolerance)) <= (1 + toleranceRatio);
};

const isPointNearPencilPath = (
  px: number, py: number,
  points: { x: number; y: number }[],
  tolerance: number
): boolean => {
  if (points.length < 2) return false;
  
  for (let i = 0; i < points.length - 1; i++) {
    const point1 = points[i];
    const point2 = points[i + 1];
    
    if (isPointNearLine(px, py, point1.x, point1.y, point2.x, point2.y, tolerance)) {
      return true;
    }
  }
  
  return false;
};

const isPointInTextBounds = (
  px: number, py: number,
  x1: number, y1: number, x2: number, y2: number,
  tolerance: number
): boolean => {
  return isPointInRectangle(px, py, x1, y1, x2, y2, tolerance);
};

const isPointInTriangleArea = (
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number
): boolean => {
  const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  if (Math.abs(denominator) < 1e-10) return false;
  
  const a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denominator;
  const b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denominator;
  const c = 1 - a - b;
  
  return a >= 0 && b >= 0 && c >= 0;
};
