import React, { useState, useEffect, useRef } from 'react'
import { LANGUAGE_MODES, detectLanguageFromFilename } from '../../data/languageModes'

export default function LanguageModeModal({
  isOpen,
  onClose,
  activeLanguage = 'markdown',
  activeFile = 'README.md',
  onSelectLanguage = () => {}
}) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const detectedMode = detectLanguageFromFilename(activeFile)

  // Build list including "Auto Detect" option at top
  const allItems = [
    {
      id: 'auto-detect',
      label: `Auto Detect (${detectedMode.toUpperCase()})`,
      category: 'Automatic',
      color: '#38bdf8',
      icon: 'auto_fix_high',
      desc: `Automatically detect based on file extension (${activeFile})`,
      targetMode: detectedMode
    },
    ...LANGUAGE_MODES.map(m => ({
      ...m,
      targetMode: m.id
    }))
  ]

  // Filter items based on query
  const filteredItems = allItems.filter(item => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.desc && item.desc.toLowerCase().includes(q)) ||
      (item.extensions && item.extensions.some(ext => ext.toLowerCase().includes(q))) ||
      item.id.toLowerCase().includes(q)
    )
  })

  // Auto-focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 50)
    }
  }, [isOpen])

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation & selection
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = filteredItems[selectedIndex]
      if (selected) {
        onSelectLanguage(selected.targetMode)
        onClose()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div
        className="palette-container"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="palette-input-wrapper">
          <span className="material-symbols-outlined palette-search-icon">
            code
          </span>
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            placeholder="Select Language Mode (Type to filter syntax modes)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            spellCheck={false}
          />
          <kbd className="palette-esc-kbd">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="palette-list custom-scrollbar" style={{ maxHeight: '380px' }}>
          {filteredItems.length === 0 ? (
            <div className="palette-empty">
              <span className="material-symbols-outlined">search_off</span>
              <p>No matching language mode found</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              const isCurrent = item.targetMode === activeLanguage

              return (
                <div
                  key={item.id}
                  className={`palette-item ${isSelected ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    onSelectLanguage(item.targetMode)
                    onClose()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px'
                  }}
                >
                  <div className="palette-item-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: `${item.color}18`,
                        border: `1px solid ${item.color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color,
                        flexShrink: 0
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        {item.icon || 'code'}
                      </span>
                    </div>

                    <div>
                      <div
                        className="palette-item-title"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: isCurrent ? 600 : 500
                        }}
                      >
                        <span>{item.label}</span>
                        {isCurrent && (
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(56, 189, 248, 0.2)',
                              color: '#38bdf8',
                              fontWeight: 600
                            }}
                          >
                            ACTIVE
                          </span>
                        )}
                      </div>
                      {item.desc && (
                        <div className="palette-item-desc" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          {item.desc}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="palette-item-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.extensions && item.extensions.length > 0 && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {item.extensions.slice(0, 2).join(', ')}
                      </span>
                    )}

                    <span className="palette-item-category">
                      {item.category}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="palette-footer">
          <span><kbd className="footer-kbd">↑↓</kbd> navigate</span>
          <span><kbd className="footer-kbd">Enter</kbd> select language</span>
          <span><kbd className="footer-kbd">Esc</kbd> dismiss</span>
          <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
            Configuring: <strong style={{ color: 'var(--text-primary)' }}>{activeFile || 'Untitled'}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
