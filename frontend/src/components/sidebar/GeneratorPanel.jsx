import { useState, useMemo } from 'react'
import axios from 'axios'
import SectionOrder from './SectionOrder'
import { apiPost } from '../../utils/apiClient'

const TECH_STACK_OPTIONS = [
  // Frontend
  { id: 'react', label: 'React', category: 'Frontend' },
  { id: 'nextjs', label: 'Next.js', category: 'Frontend' },
  { id: 'vue', label: 'Vue', category: 'Frontend' },
  { id: 'angular', label: 'Angular', category: 'Frontend' },
  { id: 'svelte', label: 'Svelte', category: 'Frontend' },
  { id: 'typescript', label: 'TypeScript', category: 'Frontend' },
  { id: 'tailwind', label: 'Tailwind CSS', category: 'Frontend' },
  { id: 'vite', label: 'Vite', category: 'Frontend' },
  { id: 'webpack', label: 'Webpack', category: 'Frontend' },
  { id: 'remix', label: 'Remix', category: 'Frontend' },

  // Backend
  { id: 'node', label: 'Node.js', category: 'Backend' },
  { id: 'fastapi', label: 'FastAPI', category: 'Backend' },
  { id: 'flask', label: 'Flask', category: 'Backend' },
  { id: 'django', label: 'Django', category: 'Backend' },
  { id: 'golang', label: 'Go', category: 'Backend' },
  { id: 'rust', label: 'Rust', category: 'Backend' },
  { id: 'java', label: 'Java/Spring', category: 'Backend' },
  { id: 'dotnet', label: '.NET/C#', category: 'Backend' },
  { id: 'python', label: 'Python', category: 'Backend' },
  { id: 'php', label: 'PHP/Laravel', category: 'Backend' },

  // Database
  { id: 'mongodb', label: 'MongoDB', category: 'Database' },
  { id: 'mysql', label: 'MySQL', category: 'Database' },
  { id: 'postgresql', label: 'PostgreSQL', category: 'Database' },
  { id: 'sqlite', label: 'SQLite', category: 'Database' },
  { id: 'redis', label: 'Redis', category: 'Database' },
  { id: 'dynamodb', label: 'DynamoDB', category: 'Database' },
  { id: 'firestore', label: 'Firestore', category: 'Database' },
  { id: 'elasticsearch', label: 'Elasticsearch', category: 'Database' },

  // DevOps/Cloud
  { id: 'docker', label: 'Docker', category: 'DevOps' },
  { id: 'kubernetes', label: 'Kubernetes', category: 'DevOps' },
  { id: 'aws', label: 'AWS', category: 'DevOps' },
  { id: 'gcp', label: 'Google Cloud', category: 'DevOps' },
  { id: 'azure', label: 'Azure', category: 'DevOps' },
  { id: 'vercel', label: 'Vercel', category: 'DevOps' },
  { id: 'netlify', label: 'Netlify', category: 'DevOps' },
  { id: 'github-actions', label: 'GitHub Actions', category: 'DevOps' },

  // Testing & Tools
  { id: 'jest', label: 'Jest', category: 'Testing' },
  { id: 'pytest', label: 'Pytest', category: 'Testing' },
  { id: 'cypress', label: 'Cypress', category: 'Testing' },
  { id: 'postman', label: 'Postman', category: 'Testing' },
  { id: 'git', label: 'Git', category: 'Tools' },
  { id: 'graphql', label: 'GraphQL', category: 'Tools' },
  { id: 'rest', label: 'REST API', category: 'Tools' },
]

const AVAILABLE_DOCS = [
  {
    id: 'README.md',
    label: 'README.md',
    desc: 'Primary Project Overview & Features',
    icon: 'description',
    tag: 'Primary',
    isPrimary: true
  },
  {
    id: 'CONTRIBUTING.md',
    label: 'CONTRIBUTING.md',
    desc: 'Contribution Guidelines & PR Workflow',
    icon: 'handshake',
    tag: 'Guide'
  },
  {
    id: 'SETUP.md',
    label: 'SETUP.md',
    desc: 'Local Setup, Dev Ports & Multi-PM Guide',
    icon: 'terminal',
    tag: 'Dev'
  },
  {
    id: 'ARCHITECTURE.md',
    label: 'ARCHITECTURE.md',
    desc: 'System Topology & Request Lifecycle',
    icon: 'account_tree',
    tag: 'Arch'
  },
  {
    id: 'CHANGELOG.md',
    label: 'CHANGELOG.md',
    desc: 'Version History & Release Notes',
    icon: 'history',
    tag: 'Releases'
  },
  {
    id: 'LICENSE',
    label: 'LICENSE',
    desc: 'MIT Open-Source Software License',
    icon: 'verified_user',
    tag: 'Legal'
  }
]

export default function Input({
  onGenerate,
  loading,
  generateSuite,
  setGenerateSuite,
  theme,
  setTheme,
  sectionOrder,
  setSectionOrder,
  repoUrl,
  setRepoUrl,
  description,
  setDescription,
  selectedTechs,
  setSelectedTechs,
  onNavigateToTemplates,
  workspaceDirectory = null,
  files = {},
  activeFile = 'README.md'
}) {
  const [customTech, setCustomTech] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [techSearch, setTechSearch] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanError, setScanError] = useState('')

  // Creation Mode: 'overwrite' (replaces active/disk file) or 'new' (creates new file, e.g. README (1).md)
  const [creationMode, setCreationMode] = useState('overwrite')
  const [targetFileName, setTargetFileName] = useState('README.md')
  const [selectedDocs, setSelectedDocs] = useState(() => {
    return generateSuite
      ? ['README.md', 'CONTRIBUTING.md', 'SETUP.md', 'ARCHITECTURE.md', 'LICENSE']
      : ['README.md']
  })

  const handleToggleDoc = (docId) => {
    if (docId === 'README.md') return // README.md is always required
    setSelectedDocs((prev) => {
      const exists = prev.includes(docId)
      const next = exists ? prev.filter((id) => id !== docId) : [...prev, docId]
      if (setGenerateSuite) {
        setGenerateSuite(next.some((id) => id !== 'README.md'))
      }
      return next
    })
  }

  const handleSelectAllDocs = () => {
    const all = AVAILABLE_DOCS.map((d) => d.id)
    setSelectedDocs(all)
    if (setGenerateSuite) setGenerateSuite(true)
  }

  const handleSelectReadmeOnly = () => {
    setSelectedDocs(['README.md'])
    if (setGenerateSuite) setGenerateSuite(false)
  }

  const handleScanRepo = async () => {
    if (!repoUrl || !repoUrl.trim()) return
    setScanning(true)
    setScanError('')
    try {
      const response = await apiPost('/api/scan-repo', { repo_url: repoUrl.trim() })
      if (response.data && response.data.success) {
        const data = response.data
        setScanResult(data)
        if (!description && data.description) {
          setDescription(data.description)
        }
        if (data.detected_tech && Array.isArray(data.detected_tech)) {
          setSelectedTechs((prev) => Array.from(new Set([...prev, ...data.detected_tech])))
        }
      }
    } catch (err) {
      console.warn('Scan repo API error:', err)
      const isConnError = err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || (err.response?.status === 500 && !err.response?.data?.detail)
      const detail = err.response?.data?.detail
      if (detail) {
        setScanError(detail)
      } else if (isConnError) {
        setScanError('Backend server is not reachable. Please ensure the Python backend is running on port 8000.')
      } else {
        setScanError('Failed to scan repository. Please verify the URL.')
      }
    } finally {
      setScanning(false)
    }
  }

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Testing', 'Tools']

  const handleTechToggle = (techLabel) => {
    setSelectedTechs((prev) =>
      prev.includes(techLabel) ? prev.filter((t) => t !== techLabel) : [...prev, techLabel]
    )
  }

  const handleAddCustomTech = () => {
    const val = (customTech || techSearch).trim()
    if (val && !selectedTechs.includes(val)) {
      setSelectedTechs((prev) => [...prev, val])
      setCustomTech('')
      setTechSearch('')
    }
  }

  const handleRemoveTech = (tech) => {
    setSelectedTechs((prev) => prev.filter((t) => t !== tech))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onGenerate({
      repoUrl,
      description,
      selectedTechs,
      theme,
      sectionOrder,
      generateSuite: selectedDocs.some((d) => d !== 'README.md'),
      creationMode,
      targetFileName: targetFileName.trim() || 'README.md',
      selectedDocs
    })
  }

  // Filter tech stack options based on category and search query
  const filteredTechs = useMemo(() => {
    return TECH_STACK_OPTIONS.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      const matchesSearch = techSearch
        ? item.label.toLowerCase().includes(techSearch.toLowerCase())
        : true
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, techSearch])

  const workspaceName = (workspaceDirectory?.name || 'workspace').toUpperCase()

  return (
    <div className="generator-config-wrapper">
      <form onSubmit={handleSubmit} className="generator-form">
        {/* ==================== 1. COMPACT PRESETS HELPER BANNER ==================== */}
        <div className="config-presets-banner-compact">
          <div className="presets-banner-compact-left">
            <span className="material-symbols-outlined icon-bookmark">bookmark_border</span>
            <span>Looking for blueprints? Browse starter templates</span>
          </div>
          <button
            type="button"
            className="btn-presets-pill"
            onClick={onNavigateToTemplates}
            title="Open Starter Presets & Templates tab"
          >
            <span>Presets</span>
            <span className="material-symbols-outlined icon-arrow">arrow_forward</span>
          </button>
        </div>

        {/* ==================== 2. TARGET OUTPUT & SUITE DOCUMENTS ==================== */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="header-left">
              <span className="material-symbols-outlined card-header-icon text-primary">folder_copy</span>
              <span className="config-card-title">Output & Documents</span>
            </div>
            {workspaceDirectory?.name && (
              <span className="dest-path-badge">📁 {workspaceName}</span>
            )}
          </div>

          {/* Creation Mode Toggle (Overwrite vs Create New) */}
          <div className="form-field">
            <label className="field-label">Target Output Mode</label>
            <div className="config-mode-toggle">
              <button
                type="button"
                className={`mode-toggle-btn ${creationMode === 'overwrite' ? 'active is-overwrite' : ''}`}
                onClick={() => setCreationMode('overwrite')}
                title="Overwrite existing file(s) in editor and on workspace disk"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>sync</span>
                <span>Overwrite Existing</span>
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${creationMode === 'new' ? 'active' : ''}`}
                onClick={() => setCreationMode('new')}
                title="Create as a new file (e.g. README (1).md) keeping existing files intact"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>note_add</span>
                <span>Create New File</span>
              </button>
            </div>
            <div className={`mode-info-banner ${creationMode === 'overwrite' ? 'is-overwrite' : 'is-new'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', flexShrink: 0 }}>
                {creationMode === 'overwrite' ? 'warning' : 'info'}
              </span>
              <span>
                {creationMode === 'overwrite'
                  ? `Overwrites "${targetFileName}" & selected companion files directly in workspace.`
                  : `Generates fresh file(s) without modifying existing documents (preserves originals).`}
              </span>
            </div>
          </div>

          {/* Target Filename Input */}
          <div className="form-field">
            <div className="field-label-row">
              <label className="field-label" htmlFor="target-filename">Primary Document Name</label>
              {targetFileName !== 'README.md' && (
                <button
                  type="button"
                  className="btn-suite-action"
                  onClick={() => setTargetFileName('README.md')}
                  title="Reset to README.md"
                >
                  Reset
                </button>
              )}
            </div>
            <div className="input-with-icon">
              <span className="material-symbols-outlined input-prefix-icon">edit_document</span>
              <input
                id="target-filename"
                type="text"
                className="ide-input"
                placeholder="README.md"
                value={targetFileName}
                onChange={(e) => setTargetFileName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Documentation Suite Selector */}
          <div className="doc-suite-container">
            <div className="doc-suite-header-actions">
              <span className="suite-label">Select Documentation Files</span>
              <div className="doc-suite-action-links">
                <button
                  type="button"
                  className="btn-suite-action"
                  onClick={handleSelectAllDocs}
                >
                  All ({AVAILABLE_DOCS.length})
                </button>
                <span>·</span>
                <button
                  type="button"
                  className="btn-suite-action"
                  onClick={handleSelectReadmeOnly}
                >
                  README Only
                </button>
              </div>
            </div>

            <div className="doc-suite-list">
              {AVAILABLE_DOCS.map((doc) => {
                const isSelected = selectedDocs.includes(doc.id)
                return (
                  <div
                    key={doc.id}
                    className={`doc-suite-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleToggleDoc(doc.id)}
                  >
                    <div className="doc-suite-item-left">
                      <input
                        type="checkbox"
                        className="doc-suite-checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        disabled={doc.isPrimary}
                      />
                      <span className="material-symbols-outlined doc-suite-item-icon">{doc.icon}</span>
                      <div className="doc-suite-item-info">
                        <span className="doc-suite-name">{doc.label}</span>
                        <span className="doc-suite-desc">{doc.desc}</span>
                      </div>
                    </div>
                    <span className={`doc-suite-tag ${doc.isPrimary ? 'is-primary' : ''}`}>
                      {doc.tag}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ==================== 3. PROJECT CONTEXT & REPO SOURCE ==================== */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="header-left">
              <span className="material-symbols-outlined card-header-icon text-secondary">source</span>
              <span className="config-card-title">Project Context</span>
            </div>
          </div>

          <div className="form-field">
            <div className="field-label-row">
              <label className="field-label" htmlFor="repo-url">GitHub Repository URL</label>
              {repoUrl && repoUrl.trim() && (
                <button
                  type="button"
                  className={`btn-scan-repo ${scanning ? 'scanning' : ''}`}
                  onClick={handleScanRepo}
                  disabled={scanning || loading}
                  title="Deep scan repository for dependencies, languages, and structure"
                >
                  <span className={`material-symbols-outlined icon-xs ${scanning ? 'spin-icon' : ''}`}>
                    {scanning ? 'sync' : 'radar'}
                  </span>
                  <span>{scanning ? 'Scanning...' : 'Scan & Auto-Detect'}</span>
                </button>
              )}
            </div>
            <div className="input-with-icon">
              <span className="material-symbols-outlined input-prefix-icon">link</span>
              <input
                id="repo-url"
                type="url"
                className="ide-input"
                placeholder="https://github.com/username/repository"
                value={repoUrl}
                onChange={(e) => {
                  setRepoUrl(e.target.value)
                  if (scanResult) setScanResult(null)
                  if (scanError) setScanError('')
                }}
                disabled={loading}
              />
            </div>

            {/* AST Scan Result Card */}
            {scanResult && (
              <div className="ast-scan-result-card">
                <div className="ast-card-header">
                  <span className="material-symbols-outlined text-primary icon-xs">verified</span>
                  <span className="ast-repo-name truncate">{scanResult.full_name || scanResult.repo_name}</span>
                  <span className="ast-stat-pill">⭐ {scanResult.stars}</span>
                  <span className="ast-stat-pill">{scanResult.license}</span>
                </div>
                {scanResult.detected_tech && scanResult.detected_tech.length > 0 && (
                  <div className="ast-detected-techs">
                    <span className="ast-detected-label">Detected Tech Stack:</span>
                    <div className="ast-chips-row">
                      {scanResult.detected_tech.map((t) => (
                        <span key={t} className="ast-tech-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {scanError && (
              <div className="ast-error-note">
                <span className="material-symbols-outlined icon-xs text-amber">info</span>
                <span>{scanError}</span>
              </div>
            )}
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="description">
              Project Description / Focus
            </label>
            <textarea
              id="description"
              className="ide-textarea custom-scrollbar"
              placeholder="Describe your project, key features, CLI usage, or architecture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
        </div>

        {/* ==================== 4. TECH STACK & ECOSYSTEM ==================== */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="header-left">
              <span className="material-symbols-outlined card-header-icon text-primary">layers</span>
              <span className="config-card-title">Tech Stack</span>
            </div>
            {selectedTechs.length > 0 && (
              <span className="selected-count-badge">
                {selectedTechs.length} Selected
              </span>
            )}
          </div>

          {/* Active Selected Tags Tray */}
          {selectedTechs.length > 0 && (
            <div className="selected-tags-tray custom-scrollbar">
              {selectedTechs.map((tech) => (
                <span key={tech} className="selected-tag-pill">
                  <span>{tech}</span>
                  <button
                    type="button"
                    className="remove-tag-btn"
                    onClick={() => handleRemoveTech(tech)}
                    title={`Remove ${tech}`}
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                type="button"
                className="clear-all-tags-btn"
                onClick={() => setSelectedTechs([])}
                title="Clear all selected"
              >
                Clear
              </button>
            </div>
          )}

          {/* Category Filter Tabs */}
          <div className="tech-category-tabs custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-tab-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search or Custom Add Field */}
          <div className="tech-add-bar">
            <div className="input-with-icon mini">
              <span className="material-symbols-outlined input-prefix-icon">search</span>
              <input
                type="text"
                className="ide-input mini"
                placeholder="Filter or type custom tech..."
                value={customTech || techSearch}
                onChange={(e) => {
                  setTechSearch(e.target.value)
                  setCustomTech(e.target.value)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomTech()
                  }
                }}
                disabled={loading}
              />
            </div>
            {customTech.trim() && (
              <button
                type="button"
                className="btn-add-pill"
                onClick={handleAddCustomTech}
                disabled={loading}
              >
                + Add
              </button>
            )}
          </div>

          {/* Interactive Tech Pills */}
          <div className="tech-chips-wall custom-scrollbar">
            {filteredTechs.map((item) => {
              const isSelected = selectedTechs.includes(item.label)
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`tech-chip-toggle ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleTechToggle(item.label)}
                  disabled={loading}
                >
                  <span className="chip-indicator">
                    {isSelected ? '✓' : '+'}
                  </span>
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ==================== 5. STYLE & SECTION ORDER ==================== */}
        <div className="config-card">
          <div className="config-card-header">
            <div className="header-left">
              <span className="material-symbols-outlined card-header-icon text-secondary">palette</span>
              <span className="config-card-title">Style & Sections</span>
            </div>
          </div>

          {/* Readme Theme Select */}
          <div className="form-field">
            <label className="field-label" htmlFor="theme-select">Markdown Template Style</label>
            <select
              id="theme-select"
              className="ide-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={loading}
            >
              <option value="default">Modern Technical — Visual Badges & Architecture</option>
              <option value="showcase">Showcase — Product Landing & Highlights</option>
              <option value="minimalist">Minimalist — Clean, Compact & Direct</option>
              <option value="cli">CLI & Tooling — Terminal Commands & Flags</option>
              <option value="hacker">Hacker — Cyberpunk ASCII & Hex Indices</option>
              <option value="academic">Academic — Research Specs, Benchmarks & BibTeX</option>
            </select>
          </div>

          {/* Section Order Accordion */}
          <SectionOrder
            sectionOrder={sectionOrder}
            setSectionOrder={setSectionOrder}
            disabled={loading}
          />
        </div>

        {/* ==================== 6. PROMINENT ACTION CTA ==================== */}
        <div className="generator-submit-tray">
          <button
            type="submit"
            className={`btn-generate-main ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            <span className="material-symbols-outlined generate-btn-icon">
              {loading ? 'sync' : (creationMode === 'overwrite' ? 'sync_alt' : 'note_add')}
            </span>
            <span className="generate-btn-text">
              {loading
                ? 'Creating Documentation...'
                : creationMode === 'overwrite'
                  ? `Overwrite Documentation (${selectedDocs.length} Doc${selectedDocs.length > 1 ? 's' : ''})`
                  : `Create New Documentation (${selectedDocs.length} Doc${selectedDocs.length > 1 ? 's' : ''})`
              }
            </span>
            <kbd className="btn-shortcut-badge">Ctrl+↵</kbd>
          </button>
        </div>
      </form>
    </div>
  )
}
