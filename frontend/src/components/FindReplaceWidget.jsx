import React, { useState, useEffect, useRef } from 'react'

export default function FindReplaceWidget({
  isOpen,
  onClose,
  markdown,
  onMarkdownChange,
  showReplaceInitially = false,
  onNavigateMatch
}) {
  const [findText, setFindText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [showReplace, setShowReplace] = useState(showReplaceInitially)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [matchIndex, setMatchIndex] = useState(0)

  const findInputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => findInputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setShowReplace(showReplaceInitially)
  }, [showReplaceInitially])

  // Compute matches
  const matches = React.useMemo(() => {
    if (!findText) return []
    let flags = caseSensitive ? 'g' : 'gi'
    let pattern = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`
    }

    try {
      const regex = new RegExp(pattern, flags)
      const list = []
      let match
      while ((match = regex.exec(markdown)) !== null) {
        list.push({ index: match.index, length: match[0].length })
      }
      return list
    } catch {
      return []
    }
  }, [markdown, findText, caseSensitive, wholeWord])

  useEffect(() => {
    if (matches.length === 0) {
      setMatchIndex(0)
    } else if (matchIndex >= matches.length) {
      setMatchIndex(0)
    }
  }, [matches, matchIndex])

  // Scroll to and select current match in editor
  useEffect(() => {
    if (matches.length > 0 && matches[matchIndex]) {
      onNavigateMatch?.(matches[matchIndex], matchIndex + 1, matches.length)
    }
  }, [matchIndex, matches, onNavigateMatch])

  const handleNext = () => {
    if (matches.length === 0) return
    setMatchIndex((prev) => (prev + 1) % matches.length)
  }

  const handlePrev = () => {
    if (matches.length === 0) return
    setMatchIndex((prev) => (prev - 1 + matches.length) % matches.length)
  }

  const handleReplaceOne = () => {
    if (matches.length === 0 || !matches[matchIndex]) return
    const cur = matches[matchIndex]
    const updated =
      markdown.substring(0, cur.index) +
      replaceText +
      markdown.substring(cur.index + cur.length)
    onMarkdownChange(updated)
  }

  const handleReplaceAll = () => {
    if (matches.length === 0) return
    let flags = caseSensitive ? 'g' : 'gi'
    let pattern = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (wholeWord) {
      pattern = `\\b${pattern}\\b`
    }
    const regex = new RegExp(pattern, flags)
    const updated = markdown.replace(regex, replaceText)
    onMarkdownChange(updated)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (e.shiftKey) handlePrev()
      else handleNext()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="find-replace-overlay select-none" onKeyDown={handleKeyDown}>
      <div className="find-replace-card">
        {/* Toggle Replace Expansion Arrow */}
        <button
          type="button"
          className="find-toggle-arrow"
          onClick={() => setShowReplace((prev) => !prev)}
          title={showReplace ? 'Hide Replace' : 'Toggle Replace (Ctrl+H)'}
        >
          <span className="material-symbols-outlined icon-xs">
            {showReplace ? 'arrow_drop_down' : 'arrow_right'}
          </span>
        </button>

        {/* Inputs & Controls Stack */}
        <div className="find-fields-stack">
          {/* Row 1: Find */}
          <div className="find-row">
            <div className="find-input-wrapper">
              <input
                ref={findInputRef}
                type="text"
                className="find-input"
                placeholder="Find"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
              />
              <div className="find-options-toggles">
                <button
                  type="button"
                  className={`find-opt-btn ${caseSensitive ? 'active' : ''}`}
                  onClick={() => setCaseSensitive((prev) => !prev)}
                  title="Match Case (Alt+C)"
                >
                  Aa
                </button>
                <button
                  type="button"
                  className={`find-opt-btn ${wholeWord ? 'active' : ''}`}
                  onClick={() => setWholeWord((prev) => !prev)}
                  title="Match Whole Word (Alt+W)"
                >
                  \b
                </button>
              </div>
            </div>

            {/* Match Counter */}
            <span className="match-counter">
              {matches.length > 0 ? `${matchIndex + 1} of ${matches.length}` : 'No results'}
            </span>

            {/* Prev / Next navigation */}
            <div className="find-nav-group">
              <button
                type="button"
                className="find-nav-btn"
                onClick={handlePrev}
                disabled={matches.length === 0}
                title="Previous Match (Shift+Enter)"
              >
                <span className="material-symbols-outlined icon-xs">arrow_upward</span>
              </button>
              <button
                type="button"
                className="find-nav-btn"
                onClick={handleNext}
                disabled={matches.length === 0}
                title="Next Match (Enter)"
              >
                <span className="material-symbols-outlined icon-xs">arrow_downward</span>
              </button>
            </div>
          </div>

          {/* Row 2: Replace */}
          {showReplace && (
            <div className="replace-row">
              <div className="replace-input-wrapper">
                <input
                  type="text"
                  className="find-input"
                  placeholder="Replace"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                />
              </div>

              <div className="replace-btns-group">
                <button
                  type="button"
                  className="replace-action-btn"
                  onClick={handleReplaceOne}
                  disabled={matches.length === 0}
                  title="Replace Next Match"
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="replace-action-btn"
                  onClick={handleReplaceAll}
                  disabled={matches.length === 0}
                  title="Replace All Occurrences"
                >
                  Replace All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Close Widget */}
        <button
          type="button"
          className="find-close-btn"
          onClick={onClose}
          title="Close (Esc)"
        >
          <span className="material-symbols-outlined icon-xs">close</span>
        </button>
      </div>
    </div>
  )
}
