# Open Draw V1 🎨 - GitNaseem745

A modern, feature-rich drawing application built with Next.js and TypeScript. Create, edit, and export your drawings with professional-grade tools and an intuitive interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB)](https://reactjs.org/)

## ✨ Features

### 🎯 Drawing Tools
- **Selection Tool (V)**: Select, move, resize, and manipulate shapes with precision
- **Pencil Tool (P)**: Smooth freehand drawing with Perfect-Freehand technology
- **Shape Tools**: Line (L), Rectangle (R), Triangle (U), Circle (C), Diamond (D), Arrow (A)
- **Text Tool (T)**: Inline text editing with responsive positioning and real-time updates
- **Eraser Tool (E)**: Precision erasing with visual feedback and cursor indicator
- **Pan Tool (H)**: Navigate large canvases with ease, including middle-click and space+drag support
- **Lock Tool (K)**: Lock canvas to prevent accidental modifications

### 🎨 Customization & Styling
- **Color Controls**: Comprehensive stroke and fill color selection with preset palettes
- **Stroke Width**: Adjustable line thickness (1-20px) for all tools with real-time preview
- **Shape Properties**: Dynamic sidebar for selected shape customization
- **Multi-Selection**: Select and manipulate multiple shapes simultaneously (Ctrl+Click)
- **Shape Grouping**: Group/ungroup shapes for complex compositions (Ctrl+G/Ctrl+Shift+G)
- **Layer Management**: Z-index controls - bring forward/backward, send to front/back

### 🔄 Advanced Features
- **Undo/Redo System**: 30-step history with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Zoom & Pan**: Smooth canvas navigation with mouse wheel, keyboard shortcuts, and touch gestures
- **Grid & Rulers**: Optional alignment guides with toggle shortcuts (G, Ctrl+;)
- **Mobile Optimization**: Touch-friendly interface with haptic feedback and gesture support
- **Responsive Design**: Adaptive UI that works seamlessly on desktop, tablet, and mobile
- **Theme Support**: Dark/light mode with system preference detection and manual toggle

### 📱 Mobile Features
- **Touch-Optimized Interface**: Dedicated mobile tool panel with larger touch targets
- **Gesture Support**: Pinch-to-zoom, two-finger pan, and touch-specific interactions
- **Haptic Feedback**: Tactile responses for tool selection and interactions
- **Mobile Tool Categories**: Organized tools in tabs (Draw, Shapes, View) for better UX
- **Touch Action Prevention**: Prevents browser interference with drawing gestures

### 💾 Export & Import
- **Multiple Formats**: PNG, JPEG, SVG, PDF, JSON, and native .opendraw format
- **Export Options**: 
  - Selected shapes only or entire canvas
  - Background color control and transparency
  - Quality settings for JPEG exports
  - Custom resolution and dimensions
- **Native Format**: Full-fidelity .opendraw files for continued editing with complete shape data
- **Import Support**: Load .opendraw and .json files to continue working on saved drawings
- **Client-Side Processing**: Complete privacy with no server uploads - all processing in browser

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gitnaseem745/opendraw.git
   cd open-draw
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to start drawing!

## 🎮 Usage Guide

### Basic Drawing Workflow
1. **Select a tool** from the toolbar using mouse click or keyboard shortcuts
2. **Draw on canvas** by clicking and dragging to create shapes or freehand drawings
3. **Customize appearance** using color pickers and stroke width controls
4. **Select and modify** existing shapes with the selection tool (V)
5. **Export your work** using Ctrl+S or the export panel

### Advanced Operations
- **Multi-select**: Hold Ctrl while clicking shapes to select multiple objects
- **Group shapes**: Select multiple shapes and press Ctrl+G to group them
- **Duplicate shapes**: Press Ctrl+D to duplicate selected shapes with offset
- **Layer control**: Use Ctrl+] and Ctrl+[ to bring forward/send backward
- **Zoom controls**: Ctrl+Mouse wheel, +/- keys, or zoom buttons for navigation
- **Pan canvas**: Space+drag, middle mouse button, or dedicated pan tool (H)
- **Text editing**: Double-click text shapes or press T and click to add text
- **Precision erasing**: Use eraser tool (E) with visual indicator for targeted removal

### Comprehensive Keyboard Shortcuts

#### Tools
| Shortcut | Tool | Description |
|----------|------|-------------|
| `V` | Selection | Select, move, and resize shapes |
| `P` | Pencil | Freehand drawing |
| `L` | Line | Draw straight lines |
| `R` | Rectangle | Draw rectangles |
| `U` | Triangle | Draw triangles |
| `C` | Circle | Draw circles/ellipses |
| `D` | Diamond | Draw diamond shapes |
| `A` | Arrow | Draw arrows |
| `T` | Text | Add text annotations |
| `H` | Pan | Pan around the canvas |
| `E` | Eraser | Erase parts of drawings |
| `K` | Lock | Lock/unlock canvas |

#### View Controls
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+0` or `0` | Reset View | Reset zoom and pan to fit canvas |
| `G` | Toggle Grid | Show/hide alignment grid |
| `Ctrl+;` | Toggle Rulers | Show/hide measurement rulers |
| `+` or `=` | Zoom In | Increase canvas zoom level |
| `-` | Zoom Out | Decrease canvas zoom level |
| `Space+Drag` | Pan | Pan canvas while holding space |

#### Edit Operations
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Z` | Undo | Undo last action |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo | Redo undone action |
| `Ctrl+A` | Select All | Select all shapes on canvas |
| `Delete` or `Backspace` | Delete | Remove selected shapes |
| `Alt+Click` | Duplicate | Duplicate selected shapes |
| `Escape` | Deselect | Clear current selection |

#### Grouping & Layers
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+G` | Group | Group selected shapes |
| `Ctrl+Shift+G` | Ungroup | Ungroup selected shapes |
| `Ctrl+]` | Bring Forward | Move shapes forward in layer |
| `Ctrl+[` | Send Backward | Move shapes backward in layer |
| `Ctrl+Shift+]` | Bring to Front | Move shapes to top layer |
| `Ctrl+Shift+[` | Send to Back | Move shapes to bottom layer |

#### File Operations
| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+S` | Export | Open export dialog |
| `Ctrl+O` | Import | Open import dialog |
| `N` | New Canvas | Clear canvas (with confirmation) |

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **Framework**: Next.js 15.4.5 with App Router and React 19.1.0
- **Language**: TypeScript 5 with comprehensive type definitions
- **Styling**: Tailwind CSS 4 with dark/light theme support
- **State Management**: Zustand for efficient store management
- **Drawing Libraries**: 
  - RoughJS 4.6.6 for hand-drawn aesthetic shapes
  - Perfect-Freehand 1.2.2 for smooth pencil strokes
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React with consistent iconography
- **Animations**: Framer Motion 12.23.12 for smooth transitions
- **Theme System**: next-themes for seamless theme switching

### Project Structure
```
src/
├── app/                    # Next.js App Router (layout.tsx, page.tsx, globals.css)
├── components/             # React component library
│   ├── Canvas/            # Drawing canvas and optimization components
│   │   ├── DrawingCanvas.tsx      # Main canvas with event handling
│   │   └── OptimizedCanvas.tsx    # Performance-optimized rendering
│   ├── Tools/             # Tool panels and controls
│   │   ├── ToolPanel.tsx          # Desktop toolbar
│   │   ├── MobileToolPanel.tsx    # Touch-optimized mobile toolbar
│   │   ├── ExportPanel.tsx        # Export/import functionality
│   │   ├── StrokeControls.tsx     # Color and width controls
│   │   ├── ObjectControls.tsx     # Shape manipulation controls
│   │   ├── ViewControls.tsx       # Zoom, pan, grid controls
│   │   ├── UndoRedoButtons.tsx    # History navigation
│   │   └── ShapePropertiesSidebar.tsx # Dynamic shape editing
│   ├── TextEditor/        # Real-time text editing system
│   ├── layout/            # Application layout components
│   │   ├── MainMenu.tsx           # Application menu
│   │   └── ThemeProvider.tsx      # Theme context provider
│   ├── shared/            # Reusable UI components
│   │   ├── ColorPicker.tsx        # Color selection component
│   │   ├── ShortcutsButton.tsx    # Keyboard shortcuts help
│   │   └── ToolButton.tsx         # Reusable tool button
│   ├── status/            # Status and information display
│   │   └── StatusBar.tsx          # Canvas status and coordinates
│   ├── theme/             # Theme management
│   └── ui/                # Basic UI primitives
├── hooks/                 # Custom React hooks
│   ├── canvas/            # Canvas-specific functionality
│   │   ├── useCanvasEvents.ts     # Mouse/touch event handling
│   │   └── useCanvasRenderer.ts   # Optimized rendering logic
│   ├── common/            # Shared utility hooks
│   │   └── useThrottledCallback.ts # Performance optimization
│   └── input/             # Input handling and accessibility
│       ├── useKeyboard.ts         # Low-level keyboard events
│       ├── useKeyboardShortcuts.ts # Application shortcuts
│       ├── useMobileOptimization.ts # Touch and mobile features
│       ├── useTouchEvents.ts      # Touch gesture handling
│       └── useWheelEvents.ts      # Mouse wheel interactions
├── lib/                   # Utility libraries and helpers
│   ├── canvasUtils.ts             # Canvas drawing utilities
│   ├── create-shape.ts            # Shape creation logic
│   ├── draw-shape.ts              # Shape rendering functions
│   ├── eraser-new.ts              # Advanced eraser implementation
│   ├── exportUtils.ts             # Export/import functionality
│   ├── get-position.ts            # Position calculation utilities
│   └── utils.ts                   # General utility functions
├── store/                 # Zustand state management
│   ├── canvasStore.ts             # Canvas display and viewport state
│   ├── drawingStore.ts            # Shapes, tools, and drawing state
│   └── uiStore.ts                 # UI state and modal management
└── types/                 # TypeScript type definitions
    └── index.ts                   # Comprehensive type system
```

### Key Architectural Features

#### **Component Architecture**
- **Modular Design**: Components organized by feature and responsibility
- **Separation of Concerns**: Clear distinction between UI, logic, and state
- **Custom Hooks**: Canvas events, keyboard shortcuts, and mobile interactions
- **Performance Optimization**: Efficient rendering and minimal re-renders

#### **State Management**
- **Zustand Stores**: Lightweight, TypeScript-first state management
- **Store Separation**: Canvas, drawing, and UI state isolated for optimal performance
- **History System**: Comprehensive undo/redo with 30-step limit
- **Real-time Updates**: Immediate UI feedback for all user interactions

#### **Mobile Optimization**
- **Touch Events**: Comprehensive touch gesture support
- **Responsive Design**: Adaptive UI for all screen sizes
- **Performance**: Optimized rendering for mobile devices
- **Accessibility**: Touch-friendly targets and haptic feedback

#### **Export System**
- **Multiple Formats**: PNG, JPEG, SVG, PDF, JSON, and native .opendraw
- **Client-Side Processing**: No server dependencies for privacy
- **Quality Control**: Customizable export settings and resolution
- **Data Preservation**: Full-fidelity native format for editing workflows

## 🎨 Development & Building

### Development Commands
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint for code quality
npm run lint
```

### Code Quality & Standards
- **TypeScript**: Comprehensive type safety with strict mode
- **ESLint**: Code quality and consistency enforcement
- **Component Structure**: Modular, reusable, and well-documented components
- **Performance**: Optimized rendering with efficient state management
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

### Performance Optimizations
- **Canvas Rendering**: Efficient shape drawing with minimal redraws
- **Memory Management**: Proper cleanup and garbage collection
- **Touch Optimization**: Specialized mobile rendering pipeline
- **State Updates**: Minimized re-renders with targeted state changes
- **Export Processing**: Optimized for large canvases and many shapes

## 🤝 Contributing

We welcome contributions to Open Draw V1! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### Development Guidelines
1. **Code Style**: Follow existing TypeScript and React patterns
2. **Type Safety**: Add comprehensive TypeScript definitions for new features
3. **Documentation**: Update documentation for new functionality
4. **Testing**: Test changes thoroughly across different devices and browsers
5. **Performance**: Consider impact on canvas rendering and mobile performance

### Getting Started with Contributing
1. Fork the repository on GitHub
2. Create a feature branch from `main`
3. Make your changes with clear, descriptive commits
4. Test your changes thoroughly
5. Update documentation as needed
6. Submit a pull request with detailed description

### Areas for Contribution
- **New Tools**: Additional drawing tools and shape types
- **Export Formats**: Support for more file formats
- **Mobile UX**: Enhanced touch interactions and gestures
- **Performance**: Canvas optimization and rendering improvements
- **Accessibility**: Better screen reader and keyboard navigation support
- **Documentation**: Examples, tutorials, and API documentation

## 📦 Dependencies

### Production Dependencies
- **@radix-ui/react-dropdown-menu**: ^2.1.15 - Accessible dropdown components
- **clsx**: ^2.1.1 - Conditional CSS class management
- **framer-motion**: ^12.23.12 - Smooth animations and transitions
- **lucide-react**: ^0.535.0 - Beautiful, consistent icons
- **next**: 15.4.5 - React framework with App Router
- **next-themes**: ^0.4.6 - Theme switching functionality
- **perfect-freehand**: ^1.2.2 - Smooth freehand drawing
- **react**: 19.1.0 - UI library
- **react-dom**: 19.1.0 - React DOM renderer
- **roughjs**: ^4.6.6 - Hand-drawn style shapes
- **tailwind-merge**: ^3.3.1 - Tailwind CSS class merging
- **zustand**: ^5.0.7 - State management

### Development Dependencies
- **@eslint/eslintrc**: ^3 - ESLint configuration
- **@tailwindcss/postcss**: ^4 - Tailwind CSS processing
- **@types/node**: ^20 - Node.js type definitions
- **@types/react**: ^19 - React type definitions
- **@types/react-dom**: ^19 - React DOM type definitions
- **eslint**: ^9 - Code quality and consistency
- **eslint-config-next**: 15.4.5 - Next.js ESLint configuration
- **tailwindcss**: ^4 - Utility-first CSS framework
- **typescript**: ^5 - TypeScript compiler and language support

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### MIT License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability assumed

## 🙏 Acknowledgments & Credits

### Open Source Libraries
- **[RoughJS](https://roughjs.com/)** - Enables the beautiful hand-drawn aesthetic for shapes
- **[Perfect-Freehand](https://github.com/steveruizok/perfect-freehand)** - Powers smooth, natural freehand drawing
- **[Next.js](https://nextjs.org/)** - The fantastic React framework that powers the application
- **[Tailwind CSS](https://tailwindcss.com/)** - Enables rapid, consistent styling and theming
- **[Lucide](https://lucide.dev/)** - Provides beautiful, consistent iconography throughout the app
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight, powerful state management
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth, performant animations

### Inspiration
- **[Excalidraw](https://excalidraw.com/)** - Inspiration for hand-drawn aesthetics and UX patterns
- **[tldraw](https://tldraw.com/)** - Inspiration for canvas interactions and mobile optimization
- **[Figma](https://figma.com/)** - Inspiration for professional drawing tool interfaces

### Community
- **React Community** - For the incredible ecosystem and learning resources
- **Next.js Team** - For the outstanding framework and documentation
- **TypeScript Team** - For making JavaScript development more reliable and productive

## 📞 Support & Community

### Getting Help
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/Gitnaseem745/opendraw/issues)
- **Discussions**: Ask questions and share ideas in [GitHub Discussions](https://github.com/Gitnaseem745/opendraw/discussions)
- **Documentation**: Check the `/docs` folder for detailed guides and implementation notes

### Show Your Support
If you find Open Draw V1 helpful, please consider:
- ⭐ **Star the repository** on GitHub
- 🐛 **Report bugs** to help improve the application
- 💡 **Suggest features** for future development
- 🔄 **Share the project** with others who might find it useful
- 🤝 **Contribute code** to help make it even better

### Version Information
- **Current Version**: 1.0.0
- **Node.js**: Requires 18+
- **Browser Support**: Modern browsers with Canvas API support
- **Mobile Support**: iOS Safari 14+, Android Chrome 88+

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

*Open Draw V1 - Professional drawing tools in your browser*
