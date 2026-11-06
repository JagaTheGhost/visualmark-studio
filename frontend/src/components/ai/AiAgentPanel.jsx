import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CodeBlock from '../preview/CodeBlock'
import { ALERT_ICONS, remarkGithubAlerts } from '../preview/PreviewAlerts'
import { apiPost, apiGet } from '../../utils/apiClient'
import ProjectMemoryPopover from './ProjectMemoryPopover'
import {
  loadProjectMemory,
  saveProjectMemory,
  formatMemoryForPrompt,
  extractMemoryTags
} from '../../utils/projectMemoryManager'
import {
  AI_PROVIDERS,
  DEFAULT_PROVIDER_ID,
  DEFAULT_MODEL_ID,
  getModelInfo,
  getProviderForModel,
  hasProviderKey,
  hasAnyProviderConfigured,
  getStoredKeyForProvider,
  getAIUsageStats,
  recordAIUsage,
  setBackendProviderStatus
} from '../../data/aiModels'
import '../../styles/aiAgent.css'

function UsageCircleRing({ percent = 100, size = 18, strokeWidth = 2.5, isConfigured = true }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const validPercent = isConfigured ? Math.min(100, Math.max(0, percent ?? 100)) : 0
  const strokeDashoffset = circumference - (validPercent / 100) * circumference

  const strokeColor = !isConfigured
    ? 'rgba(255, 255, 255, 0.15)'
    : validPercent > 35
    ? '#22c55e'
    : validPercent > 15
    ? '#f59e0b'
    : '#ef4444'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="ai-usage-ring-svg">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth={strokeWidth}
      />
      {isConfigured ? (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)', transition: 'stroke-dashoffset 0.4s ease' }}
        />
      ) : (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          strokeDasharray="2, 3"
        />
      )}
    </svg>
  )
}

export function VMarksAgentIcon({ size = 14, className = '', color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <path
        d="M12 2.5L20.5 7.5V16.5L12 21.5L3.5 16.5V7.5L12 2.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 10L12 14.5L16 10"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7" r="1.3" fill={color} />
    </svg>
  )
}

const SLASH_COMMANDS = [
  {
    cmd: '/badges',
    title: 'Tech Badges',
    desc: 'Scan deps & synthesize Shields.io badges',
    icon: 'verified',
    color: '#34d399'
  },
  {
    cmd: '/diagram',
    title: 'Mermaid Diagram',
    desc: 'Design flowchart, sequence, or ERD',
    icon: 'account_tree',
    color: '#c084fc'
  },
  {
    cmd: '/outline',
    title: 'README Outline',
    desc: 'Generate structural outline & sections',
    icon: 'view_quilt',
    color: '#38bdf8'
  },
  {
    cmd: '/polish',
    title: 'Polish Markdown',
    desc: 'Refine syntax, tone & formatting',
    icon: 'auto_fix_high',
    color: '#f59e0b'
  },
  {
    cmd: '/table',
    title: 'Markdown Table',
    desc: 'Generate structured markdown tables',
    icon: 'grid_on',
    color: '#38bdf8'
  },
  {
    cmd: '/search',
    title: 'Web Search',
    desc: 'Search online documentation & facts',
    icon: 'language',
    color: '#60a5fa'
  },
  {
    cmd: '/condense',
    title: 'Condense & Shorten',
    desc: 'Streamline content into punchy sections',
    icon: 'short_text',
    color: '#a855f7'
  }
]

const USAGE_SECTIONS = [
  { id: 'gemini', title: 'Gemini Models', keyPrompt: 'Add Gemini Key' },
  { id: 'openai', title: 'OpenAI Models', keyPrompt: 'Add OpenAI Key' },
  { id: 'anthropic', title: 'Claude Models', keyPrompt: 'Add Claude Key' },
  { id: 'groq', title: 'Groq Models', keyPrompt: 'Add Groq Key' }
]

function MarkdownSnippetBlock({ codeStr, onInsert, showToast }) {
  const [mode, setMode] = useState('preview') // 'preview' by default!
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(codeStr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    if (typeof showToast === 'function') {
      showToast('Copied markdown snippet to clipboard', 'info', { minor: true })
    }
  }

  return (
    <div className="ai-markdown-snippet-card">
      <div className="ai-snippet-header">
        <div className="ai-snippet-tabs">
          <button
            type="button"
            className={`ai-snippet-tab-btn ${mode === 'preview' ? 'active' : ''}`}
            onClick={() => setMode('preview')}
            title="Render rich preview (Default)"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>visibility</span>
            <span>Preview</span>
          </button>
          <button
            type="button"
            className={`ai-snippet-tab-btn ${mode === 'raw' ? 'active' : ''}`}
            onClick={() => setMode('raw')}
            title="View raw markdown source text"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>code</span>
            <span>Markdown</span>
          </button>
        </div>
        <div className="ai-snippet-actions">
          <button
            type="button"
            className="ai-snippet-action-btn"
            onClick={handleCopy}
            title="Copy markdown code"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            type="button"
            className="ai-snippet-action-btn primary"
            onClick={() => onInsert(codeStr, 'Markdown Content')}
            title="Insert into active document at cursor"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>post_add</span>
            <span>Insert</span>
          </button>
        </div>
      </div>

      <div className="ai-snippet-body">
        {mode === 'preview' ? (
          <div className="ai-snippet-preview-canvas ai-markdown-rendered">
            <ReactMarkdown
              remarkPlugins={[remarkGithubAlerts, remarkGfm, remarkBreaks]}
              components={{
                pre({ children }) {
                  return <>{children}</>
                },
                h1({ node, children, ...props }) {
                  return <h1 className="ai-preview-h1" {...props}>{children}</h1>
                },
                h2({ node, children, ...props }) {
                  return <h2 className="ai-preview-h2" {...props}>{children}</h2>
                },
                h3({ node, children, ...props }) {
                  return <h3 className="ai-preview-h3" {...props}>{children}</h3>
                },
                p({ node, className, children, ...props }) {
                  if (className?.includes?.('markdown-alert-title')) {
                    const alertType = node?.properties?.dataAlertType || 'NOTE'
                    const icon = ALERT_ICONS[alertType] || ALERT_ICONS.NOTE
                    return (
                      <p className={className} {...props}>
                        <span className="markdown-alert-icon">{icon}</span>
                        <span>{children}</span>
                      </p>
                    )
                  }
                  return <p className="ai-preview-p" {...props}>{children}</p>
                },
                ul({ node, children, ...props }) {
                  return <ul className="ai-preview-ul" {...props}>{children}</ul>
                },
                ol({ node, children, ...props }) {
                  return <ol className="ai-preview-ol" {...props}>{children}</ol>
                },
                li({ node, children, ...props }) {
                  return <li className="ai-preview-li" {...props}>{children}</li>
                },
                hr({ node, ...props }) {
                  return <hr className="ai-preview-hr" {...props} />
                },
                blockquote({ node, children, ...props }) {
                  return <blockquote className="ai-preview-blockquote" {...props}>{children}</blockquote>
                },
                table({ node, children, ...props }) {
                  return (
                    <div className="ai-preview-table-wrap">
                      <table className="ai-preview-table" {...props}>{children}</table>
                    </div>
                  )
                },
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const codeText = String(children).replace(/\n$/, '')
                  if (!inline && match) {
                    return (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: '8px 0',
                          background: '#09090b',
                          padding: '8px 10px',
                          borderRadius: 6,
                          fontSize: '11px',
                          border: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                      >
                        {codeText}
                      </SyntaxHighlighter>
                    )
                  }
                  return <code className="ai-inline-code" {...props}>{children}</code>
                },
                img({ node, ...props }) {
                  return (
                    <img
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 6,
                        margin: '6px 0',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'block'
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const parent = e.target.parentNode
                        if (parent && !parent.querySelector('.ai-img-fallback')) {
                          const fallback = document.createElement('span')
                          fallback.className = 'ai-img-fallback'
                          fallback.innerText = `🖼 ${props.alt || props.src || 'Image'}`
                          parent.appendChild(fallback)
                        }
                      }}
                      {...props}
                      alt={props.alt || ''}
                    />
                  )
                }
              }}
            >
              {codeStr}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="ai-snippet-raw-body">
            <SyntaxHighlighter
              style={vscDarkPlus}
              language="markdown"
              PreTag="div"
              showLineNumbers
              customStyle={{
                margin: 0,
                background: '#09090b',
                padding: '12px 14px',
                fontSize: '11.5px',
                lineHeight: '1.6',
                border: 'none',
                borderRadius: '0 0 8px 8px',
                fontFamily: "var(--font-mono, 'Cascadia Code', 'JetBrains Mono', Consolas, monospace)",
                overflowX: 'auto'
              }}
            >
              {codeStr}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AiAgentPanel({
  repoUrl = '',
  activeFile = 'README.md',
  activeContent = '',
  workspaceDirectory = null,
  onOpenStudioTab = () => {},
  onOpenSettings = () => {},
  onInsertSnippet = () => {},
  showToast = () => {}
}) {
  // Extract string path and display name safely whether workspaceDirectory is an object, string, or null
  const workspacePath = typeof workspaceDirectory === 'string'
    ? workspaceDirectory
    : (workspaceDirectory && typeof workspaceDirectory === 'object' ? workspaceDirectory.path || '' : '')

  const rawWsName = (workspaceDirectory && typeof workspaceDirectory === 'object' && workspaceDirectory.name)
    ? workspaceDirectory.name
    : (workspacePath ? workspacePath.replace(/\\/g, '/').split('/').filter(Boolean).pop() : '')

  const workspaceName = rawWsName && rawWsName.toLowerCase() !== 'assets' ? rawWsName : 'Workspace'

  // Persistent Project Memory State (scoped to active workspace)
  const [projectMemory, setProjectMemory] = useState(() => loadProjectMemory(workspacePath))
  const [showMemoryPopover, setShowMemoryPopover] = useState(false)
  const memoryPopoverRef = useRef(null)

  // Sync project memory when workspace changes
  useEffect(() => {
    setProjectMemory(loadProjectMemory(workspacePath))
  }, [workspacePath])

  // Listen for memory updates across windows or actions
  useEffect(() => {
    const handleMemUpdate = () => {
      setProjectMemory(loadProjectMemory(workspacePath))
    }
    window.addEventListener('visualmark:project-memory-updated', handleMemUpdate)
    return () => window.removeEventListener('visualmark:project-memory-updated', handleMemUpdate)
  }, [workspacePath])

  // Dismiss memory popover on click outside
  useEffect(() => {
    if (!showMemoryPopover) return
    const handleClickOutside = (e) => {
      if (memoryPopoverRef.current && !memoryPopoverRef.current.contains(e.target)) {
        setShowMemoryPopover(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [showMemoryPopover])

  // Session / Chat History Management (Local Sessions with switching & deletion)
  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('visualmark_ai_chat_sessions')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    let initialMessages = [
      {
        id: 'initial',
        role: 'agent',
        content:
          '👋 Hi! I am **VMarks** (VisualMark Studio Co-Pilot & Guide).\n\nI am here to help you architect your documentation, suggest outlines and templates, diagnose issues, synthesize official **Shields.io Tech Badges** for **Badge Studio**, and polish your markdown with **In-Editor Live Diff**.',
        timestamp: Date.now()
      }
    ]
    try {
      const oldHist = localStorage.getItem('visualmark_ai_chat_history')
      if (oldHist) {
        const parsedHist = JSON.parse(oldHist)
        if (Array.isArray(parsedHist) && parsedHist.length > 0) {
          initialMessages = parsedHist
        }
      }
    } catch {}
    return [
      {
        id: 'session-' + Date.now(),
        title: 'New Chat',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: initialMessages
      }
    ]
  })

  const [activeSessionId, setActiveSessionId] = useState(() => {
    try {
      const savedActive = localStorage.getItem('visualmark_ai_active_session_id')
      if (savedActive && sessions.some((s) => s.id === savedActive)) {
        return savedActive
      }
    } catch {}
    return sessions[0]?.id || 'session-' + Date.now()
  })
  const activeSessionIdRef = useRef(activeSessionId)
  useEffect(() => {
    activeSessionIdRef.current = activeSessionId
    try {
      localStorage.setItem('visualmark_ai_active_session_id', activeSessionId)
    } catch {}
  }, [activeSessionId])

  const [showHistoryPopover, setShowHistoryPopover] = useState(false)
  const historyPopoverRef = useRef(null)

  // Dismiss history popover on click outside
  useEffect(() => {
    if (!showHistoryPopover) return
    const handleClickOutside = (e) => {
      if (historyPopoverRef.current && !historyPopoverRef.current.contains(e.target)) {
        setShowHistoryPopover(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [showHistoryPopover])

  // Derive messages from active session
  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0]
  const messages = currentSession?.messages || []

  // Setter wrapper that updates current session messages and autogenerates session title
  const setMessages = useCallback((updater) => {
    setSessions((prevSessions) => {
      const currentId = activeSessionIdRef.current
      const idx = prevSessions.findIndex((s) => s.id === currentId)
      if (idx === -1) return prevSessions
      const targetSession = prevSessions[idx]
      const nextMsgs = typeof updater === 'function' ? updater(targetSession.messages) : updater

      let title = targetSession.title
      if (title === 'New Chat' || !title) {
        const firstUser = nextMsgs.find((m) => m.role === 'user')
        if (firstUser) {
          title = firstUser.content.slice(0, 32).trim() + (firstUser.content.length > 32 ? '...' : '')
        }
      }

      const updated = {
        ...targetSession,
        title,
        updatedAt: Date.now(),
        messages: nextMsgs
      }
      const newSessions = [...prevSessions]
      newSessions[idx] = updated
      try {
        localStorage.setItem('visualmark_ai_chat_sessions', JSON.stringify(newSessions))
      } catch {}
      return newSessions
    })
  }, [])

  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeProcess, setActiveProcess] = useState({ type: null, label: '' }) // 'chat' | 'diff' | 'scan' | 'analysis'
  const [showKeyConfig, setShowKeyConfig] = useState(false)
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('visualmark_gemini_key') || '')
  const [onboardingKeyInput, setOnboardingKeyInput] = useState('')
  const [headerKeyInput, setHeaderKeyInput] = useState(() => {
    const prov = localStorage.getItem('visualmark_active_ai_provider') || DEFAULT_PROVIDER_ID
    return getStoredKeyForProvider(prov) || localStorage.getItem('visualmark_gemini_key') || ''
  })

  // Multi-Provider & Model State
  const [selectedProvider, setSelectedProvider] = useState(() => {
    return localStorage.getItem('visualmark_active_ai_provider') || DEFAULT_PROVIDER_ID
  })
  const [selectedModel, setSelectedModel] = useState(() => {
    return localStorage.getItem('visualmark_active_ai_model') || DEFAULT_MODEL_ID
  })
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)
  const [hoveredMenu, setHoveredMenu] = useState(null)
  const [popoverPos, setPopoverPos] = useState({ left: 16, bottom: 60 })
  const [usageStats, setUsageStats] = useState(() => getAIUsageStats())
  const triggerBtnRef = useRef(null)
  const menuPortalRef = useRef(null)
  const hoverTimeoutRef = useRef(null)

  const [onboardingActiveProvider, setOnboardingActiveProvider] = useState('gemini')
  const [onboardingKeyInputs, setOnboardingKeyInputs] = useState({
    gemini: localStorage.getItem('visualmark_gemini_key') || '',
    openai: localStorage.getItem('visualmark_openai_key') || '',
    anthropic: localStorage.getItem('visualmark_anthropic_key') || '',
    groq: localStorage.getItem('visualmark_groq_key') || '',
    ollama: localStorage.getItem('visualmark_ollama_url') || 'http://localhost:11434'
  })

  const updatePopoverPos = useCallback(() => {
    if (triggerBtnRef.current) {
      const rect = triggerBtnRef.current.getBoundingClientRect()
      setPopoverPos({
        left: Math.max(8, rect.left),
        bottom: window.innerHeight - rect.top + 6
      })
    }
  }, [])

  // Add Context & Slash Command Palette State
  const addContextBtnRef = useRef(null)
  const addContextPortalRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)
  const slashMenuRef = useRef(null)
  const [isAddContextOpen, setIsAddContextOpen] = useState(false)
  const [addContextPos, setAddContextPos] = useState({ left: 16, bottom: 60 })
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashSelectedIndex, setSlashSelectedIndex] = useState(0)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [isFolderAttached, setIsFolderAttached] = useState(false)
  const [isWebSearchActive, setIsWebSearchActive] = useState(false)

  const updateAddContextPos = useCallback(() => {
    if (addContextBtnRef.current) {
      const rect = addContextBtnRef.current.getBoundingClientRect()
      setAddContextPos({
        left: Math.max(8, rect.left),
        bottom: window.innerHeight - rect.top + 6
      })
    }
  }, [])

  // Dismiss Add Context popover on click outside or escape
  useEffect(() => {
    if (!isAddContextOpen) return
    const handleClickOutside = (e) => {
      if (
        addContextPortalRef.current &&
        !addContextPortalRef.current.contains(e.target) &&
        addContextBtnRef.current &&
        !addContextBtnRef.current.contains(e.target)
      ) {
        setIsAddContextOpen(false)
      }
    }
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsAddContextOpen(false)
    }
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEsc)
    window.addEventListener('resize', updateAddContextPos)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEsc)
      window.removeEventListener('resize', updateAddContextPos)
    }
  }, [isAddContextOpen, updateAddContextPos])

  // Dismiss Slash Command menu on click outside
  useEffect(() => {
    if (!showSlashMenu) return
    const handleClickOutside = (e) => {
      if (
        slashMenuRef.current &&
        !slashMenuRef.current.contains(e.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target)
      ) {
        setShowSlashMenu(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [showSlashMenu])

  const [flyoutTopOffset, setFlyoutTopOffset] = useState(0)

  const handleOpenSettings = (e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    setIsModelSelectorOpen(false)
    setHoveredMenu(null)
    window.dispatchEvent(new CustomEvent('visualmark:open-settings', { detail: 'github' }))
    if (typeof onOpenSettings === 'function') {
      onOpenSettings('github')
    } else if (typeof onOpenStudioTab === 'function') {
      onOpenStudioTab('settings')
    }
  }

  const handleRowMouseEnter = (id, e) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setHoveredMenu(id)
    if (e?.currentTarget && menuPortalRef.current) {
      const mainElem = menuPortalRef.current.querySelector('.ai-model-menu-main')
      if (mainElem) {
        const mainRect = mainElem.getBoundingClientRect()
        const rowRect = e.currentTarget.getBoundingClientRect()
        const relativeTop = Math.max(0, rowRect.top - mainRect.top)
        setFlyoutTopOffset(relativeTop)
      }
    }
  }

  const handleRowMouseLeave = (e) => {
    // If moving into flyout panel, preserve hover state
    if (e?.relatedTarget && e.relatedTarget.closest?.('.ai-model-flyout-panel')) {
      return
    }
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null)
    }, 240)
  }

  const handleFlyoutMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handleFlyoutMouseLeave = (e) => {
    // If moving back to main menu, preserve hover state
    if (e?.relatedTarget && e.relatedTarget.closest?.('.ai-model-menu-main')) {
      return
    }
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMenu(null)
    }, 200)
  }

  // Dismiss model selector popover on outside click or escape
  useEffect(() => {
    if (!isModelSelectorOpen) return
    const handleClickOutside = (e) => {
      if (
        menuPortalRef.current &&
        !menuPortalRef.current.contains(e.target) &&
        triggerBtnRef.current &&
        !triggerBtnRef.current.contains(e.target)
      ) {
        setIsModelSelectorOpen(false)
        setHoveredMenu(null)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsModelSelectorOpen(false)
        setHoveredMenu(null)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', updatePopoverPos)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', updatePopoverPos)
    }
  }, [isModelSelectorOpen, updatePopoverPos])

  // Listen for usage stats updates
  useEffect(() => {
    const handleUsage = (e) => {
      if (e.detail) setUsageStats(e.detail)
    }
    window.addEventListener('visualmark:ai-usage-updated', handleUsage)
    return () => window.removeEventListener('visualmark:ai-usage-updated', handleUsage)
  }, [])

  // Sync provider status from backend on mount so .env keys are recognized
  useEffect(() => {
    let isMounted = true
    apiGet('/ai/providers-status')
      .then((res) => {
        if (isMounted && res?.data) {
          setBackendProviderStatus(res.data)
          setUsageStats(getAIUsageStats())
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  // Listen for provider key updates from Settings
  useEffect(() => {
    const handleKeyUpdate = (e) => {
      if (e.detail?.provider) {
        setOnboardingKeyInputs((prev) => ({
          ...prev,
          [e.detail.provider]: e.detail.key || ''
        }))
        if (e.detail.provider === 'gemini') {
          setGeminiKey(e.detail.key || '')
        }
        setUsageStats(getAIUsageStats())
      }
    }
    window.addEventListener('visualmark:ai-key-updated', handleKeyUpdate)
    return () => window.removeEventListener('visualmark:ai-key-updated', handleKeyUpdate)
  }, [])

  const handleSelectModel = (modelId, providerId) => {
    setSelectedModel(modelId)
    setSelectedProvider(providerId)
    localStorage.setItem('visualmark_active_ai_model', modelId)
    localStorage.setItem('visualmark_active_ai_provider', providerId)
    setIsModelSelectorOpen(false)
    setHoveredMenu(null)
    setHeaderKeyInput(getStoredKeyForProvider(providerId) || '')
    const mInfo = getModelInfo(modelId)
    showToast(`Switched to ${mInfo.name}`, 'info', { minor: true })
  }

  const handleSaveProviderKey = (providerId, customValue = null) => {
    const provider = AI_PROVIDERS[providerId]
    if (!provider) return
    if (provider.isLocal) {
      localStorage.setItem('visualmark_ollama_enabled', 'true')
      const url = customValue || onboardingKeyInputs.ollama || 'http://localhost:11434'
      localStorage.setItem('visualmark_ollama_url', url)
      window.dispatchEvent(new CustomEvent('visualmark:ai-key-updated', { detail: { provider: 'ollama', enabled: true } }))
      showToast('Ollama Local connected!', 'success')
      setSelectedProvider('ollama')
      setSelectedModel(AI_PROVIDERS.ollama.defaultModel)
      setShowKeyConfig(false)
      return
    }

    const keyVal = (customValue !== null ? customValue : onboardingKeyInputs[providerId] || '').trim()
    if (!keyVal) {
      showToast(`Please enter a valid key for ${provider.name}`, 'warning')
      return
    }
    localStorage.setItem(provider.keyStorageKey, keyVal)
    if (providerId === 'gemini') {
      setGeminiKey(keyVal)
      setHeaderKeyInput(keyVal)
    }
    setOnboardingKeyInputs((prev) => ({ ...prev, [providerId]: keyVal }))
    window.dispatchEvent(new CustomEvent('visualmark:ai-key-updated', { detail: { provider: providerId, key: keyVal } }))
    showToast(`${provider.name} connected!`, 'success')
    setSelectedProvider(providerId)
    setSelectedModel(provider.defaultModel)
    setShowKeyConfig(false)
  }

  // Context Attachment Handlers
  const handleTriggerAttachFiles = () => {
    setIsAddContextOpen(false)
    fileInputRef.current?.click()
  }

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    files.forEach((file) => {
      const reader = new FileReader()
      const isText =
        file.type.startsWith('text/') ||
        /\.(md|markdown|txt|json|js|jsx|ts|tsx|py|html|css|yaml|yml|toml)$/i.test(file.name)
      if (isText) {
        reader.onload = (event) => {
          setAttachedFiles((prev) => [
            ...prev,
            { name: file.name, size: file.size, type: 'text', content: event.target.result }
          ])
          showToast(`Attached ${file.name}`, 'info', { minor: true })
        }
        reader.readAsText(file)
      } else {
        reader.onload = (event) => {
          setAttachedFiles((prev) => [
            ...prev,
            { name: file.name, size: file.size, type: file.type.startsWith('image/') ? 'image' : 'file', dataUrl: event.target.result }
          ])
          showToast(`Attached ${file.name}`, 'info', { minor: true })
        }
        reader.readAsDataURL(file)
      }
    })
    e.target.value = ''
  }

  const handleRemoveAttachedFile = (idx) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleAttachFolderContext = () => {
    setIsAddContextOpen(false)
    setIsFolderAttached((prev) => {
      const next = !prev
      showToast(next ? `Attached workspace folder: ${workspaceName}` : 'Removed folder context', 'info', { minor: true })
      return next
    })
  }

  const handleInsertMention = () => {
    setIsAddContextOpen(false)
    setInput((prev) => prev + (prev && !prev.endsWith(' ') ? ' @' : '@'))
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const handleTriggerActionsPalette = () => {
    setIsAddContextOpen(false)
    setInput('/')
    setShowSlashMenu(true)
    setSlashSelectedIndex(0)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const handleToggleWebSearch = () => {
    setIsAddContextOpen(false)
    setIsWebSearchActive((prev) => {
      const next = !prev
      showToast(next ? 'Web search enabled for AI queries' : 'Web search disabled', 'info', { minor: true })
      return next
    })
  }

  // Filtered Slash Commands
  const filteredSlashCommands = React.useMemo(() => {
    if (!input.startsWith('/')) return SLASH_COMMANDS
    const query = input.slice(1).trim().toLowerCase()
    if (!query) return SLASH_COMMANDS
    return SLASH_COMMANDS.filter(
      (c) => c.cmd.toLowerCase().includes(query) || c.title.toLowerCase().includes(query)
    )
  }, [input])

  const handleSelectSlashCommand = (cmdItem) => {
    setShowSlashMenu(false)
    if (!cmdItem) return
    if (cmdItem.cmd === '/badges') {
      setInput('')
      handleRunRepoAnalysis(null, 'badge')
    } else if (cmdItem.cmd === '/diagram') {
      setInput('')
      handleSendMessage(null, 'Design a clean, syntactically valid Mermaid flowchart (flowchart TD) or sequence diagram for this project architecture')
    } else if (cmdItem.cmd === '/outline') {
      setInput('')
      handleSendMessage(null, 'Suggest a high-impact architectural outline and starter sections tailored to this project')
    } else if (cmdItem.cmd === '/polish') {
      setInput('')
      handleSendMessage(null, 'Polish and refine the active markdown document formatting, syntax, and clarity')
    } else if (cmdItem.cmd === '/table') {
      setInput('')
      handleSendMessage(null, 'Generate a clean, structured Markdown table comparing key features, specifications, and architecture components')
    } else if (cmdItem.cmd === '/search') {
      setIsWebSearchActive(true)
      setInput('/search ')
      setTimeout(() => textareaRef.current?.focus(), 50)
    } else if (cmdItem.cmd === '/condense') {
      setInput('')
      handleSendMessage(null, 'Condense and streamline this content into punchy, clear documentation')
    } else {
      setInput(cmdItem.cmd + ' ')
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setInput(val)
    if (val.startsWith('/')) {
      setShowSlashMenu(true)
      setSlashSelectedIndex(0)
    } else {
      setShowSlashMenu(false)
    }
  }
  const [copiedMsgId, setCopiedMsgId] = useState(null)
  const [rawMsgIds, setRawMsgIds] = useState(new Set())

  const toggleRawMsgView = (msgId) => {
    setRawMsgIds((prev) => {
      const next = new Set(prev)
      if (next.has(msgId)) next.delete(msgId)
      else next.add(msgId)
      return next
    })
  }
  const streamingTimerRef = useRef(null)
  const abortControllerRef = useRef(null)

  const handleCopyMessage = (msgId, text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedMsgId(msgId)
    setTimeout(() => setCopiedMsgId(null), 2000)
    showToast('Copied response to clipboard', 'info', { minor: true })
  }

  const handleStopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    )
    setIsGenerating(false)
    setActiveProcess({ type: null, label: '' })
  }, [setMessages])

  // Clear any active streaming timer and in-flight request on unmount
  useEffect(() => {
    return () => {
      if (streamingTimerRef.current) clearInterval(streamingTimerRef.current)
      if (abortControllerRef.current) abortControllerRef.current.abort()
    }
  }, [])

  // Sync Gemini key when updated from Settings tab or custom event
  useEffect(() => {
    const handleKeySync = (e) => {
      const k = e?.detail || localStorage.getItem('visualmark_gemini_key') || ''
      setGeminiKey(k)
      setHeaderKeyInput(k)
    }
    window.addEventListener('storage', handleKeySync)
    window.addEventListener('focus', handleKeySync)
    window.addEventListener('visualmark:gemini-key-updated', handleKeySync)
    return () => {
      window.removeEventListener('storage', handleKeySync)
      window.removeEventListener('focus', handleKeySync)
      window.removeEventListener('visualmark:gemini-key-updated', handleKeySync)
    }
  }, [])

  const [activeSelection, setActiveSelection] = useState(null)
  const [thoughtStage, setThoughtStage] = useState(0)
  const [thoughtTimer, setThoughtTimer] = useState(0)
  const [panelWidthMode, setPanelWidthMode] = useState('standard') // 'standard' (340px) | 'wide' (540px) | 'max' (760px)
  const threadEndRef = useRef(null)

  // Workspace File Access Permission State (scoped to specific workspace directory)
  const [filePermission, setFilePermission] = useState(() => {
    try {
      const saved = localStorage.getItem('visualmark_file_permission')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          return { granted: false, expiresAt: null, mode: null, workspacePath: null }
        }
        return parsed
      }
    } catch {}
    return { granted: false, expiresAt: null, mode: null, workspacePath: null }
  })
  const [pendingPermissionRequest, setPendingPermissionRequest] = useState(null)
  const [permissionSecondsLeft, setPermissionSecondsLeft] = useState(0)

  // Countdown ticker for active timed permissions (5 min / 10 min)
  useEffect(() => {
    if (!filePermission.granted || !filePermission.expiresAt) {
      setPermissionSecondsLeft(0)
      return
    }
    const updateCountdown = () => {
      const rem = Math.max(0, Math.floor((filePermission.expiresAt - Date.now()) / 1000))
      setPermissionSecondsLeft(rem)
      if (rem <= 0) {
        setFilePermission({ granted: false, expiresAt: null, mode: null, workspacePath: null })
        localStorage.removeItem('visualmark_file_permission')
        showToast('Workspace access permission expired', 'info')
      }
    }
    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [filePermission])

  // Listen for Monaco in-editor diff accept/reject events to update chat state and record milestones
  useEffect(() => {
    const handleDiffAccepted = (e) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.diffData && m.diffData.status !== 'accepted'
            ? { ...m, diffData: { ...m.diffData, status: 'accepted' } }
            : m
        )
      )
      const diffSummary = e?.detail?.summary || 'Applied in-editor revision'
      setProjectMemory((prev) => {
        const milestoneText = `${activeFile || 'Document'}: ${diffSummary}`
        const updated = {
          ...prev,
          recentSessions: [
            ...(prev.recentSessions || []).slice(-9),
            { summary: milestoneText, timestamp: Date.now() }
          ]
        }
        saveProjectMemory(workspacePath, updated)
        return updated
      })
    }

    const handleDiffRejected = () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.diffData && m.diffData.status !== 'rejected'
            ? { ...m, diffData: { ...m.diffData, status: 'rejected' } }
            : m
        )
      )
    }

    window.addEventListener('visualmark:ai-diff-accepted', handleDiffAccepted)
    window.addEventListener('visualmark:ai-diff-rejected', handleDiffRejected)
    return () => {
      window.removeEventListener('visualmark:ai-diff-accepted', handleDiffAccepted)
      window.removeEventListener('visualmark:ai-diff-rejected', handleDiffRejected)
    }
  }, [workspacePath, activeFile])

  const handleTogglePanelWidth = () => {
    let nextMode = 'standard'
    let nextWidth = 340
    if (panelWidthMode === 'standard') {
      nextMode = 'wide'
      nextWidth = 540
    } else if (panelWidthMode === 'wide') {
      nextMode = 'max'
      nextWidth = 760
    } else {
      nextMode = 'standard'
      nextWidth = 340
    }
    setPanelWidthMode(nextMode)
    window.dispatchEvent(new CustomEvent('visualmark:set-sidebar-width', { detail: { width: nextWidth } }))
    showToast(`Sidebar width: ${nextWidth}px (${nextMode})`, 'info', { minor: true })
  }

  // Dynamic Thought Chain stages
  const THOUGHT_STAGES = [
    'Thinking & analyzing context...',
    'Inspecting files & directory tree...',
    'Synthesizing studio visual parameters...',
    'Formatting Markdown & diff review...'
  ]

  // Timer & stage rotator during generation
  useEffect(() => {
    let interval = null
    if (isGenerating) {
      setThoughtTimer(0)
      setThoughtStage(0)
      const startTime = Date.now()
      interval = setInterval(() => {
        const secs = ((Date.now() - startTime) / 1000).toFixed(1)
        setThoughtTimer(secs)
        const stageIndex = Math.min(
          THOUGHT_STAGES.length - 1,
          Math.floor((Date.now() - startTime) / 1100)
        )
        setThoughtStage(stageIndex)
      }, 100)
    } else {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isGenerating])

  // Auto-scroll to bottom of thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isGenerating, thoughtStage])

  // Save history to localStorage (only completed non-streaming messages)
  useEffect(() => {
    try {
      if (!isGenerating && !messages.some((m) => m.isStreaming)) {
        localStorage.setItem('visualmark_ai_chat_history', JSON.stringify(messages.slice(-20)))
      }
    } catch {}
  }, [messages, isGenerating])

  // Listen for editor selection bridge events (e.g. from Monaco Ctrl+K or Floating Toolbar)
  useEffect(() => {
    const handleSelectionPrompt = (e) => {
      const selectedText = e.detail?.text || ''
      const range = e.detail?.range || null
      if (selectedText.trim()) {
        setActiveSelection({
          text: selectedText.trim(),
          range: range
        })
      }
    }
    window.addEventListener('visualmark:ask-vmarks-selection', handleSelectionPrompt)
    return () => window.removeEventListener('visualmark:ask-vmarks-selection', handleSelectionPrompt)
  }, [])

  const handleSaveOnboardingKey = (e) => {
    if (e) e.preventDefault()
    const trimmed = onboardingKeyInput.trim()
    if (!trimmed) {
      showToast('Please paste a valid Gemini API Key', 'warning')
      return
    }
    localStorage.setItem('visualmark_gemini_key', trimmed)
    setGeminiKey(trimmed)
    setHeaderKeyInput(trimmed)
    setOnboardingKeyInput('')
    setShowKeyConfig(false)
    showToast('Gemini API Key saved and connected!', 'success')
  }

  const handleSaveHeaderKey = (e) => {
    if (e) e.preventDefault()
    const trimmed = headerKeyInput.trim()
    if (!trimmed) {
      showToast('Please paste a valid Gemini API Key', 'warning')
      return
    }
    localStorage.setItem('visualmark_gemini_key', trimmed)
    setGeminiKey(trimmed)
    setHeaderKeyInput(trimmed)
    setShowKeyConfig(false)
    showToast('Gemini API Key saved for VMarks Copilot', 'success')
  }

  // Chat Sessions Actions
  const handleCreateNewChat = () => {
    // Record milestone from previous session if it had meaningful conversation
    const firstUserMsg = messages.find((m) => m.role === 'user')
    if (firstUserMsg && messages.length > 2) {
      const milestoneSummary = firstUserMsg.content.slice(0, 50).trim() + (firstUserMsg.content.length > 50 ? '...' : '')
      setProjectMemory((prev) => {
        const exists = (prev.recentSessions || []).some((s) => (s.summary || s) === milestoneSummary)
        if (exists) return prev
        const updated = {
          ...prev,
          recentSessions: [
            ...(prev.recentSessions || []).slice(-9),
            { summary: milestoneSummary, timestamp: Date.now() }
          ]
        }
        saveProjectMemory(workspacePath, updated)
        return updated
      })
    }

    const newId = 'session-' + Date.now()
    const newSession = {
      id: newId,
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: 'initial',
          role: 'agent',
          content: '👋 Starting a new chat session. How can I help you document your architecture today?',
          timestamp: Date.now()
        }
      ]
    }
    setSessions((prev) => {
      const next = [newSession, ...prev]
      try {
        localStorage.setItem('visualmark_ai_chat_sessions', JSON.stringify(next))
      } catch {}
      return next
    })
    setActiveSessionId(newId)
    setShowHistoryPopover(false)
    showToast('New chat created', 'info', { minor: true })
  }

  // Rescan workspace manifests to build or update tech stack profile
  const handleRescanProjectProfile = async () => {
    try {
      showToast('Scanning workspace manifests & dependencies...', 'info')
      const response = await apiPost('/ai/agent-analyze', {
        repo_url: repoUrl?.trim() || undefined,
        workspace_path: workspacePath || undefined,
        query: 'Analyze project dependencies and architecture to build project memory profile',
        mode: 'badge',
        provider: selectedProvider,
        model: selectedModel,
        api_key: getStoredKeyForProvider(selectedProvider) || undefined,
        base_url: selectedProvider === 'ollama' ? (localStorage.getItem('visualmark_ollama_url') || 'http://localhost:11434') : undefined,
        gemini_api_key: geminiKey || undefined
      })
      if (response.data?.success && response.data?.data) {
        recordAIUsage({
          provider: selectedProvider,
          model: selectedModel,
          usage: response.data?.usage,
          promptTokens: response.data?.usage?.prompt_tokens,
          completionTokens: response.data?.usage?.completion_tokens,
          totalTokens: response.data?.usage?.total_tokens,
          action: 'analyze'
        })
        const data = response.data.data
        const detectedBadges = (data.badge_studio || []).map((b) => b.title || b.label).filter(Boolean)
        setProjectMemory((prev) => {
          const updated = {
            ...prev,
            profile: {
              techStack: Array.from(new Set([...(prev.profile?.techStack || []), ...detectedBadges])),
              summary: data.project_summary || prev.profile?.summary || '',
              updatedAt: Date.now()
            }
          }
          saveProjectMemory(workspacePath, updated)
          return updated
        })
        showToast(`Profile updated: ${detectedBadges.length} technologies detected`, 'success')
      } else {
        showToast('Manifest scan completed', 'info')
      }
    } catch (err) {
      console.warn('Failed to rescan workspace profile:', err)
      showToast('Could not automatically scan project profile', 'warning')
    }
  }

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation()
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId)
      if (filtered.length === 0) {
        const fresh = {
          id: 'session-' + Date.now(),
          title: 'New Chat',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [
            {
              id: 'initial',
              role: 'agent',
              content: '👋 How can I help you document your architecture today?',
              timestamp: Date.now()
            }
          ]
        }
        filtered.push(fresh)
        setActiveSessionId(fresh.id)
      } else if (activeSessionId === sessionId) {
        setActiveSessionId(filtered[0].id)
      }
      try {
        localStorage.setItem('visualmark_ai_chat_sessions', JSON.stringify(filtered))
      } catch {}
      return filtered
    })
    showToast('Chat deleted', 'info', { minor: true })
  }

  const handleSelectSession = (sessionId) => {
    setActiveSessionId(sessionId)
    setShowHistoryPopover(false)
  }

  const handleClearAllHistory = () => {
    const fresh = {
      id: 'session-' + Date.now(),
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        {
          id: 'initial',
          role: 'agent',
          content: 'Chat history cleared. How can I help you document your architecture today?',
          timestamp: Date.now()
        }
      ]
    }
    setSessions([fresh])
    setActiveSessionId(fresh.id)
    setShowHistoryPopover(false)
    try {
      localStorage.setItem('visualmark_ai_chat_sessions', JSON.stringify([fresh]))
      localStorage.removeItem('visualmark_ai_chat_history')
    } catch {}
    showToast('All chat history cleared', 'info')
  }

  // Action: Populate Badge Studio
  const handlePopulateBadges = (badgeData) => {
    try {
      sessionStorage.setItem('visualmark_pending_badge_data', JSON.stringify(badgeData))
    } catch (err) {
      console.warn('Failed to cache badge data in sessionStorage', err)
    }
    onOpenStudioTab('badges.studio')
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('visualmark:set-badge-data', { detail: badgeData }))
      showToast('Loaded into Badge Studio!', 'success')
    }, 100)
  }

  // Action: Insert Markdown into current buffer
  const handleInsertDoc = (markdown, label = 'AI Documentation') => {
    if (!markdown) return
    onInsertSnippet(markdown, label)
    showToast(`Inserted ${label} at cursor!`, 'success')
  }

  // Action: Grant Workspace File Access Permission
  const handleGrantPermission = (mode) => {
    let newPerm = {
      granted: true,
      mode,
      workspacePath: workspacePath || null,
      expiresAt: mode === '5min' ? Date.now() + 5 * 60 * 1000 : mode === '10min' ? Date.now() + 10 * 60 * 1000 : null
    }
    if (mode !== 'once') {
      try { localStorage.setItem('visualmark_file_permission', JSON.stringify(newPerm)) } catch {}
    }
    setFilePermission(newPerm)
    const req = pendingPermissionRequest
    setPendingPermissionRequest(null)
    showToast(`Access granted: ${mode === 'always' ? 'Always trust workspace' : mode}`, 'success')

    if (req && req.type === 'scan') {
      executeRepoAnalysis(req.customQuery, req.mode, mode)
    }
  }

  // Action: Deny Workspace File Access Permission
  const handleDenyPermission = () => {
    setPendingPermissionRequest(null)
    showToast('Workspace access denied. Local files will not be scanned.', 'info')
    const agentNotice = {
      id: String(Date.now()),
      role: 'agent',
      content: '🔒 **Workspace scan cancelled:** Local file access was denied. You can continue asking questions about the active document or general code.',
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, agentNotice])
  }

  // Action: Revoke Workspace File Access Permission
  const handleRevokePermission = () => {
    setFilePermission({ granted: false, expiresAt: null, mode: null, workspacePath: null })
    setPendingPermissionRequest(null)
    try { localStorage.removeItem('visualmark_file_permission') } catch {}
    showToast('Workspace file access revoked', 'info')
  }

  // Check if workspace access is currently permitted for this workspace directory
  const hasValidPermission = () => {
    if (!filePermission.granted) return false
    if (filePermission.workspacePath && workspacePath && filePermission.workspacePath !== workspacePath) {
      return false
    }
    if (filePermission.mode === 'always') return true
    if (filePermission.mode === 'once') return true
    if (filePermission.expiresAt && Date.now() < filePermission.expiresAt) return true
    return false
  }

  // Target-aware Studio Analysis (100% Focused on Shields.io Badges Studio)
  const executeRepoAnalysis = async (customQuery = null, mode = 'badge', grantedMode = null) => {
    const isLocal = Boolean(workspacePath)
    const targetLabel = isLocal ? workspaceName : (repoUrl.trim() || 'VisualMark')

    if (!workspacePath && !repoUrl.trim()) {
      setIsGenerating(false)
      setActiveProcess({ type: null, label: '' })
      const noticeMsg = {
        id: String(Date.now() + 1),
        role: 'agent',
        content: '📂 **No Workspace Folder or Repository URL Found:**\n\nPlease open a project folder (**Ctrl+Shift+O**) or configure a GitHub repository URL to scan manifests for Badges.',
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, noticeMsg])
      return
    }

    setActiveProcess({ type: 'scan', label: `Scanning ${targetLabel} manifests for badges...` })
    setIsGenerating(true)

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      content: customQuery || `Scan Badges (${targetLabel})`,
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])

    if (abortControllerRef.current) abortControllerRef.current.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const startTime = Date.now()
    try {
      const response = await apiPost(
        '/ai/agent-analyze',
        {
          repo_url: repoUrl.trim() || undefined,
          workspace_path: workspacePath || undefined,
          query: customQuery || undefined,
          mode: 'badge',
          provider: selectedProvider,
          model: selectedModel,
          api_key: getStoredKeyForProvider(selectedProvider) || undefined,
          base_url: selectedProvider === 'ollama' ? (localStorage.getItem('visualmark_ollama_url') || 'http://localhost:11434') : undefined,
          gemini_api_key: geminiKey || undefined
        },
        { signal: controller.signal }
      )

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1) + 's'

      if (response.data?.success && response.data?.data) {
        recordAIUsage({
          provider: selectedProvider,
          model: selectedModel,
          usage: response.data?.usage,
          promptTokens: response.data?.usage?.prompt_tokens,
          completionTokens: response.data?.usage?.completion_tokens,
          totalTokens: response.data?.usage?.total_tokens,
          action: 'analyze'
        })
        const data = response.data.data
        const agentMsg = {
          id: String(Date.now() + 1),
          role: 'agent',
          content: data.project_summary || 'Studio artifact synthesized successfully.',
          thoughtTime: elapsed,
          studioData: data,
          timestamp: Date.now()
        }
        setMessages((prev) => [...prev, agentMsg])
      } else {
        throw new Error(response.data?.detail || 'Analysis could not be completed.')
      }
    } catch (err) {
      if (controller.signal.aborted || err?.name === 'CanceledError' || err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        const stopMsg = {
          id: String(Date.now() + 1),
          role: 'agent',
          content: '_Workspace analysis stopped by user._',
          timestamp: Date.now()
        }
        setMessages((prev) => [...prev, stopMsg])
        return
      }
      console.error('[AI Agent Error]', err)
      const errorMsg = {
        id: String(Date.now() + 1),
        role: 'agent',
        content: `⚠️ **Agent Error:** ${err.response?.data?.detail || err.message || 'Failed to communicate with AI sidecar.'}\n\n*Make sure your Gemini API Key is set in Settings (⚙️) or backend/.env.*`,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
      setIsGenerating(false)
      setActiveProcess({ type: null, label: '' })
      // Reliably consume one-time permission even after errors
      const activeMode = grantedMode || filePermission.mode
      if (activeMode === 'once') {
        setFilePermission({ granted: false, expiresAt: null, mode: null, workspacePath: null })
      }
    }
  }

  const handleRunRepoAnalysis = (customQuery = null, mode = 'badge') => {
    const isLocal = Boolean(workspacePath)
    if (isLocal && !hasValidPermission()) {
      setPendingPermissionRequest({
        type: 'scan',
        customQuery,
        mode
      })
      return
    }
    executeRepoAnalysis(customQuery, mode)
  }

  // Antigravity/Cursor In-Editor Live Diff Writer
  const handleRunEditorDiff = async (instruction, actionType = 'polish', selectionOverride = null) => {
    const targetSelection = selectionOverride || activeSelection
    if (!targetSelection || isGenerating) return
    const selectionText = typeof targetSelection === 'string' ? targetSelection : targetSelection.text
    const selectionRange = typeof targetSelection === 'object' ? targetSelection.range : null

    setActiveSelection(null)
    setActiveProcess({ type: 'diff', label: 'Synthesizing live in-editor diff...' })
    setIsGenerating(true)

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      content: instruction,
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])

    if (abortControllerRef.current) abortControllerRef.current.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const startTime = Date.now()
    try {
      // Extract surrounding context from activeContent if available
      let contextBefore = undefined
      let contextAfter = undefined
      if (selectionRange && activeContent) {
        try {
          const lines = activeContent.split('\n')
          const startIdx = Math.max(0, (selectionRange.startLineNumber || 1) - 6)
          const endIdx = Math.min(lines.length, (selectionRange.endLineNumber || lines.length) + 5)
          contextBefore = lines.slice(startIdx, Math.max(0, (selectionRange.startLineNumber || 1) - 1)).join('\n')
          contextAfter = lines.slice(selectionRange.endLineNumber || lines.length, endIdx).join('\n')
        } catch {}
      }

      const response = await apiPost(
        '/ai/editor-diff',
        {
          original_text: selectionText,
          instruction,
          context_before: contextBefore,
          context_after: contextAfter,
          provider: selectedProvider,
          model: selectedModel,
          api_key: getStoredKeyForProvider(selectedProvider) || undefined,
          base_url: selectedProvider === 'ollama' ? (localStorage.getItem('visualmark_ollama_url') || 'http://localhost:11434') : undefined,
          gemini_api_key: geminiKey || undefined,
          project_memory_text: formatMemoryForPrompt(projectMemory) || undefined
        },
        { signal: controller.signal }
      )

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1) + 's'

      if (response.data?.success && response.data?.data) {
        recordAIUsage({
          provider: selectedProvider,
          model: selectedModel,
          usage: response.data?.usage,
          promptTokens: response.data?.usage?.prompt_tokens,
          completionTokens: response.data?.usage?.completion_tokens,
          totalTokens: response.data?.usage?.total_tokens,
          action: 'diff'
        })
        const diffData = response.data.data
        const delLines = (selectionText || '').split('\n').length
        const addedLines = (diffData.replacement_text || '').split('\n').length
        const totalModified = Math.max(delLines, addedLines)

        // Dispatch event for Monaco editor to apply inline diff review with floating Accept/Reject
        window.dispatchEvent(
          new CustomEvent('visualmark:apply-ai-diff', {
            detail: {
              range: selectionRange,
              originalText: selectionText,
              replacementText: diffData.replacement_text,
              summary: diffData.summary,
              delLines,
              addedLines,
              totalModified
            }
          })
        )

        const agentMsg = {
          id: String(Date.now() + 1),
          role: 'agent',
          content: `✨ **Revision Ready:** ${diffData.summary}\n\n📝 **${totalModified} lines modified** (+${addedLines}, -${delLines} lines)\n\n*Review changes directly in the document editor.*`,
          thoughtTime: elapsed,
          diffData: {
            summary: diffData.summary,
            originalText: selectionText,
            replacementText: diffData.replacement_text,
            delLines,
            addedLines,
            totalModified,
            status: 'pending',
            actionType: diffData.action_type || actionType
          },
          timestamp: Date.now()
        }
        setMessages((prev) => [...prev, agentMsg])
        showToast('In-Editor AI Diff applied! Review in document.', 'info')
      } else {
        throw new Error(response.data?.detail || 'Diff could not be generated.')
      }
    } catch (err) {
      if (controller.signal.aborted || err?.name === 'CanceledError' || err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        const stopMsg = {
          id: String(Date.now() + 1),
          role: 'agent',
          content: '_Diff generation stopped by user._',
          timestamp: Date.now()
        }
        setMessages((prev) => [...prev, stopMsg])
        return
      }
      console.error('[AI Diff Error]', err)
      const errorMsg = {
        id: String(Date.now() + 1),
        role: 'agent',
        content: `⚠️ **Error applying edit:** ${err.response?.data?.detail || err.message || 'Failed to generate diff.'}`,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
      setIsGenerating(false)
      setActiveProcess({ type: null, label: '' })
    }
  }

  // Typewriter streaming helper for fluid 60fps conversational response
  const streamAgentResponse = (agentMsgId, fullText, elapsed = null, thought = null) => {
    if (streamingTimerRef.current) {
      clearInterval(streamingTimerRef.current)
      streamingTimerRef.current = null
    }
    let currentLen = 0
    const step = Math.max(3, Math.floor(fullText.length / 50))
    const timer = setInterval(() => {
      currentLen = Math.min(currentLen + step, fullText.length)
      const chunk = fullText.slice(0, currentLen)
      const isDone = currentLen >= fullText.length
      setMessages((prev) =>
        prev.map((m) =>
          m.id === agentMsgId
            ? { ...m, content: chunk, isStreaming: !isDone, thoughtTime: elapsed, thought: thought }
            : m
        )
      )
      if (isDone) {
        clearInterval(timer)
        streamingTimerRef.current = null
      }
    }, 16)
    streamingTimerRef.current = timer
  }

  // Core Agent Action: General Chat
  const handleSendMessage = async (e, overrideText = null) => {
    if (e) e.preventDefault()
    const rawInput = overrideText !== null ? overrideText : input
    const trimmed = rawInput.trim()
    if (!trimmed || isGenerating) return

    if (overrideText === null) {
      setInput('')
    }

    // IF ACTIVE SELECTION IS PRESENT:
    // The user selected text and typed an instruction to edit it directly in the document!
    if (activeSelection) {
      const selToEdit = activeSelection
      setActiveSelection(null)
      handleRunEditorDiff(trimmed, 'custom', selToEdit)
      return
    }

    // Auto-detect if user typed or pasted an API Key directly into the chat prompt box
    const isApiKey = /^AIzaSy[A-Za-z0-9_-]{33}$/.test(trimmed) ||
      /^(key|api_key|gemini key|gemini_api_key):\s*(AIzaSy[A-Za-z0-9_-]{33})/i.test(trimmed)
    if (isApiKey) {
      const match = trimmed.match(/AIzaSy[A-Za-z0-9_-]{33}/)
      const extractedKey = match ? match[0] : trimmed
      localStorage.setItem('visualmark_gemini_key', extractedKey)
      setGeminiKey(extractedKey)
      setHeaderKeyInput(extractedKey)
      setOnboardingKeyInput('')
      setShowKeyConfig(false)
      const confirmMsg = {
        id: String(Date.now()),
        role: 'agent',
        content: `🔑 **Google Gemini API Key successfully saved and connected!**\n\nVMarks Copilot is ready. Ask me to analyze architecture, scan tech badges, or edit your documents directly!`,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, confirmMsg])
      showToast('Gemini API Key saved and connected!', 'success')
      return
    }

    let extraContext = ''
    if (isFolderAttached) {
      extraContext += `\n[Workspace Directory Context: ${workspaceName} (${workspacePath})]\n`
    }
    if (attachedFiles.length > 0) {
      attachedFiles.forEach((f) => {
        if (f.content) {
          extraContext += `\n[Attached File: ${f.name}]\n\`\`\`\n${f.content.slice(0, 8000)}\n\`\`\`\n`
        } else {
          extraContext += `\n[Attached File: ${f.name} (${f.type})]\n`
        }
      })
    }
    if (isWebSearchActive) {
      extraContext += `\n[Web Search Enabled: Prioritize up-to-date documentation and external facts]\n`
    }

    let promptToSend = extraContext ? `${extraContext}\n${trimmed}` : trimmed
    const lower = trimmed.toLowerCase()

    // Explicit badge / scan intent only - never hijack general prompts, code snippets, or diagrams containing "badge"
    const isExplicitBadgeScan =
      lower.startsWith('/badges') ||
      lower.startsWith('/scan') ||
      /^(scan|generate|create|build|extract|add)\s+(the\s+)?(tech\s+)?badges\b/i.test(trimmed) ||
      /\b(scan|analyze)\s+(my\s+|the\s+)?(workspace|project|repo|dependencies)\s+(for\s+badges|tech\s+badges)\b/i.test(trimmed)

    if (isExplicitBadgeScan) {
      handleRunRepoAnalysis(promptToSend, 'badge')
      return
    }

    // Differentiate Process Type: Code/Fix vs Document Overview vs General Chat
    const isCodeOrFixQuery =
      lower.includes('fix') ||
      lower.includes('error') ||
      lower.includes('debug') ||
      lower.includes('syntax') ||
      lower.includes('how to') ||
      lower.includes('why') ||
      lower.includes('create') ||
      lower.includes('generate')

    const isAnalysisQuery =
      !isCodeOrFixQuery && (
        lower.includes('analy') ||
        lower.includes('review') ||
        lower.includes('inspect') ||
        lower.includes('overview') ||
        lower.includes('summar')
      )

    if (isAnalysisQuery) {
      setActiveProcess({
        type: 'analysis',
        label: `Inspecting ${activeFile || 'active document'}...`
      })
    } else {
      setActiveProcess({ type: 'chat', label: isCodeOrFixQuery ? 'Resolving code & solution...' : 'Thinking...' })
    }

    setIsGenerating(true)
    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      content: trimmed,
      timestamp: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])

    if (abortControllerRef.current) abortControllerRef.current.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const startTime = Date.now()
    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }))

      // Pass project memory text and workspace path to agent
      const resolvedKey = getStoredKeyForProvider(selectedProvider)
      const response = await apiPost(
        '/ai/chat',
        {
          prompt: promptToSend,
          history: historyPayload,
          provider: selectedProvider,
          model: selectedModel,
          api_key: resolvedKey || undefined,
          base_url: selectedProvider === 'ollama' ? (localStorage.getItem('visualmark_ollama_url') || 'http://localhost:11434') : undefined,
          gemini_api_key: geminiKey || undefined,
          active_file: activeFile || 'README.md',
          file_content: activeContent || undefined,
          workspace_path: hasValidPermission() ? workspacePath : undefined,
          project_memory_text: formatMemoryForPrompt(projectMemory) || undefined
        },
        { signal: controller.signal }
      )

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1) + 's'

      if (response.data?.success) {
        recordAIUsage({
          provider: selectedProvider,
          model: response.data.used_model || selectedModel,
          usage: response.data.usage,
          promptTokens: response.data.usage?.prompt_tokens,
          completionTokens: response.data.usage?.completion_tokens,
          totalTokens: response.data.usage?.total_tokens,
          rateLimits: response.data.usage,
          action: 'chat'
        })
        const replyText = response.data.reply || ''
        const usedModel = response.data.used_model || selectedModel
        const fallbackOccurred = Boolean(response.data.fallback_occurred)
        if (fallbackOccurred) {
          showToast(`Primary model unavailable. Auto-fell back to ${getModelInfo(usedModel).name}`, 'info')
        }
        const { cleanText, newFacts } = extractMemoryTags(replyText)
        if (newFacts.length > 0) {
          setProjectMemory((prev) => {
            const merged = Array.from(new Set([...(prev.learnedFacts || []), ...newFacts]))
            const updated = { ...prev, learnedFacts: merged }
            saveProjectMemory(workspacePath, updated)
            return updated
          })
          showToast(`Remembered: ${newFacts.join('; ')}`, 'success')
        }

        const thought = response.data.thought || null
        const agentMsgId = String(Date.now() + 1)
        const agentMsg = {
          id: agentMsgId,
          role: 'agent',
          content: '',
          isStreaming: true,
          thoughtTime: elapsed,
          thought: thought,
          model: usedModel,
          usedModel: usedModel,
          provider: response.data.provider || selectedProvider,
          fallbackOccurred: fallbackOccurred,
          timestamp: Date.now()
        }
        setMessages((prev) => [...prev, agentMsg])
        streamAgentResponse(agentMsgId, cleanText, elapsed, thought)
        if (attachedFiles.length > 0) {
          setAttachedFiles([])
        }
      } else {
        throw new Error(response.data?.detail || 'No response received.')
      }
    } catch (err) {
      if (controller.signal.aborted || err?.name === 'CanceledError' || err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
        const stopMsg = {
          id: String(Date.now() + 1),
          role: 'agent',
          content: '_Chat generation stopped by user._',
          timestamp: Date.now()
        }
        setMessages((prev) => [...prev, stopMsg])
        return
      }
      console.error('[AI Chat Error]', err)
      const errorMsg = {
        id: String(Date.now() + 1),
        role: 'agent',
        content: `⚠️ **Error:** ${err.response?.data?.detail || err.message || 'Failed to connect to AI agent.'}`,
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
      setIsGenerating(false)
      setActiveProcess({ type: null, label: '' })
    }
  }

  const handleKeyDown = (e) => {
    if (showSlashMenu && filteredSlashCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSlashSelectedIndex((prev) => (prev + 1) % filteredSlashCommands.length)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSlashSelectedIndex((prev) => (prev - 1 + filteredSlashCommands.length) % filteredSlashCommands.length)
        return
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        handleSelectSlashCommand(filteredSlashCommands[slashSelectedIndex])
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        setShowSlashMenu(false)
        return
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.nativeEvent?.isComposing) return
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="ai-agent-panel">
      {/* Header */}
      <div className="ai-agent-header">
        <div className="ai-agent-title-row">
          <VMarksAgentIcon size={16} color="#e4e4e7" className="ai-agent-custom-icon" />
          <span className="ai-agent-title">VMarks Copilot</span>
          <span className="ai-agent-badge">Beta</span>
        </div>
        <div className="ai-agent-actions">
          {filePermission.granted && (
            <div
              className="ai-header-lease-pill"
              title={
                filePermission.mode === 'always'
                  ? 'Always trust workspace'
                  : filePermission.mode === 'once'
                  ? 'One-time scan access'
                  : `${permissionSecondsLeft}s workspace access remaining`
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#10b981' }}>verified_user</span>
              <span>
                {filePermission.mode === 'always'
                  ? 'Trust'
                  : filePermission.mode === 'once'
                  ? 'Once'
                  : `${Math.floor(permissionSecondsLeft / 60)}:${String(permissionSecondsLeft % 60).padStart(2, '0')}`}
              </span>
              <button
                type="button"
                className="ai-header-lease-revoke"
                onClick={handleRevokePermission}
                title="Revoke workspace access permission"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 11 }}>close</span>
              </button>
            </div>
          )}
          {/* New Chat Button */}
          <button
            type="button"
            className="ai-agent-icon-btn"
            title="Start New Chat"
            onClick={handleCreateNewChat}
          >
            <span className="material-symbols-outlined text-sm">add_comment</span>
          </button>

          {/* History Popover Button */}
          <button
            type="button"
            className={`ai-agent-icon-btn ${showHistoryPopover ? 'active' : ''}`}
            title="Chat History Sessions"
            onClick={() => setShowHistoryPopover((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-sm">history</span>
          </button>

          {/* Project Memory Popover Button */}
          <button
            type="button"
            className={`ai-agent-icon-btn ${showMemoryPopover ? 'active' : ''}`}
            title={`Project Memory (${(projectMemory.rules?.length || 0) + (projectMemory.learnedFacts?.length || 0)} rules & facts)`}
            onClick={() => setShowMemoryPopover((prev) => !prev)}
            style={{ position: 'relative' }}
          >
            <span className="material-symbols-outlined text-sm">psychology</span>
            {((projectMemory.rules?.length || 0) + (projectMemory.learnedFacts?.length || 0)) > 0 && (
              <span className="ai-memory-badge-count">
                {(projectMemory.rules?.length || 0) + (projectMemory.learnedFacts?.length || 0)}
              </span>
            )}
          </button>

          {/* API Key button: only displayed if user hasn't configured a key yet */}
          {!geminiKey && (
            <button
              type="button"
              className="ai-agent-icon-btn key-alert"
              title="Configure Gemini API Key"
              onClick={() => setShowKeyConfig((prev) => !prev)}
            >
              <span className="material-symbols-outlined text-sm" style={{ color: '#fbbf24' }}>key</span>
            </button>
          )}

          {/* Sidebar Width Toggle */}
          <button
            type="button"
            className="ai-agent-icon-btn"
            title={
              panelWidthMode === 'standard'
                ? 'Expand Sidebar to Wide (540px)'
                : panelWidthMode === 'wide'
                ? 'Maximize Sidebar (760px)'
                : 'Reset Sidebar to Standard (340px)'
            }
            onClick={handleTogglePanelWidth}
          >
            <span className="material-symbols-outlined text-sm">
              {panelWidthMode === 'standard' ? 'open_in_full' : panelWidthMode === 'wide' ? 'width_wide' : 'close_fullscreen'}
            </span>
          </button>
        </div>
      </div>

      {/* Chat Sessions History Popover */}
      {showHistoryPopover && (
        <div className="ai-history-popover" ref={historyPopoverRef}>
          <div className="ai-history-popover-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#818cf8' }}>history</span>
              <span>Chat Sessions ({sessions.length})</span>
            </div>
            <button
              type="button"
              className="ai-selection-close-btn"
              onClick={() => setShowHistoryPopover(false)}
              title="Close history"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
            </button>
          </div>
          <div className="ai-history-list custom-scrollbar">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`ai-history-item ${sess.id === activeSessionId ? 'active' : ''}`}
                onClick={() => handleSelectSession(sess.id)}
              >
                <div className="ai-history-item-info">
                  <span className="ai-history-item-title" title={sess.title}>
                    {sess.title || 'New Chat'}
                  </span>
                  <span className="ai-history-item-meta">
                    <span>{sess.messages?.length || 0} msgs</span>
                    <span>•</span>
                    <span>{new Date(sess.updatedAt || sess.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </span>
                </div>
                <button
                  type="button"
                  className="ai-history-item-delete"
                  title="Delete this chat session"
                  onClick={(e) => handleDeleteSession(e, sess.id)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>delete</span>
                </button>
              </div>
            ))}
          </div>
          <div className="ai-history-popover-footer">
            <button
              type="button"
              className="ai-history-footer-btn"
              onClick={handleCreateNewChat}
              style={{ color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>add</span>
              <span>New Chat</span>
            </button>
            <button
              type="button"
              className="ai-history-footer-btn"
              onClick={handleClearAllHistory}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Project Memory Popover */}
      {showMemoryPopover && (
        <ProjectMemoryPopover
          popoverRef={memoryPopoverRef}
          workspacePath={workspacePath}
          memory={projectMemory}
          onUpdateMemory={(newMem) => {
            setProjectMemory(newMem)
            saveProjectMemory(workspacePath, newMem)
          }}
          onClose={() => setShowMemoryPopover(false)}
          onRescanProfile={handleRescanProjectProfile}
        />
      )}

      {/* Workspace File Access Permission Request Banner */}
      {pendingPermissionRequest && (
        <div className="ai-permission-card">
          <div className="ai-permission-header">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>shield</span>
            <span>Workspace File Access Permission</span>
          </div>
          <div className="ai-permission-desc">
            VMarks is requesting permission to scan project manifests (e.g. <code>package.json</code>, <code>requirements.txt</code>, <code>LICENSE</code>) in:
          </div>
          <div className="ai-permission-path" title={workspacePath}>
            📂 {workspaceName} ({workspacePath})
          </div>
          <div className="ai-permission-actions">
            <button
              type="button"
              className="ai-permission-btn primary"
              onClick={() => handleGrantPermission('once')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check</span>
              <span>Allow Once</span>
            </button>
            <button
              type="button"
              className="ai-permission-btn timed"
              onClick={() => handleGrantPermission('5min')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>timer</span>
              <span>Allow for 5 min</span>
            </button>
            <button
              type="button"
              className="ai-permission-btn timed"
              onClick={() => handleGrantPermission('10min')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>timer</span>
              <span>Allow for 10 min</span>
            </button>
            <button
              type="button"
              className="ai-permission-btn"
              onClick={() => handleGrantPermission('always')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>lock_open</span>
              <span>Always Trust Project</span>
            </button>
            <button
              type="button"
              className="ai-permission-btn deny"
              onClick={handleDenyPermission}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
              <span>Deny</span>
            </button>
          </div>
        </div>
      )}

      {/* Optional API Key Configuration Card */}
      {showKeyConfig && (
        <div className="ai-settings-banner">
          <div style={{ fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14, color: AI_PROVIDERS[selectedProvider]?.color || '#818cf8' }}>
              {AI_PROVIDERS[selectedProvider]?.icon || 'key'}
            </span>
            <span>{AI_PROVIDERS[selectedProvider]?.name || 'Gemini'} Key / URL</span>
          </div>
          <p style={{ margin: '0 0 6px 0', fontSize: '10px', color: '#fef3c7' }}>
            Keys stored here are kept in local storage and power your active AI model selection.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveProviderKey(selectedProvider, headerKeyInput)
            }}
            style={{ display: 'flex', gap: 6 }}
          >
            <input
              type={selectedProvider === 'ollama' ? 'text' : 'password'}
              placeholder={AI_PROVIDERS[selectedProvider]?.keyPlaceholder || 'Paste API Key...'}
              value={headerKeyInput}
              onChange={(e) => setHeaderKeyInput(e.target.value)}
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '11px',
                background: '#18181b',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 4
              }}
            />
            <button
              type="submit"
              className="ai-studio-action-btn primary"
              style={{ padding: '4px 8px', fontSize: '10px' }}
            >
              Save
            </button>
          </form>
        </div>
      )}

      {/* Chat Messages Thread */}
      <div className="ai-messages-thread custom-scrollbar">
        {/* Modern Welcome Hero Card for new or empty chat */}
        {(messages.length === 0 || (messages.length === 1 && messages[0].id === 'initial')) && (
          <div className="ai-chat-welcome-hero">
            <div className="ai-welcome-glow-wrap">
              <div className="ai-welcome-glow"></div>
              <div className="ai-welcome-icon-box">
                <VMarksAgentIcon size={22} color="#ffffff" />
              </div>
            </div>
            <h3 className="ai-welcome-title">How can VMarks assist you today?</h3>
            <p className="ai-welcome-subtitle">
              Architect documentation, synthesize Shields.io badges, design Mermaid diagrams, or apply live in-editor diffs. Type <code style={{ color: '#e4e4e7', background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 4 }}>/</code> for quick actions or use <code style={{ color: '#e4e4e7', background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 4 }}>+</code> to add context.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`ai-msg ${msg.role}`}>
            {msg.role === 'user' ? (
              <div className="ai-user-bubble">
                <div className="ai-user-msg-header">
                  <div className="ai-user-header-left">
                    <span className="ai-user-label">You</span>
                    {msg.timestamp && (
                      <>
                        <span className="ai-user-sep">•</span>
                        <span className="ai-user-time">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ai-user-msg-content">{msg.content}</div>
              </div>
            ) : (
              <>
                <div className="ai-msg-header">
                  <div className="ai-msg-header-left">
                    <div className="ai-msg-avatar-badge">
                      <VMarksAgentIcon size={12} color="#e4e4e7" />
                    </div>
                    <span className="ai-msg-name">VMarks</span>
                    <span className="ai-msg-model-pill" title={`Response from ${msg.usedModel || msg.model || getModelInfo(selectedModel).name}`}>
                      {getModelInfo(msg.usedModel || msg.model || selectedModel).name}
                      {msg.fallbackOccurred && (
                        <span className="ai-msg-fallback-tag" title="Auto-fell back because the primary model failed">
                          Fallback
                        </span>
                      )}
                    </span>
                    {msg.thoughtTime && (
                      <span className="ai-msg-thought-tag" title="Response generation latency">
                        {msg.thoughtTime}
                      </span>
                    )}
                  </div>
                  <div className="ai-msg-header-actions">
                    <button
                      type="button"
                      className={`ai-msg-action-icon-btn ${rawMsgIds.has(msg.id) ? 'active' : ''}`}
                      onClick={() => toggleRawMsgView(msg.id)}
                      title={rawMsgIds.has(msg.id) ? 'Switch to Rendered Preview' : 'View Raw Markdown text'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                        {rawMsgIds.has(msg.id) ? 'visibility' : 'code'}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="ai-msg-action-icon-btn"
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      title="Copy response markdown"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                        {copiedMsgId === msg.id ? 'check' : 'content_copy'}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="ai-msg-action-icon-btn"
                      onClick={() => handleInsertDoc(msg.content, 'AI Response')}
                      title="Insert response at cursor in active document"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>post_add</span>
                    </button>
                  </div>
                </div>

                <div className="ai-msg-body">
              {/* Genuine AI Reasoning / Thought Disclosure */}
              {msg.thought && (
                <details className="ai-thought-details">
                  <summary className="ai-thought-summary">
                    <span className="material-symbols-outlined ai-thought-chevron">expand_more</span>
                    <span className="material-symbols-outlined ai-thought-icon">psychology</span>
                    <span>Thought{msg.thoughtTime ? ` for ${msg.thoughtTime}` : ''}</span>
                  </summary>
                  <div className="ai-thought-body">
                    <pre className="ai-thought-text">{msg.thought}</pre>
                  </div>
                </details>
              )}

              {/* Rich Markdown Message Content or Raw View */}
              {rawMsgIds.has(msg.id) ? (
                <div className="ai-chat-raw-msg">
                  <pre className="ai-raw-markdown-pre">
                    <code>{msg.content}</code>
                  </pre>
                </div>
              ) : (
                <div className="ai-markdown-rendered">
                  <ReactMarkdown
                    remarkPlugins={[remarkGithubAlerts, remarkGfm, remarkBreaks]}
                    components={{
                      pre({ children }) {
                        return <>{children}</>
                      },
                      p({ node, className, children, ...props }) {
                        if (className?.includes?.('markdown-alert-title')) {
                          const alertType = node?.properties?.dataAlertType || 'NOTE'
                          const icon = ALERT_ICONS[alertType] || ALERT_ICONS.NOTE
                          return (
                            <p className={className} {...props}>
                              <span className="markdown-alert-icon">{icon}</span>
                              <span>{children}</span>
                            </p>
                          )
                        }
                        return <p className={className} {...props}>{children}</p>
                      },
                      img({ node, ...props }) {
                        return (
                          <img
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              borderRadius: 6,
                              margin: '6px 0',
                              border: '1px solid rgba(255,255,255,0.1)',
                              display: 'block'
                            }}
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              const parent = e.target.parentNode
                              if (parent && !parent.querySelector('.ai-img-fallback')) {
                                const fallback = document.createElement('span')
                                fallback.className = 'ai-img-fallback'
                                fallback.innerText = `🖼 ${props.alt || props.src || 'Image'}`
                                parent.appendChild(fallback)
                              }
                            }}
                            {...props}
                            alt={props.alt || ''}
                          />
                        )
                      },
                      table({ node, children, ...props }) {
                        const extractNodeText = (n) => {
                          if (!n) return ''
                          if (typeof n.value === 'string') return n.value
                          if (Array.isArray(n.children)) return n.children.map(extractNodeText).join('')
                          return ''
                        }
                        const tableRows = node?.children || []
                        const headerRow = tableRows[0]
                        const bodyRows = tableRows.slice(1)
                        const headers = (headerRow?.children || []).map((c) => extractNodeText(c).trim())
                        const rows = bodyRows.map((r) => (r.children || []).map((c) => extractNodeText(c).trim()))

                        const handleOpenInTableStudio = () => {
                          window.dispatchEvent(new CustomEvent('visualmark:open-studio-tab', { detail: { tabId: 'tables.studio' } }))
                          window.dispatchEvent(new CustomEvent('visualmark:set-table-data', { detail: { headers, rows } }))
                          showToast('Loaded table into Table Studio!', 'success')
                        }

                        const handleInsertTableAtCursor = () => {
                          if (!headers.length) return
                          const headerLine = `| ${headers.join(' | ')} |`
                          const sepLine = `| ${headers.map(() => '---').join(' | ')} |`
                          const bodyLines = rows.map((r) => `| ${r.join(' | ')} |`)
                          const tableMarkdown = [headerLine, sepLine, ...bodyLines].join('\n')
                          handleInsertDoc(tableMarkdown, 'Markdown Table')
                        }

                        return (
                          <div className="ai-chat-table-wrapper">
                            <div className="ai-chat-table-scroll">
                              <table {...props}>{children}</table>
                            </div>
                            <div className="ai-code-insert-bar" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                className="ai-code-insert-btn"
                                onClick={handleOpenInTableStudio}
                                title="Open and edit this table directly in Table Studio"
                                style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>grid_on</span>
                                <span>Edit in Table Studio ↗</span>
                              </button>
                              <button
                                type="button"
                                className="ai-code-insert-btn"
                                onClick={handleInsertTableAtCursor}
                                title="Insert this table directly at cursor in active document"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>post_add</span>
                                <span>Insert at Cursor</span>
                              </button>
                            </div>
                          </div>
                        )
                      },
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const codeStr = String(children).replace(/\n$/, '')
                        if (!inline && match) {
                          const lang = match[1].toLowerCase()
                          if (lang === 'markdown' || lang === 'md') {
                            return (
                              <MarkdownSnippetBlock
                                codeStr={codeStr}
                                onInsert={handleInsertDoc}
                                showToast={showToast}
                              />
                            )
                          }
                          const isMermaid = lang === 'mermaid'
                          const isTableSnippet = (lang === 'markdown' || lang === 'md') && codeStr.includes('|') && codeStr.includes('---')

                        return (
                          <div className="ai-chat-code-wrapper">
                            <CodeBlock
                              language={match[1]}
                              value={codeStr}
                              {...props}
                            />
                            <div className="ai-code-insert-bar" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {isMermaid && (
                                <button
                                  type="button"
                                  className="ai-code-insert-btn"
                                  onClick={() => {
                                    window.dispatchEvent(new CustomEvent('visualmark:open-studio-tab', { detail: { tabId: 'diagrams.studio' } }))
                                    window.dispatchEvent(new CustomEvent('visualmark:set-diagram-code', { detail: { code: codeStr } }))
                                    showToast('Opened in Architecture Diagram Studio!', 'success')
                                  }}
                                  title="Open this diagram directly in Architecture Diagram Studio"
                                  style={{ color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.4)' }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>account_tree</span>
                                  <span>Open in Diagram Studio ↗</span>
                                </button>
                              )}
                              {isTableSnippet && (
                                <button
                                  type="button"
                                  className="ai-code-insert-btn"
                                  onClick={() => {
                                    window.dispatchEvent(new CustomEvent('visualmark:open-studio-tab', { detail: { tabId: 'tables.studio' } }))
                                    window.dispatchEvent(new CustomEvent('visualmark:set-table-data', { detail: { markdown: codeStr } }))
                                    showToast('Loaded into Table Studio!', 'success')
                                  }}
                                  title="Open and edit this table directly in Table Studio"
                                  style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>grid_on</span>
                                  <span>Edit in Table Studio ↗</span>
                                </button>
                              )}
                              <button
                                type="button"
                                className="ai-code-insert-btn"
                                onClick={() => handleInsertDoc(codeStr, `${match[1]} Snippet`)}
                                title="Insert this code snippet directly at cursor in active document"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>post_add</span>
                                <span>Insert at Cursor</span>
                              </button>
                            </div>
                          </div>
                        )
                      }
                      return (
                        <code className="ai-inline-code" {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
                {msg.isStreaming && <span className="ai-streaming-cursor" />}
              </div>
            )}

              {/* Compact In-Chat Diff Status Card (Less Clutter, Clean Line Counts) */}
              {msg.diffData && (
                <div className={`ai-diff-status-card ${msg.diffData.status || 'pending'}`}>
                  {msg.diffData.status === 'accepted' ? (
                    <div className="ai-diff-status-header">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#10b981' }}>check_circle</span>
                      <span>Changes Accepted into Document ({msg.diffData.totalModified || msg.diffData.addedLines || 1} lines committed)</span>
                    </div>
                  ) : msg.diffData.status === 'rejected' ? (
                    <div className="ai-diff-status-header">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#f87171' }}>cancel</span>
                      <span>Revision Discarded (Document restored)</span>
                    </div>
                  ) : (
                    <>
                      <div className="ai-diff-status-header">
                        <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#fbbf24' }}>pending_actions</span>
                        <span>
                          Pending Review in Editor: {msg.diffData.totalModified || 1} lines modified
                          {msg.diffData.addedLines !== undefined && (
                            <span style={{ marginLeft: 4, opacity: 0.85, fontWeight: 500 }}>
                              (+{msg.diffData.addedLines}, -{msg.diffData.delLines})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="ai-diff-disclaimer">
                        <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#fbbf24' }}>info</span>
                        <span>VMarks can make mistakes, check manually before doing any changes</span>
                      </div>
                      <div className="ai-diff-mini-actions">
                        <button
                          type="button"
                          className="ai-diff-mini-btn accept"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('visualmark:accept-ai-diff'))
                            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, diffData: { ...m.diffData, status: 'accepted' } } : m))
                            showToast('Applied AI changes to document!', 'success')
                          }}
                          title="Commit changes to document (Ctrl+Enter)"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check</span>
                          <span>Accept</span>
                        </button>
                        <button
                          type="button"
                          className="ai-diff-mini-btn reject"
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('visualmark:reject-ai-diff'))
                            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, diffData: { ...m.diffData, status: 'rejected' } } : m))
                            showToast('Reverted document to original', 'info')
                          }}
                          title="Discard changes (Esc)"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                          <span>Reject</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Interactive Badge Studio Action Card */}
              {Boolean(msg.studioData?.badge_studio || msg.studioData?.badges_studio) && (() => {
                const rawList = msg.studioData.badge_studio || msg.studioData.badges_studio
                const badges = Array.isArray(rawList) ? rawList : (rawList?.badges || [])
                if (!badges.length) return null

                const buildBadgeUrl = (b) => {
                  const c = (b.color || '6366f1').replace('#', '').trim()
                  const s = b.style || 'for-the-badge'
                  const hasMsg = Boolean(b.message && String(b.message).trim())
                  let badgePart = ''
                  if (b.format === 'brand-plate' || !hasMsg) {
                    badgePart = `${encodeURIComponent(b.title || b.label || 'tech')}-${c}`
                  } else {
                    badgePart = `${encodeURIComponent(b.label || 'tech')}-${encodeURIComponent(b.message || '')}-${c}`
                  }
                  let url = `https://img.shields.io/badge/${badgePart}?style=${s}`
                  if (b.labelColor && b.format !== 'brand-plate') {
                    url += `&labelColor=${encodeURIComponent(b.labelColor.replace('#', ''))}`
                  }
                  if (b.logo) {
                    url += `&logo=${encodeURIComponent(b.logo)}`
                    url += `&logoColor=${encodeURIComponent(b.logoColor || (c.toUpperCase() === '61DAFB' ? 'black' : 'white'))}`
                  }
                  return url
                }

                return (
                  <div className="ai-studio-action-card">
                    <div className="ai-studio-item-header">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#34d399' }}>verified</span>
                      <span className="ai-studio-item-name">Tech Stack Badges ({badges.length} badges)</span>
                    </div>
                    {/* Mini Preview of Badges */}
                    <div className="ai-studio-badges-preview">
                      {badges.map((b, idx) => (
                        <img
                          key={idx}
                          src={buildBadgeUrl(b)}
                          alt={b.title || b.label}
                          style={{ height: 20, borderRadius: 3 }}
                          onError={(e) => { e.target.style.opacity = '0.5' }}
                        />
                      ))}
                    </div>
                    <div className="ai-studio-btn-row">
                      <button
                        type="button"
                        className="ai-studio-action-btn primary"
                        onClick={() => {
                          const snippet = msg.studioData.badge_markdown ||
                            `<div align="center">\n\n${badges.map(b => {
                              const u = buildBadgeUrl(b)
                              const alt = b.title || `${b.label} ${b.message || ''}`.trim()
                              return b.url || b.link ? `[![${alt}](${u})](${b.url || b.link})` : `![${alt}](${u})`
                            }).join('\n')}\n\n</div>`
                          handleInsertDoc(snippet, 'Tech Badges')
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>post_add</span>
                        <span>Insert into Doc</span>
                      </button>
                      <button
                        type="button"
                        className="ai-studio-action-btn secondary"
                        onClick={() => handlePopulateBadges(badges)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#34d399' }}>edit</span>
                        <span>Edit in Badge Studio ↗</span>
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
            </>
            )}
          </div>
        ))}

        {/* Differentiated Process Indicators: Typing dots bubble for normal chat, Banner for diff/scan/analysis */}
        {isGenerating && activeProcess.type === 'chat' && (
          <div className="ai-msg agent">
            <div className="ai-msg-header">
              <div className="ai-msg-avatar-badge">
                <VMarksAgentIcon size={12} color="#e4e4e7" />
              </div>
              <span className="ai-msg-name">VMarks</span>
            </div>
            <div className="ai-msg-body">
              <div className="ai-typing-bubble" title="VMarks is typing...">
                <div className="ai-typing-indicator">
                  <span className="ai-typing-dot"></span>
                  <span className="ai-typing-dot"></span>
                  <span className="ai-typing-dot"></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isGenerating && activeProcess.type !== 'chat' && (
          <div className="ai-thought-active-banner">
            <div className="ai-thought-active-header">
              <span className="material-symbols-outlined ai-spin-icon" style={{ fontSize: 13, color: '#a1a1aa' }}>progress_activity</span>
              <span className="ai-thought-active-title">
                {activeProcess.label || 'Thinking & processing...'}
              </span>
              <span className="ai-thought-active-time">{thoughtTimer}s</span>
            </div>
            <div className="ai-thought-active-bar">
              <div
                className="ai-thought-progress-fill"
                style={{ width: `${Math.min(95, (Number(thoughtTimer) / 4) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Multi-Provider Key Onboarding Card (Shown if no provider configured) */}
        {!hasAnyProviderConfigured() && (
          <div className="ai-key-onboarding-card">
            <div className="ai-key-onboarding-header">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>bolt</span>
              <span>Connect an AI Provider to Start Copilot</span>
            </div>
            <div className="ai-key-onboarding-text">
              VMarks Copilot supports multiple AI engines. Connect <strong>at least one</strong> provider below to architect documents, generate live diffs, and synthesize tech badges:
            </div>

            {/* Provider Tabs */}
            <div className="ai-onboarding-tabs">
              {Object.values(AI_PROVIDERS).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`ai-onboarding-tab-btn ${onboardingActiveProvider === p.id ? 'active' : ''}`}
                  onClick={() => setOnboardingActiveProvider(p.id)}
                >
                  <span>{p.shortName}</span>
                </button>
              ))}
            </div>

            {/* Active Provider Card */}
            {(() => {
              const p = AI_PROVIDERS[onboardingActiveProvider] || AI_PROVIDERS.gemini
              if (p.isLocal) {
                return (
                  <div className="ai-key-onboarding-actions">
                    <div style={{ fontSize: 11, color: '#cbd5e1' }}>
                      Run models 100% locally on your machine with Ollama. Zero network requests or telemetry.
                    </div>
                    <div className="ai-key-input-row">
                      <input
                        type="text"
                        className="ai-key-input"
                        value={onboardingKeyInputs.ollama || 'http://localhost:11434'}
                        onChange={(e) => setOnboardingKeyInputs((prev) => ({ ...prev, ollama: e.target.value }))}
                        placeholder="http://localhost:11434"
                      />
                      <button
                        type="button"
                        className="ai-key-save-btn"
                        onClick={() => handleSaveProviderKey('ollama')}
                      >
                        Enable Ollama
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div className="ai-key-onboarding-actions">
                  <a
                    href={p.keyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="ai-key-link-btn"
                    onClick={(e) => {
                      if (window.electronAPI?.openExternal) {
                        e.preventDefault()
                        window.electronAPI.openExternal(p.keyLink)
                      }
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
                    <span>{p.keyHelp} ↗</span>
                  </a>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSaveProviderKey(p.id)
                    }}
                    className="ai-key-input-row"
                  >
                    <input
                      type="password"
                      className="ai-key-input"
                      placeholder={p.keyPlaceholder}
                      value={onboardingKeyInputs[p.id] || ''}
                      onChange={(e) => {
                        const val = e.target.value
                        setOnboardingKeyInputs((prev) => ({ ...prev, [p.id]: val }))
                      }}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="ai-key-save-btn"
                      disabled={!(onboardingKeyInputs[p.id] || '').trim()}
                    >
                      Save & Connect
                    </button>
                  </form>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: 2 }}>
                    💡 You can configure additional providers anytime in <strong>Settings (⚙️) ➔ AI Providers & Integrations</strong>.
                  </div>
                </div>
              )
            })()}
          </div>
        )}
        <div ref={threadEndRef} />
      </div>

      {/* Modern Floating AI Chat Input Hub */}
      <div className="ai-input-container">
        {/* Context Bar showing active workspace, document, and attached context */}
        <div className="ai-input-context-bar">
          <div className="ai-context-chip" title={workspacePath || 'No local workspace open'}>
            <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#a1a1aa' }}>folder</span>
            <span>{workspaceName}</span>
          </div>
          <div className="ai-context-chip" title={`Active file: ${activeFile || 'README.md'}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#a1a1aa' }}>description</span>
            <span>{activeFile || 'README.md'}</span>
          </div>

          {isFolderAttached && (
            <div className="ai-context-chip attached-chip" title={`Workspace directory attached: ${workspacePath}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#38bdf8' }}>folder_open</span>
              <span>Dir: {workspaceName}</span>
              <button
                type="button"
                className="ai-chip-close"
                onClick={() => setIsFolderAttached(false)}
                title="Remove folder context"
              >
                ✕
              </button>
            </div>
          )}

          {isWebSearchActive && (
            <div className="ai-context-chip attached-chip" title="Online web search active for queries">
              <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#60a5fa' }}>language</span>
              <span>Web Search</span>
              <button
                type="button"
                className="ai-chip-close"
                onClick={() => setIsWebSearchActive(false)}
                title="Disable web search"
              >
                ✕
              </button>
            </div>
          )}

          {attachedFiles.map((file, idx) => (
            <div key={idx} className="ai-context-chip attached-chip" title={`${file.name} (${file.type})`}>
              <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#34d399' }}>
                {file.type === 'image' ? 'image' : 'attach_file'}
              </span>
              <span>{file.name}</span>
              <button
                type="button"
                className="ai-chip-close"
                onClick={() => handleRemoveAttachedFile(idx)}
                title="Remove attachment"
              >
                ✕
              </button>
            </div>
          ))}

          {activeSelection && (
            <div className="ai-context-chip active-selection-pill" title="Editor selection active">
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>format_shapes</span>
              <span>Selection Active</span>
            </div>
          )}
        </div>

        {/* Docked Selection Context Hub if text is selected */}
        {activeSelection && (
          <div className="ai-attached-selection-hub">
            <div className="ai-attached-selection-header">
              <div className="ai-attached-selection-title">
                <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#c084fc' }}>format_shapes</span>
                <span>
                  Selection {activeSelection.range ? `(Lines ${activeSelection.range.startLineNumber}–${activeSelection.range.endLineNumber})` : `(${activeSelection.text?.length || activeSelection.length || 0} chars)`}
                </span>
              </div>
              <button
                type="button"
                className="ai-attached-selection-close"
                onClick={() => setActiveSelection(null)}
                title="Dismiss selection context"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
              </button>
            </div>

            <div className="ai-attached-selection-preview">
              {((activeSelection.text || activeSelection).length > 90)
                ? `${(activeSelection.text || activeSelection).slice(0, 90)}...`
                : (activeSelection.text || activeSelection)}
            </div>

            {/* Quick Preset Action Buttons */}
            <div className="ai-attached-preset-actions">
              <button
                type="button"
                className="ai-preset-action-chip"
                disabled={isGenerating}
                onClick={() =>
                  handleRunEditorDiff('Polish, refine, and improve grammar, tone, and technical markdown clarity', 'polish')
                }
                title="Directly apply polished revision in Monaco Editor with live Diff review"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#38bdf8' }}>auto_fix_high</span>
                <span>Polish to Editor</span>
              </button>
              <button
                type="button"
                className="ai-preset-action-chip"
                disabled={isGenerating}
                onClick={() =>
                  handleRunEditorDiff('Identify all technologies, libraries, licenses, or tools in this selection and convert them into a centered Shields.io badge rack in Markdown', 'badges')
                }
                title="Convert technologies in selection into Shields.io badges directly in editor"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#10b981' }}>verified</span>
                <span>To Badges Diff</span>
              </button>
              <button
                type="button"
                className="ai-preset-action-chip"
                disabled={isGenerating}
                onClick={() =>
                  handleRunEditorDiff('Condense and simplify this content into punchy, clear documentation with crisp markdown formatting', 'condense')
                }
                title="Condense and streamline selected markdown text"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#a855f7' }}>short_text</span>
                <span>Condense Text</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="ai-input-wrap">
          {/* Hidden File Input for Attachments */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFilesSelected}
            style={{ display: 'none' }}
          />

          {/* Floating Slash Command Palette */}
          {showSlashMenu && filteredSlashCommands.length > 0 && (
            <div className="ai-slash-menu" ref={slashMenuRef}>
              <div className="ai-slash-menu-header">Commands</div>
              <div className="ai-slash-menu-list">
                {filteredSlashCommands.map((cmd, idx) => (
                  <div
                    key={cmd.cmd}
                    className={`ai-slash-item ${slashSelectedIndex === idx ? 'selected' : ''}`}
                    onClick={() => handleSelectSlashCommand(cmd)}
                    onMouseEnter={() => setSlashSelectedIndex(idx)}
                  >
                    <div className="ai-slash-item-icon" style={{ color: cmd.color, background: `${cmd.color}20` }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{cmd.icon}</span>
                    </div>
                    <div className="ai-slash-item-content">
                      <span className="ai-slash-item-cmd">{cmd.cmd}</span>
                      <span className="ai-slash-item-title">{cmd.title}</span>
                      <span className="ai-slash-item-desc">{cmd.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="ai-textarea"
            placeholder={
              activeSelection
                ? 'Ask VMarks how to modify this selection, or type / for commands...'
                : 'Ask anything, @ to mention, / for actions'
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            rows={2}
          />
          <div className="ai-input-bottom-row">
            <div className="ai-input-bottom-left">
              {/* Standalone Add Context Button */}
              <button
                ref={addContextBtnRef}
                type="button"
                className={`ai-add-context-btn ${isAddContextOpen ? 'active' : ''}`}
                onClick={() => {
                  updateAddContextPos()
                  setIsAddContextOpen((prev) => !prev)
                }}
                data-tooltip="Add Context"
              >
                +
              </button>

              {/* Model Trigger Pill */}
              <button
                ref={triggerBtnRef}
                type="button"
                className={`ai-model-trigger-pill ${isModelSelectorOpen ? 'open' : ''}`}
                onClick={() => {
                  updatePopoverPos()
                  setIsModelSelectorOpen((prev) => !prev)
                }}
                data-tooltip="Select Model"
              >
                <span className="ai-model-trigger-name">
                  {AI_PROVIDERS[selectedProvider]?.shortName || 'Gemini'} {getModelInfo(selectedModel).shortName || getModelInfo(selectedModel).name}
                </span>
                <span className="material-symbols-outlined ai-model-trigger-chevron">
                  {isModelSelectorOpen ? 'expand_more' : 'expand_less'}
                </span>
              </button>
            </div>

            <div className="ai-input-bottom-right">
              {isGenerating ? (
                <button
                  type="button"
                  className="ai-send-circle-btn stop"
                  onClick={handleStopGenerating}
                  data-tooltip="Stop Generation"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className={`ai-send-circle-btn ${input.trim() ? 'active' : ''}`}
                  disabled={!input.trim()}
                  data-tooltip={input.trim() ? 'Send message' : undefined}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: 'block' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="ai-panel-disclaimer">
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>info</span>
          <span>VMarks can make mistakes. Check manually before doing any changes.</span>
        </div>
      </div>

      {/* Floating Model Picker Popover & Flyouts (Portal to document.body) */}
      {isModelSelectorOpen &&
        createPortal(
          <div
            ref={menuPortalRef}
            className="ai-model-menu-portal"
            style={{
              position: 'fixed',
              left: `${popoverPos.left}px`,
              bottom: `${popoverPos.bottom}px`,
              zIndex: 10000
            }}
          >
            {/* Main Menu */}
            <div className="ai-model-menu-main">
              <div className="ai-model-menu-header">Model</div>
              <div className="ai-model-menu-list">
                {Object.values(AI_PROVIDERS).map((p) => {
                  const isActiveProvider = selectedProvider === p.id
                  const isConfigured = hasProviderKey(p.id)
                  const isHovered = hoveredMenu === p.id

                  return (
                    <div
                      key={p.id}
                      className={`ai-model-menu-row ${isActiveProvider ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                      onMouseEnter={(e) => handleRowMouseEnter(p.id, e)}
                      onMouseLeave={handleRowMouseLeave}
                      onClick={() => {
                        if (!isActiveProvider) {
                          handleSelectModel(p.defaultModel, p.id)
                        }
                      }}
                    >
                      <span className="ai-model-menu-row-name">{p.shortName || p.name}</span>

                      <div className="ai-model-menu-row-right">
                        {isActiveProvider ? (
                          <>
                            <span className="ai-model-menu-row-model-badge">
                              {getModelInfo(selectedModel).shortName || getModelInfo(selectedModel).name}
                            </span>
                            <span className="ai-model-menu-check-icon">✓</span>
                          </>
                        ) : !isConfigured && !p.isLocal ? (
                          <div
                            className="ai-model-status-wrapper"
                            onClick={handleOpenSettings}
                          >
                            <span className="ai-model-menu-status-pill notice">
                              Notice <span className="ai-model-menu-info-circle">ⓘ</span>
                            </span>
                            <div className="ai-model-status-tooltip" role="tooltip">
                              <div className="ai-model-tooltip-title">
                                <span>API Key Required</span>
                              </div>
                              <div className="ai-model-tooltip-body">
                                No API key configured for {p.name}. Add your API key in Settings &gt; AI Providers to enable these models.
                              </div>
                              <button
                                type="button"
                                className="ai-model-tooltip-action"
                                onClick={handleOpenSettings}
                              >
                                Open Settings →
                              </button>
                            </div>
                          </div>
                        ) : p.isLocal && localStorage.getItem('visualmark_ollama_enabled') !== 'true' ? (
                          <div
                            className="ai-model-status-wrapper"
                            onClick={handleOpenSettings}
                          >
                            <span className="ai-model-menu-status-pill unavailable">
                              Unavailable <span className="ai-model-menu-info-circle">ⓘ</span>
                            </span>
                            <div className="ai-model-status-tooltip" role="tooltip">
                              <div className="ai-model-tooltip-title">
                                <span>Local Engine Offline</span>
                              </div>
                              <div className="ai-model-tooltip-body">
                                Ollama is disabled or unreachable at {localStorage.getItem('visualmark_ollama_url') || 'http://localhost:11434'}. Ensure Ollama is running and enabled in Settings.
                              </div>
                              <button
                                type="button"
                                className="ai-model-tooltip-action"
                                onClick={handleOpenSettings}
                              >
                                Check Settings →
                              </button>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="ai-model-menu-divider" />

              {/* View Usage Row */}
              <div
                className={`ai-model-menu-row ai-model-menu-usage-row ${hoveredMenu === 'usage' ? 'hovered' : ''}`}
                onMouseEnter={(e) => handleRowMouseEnter('usage', e)}
                onMouseLeave={handleRowMouseLeave}
              >
                <div className="ai-model-menu-usage-left">
                  <svg
                    className="ai-model-menu-speedo-icon"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m12 14 4-4" />
                    <path d="M3.5 17a9.5 9.5 0 1 1 17 0c0 .8-.7 1.5-1.5 1.5H5c-.8 0-1.5-.7-1.5-1.5z" />
                  </svg>
                  <span>View Usage</span>
                </div>
                <span className="ai-model-menu-chevron">›</span>
              </div>
            </div>

            {/* Flyout Subpanel for Models (Hovering over a Provider) */}
            {hoveredMenu && hoveredMenu !== 'usage' && AI_PROVIDERS[hoveredMenu] && (
              <div
                className="ai-model-flyout-panel ai-model-sub-flyout"
                style={{
                  top: `${Math.min(flyoutTopOffset, 140)}px`
                }}
                onMouseEnter={handleFlyoutMouseEnter}
                onMouseLeave={handleFlyoutMouseLeave}
              >
                {AI_PROVIDERS[hoveredMenu].models.map((m) => {
                  const isSelected = selectedModel === m.id
                  return (
                    <div
                      key={m.id}
                      className={`ai-model-flyout-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectModel(m.id, hoveredMenu)}
                    >
                      <span className="ai-model-flyout-name">{m.shortName || m.name}</span>
                      {isSelected && <span className="ai-model-flyout-check">✓</span>}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Flyout Subpanel for View Usage */}
            {hoveredMenu === 'usage' && (
              <div
                className="ai-model-flyout-panel ai-usage-flyout"
                style={{
                  bottom: 0
                }}
                onMouseEnter={handleFlyoutMouseEnter}
                onMouseLeave={handleFlyoutMouseLeave}
              >
                <div className="ai-usage-title">Usage</div>

                <div className="ai-usage-body">
                  {USAGE_SECTIONS.map((sec) => {
                    const stats = usageStats[sec.id] || {}
                    const isConfigured = Boolean(stats.isConfigured)

                    const weeklySub = isConfigured
                      ? `Resets in ${stats.weeklyReset || 'Ready'}`
                      : 'Configure in Settings'

                    const weeklyVal = isConfigured
                      ? `${stats.weeklyLeft ?? 100}% left`
                      : 'No API key'

                    const fiveHourSub = isConfigured
                      ? `Resets in ${stats.fiveHourReset || 'Ready'}`
                      : sec.keyPrompt

                    const fiveHourVal = isConfigured
                      ? `${stats.fiveHourLeft ?? 100}% left`
                      : 'No API key'

                    return (
                      <div key={sec.id} className="ai-usage-section">
                        <div className="ai-usage-section-heading">{sec.title}</div>
                        <div className="ai-usage-metric-row">
                          <div className="ai-usage-metric-left">
                            <div className="ai-usage-metric-label">Weekly limit</div>
                            <div
                              className={`ai-usage-metric-sub ${!isConfigured ? 'clickable' : ''}`}
                              onClick={!isConfigured ? handleOpenSettings : undefined}
                              title={!isConfigured ? 'Open Settings to configure' : undefined}
                            >
                              {weeklySub}
                            </div>
                          </div>
                          <div className="ai-usage-metric-right">
                            <span className={`ai-usage-metric-value ${!isConfigured ? 'unconfigured' : ''}`}>
                              {weeklyVal}
                            </span>
                            <UsageCircleRing
                              percent={stats.weeklyLeft}
                              isConfigured={isConfigured}
                            />
                          </div>
                        </div>

                        <div className="ai-usage-metric-row">
                          <div className="ai-usage-metric-left">
                            <div className="ai-usage-metric-label">5h limit</div>
                            <div
                              className={`ai-usage-metric-sub ${!isConfigured ? 'clickable' : ''}`}
                              onClick={!isConfigured ? handleOpenSettings : undefined}
                              title={!isConfigured ? 'Open Settings to configure' : undefined}
                            >
                              {fiveHourSub}
                            </div>
                          </div>
                          <div className="ai-usage-metric-right">
                            <span className={`ai-usage-metric-value ${!isConfigured ? 'unconfigured' : ''}`}>
                              {fiveHourVal}
                            </span>
                            <UsageCircleRing
                              percent={stats.fiveHourLeft}
                              isConfigured={isConfigured}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="ai-usage-ledger-tag">
                  <span>
                    <span className="ai-usage-ledger-dot" />
                    Live API Usage Ledger
                  </span>
                  <span>
                    {['gemini', 'openai', 'anthropic', 'groq'].reduce(
                      (acc, k) => acc + (usageStats[k]?.requests5h || 0),
                      0
                    )}{' '}
                    calls in 5h
                  </span>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}

      {/* Floating Add Context Popover (Portal to document.body) */}
      {isAddContextOpen &&
        createPortal(
          <div
            ref={addContextPortalRef}
            className="ai-add-context-portal"
            style={{
              position: 'fixed',
              left: `${addContextPos.left}px`,
              bottom: `${addContextPos.bottom}px`,
              zIndex: 10000
            }}
          >
            <div className="ai-add-context-menu">
              <div className="ai-add-context-header">Add Context</div>
              <div className="ai-add-context-list">
                <button
                  type="button"
                  className="ai-add-context-item"
                  onClick={handleTriggerAttachFiles}
                >
                  <span className="material-symbols-outlined ai-add-context-icon">attach_file</span>
                  <span className="ai-add-context-label">Files</span>
                </button>

                <button
                  type="button"
                  className={`ai-add-context-item ${isFolderAttached ? 'active-item' : ''}`}
                  onClick={handleAttachFolderContext}
                >
                  <span className="material-symbols-outlined ai-add-context-icon">folder</span>
                  <span className="ai-add-context-label">Folder</span>
                  {isFolderAttached && <span className="ai-add-context-active-dot"></span>}
                </button>

                <button
                  type="button"
                  className="ai-add-context-item"
                  onClick={handleInsertMention}
                >
                  <span className="material-symbols-outlined ai-add-context-icon">alternate_email</span>
                  <span className="ai-add-context-label">Mentions</span>
                </button>

                <button
                  type="button"
                  className="ai-add-context-item"
                  onClick={handleTriggerActionsPalette}
                >
                  <span className="material-symbols-outlined ai-add-context-icon">open_in_new</span>
                  <span className="ai-add-context-label">Actions</span>
                </button>

                <button
                  type="button"
                  className={`ai-add-context-item ${isWebSearchActive ? 'active-item' : ''}`}
                  onClick={handleToggleWebSearch}
                >
                  <span className="material-symbols-outlined ai-add-context-icon">language</span>
                  <span className="ai-add-context-label">Browser</span>
                  {isWebSearchActive && <span className="ai-add-context-active-dot"></span>}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
