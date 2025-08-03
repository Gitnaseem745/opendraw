'use client';
import { DrawingCanvas } from "@/components/Canvas";
import { TextEditor } from "@/components/TextEditor";
import { ToolPanel, ShapePropertiesSidebar } from "@/components/Tools";
import { StatusBar } from "@/components/status";
import { useKeyboardShortcuts, useWheelEvents } from "@/hooks";

export default function Home() {
    // Initialize all the custom hooks
    useKeyboardShortcuts();
    useWheelEvents();

    return (
        <div className="w-screen h-screen overflow-hidden relative bg-background">
            <ToolPanel />
            <ShapePropertiesSidebar />
            <StatusBar />
            <TextEditor />
            <DrawingCanvas />
        </div>
    );
}
