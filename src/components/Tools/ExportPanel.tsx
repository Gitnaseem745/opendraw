/**
 * @fileoverview Export Panel Component for saving and exporting drawings
 * @description Provides comprehensive export functionality including multiple formats and options
 * @since 2025
 * @author Open Draw Team
 */

import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { useDrawingStore } from '@/store/drawingStore';
import { useCanvasStore } from '@/store/canvasStore';
import { useUIStore } from '@/store/uiStore';
import { ExportUtils, ExportOptions } from '@/lib/exportUtils';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { SimpleDropdownWrapper } from '@/components/ui/dropdown-wrapper';
import { Download, FileImage, FileType, Image, Palette, Upload } from 'lucide-react';
import { Shape } from '@/types';

/**
 * Export/Import Context interface
 */
interface ExportImportContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isImportOpen: boolean;
  setIsImportOpen: (open: boolean) => void;
  exportOptions: ExportOptions;
  setExportOptions: React.Dispatch<React.SetStateAction<ExportOptions>>;
  isExporting: boolean;
  exportFormats: Array<{ value: string; label: string; icon: React.ReactNode }>;
  handleExport: () => Promise<void>;
  handleImport: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  backgroundColors: Array<{ value: string; label: string }>;
  shapes: Shape[];
  selectedShapes: Shape[];
}

/**
 * Export/Import Context
 */
const ExportImportContext = createContext<ExportImportContextType | undefined>(undefined);

/**
 * Custom hook to use export/import context
 */
export const useExportImport = (): ExportImportContextType => {
  const context = useContext(ExportImportContext);
  if (!context) {
    throw new Error('useExportImport must be used within an ExportImportProvider');
  }
  return context;
};

/**
 * Export/Import Provider Component
 */
export const ExportImportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { shapes, selectedShapes } = useDrawingStore();
  const { canvasRef } = useCanvasStore();
  const { showExportModal, showImportModal, setShowExportModal, setShowImportModal } = useUIStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'png',
    includeBackground: true,
    quality: 0.9,
    selectedOnly: false,
    backgroundColor: '#ffffff'
  });
  const [isExporting, setIsExporting] = useState(false);

  // Sync global state with local state
  useEffect(() => {
    setIsOpen(showExportModal);
  }, [showExportModal]);

  useEffect(() => {
    setIsImportOpen(showImportModal);
  }, [showImportModal]);

  // Update global state when local state changes
  const handleSetIsOpen = (open: boolean) => {
    setIsOpen(open);
    setShowExportModal(open);
  };

  const handleSetIsImportOpen = (open: boolean) => {
    setIsImportOpen(open);
    setShowImportModal(open);
  };

  const exportFormats = [
    { value: 'png', label: 'PNG Image', icon: <Image size={16} /> },
    { value: 'jpeg', label: 'JPEG Image', icon: <Image size={16} /> },
    { value: 'svg', label: 'SVG Vector', icon: <FileType size={16} /> },
    { value: 'pdf', label: 'PDF Document', icon: <FileImage size={16} /> },
    { value: 'json', label: 'JSON Data', icon: <FileType size={16} /> },
    { value: 'native', label: 'Native Format (.opendraw)', icon: <Palette size={16} /> }
  ];

  const handleExport = async () => {
    if (!canvasRef?.current) {
      console.error('Canvas not available for export');
      return;
    }

    setIsExporting(true);
    try {
      await ExportUtils.exportDrawing(
        canvasRef.current,
        shapes,
        selectedShapes,
        exportOptions
      );
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      handleSetIsOpen(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let importedShapes;
      if (file.name.endsWith('.opendraw') || file.name.endsWith('.json')) {
        if (file.name.endsWith('.opendraw')) {
          importedShapes = await ExportUtils.importNativeFile(file);
        } else {
          importedShapes = await ExportUtils.importJSONFile(file);
        }
        
        // Add imported shapes to the store
        const { setShapes } = useDrawingStore.getState();
        setShapes([...shapes, ...importedShapes], true);
        
        alert(`Successfully imported ${importedShapes.length} shapes`);
      } else {
        alert('Unsupported file format. Please use .opendraw or .json files.');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the file format and try again.');
    }
    
    handleSetIsImportOpen(false);
    // Reset file input
    event.target.value = '';
  };

  const backgroundColors = [
    { value: '#ffffff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e9ecef', label: 'Gray' },
    { value: '#000000', label: 'Black' },
    { value: 'transparent', label: 'Transparent' }
  ];

  const contextValue: ExportImportContextType = {
    isOpen,
    setIsOpen: handleSetIsOpen,
    isImportOpen,
    setIsImportOpen: handleSetIsImportOpen,
    exportOptions,
    setExportOptions,
    isExporting,
    exportFormats,
    handleExport,
    handleImport,
    backgroundColors,
    shapes,
    selectedShapes
  };

  return (
    <ExportImportContext.Provider value={contextValue}>
      {children}
    </ExportImportContext.Provider>
  );
};

/**
 * Export Button Component
 */
export const ExportButton: React.FC = () => {
  const { setIsOpen } = useExportImport();
  
  return (
    <Button
      onClick={() => setIsOpen(true)}
      variant="outline"
      size="sm"
      title="Export Drawing"
      className="flex items-center gap-2"
    >
      <Download size={16} />
      Export
    </Button>
  );
};

/**
 * Import Button Component
 */
export const ImportButton: React.FC = () => {
  const { setIsImportOpen } = useExportImport();
  
  return (
    <Button
      onClick={() => setIsImportOpen(true)}
      variant="outline"
      size="sm"
      title="Import Drawing"
      className="flex items-center gap-2"
    >
      <Upload size={16} />
      Import
    </Button>
  );
};

/**
 * Export Modals Component - handles both export and import modals
 */
export const ExportModals: React.FC = () => {
  const {
    isOpen,
    setIsOpen,
    isImportOpen,
    setIsImportOpen,
    exportOptions,
    setExportOptions,
    isExporting,
    exportFormats,
    handleExport,
    handleImport,
    backgroundColors,
    selectedShapes
  } = useExportImport();

  return (
    <>
      {/* Export Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Export Drawing</h2>
          <div className="space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Export Format</label>
            <SimpleDropdownWrapper
              value={exportOptions.format}
              onChange={(value: string) => setExportOptions(prev => ({ ...prev, format: value as ExportOptions['format'] }))}
              options={exportFormats.map(format => ({
                value: format.value,
                label: format.label,
                icon: format.icon
              }))}
              placeholder="Select format"
            />
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectedOnly"
                name="selectedOnly"
                checked={exportOptions.selectedOnly || false}
                onChange={(e) => 
                  setExportOptions(prev => ({ ...prev, selectedOnly: e.target.checked }))
                }
              />
              <label htmlFor="selectedOnly" className="text-sm">
                Export selected shapes only ({selectedShapes.length} selected)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeBackground"
                name="includeBackground"
                checked={exportOptions.includeBackground}
                onChange={(e) => 
                  setExportOptions(prev => ({ ...prev, includeBackground: e.target.checked }))
                }
              />
              <label htmlFor="includeBackground" className="text-sm">
                Include background
              </label>
            </div>

            {/* Background Color Selection */}
            {exportOptions.includeBackground && exportOptions.format !== 'json' && exportOptions.format !== 'native' && (
              <div>
                <label className="block text-sm font-medium mb-2">Background Color</label>
                <SimpleDropdownWrapper
                  value={exportOptions.backgroundColor || '#ffffff'}
                  onChange={(value: string) => setExportOptions(prev => ({ ...prev, backgroundColor: value }))}
                  options={backgroundColors}
                  placeholder="Select background color"
                />
              </div>
            )}

            {/* JPEG Quality */}
            {exportOptions.format === 'jpeg' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Quality: {Math.round((exportOptions.quality || 0.9) * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={exportOptions.quality || 0.9}
                  onChange={(e) => setExportOptions(prev => ({ 
                    ...prev, 
                    quality: parseFloat(e.target.value) 
                  }))}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Format Information */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {exportOptions.format === 'png' && (
              <p>PNG: High quality, lossless compression, supports transparency</p>
            )}
            {exportOptions.format === 'jpeg' && (
              <p>JPEG: Smaller file size, lossy compression, no transparency</p>
            )}
            {exportOptions.format === 'svg' && (
              <p>SVG: Vector format, scalable, editable in design software</p>
            )}
            {exportOptions.format === 'pdf' && (
              <p>PDF: Document format, printable, universal compatibility</p>
            )}
            {exportOptions.format === 'json' && (
              <p>JSON: Data format for importing into other applications</p>
            )}
            {exportOptions.format === 'native' && (
              <p>Native: Full fidelity format for re-importing and editing</p>
            )}
          </div>

          {/* Export Button */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || (exportOptions.selectedOnly && selectedShapes.length === 0)}
            >
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Import Drawing</h2>
          <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Import drawings from .opendraw (native format) or .json files.
          </p>
          
          <div>
            <input
              type="file"
              accept=".opendraw,.json"
              onChange={handleImport}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Supported formats:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>.opendraw - Native format with full editing capabilities</li>
              <li>.json - JSON data format with shape information</li>
            </ul>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={() => setIsImportOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
        </div>
      </Modal>
    </>
  );
};

/**
 * Export panel component with comprehensive export options
 */
export const ExportPanel: React.FC = () => {
  return (
    <ExportImportProvider>
      {/* Export Button */}
      <div className="flex gap-2">
        <ExportButton />
        <ImportButton />
      </div>

      <ExportModals />
    </ExportImportProvider>
  );
};

export default ExportPanel;
