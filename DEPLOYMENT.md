# 🚀 README Studio IDE - Desktop Packaging & Distribution Guide

README Studio is a **full native desktop IDE** built with Electron, React, and an embedded FastAPI Python sidecar daemon.

---

## 💻 Running the Desktop IDE in Development

To start the full native desktop IDE with live reloading:

```bash
cd frontend
npm install
npm start
# Alternatively: npm run electron:dev
```

This concurrently starts:
1. The **Vite renderer dev server** on `http://localhost:3000`.
2. The **Electron frameless desktop window** with custom Antigravity title bar and native OS file access.
3. The **Python sidecar daemon** (or connects to an existing local backend at port `8000`).

---

## 📦 Building Standalone Desktop Executables

You can compile README Studio into standalone desktop executables and installers that run completely offline without requiring Node.js or Python to be installed.

### Step 1: Compile the Python Sidecar
Freeze the FastAPI documentation engine into a standalone binary (`server.exe`):

```bash
cd backend
python build_sidecar.py
```
*Output: `frontend/resources/backend-sidecar/server.exe`*

### Step 2: Build the Electron Desktop Package

#### Portable Standalone Executable (Windows `.exe`)
```bash
cd frontend
npm run electron:portable
```
*Output: `frontend/release/VisualMark Studio-Portable.exe`*

#### Complete Installer (NSIS)
```bash
cd frontend
npm run electron:dist
```
*Output: `frontend/release/VisualMark Studio-Setup.exe`*

#### Unpacked Directory (Fast Verification)
```bash
cd frontend
npm run electron:pack
```
*Output: `frontend/release/win-unpacked/VisualMark Studio.exe`*

---

## 🛠 Desktop Architecture & Native Capabilities

| Feature | Desktop Implementation |
| :--- | :--- |
| **Window Frame** | Frameless Obsidian dark titlebar with native Windows minimize, maximize, and close controls |
| **File I/O** | Direct disk streaming via Electron IPC (`saveDirectFile`, `readFile`, `dialog-save-binary`) |
| **External Terminal** | Native spawning of PowerShell / CMD inside active workspace folder |
| **Workspaces** | Live recursive folder scanning, AST analysis, and Git status inspection |
| **Offline Engine** | 100% local-first architecture with zero cloud dependency |
