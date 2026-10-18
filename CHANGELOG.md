# Changelog

All notable changes to **VisualMark Studio** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Release Notes Standard**: For every minor update (e.g. `v1.1.0`), comprehensive release notes are documented across explicit subsections:
> - **Added**: New visual studios, IDE features, tools, or integrations.
> - **Changed**: Existing functionality modifications, visual redesigns, or UX improvements.
> - **Fixed**: Bug fixes, stability patches, visual glitches, or error resolutions.
> - **Removed**: Deprecated assets, legacy APIs, or pruned UI elements.

---

## [1.1.2] - 2026-10-18

### Added
- **GitHub Repository Showcase Card Studio (`repocard.studio`)**:
  - Elevated Repo Card generator into a standalone, first-class visual studio tab.
  - **100% Client-Side Vector Engine**: Generates self-contained, high-DPI vector SVG repo cards with zero external API dependencies or rate limits.
  - **Auto-Adaptive Theming**: Dual dark and light auto-adaptive SVGs powered by `@media (prefers-color-scheme)` alongside handcrafted themes (Official GitHub Dark, GitHub Light, Obsidian Slate, Nord Frost, Dracula).
  - **4 Production Layout Templates**: Official Pin, Bento Telemetry, Language Distribution Ribbon, and Minimal Compact.
  - One-click copy Markdown snippet or download standalone `.svg` vector asset.
- **Comprehensive Internationalization (i18n) Engine**:
  - Native multi-language UI localization across 10 languages: English (`en`), Simplified Chinese (`zh-CN`), Spanish (`es`), Japanese (`ja`), German (`de`), French (`fr`), Russian (`ru`), Hindi (`hi`), Portuguese (Brazil) (`pt-BR`), and Italian (`it`).
  - Automatic detection of browser and system locale on launch.
  - **Status Bar Language Menu Popover**: Instant UI language switcher with flags, native names, and direct link to Settings.
  - **Extensible Language Packs**: Import and export custom community JSON language packs with live hot-reloading and persistent `localStorage` storage.
- **Document & Syntax Language Mode Switcher**:
  - Interactive Status Bar button and modal dialog (`LanguageModeModal`) supporting instant syntax highlighting switching across 30+ language modes (Markdown, MDX, LaTeX, Plain Text, Mermaid, HTML, CSS, JavaScript, TypeScript, Python, Rust, Go, and more).
  - Intelligent file-extension detection with manual override and quick search.
- **Chrome/Arc-Style Collapsible Tab Groups**:
  - Visual workspace tab bar partitioning separating open documents from active visual studios.
  - Accent-themed pill header chips with status dots, active item count badges, and smooth accordion collapse/expand transitions.
- **Motion Hero & Animated Media Studio**:
  - New Motion Hero generator (`MotionHeroForm.jsx`) supporting animated GIFs and MP4/WebM videos.
  - Wrap motion media in realistic macOS dark/light or Windows 11 browser and app window mockups.
  - Configurable autoplay, loop, mute, controls, glow accents, and custom browser URL bars.
- **Local Workspace Media Engine in Live Preview**:
  - Added `read-local-media` Electron IPC channel for streaming local workspace media files directly to the renderer.
  - Markdown Live Preview Pane and `MarkdownImage` now resolve and render relative local images, SVGs, and videos (`assets/*.svg`, `images/*.png`) with zero external servers.
- **Tactile Unsupported File Screen**:
  - Embedded canvas view for binary and unsupported file formats matching the WelcomeLauncher design system.
  - Displays file metadata, format icons, formatted byte sizes, and provides direct action buttons: Reveal in Explorer, Open in System Default App, Copy File Path, and Quick Studio Launchers.

### Changed
- **Universal StudioShell Workspace Container**:
  - Refactored all 12 visual studios to adopt the standardized `StudioShell` container architecture.
  - Smooth 2-pane resizable layout (left inspector form and right WYSIWYG canvas stage) with persistent splitter drag state.
  - Persistent universal action bar: `Insert into Document (Ctrl+Enter)`, `Copy Markdown`, `Reset`, and `Back to Readme`.
  - Preview stage background theme switcher: Dark, Midnight, Light, and Grid preview canvas backdrops.
  - Expandable live code drawer with character and line count telemetry.
- **Expanded Visual Studio Suite**: VisualMark Studio now features **12 specialized visual studios** (Badges, Repo Cards, Diagrams, Tables, Snippets, Images, Directory Trees, REST APIs, Contributors, Changelog, Health Auditor, Developer Icons & Emojis).

### Reliability & Performance
- **FastAPI Sidecar Process Resiliency**:
  - Sidecar daemon startup now polls health checks (`checkBackendHealth`) before accepting API requests.
  - Implemented clean process tree termination on Windows using `taskkill /pid ... /f /t` upon `before-quit` and `will-quit` to eliminate orphan background daemons.
  - Captured sidecar stdout/stderr streams for integrated diagnostic output.

---

## [1.1.1] - 2026-10-15

### Added
- **Integrated Diagnostics & Runtime Error Routing**:
  - Automatically redirected runtime error and warning notifications away from intrusive floating popup toasts and directly into the IDE **Problems** tab.
  - Redesigned `ProblemsTab` with category grouping (Markdown, Git, Workspace, Export), line/column or timestamp badges, and inline dismiss.
  - Status bar diagnostics badge counts now reflect merged markdown lint diagnostics and runtime errors with 1-click toggle.
- **Modernized Windows NSIS Installer**:
  - Streamlined installer flow by automatically bypassing the redundant "All users vs Only for me" choice and defaulting to per-user installation without UAC prompts.
  - Modern Slate-100 theme tint (`#F1F5F9`) with Slate-800 typography (`#1E293B`) softening harsh white backgrounds while preserving native Windows control rendering.
  - Custom high-resolution branded installer bitmaps (`installerSidebar.bmp`, `installerHeader.bmp`).
  - Enabled maximum 7-Zip LZMA2 compression (`compression: "maximum"`).
  - Windows App Paths registration for instant terminal/Run launch (`visualmark` and `vms`).
- **Cryptographic Release Verification**:
  - Automated SHA-256 checksum generation (`SHA256SUMS.txt`) embedded into CI/CD release workflow for verifiable release downloads.

### Changed
- **Embedded Canvas Welcome Launcher**:
  - Replaced the generic floating rectangular modal card with an embedded canvas layout that integrates seamlessly into the dark IDE editor background (`background: transparent`, zero artificial container borders).
  - **Engraved Background Typography**: Soft recessed and debossed text-shadows (`text-shadow: 0 1px 2px rgba(0,0,0,0.9)`) on headings, version badges, taglines, and shortcuts giving typography an authentic embedded canvas feel.
  - **Tactile Physical Depth Controls**:
    - Primary action cards (**Clone Repository** and **Open Folder...**) now feature genuine physical depth with multi-layered ambient drop shadows, crisp top-edge light-catch bevel highlights (`border-top: 1px solid rgba(255,255,255,0.18)`), deep bottom rim borders (`border-bottom: 2px solid rgba(0,0,0,0.75)`), directional surface gradients, and tactile mechanical press animations on `:active`.
    - Secondary action pills (`+ New File`, `Open File...`, `Doc Generator`) and recent workspace list items feature matching tactile depth.
    - Keyboard shortcut `<kbd>` badges styled as physical mechanical chiclet keycaps.

### Fixed
- **Explorer More Actions Dropdown CSS**: Fixed missing CSS rules for `.ide-dropdown-menu`, `.ide-dropdown-item`, and `.ide-dropdown-divider`, replacing unstyled browser-default white buttons with dark glassmorphic styling, glowing cyan icons, and danger hover states.
- **Context Menu Stacking**: Unified duplicate context menu definitions in `explorer.css` and elevated `z-index` to `99999` with backdrop blur.
- **Studio Tab Scroll Boundary**: Removed `e.preventDefault()` wheel event trap at scroll limits in `horizontalScrollHelper.js`, bounded flex column heights with `min-height: 0; height: 100%`, and mapped sidebar drawer class bindings to enable smooth trackpad and mouse wheel scrolling across all studios.

### Removed
- **Create Project Launcher Wizard**: Pruned the redundant "Create New Project" card and associated callbacks from `WelcomeLauncher.jsx`, `StudioWorkspaceRenderer.jsx`, and `App.jsx`, streamlining the launcher to direct workspace entry.

### Security
- **Electron IPC Hardening**:
  - Enforced explicit `--` delimiter before destination paths in `git clone` to prevent remote command-line argument injection.
  - Restricted `openExternal` strictly to valid `http:` and `https:` schemes.
  - Blocked execution of dangerous binary and script file types via `openPath`.
- **Preview Sanitization**: Audited and hardened DOMPurify configurations in `LivePreviewPane.jsx` and `MermaidRenderer.jsx` to neutralize XSS vectors.

---

## [1.1.0] - 2026-10-13

### Added
- **Icons & Emoji Studio (11th Specialized Visual Studio - `icons.studio`)**:
  - Dedicated visual studio tab accessible from Activity Bar, Studios menu, and Command Palette (`Ctrl+Shift+P`).
  - Distinct dual-mode interface cleanly separating **Vector Material Icons (Material Symbols)** and **Developer Emojis**.
  - **Vector Icon Color Customizer**: Integrated palette with 9 curated themes (Slate, Indigo, Emerald, Sky, Amber, Rose, Purple, GitHub Dark `#58a6ff`, GitHub Light `#24292f`), HTML5 color wheel picker, and direct HEX code input with auto-formatting.
  - **Live Catalog Tinting Toggle (`[x] Tint catalog preview`)**: Dynamically applies selected custom color in real time across the entire browsable vector icon catalog.
  - **Dual-Flavor SVG Export Engine**:
    - **Colored SVG Asset Downloader**: Automatically downloads `.svg` vector files locally with baked `fill` attributes.
    - **Iconify Image Markdown Generator**: Generates `<img src="https://api.iconify.design/material-symbols:${icon}.svg?color=${hex}" ... />` syntax compatible with GitHub Markdown, GitLab, and web previews.
    - **Raw SVG Markup Copy**: One-click copying of optimized raw `<svg>` code.
    - **One-Click Insert into Document**: Injects formatted icon markup or native emoji shortcodes directly at the Monaco editor cursor position.
  - **Monaco `:` Autocomplete Provider**: Typing `:` in the editor summons autocomplete suggestions for both Unicode emojis and Material vector icons.
  - **Instant Search & Category Filtering**: Real-time filtering across categories (Actions, Navigation, Editor, Files & Code, Status & Alerts, Hardware & Dev, Communication, Shapes, etc.).
- **API Studio Live Documentation Preview (`api.studio`)**:
  - Complete multi-mode interactive preview system built into the REST API builder.
  - **Three View Modes**:
    - **Live Preview**: Dedicated full-width interactive documentation rendering.
    - **Split View**: Side-by-side synchronized view with interactive form builder on the left and live documentation preview on the right.
    - **Markdown & Code**: Raw GitHub-flavored Markdown syntax viewer with quick copy and download.
  - **Two Interactive Render Styles**:
    - **REST Blueprint**: Modern interactive Swagger/Postman-style card featuring color-coded HTTP method badges (GET, POST, PUT, DELETE, PATCH), endpoint paths, headers, parameter matrix, request body payload viewer, and multi-status response tabs (200 OK, 400 Bad Request, 500 Server Error).
    - **GitHub GFM Render**: Pixel-perfect GitHub-flavored Markdown rendering powered by `ReactMarkdown`, displaying exactly how the documentation will render on GitHub repositories.
  - **Enhanced Presets Grid**: Pre-configured REST endpoints (Users API, Auth Tokens, Webhooks, Billing) with one-click form population.
- **Modular Floating Quick-Action Toolbar (HUD)**:
  - Word / Notion-style contextual HUD anchored dynamically above text selections in the Monaco editor.
  - Interactive dropdowns for Headings (H1–H4), Code Blocks (8 languages), Hyperlinks (with live inline URL input), GitHub Alert Callouts (`[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`, `[!CAUTION]`), and tools for Bold, Italic, Strikethrough, Inline Code, Lists, Tables, Diagrams, and Badges.
  - Preserves native Monaco Undo/Redo history via `editor.executeEdits` and prevents editor blur on click.
  - Dedicated Settings tab category with modular quick-action toggles ("Enable All", "Disable All", "Reset HUD Defaults") and live cross-component synchronization.
- **Modern GitHub Repo Cards Studio**:
  - Rebuilt from scratch with a guided 3-Step Inspector (Target & Sync -> Card Template -> Theme & Styling).
  - 100% client-side pure vector SVG engine with zero external API dependency.
  - Auto-adaptive `@media (prefers-color-scheme)` dark/light themes.
  - 4 vector templates: Official Pin, Linear Bento, Languages Stacked Bar, Minimal Compact.
  - Unified action bar for embedding self-hosted SVGs into `./assets/`, copying raw SVG, and downloading `.svg`.
- **Redesigned Patch Notes UI**:
  - Re-architected Release Notes tab into a responsive two-column layout featuring a SemVer version tree explorer, Google Font "Arimo" typography, and one-click "Copy Notes" markdown generator.
- **Fluid 30 FPS Animated Banner Asset**:
  - Replaced legacy showcase asset with a fluid 1200x600 30 FPS animated banner (`VisualMark Studio Banner.gif`) showcasing IDE workflows and visual studios.

### Changed
- **API Studio Layout Optimization**: Refined split view column proportion to 480px fixed builder column with fluid preview pane for optimal dual-column balance.
- **Studio Form Layout Constraints**: Added `overflow-x: hidden` to `.studio-form-column` across all visual studios to prevent unwanted horizontal jitter during modal switches.
- **API View Mode Controls**: Re-styled view mode selector (`Live Preview`, `Split View`, `Markdown & Code`) and render style toggles with responsive pill controls.

### Fixed
- **Iconify Material Symbol Underscore 404 Bug**: Resolved broken image links by automatically converting underscore ligature names (`bug_report`, `rocket_launch`, `check_circle`, `inventory_2`) to Iconify-compliant kebab-case (`bug-report`, `rocket-launch`, `check-circle`, `inventory-2`).
- **API Studio Preset Card Visuals**: Fixed unstyled white button background and text collision in API Studio preset cards by adding proper dark theme styles in `extendedStudios.css`.
- **Architecture Diagram Shape & Color Dots Overflow**: Fixed shape selector and color swatches clipping out of bounds in `DiagramStudioTab.jsx` by implementing responsive `flex-wrap` and gap alignment in `diagramStudio.css`.
- **Chromium Scrollbar White Corner Glitch**: Fixed solid white unstyled square appearing at the intersection of vertical and horizontal scrollbars in Chromium/Electron by styling `::-webkit-scrollbar-corner { background: transparent; }` in `tokens.css`.

### Removed
- Removed deprecated `VisualMark_Studio_IDE.gif` from `assets/` and `frontend/src/assets/`.
- Removed legacy unstyled UI button artifacts in API preset components.

---

## [1.0.3] - 2026-10-12

### Added
- **Command Palette Keybinding Configuration (⚙️)**: Every command row in the Command Palette now displays a settings gear icon on hover/selection to configure its shortcut directly. Pressing `Alt + Enter` on any highlighted item triggers the configuration flow (matching VS Code standard).
- **Monaco Right-Click & F1 Interception**: Intercepted Monaco's native `editor.action.quickCommand` so selecting "Command Palette" in the right-click menu or pressing `F1` / `Ctrl+Shift+P` directly launches VisualMark Studio's palette.
- **Deep-Linked Shortcuts Tab**: Triggering keybinding configuration automatically switches to the `Keyboard Shortcuts` tab, pre-filters the command list, and opens the interactive Keybinding Recorder modal.
- **Multi-Cursor & Formatting Editor Commands**:
  - `Add Cursor Above` (`Ctrl + Alt + Up`)
  - `Add Cursor Below` (`Ctrl + Alt + Down`)
  - `Change All Occurrences` (`Ctrl + F2`)
  - `Format Document` (`Shift + Alt + F`)
  - `Toggle Word Wrap` (`Alt + Z`)
- **Integrated Bottom Panel Drawer**:
  - Embedded **PowerShell** and **Command Prompt (cmd)** local terminals with session tabs, add/switch/clear controls, and external terminal launching.
  - **Problems & Diagnostics Panel**: Real-time Markdown syntax linter checking for broken links, unclosed fences, malformed tables, and heading skips with click-to-line jumping.
  - **System Output Panel**: Live timestamped telemetry log stream tracking IDE operations, file saves, and daemon events.
- **Top-to-Bottom Features Guide**: Added comprehensive [`FEATURES.md`](FEATURES.md) documenting all 10 visual studios, Monaco ergonomics, and workflows.

### Fixed
- **Startup Crash**: Resolved `ReferenceError: insertModalState is not defined` during root component mount.
- **Shortcuts Parameter Type Safety**: Resolved `TypeError: initialQuery.replace is not a function` in `ShortcutsTab.jsx` when invoked via click events.
- **Notification Theme & Counter**: Synchronized notification drawer dark mode with IDE chrome and corrected unread badge counter increment logic.
- **Monaco Script Loader CSP**: Fixed Content Security Policy restrictions on editor script injection.

---

## [1.0.2] - 2026-10-11

### Added
- **Live Auto-Update Download Progress**: Real-time progress bar displaying transfer speed (MB/s), downloaded megabytes, and completion percentage in the Status Bar.
- **Auto-Updater Diagnostic Alerts**: Instant error notifications and retry guidance upon network interruptions or download failures.

### Security
- **SSRF Defense**: Backend image proxy rejects private, loopback (`127.0.0.1`, `localhost`), link-local, and multicast IP addresses.
- **Strict Hostname Sanitization**: Frontend image URL utility enforces strict domain boundaries, blocking substring spoofing attacks.

---

## [1.0.1] - 2026-10-11

### Added
- **Empty Workspace Experience**: Added friendly "No Folder Opened" landing view with quick folder picker.
- **Security Policy & Automation**: Added `SECURITY.md`, CodeQL scanning workflow, and Dependabot automated updates.

### Fixed
- **Titlebar Logo**: Corrected application logo asset path under the Electron `file://` protocol.
- **Startup Workspace Leak**: Prevented packaged binary from defaulting to the app's installation folder on launch.

---

## [1.0.0] - 2026-10-10

### Added
- Initial public release of VisualMark Studio.
- Dual-engine Monaco editor with synchronized split preview.
- 10 Specialized Visual Studio tabs (Badges, Diagrams, Tables, Snippets, Images, Trees, APIs, Contributors, Changelogs, README Auditor).
- 100% offline, local-first desktop shell built with Electron and FastAPI sidecar.
- Windows NSIS installer and standalone portable `.exe` packages.
