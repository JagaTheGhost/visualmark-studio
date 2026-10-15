# Contributing to VisualMark Studio

Thank you for your interest in contributing to **VisualMark Studio**! We welcome contributions from developers, technical writers, designers, and documentation engineers of all experience levels.

This guide outlines our development workflow, coding standards, and pull request process.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our **[Code of Conduct](CODE_OF_CONDUCT.md)**. Please treat everyone with respect, kindness, and professionalism.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` (LTS recommended)
- **npm**: `v9.x` or higher
- **Python**: `v3.11.x`
- **Git**: Installed and configured on your machine

### 1. Fork & Clone
Fork the repository on GitHub, then clone your fork locally:
```bash
git clone https://github.com/<your-username>/visualmark-studio.git
cd visualmark-studio
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Backend Setup
From the repository root:
```bash
# Create and activate a virtual environment
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt
```

### 4. Running the Application in Development Mode
You can run the frontend development server:
```bash
cd frontend
npm run dev
```

To run the full Electron desktop app with live reload:
```bash
cd frontend
npm start
```

To start the FastAPI backend sidecar manually (if developing backend routes):
```bash
python backend/app.py
```

---

## 🌿 Branching & Workflow

1. Always branch off the latest `main` branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b <type>/<short-description>
   ```
2. Use standard branch prefixes:
   - `feat/` — New feature or visual studio capability
   - `fix/` — Bug fix or error resolution
   - `docs/` — Documentation updates or guides
   - `refactor/` — Code restructuring or performance optimization
   - `style/` — CSS, layout, or cosmetic improvements

---

## 💬 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
```
<type>(<scope>): <short summary>
```

### Common Types:
- `feat`: A new visual studio, tool, or IDE capability
- `fix`: A bug fix or glitch resolution
- `docs`: Documentation-only changes
- `style`: Formatting, CSS improvements, or visual adjustments
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or correcting tests
- `chore`: Build scripts, dependencies, or workflow changes

*Example:* `feat(studio): add vector color tinting to icons studio`

---

## 🎨 Architectural & Design Guidelines

When contributing code to VisualMark Studio, please adhere to these core architectural principles:

1. **CSS First (Design System Tokens)**:
   - Use our curated dark-theme design tokens defined in `frontend/src/styles/tokens.css`.
   - Avoid generic ad-hoc styles. Maintain high aesthetic standards with subtle gradients, tactile physical depth for interactive controls, and dark glassmorphic styling.
2. **Zero Shell / Terminal Executions**:
   - VisualMark Studio is strictly a documentation engineering and visual Markdown IDE. We do not provide or spawn system shell/terminal interfaces. Never introduce arbitrary command execution bridges.
3. **Electron Security Standards**:
   - Never disable `contextIsolation`.
   - Never enable `nodeIntegration`.
   - Route all native capabilities strictly through parameter-validated IPC handlers in `preload.cjs` and `main.cjs`.
   - Sanitize all rendered HTML and Markdown using `DOMPurify`.
4. **Modularity**:
   - Keep React components focused, modular, and organized within their corresponding feature subdirectories (`components/studio/`, `components/explorer/`, `components/preview/`, `components/modals/`).

---

## 🧪 Testing & Validation

Before submitting your pull request, verify that all tests and builds pass cleanly:

### Frontend Build
```bash
cd frontend
npm run build
```
*Ensure exit code is `0` with zero compile warnings or missing references.*

### Backend Tests
```bash
python -m pytest backend/tests/test_api.py -v
```

---

## 📥 Submitting a Pull Request (PR)

1. Push your branch to your GitHub fork:
   ```bash
   git push origin <type>/<short-description>
   ```
2. Open a Pull Request against the `main` branch of `JagaTheGhost/visualmark-studio`.
3. Complete the pull request template checklist:
   - Clear description and rationale
   - Security checklist verification
   - Local verification confirmation
4. Link any related issues using GitHub keywords (e.g. `Fixes #42` or `Closes #15`).

---

## 🔒 Security Vulnerabilities

If you discover a security vulnerability, **do NOT open a public issue**. Please review our **[Security Policy](SECURITY.md)** and report it privately via [GitHub Security Advisories](https://github.com/JagaTheGhost/visualmark-studio/security/advisories).

Thank you for helping make VisualMark Studio the best technical documentation IDE!
