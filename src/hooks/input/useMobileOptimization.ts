import { useCallback, useEffect } from 'react';

/**
 * Custom hook for mobile-specific optimizations
 * Handles mobile viewport settings, touch feedback, and performance optimizations
 */
export const useMobileOptimization = () => {
  
  /**
   * Prevents default touch behaviors and optimizes for drawing
   */
  const optimizeForMobile = useCallback(() => {
    // Prevent default touch behaviors on the document
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent context menu on long press
    const preventContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Add event listeners
    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('contextmenu', preventContextMenu);

    // Disable text selection during drawing
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    // Additional vendor prefixes via setProperty
    document.body.style.setProperty('-moz-user-select', 'none');
    document.body.style.setProperty('-ms-user-select', 'none');

    // Optimize for mobile viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
      );
    }

    // Cleanup function
    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchmove', preventDefault);
      document.removeEventListener('contextmenu', preventContextMenu);
      
      // Reset text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.setProperty('-moz-user-select', '');
      document.body.style.setProperty('-ms-user-select', '');
    };
  }, []);

  /**
   * Detects if the device is mobile/tablet
   */
  const isMobileDevice = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
  }, []);

  /**
   * Provides haptic feedback for touch interactions (if supported)
   */
  const provideTouchFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const intensity = {
        light: 10,
        medium: 50,
        heavy: 100
      };
      navigator.vibrate(intensity[type]);
    }
  }, []);

  /**
   * Optimizes canvas for touch interactions
   */
  const optimizeCanvasForTouch = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas) return;

    // Set CSS to optimize for touch
    canvas.style.touchAction = 'none';
    canvas.style.setProperty('-ms-touch-action', 'none');
    
    // Disable image dragging
    canvas.draggable = false;
    
    // Prevent image context menu
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Optimize canvas drawing settings for touch
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Improve drawing quality on high DPI displays
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      
      // Optimize rendering for touch
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = true;
    }
  }, []);

  // Initialize mobile optimizations on mount
  useEffect(() => {
    if (isMobileDevice()) {
      return optimizeForMobile();
    }
  }, [optimizeForMobile, isMobileDevice]);

  return {
    isMobileDevice,
    provideTouchFeedback,
    optimizeCanvasForTouch,
    optimizeForMobile
  };
};
