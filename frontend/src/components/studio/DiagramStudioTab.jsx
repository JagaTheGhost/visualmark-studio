import React, { useState, useMemo, useRef, useEffect } from 'react'
import { saveAs } from 'file-saver'
import MermaidRenderer from '../MermaidRenderer'
import { useStudioSplit } from '../../utils/useResizableSplit'

// 6 Curated High-Fidelity Diagram Color Themes
const DIAGRAM_THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Obsidian',
    dot: '#6366f1',
    bg: '#090d16',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#6366f1',
        lineColor: '#38bdf8',
        secondaryColor: '#0f172a',
        tertiaryColor: '#161b22',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      }
    }
  },
  {
    id: 'tokyonight',
    name: 'Tokyo Night',
    dot: '#06b6d4',
    bg: '#1a1b26',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#1a1b26',
        primaryColor: '#24283b',
        primaryTextColor: '#c0caf5',
        primaryBorderColor: '#06b6d4',
        lineColor: '#bb9af7',
        secondaryColor: '#1f2335',
        tertiaryColor: '#292e42',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      }
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    dot: '#ec4899',
    bg: '#080c14',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#080c14',
        primaryColor: '#180b33',
        primaryTextColor: '#fdf4ff',
        primaryBorderColor: '#ec4899',
        lineColor: '#06b6d4',
        secondaryColor: '#100826',
        tertiaryColor: '#1c133a',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px'
      }
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    dot: '#10b981',
    bg: '#06281e',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#06281e',
        primaryColor: '#064e3b',
        primaryTextColor: '#ecfdf5',
        primaryBorderColor: '#10b981',
        lineColor: '#34d399',
        secondaryColor: '#042f24',
        tertiaryColor: '#0c3d30',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      }
    }
  },
  {
    id: 'glacier',
    name: 'Nordic Glacier',
    dot: '#38bdf8',
    bg: '#082f49',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#082f49',
        primaryColor: '#0c4a6e',
        primaryTextColor: '#f0f9ff',
        primaryBorderColor: '#38bdf8',
        lineColor: '#7dd3fc',
        secondaryColor: '#032034',
        tertiaryColor: '#0b3954',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      }
    }
  },
  {
    id: 'primer',
    name: 'GitHub Primer Light',
    dot: '#0969da',
    bg: '#ffffff',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: false,
        background: '#ffffff',
        primaryColor: '#f6f8fa',
        primaryTextColor: '#1f2328',
        primaryBorderColor: '#0969da',
        lineColor: '#57606a',
        secondaryColor: '#eaeef2',
        tertiaryColor: '#d0d7de',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px'
      }
    }
  }
]

// Shape Definitions
const SHAPES = [
  { id: 'box', label: 'Box', icon: 'crop_square' },
  { id: 'pill', label: 'Pill', icon: 'stadium' },
  { id: 'cylinder', label: 'Database', icon: 'database' },
  { id: 'diamond', label: 'Decision', icon: 'change_history' },
  { id: 'hexagon', label: 'Hexagon', icon: 'hexagon' },
  { id: 'circle', label: 'Circle', icon: 'radio_button_unchecked' }
]

// Colors for Accent Highlighting
const ACCENT_COLORS = [
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Rose', color: '#ec4899' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'None', color: '' }
]

// Preset Full Templates
const PRESET_TEMPLATES = [
  {
    id: 'arch-microservices',
    title: 'Microservices & API Gateway',
    description: 'Client, Envoy Gateway, Auth/Core microservices, Redis cache, PostgreSQL DB, and Kafka.',
    code: `graph TD
  Client([Web & Mobile Client]) -->|HTTPS / WSS| APIGW[API Gateway :: Envoy]
  APIGW --> AuthSvc[Auth & Policy Svc]
  APIGW --> AppSvc[Core Application API]
  AppSvc --> Cache[(Redis Cache Cluster)]
  AppSvc --> DB[(PostgreSQL Primary)]
  AppSvc -->|Async Events| Broker{{Kafka Event Bus}}
  Broker --> Worker[Background Telemetry Worker]`
  },
  {
    id: 'arch-fullstack',
    title: 'Modern Full-Stack Web App',
    description: 'Cloudflare CDN, React Vite SPA, FastAPI REST endpoints, and database connection.',
    code: `graph LR
  User([End User Client]) --> CDN[Cloudflare CDN / Edge]
  CDN --> SPA[React / Vite Frontend]
  SPA -->|REST / JSON| API[FastAPI Backend Engine]
  API --> Auth[OAuth 2.0 / Auth Provider]
  API --> DB[(PostgreSQL Database)]
  API --> Cache[(Redis KV Cache)]`
  },
  {
    id: 'arch-serverless',
    title: 'Serverless Cloud Architecture',
    description: 'Route 53, CloudFront CDN, S3, API Gateway, AWS Lambda workers, and DynamoDB.',
    code: `graph TD
  DNS[Route 53 DNS] --> CF[CloudFront CDN]
  CF --> S3[(Static S3 Asset Bucket)]
  CF --> APIGW[Amazon API Gateway]
  APIGW --> LambdaAuth[Auth Authorizer Lambda]
  APIGW --> LambdaApp[Core API Lambda]
  LambdaApp --> Dynamo[(DynamoDB NoSQL)]
  LambdaApp --> SQS{{SQS Message Queue}}
  SQS --> LambdaWorker[Async Batch Worker]`
  },
  {
    id: 'cicd-github-actions',
    title: 'GitHub Actions Delivery Pipeline',
    description: 'Git Push/PR -> Lint & Security -> Pytest/Jest -> Docker Build -> Prod Deploy.',
    code: `graph LR
  Push[Git Push / PR Open] --> Lint[Linter & Static Analysis]
  Lint --> Test[Unit & Integration Tests]
  Test --> Scan[Security Vulnerability Scan]
  Scan --> Build[Multi-Stage Docker Build]
  Build --> Reg[Container Registry :: GHCR]
  Reg --> Deploy[Kubernetes Production Cluster]`
  }
]

// ======================== PARSER & COMPILER ========================

// Parse a raw Mermaid flowchart string into structured visual cards
function parseMermaidFlowchart(mermaidCode = '') {
  const lines = mermaidCode.split('\n')
  let direction = 'TD'
  const nodesMap = new Map()
  const edges = []

  for (let rawLine of lines) {
    let line = rawLine.trim()
    if (!line || line.startsWith('%%') || line.startsWith('style ') || line.startsWith('subgraph') || line === 'end') continue

    // Direction check
    const dirMatch = line.match(/^(?:graph|flowchart)\s+(TD|TB|LR|RL|BT)/i)
    if (dirMatch) {
      direction = dirMatch[1].toUpperCase()
      if (direction === 'TB') direction = 'TD'
      continue
    }

    // Helper to extract node token
    const parseToken = (token = '') => {
      token = token.trim()
      let m = token.match(/^([a-zA-Z0-9_]+)\s*\(\[\s*["']?(.*?)["']?\s*\]\)$/)
      if (m) return { id: m[1], name: m[2], shape: 'pill' }
      m = token.match(/^([a-zA-Z0-9_]+)\s*\[\(\s*["']?(.*?)["']?\s*\)\]$/)
      if (m) return { id: m[1], name: m[2], shape: 'cylinder' }
      m = token.match(/^([a-zA-Z0-9_]+)\s*\(\(\s*["']?(.*?)["']?\s*\)\)$/)
      if (m) return { id: m[1], name: m[2], shape: 'circle' }
      m = token.match(/^([a-zA-Z0-9_]+)\s*\{\{\s*["']?(.*?)["']?\s*\}\}$/)
      if (m) return { id: m[1], name: m[2], shape: 'hexagon' }
      m = token.match(/^([a-zA-Z0-9_]+)\s*\{\s*["']?(.*?)["']?\s*\}$/)
      if (m) return { id: m[1], name: m[2], shape: 'diamond' }
      m = token.match(/^([a-zA-Z0-9_]+)\s*\[\s*["']?(.*?)["']?\s*\]$/)
      if (m) return { id: m[1], name: m[2], shape: 'box' }
      m = token.match(/^([a-zA-Z0-9_]+)$/)
      if (m) return { id: m[1], name: m[1], shape: 'box' }
      return null
    }

    // Edge check: LeftNode Connector RightNode
    const edgeMatch = line.match(/^(.+?)\s*(-->|-.->|==>|<-->|--\s*.*?\s*-->|-\.\s*.*?\s*\.->|==\s*.*?\s*==>)\s*(?:\|(.*?)\|)?\s*(.+)$/)
    if (edgeMatch) {
      const leftPart = edgeMatch[1]
      const rawConnector = edgeMatch[2]
      const inlineLabel = edgeMatch[3]
      const rightPart = edgeMatch[4]

      const leftNode = parseToken(leftPart)
      const rightNode = parseToken(rightPart)

      if (leftNode && !nodesMap.has(leftNode.id)) {
        nodesMap.set(leftNode.id, leftNode)
      }
      if (rightNode && !nodesMap.has(rightNode.id)) {
        nodesMap.set(rightNode.id, rightNode)
      }

      let edgeType = 'arrow'
      if (rawConnector.includes('-.')) edgeType = 'dotted'
      else if (rawConnector.includes('==')) edgeType = 'thick'
      else if (rawConnector.includes('<-->')) edgeType = 'twoway'

      let edgeLabel = inlineLabel || ''
      if (!edgeLabel) {
        const insideMatch = rawConnector.match(/(?:--|-\.|==)\s*(.*?)\s*(?:-->|\.->|==>)/)
        if (insideMatch && insideMatch[1]) edgeLabel = insideMatch[1]
      }

      const fromId = leftNode ? leftNode.id : leftPart.trim()
      const toId = rightNode ? rightNode.id : rightPart.trim()

      edges.push({
        id: `e_${edges.length + 1}`,
        from: fromId,
        to: toId,
        type: edgeType,
        label: (edgeLabel || '').trim()
      })
      continue
    }

    // Standalone node
    const singleNode = parseToken(line)
    if (singleNode && !nodesMap.has(singleNode.id)) {
      nodesMap.set(singleNode.id, singleNode)
    }
  }

  // Parse color styles
  for (let rawLine of lines) {
    const styleMatch = rawLine.match(/^style\s+([a-zA-Z0-9_]+)\s+fill:([#a-zA-Z0-9]+)/i)
    if (styleMatch) {
      const n = nodesMap.get(styleMatch[1])
      if (n) {
        n.color = styleMatch[2].slice(0, 7)
      }
    }
  }

  return {
    direction,
    nodes: Array.from(nodesMap.values()),
    edges
  }
}

// Compile visual cards and connections into valid, production-ready Mermaid syntax
function compileToMermaidCode({ direction = 'TD', nodes = [], edges = [] }) {
  // Map internal unique IDs to safe, sanitized Mermaid identifiers
  const idMap = new Map()
  nodes.forEach((n, idx) => {
    const cleanSym = (n.name || 'comp').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)
    idMap.set(n.id, `N${idx + 1}_${cleanSym}`)
  })

  const formatNodeShape = (n) => {
    const symbol = idMap.get(n.id) || `node_${n.id}`
    const label = (n.name || 'Component').replace(/"/g, "'")
    switch (n.shape) {
      case 'pill':
        return `${symbol}(["${label}"])`
      case 'cylinder':
        return `${symbol}[("${label}")]`
      case 'diamond':
        return `${symbol}{"${label}"}`
      case 'hexagon':
        return `${symbol}{{"${label}"}}`
      case 'circle':
        return `${symbol}(("${label}"))`
      case 'box':
      default:
        return `${symbol}["${label}"]`
    }
  }

  let lines = [`graph ${direction}`]

  // Render nodes
  nodes.forEach((n) => {
    lines.push(`  ${formatNodeShape(n)}`)
  })

  lines.push('')

  // Render edges
  edges.forEach((e) => {
    const fromSymbol = idMap.get(e.from)
    const toSymbol = idMap.get(e.to)
    if (!fromSymbol || !toSymbol) return

    const label = (e.label || '').trim().replace(/"/g, "'")
    let connector = '-->'

    if (e.type === 'dotted') {
      connector = label ? `-. "${label}" .->` : '-.->'
    } else if (e.type === 'thick') {
      connector = label ? `== "${label}" ==>` : '==>'
    } else if (e.type === 'twoway') {
      connector = label ? `<-->|"${label}"|` : '<-->'
    } else {
      connector = label ? `-->|"${label}"|` : '-->'
    }

    lines.push(`  ${fromSymbol} ${connector} ${toSymbol}`)
  })

  // Render styles
  const styledNodes = nodes.filter((n) => n.color)
  if (styledNodes.length > 0) {
    lines.push('')
    styledNodes.forEach((n) => {
      const symbol = idMap.get(n.id)
      if (symbol) {
        lines.push(`  style ${symbol} fill:${n.color}25,stroke:${n.color},stroke-width:2px,color:#ffffff`)
      }
    })
  }

  return lines.join('\n')
}

// Inject Mermaid %%{init: ...}%% theme directive
function applyThemeDirective(rawCode, themeKey) {
  const themeObj = DIAGRAM_THEMES.find((t) => t.id === themeKey) || DIAGRAM_THEMES[0]
  const cleanedCode = (rawCode || '').replace(/^%%\{init:.*?\}%%\n?/s, '').trim()
  const directive = `%%{init: ${JSON.stringify(themeObj.config)}}%%\n`
  return `${directive}${cleanedCode}`
}

export default function DiagramStudioTab({
  onInsertDiagram,
  onBackToReadme
}) {
  // Workflow Mode: 'visual' (Card-Based Visual Builder) | 'code' (Mermaid Textarea)
  const [studioMode, setStudioMode] = useState('visual')

  // Theme & Direction
  const [themeKey, setThemeKey] = useState('midnight')
  const [direction, setDirection] = useState('TD')

  // Active Flowchart Data Model
  const initialData = useMemo(() => parseMermaidFlowchart(PRESET_TEMPLATES[0].code), [])
  const [nodes, setNodes] = useState(initialData.nodes)
  const [edges, setEdges] = useState(initialData.edges)

  // Raw Code State
  const [code, setCode] = useState(PRESET_TEMPLATES[0].code)

  // Zoom & Canvas Ref
  const [zoomLevel, setZoomLevel] = useState(100)
  const [copied, setCopied] = useState(false)
  const viewportRef = useRef(null)
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(520)

  // Update visual state and auto-compile to code
  const syncVisualState = (newNodes, newEdges, newDir = direction) => {
    setNodes(newNodes)
    setEdges(newEdges)
    setDirection(newDir)
    const compiled = compileToMermaidCode({
      direction: newDir,
      nodes: newNodes,
      edges: newEdges
    })
    setCode(compiled)
  }

  // Chart source with theme injected for live rendering
  const activeThemedChart = useMemo(() => {
    return applyThemeDirective(code, themeKey)
  }, [code, themeKey])

  // Markdown code block for GitHub README
  const markdownBlock = `\`\`\`mermaid\n${activeThemedChart.trim()}\n\`\`\``

  // ======================== COMPONENT MANAGEMENT ========================

  // Add a new component
  const handleAddNewComponent = (presetType = 'generic') => {
    let defaultName = 'New Service API'
    let defaultShape = 'box'
    let defaultColor = '#6366f1'

    if (presetType === 'client') {
      defaultName = 'Client App (SPA / Mobile)'
      defaultShape = 'pill'
      defaultColor = '#06b6d4'
    } else if (presetType === 'api') {
      defaultName = 'REST Backend Service'
      defaultShape = 'box'
      defaultColor = '#3b82f6'
    } else if (presetType === 'database') {
      defaultName = 'PostgreSQL Database'
      defaultShape = 'cylinder'
      defaultColor = '#3178c6'
    } else if (presetType === 'cache') {
      defaultName = 'Redis KV Cache'
      defaultShape = 'cylinder'
      defaultColor = '#ef4444'
    } else if (presetType === 'queue') {
      defaultName = 'Kafka Event Bus'
      defaultShape = 'hexagon'
      defaultColor = '#ec4899'
    }

    const newNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: defaultName,
      shape: defaultShape,
      color: defaultColor
    }

    const newNodes = [...nodes, newNode]
    syncVisualState(newNodes, edges)
  }

  // Rename a component
  const handleRenameComponent = (nodeId, newName) => {
    const updated = nodes.map((n) => (n.id === nodeId ? { ...n, name: newName } : n))
    syncVisualState(updated, edges)
  }

  // Change a component's shape
  const handleChangeShape = (nodeId, newShape) => {
    const updated = nodes.map((n) => (n.id === nodeId ? { ...n, shape: newShape } : n))
    syncVisualState(updated, edges)
  }

  // Change a component's accent color
  const handleChangeColor = (nodeId, newColor) => {
    const updated = nodes.map((n) => (n.id === nodeId ? { ...n, color: newColor } : n))
    syncVisualState(updated, edges)
  }

  // Delete a component (and remove all its connections)
  const handleDeleteComponent = (nodeId) => {
    const updatedNodes = nodes.filter((n) => n.id !== nodeId)
    const updatedEdges = edges.filter((e) => e.from !== nodeId && e.to !== nodeId)
    syncVisualState(updatedNodes, updatedEdges)
  }

  // ======================== CONNECTION (WIRE) MANAGEMENT ========================

  // Add a connection originating from a component
  const handleAddConnection = (fromNodeId) => {
    // Pick the first other node as default target
    const targetNode = nodes.find((n) => n.id !== fromNodeId)
    if (!targetNode) return

    const newEdge = {
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      from: fromNodeId,
      to: targetNode.id,
      label: 'REST / HTTPS',
      type: 'arrow'
    }

    const updatedEdges = [...edges, newEdge]
    syncVisualState(nodes, updatedEdges)
  }

  // Change the target component of a connection
  const handleChangeConnectionTarget = (edgeId, newToId) => {
    const updated = edges.map((e) => (e.id === edgeId ? { ...e, to: newToId } : e))
    syncVisualState(nodes, updated)
  }

  // Change the label (protocol / payload) of a connection
  const handleChangeConnectionLabel = (edgeId, newLabel) => {
    const updated = edges.map((e) => (e.id === edgeId ? { ...e, label: newLabel } : e))
    syncVisualState(nodes, updated)
  }

  // Change arrow connector type (solid, dotted, thick)
  const handleChangeConnectionType = (edgeId, newType) => {
    const updated = edges.map((e) => (e.id === edgeId ? { ...e, type: newType } : e))
    syncVisualState(nodes, updated)
  }

  // Remove a connection
  const handleRemoveConnection = (edgeId) => {
    const updated = edges.filter((e) => e.id !== edgeId)
    syncVisualState(nodes, updated)
  }

  // Apply a template preset
  const handleApplyPreset = (preset) => {
    setCode(preset.code)
    const parsed = parseMermaidFlowchart(preset.code)
    if (parsed.nodes.length > 0) {
      setDirection(parsed.direction)
      setNodes(parsed.nodes)
      setEdges(parsed.edges)
    }
  }

  // Toggle layout direction (TD ↔ LR)
  const handleToggleDirection = (newDir) => {
    syncVisualState(nodes, edges, newDir)
  }

  // ======================== EXPORT & DOWNLOAD ACTIONS ========================

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownBlock)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    if (!code.trim()) return
    onInsertDiagram(markdownBlock)
  }

  // Export high-resolution vector SVG
  const handleExportSvg = async () => {
    if (!viewportRef.current) return
    const svgEl = viewportRef.current.querySelector('svg')
    if (!svgEl) return

    try {
      const svgXml = new XMLSerializer().serializeToString(svgEl)
      if (typeof window !== 'undefined' && window.electronAPI?.saveTextExportDialog) {
        await window.electronAPI.saveTextExportDialog({
          defaultPath: 'architecture-diagram.svg',
          filters: [{ name: 'SVG Vector Image', extensions: ['svg'] }, { name: 'All Files', extensions: ['*'] }],
          content: svgXml
        })
        return
      }
      const blob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' })
      saveAs(blob, 'architecture-diagram.svg')
    } catch (err) {
      console.error('Failed to export SVG:', err)
    }
  }

  // Export high-resolution rasterized PNG (2x Retina)
  const handleExportPng = () => {
    if (!viewportRef.current) return
    const svgEl = viewportRef.current.querySelector('svg')
    if (!svgEl) return

    try {
      const svgXml = new XMLSerializer().serializeToString(svgEl)
      const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' })
      const URL = window.URL || window.webkitURL || window
      const blobURL = URL.createObjectURL(svgBlob)
      const img = new Image()

      img.onload = () => {
        const scale = 2
        const bbox = svgEl.getBoundingClientRect()
        const width = Math.max(bbox.width || 800, 400)
        const height = Math.max(bbox.height || 600, 300)

        const canvas = document.createElement('canvas')
        canvas.width = width * scale
        canvas.height = height * scale
        const ctx = canvas.getContext('2d')

        const currentTheme = DIAGRAM_THEMES.find((t) => t.id === themeKey)
        ctx.fillStyle = currentTheme ? currentTheme.bg : '#090d16'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        if (typeof window !== 'undefined' && window.electronAPI?.saveBinaryDialog) {
          const base64Data = canvas.toDataURL('image/png').split(',')[1]
          window.electronAPI.saveBinaryDialog({
            defaultPath: 'architecture-diagram.png',
            filters: [{ name: 'PNG Image', extensions: ['png'] }, { name: 'All Files', extensions: ['*'] }],
            base64Data
          })
          URL.revokeObjectURL(blobURL)
        } else {
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, 'architecture-diagram.png')
            }
            URL.revokeObjectURL(blobURL)
          }, 'image/png')
        }
      }

      img.onerror = (err) => {
        console.error('Error rasterizing SVG to PNG:', err)
        URL.revokeObjectURL(blobURL)
      }

      img.src = blobURL
    } catch (err) {
      console.error('Failed to export PNG:', err)
    }
  }

  return (
    <div className="studio-tab-view select-none">
      {/* Studio Top Bar */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div className="studio-badge-halo">
            <span className="material-symbols-outlined text-primary" style={{ color: '#818cf8' }}>schema</span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Mermaid.js Architecture Studio</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>Interactive Flow Designer</span>
            </div>
            <p className="studio-subtitle">
              Visual card-based architecture builder with live connections and one-click SVG/PNG export.
            </p>
          </div>
        </div>

        {/* Studio Top Export Bar */}
        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onBackToReadme}
              title="Return to active markdown document"
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>Back to Editor</span>
            </button>
          )}

          <button
            type="button"
            className="diagram-export-btn"
            onClick={handleExportSvg}
            title="Download vector SVG to commit into assets/"
          >
            <span className="material-symbols-outlined icon-xs" style={{ color: '#10b981' }}>download</span>
            <span>Export .SVG</span>
          </button>

          <button
            type="button"
            className="diagram-export-btn"
            onClick={handleExportPng}
            title="Download high-resolution 2x PNG"
          >
            <span className="material-symbols-outlined icon-xs" style={{ color: '#38bdf8' }}>image</span>
            <span>Export .PNG</span>
          </button>

          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopyMarkdown}
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            className="btn-studio-primary"
            onClick={handleInsert}
            title="Insert diagram into an open document"
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>Insert into Document</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 2-Column Responsive Layout */}
      <div className="studio-content-grid">
        {/* Left Column: Visual Cards Editor or Raw Code */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, minWidth: `${formWidth}px`, maxWidth: `${formWidth}px`, flex: 'none' }}
        >
          {/* Dual-Mode Workflow Switcher */}
          <div className="diagram-workflow-selector">
            <button
              type="button"
              className={`diagram-workflow-btn ${studioMode === 'visual' ? 'active' : ''}`}
              onClick={() => {
                const parsed = parseMermaidFlowchart(code)
                if (parsed.nodes.length > 0) {
                  setNodes(parsed.nodes)
                  setEdges(parsed.edges)
                  setDirection(parsed.direction)
                }
                setStudioMode('visual')
              }}
            >
              <span className="material-symbols-outlined icon-xs">view_agenda</span>
              <span>Visual Component Flow</span>
            </button>
            <button
              type="button"
              className={`diagram-workflow-btn ${studioMode === 'code' ? 'active' : ''}`}
              onClick={() => setStudioMode('code')}
            >
              <span className="material-symbols-outlined icon-xs">code</span>
              <span>Mermaid Code Editor</span>
            </button>
          </div>

          {studioMode === 'visual' ? (
            /* =========================================================================
                WORKFLOW 1: INTUITIVE CARD-BASED VISUAL BUILDER
               ========================================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Quick Toolbar: Add Component & Direction */}
              <div className="diagram-toolbar-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-add-component"
                    onClick={() => handleAddNewComponent('generic')}
                  >
                    <span className="material-symbols-outlined icon-xs">add</span>
                    <span>New Component</span>
                  </button>

                  <div className="diagram-quick-chips">
                    <button
                      type="button"
                      className="diagram-quick-chip"
                      onClick={() => handleAddNewComponent('client')}
                    >
                      <span>+ Client</span>
                    </button>
                    <button
                      type="button"
                      className="diagram-quick-chip"
                      onClick={() => handleAddNewComponent('api')}
                    >
                      <span>+ API Svc</span>
                    </button>
                    <button
                      type="button"
                      className="diagram-quick-chip"
                      onClick={() => handleAddNewComponent('database')}
                    >
                      <span>+ DB</span>
                    </button>
                    <button
                      type="button"
                      className="diagram-quick-chip"
                      onClick={() => handleAddNewComponent('cache')}
                    >
                      <span>+ Cache</span>
                    </button>
                    <button
                      type="button"
                      className="diagram-quick-chip"
                      onClick={() => handleAddNewComponent('queue')}
                    >
                      <span>+ Queue</span>
                    </button>
                  </div>
                </div>

                {/* Direction Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    className={`studio-style-btn ${direction === 'TD' ? 'active' : ''}`}
                    onClick={() => handleToggleDirection('TD')}
                    style={{ padding: '4px 8px', fontSize: '10.5px' }}
                  >
                    ⬇️ Top-Down
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${direction === 'LR' ? 'active' : ''}`}
                    onClick={() => handleToggleDirection('LR')}
                    style={{ padding: '4px 8px', fontSize: '10.5px' }}
                  >
                    ➡️ Left-Right
                  </button>
                </div>
              </div>

              {/* Template Architecture Loader */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 2px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  Load Architecture Preset:
                </span>
                <select
                  className="studio-text-input"
                  style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                  onChange={(e) => {
                    const preset = PRESET_TEMPLATES.find((p) => p.id === e.target.value)
                    if (preset) handleApplyPreset(preset)
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Choose a pre-built architecture...</option>
                  {PRESET_TEMPLATES.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* Components Flow List */}
              <div className="diagram-components-list">
                {nodes.map((node, index) => {
                  // Find all connections that originate FROM this component
                  const outgoingEdges = edges.filter((e) => e.from === node.id)

                  return (
                    <div key={node.id} className="diagram-component-card">
                      {/* Top Bar: Number, Name Input, Delete */}
                      <div className="diagram-card-top-row">
                        <span className="diagram-card-index-badge">{index + 1}</span>
                        <input
                          type="text"
                          className="diagram-card-name-input"
                          value={node.name}
                          onChange={(e) => handleRenameComponent(node.id, e.target.value)}
                          placeholder="Component Name (e.g. API Gateway, Database)"
                        />
                        <button
                          type="button"
                          className="diagram-card-del-btn"
                          onClick={() => handleDeleteComponent(node.id)}
                          title="Delete this component and all its connections"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                        </button>
                      </div>

                      {/* Meta Row: Shape Selector & Accent Color */}
                      <div className="diagram-card-meta-row">
                        <div className="diagram-shape-chips">
                          {SHAPES.map((sh) => (
                            <button
                              key={sh.id}
                              type="button"
                              className={`diagram-shape-chip-btn ${node.shape === sh.id ? 'active' : ''}`}
                              onClick={() => handleChangeShape(node.id, sh.id)}
                              title={sh.label}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{sh.icon}</span>
                              <span>{sh.label}</span>
                            </button>
                          ))}
                        </div>

                        <div className="diagram-color-swatches-mini">
                          {ACCENT_COLORS.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              className={`diagram-color-dot-btn ${node.color === c.color ? 'active' : ''}`}
                              style={{ backgroundColor: c.color || '#334155' }}
                              onClick={() => handleChangeColor(node.id, c.color)}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Outgoing Connections */}
                      <div className="diagram-connections-box">
                        <div className="diagram-conn-header">
                          <span>Calls / Connects To ({outgoingEdges.length})</span>
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Target & Protocol</span>
                        </div>

                        {outgoingEdges.map((edge) => (
                          <div key={edge.id} className="diagram-conn-row">
                            <span className="diagram-conn-arrow-indicator">➔</span>

                            {/* Target Dropdown */}
                            <select
                              className="diagram-conn-target-select"
                              value={edge.to}
                              onChange={(e) => handleChangeConnectionTarget(edge.id, e.target.value)}
                              title="Select which component this sends requests or data to"
                            >
                              {nodes.map((targetCandidate) => (
                                <option key={targetCandidate.id} value={targetCandidate.id}>
                                  {targetCandidate.name} {targetCandidate.id === node.id ? '(Self)' : ''}
                                </option>
                              ))}
                            </select>

                            {/* Label Input */}
                            <input
                              type="text"
                              className="diagram-conn-label-input"
                              value={edge.label}
                              onChange={(e) => handleChangeConnectionLabel(edge.id, e.target.value)}
                              placeholder="Protocol (e.g. HTTPS, REST, SQL, Async)"
                              title="Connection message / protocol label"
                            />

                            {/* Wire Type */}
                            <select
                              className="diagram-conn-type-select"
                              value={edge.type}
                              onChange={(e) => handleChangeConnectionType(edge.id, e.target.value)}
                              title="Arrow style"
                            >
                              <option value="arrow">Solid ──&gt;</option>
                              <option value="dotted">Dotted ┄&gt;</option>
                              <option value="thick">Thick ━━&gt;</option>
                              <option value="twoway">&lt;──&gt;</option>
                            </select>

                            {/* Remove Wire */}
                            <button
                              type="button"
                              className="diagram-conn-del-btn"
                              onClick={() => handleRemoveConnection(edge.id)}
                              title="Remove this connection"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                            </button>
                          </div>
                        ))}

                        {/* Add Connection Button */}
                        <div>
                          <button
                            type="button"
                            className="diagram-add-conn-btn"
                            onClick={() => handleAddConnection(node.id)}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add</span>
                            <span>Connect to another component</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {nodes.length === 0 && (
                  <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'var(--surface-mid)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
                    No components in diagram. Click <strong>"New Component"</strong> above to start!
                  </div>
                )}
              </div>

              {/* Visual Theme Selector */}
              <div className="studio-section" style={{ marginTop: '6px' }}>
                <label className="studio-section-label">Canvas Color Theme</label>
                <div className="diagram-themes-grid">
                  {DIAGRAM_THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      className={`diagram-theme-pill ${themeKey === th.id ? 'active' : ''}`}
                      onClick={() => setThemeKey(th.id)}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: th.dot }} />
                      <span>{th.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
                WORKFLOW 2: RAW MERMAID CODE EDITOR
               ========================================================================= */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="studio-section editor-section">
                <div className="code-editor-header">
                  <div className="file-indicator">
                    <span className="material-symbols-outlined icon-xs text-secondary">code</span>
                    <span className="file-name">architecture.mmd</span>
                  </div>
                  <div className="code-stats">
                    <span>{code.split('\n').length} lines</span>
                  </div>
                </div>
                <textarea
                  className="diagram-code-textarea custom-scrollbar"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter Mermaid.js diagram source code..."
                  rows={18}
                  spellCheck={false}
                />
              </div>

              {/* Presets List in Code Mode */}
              <div className="studio-section">
                <label className="studio-section-label">Quick Architecture Presets</label>
                <div className="diagram-preset-list">
                  {PRESET_TEMPLATES.map((p) => (
                    <div
                      key={p.id}
                      className="diagram-preset-card"
                      onClick={() => handleApplyPreset(p)}
                    >
                      <div className="preset-card-top">
                        <span className="preset-card-title">{p.title}</span>
                      </div>
                      <p className="preset-card-desc">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Column: Live SVG Render Canvas & Markdown Readout */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* Live SVG Canvas Card */}
          <div className="diagram-canvas-card">
            <div className="canvas-header-bar">
              <div className="canvas-status-tag">
                <span className="live-dot"></span>
                <span>Live Compiled SVG Canvas ({direction})</span>
              </div>
              <div className="canvas-controls-group">
                <button
                  type="button"
                  className="canvas-hud-btn"
                  onClick={() => handleToggleDirection(direction === 'TD' ? 'LR' : 'TD')}
                  title="Toggle Flow Direction (TD ↔ LR)"
                >
                  <span className="material-symbols-outlined icon-xs">rotate_right</span>
                  <span>{direction}</span>
                </button>
                <button
                  type="button"
                  className="canvas-hud-btn"
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined icon-xs">remove</span>
                </button>
                <span className="zoom-readout">{zoomLevel}%</span>
                <button
                  type="button"
                  className="canvas-hud-btn"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined icon-xs">add</span>
                </button>
                <button
                  type="button"
                  className="canvas-hud-btn"
                  onClick={() => setZoomLevel(100)}
                  title="Reset Zoom"
                >
                  <span className="material-symbols-outlined icon-xs">restart_alt</span>
                </button>
              </div>
            </div>

            <div
              className="diagram-svg-viewport custom-scrollbar"
              ref={viewportRef}
              style={{
                backgroundColor: DIAGRAM_THEMES.find((t) => t.id === themeKey)?.bg || '#090d16',
                minHeight: '380px'
              }}
            >
              <div
                className="diagram-scale-container"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center'
                }}
              >
                <MermaidRenderer chart={activeThemedChart} />
              </div>
            </div>
          </div>

          {/* Generated Markdown Syntax Card */}
          <div className="diagram-snippet-card">
            <div className="snippet-header">
              <span className="snippet-title">Generated Markdown Code Block</span>
              <button
                type="button"
                className="snippet-copy-btn"
                onClick={handleCopyMarkdown}
              >
                <span className="material-symbols-outlined icon-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="snippet-pre custom-scrollbar">
              <code>{markdownBlock}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
