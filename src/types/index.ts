import { Drawable } from "roughjs/bin/core";

export const Tools = {
    pencil: "pencil",
    hand: "hand",
    eraser: "eraser",
    selection: "selection",
    text: "text",
    rectangle: "rectangle",
    triangle: "triangle",
    line: "line",
    arrow: "arrow",
    circle: "circle",
    diamond: "diamond",
    pan: "pan",
    lock: "lock",
    undo: "undo",
    redo: "redo",
};

export type Tools = (typeof Tools)[keyof typeof Tools];

export type Shape = {
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    type: Tools;
    offsetX?: number;
    offsetY?: number;
    roughShape?: Drawable | null;
    points?: { x: number; y: number }[];
    text?: string;
    position?: string | null;
    strokeColor?: string;
    fillColor?: string;
    strokeWidth?: number;
    // Grouping properties
    groupId?: string | null;
    isGrouped?: boolean;
    // Layer management
    zIndex?: number;
};

export type Actions = "drawing" | "selecting" | "moving" | "panning" | "writing" | "resizing" | "zooming" | "erasing" | "grouping" | "none";

export type Group = {
    id: string;
    shapeIds: number[];
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    created: number;
};

export type SelectedElementType = Shape & {
  offsetX?: number;
  offsetY?: number;
  xOffsets?: number[];
  yOffsets?: number[];
};

export type ExtendedElementType = SelectedElementType;

export type canvasRef = React.RefObject<HTMLCanvasElement>;

export interface StatusBarProps {
    drawMode: Tools;
    lock: boolean;
    stroke: number;
    scale: number;
}

export interface ToolButtonProps { 
    isActive: boolean; 
    onClick: () => void; 
    disabled?: boolean; 
    label?: string;
    children: React.ReactNode; 
}

export interface TextObject {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  timestamp: number;
}

export interface TextInputState {
  isOpen: boolean;
  position: { x: number; y: number };
  onSubmit: (text: string, fontSize: number, fontFamily: string) => void;
}
