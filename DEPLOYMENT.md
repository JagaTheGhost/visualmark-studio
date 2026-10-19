# 🚀 VisualMark Studio — Desktop Packaging & Distribution Guide

VisualMark Studio is a **full native desktop IDE** built with Electron, React 18, and an embedded FastAPI Python sidecar daemon. This document covers packaging standalone Windows executables, installer options, and CI/CD automation.

---

## 💻 Running the Desktop IDE in Development

To start the full native desktop IDE with live reloading:

```bash
cd frontend
npm install
npm run electron:dev
# (or npm start)
```

This concurrently starts:
1. The **Vite renderer dev server** on `http://localhost:3000`.
2. The **Electron frameless desktop window** with custom Obsidian dark titlebar and native OS file access.
3. The **Python sidecar daemon** (connecting to an existing local backend or launching a fresh daemon).

---

## 📦 Building Standalone Desktop Executables

You can compile VisualMark Studio into standalone desktop executables and installers that run completely offline without requiring Node.js or Python to be installed on target machines.

### Step 1: Compile the Python Sidecar
Freeze the FastAPI documentation engine into a standalone binary (`server.exe`):

```bash
cd backend
python build_sidecar.py
```
*Output: `frontend/resources/backend-sidecar/server.exe`*

### Step 2: Build the Electron Desktop Package

#### 1. Portable Standalone Executable (Windows `.exe`)
```bash
cd frontend
npm run electron:portable
```
*Output: `frontend/release/VisualMark-Studio-Portable.exe`*  
Runs immediately from any directory or portable USB drive with zero installation.

#### 2. Complete Installer (Glassmorphic Setup `.exe`)
```bash
cd frontend
npm run electron:dist
```
*Output: `release/VisualMark-Studio-Setup.exe`*  
Full Windows installer featuring the 2-column Figma layout, license verification, validated destination paths, Start Menu & Desktop shortcuts, and integrated uninstaller.

#### 3. Uninstaller & Installer Developer Previews
```bash
cd frontend
npm run installer:preview     # Previews the 2-column installer
npm run uninstaller:preview   # Previews the 2-column uninstaller
```

#### 4. Unpacked Directory (Fast Verification)
```bash
cd frontend
npm run electron:pack
```
*Output: `frontend/release/win-unpacked/VisualMark Studio.exe`*  
Useful for rapid local testing without waiting for full compression.

---

## 🤖 GitHub Actions CI/CD Release Automation

Production binaries and differential update manifests are automatically built and published via `.github/workflows/release.yml` whenever a SemVer tag (e.g. `v1.1.3`) is pushed to GitHub:

```bash
git add .
git commit -m "chore: release v1.1.3"
git tag v1.1.3
git push origin main --tags
```

The workflow:
1. Provisions Windows Server runner with Node.js 20 and Python 3.11.
2. Compiles the FastAPI backend into `server.exe` via PyInstaller.
3. Packages both the custom installer (`VisualMark-Studio-Setup.exe`) and portable binary (`VisualMark-Studio-Portable.exe`).
4. Generates `latest.yml` and `.blockmap` files for differential delta updates.
5. Verifies and uploads strictly canonical assets to the GitHub Release, allowing existing installed instances (e.g. `v1.1.2`) to download only the differential block changes without reinstalling the entire application.

---

## 🛠 Desktop Architecture & Native Capabilities

| Feature | Desktop Implementation |
| :--- | :--- |
| **Window Frame** | Frameless Obsidian dark titlebar with native Windows minimize, maximize, and close controls |
| **Direct Disk I/O** | Atomic disk streaming via Electron IPC (`saveDirectFile`, `saveFileDialog`, `openFileDialog`) |
| **Terminal Drawer** | Embedded local PowerShell & Command Prompt sessions spawned via `child_process` |
| **Local Workspaces** | Recursive folder scanning, real-time AST linting, and Git status inspection |
| **Offline Engine** | 100% local-first architecture with zero external telemetry or cloud dependencies |
