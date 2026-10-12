import React from 'react'
import { useToast } from '../context/ToastContext'

const TYPE_ICONS = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
  loading: 'sync'
}

/**
 * Format string messages to highlight file names, paths, or quoted tokens in IDE style
 */
export function renderToastTokens(text) {
  if (typeof text !== 'string') return text

  // Split on quotes, backticks, or file paths
  const parts = text.split(/(["'`][^"'`]+["'`])/g)
  if (parts.length === 1) return text

  return parts.map((part, idx) => {
    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'")) ||
      (part.startsWith('`') && part.endsWith('`'))
    ) {
      const clean = part.slice(1, -1)
      return (
        <code key={idx} className="ide-toast-token">
          {clean}
        </code>
      )
    }
    return part
  })
}

/**
 * Individual Toast Card with VS Code / Antigravity IDE aesthetic
 */
export function ToastCard({ toast, onDismiss, onPause, onResume }) {
  const { id, message, type = 'info', source = 'IDE', action, duration } = toast
  const icon = TYPE_ICONS[type] || 'info'
  const isSpin = type === 'loading'

  return (
    <div
      className={`ide-toast-card ide-toast-${type}`}
      onMouseEnter={() => onPause && onPause(id)}
      onMouseLeave={() => onResume && onResume(id, 2000)}
      role="alert"
    >
      {/* 1. Header Bar: Severity Icon, Category Source Badge, and Close Button */}
      <div className="ide-toast-header">
        <div className="ide-toast-header-left">
          <span className={`material-symbols-outlined ide-toast-icon ${isSpin ? 'spin' : ''}`}>
            {icon}
          </span>
          <span className="ide-toast-source-badge">{source}</span>
        </div>

        <button
          type="button"
          className="ide-toast-close-btn"
          onClick={() => onDismiss(id)}
          title="Dismiss notification"
        >
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
          </svg>
        </button>
      </div>

      {/* 2. Message Body */}
      <div className="ide-toast-body">
        <div className="ide-toast-message">
          {renderToastTokens(message)}
        </div>

        {/* 3. Action Buttons (VS Code Button Row) */}
        {action && (
          <div className="ide-toast-actions-row">
            <button
              type="button"
              className="ide-toast-action-btn primary"
              onClick={() => {
                try {
                  action.onClick?.()
                } finally {
                  onDismiss(id)
                }
              }}
            >
              <span>{action.label}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Ultra-thin Flush Countdown Bar */}
      {duration > 0 && (
        <div className="ide-toast-progress-track">
          <div
            className="ide-toast-progress-fill"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  )
}

/**
 * Stacked Toast Viewport Container (Bottom Right Floating Anchor)
 */
export function ToastContainer({ toasts: propToasts, onDismiss: propDismiss }) {
  let ctx = null
  try {
    ctx = useToast()
  } catch {
    // fallback if used outside provider
  }

  const toasts = propToasts || ctx?.toasts || []
  const dismissToast = propDismiss || ctx?.dismissToast || (() => {})
  const pauseToastTimer = ctx?.pauseToastTimer
  const resumeToastTimer = ctx?.resumeToastTimer
  const isHistoryOpen = ctx?.isHistoryOpen

  // If Notification Center history drawer is open, don't float cards over it
  if (isHistoryOpen) return null
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="ide-toast-viewport" aria-live="polite" aria-atomic="true">
      {toasts.map((item) => (
        <ToastCard
          key={item.id}
          toast={item}
          onDismiss={dismissToast}
          onPause={pauseToastTimer}
          onResume={resumeToastTimer}
        />
      ))}
    </div>
  )
}

/**
 * Notification Center History Flyout Panel (VS Code Style)
 */
export function NotificationHistoryPanel() {
  const {
    history,
    isHistoryOpen,
    toggleHistory,
    clearHistory,
    removeHistoryItem,
    toastFilterLevel,
    setToastFilterLevel
  } = useToast()

  // Close Notification Center on Escape key or clicking outside
  React.useEffect(() => {
    if (!isHistoryOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        toggleHistory()
      }
    }

    const handleDocumentClick = (e) => {
      if (!e.target.closest('.ide-notification-drawer') && !e.target.closest('.notification-bell-btn')) {
        toggleHistory()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handleDocumentClick)
    }, 50)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
      window.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [isHistoryOpen, toggleHistory])

  if (!isHistoryOpen) return null

  const handleOpenSettings = () => {
    toggleHistory()
    window.dispatchEvent(new CustomEvent('open-settings-tab', { detail: 'notifications' }))
  }

  return (
    <div className="ide-notification-drawer" onClick={(e) => e.stopPropagation()}>
      {/* 1. Header Bar */}
      <div className="ide-drawer-header">
        <div className="ide-drawer-header-title">
          <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#cccccc' }}>
            notifications
          </span>
          <span className="ide-drawer-title-text">NOTIFICATIONS</span>
        </div>

        <div className="ide-drawer-header-actions">
          {/* Quick Level Filter */}
          <select
            className="ide-drawer-level-select"
            value={toastFilterLevel}
            onChange={(e) => setToastFilterLevel(e.target.value)}
            title="Notification Popup Filter Level"
          >
            <option value="important">Strict: Important Only (Recommended)</option>
            <option value="balanced">Balanced: Standard Notifications</option>
            <option value="all">Verbose: All Popups</option>
            <option value="errors">Errors Only</option>
            <option value="silent">Do Not Disturb (Silent)</option>
          </select>

          {history.length > 0 && (
            <button
              type="button"
              className="ide-drawer-btn-icon"
              onClick={clearHistory}
              title="Clear all notifications"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete_sweep</span>
            </button>
          )}

          <button
            type="button"
            className="ide-drawer-btn-icon"
            onClick={handleOpenSettings}
            title="Notification Settings"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>settings</span>
          </button>

          <button
            type="button"
            className="ide-drawer-btn-icon"
            onClick={toggleHistory}
            title="Close"
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Notification List */}
      <div className="ide-drawer-list custom-scrollbar">
        {history.length === 0 ? (
          <div className="ide-drawer-empty">
            <span className="material-symbols-outlined ide-drawer-empty-icon">notifications_none</span>
            <p className="ide-drawer-empty-text">No Notifications</p>
          </div>
        ) : (
          history.map((item) => {
            const icon = TYPE_ICONS[item.type] || 'info'
            const isSpin = item.type === 'loading'

            return (
              <div key={item.id} className={`ide-drawer-item ide-drawer-item-${item.type || 'info'}`}>
                {/* Left Severity Icon */}
                <div className="ide-drawer-item-icon-wrap">
                  <span className={`material-symbols-outlined ide-drawer-item-icon ${isSpin ? 'spin' : ''}`}>
                    {icon}
                  </span>
                </div>

                {/* Content */}
                <div className="ide-drawer-item-content">
                  <div className="ide-drawer-item-meta">
                    <span className="ide-drawer-source-tag">{item.source || 'IDE'}</span>
                    <span className="ide-drawer-timestamp">{item.time} &bull; {item.date}</span>
                    {item.important && (
                      <span className="ide-drawer-important-pill" title="Important Notification">
                        IMPORTANT
                      </span>
                    )}
                  </div>

                  <div className="ide-drawer-item-message">
                    {renderToastTokens(item.message)}
                  </div>

                  {item.action && (
                    <div className="ide-drawer-action-wrap">
                      <button
                        type="button"
                        className="ide-drawer-item-action-btn"
                        onClick={() => item.action.onClick?.()}
                      >
                        {item.action.label}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Individual Dismiss on Hover */}
                <button
                  type="button"
                  className="ide-drawer-item-remove-btn"
                  onClick={() => removeHistoryItem(item.id)}
                  title="Remove from history"
                >
                  <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 7.293l4.146-4.147a.5.5 0 0 1 .708.708L8.707 8l4.147 4.146a.5.5 0 0 1-.708.708L8 8.707l-4.146 4.147a.5.5 0 0 1-.708-.708L7.293 8 3.146 3.854a.5.5 0 1 1 .708-.708L8 7.293z"/>
                  </svg>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* 3. Footer Bar */}
      <div className="ide-drawer-footer">
        <span className="ide-drawer-footer-text">
          {toastFilterLevel === 'important' && 'Filter: Important & Warnings only (Routine actions muted)'}
          {toastFilterLevel === 'all' && 'Filter: All notifications (Verbose popups)'}
          {toastFilterLevel === 'errors' && 'Filter: Errors only'}
          {toastFilterLevel === 'silent' && 'Filter: Do Not Disturb (Popups silenced)'}
        </span>
      </div>
    </div>
  )
}

/**
 * Backwards-compatible default export
 */
export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null
  return (
    <ToastCard
      toast={{ id: 'legacy-toast', message, type, duration: 3000 }}
      onDismiss={() => onClose && onClose()}
    />
  )
}
