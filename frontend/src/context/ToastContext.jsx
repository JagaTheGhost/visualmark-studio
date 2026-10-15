import React, { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react'

const ToastContext = createContext(null)

let toastCounter = 0

/**
 * Infer or normalize source category (e.g. GIT, WORKSPACE, FILE, LINTER, UPDATE, EXPORT, STUDIO, IDE)
 */
function resolveNotificationSource(message, explicitSource) {
  if (explicitSource) return String(explicitSource).toUpperCase()
  const text = String(message || '').toLowerCase()
  if (text.includes('git') || text.includes('commit') || text.includes('branch') || text.includes('repo')) return 'GIT'
  if (text.includes('workspace') || text.includes('folder') || text.includes('root')) return 'WORKSPACE'
  if (text.includes('update') || text.includes('download') || text.includes('version')) return 'UPDATE'
  if (text.includes('export') || text.includes('pdf') || text.includes('html') || text.includes('zip')) return 'EXPORT'
  if (text.includes('lint') || text.includes('problem') || text.includes('diagnostic')) return 'LINTER'
  if (text.includes('file') || text.includes('draft') || text.includes('saved') || text.includes('doc')) return 'FILE'
  if (text.includes('snippet') || text.includes('template') || text.includes('table') || text.includes('diagram') || text.includes('badge')) return 'STUDIO'
  return 'IDE'
}

/**
 * Detect minor / routine actions (e.g. file opening, path copying, tab switching)
 * that should not distract the user with floating toast popups under Strict/Important mode.
 */
function isMinorAction(message, options, type) {
  if (options?.minor === true || options?.priority === 'minor') return true
  if (options?.important === true || options?.priority === 'important' || options?.priority === 'critical') return false
  if (type === 'error' || type === 'warning' || type === 'loading' || options?.action) return false

  const text = String(message || '').toLowerCase().trim()
  return (
    text.startsWith('opened ') ||
    text.startsWith('✓ opened') ||
    text.startsWith('loaded ') ||
    text.startsWith('copied relative path') ||
    text.startsWith('copied full path') ||
    text.includes('copied to clipboard') ||
    text.includes('cleared recently opened') ||
    text.startsWith('switching to ') ||
    text.startsWith('reset active markdown') ||
    text.includes('auto-recovered')
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('visualmark_notification_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [unreadCount, setUnreadCount] = useState(0)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const isHistoryOpenRef = useRef(false)
  const activeTimers = useRef(new Map())
  const lastToastRef = useRef({ message: '', type: '', time: 0, id: null })

  // Runtime Problems list pushed from errors and warnings instead of popup toasts
  const [runtimeProblems, setRuntimeProblems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('visualmark_runtime_problems')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const clearRuntimeProblems = useCallback(() => {
    setRuntimeProblems([])
    try {
      sessionStorage.removeItem('visualmark_runtime_problems')
    } catch {}
  }, [])

  const removeRuntimeProblem = useCallback((id) => {
    setRuntimeProblems((prev) => {
      const updated = prev.filter((p) => p.id !== id)
      try {
        sessionStorage.setItem('visualmark_runtime_problems', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }, [])

  // Synchronize isHistoryOpenRef so showToast always has the real-time open state
  React.useEffect(() => {
    isHistoryOpenRef.current = isHistoryOpen
  }, [isHistoryOpen])

  // Notification popup filter level: 'important' (default) | 'balanced' | 'all' | 'errors' | 'silent'
  const [toastFilterLevel, setToastFilterLevelState] = useState(() => {
    try {
      return localStorage.getItem('visualmark_toast_level') || 'important'
    } catch {
      return 'important'
    }
  })

  const setToastFilterLevel = useCallback((level) => {
    setToastFilterLevelState(level)
    try {
      localStorage.setItem('visualmark_toast_level', level)
    } catch {}
  }, [])

  // Dismiss a specific toast by id
  const dismissToast = useCallback((id) => {
    if (activeTimers.current.has(id)) {
      clearTimeout(activeTimers.current.get(id))
      activeTimers.current.delete(id)
    }
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // Clear all visible toasts
  const clearAllToasts = useCallback(() => {
    activeTimers.current.forEach((t) => clearTimeout(t))
    activeTimers.current.clear()
    setToasts([])
  }, [])

  // Show a toast message with options
  const showToast = useCallback((message, type = 'info', options = {}) => {
    if (!message) return null

    // Support object signature: showToast({ message, type, ... })
    let resolvedMessage = message
    let resolvedType = type
    let resolvedOpts = options

    if (typeof message === 'object' && message !== null && !React.isValidElement(message)) {
      resolvedMessage = message.message || ''
      resolvedType = message.type || 'info'
      resolvedOpts = message
    }

    // Deduplicate rapid repeat of the exact same message within 1.2 seconds
    const now = Date.now()
    if (
      lastToastRef.current.message === resolvedMessage &&
      lastToastRef.current.type === resolvedType &&
      now - lastToastRef.current.time < 1200
    ) {
      return lastToastRef.current.id
    }

    const id = resolvedOpts.id || `toast-${Date.now()}-${++toastCounter}`
    lastToastRef.current = { message: resolvedMessage, type: resolvedType, time: now, id }
    const timestamp = new Date()
    const source = resolveNotificationSource(resolvedMessage, resolvedOpts.source)

    // Errors and warnings: Route to ProblemsTab instead of treating them as floating toast popups
    if (resolvedType === 'error' || resolvedType === 'warning') {
      const problemSource = resolvedOpts.source || source || (resolvedType === 'error' ? 'System Error' : 'System Warning')
      const problemFile = resolvedOpts.file || 'Workspace'
      const problemEntry = {
        id: `prob-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        severity: resolvedType,
        message: typeof resolvedMessage === 'string' ? resolvedMessage : String(resolvedMessage),
        source: problemSource,
        file: problemFile,
        line: resolvedOpts.line || null,
        col: resolvedOpts.col || null,
        timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rawTimestamp: Date.now()
      }

      setRuntimeProblems((prev) => {
        const filtered = prev.filter((p) => p.message !== problemEntry.message)
        const next = [problemEntry, ...filtered].slice(0, 50)
        try {
          sessionStorage.setItem('visualmark_runtime_problems', JSON.stringify(next))
        } catch {}
        return next
      })

      // Append to Notification History Log for persistent audit record
      setHistory((prev) => {
        const isCurrentlyOpen = isHistoryOpenRef.current
        const entry = {
          id,
          message: typeof resolvedMessage === 'string' ? resolvedMessage : 'Notification',
          type: resolvedType,
          source: problemSource,
          important: true,
          minor: false,
          time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: timestamp.toLocaleDateString(),
          read: isCurrentlyOpen ? true : false,
          action: resolvedOpts.action || null
        }
        if (!isCurrentlyOpen) {
          setUnreadCount((c) => c + 1)
        }
        const updated = [entry, ...prev.filter((h) => h.id !== id)].slice(0, 60)
        try {
          localStorage.setItem('visualmark_notification_history', JSON.stringify(updated))
        } catch {}
        return updated
      })

      return id
    }

    // Determine minor vs important
    const isMinor = isMinorAction(resolvedMessage, resolvedOpts, resolvedType)
    const isImportant = Boolean(
      resolvedOpts.important ||
      resolvedOpts.priority === 'important' ||
      resolvedOpts.priority === 'critical' ||
      resolvedType === 'error' ||
      resolvedType === 'warning' ||
      resolvedType === 'loading' ||
      resolvedOpts.action ||
      (!isMinor && (
        (resolvedType === 'success' && (
          String(resolvedMessage).toLowerCase().includes('saved') ||
          String(resolvedMessage).toLowerCase().includes('exported') ||
          String(resolvedMessage).toLowerCase().includes('update')
        )) ||
        source === 'UPDATE' ||
        source === 'EXPORT'
      ))
    )

    // Determine auto-dismiss duration
    let duration = resolvedOpts.duration
    if (duration === undefined) {
      switch (resolvedType) {
        case 'error':
          duration = 6000
          break
        case 'warning':
          duration = 5000
          break
        case 'loading':
          duration = 0 // Sticky until manually dismissed
          break
        case 'success':
          duration = 3200
          break
        default:
          duration = 3500
          break
      }
    }

    const newToast = {
      id,
      message: resolvedMessage,
      type: resolvedType,
      source,
      important: isImportant,
      minor: isMinor,
      action: resolvedOpts.action || null, // { label: string, onClick: () => void }
      duration,
      timestamp,
      createdAt: Date.now()
    }

    // Check filter level to decide if floating popup appears
    let shouldPop = true
    if (toastFilterLevel === 'silent') {
      shouldPop = false
    } else if (toastFilterLevel === 'errors') {
      shouldPop = resolvedType === 'error'
    } else if (toastFilterLevel === 'important') {
      // Strict: only important/critical events pop up, routine actions are quiet
      shouldPop = isImportant && !isMinor
    } else if (toastFilterLevel === 'balanced') {
      // Balanced: standard notifications pop up, minor routine actions are quiet
      shouldPop = !isMinor || isImportant
    } else {
      shouldPop = true // 'all' (verbose)
    }

    if (shouldPop) {
      // Add to visible queue (max 4 visible simultaneously, newest on top)
      setToasts((prev) => {
        const filtered = prev.filter((t) => t.id !== id)
        const next = [newToast, ...filtered]
        return next.slice(0, 4)
      })

      // Auto-dismiss timer if duration > 0
      if (duration > 0) {
        if (activeTimers.current.has(id)) {
          clearTimeout(activeTimers.current.get(id))
        }
        const timer = setTimeout(() => {
          dismissToast(id)
        }, duration)
        activeTimers.current.set(id, timer)
      }
    }

    // Append to Notification History Log (max 60 entries)
    setHistory((prev) => {
      const isCurrentlyOpen = isHistoryOpenRef.current
      const entry = {
        id,
        message: typeof resolvedMessage === 'string' ? resolvedMessage : 'Notification',
        type: resolvedType,
        source,
        important: isImportant,
        minor: isMinor,
        time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: timestamp.toLocaleDateString(),
        read: isCurrentlyOpen ? true : false,
        action: resolvedOpts.action || null
      }
      const updated = [entry, ...prev.filter((h) => h.id !== id)].slice(0, 60)
      try {
        localStorage.setItem('visualmark_notification_history', JSON.stringify(updated))
      } catch {}
      return updated
    })

    // Increment unread badge count only for non-minor notifications when drawer is closed
    if (!isHistoryOpenRef.current && (!isMinor || toastFilterLevel === 'all')) {
      setUnreadCount((c) => c + 1)
    }

    return id
  }, [dismissToast, toastFilterLevel])

  // Pause timer on hover
  const pauseToastTimer = useCallback((id) => {
    if (activeTimers.current.has(id)) {
      clearTimeout(activeTimers.current.get(id))
      activeTimers.current.delete(id)
    }
  }, [])

  // Resume timer on unhover
  const resumeToastTimer = useCallback((id, remainingDuration = 2000) => {
    if (!activeTimers.current.has(id)) {
      const timer = setTimeout(() => {
        dismissToast(id)
      }, Math.max(1200, remainingDuration))
      activeTimers.current.set(id, timer)
    }
  }, [dismissToast])

  // Toggle Notification History Panel
  const toggleHistory = useCallback(() => {
    setIsHistoryOpen((prev) => {
      const next = !prev
      isHistoryOpenRef.current = next
      if (next) {
        // Clear active floating banners so they don't cover the history drawer
        clearAllToasts()
        // Mark all as read
        setUnreadCount(0)
        setHistory((list) => {
          const marked = list.map((item) => ({ ...item, read: true }))
          try {
            localStorage.setItem('visualmark_notification_history', JSON.stringify(marked))
          } catch {}
          return marked
        })
      }
      return next
    })
  }, [clearAllToasts])

  // Remove individual notification from history
  const removeHistoryItem = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem('visualmark_notification_history', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }, [])

  // Clear Notification History
  const clearHistory = useCallback(() => {
    setHistory([])
    setUnreadCount(0)
    try {
      localStorage.removeItem('visualmark_notification_history')
    } catch {}
  }, [])

  // Convenience helper object: toast.success, toast.error, etc.
  const toast = useMemo(() => ({
    success: (msg, opts) => showToast(msg, 'success', opts),
    error: (msg, opts) => showToast(msg, 'error', opts),
    warning: (msg, opts) => showToast(msg, 'warning', opts),
    info: (msg, opts) => showToast(msg, 'info', opts),
    loading: (msg, opts) => showToast(msg, 'loading', opts),
    dismiss: dismissToast,
    clearAll: clearAllToasts,
    toggleHistory,
    clearHistory,
    removeHistoryItem,
    clearRuntimeProblems,
    removeRuntimeProblem
  }), [showToast, dismissToast, clearAllToasts, toggleHistory, clearHistory, removeHistoryItem, clearRuntimeProblems, removeRuntimeProblem])

  const value = useMemo(() => ({
    toasts,
    history,
    unreadCount,
    isHistoryOpen,
    toastFilterLevel,
    setToastFilterLevel,
    showToast,
    toast,
    dismissToast,
    clearAllToasts,
    pauseToastTimer,
    resumeToastTimer,
    toggleHistory,
    clearHistory,
    removeHistoryItem,
    runtimeProblems,
    clearRuntimeProblems,
    removeRuntimeProblem
  }), [
    toasts,
    history,
    unreadCount,
    isHistoryOpen,
    toastFilterLevel,
    setToastFilterLevel,
    showToast,
    toast,
    dismissToast,
    clearAllToasts,
    pauseToastTimer,
    resumeToastTimer,
    toggleHistory,
    clearHistory,
    removeHistoryItem,
    runtimeProblems,
    clearRuntimeProblems,
    removeRuntimeProblem
  ])

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
