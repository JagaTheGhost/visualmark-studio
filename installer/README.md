# VisualMark Studio — Next-Gen Glassmorphic Windows Installer & Uninstaller Suite

A dedicated, ultra-modern Windows setup experience for **VisualMark Studio**, designed after Figma mockups with a sleek 2-column glassmorphic dark theme, strict single-logo branding, and zero Win32 legacy dialogs.

---

## 🌟 Why this Replaces Legacy NSIS

Standard NSIS installers are 1990s-era Win32 dialogs with pixelated scaling, rigid page limits, and zero visual harmony with modern dark-mode desktop IDEs.

### Architecture & Design Philosophy:
1. **2-Column Layout (Figma Aligned)**:
   - **Left Column**: Branded showcase featuring `logo.png`, app title (`VisualMark Studio`), and a dynamic step headline & description that smoothly updates as the user progresses.
   - **Right Column**: Frosted glass step card containing the current step contents and standard navigation buttons (**Cancel**, **Back**, **Next** / **Install** / **Launch**).
2. **Step-by-Step Flow (Prevents User Confusion)**:
   - **Step 1 (Welcome)**: Product introduction, feature highlights, and version info.
   - **Step 2 (License Terms)**: Embedded scrollable MIT License viewer with explicit acceptance radio choices. **Default is set to "I do not accept the agreement"** to ensure intentional compliance.
   - **Step 3 (Destination Path)**: Validated directory picker (`AppData\Local\Programs\VisualMark Studio`) with browse folder modal, disk space telemetry, and path traversal protection.
   - **Step 4 (Ready to Install)**: Clear summary of target destination, desktop shortcuts, Start Menu entry, and `.md` file associations.
   - **Step 5 (Installing / Progress)**: Smooth progress bar with live status indicators.
   - **Step 6 (Finished)**: Completion status with an optional "Launch VisualMark Studio" checkbox.

---

## 🗑️ Standalone Uninstaller

A matching 2-column glassmorphic uninstaller (`uninstaller.html` & `uninstaller-renderer.js`):
- **Confirmation Step**: Prompts user with options to remove program files, clean desktop shortcuts, and optionally clear local cache and user configuration.
- **Progress Step**: Clean, atomic uninstallation without leaving orphaned registry keys or lockups.
- **Finished Step**: Clean completion dialog with an Exit button.

---

## 🔒 Security Hardening

- **Path Traversal Protection**: Directory selections are validated against parent traversal (`..`), system directories (`C:\Windows`, `C:\Windows\System32`), and root drives (`C:\`).
- **HKCU Isolation**: All registry entries for Start Menu, shell context menus, and Add/Remove Programs are strictly registered in `HKEY_CURRENT_USER\Software`, requiring zero UAC Administrator escalation and eliminating machine-wide tampering.
- **Safe PowerShell Shortcut Generation**: Shortcut links are created using `-EncodedCommand` (Base64-encoded UTF-16LE scripts) and strictly parameterized arguments, preventing script injection or quote-escaping vulnerabilities.
- **Atomic Operations**: Program files are staged and uninstalled cleanly with error handling.

---

## 🚀 Commands

From the `frontend/` directory:

| Command | Action |
|---|---|
| `npm run installer:preview` | Launch and preview the Figma-styled installer live in Electron |
| `npm run uninstaller:preview` | Launch and preview the Figma-styled uninstaller live in Electron |
| `npm run electron:dist` | Build frontend, package application payload, and compile standalone setup executable |
| `npm run installer:build` | Alias for building the standalone setup executable (`build-installer.ps1`) |

---

## 📂 File Structure

```
installer/
├── assets/                  # Brand icon (.ico, .png) and logo.png
├── engine.cjs               # Native registry writes, shortcut creation, and uninstaller logic
├── main.cjs                 # Electron window management & mode routing (--uninstall flag)
├── preload.cjs              # Secure contextBridge API for installer & uninstaller
├── index.html               # 2-column Figma layout installer wizard
├── uninstaller.html         # 2-column Figma layout uninstaller wizard
├── styles.css               # Shared Figma theme, glowing accents, and button styles
├── renderer.js              # Installer step controller & headline switcher
├── uninstaller-renderer.js  # Uninstaller progress controller & cleanup triggers
├── package.json             # Portable packaging configuration
├── build-installer.ps1      # Payload staging and release compilation script
└── README.md                # Installer documentation
```
