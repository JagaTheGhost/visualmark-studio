# Changelog

All notable changes to **VisualMark Studio** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
