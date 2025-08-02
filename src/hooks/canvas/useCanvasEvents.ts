import { useCallback, useRef } from 'react';
import { MouseEvent } from 'react';
import { useDrawingStore } from '@/store/drawingStore';
import { useKeyboard } from '../input/useKeyboard';
import { getShapeAtPosition } from '@/lib/get-position';
import { createShape } from '@/lib/create-shape';
import { Tools, SelectedElementType, ExtendedElementType, Shape } from '@/types';
import { getShapesToErase } from '@/lib/eraser';
import { canvasUtils } from '@/lib/canvasUtils';

/**
 * Custom hook that manages all canvas mouse events and drawing interactions.
 * Handles shape creation, selection, movement, erasing, and panning based on the current tool.
 * Supports both touch and mouse events with proper coordinate transformation.
 * 
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef - Reference to the canvas element
 * @returns {object} - Object containing mouse event handlers
 * @returns {function} returns.handleMouseDown - Handler for mouse down events
 * @returns {function} returns.handleMouseMove - Handler for mouse move events  
 * @returns {function} returns.handleMouseUp - Handler for mouse up events
 */
export const useCanvasEvents = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const {
    tool, action, shapes, selectedShape, selectedShapes, scale, panOffset, scaleOffset,
    strokeColor, fillColor, strokeWidth,
    setAction, setSelectedShape, setSelectedShapes, setShapes, setPanOffset, duplicateShapes, updateUIColorsFromShape
  } = useDrawingStore();
  
  const startPanPosition = useRef({ x: 0, y: 0 });
  const isSpacePressed = useRef(false);
  
  // Handle space key for panning
  useKeyboard({
    keys: ' ',
    callback: (e) => {
      // Only activate panning if not typing in an input field
      const target = e.target as HTMLElement;
      const tagName = target?.tagName?.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const isContentEditable = target?.contentEditable === 'true';
      const isWriting = action === 'writing';
      
      if (!isInput && !isContentEditable && !isWriting) {
        e.preventDefault();
        isSpacePressed.current = true;
        document.body.style.cursor = "grab";
      }
    },
    eventType: 'keydown'
  });
  
  useKeyboard({
    keys: ' ',
    callback: (e) => {
      const target = e.target as HTMLElement;
      const tagName = target?.tagName?.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';
      const isContentEditable = target?.contentEditable === 'true';
      const isWriting = action === 'writing';
      
      if (!isInput && !isContentEditable && !isWriting) {
        e.preventDefault();
        isSpacePressed.current = false;
        document.body.style.cursor = "default";
      }
    },
    eventType: 'keyup'
  });
  
  const getMouseCoordinates = useCallback((event: MouseEvent) => {
    return canvasUtils.getMouseCoordinates(event, panOffset, scale, scaleOffset);
  }, [panOffset, scale, scaleOffset]);

  const updateElement = useCallback((
    id: number,
    x1: number, y1: number, x2: number, y2: number,
    type: Tools,
    options?: { text: string },
    saveToHistory: boolean = false
  ) => {
    const shapesCopy = [...shapes];
    const existingShape = shapesCopy[id];
    const maxZ = Math.max(...shapes.map(s => s.zIndex || 0), 0);
    
    // Use existing shape's colors instead of current tool colors
    const shapeStrokeColor = existingShape?.strokeColor || strokeColor;
    const shapeFillColor = existingShape?.fillColor || fillColor;
    const shapeStrokeWidth = existingShape?.strokeWidth || strokeWidth;
    const shapeZIndex = existingShape?.zIndex || maxZ + 1;
    
    switch (type) {
      case Tools.line:
      case Tools.rectangle:
      case Tools.triangle:
      case Tools.circle:
      case Tools.diamond:
      case Tools.arrow:
        shapesCopy[id] = createShape(
          { id, x1, y1, x2, y2, type }, 
          shapeStrokeColor, 
          shapeFillColor, 
          shapeStrokeWidth, 
          shapeZIndex
        );
        break;

      case Tools.pencil:
        // Add new point to existing path
        const existingPoints = shapesCopy[id].points || [];
        shapesCopy[id].points = [...existingPoints, { x: x2, y: y2 }];
        break;
        
      case Tools.text:
        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas shape not found");
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not get 2D context from canvas");
        if (!options) throw new Error("No text options provided for text tool");
        
        const textWidth = context.measureText(options.text).width;
        const textHeight = 24;
        
        shapesCopy[id] = {
          ...createShape(
            { id, x1, y1, x2: x1 + textWidth, y2: y1 + textHeight, type }, 
            shapeStrokeColor, 
            shapeFillColor, 
            shapeStrokeWidth, 
            shapeZIndex
          ),
          text: options.text
        };
        break;
        
      default:
        throw new Error(`Type not recognised: ${type}`);
    }

    setShapes(shapesCopy, saveToHistory);
  }, [shapes, setShapes, canvasRef, strokeColor, fillColor, strokeWidth]);
  
  const handleMouseDown = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    if (action === "writing") return;
    
    const { clientX, clientY } = getMouseCoordinates(event);
    
    // Panning logic
    if (tool === Tools.pan || event.button === 1 || isSpacePressed.current) {
      setAction("panning");
      startPanPosition.current = { x: clientX, y: clientY };
      document.body.style.cursor = "grabbing";
      return;
    }
    
    // Selection logic
    if (tool === Tools.selection) {
      const shape = getShapeAtPosition(clientX, clientY, shapes);

      if (shape) {
        // Handle Alt+click for duplication
        if (event.altKey) {
          let shapesToDuplicate: Shape[] = [];
          
          // Determine what to duplicate
          if (shape.isGrouped && shape.groupId) {
            // If clicked shape is grouped, duplicate the entire group
            shapesToDuplicate = shapes.filter(s => s.groupId === shape.groupId);
          } else if (selectedShapes.length > 1 && selectedShapes.some(s => s.id === shape.id)) {
            // If clicked shape is part of current multi-selection, duplicate all selected shapes
            shapesToDuplicate = selectedShapes;
          } else {
            // Otherwise, duplicate just the clicked shape
            shapesToDuplicate = [shape];
          }
          
          // Calculate offset based on mouse position relative to original shapes
          const bounds = {
            minX: Math.min(...shapesToDuplicate.map(s => Math.min(s.x1, s.x2))),
            minY: Math.min(...shapesToDuplicate.map(s => Math.min(s.y1, s.y2)))
          };
          
          const offsetX = Math.round((clientX - bounds.minX) / 2);
          const offsetY = Math.round((clientY - bounds.minY) / 2);

          // Duplicate the shapes with history saving
          duplicateShapes(shapesToDuplicate, offsetX, offsetY, true);
          
          return; // Exit early, don't proceed with normal selection
        }

        let selectedElement: SelectedElementType = { ...shape };

        // Check if clicked shape is part of a group
        if (shape.isGrouped && shape.groupId) {
          // Get all shapes in the same group
          const groupedShapes = shapes.filter(s => s.groupId === shape.groupId);
          
          // Calculate group offset from click position
          const groupBounds = {
            minX: Math.min(...groupedShapes.map(s => Math.min(s.x1, s.x2))),
            minY: Math.min(...groupedShapes.map(s => Math.min(s.y1, s.y2))),
            maxX: Math.max(...groupedShapes.map(s => Math.max(s.x1, s.x2))),
            maxY: Math.max(...groupedShapes.map(s => Math.max(s.y1, s.y2)))
          };
          
          const offsetX = clientX - groupBounds.minX;
          const offsetY = clientY - groupBounds.minY;
          
          // Set the group as selected with proper offset
          selectedElement = { ...selectedElement, offsetX, offsetY };
          
          // Handle multi-selection with Ctrl key
          if (event.ctrlKey || event.metaKey) {
            const isGroupAlreadySelected = selectedShapes.some(s => s.groupId === shape.groupId);
            if (isGroupAlreadySelected) {
              // Remove entire group from selection
              setSelectedShapes(selectedShapes.filter(s => s.groupId !== shape.groupId));
              setSelectedShape(null);
            } else {
              // Add entire group to selection
              setSelectedShapes([...selectedShapes, ...groupedShapes]);
              setSelectedShape(selectedElement);
            }
          } else {
            // Select entire group
            setSelectedShape(selectedElement);
            setSelectedShapes(groupedShapes);
            // Update UI colors to match the first shape in the group
            updateUIColorsFromShape(groupedShapes[0]);
          }
        } else {
          // Handle non-grouped shapes as before
          if (shape.type === Tools.pencil && shape.points) {
            const xOffsets = shape.points.map((point) => clientX - point.x);
            const yOffsets = shape.points.map((point) => clientY - point.y);
            selectedElement = { ...selectedElement, xOffsets, yOffsets };
          } else {
            const offsetX = clientX - selectedElement.x1;
            const offsetY = clientY - selectedElement.y1;
            selectedElement = { ...selectedElement, offsetX, offsetY };
          }

          // Handle multi-selection with Ctrl key
          if (event.ctrlKey || event.metaKey) {
            const isAlreadySelected = selectedShapes.some(s => s.id === shape.id);
            if (isAlreadySelected) {
              // Remove from selection
              setSelectedShapes(selectedShapes.filter(s => s.id !== shape.id));
              setSelectedShape(null);
            } else {
              // Add to selection
              setSelectedShapes([...selectedShapes, selectedElement]);
              setSelectedShape(selectedElement);
              // Update UI colors to match the newly selected shape
              updateUIColorsFromShape(selectedElement);
            }
          } else {
            // Single selection (clear previous selections)
            setSelectedShape(selectedElement);
            setSelectedShapes([selectedElement]);
            // Update UI colors to match the selected shape
            updateUIColorsFromShape(selectedElement);
          }
        }
        
        // Save current state to history before we start modifying
        setShapes(shapes, true);

        if (shape.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      } else {
        // Clicked on empty space - clear selection unless Ctrl is held
        if (!event.ctrlKey && !event.metaKey) {
          setSelectedShape(null);
          setSelectedShapes([]);
        }
      }
      return;
    }
    
    // Eraser logic
    if (tool === Tools.eraser) {
      const shapesToErase = getShapesToErase(clientX, clientY, shapes, 20);
      if (shapesToErase.length > 0) {
        const updatedShapes = shapes.filter(shape => !shapesToErase.includes(shape.id));
        setShapes(updatedShapes, true);
      }
      setAction("erasing");
      return;
    }
    
    // Drawing logic
    // Save current state to history before we start drawing
    setShapes(shapes, true);
    
    const id = shapes.length;
    const maxZ = Math.max(...shapes.map(s => s.zIndex || 0), 0);
    const newElement = createShape({
      id,
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
      type: tool,
    }, strokeColor, fillColor, strokeWidth, maxZ + 1);
    const updatedShapes = [...shapes, newElement];
    setShapes(updatedShapes, false); // Don't save again, we already saved above
    setSelectedShape(newElement);
    setAction(tool === Tools.text ? "writing" : "drawing");
  }, [action, tool, shapes, getMouseCoordinates, setAction, setSelectedShape, setSelectedShapes, setShapes, strokeColor, fillColor, strokeWidth, selectedShapes, duplicateShapes, updateUIColorsFromShape]);
  
  const handleMouseMove = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (action === "panning" && startPanPosition.current) {
      const deltaX = clientX - startPanPosition.current.x;
      const deltaY = clientY - startPanPosition.current.y;
      
      setPanOffset({
        x: panOffset.x + deltaX,
        y: panOffset.y + deltaY,
      });
      
      startPanPosition.current = { x: clientX, y: clientY };
      return;
    }

    if (tool === Tools.selection) {
      const shape = getShapeAtPosition(clientX, clientY, shapes);

      if (shape && shape.position) {
        (event.target as HTMLElement).style.cursor = canvasUtils.getCursorForPosition(shape.position);
      } else {
        (event.target as HTMLElement).style.cursor = "default";
      }
    } else if (tool === Tools.eraser) {
      // Set eraser cursor
      (event.target as HTMLElement).style.cursor = "crosshair";
    }

    if (action === "drawing") {
      const index = shapes.length - 1;
      const { x1, y1 } = shapes[index];
      updateElement(index, x1, y1, clientX, clientY, tool, undefined, false); // Don't save to history during drawing
    } else if (action === "erasing") {
      // Continue erasing while mouse is being dragged
      const shapesToErase = getShapesToErase(clientX, clientY, shapes, 20);
      if (shapesToErase.length > 0) {
        const updatedShapes = shapes.filter(shape => !shapesToErase.includes(shape.id));
        setShapes(updatedShapes, false); // Don't save to history during continuous erasing
      }
    } else if (action === "moving" && selectedShape) {
      // Check if we're moving a grouped shape
      if (selectedShape.isGrouped && selectedShape.groupId) {
        // Move entire group
        const groupedShapes = shapes.filter(s => s.groupId === selectedShape.groupId);
        const safeOffsetX = selectedShape.offsetX ?? 0;
        const safeOffsetY = selectedShape.offsetY ?? 0;
        
        // Calculate movement delta from the group's reference point
        const groupBounds = {
          minX: Math.min(...groupedShapes.map(s => Math.min(s.x1, s.x2))),
          minY: Math.min(...groupedShapes.map(s => Math.min(s.y1, s.y2)))
        };
        
        const deltaX = (clientX - safeOffsetX) - groupBounds.minX;
        const deltaY = (clientY - safeOffsetY) - groupBounds.minY;
        
        // Update all shapes in the group
        const shapesCopy = [...shapes];
        const updatedSelectedShapes: typeof selectedShapes = [];
        
        groupedShapes.forEach(groupShape => {
          if (groupShape.type === Tools.pencil && groupShape.points) {
            // Handle pencil tool points
            const newPoints = groupShape.points.map(point => ({
              x: point.x + deltaX,
              y: point.y + deltaY,
            }));
            shapesCopy[groupShape.id] = {
              ...shapesCopy[groupShape.id],
              points: newPoints,
            };
            // Update selected shape with new points
            updatedSelectedShapes.push({
              ...groupShape,
              points: newPoints,
            });
          } else {
            // Handle other shapes
            const newX1 = groupShape.x1 + deltaX;
            const newY1 = groupShape.y1 + deltaY;
            const newX2 = groupShape.x2 + deltaX;
            const newY2 = groupShape.y2 + deltaY;
            
            shapesCopy[groupShape.id] = {
              ...shapesCopy[groupShape.id],
              x1: newX1,
              y1: newY1,
              x2: newX2,
              y2: newY2,
            };
            // Update selected shape with new coordinates
            updatedSelectedShapes.push({
              ...groupShape,
              x1: newX1,
              y1: newY1,
              x2: newX2,
              y2: newY2,
            });
          }
        });
        
        setShapes(shapesCopy, false); // Don't save to history during moving - this will trigger re-render
        setSelectedShapes(updatedSelectedShapes); // Update selection for real-time indicators
      } else if (
        selectedShape.type === Tools.pencil &&
        "points" in selectedShape &&
        "xOffsets" in selectedShape &&
        "yOffsets" in selectedShape
      ) {
        const extendedElement = selectedShape as ExtendedElementType;
        const newPoints = extendedElement.points!.map((_, index) => ({
          x: clientX - extendedElement.xOffsets![index],
          y: clientY - extendedElement.yOffsets![index],
        }));
        const shapesCopy = [...shapes];
        shapesCopy[extendedElement.id] = {
          ...shapesCopy[extendedElement.id],
          points: newPoints,
        };
        
        // Update selected shapes for real-time indicators
        const updatedSelectedShapes = selectedShapes.map(shape => 
          shape.id === extendedElement.id 
            ? { ...shape, points: newPoints }
            : shape
        );
        
        setShapes(shapesCopy, false); // Don't save to history during moving
        setSelectedShapes(updatedSelectedShapes);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedShape as ExtendedElementType;
        const safeOffsetX = offsetX ?? 0;
        const safeOffsetY = offsetY ?? 0;
        const newX1 = clientX - safeOffsetX;
        const newY1 = clientY - safeOffsetY;
        const newX2 = newX1 + (x2 - x1);
        const newY2 = newY1 + (y2 - y1);
        const options = type === Tools.text && selectedShape.text ? { text: selectedShape.text } : undefined;
        
        // Update selected shapes for real-time indicators
        const updatedSelectedShapes = selectedShapes.map(shape => 
          shape.id === id 
            ? { ...shape, x1: newX1, y1: newY1, x2: newX2, y2: newY2 }
            : shape
        );
        
        updateElement(id, newX1, newY1, newX2, newY2, type, options, false); // Don't save to history during moving
        setSelectedShapes(updatedSelectedShapes);
      }
    } else if (action === "resizing" && selectedShape && selectedShape.position) {
      const { id, type, position, ...coordinates } = selectedShape as ExtendedElementType;

      if (typeof position === "string") {
        const { x1, y1, x2, y2 } = canvasUtils.calculateResizedCoordinates(clientX, clientY, position, coordinates);
        updateElement(id, x1, y1, x2, y2, type, undefined, false); // Don't save to history during resizing
      }
    }
  }, [action, tool, shapes, selectedShape, selectedShapes, panOffset, setPanOffset, getMouseCoordinates, updateElement, setShapes, setSelectedShapes]);
  
  const handleMouseUp = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = getMouseCoordinates(event);

    if (selectedShape) {
      const index = selectedShape.id;
      const { id, type } = shapes[index];
      if ((action === "drawing" || action === "resizing") && canvasUtils.requiresCoordinateAdjustment(type)) {
        const { x1, y1, x2, y2 } = canvasUtils.adjustShapeCoordinates(shapes[index]);
        updateElement(id, x1, y1, x2, y2, type, undefined, false); // Don't save to history here, we'll save below
      }

      const offsetX = selectedShape.offsetX || 0;
      const offsetY = selectedShape.offsetY || 0;

      if (
        selectedShape.type === Tools.text &&
        clientX - offsetX === selectedShape.x1 &&
        clientY - offsetY === selectedShape.y1
      ) {
        setAction("writing");
        return;
      }
    }

    if (action === "writing") return;

    if (action === "panning") {
      document.body.style.cursor = "default";
    }

    // Save final state to history after erasing is complete
    if (action === "erasing") {
      setShapes(shapes, true);
    }

    // Save final state to history after moving or resizing is complete
    if (action === "moving" || action === "resizing") {
      setShapes(shapes, true);
    }

    setAction("none");
    setSelectedShape(null);
  }, [action, selectedShape, shapes, getMouseCoordinates, updateElement, setAction, setSelectedShape, setShapes]);
  
  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
