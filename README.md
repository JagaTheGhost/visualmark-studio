<p align="center">
  <img src="frontend/src/assets/logo.png" width="128" style="border-radius: 28px;" alt="VisualMark Studio Logo" />
</p>

<h1 align="center">VisualMark Studio</h1>

<p align="center">
  <b>The Code + Visual Desktop IDE for Technical Documentation, Markdown Architecture, and Publishing Suites</b>
</p>

<p align="center">
  <a href="https://github.com/JagaTheGhost/visualmark-studio/releases/latest"><img src="https://img.shields.io/badge/version-1.1.4-6366f1.svg?style=for-the-badge" alt="Version 1.1.4" /></a>
  <a href="https://github.com/JagaTheGhost/visualmark-studio/releases/latest"><img src="https://img.shields.io/badge/Download-Windows_.exe-22c55e?style=for-the-badge&logo=windows&logoColor=white" alt="Download Windows" /></a>
  <a href="https://electronjs.org"><img src="https://img.shields.io/badge/Electron-44.7+-47848F?style=for-the-badge&logo=electron&logoColor=white" alt="Electron" /></a>
  <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" /></a>
</p>

<p align="center">
  <img src="frontend/src/assets/VisualMark Studio Banner.gif" width="100%" alt="VisualMark Studio Desktop IDE Showcase" style="border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.5);" />
</p>

---

## ⚡ The Unified Documentation Experience

Writing technical documentation is notoriously fragmented across disconnected browser tabs: drafting Markdown in basic text boxes, generating badges on web forms, drawing architecture diagrams on third-party whiteboards, building tables in online converters, and manually tracking release notes.

**VisualMark Studio** unites all of this under a single, **100% offline native desktop IDE**. It pairs the industry-standard **Monaco code editor** (the engine powering VS Code) with **12 specialized interactive visual studios**, direct local disk I/O, rich documentation architecture tools, and automated documentation generation.

| Traditional Documentation Workflow | The VisualMark Studio Experience |
| :--- | :--- |
| ❌ Jumping across 6+ web tabs to build badges, diagrams, and tables | ✅ **12 Integrated Visual Studios** right in the IDE workspace |
| ❌ Generic web textareas with no multi-cursor or formatting | ✅ **Full Monaco Engine** with GFM syntax, multi-cursor, and hotkeys |
| ❌ Manual formatting and hunting for syntax callouts | ✅ **Floating Selection HUD Toolbar** with live headings, callouts, and code fences |
| ❌ Manual copy-pasting into local repositories | ✅ **Direct Local Disk I/O** (`Ctrl+S`, `Ctrl+O`) and real-time File Explorer |
| ❌ Blind guessing whether Markdown structure is complete | ✅ **README Auditor & Linter** with automated health scoring (A+ to F) |
| ❌ Cloud data leakage and external telemetry | ✅ **100% Local-First** with zero telemetry or network tracking |

---

## 💾 Download for Windows

Pre-compiled, standalone Windows binaries are available directly from the latest [GitHub Release](https://github.com/JagaTheGhost/visualmark-studio/releases/latest):

| Package | Format | Description | Direct Download |
| :--- | :--- | :--- | :--- |
| **Windows Installer** | `.exe` (NSIS) | Complete desktop installer with Start Menu, Desktop shortcut & Explorer integration | [Download Setup (.exe)](https://github.com/JagaTheGhost/visualmark-studio/releases/latest/download/VisualMark-Studio-Setup.exe) |
| **Windows Portable** | `.exe` (Standalone) | Zero-installation portable binary (runs from any folder or USB drive) | [Download Portable (.exe)](https://github.com/JagaTheGhost/visualmark-studio/releases/latest/download/VisualMark-Studio-Portable.exe) |

> [!NOTE]
> **Windows SmartScreen Notice**: Because VisualMark Studio is open-source and community-distributed, Windows SmartScreen may present an *"Unrecognized app"* prompt on initial launch. Click **More info → Run anyway** to proceed.

---

## 🎨 12 Specialized Visual Studio Suites

VisualMark Studio features dedicated, visual designer environments accessible as persistent IDE tabs:

| Studio | Tab ID | Capabilities |
| :--- | :--- | :--- |
| 🛡️ **Shields.io Badges** | `badges.studio` | 100+ Devicon tech presets, custom hex pickers, styles (`for-the-badge`, `flat`), SVG download |
| 💳 **GitHub Repo Cards** | `repocard.studio` | 100% client-side vector SVG repo cards, auto-adaptive dark/light themes, live GitHub sync, 4 layout templates |
| 📊 **Mermaid Architecture** | `diagrams.studio` | 7 visual builders (Flowchart, Sequence, ER Models, Class, State, Git, Mindmap), 8 high-DPI themes, Monaco tokenizer, pan/zoom canvas, blueprint presets, SVG/PNG export |
| 🧮 **Visual Tables** | `tables.studio` | Interactive spreadsheet grid, column alignment, CSV import/export, 1-click Markdown generation |
| 🧩 **Snippets & Callouts** | `snippets.studio` | GitHub alert callouts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`), collapsible `<details>`, shortcut tables |
| 🖼️ **Images & Banners** | `images.studio` | Gradient hero banners, motion heroes (GIF/MP4), macOS/Windows window frames, image optimization |
| 🌳 **Directory Trees** | `tree.studio` | Auto-scans workspace folders into ASCII, Unicode box-drawing, or Emoji visual directory trees |
| 🌐 **REST API & Endpoints** | `api.studio` | Live interactive preview (REST Blueprint card & GFM render), route matrix, request/response schemas, cURL commands |
| 🎨 **Icons & Emojis** | `icons.studio` | Dual-mode Material Symbols & developer emojis, color wheel customizer, live catalog tinting, colored SVG download & Iconify markdown |
| 👥 **Contributors & Team** | `contributors.studio` | All-Contributors standard grid, GitHub avatar auto-fetch, contribution role badges |
| 📝 **Changelog & Releases** | `changelog.studio` | Keep-a-Changelog standard release notes with SemVer bumping (`Major`, `Minor`, `Patch`) |
| 🔍 **README Auditor** | `audit.studio` | Documentation scorecard, A+ to F grade, section completeness check, 1-click boilerplate injector |

👉 **For an exhaustive top-to-bottom manual of all 12 studios, consult [FEATURES.md](FEATURES.md).**

---

## ✨ Core Desktop IDE Highlights

- 🖥️ **Monaco Editor Engine** — Multi-cursor editing, bracket matching, line numbers, soft word wrap toggle (`Alt+Z`), and full formatting.
- 🌐 **Comprehensive Internationalization (i18n)** — Full UI localized across 10 world languages (EN, ZH-CN, ES, JA, DE, FR, RU, HI, PT-BR, IT) with custom language pack import/export.
- 📑 **Chrome/Arc-Style Collapsible Tab Groups** — Workspace tab bar partitioning open documents and active studios into organized collapsible groups.
- 🏗️ **Universal StudioShell Workspace Container** — Standardized 2-pane resizable container across all 12 studios with persistent action bars and live code drawers.
- 🪄 **Floating Selection HUD Toolbar** — Notion/Word-style contextual quick-actions anchored to highlighted text (Headings, Code Fences, Links, Callouts, Lists).
- ⚡ **Synchronized Split Preview** — Live GFM compilation with proportional scroll synchronization between editor and preview panes.
- 🖼️ **Local Media Streaming** — Renders workspace relative images, SVGs, and videos directly in live preview with zero web servers.
- 🎯 **Universal Command Palette** — Quick input (`F1` / `Ctrl+Shift+P` / `Ctrl+K`) with live search and **`⚙ Configure Keybinding`** button on hover (or `Alt+Enter`) matching modern IDE workflows.
- ⌨️ **Keyboard Shortcuts Tab** — Deep-linked hotkey recorder modal to inspect, customize, and persist any keybinding across the IDE.
- 📁 **Native Disk I/O & Workspaces** — Mount local folders, save directly to disk (`Ctrl+S`), create untitled files (`Ctrl+N`), and manage files with live context menus.
- 💻 **Integrated Bottom Panel Drawer** — Full-featured bottom panel (`Ctrl+``) housing:
  - **Terminal**: Embedded PowerShell and Command Prompt shells with tabs, session management, and external launching.
  - **Problems**: Real-time Markdown linter catching broken links, malformed tables, and heading skips.
  - **Output**: Live system event logs with severity filtering and log export.
- 🌙 **Zen / Focus Mode** — Full-screen distraction-free typography canvas (`F11`).
- 📤 **Multi-Format Publishing** — Export directly to atomic disk files, GitHub-styled vector **PDF** (`Ctrl+P`), standalone **HTML**, or a complete documentation **ZIP** suite.

---

## 📚 Documentation Directory

| Document | Description |
| :--- | :--- |
| 📖 **[FEATURES.md](FEATURES.md)** | **Complete Capabilities Tour** — Master guide detailing all 12 studios, Monaco ergonomics, HUD toolbar, and workflows. |
| 📘 **[DOCUMENTATION.md](DOCUMENTATION.md)** | **System & Architecture Guide** — Exhaustive architectural breakdown, user flows, and backend FastAPI specifications. |
| 🛠️ **[SETUP.md](SETUP.md)** | **Developer Setup Guide** — Step-by-step instructions for running from source, prerequisites, and troubleshooting. |
| 📦 **[DEPLOYMENT.md](DEPLOYMENT.md)** | **Packaging & Distribution** — Instructions for building standalone installers (.exe / portable) via Electron Builder. |
| 🖥️ **[DESKTOP.md](DESKTOP.md)** | **Desktop Technical Architecture** — Electron main process, FastAPI sidecar daemon, and IPC context bridge specs. |
| 🎨 **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** | **Visual Design System** — Color tokens, typography, dark/light theme tokens, and component guidelines. |
| 🔒 **[SECURITY.md](SECURITY.md)** | **Security Policy** — SSRF protection, IPC isolation, and vulnerability disclosure policies. |
| 🧪 **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | **Quality & Test Automation** — Unit tests, integration suites, and manual verification protocols. |
| 📋 **[CHANGELOG.md](CHANGELOG.md)** | **Version Changelog** — Detailed version history adhering to Keep a Changelog and SemVer standards. |

---

## ⌨️ Essential Keyboard Shortcuts

| Shortcut | Command | Action |
| :--- | :--- | :--- |
| **`F1`** / **`Ctrl + Shift + P`** | **Command Palette** | Open quick command palette with `⚙` keybinding configuration |
| **`Ctrl + S`** | **Quick Save** | Directly write active document buffer to disk |
| **`Ctrl + Shift + S`** | **Save As...** | Native OS Save dialog to export to a chosen path |
| **`Ctrl + O`** | **Open File...** | Open native file picker for Markdown / text files |
| **`Ctrl + Shift + O`** | **Open Folder...** | Mount local repository folder into Workspace Explorer |
| **`Ctrl + N`** | **New Document** | Open an instant untitled document buffer |
| **`Ctrl + Shift + V`** | **Toggle View** | Cycle between Split View, Editor-Only, and Preview-Only |
| **`Ctrl + \`** | **Split Orientation** | Toggle side-by-side vertical split vs top-and-bottom horizontal split |
| **`Ctrl + B`** | **Toggle Sidebar** | Expand or collapse the primary activity drawer |
| **`Ctrl + ` `** | **Toggle Terminal** | Open or close the integrated bottom panel drawer |
| **`Ctrl + /`** | **Shortcuts Tab** | Open the interactive Keyboard Shortcuts configuration tab |
| **`Ctrl + P`** | **Export PDF** | Generate high-fidelity GitHub-styled vector PDF |
| **`F11`** | **Zen Mode** | Distraction-free full-screen writing canvas |
| **`Ctrl + Alt + Up/Down`** | **Add Cursor** | Insert additional caret on the line above/below |
| **`Ctrl + F2`** | **Change All** | Select all occurrences of current word for multi-cursor editing |

---

## 🏗️ Desktop Architecture

```
visualmark-studio/
├── backend/
│   ├── app.py              # FastAPI sidecar application
│   ├── desktop_server.py   # Frozen desktop daemon entrypoint (dynamic port negotiation)
│   ├── build_sidecar.py    # PyInstaller sidecar compilation script
│   └── prompts.py          # Deterministic template & documentation engine
├── frontend/
│   ├── electron/
│   │   ├── main.cjs        # Electron main process (native IPC, window management, disk I/O)
│   │   └── preload.cjs     # Context bridge (file dialogs, native file operations, window controls)
│   ├── src/
│   │   ├── components/     # TopMenuBar, MonacoEditorPane, TabBar, Studios, BottomPanel
│   │   ├── data/           # Preset templates, badge packs, devicon maps, release notes
│   │   ├── styles/         # Modular CSS (tokens, layout, monaco, modals, studios)
│   │   ├── utils/          # keybindingManager, apiClient, documentExportUtils
│   │   └── App.jsx         # Workspace state orchestrator & lifecycle manager
│   └── package.json        # Electron & frontend build manifest
├── FEATURES.md             # Exhaustive top-to-bottom capabilities & features guide
├── SETUP.md                # Local development & setup instructions
├── TESTING_GUIDE.md        # Comprehensive manual & automated testing guide
├── DEPLOYMENT.md           # Standalone packaging & release build guide
└── README.md               # Master project showcase
```

---

## 🤝 Contributing & Community

VisualMark Studio thrives on open-source community contributions! Whether you're reporting a bug, proposing a new visual studio, or polishing documentation, we welcome your involvement.

- **[Contributing Guide](CONTRIBUTING.md)**: Development setup, branch conventions, and PR workflow.
- **[Code of Conduct](CODE_OF_CONDUCT.md)**: Community standards and pledge.
- **[Security Policy](SECURITY.md)**: Vulnerability disclosure and reporting guidelines.
- **[Changelog](CHANGELOG.md)**: Release history and version notes.
- **[Documentation & Guides](DOCUMENTATION.md)**: Comprehensive architectural and user manuals.

---

## 📄 License

VisualMark Studio is open-source software licensed under the **[MIT License](LICENSE)**.
