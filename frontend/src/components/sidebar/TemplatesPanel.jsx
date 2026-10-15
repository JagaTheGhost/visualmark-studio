import React, { useState, useMemo } from 'react'
import { PRESET_TEMPLATES } from '../../data/presetTemplates'

export default function TemplatesPanel({
  openPresetTabs = [],
  currentPreviewPreset = null,
  activeFile = null,
  onClosePresetPreview = () => {},
  onClosePresetTab = () => {},
  onPreviewTemplate = () => {},
  onTogglePresetPreview = () => {},
  onLoadPreset = () => {},
  onLoadTemplate = () => {}
}) {
  const [templateCategory, setTemplateCategory] = useState('All')
  const [templateSearch, setTemplateSearch] = useState('')

  const filteredTemplates = useMemo(() => {
    return PRESET_TEMPLATES.filter((tpl) => {
      const matchesCat = templateCategory === 'All' || tpl.category === templateCategory
      const query = templateSearch.trim().toLowerCase()
      if (!query) return matchesCat
      const matchesQuery =
        tpl.title.toLowerCase().includes(query) ||
        tpl.description.toLowerCase().includes(query) ||
        tpl.tags.some((t) => t.toLowerCase().includes(query)) ||
        tpl.category.toLowerCase().includes(query)
      return matchesCat && matchesQuery
    })
  }, [templateCategory, templateSearch])

  return (
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
  )
}
