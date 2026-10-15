import React from 'react'

export default function EditorSettingsSection({
  activeCategory,
  matchesSearch,
  editorEngine,
  setEditorEngine,
  fontSize,
  setFontSize,
  fontFamily,
  handleFontFamilyChange,
  tabSize,
  setTabSize,
  wordWrap,
  setWordWrap,
  showLineNumbers,
  setShowLineNumbers,
  syncScroll,
  setSyncScroll,
  formatOnSave,
  handleFormatOnSaveChange,
  autoSaveMode,
  handleAutoSaveModeChange
}) {
  if (activeCategory !== 'all' && activeCategory !== 'editor') return null

  return (
    <section className="settings-group-section">
      <div className="settings-group-header">
        <span className="material-symbols-outlined">edit_note</span>
        <h3>Text Editor</h3>
      </div>

      {/* Editor Engine */}
      {matchesSearch('editor engine monaco vs code classic lightweight') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Engine</div>
            <div className="settings-card-sublabel">
              Choose between the high-performance Monaco Editor (with minimap, code folding, smart autocompletion) or the Classic lightweight editor.
            </div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={editorEngine}
              onChange={(e) => setEditorEngine(e.target.value)}
            >
              <option value="monaco">Monaco (VS Code Engine - Recommended)</option>
              <option value="classic">Classic (Lightweight Textarea)</option>
            </select>
          </div>
        </div>
      )}

      {/* Font Size */}
      {matchesSearch('font size scale editor') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Font Size</div>
            <div className="settings-card-sublabel">Controls the font size in pixels for the markdown code editor.</div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            >
              <option value={11}>11px (Compact)</option>
              <option value={12}>12px</option>
              <option value={13}>13px (Default)</option>
              <option value={14}>14px (Comfortable)</option>
              <option value={16}>16px (Large)</option>
              <option value={18}>18px (Extra Large)</option>
            </select>
          </div>
        </div>
      )}

      {/* Font Family */}
      {matchesSearch('font family jetbrains monospace') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Font Family</div>
            <div className="settings-card-sublabel">Controls the primary monospaced typography font family.</div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={fontFamily}
              onChange={(e) => handleFontFamilyChange(e.target.value)}
            >
              <option value="'JetBrains Mono', Consolas, monospace">JetBrains Mono (Modern)</option>
              <option value="'Fira Code', Consolas, monospace">Fira Code (Ligatures)</option>
              <option value="Consolas, 'Courier New', monospace">Consolas (Windows Classic)</option>
              <option value="'Source Code Pro', monospace">Source Code Pro</option>
              <option value="ui-monospace, Menlo, Monaco, monospace">Monaco / Menlo (macOS / Unix)</option>
            </select>
          </div>
        </div>
      )}

      {/* Tab Size */}
      {matchesSearch('tab size indentation spaces') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Tab Size</div>
            <div className="settings-card-sublabel">The number of spaces to insert when pressing the Tab key.</div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={tabSize}
              onChange={(e) => setTabSize(Number(e.target.value))}
            >
              <option value={2}>2 spaces (Standard)</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>
      )}

      {/* Word Wrap */}
      {matchesSearch('word wrap lines') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Word Wrap</div>
            <div className="settings-card-sublabel">Controls whether long markdown lines wrap at the editor viewport edge.</div>
          </div>
          <div className="settings-card-control">
            <label className="settings-toggle-switch">
              <input
                type="checkbox"
                checked={wordWrap}
                onChange={(e) => setWordWrap(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      )}

      {/* Line Numbers Gutter */}
      {matchesSearch('line numbers gutter') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Line Numbers</div>
            <div className="settings-card-sublabel">Controls the display of numerical line gutters on the left of the editor.</div>
          </div>
          <div className="settings-card-control">
            <label className="settings-toggle-switch">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      )}

      {/* Synchronized Scrolling */}
      {matchesSearch('synchronized scroll sync scroll preview editor split') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Synchronized Scrolling</div>
            <div className="settings-card-sublabel">Synchronizes the scroll positions of the editor and live preview panes based on document line anchors.</div>
          </div>
          <div className="settings-card-control">
            <label className="settings-toggle-switch">
              <input
                type="checkbox"
                checked={syncScroll}
                onChange={(e) => setSyncScroll(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      )}

      {/* Format On Save */}
      {matchesSearch('format on save auto') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Format On Save</div>
            <div className="settings-card-sublabel">Automatically clean up markdown headers, tables, and spacing when saving (Ctrl+S).</div>
          </div>
          <div className="settings-card-control">
            <label className="settings-toggle-switch">
              <input
                type="checkbox"
                checked={formatOnSave}
                onChange={(e) => handleFormatOnSaveChange(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      )}

      {/* Auto Save Mode */}
      {matchesSearch('auto save delay buffer') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Editor: Auto Save</div>
            <div className="settings-card-sublabel">Controls how documents are automatically saved to local workspace storage.</div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={autoSaveMode}
              onChange={(e) => handleAutoSaveModeChange(e.target.value)}
            >
              <option value="afterDelay">afterDelay (Automatic 1s)</option>
              <option value="onFocusChange">onFocusChange (When switching tabs)</option>
              <option value="off">off (Manual Ctrl+S only)</option>
            </select>
          </div>
        </div>
      )}
    </section>
  )
}
