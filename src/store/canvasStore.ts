import { canvasRef } from '@/types';
import { create } from 'zustand';
import { createRef } from 'react';

interface CanvasStore {
    canvasRef: canvasRef;
    colors: string[];
    currentChecked: number;
    setCurrentChecked: (i: number) => void;
    saveAsImage: (canvasRef: canvasRef) => void;
}

/**
 * Zustand store for managing canvas-specific functionality.
 * Handles canvas reference, color palette, and image export functionality.
 */
export const useCanvasStore = create<CanvasStore>((set) => ({
    canvasRef: createRef<HTMLCanvasElement>() as canvasRef,
    colors: [
        'bg-background',
        'bg-zinc-700', 'bg-zinc-800', 'bg-zinc-900',
        'bg-neutral-700', 'bg-neutral-800', 'bg-neutral-900',
        'bg-stone-700', 'bg-stone-800', 'bg-stone-900'
    ],
    currentChecked: 0,
    setCurrentChecked: (i: number) => set((state) => ({ currentChecked: state.currentChecked === i ? 0 : i })),
    saveAsImage: (canvasRef: canvasRef) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataURL = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = "drawing.png";
        a.click();
    },
}))
