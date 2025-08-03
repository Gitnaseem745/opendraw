'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

interface ShortcutCategory {
  title: string;
  shortcuts: Array<{
    key: string;
    action: string;
    description: string;
  }>;
}

const shortcutCategories: ShortcutCategory[] = [
  {
    title: 'Drawing Tools',
    shortcuts: [
      { key: 'V', action: 'Selection', description: 'Select and manipulate shapes' },
      { key: 'P', action: 'Pencil', description: 'Draw freehand lines' },
      { key: 'L', action: 'Line', description: 'Draw straight lines' },
      { key: 'R', action: 'Rectangle', description: 'Draw rectangles' },
      { key: 'U', action: 'Triangle', description: 'Draw triangles' },
      { key: 'C', action: 'Circle', description: 'Draw circles' },
      { key: 'D', action: 'Diamond', description: 'Draw diamond shapes' },
      { key: 'A', action: 'Arrow', description: 'Draw arrows' },
      { key: 'T', action: 'Text', description: 'Add text annotations' },
      { key: 'H', action: 'Pan', description: 'Pan around the canvas' },
      { key: 'E', action: 'Eraser', description: 'Erase parts of drawings' },
      { key: 'K', action: 'Lock', description: 'Lock Canvas' },
    ],
  },
  {
    title: 'View Controls',
    shortcuts: [
      { key: 'Ctrl+0', action: 'Reset View', description: 'Reset zoom and pan to fit canvas' },
      { key: '0', action: 'Reset View', description: 'Alternative shortcut for reset view' },
      { key: 'G', action: 'Toggle Grid', description: 'Show/hide the grid overlay' },
      { key: 'Ctrl+;', action: 'Toggle Rulers', description: 'Show/hide rulers' },
      { key: '+/=', action: 'Zoom In', description: 'Increase canvas zoom level' },
      { key: '-', action: 'Zoom Out', description: 'Decrease canvas zoom level' },
      { key: 'Space', action: 'Pan Mode', description: 'Temporarily switch to pan mode' },
    ],
  },
  {
    title: 'Edit Operations',
    shortcuts: [
      { key: 'Ctrl+Z', action: 'Undo', description: 'Undo the last action' },
      { key: 'Ctrl+Y', action: 'Redo', description: 'Redo the last undone action' },
      { key: 'Ctrl+Shift+Z', action: 'Redo', description: 'Alternative redo shortcut' },
    //   { key: 'Ctrl+A', action: 'Select All', description: 'Select all shapes on canvas' },
      { key: 'Delete', action: 'Delete', description: 'Delete selected shapes' },
      { key: 'Backspace', action: 'Delete', description: 'Alternative delete shortcut' },
      { key: 'Alt + Click', action: 'Duplicate', description: 'Duplicate selected shapes' },
      { key: 'Escape', action: 'Deselect', description: 'Clear current selection' },
    ],
  },
  {
    title: 'Grouping',
    shortcuts: [
      { key: 'Ctrl+G', action: 'Group', description: 'Group selected shapes together' },
      { key: 'Ctrl+Shift+G', action: 'Ungroup', description: 'Ungroup selected grouped shapes' },
    ],
  },
  {
    title: 'Layer Management',
    shortcuts: [
      { key: 'Ctrl+]', action: 'Bring Forward', description: 'Move selected shape one layer forward' },
      { key: 'Ctrl+[', action: 'Send Backward', description: 'Move selected shape one layer backward' },
      { key: 'Ctrl+Shift+]', action: 'Bring to Front', description: 'Move selected shape to front layer' },
      { key: 'Ctrl+Shift+[', action: 'Send to Back', description: 'Move selected shape to back layer' },
    ],
  },
  {
    title: 'File Operations',
    shortcuts: [
      { key: 'Ctrl+S', action: 'Export', description: 'Open export dialog to save drawing' },
      { key: 'Ctrl+O', action: 'Import', description: 'Open import dialog to load drawing' },
      { key: 'N', action: 'New Canvas', description: 'Clear current canvas (with confirmation)' },
    ],
  },
];

const ShortcutItem: React.FC<{ shortcut: { key: string; action: string; description: string } }> = ({ shortcut }) => (
  <div className="flex items-center justify-between py-2 px-1 hover:bg-accent/50 rounded-md transition-colors">
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-foreground">{shortcut.action}</div>
      <div className="text-xs text-muted-foreground truncate">{shortcut.description}</div>
    </div>
    <div className="ml-3 flex-shrink-0">
      <kbd className="inline-flex items-center rounded border border-border bg-muted px-2 py-1 text-xs font-mono text-muted-foreground">
        {shortcut.key}
      </kbd>
    </div>
  </div>
);

const ShortcutCategory: React.FC<{ category: ShortcutCategory }> = ({ category }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="text-sm font-semibold text-foreground mb-3 border-b border-border pb-1">
      {category.title}
    </h3>
    <div className="space-y-1">
      {category.shortcuts.map((shortcut, index) => (
        <ShortcutItem key={index} shortcut={shortcut} />
      ))}
    </div>
  </div>
);

export const ShortcutsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="outline"
        size="sm"
        className={cn(
          "fixed bottom-4 left-4 z-40 shadow-lg backdrop-blur-sm",
          "bg-background/95 border-border/50 hover:bg-accent/50",
          "transition-all duration-200 ease-in-out",
          "flex items-center gap-2 px-3 py-2 h-auto",
          "text-xs font-medium"
        )}
      >
        <span>Shortcuts</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-4xl max-h-[85vh]"
        closeOnOutsideClick={true}
        closeOnEsc={true}
      >
        <ModalHeader>
          <ModalTitle className="text-xl font-bold flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Keyboard Shortcuts
          </ModalTitle>
          <ModalClose onClick={() => setIsModalOpen(false)} />
        </ModalHeader>
        <ModalBody className="p-0">
          <div className="max-h-[65vh] overflow-y-auto">
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Use these keyboard shortcuts to work more efficiently with Open Draw. 
                  Most shortcuts follow industry-standard conventions.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shortcutCategories.map((category, index) => (
                  <ShortcutCategory key={index} category={category} />
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Tool shortcuts only work when not typing in input fields</p>
                  <p>• Space key for panning only works when not in text editing mode</p>
                  <p>• File operations include confirmation dialogs to prevent accidental data loss</p>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
