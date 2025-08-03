'use client';
import { DrawingCanvas } from "@/components/Canvas";
import { TextEditor } from "@/components/TextEditor";
import { ToolPanel, ShapePropertiesSidebar, MobileToolPanel } from "@/components/Tools";
import { StatusBar } from "@/components/status";
import { useKeyboardShortcuts, useWheelEvents, useMobileOptimization } from "@/hooks";

export default function Home() {
    // Initialize all the custom hooks
    useKeyboardShortcuts();
    useWheelEvents();
    const { isMobileDevice } = useMobileOptimization();

    return (
        <div className={`w-screen h-screen overflow-hidden relative bg-background ${
            isMobileDevice() ? 'touch-none select-none' : ''
        }`}>
            <ToolPanel />
            <MobileToolPanel />
            <ShapePropertiesSidebar />
            <StatusBar />
            <TextEditor />
            <DrawingCanvas />
        </div>
    );
}
