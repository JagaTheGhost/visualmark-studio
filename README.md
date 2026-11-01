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

## ΓÜí The Unified Documentation Experience

Writing technical documentation is notoriously fragmented across disconnected browser tabs: drafting Markdown in basic text boxes, generating badges on web forms, drawing architecture diagrams on third-party whiteboards, building tables in online converters, and manually tracking release notes.

**VisualMark Studio** unites all of this under a dedicated, **local-first desktop IDE**. It pairs the industry-standard **Monaco code editor** (the engine powering VS Code) with **12 specialized interactive visual studios**, direct local disk I/O, rich documentation architecture tools, and automated documentation generation.

| Traditional Documentation Workflow | The VisualMark Studio Experience |
| :--- | :--- |
| Γ¥î Jumping across 6+ web tabs to build badges, diagrams, and tables | Γ£à **12 Integrated Visual Studios** right in the IDE workspace |
| Γ¥î Generic web textareas with no multi-cursor or formatting | Γ£à **Full Monaco Engine** with GFM syntax, multi-cursor, and hotkeys |
| Γ¥î Manual formatting and hunting for syntax callouts | Γ£à **Floating Selection HUD Toolbar** with live headings, callouts, and code fences |
| Γ¥î Manual copy-pasting into local repositories | Γ£à **Direct Local Disk I/O** (`Ctrl+S`, `Ctrl+O`) and real-time File Explorer |
| Γ¥î Blind guessing whether Markdown structure is complete | Γ£à **README Auditor & Linter** with automated health scoring (A+ to F) |
| Γ¥î Cloud data leakage and external telemetry | Γ£à **Local-First & Private** with zero background tracking or telemetry |

---

## ≡ƒÆ╛ Download VisualMark Studio Desktop

Pre-compiled, standalone desktop binaries are available directly from the latest [GitHub Release](https://github.com/JagaTheGhost/visualmark-studio/releases/latest):

| Operating System | Package | Description | Direct Download |
| :--- | :--- | :--- | :--- |
| **Windows** | `.exe` (NSIS Setup) | Complete desktop installer with Start Menu, Desktop shortcuts, auto-updates & Explorer integration | [Download Setup (.exe)](https://github.com/JagaTheGhost/visualmark-studio/releases/latest/download/VisualMark-Studio-Setup.exe) |
| **Linux** | `.AppImage` / `.deb` | Universal AppImage (plug-and-play) & Debian/Ubuntu `.deb` package | [Download Linux Packages](https://github.com/JagaTheGhost/visualmark-studio/releases/latest) |
| **macOS** | `.dmg` (Apple Silicon & Intel) | Drag-and-drop installer for macOS (`arm64` Apple Silicon & `x64` Intel) | [Download macOS DMG](https://github.com/JagaTheGhost/visualmark-studio/releases/latest) |

> [!NOTE]
> **Windows SmartScreen & macOS Gatekeeper Notice**: 
> - **Windows**: Click **More info ΓåÆ Run anyway** if prompted by SmartScreen on initial launch.
> - **macOS**: Right-click the app in `/Applications` ΓåÆ select **Open** (or run `xattr -cr /Applications/VisualMark\ Studio.app` in Terminal) to approve the open-source binary.

---

## ≡ƒÆí Why a Dedicated IDE instead of a VS Code Extension?

Developers often ask: *"Why download a standalone desktop app when I can install an extension in my existing editor?"*

1. ≡ƒÄ¿ **Visual Design Studios vs. Plain Text**: VS Code Markdown extensions only preview raw text and basic syntax. VisualMark Studio provides **12 bespoke interactive visual design studios** (live vector Repo Card designer, visual Devicon Badge builder, spreadsheet table grids, pan/zoom Mermaid architecture canvas, and marketing hero banners) that cannot run cleanly inside generic text editor tabs.
2. ≡ƒº░ **Zero Extension Sprawl & Conflict**: Replicating even half of these capabilities in general-purpose editors requires installing and configuring 8+ disparate extensions that conflict over keybindings, themes, webview resources, and command palettes. VisualMark Studio provides a cohesive, zero-config documentation environment out of the box.
3. ≡ƒ¢í∩╕Å **Hardened Sandboxed Workspace**: VS Code extensions run with full, unrestricted Node.js system privilegesΓÇöa frequent target for supply chain attacks. VisualMark Studio strictly confines file operations to your open workspace (`isPathWithinWorkspace`), sanitizes SVG and Markdown outputs with hardened DOMPurify allowlists, and enforces zero background telemetry.
4. ≡ƒÄ» **Context Separation & Focus**: When you write code, you need linters, compilers, and debuggers. When you write documentation, you need a creative studio tailored for storytelling, visual assets, and high-impact presentation.

---

## ≡ƒÄ¿ 12 Specialized Visual Studio Suites

VisualMark Studio features dedicated, visual designer environments accessible as persistent IDE tabs:

| Studio | Tab ID | Capabilities |
| :--- | :--- | :--- |
| ≡ƒ¢í∩╕Å **Shields.io Badges** | `badges.studio` | 100+ Devicon tech presets, custom hex pickers, styles (`for-the-badge`, `flat`), SVG download |
| ≡ƒÆ│ **GitHub Repo Cards** | `repocard.studio` | 100% client-side vector SVG repo cards, auto-adaptive dark/light themes, live GitHub sync, 4 layout templates |
| ≡ƒôè **Mermaid Architecture** | `diagrams.studio` | 7 visual builders (Flowchart, Sequence, ER Models, Class, State, Git, Mindmap), 8 high-DPI themes, Monaco tokenizer, pan/zoom canvas, blueprint presets, SVG/PNG export |
| ≡ƒº« **Visual Tables** | `tables.studio` | Interactive spreadsheet grid, column alignment, CSV import/export, 1-click Markdown generation |
| ≡ƒº⌐ **Snippets & Callouts** | `snippets.studio` | GitHub alert callouts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`), collapsible `<details>`, shortcut tables |
| ≡ƒû╝∩╕Å **Images & Banners** | `images.studio` | Gradient hero banners, motion heroes (GIF/MP4), macOS/Windows window frames, image optimization |
| ≡ƒî│ **Directory Trees** | `tree.studio` | Auto-scans workspace folders into ASCII, Unicode box-drawing, or Emoji visual directory trees |
| ≡ƒîÉ **REST API & Endpoints** | `api.studio` | Live interactive preview (REST Blueprint card & GFM render), route matrix, request/response schemas, cURL commands |
| ≡ƒÄ¿ **Icons & Emojis** | `icons.studio` | Dual-mode Material Symbols & developer emojis, color wheel customizer, live catalog tinting, colored SVG download & Iconify markdown |
| ≡ƒæÑ **Contributors & Team** | `contributors.studio` | All-Contributors standard grid, GitHub avatar auto-fetch, contribution role badges |
| ≡ƒô¥ **Changelog & Releases** | `changelog.studio` | Keep-a-Changelog standard release notes with SemVer bumping (`Major`, `Minor`, `Patch`) |
| ≡ƒöì **README Auditor** | `audit.studio` | Documentation scorecard, A+ to F grade, section completeness check, 1-click boilerplate injector |

≡ƒæë **For an exhaustive top-to-bottom manual of all 12 studios, consult [FEATURES.md](docs/FEATURES.md).**

---

## Γ£¿ Core Desktop IDE Highlights

- ≡ƒûÑ∩╕Å **Monaco Editor Engine** ΓÇö Multi-cursor editing, bracket matching, line numbers, soft word wrap toggle (`Alt+Z`), and full formatting.
- ≡ƒîÉ **Comprehensive Internationalization (i18n)** ΓÇö Full UI localized across 10 world languages (EN, ZH-CN, ES, JA, DE, FR, RU, HI, PT-BR, IT) with custom language pack import/export.
- ≡ƒôæ **Chrome/Arc-Style Collapsible Tab Groups** ΓÇö Workspace tab bar partitioning open documents and active studios into organized collapsible groups.
- ≡ƒÅù∩╕Å **Universal StudioShell Workspace Container** ΓÇö Standardized 2-pane resizable container across all 12 studios with persistent action bars and live code drawers.
- ≡ƒ¬ä **Floating Selection HUD Toolbar** ΓÇö Notion/Word-style contextual quick-actions anchored to highlighted text (Headings, Code Fences, Links, Callouts, Lists).
- ΓÜí **Synchronized Split Preview** ΓÇö Live GFM compilation with proportional scroll synchronization between editor and preview panes.
- ≡ƒû╝∩╕Å **Local Media Streaming** ΓÇö Renders workspace relative images, SVGs, and videos directly in live preview with zero web servers.
- ≡ƒÄ» **Universal Command Palette** ΓÇö Quick input (`F1` / `Ctrl+Shift+P` / `Ctrl+K`) with live search and **`ΓÜÖ Configure Keybinding`** button on hover (or `Alt+Enter`) matching modern IDE workflows.
- Γî¿∩╕Å **Keyboard Shortcuts Tab** ΓÇö Deep-linked hotkey recorder modal to inspect, customize, and persist any keybinding across the IDE.
- ≡ƒôü **Native Disk I/O & Workspaces** ΓÇö Mount local folders, save directly to disk (`Ctrl+S`), create untitled files (`Ctrl+N`), and manage files with live context menus.
- ≡ƒÆ╗ **Integrated Bottom Panel Drawer** ΓÇö Full-featured bottom panel (`Ctrl+``) housing:
  - **Terminal**: Embedded PowerShell and Command Prompt shells with tabs, session management, and external launching.
  - **Problems**: Real-time Markdown linter catching broken links, malformed tables, and heading skips.
  - **Output**: Live system event logs with severity filtering and log export.
- ≡ƒîÖ **Zen / Focus Mode** ΓÇö Full-screen distraction-free typography canvas (`F11`).
- ≡ƒôñ **Multi-Format Publishing** ΓÇö Export directly to atomic disk files, GitHub-styled vector **PDF** (`Ctrl+P`), standalone **HTML**, or a complete documentation **ZIP** suite.

---

## ≡ƒôÜ Documentation Directory

| Document | Description |
| :--- | :--- |
| ≡ƒôû **[FEATURES.md](docs/FEATURES.md)** | **Complete Capabilities Tour** ΓÇö Master guide detailing all 12 studios, Monaco ergonomics, HUD toolbar, and workflows. |
| ≡ƒôÿ **[DOCUMENTATION.md](docs/DOCUMENTATION.md)** | **System & Architecture Guide** ΓÇö Exhaustive architectural breakdown, user flows, and backend FastAPI specifications. |
| ≡ƒ¢á∩╕Å **[SETUP.md](docs/SETUP.md)** | **Developer Setup Guide** ΓÇö Step-by-step instructions for running from source, prerequisites, and troubleshooting. |
| ≡ƒôª **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** | **Packaging & Distribution** ΓÇö Instructions for building standalone installers (.exe / portable) via Electron Builder. |
| ≡ƒûÑ∩╕Å **[DESKTOP.md](docs/DESKTOP.md)** | **Desktop Technical Architecture** ΓÇö Electron main process, FastAPI sidecar daemon, and IPC context bridge specs. |
| ≡ƒÄ¿ **[DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)** | **Visual Design System** ΓÇö Color tokens, typography, dark/light theme tokens, and component guidelines. |
| ≡ƒöÆ **[SECURITY.md](SECURITY.md)** | **Security Policy** ΓÇö SSRF protection, IPC isolation, and vulnerability disclosure policies. |
| ≡ƒº¬ **[TESTING_GUIDE.md](docs/TESTING_GUIDE.md)** | **Quality & Test Automation** ΓÇö Unit tests, integration suites, and manual verification protocols. |
| ≡ƒôï **[CHANGELOG.md](CHANGELOG.md)** | **Version Changelog** ΓÇö Detailed version history adhering to Keep a Changelog and SemVer standards. |

---

## Γî¿∩╕Å Essential Keyboard Shortcuts

| Shortcut | Command | Action |
| :--- | :--- | :--- |
| **`F1`** / **`Ctrl + Shift + P`** | **Command Palette** | Open quick command palette with `ΓÜÖ` keybinding configuration |
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

## ≡ƒÅù∩╕Å Desktop Architecture

```
visualmark-studio/
Γö£ΓöÇΓöÇ backend/
Γöé   Γö£ΓöÇΓöÇ app.py              # FastAPI sidecar application
Γöé   Γö£ΓöÇΓöÇ desktop_server.py   # Frozen desktop daemon entrypoint (dynamic port negotiation)
Γöé   Γö£ΓöÇΓöÇ build_sidecar.py    # PyInstaller sidecar compilation script
Γöé   ΓööΓöÇΓöÇ prompts.py          # Deterministic template & documentation engine
Γö£ΓöÇΓöÇ frontend/
Γöé   Γö£ΓöÇΓöÇ electron/
Γöé   Γöé   Γö£ΓöÇΓöÇ main.cjs        # Electron main process (native IPC, window management, disk I/O)
Γöé   Γöé   ΓööΓöÇΓöÇ preload.cjs     # Context bridge (file dialogs, native file operations, window controls)
Γöé   Γö£ΓöÇΓöÇ src/
Γöé   Γöé   Γö£ΓöÇΓöÇ components/     # TopMenuBar, MonacoEditorPane, TabBar, Studios, BottomPanel
Γöé   Γöé   Γö£ΓöÇΓöÇ data/           # Preset templates, badge packs, devicon maps, release notes
Γöé   Γöé   Γö£ΓöÇΓöÇ styles/         # Modular CSS (tokens, layout, monaco, modals, studios)
Γöé   Γöé   Γö£ΓöÇΓöÇ utils/          # keybindingManager, apiClient, documentExportUtils
Γöé   Γöé   ΓööΓöÇΓöÇ App.jsx         # Workspace state orchestrator & lifecycle manager
Γöé   ΓööΓöÇΓöÇ package.json        # Electron & frontend build manifest
Γö£ΓöÇΓöÇ FEATURES.md             # Exhaustive top-to-bottom capabilities & features guide
Γö£ΓöÇΓöÇ SETUP.md                # Local development & setup instructions
Γö£ΓöÇΓöÇ TESTING_GUIDE.md        # Comprehensive manual & automated testing guide
Γö£ΓöÇΓöÇ DEPLOYMENT.md           # Standalone packaging & release build guide
ΓööΓöÇΓöÇ README.md               # Master project showcase
```

---

## ≡ƒñ¥ Contributing & Community

VisualMark Studio thrives on open-source community contributions! Whether you're reporting a bug, proposing a new visual studio, or polishing documentation, we welcome your involvement.

- **[Contributing Guide](CONTRIBUTING.md)**: Development setup, branch conventions, and PR workflow.
- **[Code of Conduct](CODE_OF_CONDUCT.md)**: Community standards and pledge.
- **[Security Policy](SECURITY.md)**: Vulnerability disclosure and reporting guidelines.
- **[Changelog](CHANGELOG.md)**: Release history and version notes.
- **[Documentation & Guides](DOCUMENTATION.md)**: Comprehensive architectural and user manuals.

---

## ≡ƒôä License

VisualMark Studio is open-source software licensed under the **[MIT License](LICENSE)**.
