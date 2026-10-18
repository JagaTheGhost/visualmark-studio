import React, { useState, useMemo, useEffect } from 'react'
import StudioShell from './common/StudioShell'
import '../../styles/studios/extendedStudios.css'

const PRESET_TREES = {
  'fullstack': {
    name: 'Full-Stack Web App',
    badge: 'React + FastAPI',
    icon: 'web',
    tree: [
      { path: 'backend', type: 'dir', comment: 'FastAPI REST API server' },
      { path: 'backend/app.py', type: 'file', comment: 'Application entry point & routers' },
      { path: 'backend/requirements.txt', type: 'file', comment: 'Python backend dependencies' },
      { path: 'frontend', type: 'dir', comment: 'React + Vite UI client' },
      { path: 'frontend/src', type: 'dir', comment: 'Application components & styles' },
      { path: 'frontend/src/App.jsx', type: 'file', comment: 'Root application container' },
      { path: 'frontend/package.json', type: 'file', comment: 'Node dependencies & scripts' },
      { path: 'docker-compose.yml', type: 'file', comment: 'Local multi-container orchestrator' },
      { path: 'README.md', type: 'file', comment: 'Project documentation suite' },
      { path: 'LICENSE', type: 'file', comment: 'MIT Open-source license' }
    ]
  },
  'python-cli': {
    name: 'Python CLI / Utility',
    badge: 'Python 3.12',
    icon: 'terminal',
    tree: [
      { path: 'src', type: 'dir', comment: 'Core package source code' },
      { path: 'src/__init__.py', type: 'file', comment: 'Package exports' },
      { path: 'src/cli.py', type: 'file', comment: 'CLI command parser & flags' },
      { path: 'src/utils.py', type: 'file', comment: 'Helper utilities' },
      { path: 'tests', type: 'dir', comment: 'Automated test suite (pytest)' },
      { path: 'tests/test_cli.py', type: 'file', comment: 'CLI unit tests' },
      { path: 'pyproject.toml', type: 'file', comment: 'Project build configuration' },
      { path: 'README.md', type: 'file', comment: 'User manual & usage examples' }
    ]
  },
  'react-lib': {
    name: 'React UI Library',
    badge: 'TypeScript + Storybook',
    icon: 'widgets',
    tree: [
      { path: 'src', type: 'dir', comment: 'Design system components' },
      { path: 'src/components', type: 'dir', comment: 'Atomic UI elements' },
      { path: 'src/components/Button.tsx', type: 'file', comment: 'Button variant component' },
      { path: 'src/components/Modal.tsx', type: 'file', comment: 'Accessible modal dialog' },
      { path: 'src/index.ts', type: 'file', comment: 'Public component barrel export' },
      { path: 'stories', type: 'dir', comment: 'Storybook documentation' },
      { path: 'package.json', type: 'file', comment: 'NPM package manifest' },
      { path: 'tsconfig.json', type: 'file', comment: 'TypeScript configuration' },
      { path: 'README.md', type: 'file', comment: 'Component showcases & API docs' }
    ]
  },
  'monorepo': {
    name: 'Monorepo Workspace',
    badge: 'Turbo / Nx',
    icon: 'workspaces',
    tree: [
      { path: 'apps', type: 'dir', comment: 'Deployable client & service apps' },
      { path: 'apps/web', type: 'dir', comment: 'Next.js customer portal' },
      { path: 'apps/docs', type: 'dir', comment: 'Docusaurus documentation site' },
      { path: 'packages', type: 'dir', comment: 'Shared internal libraries' },
      { path: 'packages/ui', type: 'dir', comment: 'Shared Tailwind component library' },
      { path: 'packages/config', type: 'dir', comment: 'ESLint & TS config blueprints' },
      { path: 'turbo.json', type: 'file', comment: 'Turborepo pipeline orchestration' },
      { path: 'package.json', type: 'file', comment: 'Root monorepo workspace dependencies' }
    ]
  },
  'electron-desktop': {
    name: 'Native Desktop App',
    badge: 'Electron + Vite',
    icon: 'desktop_windows',
    tree: [
      { path: 'electron', type: 'dir', comment: 'Main process & IPC handlers' },
      { path: 'electron/main.cjs', type: 'file', comment: 'Native window lifecycle' },
      { path: 'electron/preload.cjs', type: 'file', comment: 'Context isolation bridge' },
      { path: 'frontend', type: 'dir', comment: 'Renderer process (React UI)' },
      { path: 'frontend/src', type: 'dir', comment: 'IDE tabs & studio workspaces' },
      { path: 'frontend/vite.config.js', type: 'file', comment: 'Vite build bundling' },
      { path: 'package.json', type: 'file', comment: 'Scripts & cross-platform packaging' },
      { path: 'README.md', type: 'file', comment: 'Desktop installation guide' }
    ]
  },
  'microservices-go': {
    name: 'Go Microservices & Docker',
    badge: 'Go 1.23 + gRPC',
    icon: 'dns',
    tree: [
      { path: 'cmd', type: 'dir', comment: 'Service binary entrypoints' },
      { path: 'cmd/server/main.go', type: 'file', comment: 'gRPC server startup' },
      { path: 'internal', type: 'dir', comment: 'Private business logic' },
      { path: 'internal/auth', type: 'dir', comment: 'Authentication handlers' },
      { path: 'internal/db', type: 'dir', comment: 'Database connection & migrations' },
      { path: 'proto', type: 'dir', comment: 'Protobuf interface definitions' },
      { path: 'Dockerfile', type: 'file', comment: 'Multi-stage scratch container' },
      { path: 'go.mod', type: 'file', comment: 'Go dependency modules' }
    ]
  },
  'mobile-app': {
    name: 'Cross-Platform Mobile App',
    badge: 'React Native / Expo',
    icon: 'smartphone',
    tree: [
      { path: 'app', type: 'dir', comment: 'Expo file-based router pages' },
      { path: 'app/(tabs)', type: 'dir', comment: 'Bottom tab navigation screens' },
      { path: 'app/_layout.tsx', type: 'file', comment: 'Root navigation provider' },
      { path: 'components', type: 'dir', comment: 'Native mobile UI components' },
      { path: 'hooks', type: 'dir', comment: 'Custom device sensors & state hooks' },
      { path: 'app.json', type: 'file', comment: 'Expo build & splash configuration' },
      { path: 'package.json', type: 'file', comment: 'React Native dependencies' }
    ]
  },
  'ai-agent-rag': {
    name: 'AI Agent & RAG Pipeline',
    badge: 'Python + LangChain',
    icon: 'smart_toy',
    tree: [
      { path: 'agent', type: 'dir', comment: 'Autonomous LLM agent runtime' },
      { path: 'agent/tools', type: 'dir', comment: 'External tool execution plugins' },
      { path: 'agent/prompts', type: 'dir', comment: 'System instruction templates' },
      { path: 'rag', type: 'dir', comment: 'Retrieval augmented generation' },
      { path: 'rag/embedder.py', type: 'file', comment: 'Vector embeddings pipeline' },
      { path: 'rag/vector_store.py', type: 'file', comment: 'ChromaDB / Qdrant interface' },
      { path: 'evals', type: 'dir', comment: 'Automated hallucination benchmarks' },
      { path: 'requirements.txt', type: 'file', comment: 'LangChain & PyTorch dependencies' }
    ]
  }
}

const TREE_MODES = [
  { id: 'preset', label: 'Architecture Presets', icon: 'bolt' },
  { id: 'workspace', label: 'Workspace Files', icon: 'folder_open' },
  { id: 'custom', label: 'Custom Tree Builder', icon: 'edit' }
]

/**
 * Interactive Directory Tree Studio Pro
 * Assemble clean, annotated project architecture trees in Unicode, ASCII, or Emoji format.
 */
export default function DirectoryTreeStudioTab({
  workspaceDirectory = null,
  allFiles = {},
  onInsertTree = () => { },
  onBackToReadme = () => { }
}) {
  const [activeSource, setActiveSource] = useState('preset') // 'preset' | 'workspace' | 'custom'
  const [selectedPreset, setSelectedPreset] = useState('fullstack')
  const [treeStyle, setTreeStyle] = useState('unicode') // 'unicode' | 'ascii' | 'emoji' | 'indent'
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [maxDepth, setMaxDepth] = useState(3)
  const [hideBuildFolders, setHideBuildFolders] = useState(true)
  const [rootLabel, setRootLabel] = useState('my-project')

  // Custom user items list
  const [customItems, setCustomItems] = useState([
    { path: 'src', type: 'dir', comment: 'Source files' },
    { path: 'src/index.js', type: 'file', comment: 'Main entry point' },
    { path: 'src/components', type: 'dir', comment: 'UI widgets' },
    { path: 'public', type: 'dir', comment: 'Static assets' },
    { path: 'package.json', type: 'file', comment: 'Project metadata' },
    { path: 'README.md', type: 'file', comment: 'Documentation' }
  ])

  const [newItemPath, setNewItemPath] = useState('')
  const [newItemComment, setNewItemComment] = useState('')
  const [newItemType, setNewItemType] = useState('file')

  // Derive root label from workspace if present
  useEffect(() => {
    if (workspaceDirectory?.name) {
      setRootLabel(workspaceDirectory.name)
    }
  }, [workspaceDirectory])

  // Get active items according to mode
  const rawItems = useMemo(() => {
    if (activeSource === 'preset') {
      return PRESET_TREES[selectedPreset]?.tree || []
    }
    if (activeSource === 'workspace' && workspaceDirectory) {
      const keys = Object.keys(allFiles || {})
      if (keys.length > 0) {
        return keys.map((k) => ({
          path: k,
          type: 'file',
          comment: k.toLowerCase() === 'readme.md' ? 'Project documentation' : ''
        }))
      }
      return PRESET_TREES['fullstack'].tree
    }
    return customItems
  }, [activeSource, selectedPreset, workspaceDirectory, allFiles, customItems])

  // Filter items by build noise & depth
  const filteredItems = useMemo(() => {
    const ignoreList = ['node_modules', '.git', 'dist', 'build', '__pycache__', '.next', '.turbo', '.vscode']
    return rawItems.filter((item) => {
      const parts = item.path.split('/')
      if (parts.length > maxDepth) return false
      if (hideBuildFolders && parts.some((p) => ignoreList.includes(p))) return false
      return true
    })
  }, [rawItems, maxDepth, hideBuildFolders])

  // Construct directory tree representation
  const renderedTreeText = useMemo(() => {
    const root = { name: rootLabel, type: 'dir', children: {}, comment: '' }

    filteredItems.forEach((item) => {
      const parts = item.path.split('/')
      let curr = root
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const isLeaf = i === parts.length - 1
        if (!curr.children[part]) {
          curr.children[part] = {
            name: part,
            type: isLeaf ? item.type : 'dir',
            children: {},
            comment: isLeaf ? item.comment : ''
          }
        }
        curr = curr.children[part]
      }
    })

    const outputLines = []
    outputLines.push(rootLabel + '/')

    function formatNode(node, prefix = '') {
      const entries = Object.values(node.children)
      entries.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
        return a.name.localeCompare(b.name)
      })

      entries.forEach((child, index) => {
        const isLast = index === entries.length - 1
        let branch = ''
        let nextPrefix = ''

        if (treeStyle === 'unicode') {
          branch = isLast ? '└── ' : '├── '
          nextPrefix = prefix + (isLast ? '    ' : '│   ')
        } else if (treeStyle === 'ascii') {
          branch = isLast ? '\\-- ' : '|-- '
          nextPrefix = prefix + (isLast ? '    ' : '|   ')
        } else if (treeStyle === 'emoji') {
          const icon = child.type === 'dir' ? '📁 ' : '📄 '
          branch = (isLast ? '└── ' : '├── ') + icon
          nextPrefix = prefix + (isLast ? '    ' : '│   ')
        } else {
          branch = '- '
          nextPrefix = prefix + '  '
        }

        const nameStr = child.name + (child.type === 'dir' ? '/' : '')
        let line = `${prefix}${branch}${nameStr}`

        if (showAnnotations && child.comment) {
          const pad = Math.max(2, 32 - line.length)
          line += ' '.repeat(pad) + `# ${child.comment}`
        }

        outputLines.push(line)

        if (child.type === 'dir' && Object.keys(child.children).length > 0) {
          formatNode(child, nextPrefix)
        }
      })
    }

    formatNode(root)
    return outputLines.join('\n')
  }, [filteredItems, rootLabel, treeStyle, showAnnotations])

  const fullMarkdownBlock = useMemo(() => {
    return `\`\`\`bash\n${renderedTreeText}\n\`\`\``
  }, [renderedTreeText])

  const handleInsert = () => {
    if (typeof onInsertTree === 'function') {
      onInsertTree(fullMarkdownBlock)
    }
  }

  const handleAddCustomItem = (e) => {
    e.preventDefault()
    if (!newItemPath.trim()) return
    setCustomItems((prev) => [
      ...prev,
      {
        path: newItemPath.trim().replace(/^\/+/, ''),
        type: newItemType,
        comment: newItemComment.trim()
      }
    ])
    setNewItemPath('')
    setNewItemComment('')
  }

  const handleRemoveCustomItem = (idx) => {
    setCustomItems((prev) => prev.filter((_, i) => i !== idx))
  }

  // Canvas Header Extras: Syntax style and item stats
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="canvas-header-divider" />
      <span className="canvas-mode-tag" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
        {filteredItems.length} ITEMS • DEPTH {maxDepth}
      </span>

      <span className="canvas-header-divider" />

      {/* Style Switcher Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(0,0,0,0.25)', padding: '2px', borderRadius: '4px' }}>
        <button
          type="button"
          className={`studio-style-btn ${treeStyle === 'unicode' ? 'active' : ''}`}
          onClick={() => setTreeStyle('unicode')}
          style={{ padding: '2px 6px', fontSize: '10px' }}
          title="Unicode Tree (├──)"
        >
          Unicode
        </button>
        <button
          type="button"
          className={`studio-style-btn ${treeStyle === 'ascii' ? 'active' : ''}`}
          onClick={() => setTreeStyle('ascii')}
          style={{ padding: '2px 6px', fontSize: '10px' }}
          title="ASCII Tree (|--)"
        >
          ASCII
        </button>
        <button
          type="button"
          className={`studio-style-btn ${treeStyle === 'emoji' ? 'active' : ''}`}
          onClick={() => setTreeStyle('emoji')}
          style={{ padding: '2px 6px', fontSize: '10px' }}
          title="Emoji Tree (📁/📄)"
        >
          Emoji
        </button>
        <button
          type="button"
          className={`studio-style-btn ${treeStyle === 'indent' ? 'active' : ''}`}
          onClick={() => setTreeStyle('indent')}
          style={{ padding: '2px 6px', fontSize: '10px' }}
          title="Minimal Indent (- )"
        >
          Minimal
        </button>
      </div>
    </div>
  )

  return (
    <StudioShell
      studioId="tree.studio"
      title="Directory Tree Studio"
      subtitle="Clean ASCII, Unicode, and Emoji project architecture trees with automated annotations"
      badge="Architecture Spec"
      accentColor="#10b981"
      icon={<span className="material-symbols-outlined" style={{ fontSize: '20px' }}>account_tree</span>}
      modes={TREE_MODES}
      activeMode={activeSource}
      onModeChange={setActiveSource}
      markdownCode={fullMarkdownBlock}
      codeLanguage="bash"
      onInsert={handleInsert}
      insertLabel="Insert Tree"
      onBackToReadme={onBackToReadme}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={520}
      minSplitWidth={380}
      maxSplitWidth={880}
      inspectorContent={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Presets Catalog (in preset mode) */}
          {activeSource === 'preset' && (
            <div className="studio-section">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                1 • Architecture Blueprint Presets ({Object.keys(PRESET_TREES).length})
              </label>
              <div className="badge-styles-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {Object.entries(PRESET_TREES).map(([id, info]) => {
                  const isSelected = selectedPreset === id
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`badge-style-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedPreset(id)}
                      style={{ padding: '8px 10px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      <div className="badge-style-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge-style-card-title" style={{ fontWeight: 600, fontSize: '11.5px', color: '#f1f5f9' }}>{info.name}</span>
                        <span className="badge-style-card-tag" style={{ fontSize: '9.5px', color: '#10b981' }}>{info.badge}</span>
                      </div>
                      <span className="badge-style-card-desc" style={{ fontSize: '10.5px', color: '#94a3b8', display: 'block', marginTop: '3px' }}>
                        {info.tree.length} files & dirs annotated
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Section 1: Workspace Files Info (in workspace mode) */}
          {activeSource === 'workspace' && (
            <div className="studio-section">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                1 • Live Workspace Files
              </label>
              <div style={{ padding: '12px', borderRadius: '6px', background: 'var(--surface-base)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 600 }}>
                  Scanning Active Workspace: {workspaceDirectory?.name || 'Local Project'}
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                  {Object.keys(allFiles || {}).length} files discovered. Use depth slider and filters below to control tree granularity.
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Custom Builder Form (in custom mode) */}
          {activeSource === 'custom' && (
            <div className="studio-section">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
                1 • Add Custom Paths & Annotations
              </label>
              <form onSubmit={handleAddCustomItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: '6px' }}>
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="Path (e.g. src/auth/jwt.py)"
                    value={newItemPath}
                    onChange={(e) => setNewItemPath(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '11px' }}
                  />
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="Purpose Comment"
                    value={newItemComment}
                    onChange={(e) => setNewItemComment(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '11px' }}
                  />
                  <select
                    className="studio-select"
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '11px' }}
                  >
                    <option value="file">File</option>
                    <option value="dir">Folder</option>
                  </select>
                </div>
                <button type="submit" className="studio-shell-btn studio-shell-btn-secondary" style={{ alignSelf: 'flex-start', padding: '4px 10px', fontSize: '11px' }}>
                  <span className="material-symbols-outlined icon-xs">add</span>
                  <span>Add Path</span>
                </button>
              </form>

              <div className="tree-item-editor-list custom-scrollbar" style={{ marginTop: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                {customItems.map((item, idx) => (
                  <div key={idx} className="tree-item-row" style={{ padding: '4px 8px' }}>
                    <span className={`tree-type-pill ${item.type}`}>
                      {item.type}
                    </span>
                    <span className="tree-path-input truncate" style={{ fontSize: '11px' }}>{item.path}</span>
                    <span className="tree-comment-input truncate" style={{ fontSize: '10.5px' }}>{item.comment || '—'}</span>
                    <button
                      type="button"
                      className="modal-close-icon-btn"
                      onClick={() => handleRemoveCustomItem(idx)}
                      title="Remove item"
                      style={{ padding: '2px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <span className="material-symbols-outlined icon-xs">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Tree Details & Constraints */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              2 • Tree Parameters & Depth Controls
            </label>

            <div className="studio-input-duo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Root Project Label</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={rootLabel}
                  onChange={(e) => setRootLabel(e.target.value)}
                  placeholder="e.g. my-project"
                  style={{ width: '100%', padding: '6px 8px', marginTop: '4px', fontSize: '11px' }}
                />
              </div>

              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Max Depth Level: {maxDepth}</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  className="studio-slider"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value, 10))}
                  style={{ width: '100%', marginTop: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <label className="badge-toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11px', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={showAnnotations}
                  onChange={(e) => setShowAnnotations(e.target.checked)}
                />
                <span>Include inline file annotations (<code># Purpose</code>)</span>
              </label>

              <label className="badge-toggle-switch" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '11px', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={hideBuildFolders}
                  onChange={(e) => setHideBuildFolders(e.target.checked)}
                />
                <span>Hide noisy build directories (<code>node_modules</code>, <code>dist</code>, <code>build</code>)</span>
              </label>
            </div>
          </div>
        </div>
      }
      canvasContent={
        <div
          className="tree-preview-stage"
          style={{
            width: '100%',
            maxWidth: '820px',
            padding: '24px',
            boxSizing: 'border-box'
          }}
        >
          {/* Framed Architecture Tree Window */}
          <div className="terminal-window-mockup" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <div className="terminal-window-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}>
              <div className="terminal-window-dots" style={{ display: 'flex', gap: '6px' }}>
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-window-title" style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>
                {rootLabel}/ — Architecture Tree
              </span>
              <div style={{ width: '40px' }} />
            </div>

            <pre
              className="tree-preview-canvas custom-scrollbar"
              style={{
                margin: 0,
                border: 'none',
                borderRadius: 0,
                padding: '16px',
                lineHeight: 1.6,
                fontSize: '12px',
                fontFamily: 'var(--font-mono, monospace)'
              }}
            >
              <code>{renderedTreeText}</code>
            </pre>
          </div>
        </div>
      }
    />
  )
}
