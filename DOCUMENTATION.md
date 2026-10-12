# VisualMark Studio — Comprehensive System & Architecture Documentation

> **The Code + Visual Desktop IDE for Technical Documentation, Markdown Architecture, and Publishing Suites.**

---

## 📋 Table of Contents

1. [Product Overview](#1-product-overview)
2. [Desktop System Architecture](#2-desktop-system-architecture)
3. [Dual-Engine Monaco Code Workspace](#3-dual-engine-monaco-code-workspace)
4. [The 11 Specialized Visual Studio Suites](#4-the-11-specialized-visual-studio-suites)
5. [Contextual Floating Selection HUD Toolbar](#5-contextual-floating-selection-hud-toolbar)
6. [Universal Command Palette & Keybinding Engine](#6-universal-command-palette--keybinding-engine)
7. [Integrated Diagnostics, Terminals & System Telemetry](#7-integrated-diagnostics-terminals--system-telemetry)
8. [Publishing & Multi-Format Export Engine](#8-publishing--multi-format-export-engine)
9. [FastAPI Sidecar API Specification](#9-fastapi-sidecar-api-specification)
10. [Local Development & Packaging Lifecycle](#10-local-development--packaging-lifecycle)

---

## 1. Product Overview

### What is VisualMark Studio?

**VisualMark Studio** is a local-first, offline-capable desktop IDE engineered specifically for technical documentation, Markdown architecture, and multi-format publishing. It replaces disjointed web tools with a unified environment that pairs the **VS Code Monaco Editor** with **11 dedicated interactive visual studios**, native local filesystem I/O, embedded terminal sessions, and an automated documentation engine.

### Core Value Proposition

- **Unified Developer Tooling:** Draft Markdown code, design Mermaid architecture diagrams, build Shields.io badges, design vector repo cards, and preview REST API endpoints inside a single native desktop IDE.
- **100% Local-First & Private:** Direct disk read/write (`Ctrl+S`, `Ctrl+O`), offline sidecar daemon, and zero telemetry or external cloud dependencies.
- **Bi-Directional Ergonomics:** Visual designers generate clean, optimized GitHub-Flavored Markdown (GFM) that is injected directly into open document buffers at your exact cursor position.
- **Production Publishing:** One-click export to GitHub vector PDF (`Ctrl+P`), standalone styled HTML, and full documentation ZIP suites.

---

## 2. Desktop System Architecture

VisualMark Studio employs a three-tier local architecture: an **Electron Main Process**, a **React Renderer UI**, and an embedded **FastAPI Sidecar Daemon**.

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                       VISUALMARK STUDIO DESKTOP SHELL                        │
│                                                                               │
│  [✦ VisualMark Studio]  [File ▾]  [Edit ▾]  [Studios ▾]  [⌘K Search]  [─] [□] [✕]│
│  ├─────────────────────────────────────────────────────────────────────────┤  │
│  │                                                                         │  │
│  │   REACT 18 + VITE RENDERER (Frameless Obsidian Dark Theme)             │  │
│  │   • VS Code Monaco Editor Engine with Indentation Folding & Minimap     │  │
│  │   • Proportional Synchronized Split Preview Canvas                      │  │
│  │   • Floating Selection HUD Toolbar (Headings, Code, Callouts, Lists)     │  │
│  │   • 11 Specialized Visual Studios (Badges, Diagrams, APIs, Icons, etc.)  │  │
│  │   • Bottom Drawer: Terminals (PowerShell/CMD), Linter Problems, Output  │  │
│  │                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                      │                                        │
│                      ELECTRON IPC CONTEXT BRIDGE (preload.cjs)                 │
│                                      │                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                   ELECTRON MAIN PROCESS (main.cjs)                      │  │
│  │   • Native OS File Dialogs & Direct Disk I/O Streaming                  │  │
│  │   • Node.js node-pty / child_process Terminal Shell Spawning            │  │
│  │   • Window Framing, Fullscreen Zen Mode, Zoom & Window State Memory     │  │
│  │   • Sidecar Daemon Process Lifecycle & Port Management                  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬────────────────────────────────────────┘
                                       │ HTTP Loopback (127.0.0.1:8000..8030)
                                       │ Dynamic Port Negotiation
┌──────────────────────────────────────┴────────────────────────────────────────┐
│               STANDALONE FASTAPI SIDECAR DAEMON (server.exe)                  │
│   • Frozen via PyInstaller (Zero Python prerequisite on end-user machines)   │
│   • Deep Repository AST Scanning, Tech Stack Inference & Prompt Templates    │
│   • SSRF-Safe Image Resolver & Metadata Generator                             │
└───────────────────────────────────────────────────────────────────────────────┘
```

### IPC Bridge API Surface (`window.electronAPI`)

The React renderer communicates with native operating system primitives via secure context isolation:

| Channel | Method | Description |
| :--- | :--- | :--- |
| `openFileDialog` | `() => Promise<{ canceled, filePath, content }>` | Invokes OS file picker for `.md` / `.txt` files |
| `openFolderDialog` | `() => Promise<{ canceled, folderPath, files }>` | Mounts local repository and scans workspace tree |
| `saveDirectFile` | `(filePath, content) => Promise<{ success, error }>` | Writes document buffer directly to local disk |
| `saveFileDialog` | `(defaultName, content) => Promise<{ success, filePath }>` | Invokes native OS Save-As dialog |
| `getBackendUrl` | `() => Promise<string>` | Retrieves negotiated FastAPI sidecar localhost URL |
| `spawnTerminal` | `(sessionId, shellType, cwd) => void` | Spawns local PowerShell or CMD session |
| `getAppVersion` | `() => Promise<string>` | Retrieves application SemVer version string |

---

## 3. Dual-Engine Monaco Code Workspace

### Monaco Editor Engine

- **VS Code Core Parity:** Powered by `@monaco-editor/react` with indentation guides, code folding brackets, cursor animations, line numbers, and minimap.
- **Obsidian Dark & Slate Themes:** Curated typography and contrast levels engineered for hours of technical writing without eye strain.
- **Smart Markdown Completions:** Typing `:` triggers autocomplete for both Unicode emojis and Material vector icons; typing `[` triggers link and callout completion.
- **Multi-Cursor Ergonomics:** Add cursor above (`Ctrl+Alt+Up`), add cursor below (`Ctrl+Alt+Down`), select all occurrences (`Ctrl+F2`), format document (`Shift+Alt+F`), and toggle word wrap (`Alt+Z`).

### Synchronized Split Preview

- **Proportional Scroll Locking:** Synchronizes scroll offset between the Monaco line heights and the live rendered HTML preview elements via bidirectional anchor mapping.
- **Flexible Viewport Modes:** Cycle through side-by-side Split View, Editor-Only mode, and Preview-Only mode (`Ctrl+Shift+V`).
- **Orientation Toggle:** Switch between side-by-side vertical split and top-and-bottom horizontal split (`Ctrl+\`).

---

## 4. The 11 Specialized Visual Studio Suites

VisualMark Studio features 11 dedicated visual designer environments accessible via the Activity Bar, Studios menu, or Command Palette:

### 4.1 Shields.io Badges Studio (`badges.studio`)
- **100+ Technology Presets:** Pre-configured badges covering languages, frameworks, cloud providers, and databases.
- **Visual Styler:** Custom label, message, color picker, and official badge styles (`for-the-badge`, `flat`, `flat-square`, `plastic`, `social`).
- **1-Click Actions:** Insert into document buffer, copy raw Markdown image syntax, or download vector SVG.

### 4.2 Mermaid Architecture Studio (`diagrams.studio`)
- **15+ Diagram Topologies:** Architecture maps, flowcharts, sequence diagrams, state machines, entity relationship diagrams, class diagrams, Git graphs, and user journeys.
- **Live Vector Engine:** Real-time syntax validation, pan-and-zoom preview canvas, and instant syntax error line highlighting.
- **High-DPI Export:** Export directly as production-ready `.svg` or 2x resolution `.png` images.

### 4.3 Visual Markdown Table Studio (`tables.studio`)
- **Interactive Spreadsheet Grid:** Add, remove, and reorder rows and columns with click-to-edit cells.
- **Column Alignment Matrix:** Set left, center, or right alignment per column with visual preview.
- **CSV & JSON Import/Export:** Import existing spreadsheets or export tables to CSV and formatted GFM Markdown.

### 4.4 Code Snippets & GitHub Callouts Studio (`snippets.studio`)
- **GitHub Alert Callouts:** Standard callout generator for `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]`.
- **Collapsible `<details>` Blocks:** Interactive disclosure blocks with custom summaries for deep technical details and logs.
- **Multilingual Fences:** Syntax-highlighted code fences covering 30+ programming languages.

### 4.5 Hero Images, Banners & Window Frames (`images.studio`)
- **OS Window Frame Mockups:** Wrap screenshots in macOS dark/light titlebars with realistic traffic light buttons, or clean Windows 11 window frames.
- **Gradient Hero Banners:** Canvas-rendered hero banners with custom typography, radial glow accents, and aspect ratio controls.
- **Optimization:** Automatic image compression and local asset directory saving.

### 4.6 Directory Tree Studio (`tree.studio`)
- **Automated Workspace Scanning:** Reads mounted workspace folder and recursively builds directory trees.
- **Rendering Formats:** Classic ASCII (`|--`, `\--`), modern Unicode box-drawing (`├──`, `└──`), or Emoji-annotated directory trees.
- **Custom Exclusions:** Filter out `node_modules`, `.git`, `dist`, `__pycache__`, and configure maximum scan depth.

### 4.7 REST API & Endpoints Designer (`api.studio`)
- **Interactive Multi-Mode Preview:**
  - **Live Preview:** Full-width interactive documentation view.
  - **Split View:** Side-by-side builder on the left and live rendered spec on the right.
  - **Markdown & Code:** Raw GFM table and code view.
- **Dual Render Engines:**
  - **REST Blueprint:** Interactive Swagger-style card with color-coded HTTP method badges (GET, POST, PUT, DELETE, PATCH), parameters matrix, JSON request body viewer, and status response tabs (200 OK, 400 Bad Request, 500 Error).
  - **GitHub GFM Render:** Exact Markdown output rendered via `ReactMarkdown`.
- **cURL Command Generator:** Automatically constructs ready-to-run `curl` commands for each endpoint.

### 4.8 Vector Icons & Developer Emojis Studio (`icons.studio`)
- **Dual-Mode Partitioning:** Cleanly separates **Vector Material Icons (Material Symbols)** and **Developer Emojis**.
- **Vector Icon Color Customizer:** 9 curated theme swatches (Slate, Indigo, Emerald, Sky, Amber, Rose, Purple, GitHub Dark, GitHub Light), HTML5 color wheel, and direct HEX input.
- **Live Catalog Tinting:** Toggling `[x] Tint catalog preview` dynamically updates every icon card in the catalog with the selected custom color.
- **Dual-Flavor SVG Export Engine:** Download colored `.svg` vector files locally with baked fills, generate remote Iconify Markdown syntax (`<img src="https://api.iconify.design/material-symbols:...svg?color=..." />`), or copy raw SVG code.
- **Monaco Autocomplete Provider:** Triggering `:` in the editor provides inline suggestions for both emojis and Material vector icons.

### 4.9 Contributors & Team Grid Studio (`contributors.studio`)
- **All-Contributors Specification:** Standard open-source recognition format.
- **Avatar Auto-Fetch:** Enter GitHub usernames to fetch profile avatars and links automatically.
- **Contribution Badges:** Assign roles (Code 💻, Docs 📖, Design 🎨, Maintenance 🚧, Bug Reports 🐛).

### 4.10 Changelog & SemVer Release Studio (`changelog.studio`)
- **Keep-a-Changelog Standard:** Formats entries strictly under `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, and `Security`.
- **SemVer Version Bumping:** 1-click version bumping for Major, Minor, and Patch releases.
- **Release Notes Exporter:** Extracts single-version release notes ready for GitHub Releases.

### 4.11 README Health Auditor & Linter (`audit.studio`)
- **Automated Scorecard:** Evaluates documentation completeness from **A+ to F**.
- **Missing Section Detector:** Identifies missing essential sections (License, Installation, Architecture, Contributing).
- **1-Click Boilerplate Injector:** Injects missing section boilerplates directly into your document buffer.

---

## 5. Contextual Floating Selection HUD Toolbar

When highlighting text in the Monaco editor, a Word / Notion-style contextual HUD appears dynamically above the selection:

- **Focus-Retaining Ergonomics:** Uses `onMouseDown` event guards to prevent editor blur and preserve cursor selection.
- **Dynamic Viewport Placement:** Flips below the text selection if near the top viewport boundary.
- **Action Matrix:**
  - **Headings Dropdown:** Transform selection into H1, H2, H3, or H4.
  - **Code Fences Dropdown:** Wrap selection in language code blocks (JavaScript, TypeScript, Python, Bash, JSON, HTML, CSS, SQL).
  - **Hyperlink Modal:** Inline URL input to convert text to Markdown links (`[text](url)`).
  - **GitHub Callouts Dropdown:** Wrap text in `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, or `[!CAUTION]`.
  - **Quick Buttons:** Bold (`Ctrl+B`), Italic (`Ctrl+I`), Strikethrough, Inline Code, Unordered List, Numbered List, Task Checklist, Table, Badges, and Diagrams.
- **Settings Customization:** Fine-tune every tool in **Settings > Floating Toolbar** with instant localStorage persistence.

---

## 6. Universal Command Palette & Keybinding Engine

- **Quick Input Access:** Press `F1` or `Ctrl+Shift+P` (or `Ctrl+K`) to search any action, studio, or formatting tool.
- **Interactive Keybinding Configuration (⚙️):** Hover over any command row to click the settings gear or press `Alt+Enter` to configure its shortcut.
- **Deep-Linked Shortcuts Tab:** Automatically navigates to the Keyboard Shortcuts tab, pre-filters the command list, and opens the Keybinding Recorder modal.
- **Custom Shortcut Persistence:** Custom overrides are saved to `localStorage` and override default keybindings without conflicts.

---

## 7. Integrated Diagnostics, Terminals & System Telemetry

Access the integrated bottom panel drawer via `Ctrl+` ` ` or the Status Bar:

- **Integrated Terminals:** Embedded local **PowerShell** and **Command Prompt (CMD)** shells with multiple tab sessions, split views, and directory sync.
- **Markdown Problems Linter:** Real-time AST parser checking for broken links, malformed tables, unclosed fences, and heading level skips with click-to-line jumping.
- **System Telemetry Logs:** Timestamped event stream tracking file saves, daemon events, Git operations, and Electron lifecycle transitions.

---

## 8. Publishing & Multi-Format Export Engine

- **Direct Disk Saving:** Atomic file writes to disk with automatic UTF-8 encoding.
- **GitHub Vector PDF (`Ctrl+P`):** Generates print-perfect vector PDFs formatted with authentic GitHub documentation styles.
- **Standalone HTML:** Exports self-contained HTML documents with embedded CSS and syntax highlighting for offline sharing.
- **Full Documentation Suite ZIP:** Bundles `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, and assets into a single distributable `.zip` archive.

---

## 9. FastAPI Sidecar API Specification

The embedded FastAPI daemon runs on `http://127.0.0.1:<port>` (negotiated dynamically between 8000 and 8030).

### Endpoints

#### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "service": "README Studio API"
}
```

#### 2. Generate Documentation Suite
```http
POST /generate-readme
```
**Request Body:**
```json
{
  "repo_url": "https://github.com/username/project",
  "description": "Project description...",
  "tech_stack": ["React", "FastAPI", "Electron"],
  "generate_suite": true,
  "selected_documents": ["CONTRIBUTING.md", "SETUP.md", "ARCHITECTURE.md", "LICENSE"],
  "theme": "default",
  "github_token": null
}
```

#### 3. SSRF-Safe Image Resolver
```http
GET /resolve-image?url=<encoded_url>
```
Validates that target URLs resolve exclusively to public IP addresses (blocking private, loopback, link-local, and multicast addresses) and returns the direct image asset URL.

---

## 10. Local Development & Packaging Lifecycle

### Development Setup
```bash
# 1. Install frontend dependencies
cd frontend
npm install

# 2. Start desktop IDE in development mode
npm run electron:dev
```

### Packaging Windows Binaries
```bash
# Step 1: Compile the frozen Python sidecar
cd backend
python build_sidecar.py

# Step 2: Build the standalone installer & portable binary
cd ../frontend
npm run electron:dist
```
Generated artifacts in `frontend/release/`:
- `VisualMark-Studio-Setup.exe` (NSIS Installer)
- `VisualMark-Studio-Portable.exe` (Standalone Portable)
- `latest.yml` (Electron-updater metadata)
