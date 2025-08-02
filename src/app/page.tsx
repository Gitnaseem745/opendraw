'use client';
import { DrawingCanvas } from "@/components/Canvas";
import { TextEditor } from "@/components/TextEditor";
import { ToolPanel, StrokeControls, ObjectControls, ExportPanel } from "@/components/Tools";
import { StatusBar } from "@/components/status";
import { useKeyboardShortcuts, useWheelEvents } from "@/hooks";

export default function Home() {
    // Initialize all the custom hooks
    useKeyboardShortcuts();
    useWheelEvents();

    return (
        <div className="w-screen h-screen overflow-hidden relative bg-background">
            <ToolPanel />
            <div className="absolute top-2 left-2 z-10 max-md:hidden">
                <StrokeControls />
            </div>
            <div className="absolute top-2 left-80 z-10 max-md:hidden">
                <ObjectControls />
            </div>
            <StatusBar />
            <TextEditor />
            <DrawingCanvas />
        </div>
    );
}
