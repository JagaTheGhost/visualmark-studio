<p align="center">
  <img src="assets/logo.png" alt="VisualMark Studio Logo" width="128" style="border-radius: 28px;" />
</p>

<h1 align="center">VisualMark Studio</h1>

<p align="center">
  <b>The Code + Visual Desktop IDE for Markdown (.md), Architecture Diagrams, and Documentation Suites</b>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-6366f1.svg?style=for-the-badge" alt="Version" /></a>
  <a href="https://electronjs.org"><img src="https://img.shields.io/badge/Electron-44.7+-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" /></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
</p>

---

VisualMark Studio is a modern, high-performance **native desktop IDE** seamlessly marrying Monaco code editing with interactive visual studios. Built on **Electron**, **React**, and an embedded **FastAPI sidecar engine**, it operates 100% locally with direct disk I/O, frameless Obsidian dark styling, native terminal integration, and deep repository inspection.

## ✨ Desktop IDE Features

- 🖥️ **Full Native Desktop Shell** - Frameless Antigravity title bar with native Windows window management (minimize, maximize, close), custom menus (File, Edit, Selection, View, Go, Run, Terminal, Help), and command palette (`Ctrl+K`).
- 📁 **Direct Disk I/O & Workspaces** - Open files (`Ctrl+O`), open project directories (`Ctrl+Shift+O`), save directly to disk (`Ctrl+S`), and save copies (`Ctrl+Shift+S`) via native OS file dialogs without browser download workarounds.
- ⚡ **Integrated Terminal Launcher** - Launch PowerShell, Command Prompt (cmd), or reveal folders in Windows Explorer directly from the IDE menus and Explorer context menu.
- 🌳 **Real-Time Workspace Explorer** - Live directory tree scanner with inline renaming, right-click context menu (Open, Rename, Safe Delete, Copy Path, Reveal in Explorer), drag-and-drop reorganization, and Git status badges.
- 🎨 **Visual Studio Suite** -
  - **Shields.io Badge Studio:** 100+ devicon presets, custom hex swatches, brand plates, and native vector SVG exports.
  - **Mermaid Diagram Studio:** Real-time visual architecture graphs, flowchart layouts, and 2x Retina PNG / SVG export.
  - **Table Studio:** Interactive matrix grid editor with 1-click Markdown generation.
  - **Snippet & Asset Studio:** Visual hero banner designer with direct disk export.
- 📑 **Multi-Tab Document Buffers** - Dynamic tab bar with untitled document creation, dirty indicator dots, undo/redo ring buffer (`Ctrl+Z` / `Ctrl+Y`), and find/replace widget (`Ctrl+F` / `Ctrl+H`).
- 🔒 **100% Local-First** - Runs entirely on your machine with zero cloud dependency or telemetry.

---

## 🏗️ Desktop Architecture

```
auto-readme-generator/
├── backend/
│   ├── app.py              # FastAPI sidecar application
│   ├── desktop_server.py   # Frozen desktop daemon entrypoint (dynamic --port negotiation)
│   ├── build_sidecar.py    # PyInstaller sidecar compilation script
│   ├── prompts.py          # Deterministic template & documentation engine
│   └── tests/              # Backend pytest test suite (11 test suites)
├── frontend/
│   ├── electron/
│   │   ├── main.cjs        # Electron main process (safe execFile git, port detection, IPC)
│   │   └── preload.cjs     # Context bridge (file dialogs, terminals, disk I/O)
│   ├── src/
│   │   ├── components/     # TopMenuBar, IdeExplorerTree, TabBar, Preview, Studios
│   │   ├── data/           # Preset templates, badge studio static packs
│   │   ├── hooks/          # Custom hooks (useEditorPreferences, useBottomPanel)
│   │   ├── styles/         # Modular CSS (tokens, layout, sidebar, editor, explorer, studios)
│   │   ├── utils/          # Unified apiClient, documentExportUtils, repoCardSvgGenerators
│   │   ├── App.jsx         # Desktop workspace state & window orchestration
│   │   └── index.css       # Clean master CSS manifest
│   ├── scripts/            # manual-pack.ps1 (EPERM bypass packager)
│   ├── vite.config.js      # Optimized Rollup code-splitting & dynamic chunks
│   └── package.json        # Electron and frontend dependencies
├── DEPLOYMENT.md           # Standalone packaging & distribution guide
├── DESKTOP.md              # Desktop IDE architecture and technical specifications
├── SETUP.md                # Local development & testing setup guide
└── README.md               # Documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Python** 3.9+ (optional if using pre-compiled sidecar)

### Launch the Desktop IDE

```bash
cd frontend
npm install
npm start
# Concurrently launches Vite + Electron Desktop IDE window
```

---

## ⌨️ Desktop Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| **`Ctrl+S`** | **Save** | Directly writes content to the active file on disk |
| **`Ctrl+Shift+S`** | **Save As...** | Native OS Save dialog to write to a chosen file path |
| **`Ctrl+O`** | **Open File** | Native OS Open dialog to load any markdown document |
| **`Ctrl+Shift+O`** | **Open Folder** | Opens a local folder and populates the workspace tree |
| **`Ctrl+N`** | **New Document** | Creates an instant untitled buffer in the tab bar |
| **`Ctrl+K`** | **Command Palette** | Access studios, templates, and commands instantly |
| **`Ctrl+F`** | **Find** | Smooth in-buffer search widget |
| **`Ctrl+H`** | **Replace** | In-buffer find and replace widget |
| **`Ctrl+Z`** | **Undo** | Undo editor changes via local history buffer |
| **`Ctrl+Y`** | **Redo** | Redo editor changes |
| **`Ctrl+B`** | **Toggle Drawer** | Toggle the primary activity drawer |
| **`Ctrl+` `** | **PowerShell** | Open external PowerShell terminal in workspace folder |
| **`Ctrl+Shift+I`** | **DevTools** | Toggle Electron Developer Tools |
| **`Ctrl+R`** | **Reload Window** | Reload the IDE window |
| **`F11`** | **Zen Mode** | Toggle distraction-free full-screen editor |

---

## 📦 Building Standalone Distribution Packages

To generate a standalone Windows installer or portable `.exe` that runs without requiring Node.js or Python:

```bash
# 1. Compile the Python sidecar daemon
cd backend
python build_sidecar.py

# 2. Package the Electron executable
cd frontend
npm run electron:portable   # Builds portable .exe
npm run electron:dist       # Builds full NSIS installer
```

Binaries are output to `frontend/release/`.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
