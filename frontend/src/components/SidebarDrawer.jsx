import React, { useState, useMemo } from 'react'
import Input from './Input'
import IdeExplorerTree from './IdeExplorerTree'
import SourceControlDrawer from './SourceControlDrawer'
import { PRESET_TEMPLATES } from '../data/presetTemplates'
import { validateDocFilename } from '../utils/filenameUtils'

export default function SidebarDrawer({
  activeTab,
  collapsed,
  files,
  workspaceDirectory = null,
  onOpenFolder = () => {},
  openDocTabs = [],
  activeFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  showToast = () => {},
  markdown,
  onScrollToHeading,
  onLoadTemplate,
  onLoadPreset,
  openPresetTabs = [],
  onTogglePresetPreview = () => {},
  onClosePresetTab = () => {},
  openStudioTabs = [],
  onOpenStudioTab = () => {},
  onCloseStudioTab = () => {},
  onInsertInstantSyntax = () => {},
  // Git / Source Control props
  gitInfo = null,
  onRefreshGit = () => {},
  isRefreshingGit = false,
  // Props for Input (Documentation Config)
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
  error,
  // Template Preview & Navigation props
  previewPreset = null,
  onPreviewTemplate = () => {},
  onClosePresetPreview = () => {},
  onNavigateToTemplates = () => {}
}) {
  const [newFileName, setNewFileName] = useState('')
  const [isAddingFile, setIsAddingFile] = useState(false)
  const [templateCategory, setTemplateCategory] = useState('All')
  const [templateSearch, setTemplateSearch] = useState('')
  const [studioCategory, setStudioCategory] = useState('All')
  const [studioSearch, setStudioSearch] = useState('')

  const currentPreviewPreset = useMemo(() => {
    if (previewPreset) return previewPreset
    if (activeFile && typeof activeFile === 'string' && activeFile.startsWith('preset:')) {
      const pId = activeFile.replace('preset:', '')
      return PRESET_TEMPLATES.find((p) => p.id === pId) || null
    }
    return null
  }, [previewPreset, activeFile])

  // Resizable sidebar drawer width state
  const [drawerWidth, setDrawerWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('ide_sidebar_width')
      return saved ? parseInt(saved, 10) : 300
    } catch {
      return 300
    }
  })
  const [isResizing, setIsResizing] = useState(false)

  const handleStartResize = (e) => {
    e.preventDefault()
    setIsResizing(true)
    const startX = e.clientX
    const startWidth = drawerWidth

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX
      const nextWidth = Math.max(220, Math.min(650, startWidth + delta))
      setDrawerWidth(nextWidth)
      try {
        localStorage.setItem('ide_sidebar_width', String(nextWidth))
      } catch {}
    }

    const onMouseUp = () => {
      setIsResizing(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const handleResetResize = () => {
    setDrawerWidth(300)
    try {
      localStorage.setItem('ide_sidebar_width', '300')
    } catch {}
  }

  // Parse document outline from active markdown
  const outline = useMemo(() => {
    if (!markdown) return []
    const lines = markdown.split('\n')
    const headings = []
    lines.forEach((line, idx) => {
      const match = line.match(/^(#{1,4})\s+(.+)$/)
      if (match) {
        headings.push({
          level: match[1].length,
          text: match[2].replace(/[#*_`]/g, '').trim(),
          lineNumber: idx + 1
        })
      }
    })
    return headings
  }, [markdown])

  const handleCreateFileSubmit = (e) => {
    e.preventDefault()
    if (!newFileName.trim()) return
    const { valid, filename, error: valErr } = validateDocFilename(newFileName)
    if (!valid) {
      showToast(valErr, 'warning')
      return
    }
    onCreateFile(filename)
    setNewFileName('')
    setIsAddingFile(false)
  }

  // Studio Tools definition (Unified Antigravity IDE Suite)
  const studioToolsList = useMemo(() => [
    {
      id: 'badges.studio',
      title: 'Shields.io Badge Studio',
      category: 'Visual Design',
      icon: 'shield',
      color: '#38bdf8',
      description: 'Design custom SVG shields, devicon tech racks, brand plates, and real-time status badges with custom hex palettes.',
      features: ['100+ Devicon Presets', 'Custom Hex Swatches', 'Flat / Plastic / Social Styles']
    },
    {
      id: 'diagrams.studio',
      title: 'Mermaid Diagram Studio',
      category: 'Architecture',
      icon: 'schema',
      color: '#818cf8',
      description: 'Visually assemble system architecture flowcharts, sequence timelines, ER models, and Git branching graphs with live SVG rendering.',
      features: ['Live Mermaid Engine', 'Multi-Layer Flowcharts', 'Visual Diagram Code Generator']
    },
    {
      id: 'tables.studio',
      title: 'Visual Markdown Table Designer',
      category: 'Visual Design',
      icon: 'table_chart',
      color: '#38bdf8',
      description: 'Interactive visual spreadsheet editor. Insert rows/columns, customize column alignments, and live preview rendered tables.',
      features: ['Spreadsheet-like Grid', 'Per-Column Alignment', 'Preset Feature Blueprints']
    },
    {
      id: 'snippets.studio',
      title: 'Code & Callouts Snippets',
      category: 'Documentation',
      icon: 'code_blocks',
      color: '#818cf8',
      description: 'Create GitHub alert callouts ([!NOTE], [!TIP], [!WARNING], [!CAUTION]), multi-language code blocks, and collapsible sections.',
      features: ['GitHub Callout Types', 'Syntax Highlight Blocks', 'Collapsible Details Accordions']
    },
    {
      id: 'images.studio',
      title: 'Image & Banner Studio',
      category: 'Visual Design',
      icon: 'image',
      color: '#38bdf8',
      description: 'Generate repo hero header banners, resolve and wrap screenshot links into macOS window frames, and assemble comparison grids.',
      features: ['SVG Hero Banner Generator', 'macOS Browser Window Mockup', 'Side-by-Side Comparison Grid']
    },
    {
      id: 'tree.studio',
      title: 'Directory Tree Studio',
      category: 'Architecture',
      icon: 'account_tree',
      color: '#818cf8',
      description: 'Generate clean Unicode, ASCII, or Emoji folder architecture trees with depth limits and inline comment annotations.',
      features: ['Unicode & ASCII Formats', 'Inline Comment Annotations', 'Preset Stacks (SaaS, CLI, Monorepo)']
    },
    {
      id: 'api.studio',
      title: 'API & Endpoints Studio',
      category: 'API & Specs',
      icon: 'api',
      color: '#38bdf8',
      description: 'Draft REST endpoints with HTTP method badges, parameters, JSON request/response bodies, and cURL / fetch / Python exporters.',
      features: ['Parameter Matrix', 'Sample Request & Response', 'cURL / Fetch / Python Exporter']
    },
    {
      id: 'audit.studio',
      title: 'Documentation Health & Quality Auditor',
      category: 'Quality & Audit',
      icon: 'verified_user',
      color: '#818cf8',
      description: 'Audit any README, CONTRIBUTING, SETUP, or Markdown document with custom standard profiles, 100-pt scorecard, and 1-click boilerplate fixers.',
      features: ['Multi-Doc File Selector', '7 Documentation Standards', '1-Click Section Boilerplate']
    },
    {
      id: 'contributors.studio',
      title: 'Contributor & Team Hall of Fame',
      category: 'Community',
      icon: 'group',
      color: '#38bdf8',
      description: 'Build All-Contributors specification grids, contributor role badges, avatar tables, and sponsor showcases.',
      features: ['All-Contributors Standard', 'GitHub Avatar Grid', 'Sponsor Tiers Showcase']
    },
    {
      id: 'changelog.studio',
      title: 'Changelog & Release Notes Studio',
      category: 'Documentation',
      icon: 'history',
      color: '#818cf8',
      description: 'Curate Keep-a-Changelog standard release notes with SemVer bumping, categorized bullet points, and release links.',
      features: ['Keep-a-Changelog Standard', 'SemVer Version Bumping', 'Categorized Release Buckets']
    },
    {
      id: 'icons.studio',
      title: 'Icons & Emoji Studio',
      category: 'Visual Design',
      icon: 'sentiment_satisfied',
      color: '#38bdf8',
      description: 'Curated developer emojis, GitHub shortcodes, vector symbols, and 1-click Markdown heading decorators.',
      features: ['100+ Developer Emojis', 'Heading Decorator Tool', 'Offline Vector Symbols']
    }
  ], [])

  const studioCategories = useMemo(() => [
    { id: 'All', label: 'All', count: studioToolsList.length },
    { id: 'Open', label: 'In Tabs', count: studioToolsList.filter((t) => openStudioTabs.includes(t.id)).length },
    { id: 'Visual', label: 'Visual Design', count: studioToolsList.filter((t) => ['badges.studio', 'tables.studio', 'images.studio', 'icons.studio'].includes(t.id)).length },
    { id: 'Architecture', label: 'Architecture', count: studioToolsList.filter((t) => ['diagrams.studio', 'tree.studio', 'snippets.studio'].includes(t.id)).length },
    { id: 'API & Specs', label: 'API & Quality', count: studioToolsList.filter((t) => ['api.studio', 'audit.studio', 'contributors.studio', 'changelog.studio'].includes(t.id)).length }
  ], [studioToolsList, openStudioTabs])

  const filteredStudioTools = useMemo(() => {
    return studioToolsList.filter((tool) => {
      const q = studioSearch.trim().toLowerCase()
      if (q) {
        const matchTitle = tool.title.toLowerCase().includes(q)
        const matchDesc = tool.description.toLowerCase().includes(q)
        const matchId = tool.id.toLowerCase().includes(q)
        const matchCat = (tool.category || '').toLowerCase().includes(q)
        const matchFeat = tool.features.some((f) => f.toLowerCase().includes(q))
        if (!matchTitle && !matchDesc && !matchId && !matchCat && !matchFeat) return false
      }

      if (studioCategory === 'Open') return openStudioTabs.includes(tool.id)
      if (studioCategory === 'Visual') return ['badges.studio', 'tables.studio', 'images.studio', 'icons.studio'].includes(tool.id)
      if (studioCategory === 'Architecture') return ['diagrams.studio', 'tree.studio', 'snippets.studio'].includes(tool.id)
      if (studioCategory === 'API & Specs') return ['api.studio', 'audit.studio', 'contributors.studio', 'changelog.studio'].includes(tool.id)

      return true
    })
  }, [studioToolsList, studioSearch, studioCategory, openStudioTabs])

  // Filter templates by category and search query
  const filteredTemplates = useMemo(() => {
    return PRESET_TEMPLATES.filter((tpl) => {
      const matchesCat = templateCategory === 'All' || tpl.category === templateCategory
      const query = templateSearch.trim().toLowerCase()
      if (!query) return matchesCat
      const matchesQuery =
        tpl.title.toLowerCase().includes(query) ||
        tpl.description.toLowerCase().includes(query) ||
        tpl.tags.some(t => t.toLowerCase().includes(query)) ||
        tpl.category.toLowerCase().includes(query)
      return matchesCat && matchesQuery
    })
  }, [templateCategory, templateSearch])

  if (collapsed) {
    return null
  }

  return (
    <aside
      className="sidebar-drawer select-none"
      style={{ width: `${drawerWidth}px`, minWidth: `${drawerWidth}px` }}
    >
      {/* Header with Title (Hidden when activeTab === 'explorer' or 'git' because they render their own top headers) */}
      {activeTab !== 'explorer' && activeTab !== 'git' && activeTab !== 'source-control' && (
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="material-symbols-outlined drawer-title-icon">
              {activeTab === 'generator' && 'tune'}
              {activeTab === 'outline' && 'toc'}
              {activeTab === 'templates' && 'bookmark_border'}
              {activeTab === 'tools' && 'widgets'}
            </span>
            <span className="drawer-title-text">
              {activeTab === 'generator' && 'Documentation Config'}
              {activeTab === 'outline' && 'Document Outline'}
              {activeTab === 'templates' && 'Templates & Presets'}
              {activeTab === 'tools' && 'Studio Tools & Builders'}
            </span>
          </div>
        </div>
      )}

      {/* Drawer Body Container */}
      <div className={`drawer-body custom-scrollbar ${activeTab === 'explorer' || activeTab === 'git' || activeTab === 'source-control' ? 'explorer-mode' : ''}`}>
        {/* ==================== 1. EXPLORER PANEL ==================== */}
        {activeTab === 'explorer' && (
          <IdeExplorerTree
            files={files}
            activeFile={activeFile}
            onSelectFile={onSelectFile}
            onCreateFile={onCreateFile}
            onDeleteFile={onDeleteFile}
            workspaceDirectory={workspaceDirectory}
            onOpenFolder={onOpenFolder}
            showToast={showToast}
          />
        )}

        {/* ==================== 2. GIT / SOURCE CONTROL PANEL ==================== */}
        {(activeTab === 'git' || activeTab === 'source-control') && (
          <SourceControlDrawer
            gitInfo={gitInfo}
            workspaceDirectory={workspaceDirectory}
            onRefreshGit={onRefreshGit}
            onSelectFile={onSelectFile}
            isRefreshing={isRefreshingGit}
            showToast={showToast}
          />
        )}

        {/* ==================== 2. DOCUMENTATION CONFIG PANEL ==================== */}
        {activeTab === 'generator' && (
          <div className="generator-panel">
            <Input
              onGenerate={onGenerate}
              loading={loading}
              generateSuite={generateSuite}
              setGenerateSuite={setGenerateSuite}
              theme={theme}
              setTheme={setTheme}
              sectionOrder={sectionOrder}
              setSectionOrder={setSectionOrder}
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              description={description}
              setDescription={setDescription}
              selectedTechs={selectedTechs}
              setSelectedTechs={setSelectedTechs}
              onNavigateToTemplates={onNavigateToTemplates}
              workspaceDirectory={workspaceDirectory}
              files={files}
              activeFile={activeFile}
            />

            {error && (
              <div className="error-card">
                <span className="material-symbols-outlined error-icon">error</span>
                <p>{error}</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. OUTLINE PANEL ==================== */}
        {activeTab === 'outline' && (
          <div className="outline-panel">
            <div className="outline-header">
              <span className="section-label">HEADINGS IN {activeFile}</span>
              <span className="outline-count">{outline.length} found</span>
            </div>

            {outline.length === 0 ? (
              <div className="outline-empty">
                <span className="material-symbols-outlined">format_list_bulleted</span>
                <p>No headings detected yet. Add # Headings to your markdown to see an interactive table of contents.</p>
              </div>
            ) : (
              <div className="outline-tree">
                {outline.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`outline-item level-${item.level}`}
                    onClick={() => onScrollToHeading(item.text)}
                    title={`Jump to "${item.text}" (Line ${item.lineNumber})`}
                  >
                    <span className="outline-hash">{'#'.repeat(item.level)}</span>
                    <span className="outline-text truncate">{item.text}</span>
                    <span className="outline-line">L{item.lineNumber}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. TEMPLATES PANEL ==================== */}
        {activeTab === 'templates' && (
          <div className="templates-panel">
            <div className="templates-intro">
              <div className="templates-intro-header">
                <span className="section-label">STARTER BLUEPRINTS</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="templates-count-badge">{filteredTemplates.length} presets</span>
                  {(openPresetTabs.length > 0 || currentPreviewPreset) && (
                    <button
                      type="button"
                      className="btn-exit-all-presets"
                      onClick={() => {
                        if (onClosePresetPreview) {
                          onClosePresetPreview()
                        } else if (onClosePresetTab && currentPreviewPreset?.id) {
                          onClosePresetTab(currentPreviewPreset.id)
                        }
                      }}
                      title="Exit preset preview mode and return to active document"
                    >
                      Exit Preview
                    </button>
                  )}
                </div>
              </div>
              <p className="templates-sub">Browse and live-preview production-ready blueprints before loading them into your editor.</p>
            </div>

            {/* Live Preview Active Banner */}
            {currentPreviewPreset && (
              <div className="templates-active-preview-card">
                <div className="active-preview-icon-box">
                  <span className="material-symbols-outlined pulse-icon">visibility</span>
                </div>
                <div className="active-preview-info">
                  <span className="active-preview-tag">LIVE PREVIEW ACTIVE</span>
                  <span className="active-preview-title truncate">{currentPreviewPreset.title}</span>
                </div>
                <button
                  type="button"
                  className="btn-active-preview-exit"
                  onClick={() => {
                    if (onClosePresetPreview) {
                      onClosePresetPreview()
                    } else if (onClosePresetTab) {
                      onClosePresetTab(currentPreviewPreset.id)
                    } else if (onPreviewTemplate) {
                      onPreviewTemplate(null)
                    }
                  }}
                  title="Close preset live preview and return to active document"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            )}

            {/* Search and Category Filter */}
            <div className="templates-filter-section">
              <div className="templates-search-box">
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  placeholder="Filter presets (e.g. FastAPI, Rust, AI)..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="templates-search-input"
                />
                {templateSearch && (
                  <button
                    type="button"
                    className="templates-search-clear"
                    onClick={() => setTemplateSearch('')}
                    title="Clear filter"
                  >
                    <span className="material-symbols-outlined icon-xs">close</span>
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="templates-category-pills custom-scrollbar" data-horizontal-scroll="true">
                {['All', 'Web App', 'Backend / API', 'Dev Tool', 'Frontend', 'AI / Machine Learning', 'Systems / Rust', 'Desktop App', 'Mobile App'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`template-cat-pill ${templateCategory === cat ? 'active' : ''}`}
                    onClick={() => setTemplateCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="templates-list">
              {filteredTemplates.length === 0 ? (
                <div className="templates-empty-search">
                  <span className="material-symbols-outlined">search_off</span>
                  <p>No presets found matching "{templateSearch}".</p>
                  <button
                    type="button"
                    className="btn-reset-template-filter"
                    onClick={() => {
                      setTemplateSearch('')
                      setTemplateCategory('All')
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredTemplates.map((tpl) => {
                  const isTabOpen = openPresetTabs.includes(tpl.id)
                  const isTabActive = activeFile === `preset:${tpl.id}`

                  return (
                    <div
                      key={tpl.id}
                      className={`template-card ${isTabActive ? 'is-previewing-card' : ''}`}
                    >
                      <div className="template-card-header">
                        <div className="template-title-wrap">
                          <span className="template-card-title">{tpl.title}</span>
                          {isTabOpen && (
                            <span className="template-live-badge" style={{ opacity: isTabActive ? 1 : 0.85 }}>
                              <span className="pulse-dot"></span>
                              {isTabActive ? 'Previewing' : 'Open in Tab'}
                            </span>
                          )}
                        </div>
                        <div className="template-header-badges">
                          <span className="template-category-badge">{tpl.category}</span>
                        </div>
                      </div>
                      <p className="template-card-desc">{tpl.description}</p>
                      <div className="template-tags">
                        {tpl.tags.map((t) => (
                          <span key={t} className="template-tag-pill">{t}</span>
                        ))}
                      </div>
                      <div className="template-card-actions">
                        <button
                          type="button"
                          className={`template-action-btn btn-preview ${isTabActive ? 'is-active' : ''}`}
                          onClick={() => {
                            if (isTabActive) {
                              if (onClosePresetTab) {
                                onClosePresetTab(tpl.id)
                              } else if (onTogglePresetPreview) {
                                onTogglePresetPreview(tpl)
                              }
                            } else if (onTogglePresetPreview) {
                              onTogglePresetPreview(tpl)
                            }
                          }}
                          title={isTabActive ? `Currently previewing "${tpl.title}" (Click to close tab)` : isTabOpen ? `Switch to "${tpl.title}" tab` : `Preview "${tpl.title}" in new tab`}
                        >
                          <span className="material-symbols-outlined">
                            {isTabActive ? 'visibility_off' : 'visibility'}
                          </span>
                          <span>{isTabActive ? 'Close Tab' : isTabOpen ? 'View Tab' : 'Preview'}</span>
                        </button>

                        <button
                          type="button"
                          className="template-action-btn btn-load"
                          onClick={() => {
                            if (onLoadPreset) {
                              onLoadPreset(tpl)
                            } else if (onLoadTemplate) {
                              onLoadTemplate(tpl.content, tpl.title)
                            }
                          }}
                          title={`Create a new document file from "${tpl.title}"`}
                        >
                          <span className="material-symbols-outlined">bolt</span>
                          <span>Load</span>
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ==================== 5. STUDIO TOOLS & BUILDERS PANEL ==================== */}
        {activeTab === 'tools' && (
          <div className="tools-panel">
            {/* Header info & Stats banner */}
            <div className="tools-intro">
              <div className="tools-intro-top">
                <span className="section-label">STUDIO WORKSPACE SUITE</span>
                <span className="tools-count-badge">
                  {openStudioTabs.length > 0 ? (
                    <>
                      <span className="pulse-dot-green" />
                      {openStudioTabs.length} active in tabs
                    </>
                  ) : (
                    `${studioToolsList.length} studios ready`
                  )}
                </span>
              </div>
              <p className="tools-sub">
                Interactive designers to visually assemble and configure badges, architecture flowcharts, tables, directory trees, and APIs.
              </p>

              {/* Search Bar */}
              <div className="templates-search-box" style={{ marginTop: '10px' }}>
                <span className="material-symbols-outlined search-icon">search</span>
                <input
                  type="text"
                  placeholder="Filter studios (e.g. diagrams, badges, tree, API)..."
                  value={studioSearch}
                  onChange={(e) => setStudioSearch(e.target.value)}
                  className="templates-search-input"
                />
                {studioSearch && (
                  <button
                    type="button"
                    className="templates-search-clear"
                    onClick={() => setStudioSearch('')}
                    title="Clear filter"
                  >
                    <span className="material-symbols-outlined icon-xs">close</span>
                  </button>
                )}
              </div>

              {/* Category Filter Pills (with mouse wheel horizontal scroll) */}
              <div className="templates-category-pills custom-scrollbar" data-horizontal-scroll="true" style={{ marginTop: '8px' }}>
                {studioCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`template-cat-pill ${studioCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setStudioCategory(cat.id)}
                  >
                    {cat.label} <span className="cat-pill-count">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Studio Tools Grid */}
            <div className="tools-grid-list">
              {filteredStudioTools.length === 0 ? (
                <div className="templates-empty-state">
                  <span className="material-symbols-outlined empty-icon">search_off</span>
                  <p className="empty-title">No Studio Tools Found</p>
                  <p className="empty-desc">No visual studios match your current filter query.</p>
                  <button
                    type="button"
                    className="template-reset-btn"
                    onClick={() => {
                      setStudioSearch('')
                      setStudioCategory('All')
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredStudioTools.map((tool) => {
                  const isOpen = openStudioTabs.includes(tool.id)
                  const isActive = activeFile === tool.id

                  return (
                    <div
                      key={tool.id}
                      className={`studio-tool-card ${isOpen ? 'is-open' : ''} ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        if (isOpen) {
                          onSelectFile(tool.id)
                        } else {
                          onOpenStudioTab(tool.id)
                        }
                      }}
                      title={isOpen ? `Switch to ${tool.title}` : `Open ${tool.title} tab`}
                    >
                      <div className="tool-card-top">
                        <div
                          className="tool-card-icon-wrap"
                          style={{
                            backgroundColor: `${tool.color}15`,
                            borderColor: `${tool.color}45`,
                            boxShadow: `0 0 14px ${tool.color}25`
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ color: tool.color }}>
                            {tool.icon}
                          </span>
                        </div>
                        <div className="tool-card-info">
                          <div className="tool-card-title-row">
                            <span className="tool-card-title">{tool.title}</span>
                            {isActive ? (
                              <span className="status-badge-active">
                                <span className="pulse-dot" /> Active
                              </span>
                            ) : isOpen ? (
                              <span className="status-badge-open">
                                <span className="pulse-dot-green" /> In Tabs
                              </span>
                            ) : (
                              <span className="status-badge-category">{tool.category}</span>
                            )}
                          </div>
                          <span className="tool-card-id">{tool.id}</span>
                        </div>
                      </div>

                      <p className="tool-card-desc">{tool.description}</p>

                      <div className="tool-card-features">
                        {tool.features.map((feat, i) => (
                          <span key={i} className="tool-feat-pill">
                            <span className="material-symbols-outlined icon-xs" style={{ color: tool.color }}>
                              auto_awesome
                            </span>
                            {feat}
                          </span>
                        ))}
                      </div>

                      <div className="tool-card-actions" onClick={(e) => e.stopPropagation()}>
                        {isOpen ? (
                          <>
                            <button
                              type="button"
                              className={`tool-action-btn primary ${isActive ? 'current' : ''}`}
                              onClick={() => onSelectFile(tool.id)}
                              title={isActive ? `Currently viewing ${tool.title}` : `Switch to ${tool.title} tab`}
                            >
                              <span className="material-symbols-outlined icon-xs">
                                {isActive ? 'visibility' : 'tab'}
                              </span>
                              {isActive ? 'Currently Active' : 'Switch to Tab'}
                            </button>
                            <button
                              type="button"
                              className="tool-action-btn remove-btn"
                              onClick={() => onCloseStudioTab(tool.id)}
                              title="Close tab from top bar"
                            >
                              <span className="material-symbols-outlined icon-xs">close</span>
                              Close Tab
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="tool-action-btn primary launch-btn"
                            onClick={() => onOpenStudioTab(tool.id)}
                            title="Open dedicated studio workspace tab in top bar"
                          >
                            <span className="material-symbols-outlined icon-xs">open_in_new</span>
                            Launch Studio Tab
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Resizer Handle */}
      <div
        className={`sidebar-resizer-handle ${isResizing ? 'is-dragging' : ''}`}
        onMouseDown={handleStartResize}
        onDoubleClick={handleResetResize}
        title="Drag to resize sidebar • Double-click to reset (300px)"
      />
    </aside>
  )
}
