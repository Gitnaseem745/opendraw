import { create } from 'zustand';

interface UIState {
  // UI state
  showGrid: boolean;
  showRulers: boolean;
  isDarkMode: boolean;
  
  // Modal states
  showExportModal: boolean;
  showImportModal: boolean;
  
  // Text editing
  isTextEditing: boolean;
  textEditPosition: { x: number; y: number };

  // Actions
  toggleGrid: () => void;
  toggleRulers: () => void;
  toggleDarkMode: () => void;
  setShowExportModal: (show: boolean) => void;
  setShowImportModal: (show: boolean) => void;
  setTextEditing: (editing: boolean, position?: { x: number; y: number }) => void;
}

/**
 * Zustand store for managing UI state.
 * Handles grid visibility, rulers, dark mode, and text editing state.
 */
export const useUIStore = create<UIState>((set) => ({
  showGrid: false,
  showRulers: false,
  isDarkMode: false,
  showExportModal: false,
  showImportModal: false,
  isTextEditing: false,
  textEditPosition: { x: 0, y: 0 },
  
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleRulers: () => set((state) => ({ showRulers: !state.showRulers })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setShowExportModal: (showExportModal) => set({ showExportModal }),
  setShowImportModal: (showImportModal) => set({ showImportModal }),
  setTextEditing: (isTextEditing, textEditPosition = { x: 0, y: 0 }) => 
    set({ isTextEditing, textEditPosition }),
}));
