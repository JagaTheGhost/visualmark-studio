# VisualMark Studio — Comprehensive Features & Capabilities Guide

> **The Modern Code + Visual Desktop IDE for Technical Documentation, Markdown Architecture, and Publishing Suites.**
<br>
<p align="center">
  <img src="frontend/src/assets/VisualMark Studio Banner.gif" width="100%" alt="VisualMark Studio Desktop IDE Showcase" style="border-radius: 12px; box-shadow: 0 16px 40px rgba(0,0,0,0.5);" />
</p>

---

## 📑 Table of Contents
<details>

- [1. Executive Overview & Design Philosophy](#1-executive-overview--design-philosophy)
- [2. Dual-Engine Editor & Workspace Architecture](#2-dual-engine-editor--workspace-architecture)
  - [2.1 Monaco Code Engine](#21-monaco-code-engine)
  - [2.2 Proportional Synchronized Split Preview](#22-proportional-synchronized-split-preview)
  - [2.3 Multi-Document Tab System & Hot-Exit Protection](#23-multi-document-tab-system--hot-exit-protection)
  - [2.4 Native Workspace Explorer & File Management](#24-native-workspace-explorer--file-management)
  - [2.5 Zen / Distraction-Free Mode](#25-zen--distraction-free-mode)
  - [2.6 Advanced Find & Replace](#26-advanced-find--replace)
- [3. Command Palette & Universal Shortcut Engine](#3-command-palette--universal-shortcut-engine)
  - [3.1 Quick Input Command Palette](#31-quick-input-command-palette)
  - [3.2 Interactive Keybinding Configuration (⚙️)](#32-interactive-keybinding-configuration-️)
  - [3.3 Centralized Keyboard Shortcuts Tab](#33-centralized-keyboard-shortcuts-tab)
- [4. The Specialized Visual Studio Suites](#4-the-specialized-visual-studio-suites)
  - [4.1 Shields.io Badges Studio (`badges.studio`)](#41-shieldsio-badges-studio-badgesstudio)
  - [4.2 Mermaid Architecture Studio (`diagrams.studio`)](#42-mermaid-architecture-studio-diagramsstudio)
  - [4.3 Visual Markdown Table Studio (`tables.studio`)](#43-visual-markdown-table-studio-tablesstudio)
  - [4.4 Code Snippets & GitHub Callouts Studio (`snippets.studio`)](#44-code-snippets--github-callouts-studio-snippetsstudio)
  - [4.5 Hero Images, Banners & Window Frames (`images.studio`)](#45-hero-images-banners--window-frames-imagesstudio)
  - [4.6 Directory Tree Studio (`tree.studio`)](#46-directory-tree-studio-treestudio)
  - [4.7 REST API & Endpoints Designer (`api.studio`)](#47-rest-api--endpoints-designer-apistudio)
  - [4.8 Contributors & Team Grid Studio (`contributors.studio`)](#48-contributors--team-grid-studio-contributorsstudio)
  - [4.9 Changelog & SemVer Release Studio (`changelog.studio`)](#49-changelog--semver-release-studio-changelogstudio)
  - [4.10 README Health Auditor & Linter (`audit.studio`)](#410-readme-health-auditor--linter-auditstudio)
  - [4.11 Vector Icons & Developer Emojis Studio (`icons.studio`)](#411-vector-icons--developer-emojis-studio-iconsstudio)
- [5. Automated Documentation Engine & Template Presets](#5-automated-documentation-engine--template-presets)
  - [5.1 Full Documentation Suite Generator](#51-full-documentation-suite-generator)
  - [5.2 Production Template Presets](#52-production-template-presets)
- [6. Integrated Diagnostics, Terminals & System Telemetry](#6-integrated-diagnostics-terminals--system-telemetry)
  - [6.1 VS Code Parity Bottom Panel Drawer](#61-vs-code-parity-bottom-panel-drawer)
  - [6.2 Integrated Terminal System (PowerShell / CMD)](#62-integrated-terminal-system-powershell--cmd)
  - [6.3 Markdown Diagnostics & Problems Drawer](#63-markdown-diagnostics--problems-drawer)
  - [6.4 System Output Stream](#64-system-output-stream)
  - [6.5 Dynamic Status Bar](#65-dynamic-status-bar)
  - [6.6 Notification Center & Toast Viewport](#66-notification-center--toast-viewport)
- [7. Export & Multi-Format Publishing Engine](#7-export--multi-format-publishing-engine)
- [8. Security, Privacy & Local-First Philosophy](#8-security-privacy--local-first-philosophy)
</details>
---

## 1. Executive Overview & Design Philosophy

Technical documentation is often fragmented across multiple disparate tools: developers draft Markdown in basic text editors, build architecture diagrams on third-party SaaS whiteboards, generate badges across browser tabs, construct Markdown tables in online converters, and manually stitch together release notes.

**VisualMark Studio** transforms documentation authoring into a unified, **native desktop IDE experience**. It marries the code-editing power of the **Monaco editor** (the core of VS Code) with **11 dedicated interactive visual studios**, direct local disk I/O, and an automated documentation engine.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          VISUALMARK STUDIO                             │
├───────────────────────────────────┬────────────────────────────────────┤
│         CODE WORKSPACE            │          VISUAL STUDIOS            │
│  • Monaco Engine (VS Code core)   │  • Shields.io Badge Designer       │
│  • Synchronized Split Preview     │  • Mermaid Architecture Studio     │
│  • Multi-Tab Document Buffers     │  • Visual Table Spreadsheet        │
│  • Direct Local Disk I/O          │  • Code Snippets & GitHub Alerts   │
│  • Live Workspace File Explorer   │  • Mockup Frames & Hero Banners    │
│  • In-Buffer Find & Replace       │  • Directory Tree Visualizer       │
│  • Distraction-Free Zen Mode      │  • REST API Route Designer         │
├───────────────────────────────────┴────────────────────────────────────┤
│                       PLATFORM INFRASTRUCTURE                          │
│  • Universal Command Palette (F1 / Ctrl+Shift+P) with Key Config (⚙️)  │
│  • Integrated Bottom Panel (Terminal, Markdown Problems, System Logs)  │
│  • Multi-Format Publisher (Native Disk, Vector PDF, HTML, ZIP Suite)   │
│  • 100% Local-First Engine (Zero telemetry, zero cloud dependency)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Dual-Engine Editor & Workspace Architecture

### 2.1 Monaco Code Engine
At the core of the editing canvas is Microsoft's **Monaco Editor**, delivering identical editing ergonomics to VS Code:
- **Syntax Highlighting**: Rich tokenization for Markdown, YAML frontmatter, inline code snippets, and embedded multi-language blocks (JavaScript, TypeScript, Python, Bash, Rust, Go, SQL, JSON, and HTML).
- **Multi-Cursor & Column Selection**: Full support for multi-caret editing via `Alt + Click`, line additions via `Ctrl + Alt + Up/Down`, and `Ctrl + F2` (`Change All Occurrences`).
- **Formatting & Beautification**: Automatic Markdown list re-numbering, table alignment, indentation preservation (`Shift + Alt + F`), and soft word-wrap toggle (`Alt + Z`).
- **Smart Completions**: Pre-configured completions for GitHub alert syntax (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`), Shields.io badge templates, and Mermaid diagram blocks.
- **Custom Native Themes**: Curated studio dark themes with harmonious syntax tokens, unobtrusive line highlighting, and smooth caret animation.

### 2.2 Proportional Synchronized Split Preview
VisualMark Studio features a synchronized side-by-side rendering engine:
- **Live Markdown Compilation**: Real-time rendering adhering strictly to GitHub Flavored Markdown (GFM) specifications.
- **Proportional Scroll Sync**: Bidirectional scroll synchronization ensures that scrolling either the Monaco editor or the preview keeps both viewports aligned to the identical line content.
- **Flexible View Modes**:
  - **Split View (`Ctrl+Shift+V`)**: 50/50 dual pane with draggable resize divider.
  - **Editor-Only**: Maximizes coding buffer for uninterrupted typing.
  - **Preview-Only**: Pure document presentation and review mode.
  - **Split Orientation**: Instant toggle between side-by-side vertical split and top-and-bottom horizontal split (`Ctrl+\`).

### 2.3 Multi-Document Tab System & Hot-Exit Protection
- **Simultaneous Document Buffers**: Open and work across multiple documentation files simultaneously (e.g., `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `LICENSE.md`, and Studio tabs).
- **Tab Reordering & Management**: Drag-and-drop tab reordering, middle-click to close, and instant untitled file creation (`Ctrl+N`).
- **Dirty Indicators & Hot-Exit**: Visual indicators highlight unsaved buffers. Automatic draft caching prevents data loss during sudden window closes or power failures.

### 2.4 Native Workspace Explorer & File Management
- **Local Directory Mounting**: Open any folder (`Ctrl+Shift+O`) to mount the entire repository.
- **Context Menu Operations**: Right-click any file or folder to:
  - Open in Editor
  - Rename with inline validation
  - Safe Delete with user confirmation
  - Copy Relative / Absolute Path
  - Reveal in Windows Explorer
- **Git Status Badges**: Live detection of modified (`M`), added (`U`), and untracked repository files.

### 2.5 Zen / Distraction-Free Mode
Toggle into **Zen Mode** (<kbd>F11</kbd>) to instantly hide the top menu bar, activity sidebar, tab bar, status bar, and bottom drawer. The editor transitions into a clean, centered typography canvas designed for deep writing focus.

### 2.6 Advanced Find & Replace
Integrated in-buffer search widget (<kbd>Ctrl+F</kbd> / <kbd>Ctrl+H</kbd>) with:
- Case sensitivity toggle (`Aa`)
- Whole word matching (`\b`)
- Regular expression support (`.*`)
- Live match counter and instant jump navigation (<kbd>Enter</kbd> / <kbd>Shift+Enter</kbd>)
- Replace Single and Replace All with atomic undo history.

---

## 3. Command Palette & Universal Shortcut Engine

### 3.1 Quick Input Command Palette
Accessible via universal hotkeys (<kbd>F1</kbd>, <kbd>Ctrl+Shift+P</kbd>, or <kbd>Ctrl+K</kbd>):
- **Instant Search**: Type commands with fuzzy filtering across all actions, studio tabs, layout toggles, and document operations.
- **Monaco Right-Click Interception**: Right-clicking in the editor and selecting **Command Palette** routes directly to VisualMark Studio's palette.
- **Standard Quick Input Styling**: Matches VS Code ergonomics with leading `>` prompt indicator and quick-action selection.

### 3.2 Interactive Keybinding Configuration (⚙️)
Every item in the Command Palette features a dedicated configuration mechanism (matching modern IDE workflows):
- **Gear Icon on Hover / Selection**: Hovering or highlighting any command reveals a `⚙ Configure Keybinding` button.
- **Alt + Enter Hotkey**: Pressing <kbd>Alt</kbd> + <kbd>Enter</kbd> on any highlighted command immediately launches configuration.
- **Deep-Linked Recorder**: Clicking `⚙` opens the **Keyboard Shortcuts** tab pre-filtered to that specific command and automatically pops open the Keybinding Recorder modal.

### 3.3 Centralized Keyboard Shortcuts Tab
The **Keyboard Shortcuts** tab (`shortcuts`) provides an interactive interface for viewing and modifying every IDE keybinding:
- **Search & Category Filtering**: Filter shortcuts by File, Edit, Navigation, View, Editor, Studio, or Action.
- **Interactive Keystroke Recorder**: Click any row or press Enter to capture your key combination (including modifiers like `Ctrl`, `Alt`, `Shift`, and `Meta`).
- **Conflict Detection**: Alerts when a recorded key combination conflicts with an existing assignment.
- **Reset to Defaults**: 1-click restore to reset all keybindings to factory defaults.
- **Live Global Synchronization**: All keybinding updates immediately reflect across application menus, tooltips, and the Command Palette.

---

## 4. The Specialized Visual Studio Suites

VisualMark Studio bundles 10 dedicated visual environments accessible as tabs:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        VISUALMARK STUDIO TABS                          │
├──────────────┬──────────────┬──────────────┬─────────────┬─────────────┤
│ 🛡️ Badges    │ 📊 Mermaid   │ 🧮 Tables    │ 🧩 Snippets │ 🖼️ Banners  │
├──────────────┼──────────────┼──────────────┼─────────────┼─────────────┤
│ 🌳 Tree      │ 🌐 REST API  │ 👥 Team      │ 📝 Releases │ 🔍 Auditor  │
└──────────────┴──────────────┴──────────────┴─────────────┴─────────────┘
```

### 4.1 Shields.io Badges Studio (`badges.studio`)
- **100+ Curated Tech Devicons**: Language, framework, database, cloud, and tool presets.
- **Custom Plate Customization**: Custom label text, message text, and independent color pickers for background, logo, and text.
- **Visual Styles**: Toggle between `for-the-badge`, `flat`, `flat-square`, `plastic`, and `social`.
- **1-Click Insertion & Export**: Copy Markdown syntax, direct HTML image tags, or download the raw SVG badge file.

### 4.2 Mermaid Architecture Studio (`diagrams.studio`)
- **Interactive Visual Editor**: Build system architecture diagrams, microservice maps, sequence diagrams, state machines, entity-relationship models, and Git graphs.
- **Live Preview & Validation**: Syntax error reporting with line-level hints.
- **High-Resolution Vector Export**: 1-click export to high-res SVG or 2x Retina PNG.
- **Interactive Canvas Navigation**: Full zoom, pan, and fit-to-screen controls.

### 4.3 Visual Markdown Table Studio (`tables.studio`)
- **Spreadsheet-Style Grid**: Add and remove rows and columns with point-and-click ease.
- **Column Alignment**: Configure per-column alignment (Left, Center, Right) with live Markdown delimiter rendering (`:---`, `:---:`, `---:`).
- **CSV Import & Export**: Import existing CSV files directly into the grid, or export tables back to CSV.
- **1-Click Markdown Injection**: Insert generated Markdown tables directly at your cursor in the active document buffer.

### 4.4 Code Snippets & GitHub Callouts Studio (`snippets.studio`)
- **GitHub Alert Callouts**: Visual builder for `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, and `[!CAUTION]` alert blocks.
- **Multi-Language Code Blocks**: Formats code snippets with language headers and copy buttons.
- **Collapsible `<details>` Sections**: Build expandable accordions for deep technical walkthroughs and changelog archives.
- **Shortcut Matrix Tables**: Visual generator for keyboard shortcut comparison tables.

### 4.5 Hero Images, Banners & Window Frames (`images.studio`)
- **Hero Header Banners**: Design gradient banners with custom titles, subtitles, and badges.
- **OS Screenshot Window Frames**: Wrap raw application screenshots in realistic macOS (traffic lights) or Windows 11 titlebar chrome with drop shadows.
- **Side-by-Side Comparison Grids**: Layout before/after or light/dark comparison images.
- **Asset Optimizer**: Automatically scale and compress images for GitHub repository rendering.

### 4.6 Directory Tree Studio (`tree.studio`)
- **Directory Structure Scanning**: Auto-scans the active workspace folder to generate real-time directory trees.
- **Multiple Visual Styles**:
  - Classic ASCII (`|--`, `\--`)
  - Modern Unicode box-drawing (`├──`, `└──`, `│`)
  - Emoji-annotated directory trees (📁, 📄, ⚙️)
- **Selective Depth & Exclusions**: Filter out `node_modules`, `.git`, `dist`, `__pycache__`, and configure maximum scan depth.

### 4.7 REST API & Endpoints Designer (`api.studio`)
- **Route Matrix**: Define endpoints with HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) with distinctive color badges.
- **Parameters & Request Bodies**: Visual tables for path parameters, query parameters, header requirements, and JSON request bodies.
- **Response Payloads**: Define 200 OK, 400 Bad Request, 401 Unauthorized, and 500 error schema mocks.
- **cURL Command Generator**: Automatically constructs ready-to-run `curl` commands for each endpoint.
- **Live Documentation Preview Engine**:
  - **Three View Modes**: Full-canvas `Live Preview`, synchronized `Split View` (form builder + live preview), and `Markdown & Code` raw syntax viewer.
  - **REST Blueprint Render**: Interactive Swagger-style card with method badges, parameter matrices, request bodies, and tabbed status responses.
  - **GitHub GFM Render**: Pixel-perfect rendering of the GitHub Markdown tables using `ReactMarkdown`.
  - **1-Click Insert**: Directly injects generated API specs into the active document buffer.

### 4.8 Contributors & Team Grid Studio (`contributors.studio`)
- **All-Contributors Standard**: Adheres to the official specification for open-source recognition.
- **Visual Avatar Matrix**: Input GitHub usernames to automatically fetch avatars and profile links.
- **Contribution Badges**: Assign roles (Code 💻, Docs 📖, Design 🎨, Maintenance 🚧, Bug Reports 🐛).
- **Responsive Table Generation**: Generates clean HTML/Markdown tables optimized for GitHub rendering.

### 4.9 Changelog & SemVer Release Studio (`changelog.studio`)
- **Keep-a-Changelog Standard**: Strictly implements standard changelog formatting (`[Unreleased]`, Version headers, Dates).
- **Category Badges**: Organized by `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, and `Security`.
- **SemVer Version Bumping**: 1-click version bumping for Major, Minor, and Patch releases.
- **Release Notes Exporter**: Extracts single-version release notes ready for GitHub Releases.

### 4.10 README Health Auditor & Linter (`audit.studio`)
- **Automated Scorecard & Letter Grade**: Scores your documentation from **A+ to F** based on completeness, structure, and readability.
- **Missing Section Detection**: Flags missing essential sections (License, Installation, Contributing, Prerequisites, Architecture, Testing).
- **1-Click Boilerplate Injection**: Injects missing section boilerplates directly into your document buffer with a single click.

### 4.11 Vector Icons & Developer Emojis Studio (`icons.studio`)
- **Dual-Mode Studio Workspace**: Dedicated clean partitioning between **Vector Material Icons (Material Symbols)** and **Developer Emojis**.
- **Vector Icon Color Customizer**: 9 curated theme swatches (Slate, Indigo, Emerald, Sky, Amber, Rose, Purple, GitHub Dark, GitHub Light), HTML5 native color wheel, and direct HEX code input with auto-formatting.
- **Live Catalog Tinting (`[x] Tint catalog preview`)**: Dynamically applies selected custom color in real time across the entire browsable vector icon catalog.
- **Dual-Flavor SVG Export Engine**:
  - **Colored SVG Asset Downloader**: Downloads `.svg` vector files with color baked into the vector shapes.
  - **Iconify Image Markdown Generator**: Generates remote `<img src="https://api.iconify.design/material-symbols:${icon}.svg?color=${hex}" ... />` syntax compatible with GitHub Markdown.
  - **Raw SVG Markup Copy**: One-click copying of optimized raw `<svg>` code.
  - **One-Click Insert into Active Document**: Injects formatted icon markup or native emoji shortcodes directly at the Monaco editor cursor position.
- **Monaco `:` Autocomplete Provider**: Typing `:` in the editor summons autocomplete suggestions for both Unicode emojis and Material vector icons.
- **Instant Search & Category Filtering**: Real-time filtering across categories (Actions, Navigation, Editor, Files & Code, Status & Alerts, Hardware & Dev, Communication, Shapes, etc.).

---

## 5. Automated Documentation Engine & Template Presets

### 5.1 Full Documentation Suite Generator
- **Multi-File Generation**: Generates comprehensive suites including:
  - `README.md` (Main project showcase)
  - `CONTRIBUTING.md` (Developer guidelines, branch strategy, PR workflow)
  - `CHANGELOG.md` (Version tracking)
  - `SECURITY.md` (Vulnerability reporting policy)
  - `CODE_OF_CONDUCT.md` (Contributor Covenant standard)
  - `LICENSE` (MIT, Apache 2.0, GPLv3, BSD)
- **Automatic Tech Stack Discovery**: Detects dependencies from `package.json`, `requirements.txt`, `Cargo.toml`, or `go.mod` and pre-populates relevant Shields.io badges.

### 5.2 Production Template Presets
Compare and load curated presets:
- **Full-Stack SaaS / Web Application**
- **CLI Utility / Developer Tool**
- **Python Data Science / ML Package**
- **RESTful API Service & Microservices**
- **Mobile Application (React Native / Flutter / Android)**
- **Open Source Library / SDK**

Each preset can be opened in comparison tabs to inspect and adopt best practices.

---

## 6. Integrated Diagnostics, Terminals & System Telemetry

### 6.1 VS Code Parity Bottom Panel Drawer
The bottom drawer provides an integrated workspace panel toggled via <kbd>Ctrl+`</kbd> or <kbd>Ctrl+J</kbd>:
- **Tabs**: `Terminal`, `Problems`, `Output`.
- **Panel Actions**: Minimize, Maximize / Full-Height, and Close buttons.
- **Height Resizing**: Drag the panel header border to smoothly adjust vertical space.

### 6.2 Integrated Terminal System (PowerShell / CMD)
- **Embedded Local Shells**: Native execution of PowerShell and Command Prompt directly inside the IDE.
- **Terminal Toolbar**:
  - `+` Add new terminal session
  - Dropdown terminal session switcher (`PowerShell 1`, `CMD 2`)
  - Clear terminal buffer (`trash` icon)
  - External Launch: 1-click button to launch an external OS terminal window or reveal folder in Explorer.
- **Workspace Anchoring**: Terminals automatically initialize within your mounted workspace root.

### 6.3 Markdown Diagnostics & Problems Drawer
- **Real-Time Linter**: Analyzes active buffers for Markdown issues:
  - Broken relative links and missing image targets
  - Unclosed code fences and malformed tables
  - Empty heading tags and skipped heading levels (e.g. `###` after `#`)
  - Trailing whitespace and missing blank lines around block elements
- **Click-to-Navigate**: Clicking any problem row instantly jumps the Monaco editor cursor to the exact line and column.

### 6.4 System Output Stream
- **Execution Log**: Live timestamped stream of IDE events, file save operations, sidecar negotiations, and Git actions.
- **Log Levels**: Filter output by `ALL`, `INFO`, `WARN`, `ERROR`, or `SYSTEM`.
- **Export & Clear**: 1-click export of system logs to file for troubleshooting.

### 6.5 Dynamic Status Bar
Located at the bottom of the IDE window:
- **Workspace Indicator**: Shows current folder name and Git branch.
- **Cursor Position**: Live line and column tracking (`Ln 42, Col 18`).
- **Document Statistics**: Live word count and estimated reading time.
- **Encoding & Indentation**: Displays active encoding (`UTF-8`) and tab size (`Spaces: 2`).
- **Language Mode**: Displays and switches document language mode.
- **Notification Trigger**: Displays bell icon with unread badge count.

### 6.6 Notification Center & Toast Viewport
- **Stacked Toast Viewport**: Smooth, non-blocking notification cards in the bottom-right corner.
- **Slide-Out Notification Drawer**: Click the bell icon to open the full history of alerts.
- **Severity Filtering**: Filter notifications by `All`, `Success`, `Info`, `Warning`, and `Error`.
- **Persistent Unread Counter**: Accurately tracks unread notifications.

---

## 7. Export & Multi-Format Publishing Engine

VisualMark Studio provides multiple publishing channels:

| Format | Mechanism | Use Case |
| :--- | :--- | :--- |
| **Native File Save** | `Ctrl + S` | Direct atomic disk write to active file |
| **Save As...** | `Ctrl + Shift + S` | Native OS file picker to export to any directory |
| **Vector PDF** | `Ctrl + P` | High-fidelity, GitHub-styled vector PDF document |
| **Standalone HTML** | Export Menu | Self-contained HTML file with bundled CSS and syntax highlighting |
| **Documentation ZIP** | Export Menu | Bundles all open documentation tabs into a `.zip` archive |
| **Clipboard** | `Ctrl + Shift + C` | Copies raw Markdown text directly to system clipboard |

---

## 8. Security, Privacy & Local-First Philosophy

- **100% Offline & Local-First**: VisualMark Studio does not transmit your documentation, source code, or file paths to any cloud server.
- **Direct Disk Ownership**: All files are stored directly on your local file system in standard, portable Markdown (`.md`) format.
- **Zero Tracking**: No telemetry, analytics beacons, or tracking scripts.
- **Open Source Foundation**: Built on audited, open-source technologies (Electron, Monaco, React, FastAPI, Mermaid.js).

---

*VisualMark Studio — Designed for engineers, technical writers, and open-source creators who demand professional documentation.*
