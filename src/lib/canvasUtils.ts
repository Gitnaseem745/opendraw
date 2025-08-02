import { Shape, Tools } from "@/types";
import rough from "roughjs";
import getStroke from "perfect-freehand";

// ===== COORDINATE TRANSFORMATION UTILITIES =====

/**
 * Transforms mouse coordinates from screen space to canvas space, accounting for pan and zoom
 * @param event - Mouse event containing clientX and clientY
 * @param panOffset - Current pan offset of the canvas
 * @param scale - Current zoom scale of the canvas
 * @param scaleOffset - Offset for centered scaling
 * @returns Transformed coordinates in canvas space
 */
export const getMouseCoordinates = (
  event: { clientX: number; clientY: number },
  panOffset: { x: number; y: number },
  scale: number,
  scaleOffset: { x: number; y: number }
) => {
  const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
  const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
  return { clientX, clientY };
};

/**
 * Calculates the scale offset for centered zooming
 * @param canvasWidth - Width of the canvas
 * @param canvasHeight - Height of the canvas
 * @param scale - Current zoom scale
 * @returns Scale offset for centered zooming
 */
export const calculateScaleOffset = (
  canvasWidth: number,
  canvasHeight: number,
  scale: number
) => {
  const scaledWidth = canvasWidth * scale;
  const scaledHeight = canvasHeight * scale;
  const scaleOffsetX = (scaledWidth - canvasWidth) / 2;
  const scaleOffsetY = (scaledHeight - canvasHeight) / 2;
  return { x: scaleOffsetX, y: scaleOffsetY };
};

// ===== CANVAS SETUP AND MANAGEMENT =====

/**
 * Sets up the canvas context and applies transformations for rendering
 * @param canvas - HTML Canvas element
 * @param panOffset - Current pan offset
 * @param scale - Current zoom scale
 * @param scaleOffset - Scale offset for centered zooming
 * @returns Canvas 2D context and RoughJS canvas, or null if setup fails
 */
export const setupCanvasContext = (
  canvas: HTMLCanvasElement,
  panOffset: { x: number; y: number },
  scale: number,
  scaleOffset: { x: number; y: number }
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const roughCanvas = rough.canvas(canvas);

  // Set canvas size to window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Save context state and apply transformations
  ctx.save();
  ctx.translate(
    panOffset.x * scale - scaleOffset.x,
    panOffset.y * scale - scaleOffset.y
  );
  ctx.scale(scale, scale);

  return { ctx, roughCanvas };
};

/**
 * Clears the canvas and resets the drawing context
 * @param canvas - HTML Canvas element
 */
export const clearCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Resets canvas to initial state and optionally clears all drawings
 * @param canvasRef - React ref to canvas element
 * @param resetDrawing - Whether to clear all drawn shapes
 * @param clearCanvasStore - Function to clear canvas store (shapes and history)
 */
export const resetCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  resetDrawing: boolean = false,
  clearCanvasStore?: () => void
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  if (resetDrawing) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (clearCanvasStore) {
      clearCanvasStore(); // Clear shapes and reset history
    }
  }
};

// ===== SHAPE COORDINATE UTILITIES =====

/**
 * Adjusts shape coordinates to ensure proper orientation (e.g., top-left to bottom-right)
 * @param shape - Shape object with coordinates
 * @returns Adjusted coordinates
 */
export const adjustShapeCoordinates = (shape: Shape) => {
  const { type, x1, y1, x2, y2 } = shape;

  if (type === Tools.rectangle) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

/**
 * Determines if a shape type requires coordinate adjustment
 * @param type - Shape tool type
 * @returns Whether adjustment is required
 */
export const requiresCoordinateAdjustment = (type: Tools): boolean => {
  return [Tools.rectangle, Tools.line].includes(type);
};

/**
 * Calculates new coordinates when resizing a shape
 * @param clientX - Mouse X coordinate
 * @param clientY - Mouse Y coordinate
 * @param position - Resize handle position
 * @param coordinates - Current shape coordinates
 * @returns New coordinates after resize
 */
export const calculateResizedCoordinates = (
  clientX: number,
  clientY: number,
  position: string,
  coordinates: { x1: number; y1: number; x2: number; y2: number }
) => {
  const { x1, y1, x2, y2 } = coordinates;

  switch (position) {
    case "start":
    case "topLeft":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "topRight":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bottomLeft":
      return { x1: clientX, y1, x2, y2: clientY };
    case "end":
    case "bottomRight":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return coordinates;
  }
};

// ===== DISTANCE AND PROXIMITY UTILITIES =====

/**
 * Calculates the Euclidean distance between two points
 * @param a - First point with x, y coordinates
 * @param b - Second point with x, y coordinates
 * @returns Distance between the points
 */
export const calculateDistance = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): number => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

/**
 * Checks if a point is near another point within a specified tolerance
 * @param x - X coordinate of the point to check
 * @param y - Y coordinate of the point to check
 * @param targetX - X coordinate of the target point
 * @param targetY - Y coordinate of the target point
 * @param tolerance - Maximum distance for "near" detection
 * @param name - Optional name to return if near
 * @returns Name if near, null otherwise
 */
export const isPointNear = (
  x: number,
  y: number,
  targetX: number,
  targetY: number,
  tolerance: number = 5,
  name?: string
): string | null => {
  return Math.abs(x - targetX) < tolerance && Math.abs(y - targetY) < tolerance
    ? name || "near"
    : null;
};

/**
 * Checks if a point lies on a line segment within a tolerance
 * @param x1 - X coordinate of line start
 * @param y1 - Y coordinate of line start
 * @param x2 - X coordinate of line end
 * @param y2 - Y coordinate of line end
 * @param px - X coordinate of point to check
 * @param py - Y coordinate of point to check
 * @param tolerance - Maximum distance from line
 * @returns Whether the point is on the line
 */
export const isPointOnLine = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  px: number,
  py: number,
  tolerance: number = 1
): boolean => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x: px, y: py };
  const offset = calculateDistance(a, b) - (calculateDistance(a, c) + calculateDistance(b, c));
  return Math.abs(offset) < tolerance;
};

// ===== SHAPE INTERSECTION UTILITIES =====

/**
 * Checks if a point is within a rectangle bounds
 * @param px - Point X coordinate
 * @param py - Point Y coordinate
 * @param x1 - Rectangle X1 coordinate
 * @param y1 - Rectangle Y1 coordinate
 * @param x2 - Rectangle X2 coordinate
 * @param y2 - Rectangle Y2 coordinate
 * @param tolerance - Additional tolerance for bounds checking
 * @returns Whether point is within rectangle bounds
 */
export const isPointInRectangle = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tolerance: number = 0
): boolean => {
  const minX = Math.min(x1, x2) - tolerance;
  const maxX = Math.max(x1, x2) + tolerance;
  const minY = Math.min(y1, y2) - tolerance;
  const maxY = Math.max(y1, y2) + tolerance;

  return px >= minX && px <= maxX && py >= minY && py <= maxY;
};

/**
 * Checks if a point is within a circle/ellipse bounds
 * @param px - Point X coordinate
 * @param py - Point Y coordinate
 * @param x1 - Circle bounding box X1
 * @param y1 - Circle bounding box Y1
 * @param x2 - Circle bounding box X2
 * @param y2 - Circle bounding box Y2
 * @param tolerance - Additional tolerance for bounds checking
 * @returns Whether point is within circle bounds
 */
export const isPointInCircle = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tolerance: number = 0
): boolean => {
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radiusX = Math.abs(x2 - x1) / 2;
  const radiusY = Math.abs(y2 - y1) / 2;

  const dx = px - centerX;
  const dy = py - centerY;
  const ellipseCheck =
    (dx * dx) / ((radiusX + tolerance) * (radiusX + tolerance)) +
    (dy * dy) / ((radiusY + tolerance) * (radiusY + tolerance));

  return ellipseCheck <= 1;
};

/**
 * Checks if a point is near a line segment within tolerance
 * @param px - Point X coordinate
 * @param py - Point Y coordinate
 * @param x1 - Line start X coordinate
 * @param y1 - Line start Y coordinate
 * @param x2 - Line end X coordinate
 * @param y2 - Line end Y coordinate
 * @param tolerance - Maximum distance from line
 * @returns Whether point is near the line
 */
export const isPointNearLine = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tolerance: number
): boolean => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  if (lenSq === 0) {
    // Line is actually a point
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

// ===== CURSOR UTILITIES =====

/**
 * Returns the appropriate cursor style for a given interaction position
 * @param position - The position/handle being interacted with
 * @returns CSS cursor style string
 */
export const getCursorForPosition = (position: string): string => {
  switch (position) {
    case "topLeft":
    case "bottomRight":
      return "nwse-resize";
    case "topRight":
    case "bottomLeft":
      return "nesw-resize";
    case "start":
    case "end":
      return "move";
    case "inside":
      return "move";
    default:
      return "default";
  }
};

// ===== CANVAS DRAWING UTILITIES =====

/**
 * Generates an SVG path string from stroke points for pencil drawings
 * @param stroke - Array of stroke points
 * @returns SVG path string
 */
export const getSvgPathFromStroke = (stroke: number[][]): string => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0.toString(), y0.toString(), ((x0 + x1) / 2).toString(), ((y0 + y1) / 2).toString());
      return acc;
    },
    ["M", ...stroke[0].map((num) => num.toString()), "Q"]
  );

  d.push("Z");
  return d.join(" ");
};

/**
 * Renders a pencil stroke on the canvas using perfect-freehand
 * @param ctx - Canvas 2D context
 * @param points - Array of points that make up the stroke
 */
export const renderPencilStroke = (
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[]
) => {
  const strokePoints = getStroke(points);
  const pathData = getSvgPathFromStroke(strokePoints);
  const path = new Path2D(pathData);
  ctx.fill(path);
};

/**
 * Applies standard canvas context settings for drawing
 * @param ctx - Canvas 2D context
 * @param color - Stroke/fill color
 * @param lineWidth - Line width for strokes
 */
export const applyCanvasStyles = (
  ctx: CanvasRenderingContext2D,
  color: string = "#000000",
  lineWidth: number = 2
) => {
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
};

/**
 * Gets the current stroke color from CSS custom properties
 * @returns Current stroke color as string
 */
export const getCurrentStrokeColor = (): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--foreground")
    .trim();
};

// ===== SHAPE CREATION UTILITIES =====

/**
 * Creates a rough.js generator for creating sketch-style shapes
 * @returns RoughJS generator instance
 */
export const createRoughGenerator = () => {
  return rough.generator();
};

/**
 * Calculates circle properties from bounding box coordinates
 * @param x1 - Bounding box X1
 * @param y1 - Bounding box Y1
 * @param x2 - Bounding box X2
 * @param y2 - Bounding box Y2
 * @returns Circle center coordinates and radius
 */
export const calculateCircleProperties = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2;
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  return { centerX, centerY, radius };
};

/**
 * Measures text dimensions using canvas context
 * @param ctx - Canvas 2D context
 * @param text - Text to measure
 * @param fontSize - Font size in pixels
 * @param fontFamily - Font family name
 * @returns Text width and height
 */
export const measureText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number = 20,
  fontFamily: string = "Arial"
) => {
  ctx.font = `${fontSize}px ${fontFamily}`;
  const width = ctx.measureText(text).width;
  const height = fontSize; // Approximate height
  return { width, height };
};

// ===== UTILITY ID GENERATION =====

/**
 * Generates a unique ID for shapes
 * @returns Unique shape ID string
 */
export const generateShapeId = (): string => {
  return `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Draws an arrowhead at the end of a line
 * @param ctx - Canvas 2D context
 * @param x1 - Start x coordinate
 * @param y1 - Start y coordinate
 * @param x2 - End x coordinate (where arrowhead should be)
 * @param y2 - End y coordinate (where arrowhead should be)
 * @param strokeColor - Color of the arrowhead
 * @param strokeWidth - Width of the arrowhead stroke
 */
export const drawArrowHead = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  strokeColor: string = "#000000",
  strokeWidth: number = 2
) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = Math.max(10, strokeWidth * 3);
  
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.fillStyle = strokeColor;
  
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle - Math.PI / 6),
    y2 - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLength * Math.cos(angle + Math.PI / 6),
    y2 - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
  ctx.restore();
};

// ===== EXPORT FOR EXTERNAL USE =====

/**
 * Checks if a point is inside a triangle using barycentric coordinates
 * @param px - Point X coordinate
 * @param py - Point Y coordinate
 * @param x1 - Triangle vertex 1 X
 * @param y1 - Triangle vertex 1 Y
 * @param x2 - Triangle vertex 2 X
 * @param y2 - Triangle vertex 2 Y
 * @param x3 - Triangle vertex 3 X
 * @param y3 - Triangle vertex 3 Y
 * @returns Whether point is inside triangle
 */
export const isPointInTriangle = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number
): boolean => {
  const denominator = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  if (Math.abs(denominator) < 1e-10) return false; // Degenerate triangle
  
  const a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denominator;
  const b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denominator;
  const c = 1 - a - b;
  
  return a >= 0 && b >= 0 && c >= 0;
};

/**
 * Checks if a point is inside a diamond shape
 * @param px - Point X coordinate
 * @param py - Point Y coordinate
 * @param x1 - Diamond bounding box left
 * @param y1 - Diamond bounding box top
 * @param x2 - Diamond bounding box right
 * @param y2 - Diamond bounding box bottom
 * @returns Whether point is inside diamond
 */
export const isPointInDiamond = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): boolean => {
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const halfWidth = Math.abs(x2 - x1) / 2;
  const halfHeight = Math.abs(y2 - y1) / 2;
  
  // Normalize the point relative to center
  const dx = Math.abs(px - centerX);
  const dy = Math.abs(py - centerY);
  
  // Diamond equation: |x|/a + |y|/b <= 1
  return (dx / halfWidth + dy / halfHeight) <= 1;
};

// Export object with all utilities
export const canvasUtils = {
  // Coordinate transformation
  getMouseCoordinates,
  calculateScaleOffset,
  
  // Canvas management
  setupCanvasContext,
  clearCanvas,
  resetCanvas,
  
  // Shape coordinates
  adjustShapeCoordinates,
  requiresCoordinateAdjustment,
  calculateResizedCoordinates,
  
  // Distance and proximity
  calculateDistance,
  isPointNear,
  isPointOnLine,
  
  // Shape intersection
  isPointInRectangle,
  isPointInCircle,
  isPointInTriangle,
  isPointInDiamond,
  isPointNearLine,
  
  // Cursor utilities
  getCursorForPosition,
  
  // Canvas drawing
  getSvgPathFromStroke,
  renderPencilStroke,
  applyCanvasStyles,
  getCurrentStrokeColor,
  drawArrowHead,
  
  // Shape creation
  createRoughGenerator,
  calculateCircleProperties,
  measureText,
  
  // Utilities
  generateShapeId,
};

export default canvasUtils;
