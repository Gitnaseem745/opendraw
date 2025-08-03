# Open Draw 🎨

A modern, feature-rich drawing application built with Next.js and TypeScript. Create, edit, and export your drawings with professional-grade tools and an intuitive interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)

## ✨ Features

### 🎯 Drawing Tools
- **Selection Tool**: Select, move, and resize shapes with precision
- **Pencil Tool**: Smooth freehand drawing with pressure-sensitive strokes
- **Shape Tools**: Line, rectangle, triangle, circle, diamond, and arrow
- **Text Tool**: Inline text editing with responsive positioning
- **Eraser Tool**: Precision erasing with visual feedback
- **Pan Tool**: Navigate large canvases with ease

### 🎨 Customization
- **Color Controls**: Stroke and fill colors with preset palettes
- **Stroke Width**: Adjustable line thickness for all tools
- **Multi-Selection**: Select and manipulate multiple shapes (Ctrl+Click)
- **Shape Grouping**: Group/ungroup shapes for complex compositions
- **Layer Management**: Bring forward/send backward controls

### 🔄 Advanced Features
- **Undo/Redo**: 30-step history with keyboard shortcuts (Ctrl+Z/Y)
- **Zoom & Pan**: Smooth canvas navigation with mouse wheel
- **Grid & Rulers**: Optional guides for precise alignment
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Theme Support**: Dark/light mode with system preference detection

### 💾 Export & Import
- **Multiple Formats**: PNG, JPEG, SVG, PDF, JSON, and native .opendraw
- **Export Options**: Selected shapes only, background control, quality settings
- **Native Format**: Full-fidelity saving for continued editing
- **Client-Side Processing**: No server uploads, complete privacy

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gitnaseem745/opendraw.git
   cd opendraw
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

## 🎮 Usage

### Basic Drawing
1. Select a tool from the toolbar (keyboard shortcuts: V, P, L, R, T, etc.)
2. Click and drag on the canvas to create shapes
3. Use the selection tool to move and resize existing shapes
4. Customize colors and stroke width in the controls panel

### Advanced Operations
- **Multi-select**: Hold Ctrl while clicking shapes
- **Group shapes**: Select multiple shapes and click the group button
- **Copy shapes**: Ctrl+D to duplicate selected shapes
- **Zoom**: Ctrl+Mouse wheel or use zoom buttons
- **Pan**: Space+drag, middle mouse, or pan tool

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `V` | Selection tool |
| `P` | Pencil tool |
| `L` | Line tool |
| `R` | Rectangle tool |
| `T` | Text tool |
| `H` | Pan tool |
| `E` | Eraser tool |
| `G` | Toggle grid |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+D` | Duplicate |
| `Ctrl+0` | Reset view |
| `Space+Drag` | Pan canvas |

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Drawing Libraries**: RoughJS, Perfect-Freehand
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Project Structure
```
src/
├── app/                    # Next.js app router
├── components/             # React components
│   ├── Canvas/            # Drawing canvas components
│   ├── Tools/             # Tool panels and controls
│   ├── TextEditor/        # Text editing component
│   ├── layout/            # Layout components
│   ├── shared/            # Reusable components
│   └── ui/                # Basic UI components
├── hooks/                 # Custom React hooks
│   ├── canvas/            # Canvas-specific hooks
│   ├── common/            # Shared hooks
│   └── input/             # Input handling hooks
├── lib/                   # Utility libraries
├── store/                 # Zustand stores
└── types/                 # TypeScript type definitions
```

### Key Components
- **DrawingCanvas**: Main canvas component with event handling
- **ToolPanel**: Comprehensive toolbar with all drawing tools
- **TextEditor**: Inline text editing with canvas integration
- **ExportPanel**: Multi-format export functionality
- **StrokeControls**: Color and width customization

## 🎨 Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Code Organization
- **Modular Architecture**: Components are organized by feature
- **Custom Hooks**: Canvas events, keyboard shortcuts, and interactions
- **Type Safety**: Comprehensive TypeScript definitions
- **Performance**: Optimized rendering and efficient state management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow the existing code style and TypeScript patterns
2. Add appropriate type definitions for new features
3. Update documentation for new functionality
4. Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RoughJS](https://roughjs.com/) for the hand-drawn aesthetic
- [Perfect-Freehand](https://github.com/steveruizok/perfect-freehand) for smooth drawing
- [Next.js](https://nextjs.org/) for the fantastic framework
- [Tailwind CSS](https://tailwindcss.com/) for rapid styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!

For questions or support, please open an issue on [GitHub](https://github.com/Gitnaseem745/opendraw/issues).

---

**Built with ❤️ using Next.js and TypeScript**
