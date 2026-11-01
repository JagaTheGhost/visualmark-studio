# VisualMark Studio - Electron Desktop Edition

VisualMark Studio is a **native Code + Visual desktop IDE** (modeled after VS Code and Antigravity IDE) tailored for Markdown authoring, using **Electron** and a **standalone Python FastAPI sidecar**.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   VisualMark Studio Desktop Window               │
│                                                                  │
│  [✦ VisualMark Studio]  [File ▾]   [⌘K Search]    [─] [□] [✕]    │
│  ├────────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │   React + Vite UI (Frameless Custom Titlebar & Studios)    │  │
│  │   - Direct Disk Read/Write (Ctrl+S, Ctrl+O)                │  │
│  │   - Local Folder Workspace Browser (Ctrl+Shift+O)          │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                │                                 │
│                         IPC Bridge                               │
│                                │                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │               Electron Main Process (Node.js)              │  │
│  │   - Native file dialogs & disk streaming                   │  │
│  │   - Window minimize / maximize / close                     │  │
│  │   - Sidecar process manager & lifecycle hooks              │  │
│  └────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┼─────────────────────────────────┘
                                 │ HTTP (http://127.0.0.1:8000..8030)
                                 │ Dynamic port negotiation & fallback
┌────────────────────────────────┴─────────────────────────────────┐
│            Standalone Python FastAPI Daemon (server.exe)         │
│  - Frozen via PyInstaller (runs without Python pre-installed)    │
│  - Conflict-resilient port binding (--port <activePort>)         │
│  - Deep AST scanning, multi-file suites & documentation AI       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Getting Started in Desktop Mode

### 1. Run in Development Mode
Launch both the Vite dev server and the Electron desktop window concurrently:

```bash
cd frontend
npm run electron:dev
```

If an existing Python daemon is already active, Electron validates its health; otherwise, Electron automatically detects an open port (8000–8030), spawns the Python sidecar daemon with `--port`, and communicates the active URL to the renderer via IPC (`get-backend-url`).

### 2. Run the Packaged Desktop App Locally
Test the production-built bundle directly inside Electron:

```bash
cd frontend
npm run electron:start
```

---

## Desktop Features & Keyboard Shortcuts

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| **`Ctrl+S`** / `⌘S` | **Save to Disk** | Writes directly to the open file on disk without prompting |
| **`Ctrl+Shift+S`** | **Save As...** | Opens the native OS save dialog to save to a new file |
| **`Ctrl+O`** / `⌘O` | **Open File** | Opens a local `.md` file from your hard drive |
| **`Ctrl+Shift+O`** | **Open Folder** | Opens a local project folder and loads markdown files into workspace |
| **`Ctrl+K`** / `⌘K` | **Command Palette** | Access all studios, templates, and commands instantly |
| **`Ctrl+B`** / `⌘B` | **Toggle Drawer** | Collapse or expand the activity panel |
| **`Ctrl+Enter`** | **Generate Docs** | Triggers AI generation pipeline |

---

## Building the Standalone Executable (Distribution for Testers)

### Step 1: Build the Standalone Python Sidecar
Compiles the FastAPI server into a frozen `server.exe` inside `frontend/resources/backend-sidecar/`:

```bash
# From project root:
cd backend
python build_sidecar.py

# Or via npm script:
cd frontend
npm run sidecar:build
```

### Step 2: Package Desktop Executables

Package for Windows, Linux, or macOS:

```bash
cd frontend

# Build for current OS:
npm run electron:dist

# Or target specific operating systems:
npm run electron:dist:win    # Windows Setup Installer (VisualMark-Studio-Setup.exe)
npm run electron:dist:linux  # Linux AppImage & Debian package
npm run electron:dist:mac    # macOS DMG & Zip (Apple Silicon & Intel)
```

Users get a streamlined desktop installer with Start Menu/Desktop shortcuts, native file associations (`.md`), and automated updates.
