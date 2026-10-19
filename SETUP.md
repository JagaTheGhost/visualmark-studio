# VisualMark Studio — Developer Setup & Installation Guide

Complete step-by-step instructions to get VisualMark Studio running locally from source for development, testing, and distribution.

---

## 📋 Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Cloning the Repository](#2-cloning-the-repository)
3. [Backend Setup (FastAPI Sidecar)](#3-backend-setup-fastapi-sidecar)
4. [Frontend Setup (React + Electron)](#4-frontend-setup-react--electron)
5. [Running the Application](#5-running-the-application)
6. [Building the Standalone Sidecar & Binaries](#6-building-the-standalone-sidecar--binaries)
7. [Verification & Health Checks](#7-verification--health-checks)
8. [Troubleshooting Guide](#8-troubleshooting-guide)

---

## 1. Prerequisites

### System Requirements
- **Operating System:** Windows 10/11 (64-bit recommended), macOS 11+, or Linux (Ubuntu 20.04+)
- **Memory (RAM):** 4 GB minimum (8 GB recommended)
- **Disk Space:** 1.5 GB free disk space (includes Node modules and Python packages)

### Software Dependencies
- **Node.js:** v18.0.0 or higher (v20 LTS recommended)
  - Verify: `node --version && npm --version`
- **Python:** 3.10 or higher (3.11 recommended)
  - Verify: `python --version` (or `python3 --version`)
- **Git:** 2.30 or higher
  - Verify: `git --version`

---

## 2. Cloning the Repository

```bash
git clone https://github.com/JagaTheGhost/visualmark-studio.git
cd visualmark-studio
```

---

## 3. Backend Setup (FastAPI Sidecar)

The backend provides repository AST scanning, tech stack discovery, documentation templates, and an SSRF-safe image proxy.

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create and Activate Virtual Environment
**Windows (PowerShell / Command Prompt):**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

Core dependencies installed:
- `fastapi` — High-performance asynchronous API framework
- `uvicorn` — ASGI web server
- `pydantic` — Data validation and schema definitions
- `pyinstaller` — Standalone binary freeze tool (for desktop distribution)

### Step 4: Verify Backend Execution
```bash
python app.py
```
Expected output:
```
INFO:     Started server process [1234]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```
Press `Ctrl+C` to stop.

---

## 4. Frontend Setup (React + Electron)

The frontend houses the Monaco Editor, 11 Visual Studio suites, the HUD floating toolbar, and the Electron desktop wrapper.

### Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Verify Frontend Build
```bash
npm run build
```
Expected output:
```
vite v5.4.21 building for production...
✓ 3779 modules transformed.
dist/index.html ...
✓ built in ~20s
```

---

## 5. Running the Application

### Option A: Native Desktop IDE Mode (Recommended)
This launches both the Vite development server and the Electron desktop application with live reloading, native disk I/O, and sidecar integration:

```bash
cd frontend
npm run electron:dev
# (or simply: npm start)
```

The Electron shell launches in frameless Obsidian Dark theme. If no standalone sidecar binary exists yet, it automatically discovers and connects to your local FastAPI server.

### Option B: Browser Web Mode (Frontend + Backend)
If you prefer developing in a standard web browser:

**Terminal 1 — Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Open `http://localhost:3000` in Google Chrome, Microsoft Edge, or Firefox.

---

## 6. Building the Standalone Sidecar & Binaries

To produce standalone executables that run without requiring Python or Node.js on the target machine:

### Step 1: Compile the Python Sidecar Binary
Compiles `server.exe` into `frontend/resources/backend-sidecar/`:
```bash
cd backend
python build_sidecar.py
```

### Step 2: Package Windows Executables
```bash
cd ../frontend
npm run electron:dist
```
Generated artifacts in `frontend/release/`:
- `VisualMark-Studio-Setup.exe` — Windows setup installer (Non-elevated user-level installation, Start Menu & Desktop shortcuts)
- `VisualMark-Studio-Portable.exe` — Zero-install portable standalone executable
- `latest.yml` — Differential auto-update manifest for Electron Updater

---

## 7. Testing Auto-Updates (Differential Patching)

VisualMark Studio supports delta auto-updates via GitHub Releases (`v1.1.2` → `v1.1.3`):
1. **Bump Version:** Update `"version"` in `frontend/package.json` and `frontend/src/data/releaseNotes.js`.
2. **Git Commit & Tag:**
   ```bash
   git add .
   git commit -m "chore: release v1.1.3"
   git tag v1.1.3
   git push origin main --tags
   ```
3. **CI/CD Build & Publish:** GitHub Actions (`release.yml`) builds the assets and uploads `VisualMark-Studio-Setup.exe`, `.blockmap`, `VisualMark-Studio-Portable.exe`, and `latest.yml` to the Release.
4. **Verification:** Launch installed `v1.1.2`, open **Settings → Updates**, click **"Check for updates"**, and observe the app download only the differential blockmap patch and prompt to restart into `v1.1.3`.

---

## 8. Verification & Health Checks

### Check Backend Health
```bash
curl http://localhost:8000/health
```
Expected JSON response:
```json
{"status":"ok","service":"README Studio API"}
```

### Run Backend Unit Tests
```bash
cd backend
python -m pytest tests/test_api.py -v
```

### Test Documentation Generation Endpoint
```bash
curl -X POST http://localhost:8000/generate-readme \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/facebook/react",
    "description": "A declarative, efficient JavaScript library for building user interfaces.",
    "tech_stack": ["React", "JavaScript", "TypeScript"]
  }'
```

---

## 9. Troubleshooting Guide

### Port 8000 Conflict
- **Cause:** Another service is using port 8000.
- **Resolution:** In Electron desktop mode, the app automatically scans and selects a free port between 8000 and 8030. When running manually in web mode, pass a custom port: `python app.py --port 8005`.

### Monaco Editor Blank or CSP Errors
- **Resolution:** Verify that `node_modules/@monaco-editor/react` is installed correctly. Ensure `frontend/index.html` Content Security Policy includes `'self'` and `'unsafe-eval'`.

### Terminal Shell Spawning Issues
- **Resolution:** On Windows, verify PowerShell is installed in system PATH (`C:\Windows\System32\WindowsPowerShell\v1.0`).
