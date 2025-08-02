import { Shape, Tools } from '@/types';

/**
 * Export options interface
 */
export interface ExportOptions {
  format: 'png' | 'jpeg' | 'svg' | 'pdf' | 'json' | 'native';
  includeBackground: boolean;
  quality?: number; // For JPEG (0-1)
  selectedOnly?: boolean;
  backgroundColor?: string;
}

/**
 * Export utilities for saving and exporting drawing content
 */
export class ExportUtils {
  
  /**
   * Export the canvas or selected shapes
   */
  static async exportDrawing(
    canvasElement: HTMLCanvasElement,
    shapes: Shape[],
    selectedShapes: Shape[],
    options: ExportOptions
  ): Promise<void> {
    const shapesToExport = options.selectedOnly ? selectedShapes : shapes;
    
    switch (options.format) {
      case 'png':
        await this.exportAsPNG(canvasElement, shapesToExport, options);
        break;
      case 'jpeg':
        await this.exportAsJPEG(canvasElement, shapesToExport, options);
        break;
      case 'svg':
        await this.exportAsSVG(shapesToExport, options);
        break;
      case 'pdf':
        await this.exportAsPDF(canvasElement, shapesToExport, options);
        break;
      case 'json':
        this.exportAsJSON(shapesToExport, options);
        break;
      case 'native':
        this.exportAsNative(shapesToExport, options);
        break;
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }

  /**
   * Export as PNG image
   */
  private static async exportAsPNG(
    canvasElement: HTMLCanvasElement,
    shapes: Shape[],
    options: ExportOptions
  ): Promise<void> {
    try {
      const dataUrl = await this.getCanvasDataUrl(canvasElement, shapes, options, 'png');
      this.downloadFile(dataUrl, 'drawing.png');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      throw new Error('Failed to export as PNG');
    }
  }

  /**
   * Export as JPEG image
   */
  private static async exportAsJPEG(
    canvasElement: HTMLCanvasElement,
    shapes: Shape[],
    options: ExportOptions
  ): Promise<void> {
    try {
      const dataUrl = await this.getCanvasDataUrl(canvasElement, shapes, options, 'jpeg');
      this.downloadFile(dataUrl, 'drawing.jpg');
    } catch (error) {
      console.error('Error exporting JPEG:', error);
      throw new Error('Failed to export as JPEG');
    }
  }

  /**
   * Export as SVG
   */
  private static async exportAsSVG(shapes: Shape[], options: ExportOptions): Promise<void> {
    try {
      const svgContent = this.generateSVGContent(shapes, options);
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      this.downloadFile(url, 'drawing.svg');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting SVG:', error);
      throw new Error('Failed to export as SVG');
    }
  }

  /**
   * Export as PDF (simplified implementation)
   */
  private static async exportAsPDF(
    canvasElement: HTMLCanvasElement,
    shapes: Shape[],
    options: ExportOptions
  ): Promise<void> {
    try {
      // For now, we'll create a simple PDF-like export by converting to PNG first
      // and then letting the user print to PDF or use the browser's print functionality
      const dataUrl = await this.getCanvasDataUrl(canvasElement, shapes, options, 'png');
      
      // Create a new window with the image for printing
      const newWindow = window.open('');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>Drawing Export</title></head>
            <body style="margin: 0; padding: 20px; text-align: center;">
              <img src="${dataUrl}" style="max-width: 100%; height: auto;" />
              <script>
                window.onload = function() {
                  setTimeout(function() {
                    window.print();
                  }, 100);
                };
              </script>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        // Fallback: download as PNG
        this.downloadFile(dataUrl, 'drawing.png');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Failed to export as PDF');
    }
  }

  /**
   * Export as JSON (for data interchange)
   */
  private static exportAsJSON(shapes: Shape[], options: ExportOptions): void {
    try {
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        shapes: shapes,
        metadata: {
          exportType: 'json',
          selectedOnly: options.selectedOnly || false,
          includeBackground: options.includeBackground
        }
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      this.downloadFile(url, 'drawing.json');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting JSON:', error);
      throw new Error('Failed to export as JSON');
    }
  }

  /**
   * Export as native format (for re-importing and editing)
   */
  private static exportAsNative(shapes: Shape[], options: ExportOptions): void {
    try {
      const exportData = {
        version: '1.0',
        format: 'open-draw-native',
        timestamp: new Date().toISOString(),
        shapes: shapes,
        metadata: {
          exportType: 'native',
          selectedOnly: options.selectedOnly || false,
          includeBackground: options.includeBackground,
          canEdit: true,
          originalFormat: true
        }
      };

      const content = JSON.stringify(exportData, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      this.downloadFile(url, 'drawing.opendraw');
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting native format:', error);
      throw new Error('Failed to export as native format');
    }
  }

  /**
   * Get canvas data URL for image exports
   */
  private static async getCanvasDataUrl(
    canvasElement: HTMLCanvasElement,
    shapes: Shape[],
    options: ExportOptions,
    format: 'png' | 'jpeg'
  ): Promise<string> {
    if (options.selectedOnly && shapes.length > 0) {
      // Create a temporary canvas for selected shapes only
      return this.createSelectedShapesCanvas(canvasElement, shapes, options, format);
    }

    // Use the existing canvas
    const quality = format === 'jpeg' ? (options.quality || 0.9) : undefined;
    return canvasElement.toDataURL(`image/${format}`, quality);
  }

  /**
   * Create a canvas with only selected shapes
   */
  private static async createSelectedShapesCanvas(
    originalCanvas: HTMLCanvasElement,
    shapes: Shape[],
    options: ExportOptions,
    format: 'png' | 'jpeg'
  ): Promise<string> {
    // Calculate bounding box of selected shapes
    const bounds = this.calculateShapesBounds(shapes);
    const padding = 20;
    
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d')!;
    
    tempCanvas.width = bounds.width + (padding * 2);
    tempCanvas.height = bounds.height + (padding * 2);
    
    // Set background if needed
    if (options.includeBackground) {
      ctx.fillStyle = options.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    }
    
    // Draw selected shapes to temporary canvas
    // Note: This would need integration with the actual drawing renderer
    // For now, we'll copy from the original canvas
    ctx.drawImage(
      originalCanvas,
      bounds.x - padding,
      bounds.y - padding,
      bounds.width + (padding * 2),
      bounds.height + (padding * 2),
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );
    
    const quality = format === 'jpeg' ? (options.quality || 0.9) : undefined;
    return tempCanvas.toDataURL(`image/${format}`, quality);
  }

  /**
   * Generate SVG content from shapes
   */
  private static generateSVGContent(shapes: Shape[], options: ExportOptions): string {
    const bounds = shapes.length > 0 ? this.calculateShapesBounds(shapes) : { x: 0, y: 0, width: 800, height: 600 };
    const padding = 20;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${bounds.width + (padding * 2)}" height="${bounds.height + (padding * 2)}" 
     viewBox="0 0 ${bounds.width + (padding * 2)} ${bounds.height + (padding * 2)}" 
     xmlns="http://www.w3.org/2000/svg">`;

    // Add background if needed
    if (options.includeBackground) {
      svgContent += `
  <rect width="100%" height="100%" fill="${options.backgroundColor || '#ffffff'}"/>`;
    }

    // Convert shapes to SVG elements
    shapes.forEach(shape => {
      svgContent += this.shapeToSVG(shape, bounds.x - padding, bounds.y - padding);
    });

    svgContent += '\n</svg>';
    return svgContent;
  }

  /**
   * Convert a shape to SVG element
   */
  private static shapeToSVG(shape: Shape, offsetX: number, offsetY: number): string {
    const x1 = shape.x1 - offsetX;
    const y1 = shape.y1 - offsetY;
    const x2 = shape.x2 - offsetX;
    const y2 = shape.y2 - offsetY;
    
    const strokeColor = shape.strokeColor || '#000000';
    const fillColor = shape.fillColor === 'transparent' || !shape.fillColor ? 'none' : shape.fillColor;
    const strokeWidth = shape.strokeWidth || 1;

    switch (shape.type) {
      case Tools.rectangle:
        return `
  <rect x="${Math.min(x1, x2)}" y="${Math.min(y1, y2)}" 
        width="${Math.abs(x2 - x1)}" height="${Math.abs(y2 - y1)}" 
        fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

      case Tools.circle:
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2;
        const rx = Math.abs(x2 - x1) / 2;
        const ry = Math.abs(y2 - y1) / 2;
        return `
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" 
           fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

      case Tools.line:
        return `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
        stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

      case Tools.triangle:
        const topX = (x1 + x2) / 2;
        const topY = y1;
        const points = `${x1},${y2} ${topX},${topY} ${x2},${y2}`;
        return `
  <polygon points="${points}" 
           fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

      case Tools.diamond:
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        const diamondPoints = `${centerX},${y1} ${x2},${centerY} ${centerX},${y2} ${x1},${centerY}`;
        return `
  <polygon points="${diamondPoints}" 
           fill="${fillColor}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;

      case Tools.pencil:
        if (shape.points && shape.points.length > 1) {
          const pathData = shape.points.reduce((path, point, index) => {
            return path + (index === 0 ? `M ${point.x - offsetX} ${point.y - offsetY}` : ` L ${point.x - offsetX} ${point.y - offsetY}`);
          }, '');
          return `
  <path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
        }
        return '';

      case Tools.text:
        return `
  <text x="${x1}" y="${y1}" fill="${strokeColor}" font-size="${strokeWidth * 8}" font-family="Arial, sans-serif">
    ${shape.text || ''}
  </text>`;

      default:
        return '';
    }
  }

  /**
   * Calculate bounding box for shapes
   */
  private static calculateShapesBounds(shapes: Shape[]): { x: number; y: number; width: number; height: number } {
    if (shapes.length === 0) {
      return { x: 0, y: 0, width: 800, height: 600 };
    }

    const minX = Math.min(...shapes.map(s => Math.min(s.x1, s.x2)));
    const minY = Math.min(...shapes.map(s => Math.min(s.y1, s.y2)));
    const maxX = Math.max(...shapes.map(s => Math.max(s.x1, s.x2)));
    const maxY = Math.max(...shapes.map(s => Math.max(s.y1, s.y2)));

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Download file helper
   */
  private static downloadFile(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Import native format file
   */
  static async importNativeFile(file: File): Promise<Shape[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // Validate native format
          if (data.format !== 'open-draw-native' && !data.shapes) {
            throw new Error('Invalid file format');
          }
          
          resolve(data.shapes || []);
        } catch {
          reject(new Error('Failed to parse file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Import JSON file
   */
  static async importJSONFile(file: File): Promise<Shape[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // Support both native format and simple JSON arrays
          const shapes = data.shapes || data;
          
          if (!Array.isArray(shapes)) {
            throw new Error('Invalid JSON format');
          }
          
          resolve(shapes);
        } catch {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}
