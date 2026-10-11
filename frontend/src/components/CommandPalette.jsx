import React, { useState, useEffect, useRef } from 'react'

export default function CommandPalette({
  isOpen,
  onClose,
  commands = []
}) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  // Filter commands by query
  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase()
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.category && cmd.category.toLowerCase().includes(q)) ||
      (cmd.description && cmd.description.toLowerCase().includes(q))
    )
  })

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action()
        onClose()
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
        {/* Input bar */}
        <div className="palette-input-wrapper">
          <span className="material-symbols-outlined palette-search-icon">search</span>
          <input
            ref={inputRef}
            type="text"
            className="palette-input"
            placeholder="Type a command, action, or template name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="palette-esc-kbd">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="palette-list custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="palette-empty">
              <span className="material-symbols-outlined">search_off</span>
              <p>No matching commands found for "{query}"</p>
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
                    {cmd.shortcut && (
                      <kbd className="palette-item-shortcut">{cmd.shortcut}</kbd>
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
          <span><kbd className="footer-kbd">Esc</kbd> dismiss</span>
        </div>
      </div>
    </div>
  )
}
