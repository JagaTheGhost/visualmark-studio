# 🎯 VisualMark Studio — Quality Assurance & Testing Guide

This guide establishes the comprehensive test protocols for **VisualMark Studio**, covering automated test execution, desktop verification, and regression matrices across the Monaco code editor, 11 visual studios, and the Electron runtime.

---

## 📋 Table of Contents

1. [Automated Test Execution](#1-automated-test-execution)
2. [Desktop IDE Core Verification Protocol](#2-desktop-ide-core-verification-protocol)
3. [The 11 Visual Studios Verification Checklist](#3-the-11-visual-studios-verification-checklist)
4. [Monaco Editor & HUD Selection Toolbar Protocol](#4-monaco-editor--hud-selection-toolbar-protocol)
5. [Bottom Panel Drawer & Diagnostics Verification](#5-bottom-panel-drawer--diagnostics-verification)
6. [Release Packaging & Asset Deduplication Verification](#6-release-packaging--asset-deduplication-verification)

---

## 1. Automated Test Execution

### Backend API Test Suite
Run the automated pytest suite verifying API contract validation, Markdown generation, and SSRF security sanitization:

```bash
cd backend
python -m pytest tests/test_api.py -v
```
**Expected Outcome:**
- `test_health_check` → `PASSED`
- `test_generate_readme_from_description` → `PASSED`
- `test_generate_readme_missing_inputs` → `PASSED`
- `test_resolve_image_ssrf_protection` → `PASSED`

### Frontend Production Compilation
Verify Vite code-splitting, tree-shaking, and syntax validation:

```bash
cd frontend
npm run build
```
**Expected Outcome:**
- 3,700+ modules transformed without syntax errors or broken imports.
- Production chunks emitted cleanly into `frontend/dist/`.

---

## 2. Desktop IDE Core Verification Protocol

Launch the application in development desktop mode:
```bash
cd frontend
npm run electron:dev
```

### Verification Checklist:
- [ ] **Frameless Window Chrome:** Titlebar displays application icon, version tag, search bar, and native Windows minimize, maximize, and close buttons.
- [ ] **Direct Disk I/O:**
  - Press `Ctrl+O`: Native file picker opens; selecting a `.md` file loads its content into the Monaco buffer.
  - Press `Ctrl+S`: Saves buffer to the open file on disk; unsaved indicator (`*`) clears.
  - Press `Ctrl+Shift+O`: Mounts a folder into the File Explorer sidebar tree.
- [ ] **Split View Synchronized Scrolling:**
  - Scroll inside Monaco editor; the preview pane scrolls proportionally without lag or rubber-banding.
  - Press `Ctrl+\`: Orientation cycles between side-by-side vertical split and top-to-bottom horizontal split.
  - Press `Ctrl+Shift+V`: Cycles through Split View, Editor-Only, and Preview-Only modes.

---

## 3. The 11 Visual Studios Verification Checklist

Test that all 11 studio workspaces open, generate valid Markdown, and insert cleanly into document buffers:

| Studio | Tab ID | Test Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Shields.io Badges** | `badges.studio` | Select Devicon preset, choose `for-the-badge` style, click "Insert" | Badges Markdown injected at cursor line. |
| **Mermaid Architecture** | `diagrams.studio` | Choose Flowchart template, edit node labels | Live diagram updates in real-time without syntax flicker. |
| **Visual Tables** | `tables.studio` | Add 3 rows, toggle column alignment, click "Insert" | Clean GFM Markdown table generated. |
| **Snippets & Callouts** | `snippets.studio` | Select `[!TIP]` callout with custom text | Renders standard GitHub alert block quote. |
| **Hero Images & Frames** | `images.studio` | Choose macOS dark window frame, adjust padding | Window frame mockup renders with crisp corners. |
| **Directory Trees** | `tree.studio` | Scan workspace folder, select Unicode Box style | Emits structured directory tree in fenced block. |
| **REST API Studio** | `api.studio` | Switch between "Live Preview", "Split View", and "Markdown & Code" | Displays interactive REST Blueprint spec card and GFM table preview. |
| **Icons & Emojis** | `icons.studio` | Switch between Vector Icons & Emojis tabs; pick custom HEX color; toggle `Tint preview` | Icon cards update color in real-time; colored SVG downloads cleanly. |
| **Contributors Grid** | `contributors.studio` | Add username and roles | Emits All-Contributors table with avatar image. |
| **Changelog Studio** | `changelog.studio` | Add `Added` bullet and bump Minor version | Generates SemVer changelog header and notes. |
| **README Auditor** | `audit.studio` | Run audit on current document | Reports scorecard grade (A+ to F) and section checklist. |

---

## 4. Monaco Editor & HUD Selection Toolbar Protocol

### Floating Selection HUD Toolbar:
1. Highlight any sentence or heading in the Monaco editor.
2. Verify the HUD toolbar appears smoothly above the selection.
3. Test toolbar dropdowns:
   - **Headings:** Choose H2; text is prefixed with `## `.
   - **Code Fences:** Choose Python; wraps selection in ` ```python ` block.
   - **Hyperlinks:** Enter URL; transforms into `[selection](url)`.
   - **Alert Callouts:** Choose `[!NOTE]`; wraps in blockquote alert.
4. Verify clicking toolbar buttons **does not lose editor focus** or clear selection.
5. Verify Undo (`Ctrl+Z`) restores previous text state accurately.

### Inline Autocomplete:
- Type `:` inside Monaco editor: Autocomplete list opens presenting Unicode emojis and Material vector icons. Selecting an item inserts its markdown/shortcode cleanly.

---

## 5. Bottom Panel Drawer & Diagnostics Verification

Press `Ctrl+` ` ` or click the Terminal icon in the Status Bar:

- [ ] **Terminals Tab:**
  - Launch PowerShell session: Executes native commands (e.g., `dir`, `git status`).
  - Open second tab with CMD: Sessions remain isolated.
- [ ] **Problems Tab:**
  - Insert a broken Markdown link (e.g., `[test]()`) or unclosed code fence.
  - Problem drawer lists the issue with severity icon; clicking jumps directly to the offending line in Monaco.
- [ ] **Output Tab:**
  - File save actions and IPC daemon transactions log timestamped telemetry entries.

---

## 6. Release Packaging & Asset Deduplication Verification

To ensure that releases published to GitHub do not produce duplicate binary files:

### Build Packaging:
```bash
cd frontend
npm run electron:dist
```

### Asset Audit Checklist:
- Inspect `frontend/release/`:
  - `VisualMark-Studio-Setup.exe` (exists once, ~173 MB)
  - `VisualMark-Studio-Setup.exe.blockmap` (exists once, ~185 KB)
  - `VisualMark-Studio-Portable.exe` (exists once, ~172 MB)
  - `latest.yml` (exists once)
- **Zero Duplicate Artifacts:** Verify that no dot-named duplicates (`VisualMark.Studio-*.exe`) exist in `release/`.
- Run the portable executable: Application launches smoothly without installation prompts.
