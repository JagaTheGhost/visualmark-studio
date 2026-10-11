import React, { useState } from 'react'
import { normalizeKeyCombination } from '../utils/keybindingManager'

export default function ShortcutsTab({
  keybindings = [],
  onUpdateKeybinding = () => {},
  onResetKeybindings = () => {},
  onClose = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingItem, setEditingItem] = useState(null) // { id, title, currentKey }
  const [recordedKey, setRecordedKey] = useState('')

  const categories = ['all', 'File', 'Preferences', 'Navigation', 'View', 'Editor', 'Create', 'Studio']

  const filteredItems = keybindings.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory
    if (!matchesCat) return false

    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.key.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  const startEditing = (item) => {
    setEditingItem(item)
    setRecordedKey(item.key)
  }

  const handleKeyDownRecorder = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Cancel on standalone Escape if nothing recorded yet
    if (e.key === 'Escape' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      setEditingItem(null)
      return
    }

    // Save on Enter if key is recorded
    if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      if (recordedKey) {
        onUpdateKeybinding(editingItem.id, recordedKey)
        setEditingItem(null)
      }
      return
    }

    const combination = normalizeKeyCombination(e)
    if (combination) {
      setRecordedKey(combination)
    }
  }

  const handleSaveKeybinding = () => {
    if (editingItem && recordedKey) {
      onUpdateKeybinding(editingItem.id, recordedKey)
      setEditingItem(null)
    }
  }

  const handleResetSingle = (e, item) => {
    e.stopPropagation()
    onUpdateKeybinding(item.id, item.defaultKey)
  }

  // Detect conflict with another command
  const conflictingCommand = editingItem
    ? keybindings.find(k => k.id !== editingItem.id && k.key.toLowerCase() === recordedKey.toLowerCase())
    : null

  return (
    <div className="shortcuts-tab-workspace custom-scrollbar select-none">
      {/* 1. Header Toolbar */}
      <div className="shortcuts-tab-header">
        <div className="shortcuts-header-top">
          <div className="shortcuts-title-group">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" className="text-primary">
              <path d="M14 2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2h2v2H3V5zm3 0h2v2H6V5zm3 0h2v2H9V5zm3 0h1v2h-1V5zM3 8h1v2H3V8zm2 0h6v2H5V8zm7 0h1v2h-1V8z"/>
            </svg>
            <h2 className="shortcuts-main-title">Keyboard Shortcuts</h2>
            <span className="shortcuts-count-badge">{filteredItems.length} Commands</span>
          </div>

          <div className="shortcuts-header-actions">
            <button
              type="button"
              className="shortcuts-action-btn danger"
              onClick={onResetKeybindings}
              title="Reset all customized keybindings to original defaults"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>restart_alt</span>
              <span>Reset All Keybindings</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="shortcuts-search-wrapper">
          <svg className="shortcuts-search-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input
            type="text"
            className="shortcuts-search-input"
            placeholder="Type to search in keybindings (e.g., save, sidebar, find, ctrl+b)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="shortcuts-search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="shortcuts-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`shortcuts-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Commands' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Keybindings Table */}
      <div className="shortcuts-table-container custom-scrollbar">
        <table className="shortcuts-table">
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Command</th>
              <th style={{ width: '30%' }}>Keybinding</th>
              <th style={{ width: '15%' }}>Source</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="shortcut-table-row"
                onClick={() => startEditing(item)}
                title="Click to change shortcut"
              >
                <td>
                  <div className="shortcut-cmd-name">{item.title}</div>
                  <div className="shortcut-cmd-desc">{item.desc}</div>
                </td>
                <td>
                  <div className="shortcut-key-wrapper">
                    {item.key.split('+').map((segment, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span className="key-plus">+</span>}
                        <kbd className="key-chip">{segment.trim()}</kbd>
                      </React.Fragment>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`source-pill ${item.isCustom ? 'user-custom' : 'default-source'}`}>
                    {item.isCustom ? 'User (Custom)' : 'Default'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div className="shortcut-row-actions">
                    <button
                      type="button"
                      className="shortcut-btn-icon edit"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(item)
                      }}
                      title="Edit Keybinding"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                      </svg>
                    </button>
                    {item.isCustom && (
                      <button
                        type="button"
                        className="shortcut-btn-icon reset"
                        onClick={(e) => handleResetSingle(e, item)}
                        title="Revert to Default"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>undo</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="shortcuts-empty-state">
            <span className="material-symbols-outlined">search_off</span>
            <p>No keybindings found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* 3. Interactive Key Recorder Modal */}
      {editingItem && (
        <div className="key-recorder-backdrop" onClick={() => setEditingItem(null)}>
          <div className="key-recorder-modal" onClick={(e) => e.stopPropagation()}>
            <div className="key-recorder-header">
              <span className="material-symbols-outlined text-primary">keyboard</span>
              <h3>Edit Keybinding</h3>
              <button
                type="button"
                className="recorder-close-btn"
                onClick={() => setEditingItem(null)}
              >
                ✕
              </button>
            </div>

            <div className="key-recorder-body">
              <div className="recorder-cmd-title">{editingItem.title}</div>
              <div className="recorder-instruction">
                Press the desired key combination on your keyboard, then click <strong>Save</strong> or press <strong>Enter</strong>.
              </div>

              {/* Key capture input */}
              <div
                className="recorder-input-box"
                tabIndex={0}
                onKeyDown={handleKeyDownRecorder}
                autoFocus
              >
                {recordedKey ? (
                  <div className="recorded-keys-display">
                    {recordedKey.split('+').map((seg, i) => (
                      <kbd key={i} className="recorder-kbd-chip">{seg.trim()}</kbd>
                    ))}
                  </div>
                ) : (
                  <span className="recorder-placeholder">Press key combination...</span>
                )}
              </div>

              {/* Conflict notice if any */}
              {conflictingCommand && (
                <div className="recorder-conflict-warning">
                  <span className="material-symbols-outlined">warning</span>
                  <span>
                    Warning: <strong>{recordedKey}</strong> is already assigned to <em>"{conflictingCommand.title}"</em>.
                  </span>
                </div>
              )}
            </div>

            <div className="key-recorder-footer">
              <button
                type="button"
                className="btn-recorder-cancel"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-recorder-save"
                onClick={handleSaveKeybinding}
                disabled={!recordedKey}
              >
                Save Shortcut
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
