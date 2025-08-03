/**
 * @fileoverview Animated properties sidebar for shape editing
 * @description Provides stroke and object controls in an animated sidebar that appears when shapes are selected
 * @since 2025
 * @author Open Draw Team
 * 
 * @example
 * ```tsx
 * <ShapePropertiesSidebar />
 * ```
 * 
 * @features
 * - Animated slide in/out based on selection
 * - Contains stroke controls and object controls
 * - Responsive design with smooth animations
 * - Centered position for better accessibility
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useDrawingStore } from '@/store/drawingStore';
import { StrokeControls } from './StrokeControls';
import { ObjectControls } from './ObjectControls';
import { Settings2 } from 'lucide-react';

/**
 * Animated properties sidebar component
 * 
 * Shows stroke and object controls in a centered sidebar that slides in
 * when shapes are selected and slides out when no shapes are selected.
 * 
 * @returns {JSX.Element} The rendered properties sidebar component
 */
export const ShapePropertiesSidebar = () => {
  const { selectedShapes } = useDrawingStore();
  
  const isVisible = selectedShapes.length > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            x: -400, 
            opacity: 0,
            scale: 0.9 
          }}
          animate={{ 
            x: 0, 
            opacity: 1,
            scale: 1 
          }}
          exit={{ 
            x: -400, 
            opacity: 0,
            scale: 0.9 
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 },
            scale: { duration: 0.2 }
          }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-80 max-w-[90vw] max-h-[70vh] overflow-y-auto 
                     bg-background/95 backdrop-blur-sm border border-border rounded-xl shadow-2xl max-sm:hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <Settings2 size={20} className="text-muted-foreground" />
            <h3 className="font-medium text-foreground">Shape Properties</h3>
            <div className="ml-auto text-xs text-muted-foreground">
              {selectedShapes.length} selected
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Stroke Controls Section */}
                <StrokeControls />

            {/* Object Controls Section */}
                <ObjectControls />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Select shapes to modify their properties
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
