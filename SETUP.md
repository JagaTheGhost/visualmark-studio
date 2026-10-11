# Setup & Installation Guide

Complete step-by-step instructions to get Auto README Generator running locally.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **Windows 10+**, macOS 10.15+, or Ubuntu 18.04+
- **RAM:** 2GB minimum (4GB recommended)
- **Disk Space:** 500MB available

### Software

**Node.js & npm:**
- Download: https://nodejs.org/
- Version: 16.0.0 or higher
- Verify:
  ```bash
  node --version
  npm --version
  ```

**Python:**
- Download: https://www.python.org/
- Version: 3.8 or higher
- Verify:
  ```bash
  python --version
  ```

**Git** (optional but recommended):
- Download: https://git-scm.com/
- Verify:
  ```bash
  git --version
  ```

---

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd auto-readme-generator/backend
```

### Step 2: Create Virtual Environment (Optional but Recommended)

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

After activation, your prompt should show `(venv)` prefix.

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

Expected packages to install:
- fastapi==0.104.1
- uvicorn==0.24.0
- pydantic==2.5.0
- python-dotenv==1.0.0
- aiohttp==3.9.1
- requests==2.31.0

### Step 4: Verify Installation

```bash
pip list
```

You should see all packages listed.

### Step 5: Test Backend (Optional)

```bash
python app.py
```

Or run the automated test suite:

```bash
python -m pytest tests/test_api.py
```

Expected output:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Press `Ctrl+C` to stop.

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd ../frontend
```

### Step 2: Install Node Dependencies

```bash
npm install
```

This will download and install all dependencies from `package.json`.

### Step 3: Test Build (Optional)

```bash
npm run build
```

Expected output:
```
vite v5.4.21 building for production...
✓ 3757 modules transformed
dist/assets/index.js       369 kB │ gzip: 110 kB
dist/assets/index.css      240 kB │ gzip:  36 kB
```

---

## Running the Application

### Option A: Running in Native Desktop IDE Mode (Recommended)

From the `frontend` directory:

```bash
npm start
# OR: npm run electron:dev
```

This concurrently launches Vite on `http://localhost:3000` and opens the Electron native desktop IDE shell with direct disk I/O, Git status indicators, and sidecar integration.

### Option B: Running Browser Web Mode

**Terminal 1 - Backend:**

```bash
cd auto-readme-generator/backend
python app.py
```

**Terminal 2 - Frontend:**

```bash
cd auto-readme-generator/frontend
npm run dev
```

Visit `http://localhost:3000` in your web browser.

### Option C: Running Only Backend (for API Testing)

```bash
cd backend
python main.py
```

Access API docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Option C: Running Frontend Only (without real backend)

```bash
cd frontend
npm run dev
```

Note: This will fail when you try to generate a README because the backend is not running.

---

## Verification

### Check Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"ok","service":"Auto README Generator API"}
```

### Generate Test README

```bash
curl -X POST http://localhost:8000/generate-readme \
  -H "Content-Type: application/json" \
  -d '{
    "repo_url": "https://github.com/facebook/react",
    "description": "A JavaScript library for UI",
    "tech_stack": ["React", "JavaScript"]
  }'
```

### Open in Browser

1. Navigate to: **http://localhost:3000**
2. Should see "Auto README Generator" header
3. Fill in the form
4. Click "Generate README"
5. See preview and export options

---

## Troubleshooting

### Issue: Python not found

**Windows:**
```bash
python --version
# or try:
python3 --version
```

**Solution:** 
- Add Python to PATH
- Reinstall Python with "Add Python to PATH" checkbox enabled

### Issue: Module not found (pip)

**Solution:**
```bash
# Ensure virtual environment is activated
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Reinstall requirements
pip install -r requirements.txt
```

### Issue: npm command not found

**Solution:**
- Restart terminal after installing Node.js
- Verify: `npm --version`
- Add Node to PATH if needed

### Issue: Port already in use

**Port 3000 (Frontend):**
```bash
# Windows: Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :3000
kill -9 <PID>
```

**Port 8000 (Backend):**
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

Or change port in `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change to different port
}
```

### Issue: CORS Error

**Solution:**
Backend `main.py` already has CORS enabled. If you still get errors:

1. Check backend is running
2. Check frontend is using correct API URL
3. In `frontend/src/App.jsx`, verify:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000'
   ```

### Issue: Virtual Environment Not Activating

**Windows:**
```bash
# If execution policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then try:
venv\Scripts\activate
```

**macOS/Linux:**
```bash
# Make sure you're in the right directory
ls venv/bin/activate

# Then:
source venv/bin/activate
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Vite build fails

**Solution:**
```bash
# Make sure all dependencies are installed
npm install

# Clear build cache
rm -rf dist

# Try building again
npm run build
```

---

## Development Tips

### Running with Auto-Reload

**Backend** (already enabled with `reload=True`):
```bash
python main.py
# Makes changes to main.py or prompts.py and it reloads automatically
```

**Frontend** (already enabled with Vite dev server):
```bash
npm run dev
# Makes changes and they reload in browser automatically
```

### Using VS Code for Debugging

1. Install Python extension
2. Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "FastAPI",
         "type": "python",
         "request": "launch",
         "module": "uvicorn",
         "args": ["main:app", "--reload"],
         "jinja": true,
         "cwd": "${workspaceFolder}/backend"
       }
     ]
   }
   ```

### Running Tests

Backend API test:
```bash
# Using curl (shown above)
curl http://localhost:8000/docs
```

### Environment Variables

Create `.env` file if needed:
```
BACKEND_URL=http://localhost:8000
DEBUG=true
```

---

## Next Steps

Once everything is running:

1. ✅ Generate your first README
2. 📖 Read the full [DOCUMENTATION.md](../DOCUMENTATION.md)
3. 🔧 Explore the code structure
4. 🚀 Deploy to production (see docs)
5. 🎉 Share with your team!

---

## Quick Reference

```bash
# Backend
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python main.py

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Open browser
http://localhost:3000
```

---

**Questions?** Check the [DOCUMENTATION.md](../DOCUMENTATION.md) for more help!
