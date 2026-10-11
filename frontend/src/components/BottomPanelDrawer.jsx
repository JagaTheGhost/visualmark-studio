import React, { useState, useEffect, useRef, useMemo } from 'react'
import './BottomPanelDrawer.css'
import { APP_CURRENT_VERSION } from '../data/releaseNotes'

export default function BottomPanelDrawer({
  isOpen = false,
  onClose = () => {},
  activeTab = 'terminal', // 'problems' | 'output' | 'terminal'
  setActiveTab = () => {},
  workspaceDirectory = null,
  activeFile = 'README.md',
  problems = [],
  onSelectProblem = () => {},
  systemLogs = [],
  onClearLogs = () => {}
}) {
  const [panelHeight, setPanelHeight] = useState(260)
  const [isDragging, setIsDragging] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [shellType, setShellType] = useState('powershell') // 'powershell' | 'cmd'
  const [terminalHistory, setTerminalHistory] = useState([
    {
      id: 1,
      type: 'system',
      text: `VisualMark Studio Integrated Terminal [Version ${APP_CURRENT_VERSION}]\n(c) 2026 VisualMark Studio. All rights reserved.`
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [problemsFilter, setProblemsFilter] = useState('all') // 'all' | 'errors' | 'warnings'
  const [outputChannel, setOutputChannel] = useState('system') // 'system' | 'sidecar' | 'git'

  const terminalScrollRef = useRef(null)
  const terminalInputRef = useRef(null)
  const dragStartYRef = useRef(0)
  const dragStartHeightRef = useRef(260)

  // Diagnostics counts
  const errorCount = useMemo(() => problems.filter((p) => p.severity === 'error').length, [problems])
  const warningCount = useMemo(() => problems.filter((p) => p.severity === 'warning').length, [problems])

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    if (problemsFilter === 'errors') return problems.filter((p) => p.severity === 'error')
    if (problemsFilter === 'warnings') return problems.filter((p) => p.severity === 'warning')
    return problems
  }, [problems, problemsFilter])

  // Prompt Prefix
  const cwdDisplay = useMemo(() => {
    if (workspaceDirectory?.path) {
      return workspaceDirectory.path.replace(/\//g, '\\')
    }
    return 'D:\\VisualStudio\\AI projects\\auto-readme-generator'
  }, [workspaceDirectory])

  const promptPrefix = shellType === 'powershell' ? `PS ${cwdDisplay}>` : `${cwdDisplay}>`

  // Start or restart terminal process via Electron IPC
  useEffect(() => {
    if (!isOpen || activeTab !== 'terminal') return

    if (typeof window !== 'undefined' && window.electronAPI?.startTerminalSession) {
      window.electronAPI.startTerminalSession({
        termId: 'ide-integrated-term',
        shellType,
        cwd: workspaceDirectory?.path
      }).then((res) => {
        if (res?.success) {
          setTerminalHistory((prev) => [
            ...prev,
            {
              id: Date.now(),
              type: 'system',
              text: `[Started ${shellType === 'powershell' ? 'Windows PowerShell' : 'Command Prompt'} in ${res.cwd}]`
            }
          ])
        }
      })
    }
  }, [isOpen, activeTab, shellType, workspaceDirectory?.path])

  // Subscribe to live terminal output stream
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.onTerminalSessionData) {
      const cleanup = window.electronAPI.onTerminalSessionData((payload) => {
        if (payload?.termId === 'ide-integrated-term' && payload.data) {
          setTerminalHistory((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              type: payload.isError ? 'error' : 'output',
              text: payload.data
            }
          ])
        }
      })
      return cleanup
    }
  }, [])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (activeTab === 'terminal' && terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight
    }
  }, [terminalHistory, activeTab])

  // Focus terminal input when clicking terminal view
  const handleTerminalContainerClick = () => {
    if (terminalInputRef.current) {
      terminalInputRef.current.focus()
    }
  }

  // Vertical Drag Resizing
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      const deltaY = dragStartYRef.current - e.clientY
      const nextH = Math.min(Math.max(dragStartHeightRef.current + deltaY, 140), window.innerHeight * 0.75)
      setPanelHeight(nextH)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleStartResize = (e) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartYRef.current = e.clientY
    dragStartHeightRef.current = panelHeight
  }

  const handleToggleMaximize = () => {
    if (isMaximized) {
      setPanelHeight(260)
      setIsMaximized(false)
    } else {
      setPanelHeight(Math.min(520, window.innerHeight * 0.7))
      setIsMaximized(true)
    }
  }

  // Terminal Input & Command Execution
  const handleRunCommand = (e) => {
    e.preventDefault()
    const cmd = currentInput.trim()
    if (!cmd) return

    // Special built-in: clear
    if (cmd.toLowerCase() === 'cls' || cmd.toLowerCase() === 'clear') {
      setTerminalHistory([])
      setCurrentInput('')
      return
    }

    setCommandHistory((prev) => [...prev, cmd])
    setHistoryIndex(-1)
    setTerminalHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'cmd',
        text: `${promptPrefix} ${cmd}`
      }
    ])
    setCurrentInput('')

    if (typeof window !== 'undefined' && window.electronAPI?.writeTerminalSession) {
      window.electronAPI.writeTerminalSession({
        termId: 'ide-integrated-term',
        command: cmd
      })
    } else {
      // Browser emulator fallback
      handleSimulatedCommand(cmd)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(nextIdx)
        setCurrentInput(commandHistory[nextIdx] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1
        if (nextIdx >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput('')
        } else {
          setHistoryIndex(nextIdx)
          setCurrentInput(commandHistory[nextIdx] || '')
        }
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      setCurrentInput('')
      setTerminalHistory((prev) => [
        ...prev,
        { id: Date.now(), type: 'system', text: '^C' }
      ])
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setTerminalHistory([])
    }
  }

  // In-browser mock terminal response for dev testing
  const handleSimulatedCommand = (cmd) => {
    setTimeout(() => {
      const lower = cmd.toLowerCase()
      if (lower === 'help') {
        setTerminalHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'output',
            text: 'Available Commands: dir, ls, git status, python --version, node -v, npm test, clear, cls'
          }
        ])
      } else if (lower === 'dir' || lower === 'ls') {
        setTerminalHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'output',
            text: 'Mode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\nd-----        10/10/2026   5:30 PM                backend\nd-----        10/10/2026   5:30 PM                frontend\n-a---         10/10/2026   5:30 PM           4963 README.md\n-a---         10/10/2026   5:30 PM           1093 LICENSE'
          }
        ])
      } else if (lower.startsWith('git status')) {
        setTerminalHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'output',
            text: 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nnothing to commit, working tree clean'
          }
        ])
      } else if (lower.includes('python')) {
        setTerminalHistory((prev) => [
          ...prev,
          { id: Date.now(), type: 'output', text: 'Python 3.13.5' }
        ])
      } else if (lower.includes('node')) {
        setTerminalHistory((prev) => [
          ...prev,
          { id: Date.now(), type: 'output', text: 'v20.18.0' }
        ])
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          { id: Date.now(), type: 'output', text: `Command executed: ${cmd}` }
        ])
      }
    }, 50)
  }

  const handleClearTerminal = () => {
    setTerminalHistory([])
  }

  const handleRestartTerminal = () => {
    setTerminalHistory([
      {
        id: Date.now(),
        type: 'system',
        text: `[Restarting ${shellType === 'powershell' ? 'PowerShell' : 'Command Prompt'}...]`
      }
    ])
    if (typeof window !== 'undefined' && window.electronAPI?.startTerminalSession) {
      window.electronAPI.startTerminalSession({
        termId: 'ide-integrated-term',
        shellType,
        cwd: workspaceDirectory?.path
      })
    }
  }

  if (!isOpen) return null

  return (
    <section
      className="bottom-panel-drawer select-none"
      style={{ height: `${panelHeight}px` }}
      aria-label="Bottom IDE Panel"
    >
      {/* 1. Resizer Drag Bar */}
      <div
        className={`bottom-panel-resizer ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleStartResize}
        onDoubleClick={handleToggleMaximize}
        title="Drag to resize panel, double click to maximize"
      />

      {/* 2. Panel Tab Header */}
      <header className="bottom-panel-header">
        <div className="bottom-panel-tabs">
          {/* Problems Tab */}
          <button
            type="button"
            className={`bottom-tab-btn ${activeTab === 'problems' ? 'active' : ''}`}
            onClick={() => setActiveTab('problems')}
          >
            <span>Problems</span>
            {errorCount > 0 && <span className="tab-badge error-badge">{errorCount}</span>}
            {warningCount > 0 && <span className="tab-badge warn-badge">{warningCount}</span>}
          </button>

          {/* Output Tab */}
          <button
            type="button"
            className={`bottom-tab-btn ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            <span>Output</span>
          </button>

          {/* Terminal Tab */}
          <button
            type="button"
            className={`bottom-tab-btn ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>terminal</span>
            <span>Terminal</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="bottom-panel-actions">
          {/* Terminal Controls */}
          {activeTab === 'terminal' && (
            <>
              {/* Shell Picker */}
              <select
                className="panel-select"
                value={shellType}
                onChange={(e) => setShellType(e.target.value)}
                title="Select Active Shell"
              >
                <option value="powershell">1: PowerShell</option>
                <option value="cmd">2: Command Prompt</option>
              </select>

              {/* Clear Terminal */}
              <button
                type="button"
                className="panel-action-btn"
                onClick={handleClearTerminal}
                title="Clear Terminal (Ctrl+L)"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>block</span>
              </button>

              {/* Restart Terminal */}
              <button
                type="button"
                className="panel-action-btn"
                onClick={handleRestartTerminal}
                title="Restart Terminal Session"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>refresh</span>
              </button>
            </>
          )}

          {/* Problems Controls */}
          {activeTab === 'problems' && (
            <select
              className="panel-select"
              value={problemsFilter}
              onChange={(e) => setProblemsFilter(e.target.value)}
            >
              <option value="all">All ({problems.length})</option>
              <option value="errors">Errors ({errorCount})</option>
              <option value="warnings">Warnings ({warningCount})</option>
            </select>
          )}

          {/* Output Controls */}
          {activeTab === 'output' && (
            <>
              <select
                className="panel-select"
                value={outputChannel}
                onChange={(e) => setOutputChannel(e.target.value)}
              >
                <option value="system">VisualMark Studio System</option>
                <option value="sidecar">FastAPI Sidecar</option>
                <option value="git">Git Status</option>
              </select>
              <button
                type="button"
                className="panel-action-btn"
                onClick={onClearLogs}
                title="Clear Output"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete_sweep</span>
              </button>
            </>
          )}

          <div className="panel-divider" />

          {/* Maximize / Restore Toggle */}
          <button
            type="button"
            className="panel-action-btn"
            onClick={handleToggleMaximize}
            title={isMaximized ? 'Restore Panel Height' : 'Maximize Panel Height'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {isMaximized ? 'expand_more' : 'expand_less'}
            </span>
          </button>

          {/* Close Panel Button */}
          <button
            type="button"
            className="panel-action-btn"
            onClick={onClose}
            title="Close Panel (Ctrl+J)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
          </button>
        </div>
      </header>

      {/* 3. Panel Body */}
      <div className="bottom-panel-body">
        {/* ==================== TERMINAL VIEW ==================== */}
        {activeTab === 'terminal' && (
          <div className="panel-terminal-view" onClick={handleTerminalContainerClick}>
            <div className="terminal-scroll-area" ref={terminalScrollRef}>
              <div className="terminal-welcome-banner">
                ⚡ VisualMark Studio Embedded Terminal — Active directory: {cwdDisplay}
              </div>

              {terminalHistory.map((item) => (
                <div
                  key={item.id}
                  className={`terminal-line terminal-line-${item.type}`}
                >
                  {item.text}
                </div>
              ))}

              {/* Active Prompt Line */}
              <form className="terminal-prompt-row" onSubmit={handleRunCommand}>
                <span className="terminal-prompt-label">{promptPrefix}</span>
                <input
                  ref={terminalInputRef}
                  type="text"
                  className="terminal-prompt-input"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>
            </div>
          </div>
        )}

        {/* ==================== PROBLEMS VIEW ==================== */}
        {activeTab === 'problems' && (
          <div className="panel-problems-view">
            {filteredProblems.length === 0 ? (
              <div className="problems-empty-state">
                <span className="material-symbols-outlined problems-empty-icon">check_circle</span>
                <p>No problems have been detected in the current workspace.</p>
              </div>
            ) : (
              <div className="problems-list">
                <div className="problem-file-header">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#38bdf8' }}>
                    description
                  </span>
                  <span>{activeFile}</span>
                  <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '11px', fontWeight: 'normal' }}>
                    ({filteredProblems.length} issue{filteredProblems.length !== 1 ? 's' : ''})
                  </span>
                </div>

                {filteredProblems.map((p) => (
                  <div
                    key={p.id}
                    className="problem-item-row"
                    onClick={() => onSelectProblem(p)}
                    title={`Click to navigate to line ${p.line}`}
                  >
                    <span
                      className={`material-symbols-outlined problem-icon ${
                        p.severity === 'error'
                          ? 'icon-error'
                          : p.severity === 'warning'
                          ? 'icon-warn'
                          : 'icon-info'
                      }`}
                    >
                      {p.severity === 'error' ? 'cancel' : p.severity === 'warning' ? 'warning' : 'info'}
                    </span>
                    <span className="problem-message">{p.message}</span>
                    <span className="problem-location">
                      [{p.line}, {p.col}]
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== OUTPUT VIEW ==================== */}
        {activeTab === 'output' && (
          <div className="panel-output-view">
            {systemLogs.length === 0 ? (
              <div style={{ color: '#64748b', fontStyle: 'italic', padding: '12px' }}>
                No output logged for channel "{outputChannel}".
              </div>
            ) : (
              systemLogs
                .filter((l) => !outputChannel || l.channel === outputChannel || outputChannel === 'system')
                .map((log, idx) => (
                  <div key={idx} className="output-log-line">
                    <span className="output-time">[{log.time || '17:30'}]</span>
                    <span className="output-tag">[{log.channel || 'System'}]</span>
                    <span>{log.message || log}</span>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
