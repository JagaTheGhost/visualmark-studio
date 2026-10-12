import React, { useState, useEffect, useRef } from 'react'

export default function CommandPalette({
  isOpen,
  onClose,
  commands = [],
  onConfigureKeybinding = () => {}
}) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Filter commands by query
  const filteredCommands = commands.filter((cmd) => {
    // Strip leading '>' if present
    const cleanQuery = query.startsWith('>') ? query.slice(1).trim().toLowerCase() : query.trim().toLowerCase()
    if (!cleanQuery) return true

    return (
      cmd.title.toLowerCase().includes(cleanQuery) ||
      (cmd.category && cmd.category.toLowerCase().includes(cleanQuery)) ||
      (cmd.description && cmd.description.toLowerCase().includes(cleanQuery)) ||
      (cmd.shortcut && cmd.shortcut.toLowerCase().includes(cleanQuery))
    )
  })

  // Auto focus input when modal opens
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

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard navigation & execution
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = filteredCommands[selectedIndex]
      if (selected) {
        if (e.altKey) {
          // Alt+Enter directly opens Keybinding Configuration (VS Code shortcut)
          onConfigureKeybinding(selected)
          onClose()
        } else {
          selected.action()
          onClose()
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Input bar matching VS Code Quick Input */}
        <div className="palette-input-wrapper">
          <span className="palette-prompt-symbol">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            placeholder="Type a command to run, or click ⚙ to configure keybinding..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
          <kbd className="palette-esc-kbd">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="palette-list custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="palette-empty">
              <span className="material-symbols-outlined">search_off</span>
              <p>No matching commands found</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={cmd.id || idx}
                  className={`palette-item ${isSelected ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    cmd.action()
                    onClose()
                  }}
                >
                  <div className="palette-item-left">
                    <span className="material-symbols-outlined palette-item-icon">
                      {cmd.icon || 'terminal'}
                    </span>
                    <div>
                      <div className="palette-item-title">{cmd.title}</div>
                      {cmd.description && (
                        <div className="palette-item-desc">{cmd.description}</div>
                      )}
                    </div>
                  </div>

                  <div className="palette-item-right">
                    {/* Configure Keybinding Gear Button (VS Code Parity - Matching Image 3) */}
                    <button
                      type="button"
                      className="palette-gear-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        onConfigureKeybinding(cmd)
                        onClose()
                      }}
                      title="Configure Keybinding"
                      data-tooltip="Configure Keybinding"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                        settings
                      </span>
                    </button>

                    {/* Keybinding Chips */}
                    {cmd.shortcut && (
                      <div className="palette-shortcut-chips">
                        {cmd.shortcut.split('+').map((segment, kIdx) => (
                          <React.Fragment key={kIdx}>
                            {kIdx > 0 && <span className="chip-plus">+</span>}
                            <kbd className="palette-item-shortcut">{segment.trim()}</kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {cmd.category && (
                      <span className="palette-item-category">{cmd.category}</span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="palette-footer">
          <span><kbd className="footer-kbd">↑↓</kbd> navigate</span>
          <span><kbd className="footer-kbd">Enter</kbd> execute</span>
          <span><kbd className="footer-kbd">Alt+Enter</kbd> / <kbd className="footer-kbd">⚙</kbd> configure keybinding</span>
          <span><kbd className="footer-kbd">Esc</kbd> dismiss</span>
        </div>
      </div>
    </div>
  )
}
