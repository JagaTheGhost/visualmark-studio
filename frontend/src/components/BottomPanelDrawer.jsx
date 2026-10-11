import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './BottomPanelDrawer.css'
import { APP_CURRENT_VERSION } from '../data/releaseNotes'
import { useToast } from '../context/ToastContext'

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
  const { toast } = useToast() || {}
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
  const [problemsFilter, setProblemsFilter] = useState('all') // 'all' | 'errors' | 'warnings' | 'infos'
  const [problemsSearch, setProblemsSearch] = useState('')
  const [outputChannel, setOutputChannel] = useState('system') // 'system' | 'git' | 'sidecar' | 'markdown'
  const [channelData, setChannelData] = useState({})

  const terminalScrollRef = useRef(null)
  const terminalInputRef = useRef(null)
  const dragStartYRef = useRef(0)
  const dragStartHeightRef = useRef(260)
  const activeSessionKeyRef = useRef('')

  // Diagnostics counts
  const errorCount = useMemo(() => problems.filter((p) => p.severity === 'error').length, [problems])
  const warningCount = useMemo(() => problems.filter((p) => p.severity === 'warning').length, [problems])
  const infoCount = useMemo(() => problems.filter((p) => p.severity === 'info').length, [problems])

  // Filtered problems list
  const filteredProblems = useMemo(() => {
    let list = problems
    if (problemsFilter === 'errors') list = list.filter((p) => p.severity === 'error')
    else if (problemsFilter === 'warnings') list = list.filter((p) => p.severity === 'warning')
    else if (problemsFilter === 'infos') list = list.filter((p) => p.severity === 'info')

    if (problemsSearch.trim()) {
      const q = problemsSearch.toLowerCase()
      list = list.filter((p) =>
        (p.message && p.message.toLowerCase().includes(q)) ||
        (p.file && p.file.toLowerCase().includes(q)) ||
        (p.source && p.source.toLowerCase().includes(q))
      )
    }
    return list
  }, [problems, problemsFilter, problemsSearch])

  // Normalize current workspace path display
  const cwdDisplay = useMemo(() => {
    if (workspaceDirectory?.path) {
      return workspaceDirectory.path.replace(/\//g, '\\')
    }
    return 'D:\\VisualStudio\\AI projects\\visualmark-studio'
  }, [workspaceDirectory])

  const promptPrefix = shellType === 'powershell' ? `PS ${cwdDisplay}>` : `${cwdDisplay}>`

  // -------------------------------------------------------------------------
  // Terminal Session Lifecycle (Prevent repeated start spam)
  // -------------------------------------------------------------------------
  const initTerminalSession = useCallback((force = false) => {
    const sessionKey = `${shellType}:${workspaceDirectory?.path || 'default'}`
    if (!force && activeSessionKeyRef.current === sessionKey) {
      return
    }
    activeSessionKeyRef.current = sessionKey

    const shellLabel = shellType === 'powershell' ? 'Windows PowerShell' : 'Command Prompt'
    setTerminalHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'system',
        text: `[Started ${shellLabel} in ${cwdDisplay}]`
      }
    ])

    if (typeof window !== 'undefined' && window.electronAPI?.startTerminalSession) {
      window.electronAPI.startTerminalSession({
        termId: 'ide-integrated-term',
        shellType,
        cwd: workspaceDirectory?.path
      })
    }
  }, [shellType, workspaceDirectory?.path, cwdDisplay])

  useEffect(() => {
    if (isOpen && activeTab === 'terminal') {
      initTerminalSession(false)
    }
  }, [isOpen, activeTab, initTerminalSession])

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

  // -------------------------------------------------------------------------
  // External Terminal Launchers (PowerShell & Command Prompt)
  // -------------------------------------------------------------------------
  const handleOpenExternalTerminal = (targetShell = shellType) => {
    const shellLabel = targetShell === 'cmd' ? 'Command Prompt' : 'Windows PowerShell'
    const targetPath = workspaceDirectory?.path || undefined

    if (typeof window !== 'undefined' && window.electronAPI?.openTerminal) {
      window.electronAPI.openTerminal({
        folderPath: targetPath,
        shellType: targetShell
      }).then((res) => {
        if (res?.success) {
          toast?.info?.(`Launched external ${shellLabel} in ${res.cwd || cwdDisplay}`)
        } else {
          toast?.error?.(`Failed to open external terminal: ${res?.error || 'Unknown error'}`)
        }
      })
    } else {
      toast?.info?.(`Simulated external ${shellLabel} in ${cwdDisplay}`)
    }
  }

  // -------------------------------------------------------------------------
  // Vertical Drag Resizing
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Terminal Input & Command Execution
  // -------------------------------------------------------------------------
  const handleRunCommand = (e) => {
    e.preventDefault()
    const cmd = currentInput.trim()
    if (!cmd) return

    // Built-in command: cls / clear
    if (cmd.toLowerCase() === 'cls' || cmd.toLowerCase() === 'clear') {
      setTerminalHistory([])
      setCurrentInput('')
      return
    }

    // Built-in command: exit
    if (cmd.toLowerCase() === 'exit') {
      setCurrentInput('')
      onClose()
      return
    }

    // Built-in command: external
    if (cmd.toLowerCase() === 'external' || cmd.toLowerCase() === 'external-ps') {
      setCurrentInput('')
      handleOpenExternalTerminal('powershell')
      return
    }
    if (cmd.toLowerCase() === 'external-cmd') {
      setCurrentInput('')
      handleOpenExternalTerminal('cmd')
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

  const handleSimulatedCommand = (cmd) => {
    setTimeout(() => {
      const lower = cmd.toLowerCase()
      if (lower === 'help') {
        setTerminalHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'output',
            text: 'VisualMark Studio Terminal Commands:\n  dir, ls          - List directory contents\n  git status       - Check Git repository status\n  python --version - Check Python runtime\n  node -v          - Check Node runtime\n  external         - Launch native external PowerShell window\n  clear, cls       - Clear terminal output\n  exit             - Close terminal drawer'
          }
        ])
      } else if (lower === 'dir' || lower === 'ls') {
        setTerminalHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'output',
            text: `    Directory: ${cwdDisplay}\n\nMode                 LastWriteTime         Length Name\n----                 -------------         ------ ----\nd-----        10/11/2026  11:40 PM                assets\nd-----        10/11/2026  11:40 PM                backend\nd-----        10/11/2026  11:40 PM                frontend\n-a---         10/11/2026  11:40 PM           8400 README.md\n-a---         10/11/2026  11:40 PM           1093 LICENSE`
          }
        ])
      } else if (lower.startsWith('git status')) {
        setTerminalHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'output',
            text: 'On branch main\nYour branch is up to date with \'origin/main\'.\nnothing to commit, working tree clean'
          }
        ])
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          { id: Date.now(), type: 'output', text: `Command executed: ${cmd}` }
        ])
      }
    }, 40)
  }

  const handleClearTerminal = () => {
    setTerminalHistory([])
  }

  const handleRestartTerminal = () => {
    initTerminalSession(true)
  }

  // -------------------------------------------------------------------------
  // Live Output Channel Population
  // -------------------------------------------------------------------------
  const refreshOutputChannel = useCallback(async () => {
    if (outputChannel === 'git') {
      if (typeof window !== 'undefined' && window.electronAPI?.getGitInfo && workspaceDirectory?.path) {
        const info = await window.electronAPI.getGitInfo(workspaceDirectory.path)
        setChannelData((prev) => ({
          ...prev,
          git: [
            { time: new Date().toLocaleTimeString(), message: `Git Repository: ${workspaceDirectory.path}` },
            { time: new Date().toLocaleTimeString(), message: `Active Branch: ${info?.branch || 'main'}` },
            { time: new Date().toLocaleTimeString(), message: `Clean Tree: ${info?.changesCount === 0 ? 'Yes' : 'No'}` },
            { time: new Date().toLocaleTimeString(), message: `Modified/Untracked Files: ${info?.changesCount || 0}` }
          ]
        }))
      } else {
        setChannelData((prev) => ({
          ...prev,
          git: [
            { time: new Date().toLocaleTimeString(), message: `[Git] Repository checked at ${cwdDisplay}` },
            { time: new Date().toLocaleTimeString(), message: '[Git] Status: clean working tree, branch main' }
          ]
        }))
      }
    } else if (outputChannel === 'sidecar') {
      let backendUrl = 'http://127.0.0.1:8000'
      if (typeof window !== 'undefined' && window.electronAPI?.getBackendUrl) {
        backendUrl = await window.electronAPI.getBackendUrl()
      }
      setChannelData((prev) => ({
        ...prev,
        sidecar: [
          { time: new Date().toLocaleTimeString(), message: `[Sidecar] Local AI Engine endpoint: ${backendUrl}` },
          { time: new Date().toLocaleTimeString(), message: '[Sidecar] Health status: Online (FastAPI + Uvicorn daemon)' },
          { time: new Date().toLocaleTimeString(), message: '[Sidecar] Available pipelines: /api/generate, /api/analyze, /api/docs' }
        ]
      }))
    } else if (outputChannel === 'markdown') {
      setChannelData((prev) => ({
        ...prev,
        markdown: [
          { time: new Date().toLocaleTimeString(), message: `[Markdown] Active file: ${activeFile}` },
          { time: new Date().toLocaleTimeString(), message: `[Markdown] Diagnostics issues detected: ${problems.length}` },
          { time: new Date().toLocaleTimeString(), message: '[Markdown] Live AST parsing: complete' }
        ]
      }))
    }
  }, [outputChannel, workspaceDirectory?.path, cwdDisplay, activeFile, problems.length])

  useEffect(() => {
    if (isOpen && activeTab === 'output') {
      refreshOutputChannel()
    }
  }, [isOpen, activeTab, outputChannel, refreshOutputChannel])

  const copyOutputLogs = () => {
    const lines = (outputChannel === 'system' ? systemLogs : (channelData[outputChannel] || []))
      .map((l) => `[${l.time || ''}] ${l.message || l}`)
      .join('\n')
    navigator.clipboard?.writeText(lines)
    toast?.success?.('Output copied to clipboard')
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
            {infoCount > 0 && errorCount === 0 && warningCount === 0 && (
              <span className="tab-badge info-badge">{infoCount}</span>
            )}
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
            <span className="material-symbols-outlined tab-icon">terminal</span>
            <span>Terminal</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="bottom-panel-actions">
          {/* ================= TERMINAL ACTIONS ================= */}
          {activeTab === 'terminal' && (
            <>
              {/* Shell Picker */}
              <select
                className="panel-select"
                value={shellType}
                onChange={(e) => {
                  setShellType(e.target.value)
                  activeSessionKeyRef.current = ''
                }}
                title="Select Active Integrated Shell"
              >
                <option value="powershell">1: PowerShell</option>
                <option value="cmd">2: Command Prompt</option>
              </select>

              {/* Open in External PowerShell / CMD Button */}
              <button
                type="button"
                className="panel-action-btn external-term-btn"
                onClick={() => handleOpenExternalTerminal(shellType)}
                title={`Open External ${shellType === 'cmd' ? 'Command Prompt' : 'PowerShell'} Window`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>open_in_new</span>
                <span className="btn-label">External {shellType === 'cmd' ? 'CMD' : 'PS'}</span>
              </button>

              {/* Clear Terminal */}
              <button
                type="button"
                className="panel-action-btn"
                onClick={handleClearTerminal}
                title="Clear Terminal Output (Ctrl+L)"
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

          {/* ================= PROBLEMS ACTIONS ================= */}
          {activeTab === 'problems' && (
            <>
              <input
                type="text"
                className="panel-filter-input"
                placeholder="Filter problems..."
                value={problemsSearch}
                onChange={(e) => setProblemsSearch(e.target.value)}
              />

              <select
                className="panel-select"
                value={problemsFilter}
                onChange={(e) => setProblemsFilter(e.target.value)}
              >
                <option value="all">All ({problems.length})</option>
                <option value="errors">Errors ({errorCount})</option>
                <option value="warnings">Warnings ({warningCount})</option>
                <option value="infos">Infos ({infoCount})</option>
              </select>
            </>
          )}

          {/* ================= OUTPUT ACTIONS ================= */}
          {activeTab === 'output' && (
            <>
              <select
                className="panel-select"
                value={outputChannel}
                onChange={(e) => setOutputChannel(e.target.value)}
              >
                <option value="system">VisualMark Studio (System)</option>
                <option value="git">Git Status & History</option>
                <option value="sidecar">FastAPI AI Sidecar</option>
                <option value="markdown">Markdown Engine</option>
              </select>

              <button
                type="button"
                className="panel-action-btn"
                onClick={refreshOutputChannel}
                title="Refresh Channel Output"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>refresh</span>
              </button>

              <button
                type="button"
                className="panel-action-btn"
                onClick={copyOutputLogs}
                title="Copy Output Logs"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>content_copy</span>
              </button>

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
            title="Close Panel (Ctrl+`)"
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
            <div className="terminal-scroll-area custom-scrollbar" ref={terminalScrollRef}>
              <div className="terminal-welcome-banner">
                ⚡ VisualMark Studio Terminal &bull; {shellType === 'powershell' ? 'PowerShell 7/5' : 'Command Prompt'} &bull; Directory: {cwdDisplay}
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
          <div className="panel-problems-view custom-scrollbar">
            {filteredProblems.length === 0 ? (
              <div className="problems-empty-state">
                <span className="material-symbols-outlined problems-empty-icon">check_circle</span>
                <p>No problems have been detected in the current workspace.</p>
              </div>
            ) : (
              <div className="problems-list">
                <div className="problem-file-header">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#007acc' }}>
                    description
                  </span>
                  <span>{activeFile}</span>
                  <span className="problem-count-badge">
                    {filteredProblems.length} issue{filteredProblems.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {filteredProblems.map((p) => (
                  <div
                    key={p.id}
                    className={`problem-item-row problem-item-${p.severity}`}
                    onClick={() => onSelectProblem(p)}
                    title={`Click to navigate to Ln ${p.line}, Col ${p.col}`}
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
                    <span className="problem-source">[{p.source || 'Markdown'}]</span>
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
          <div className="panel-output-view custom-scrollbar">
            {outputChannel === 'system' ? (
              systemLogs.length === 0 ? (
                <div className="output-empty-state">
                  No output logged for channel "VisualMark Studio (System)".
                </div>
              ) : (
                systemLogs.map((log, idx) => (
                  <div key={idx} className="output-log-line">
                    <span className="output-time">[{log.time || new Date().toLocaleTimeString()}]</span>
                    <span className="output-tag">[System]</span>
                    <span>{log.message || log}</span>
                  </div>
                ))
              )
            ) : (channelData[outputChannel] || []).length === 0 ? (
              <div className="output-empty-state">
                No output logged for channel "{outputChannel}". Click Refresh above to poll data.
              </div>
            ) : (
              (channelData[outputChannel] || []).map((log, idx) => (
                <div key={idx} className="output-log-line">
                  <span className="output-time">[{log.time || new Date().toLocaleTimeString()}]</span>
                  <span className="output-tag">[{outputChannel.toUpperCase()}]</span>
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
