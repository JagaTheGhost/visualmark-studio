import React, { useState, useMemo, useCallback } from 'react'
import {
  normalizeKeyCombination,
  normalizeKeyString,
  findKeybindingConflicts
} from '../utils/keybindingManager'

export default function ShortcutsTab({
  keybindings = [],
  onUpdateKeybinding = () => {},
  onResetKeybindings = () => {},
  onClose = () => {},
  initialQuery = '',
  autoEditId = null
}) {
  const safeInitialQuery = typeof initialQuery === 'string' ? initialQuery : ''
  const safeAutoEditId = typeof autoEditId === 'string' ? autoEditId : null

  const [searchQuery, setSearchQuery] = useState(safeInitialQuery)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [editingItem, setEditingItem] = useState(null) // { id, title, currentKey }
  const [recordedKey, setRecordedKey] = useState('')

  const lastTriggerRef = React.useRef(null)

  // Global map of conflicting shortcuts
  const conflictMap = useMemo(() => {
    return findKeybindingConflicts(keybindings)
  }, [keybindings])

  // Get conflicting items for a specific keybinding item
  const getConflictsForItem = useCallback(
    (item) => {
      const norm = normalizeKeyString(item.key)
      if (!norm) return []
      const list = conflictMap[norm] || []
      return list.filter((k) => k.id !== item.id)
    },
    [conflictMap]
  )

  // Total count of commands having keybinding conflicts
  const totalConflictsCount = useMemo(() => {
    let count = 0
    Object.values(conflictMap).forEach((list) => {
      if (list.length > 1) {
        count += list.length
      }
    })
    return count
  }, [conflictMap])

  // Automatically filter and open Keybinding Recorder if launched from Command Palette
  React.useEffect(() => {
    const triggerKey = `${safeInitialQuery}::${safeAutoEditId}`
    if (!safeInitialQuery && !safeAutoEditId) return
    if (lastTriggerRef.current === triggerKey) return
    lastTriggerRef.current = triggerKey

    if (safeInitialQuery) {
      const cleanQ = safeInitialQuery
        .replace(/^(view:|file:|preferences:|edit:|studio:|config:|create:|git:|clipboard:|danger:|help:)\s*/i, '')
        .trim()
      setSearchQuery(cleanQ)
    }
    if (safeAutoEditId || safeInitialQuery) {
      const match = keybindings.find((k) => {
        if (safeAutoEditId && k.id === safeAutoEditId) return true
        if (safeInitialQuery) {
          const cleanQ = safeInitialQuery
            .toLowerCase()
            .replace(/^(view:|file:|preferences:|edit:|studio:|config:|create:|git:|clipboard:|danger:|help:)\s*/i, '')
            .trim()
          return k.title.toLowerCase().includes(cleanQ) || k.id.toLowerCase().includes(cleanQ)
        }
        return false
      })
      if (match) {
        setEditingItem(match)
        setRecordedKey(match.key)
      }
    }
  }, [safeInitialQuery, safeAutoEditId, keybindings])

  const categories = [
    'all',
    ...(totalConflictsCount > 0 ? ['conflicts'] : []),
    'File',
    'Preferences',
    'Navigation',
    'View',
    'Editor',
    'Create',
    'Studio',
    'Git',
    'Help'
  ]

  const filteredItems = keybindings.filter((item) => {
    if (selectedCategory === 'conflicts') {
      const conflicts = getConflictsForItem(item)
      if (conflicts.length === 0) return false
    } else if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false
    }

    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase().trim()
    const conflicts = getConflictsForItem(item)
    const matchesConflictName = conflicts.some((c) => c.title.toLowerCase().includes(q))

    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.key.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      matchesConflictName
    )
  })

  const startEditing = (item) => {
    setEditingItem(item)
    setRecordedKey(item.key)
  }

  // Key combinations currently conflicting with recordedKey in modal
  const recordedNorm = normalizeKeyString(recordedKey)
  const recordedConflicts = useMemo(() => {
    if (!recordedNorm || !editingItem) return []
    return keybindings.filter(
      (k) => k.id !== editingItem.id && normalizeKeyString(k.key) === recordedNorm
    )
  }, [keybindings, editingItem, recordedNorm])

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
        const replaceConflicts = recordedConflicts.length > 0
        onUpdateKeybinding(editingItem.id, recordedKey, replaceConflicts)
        setEditingItem(null)
      }
      return
    }

    const combination = normalizeKeyCombination(e)
    if (combination) {
      setRecordedKey(combination)
    }
  }

  const handleSaveKeybinding = (keyToSave = recordedKey, replaceConflicts = false) => {
    if (editingItem) {
      onUpdateKeybinding(editingItem.id, keyToSave, replaceConflicts)
      setEditingItem(null)
    }
  }

  const handleResetSingle = (e, item) => {
    e.stopPropagation()
    onUpdateKeybinding(item.id, item.defaultKey, false)
  }

  const handleClearSingle = (e, item) => {
    e.stopPropagation()
    onUpdateKeybinding(item.id, '', false)
  }

  return (
    <div className="shortcuts-tab-workspace custom-scrollbar select-none">
      {/* 1. Header Toolbar */}
      <div className="shortcuts-tab-header">
        <div className="shortcuts-header-top">
          <div className="shortcuts-title-group">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" className="text-primary">
              <path d="M14 2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2h2v2H3V5zm3 0h2v2H6V5zm3 0h2v2H9V5zm3 0h1v2h-1V5zM3 8h1v2H3V8zm2 0h6v2H5V8zm7 0h1v2h-1V8z" />
            </svg>
            <h2 className="shortcuts-main-title">Keyboard Shortcuts</h2>
            <span className="shortcuts-count-badge">{filteredItems.length} Commands</span>
            {totalConflictsCount > 0 && (
              <span
                className="shortcuts-pill conflict-pill"
                style={{ cursor: 'pointer', padding: '2px 8px', fontSize: '11px' }}
                onClick={() => setSelectedCategory('conflicts')}
                title="Click to view all conflicting keybindings"
              >
                ⚠️ {totalConflictsCount} Conflicts Detected
              </span>
            )}
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
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
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
          {categories.map((cat) => {
            const isConflictsCat = cat === 'conflicts'
            const label = isConflictsCat
              ? `⚠️ Conflicts (${totalConflictsCount})`
              : cat === 'all'
              ? 'All Commands'
              : cat

            return (
              <button
                key={cat}
                type="button"
                className={`shortcuts-pill ${isConflictsCat ? 'conflict-pill' : ''} ${
                  selectedCategory === cat ? 'active' : ''
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {label}
              </button>
            )
          })}
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
            {filteredItems.map((item) => {
              const conflicts = getConflictsForItem(item)
              const hasConflict = conflicts.length > 0

              return (
                <tr
                  key={item.id}
                  className={`shortcut-table-row ${hasConflict ? 'has-conflict' : ''}`}
                  onClick={() => startEditing(item)}
                  title="Click to change shortcut"
                >
                  <td>
                    <div className="shortcut-cmd-name">{item.title}</div>
                    <div className="shortcut-cmd-desc">{item.desc}</div>
                    {hasConflict && (
                      <div
                        className="shortcut-conflict-warning-badge"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSearchQuery(conflicts[0].title)
                        }}
                        title={`Shortcut Conflict: "${item.key}" is also assigned to "${conflicts.map((c) => c.title).join('", "')}". Click to filter.`}
                      >
                        <span className="material-symbols-outlined conflict-icon">warning</span>
                        <span>
                          Conflict: Also used by <strong>{conflicts[0].title}</strong>
                          {conflicts.length > 1 ? ` (+${conflicts.length - 1} more)` : ''}
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="shortcut-key-wrapper">
                      {item.key ? (
                        item.key.split('+').map((segment, idx) => (
                          <React.Fragment key={idx}>
                            {idx > 0 && <span className="key-plus">+</span>}
                            <kbd className={`key-chip ${hasConflict ? 'key-chip-conflict' : ''}`}>
                              {segment.trim()}
                            </kbd>
                          </React.Fragment>
                        ))
                      ) : (
                        <span className="key-unassigned" style={{ color: 'var(--text-muted)', fontSize: '11px', fontStyle: 'italic' }}>
                          Unassigned
                        </span>
                      )}
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
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                        </svg>
                      </button>
                      {item.key && (
                        <button
                          type="button"
                          className="shortcut-btn-icon clear"
                          onClick={(e) => handleClearSingle(e, item)}
                          title="Unbind / Clear Keybinding"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
                        </button>
                      )}
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
              )
            })}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <div className="shortcuts-empty-state">
            <span className="material-symbols-outlined">search_off</span>
            <p>
              {selectedCategory === 'conflicts'
                ? 'No conflicting keyboard shortcuts found! All keybindings are unique.'
                : `No keybindings found matching "${searchQuery}"`}
            </p>
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
                Press the desired key combination on your keyboard, then choose an action below or press <strong>Enter</strong>.
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
                      <kbd key={i} className="recorder-kbd-chip">
                        {seg.trim()}
                      </kbd>
                    ))}
                  </div>
                ) : (
                  <span className="recorder-placeholder">Press key combination...</span>
                )}
              </div>

              {/* Prominent Collision Warning if key combination is already used */}
              {recordedConflicts.length > 0 && (
                <div className="recorder-conflict-warning">
                  <span className="material-symbols-outlined conflict-warning-icon">warning</span>
                  <div className="recorder-conflict-text">
                    <div className="recorder-conflict-title">Shortcut Collision Detected</div>
                    <div className="recorder-conflict-msg">
                      Combination <kbd className="recorder-kbd-inline">{recordedKey}</kbd> is currently used by{' '}
                      <strong>{recordedConflicts.map((c) => `"${c.title}"`).join(', ')}</strong>.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="key-recorder-footer">
              <button
                type="button"
                className="btn-recorder-clear"
                onClick={() => handleSaveKeybinding('', false)}
                title="Remove shortcut binding for this command"
              >
                Unbind Key
              </button>
              <button
                type="button"
                className="btn-recorder-cancel"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </button>

              {recordedConflicts.length > 0 ? (
                <>
                  <button
                    type="button"
                    className="btn-recorder-save-anyway"
                    onClick={() => handleSaveKeybinding(recordedKey, false)}
                    title="Keep both assignments (may cause conflict when pressed)"
                  >
                    Save Anyway
                  </button>
                  <button
                    type="button"
                    className="btn-recorder-replace"
                    onClick={() => handleSaveKeybinding(recordedKey, true)}
                    title={`Assign "${recordedKey}" to "${editingItem.title}" and unbind from "${recordedConflicts[0].title}"`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>swap_horiz</span>
                    Replace &amp; Assign
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-recorder-save"
                  onClick={() => handleSaveKeybinding(recordedKey, false)}
                  disabled={!recordedKey}
                >
                  Save Shortcut
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
