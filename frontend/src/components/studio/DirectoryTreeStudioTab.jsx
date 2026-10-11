import React, { useState, useMemo, useEffect } from 'react'
import { useStudioSplit } from '../../utils/useResizableSplit'

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
  }
}

export default function DirectoryTreeStudioTab({
  workspaceDirectory = null,
  allFiles = {},
  onInsertTree = () => {},
  onBackToReadme = () => {}
}) {
  const [activeSource, setActiveSource] = useState('preset') // 'preset' | 'workspace' | 'custom'
  const [selectedPreset, setSelectedPreset] = useState('fullstack')
  const [treeStyle, setTreeStyle] = useState('unicode') // 'unicode' | 'ascii' | 'emoji' | 'indent'
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [maxDepth, setMaxDepth] = useState(3)
  const [hideBuildFolders, setHideBuildFolders] = useState(true)
  const [rootLabel, setRootLabel] = useState('my-project')
  const [copied, setCopied] = useState(false)
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(520)

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

  const handleCopy = () => {
    navigator.clipboard.writeText(fullMarkdownBlock)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsertTree(fullMarkdownBlock)
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

  return (
    <div className="studio-tab-view select-none">
      {/* Studio Top Control Strip */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div className="studio-badge-halo">
            <span className="material-symbols-outlined text-secondary" style={{ color: '#818cf8' }}>
              account_tree
            </span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Interactive Directory Tree Studio</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>
                Architecture Builder
              </span>
            </div>
            <p className="studio-subtitle">
              Assemble clean, annotated project architecture trees in Unicode, ASCII, or Emoji format with live preview.
            </p>
          </div>
        </div>

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
            className="btn-studio-secondary"
            onClick={handleCopy}
            title="Copy ASCII tree block to clipboard"
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Tree'}</span>
          </button>
          <button
            type="button"
            className="btn-studio-primary"
            onClick={handleInsert}
            title="Insert directory tree into an open document at cursor line"
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>Insert into Document</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 2-Column Responsive Layout */}
      <div className="studio-content-grid">
        {/* Left Column: Form Controls */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, minWidth: `${formWidth}px`, maxWidth: `${formWidth}px`, flex: 'none' }}
        >
          {/* Source Blueprint Selection */}
          <div className="studio-section">
            <label className="studio-section-label">Tree Blueprint Source</label>
            <div className="studio-segmented-styles">
              <button
                type="button"
                className={`studio-style-btn ${activeSource === 'preset' ? 'active' : ''}`}
                onClick={() => setActiveSource('preset')}
              >
                ⚡ Presets ({Object.keys(PRESET_TREES).length})
              </button>
              {workspaceDirectory && (
                <button
                  type="button"
                  className={`studio-style-btn ${activeSource === 'workspace' ? 'active' : ''}`}
                  onClick={() => setActiveSource('workspace')}
                >
                  📁 Workspace Files
                </button>
              )}
              <button
                type="button"
                className={`studio-style-btn ${activeSource === 'custom' ? 'active' : ''}`}
                onClick={() => setActiveSource('custom')}
              >
                ✏️ Custom Builder
              </button>
            </div>
          </div>

          {/* Preset Selector */}
          {activeSource === 'preset' && (
            <div className="studio-section">
              <label className="studio-section-label">Architecture Blueprint Presets</label>
              <div className="badge-styles-card-grid">
                {Object.entries(PRESET_TREES).map(([id, info]) => {
                  const isSelected = selectedPreset === id
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`badge-style-card ${isSelected ? 'active' : ''}`}
                      onClick={() => setSelectedPreset(id)}
                    >
                      <div className="badge-style-card-header">
                        <span className="badge-style-card-title">{info.name}</span>
                        <span className="badge-style-card-tag">{info.badge}</span>
                      </div>
                      <span className="badge-style-card-desc">
                        {info.tree.length} files and directories annotated
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Style & Formatting Options */}
          <div className="studio-section">
            <label className="studio-section-label">Tree Format & Syntax Style</label>
            <div className="studio-segmented-styles">
              <button
                type="button"
                className={`studio-style-btn ${treeStyle === 'unicode' ? 'active' : ''}`}
                onClick={() => setTreeStyle('unicode')}
              >
                Unicode (├──)
              </button>
              <button
                type="button"
                className={`studio-style-btn ${treeStyle === 'ascii' ? 'active' : ''}`}
                onClick={() => setTreeStyle('ascii')}
              >
                ASCII (|--)
              </button>
              <button
                type="button"
                className={`studio-style-btn ${treeStyle === 'emoji' ? 'active' : ''}`}
                onClick={() => setTreeStyle('emoji')}
              >
                Emoji (📁/📄)
              </button>
              <button
                type="button"
                className={`studio-style-btn ${treeStyle === 'indent' ? 'active' : ''}`}
                onClick={() => setTreeStyle('indent')}
              >
                Minimal (- )
              </button>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="studio-section">
            <label className="studio-section-label">Tree Details & Constraints</label>
            <div className="studio-input-duo">
              <div className="studio-field">
                <span className="studio-field-label">Root Project Name</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={rootLabel}
                  onChange={(e) => setRootLabel(e.target.value)}
                  placeholder="e.g. my-project"
                />
              </div>

              <div className="studio-field">
                <span className="studio-field-label">Max Depth Level ({maxDepth} Levels)</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  className="studio-slider"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value, 10))}
                  style={{ marginTop: '8px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
              <label className="badge-toggle-switch">
                <input
                  type="checkbox"
                  checked={showAnnotations}
                  onChange={(e) => setShowAnnotations(e.target.checked)}
                />
                <span>Include inline file annotations (<code># Purpose</code>)</span>
              </label>

              <label className="badge-toggle-switch">
                <input
                  type="checkbox"
                  checked={hideBuildFolders}
                  onChange={(e) => setHideBuildFolders(e.target.checked)}
                />
                <span>Hide noisy build directories (<code>node_modules</code>, <code>dist</code>, <code>build</code>)</span>
              </label>
            </div>
          </div>

          {/* Custom Items Manager */}
          {activeSource === 'custom' && (
            <div className="studio-section">
              <label className="studio-section-label">Add Custom Path to Tree</label>
              <form onSubmit={handleAddCustomItem} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: '8px' }}>
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="Path (e.g. src/auth/jwt.py)"
                    value={newItemPath}
                    onChange={(e) => setNewItemPath(e.target.value)}
                  />
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="Comment (e.g. JWT verification)"
                    value={newItemComment}
                    onChange={(e) => setNewItemComment(e.target.value)}
                  />
                  <select
                    className="studio-select"
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                  >
                    <option value="file">File</option>
                    <option value="dir">Folder</option>
                  </select>
                </div>
                <button type="submit" className="btn-studio-secondary" style={{ alignSelf: 'flex-start' }}>
                  <span className="material-symbols-outlined icon-xs">add</span>
                  <span>Add Path</span>
                </button>
              </form>

              <div className="tree-item-editor-list custom-scrollbar" style={{ marginTop: '12px' }}>
                {customItems.map((item, idx) => (
                  <div key={idx} className="tree-item-row">
                    <span className={`tree-type-pill ${item.type}`}>
                      {item.type}
                    </span>
                    <span className="tree-path-input truncate">{item.path}</span>
                    <span className="tree-comment-input truncate">{item.comment || '—'}</span>
                    <button
                      type="button"
                      className="modal-close-icon-btn"
                      onClick={() => handleRemoveCustomItem(idx)}
                      title="Remove item"
                    >
                      <span className="material-symbols-outlined icon-xs">close</span>
                    </button>
                  </div>
                ))}
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

        {/* Right Column: Live Syntax Output Canvas */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* Live Preview Card */}
          <div className="studio-card">
            <div className="studio-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mac-dot dot-red" />
                <span className="mac-dot dot-yellow" />
                <span className="mac-dot dot-green" />
                <span className="studio-card-title">{rootLabel} — Tree Preview</span>
              </div>
              <span className="studio-card-tag">
                {filteredItems.length} items • Depth {maxDepth}
              </span>
            </div>
            <div className="studio-render-canvas dark-bg custom-scrollbar" style={{ padding: '16px' }}>
              <pre className="tree-preview-canvas custom-scrollbar" style={{ margin: 0, border: 'none', background: 'transparent' }}>
                <code>{renderedTreeText}</code>
              </pre>
            </div>
          </div>

          {/* Generated Markdown Code Block */}
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="studio-card-title">Generated Markdown Code Block</span>
              <button
                type="button"
                className="snippet-copy-btn"
                onClick={handleCopy}
              >
                <span className="material-symbols-outlined icon-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="studio-code-block custom-scrollbar">
              <code>{fullMarkdownBlock}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
