import React, { useState, useMemo } from 'react'
import { PRESET_TEMPLATES } from './diagramConstants'

export default function PresetCatalogModal({
  isOpen,
  onClose,
  onSelectPreset
}) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(() => {
    const set = new Set(['All'])
    PRESET_TEMPLATES.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [])

  const filteredPresets = useMemo(() => {
    return PRESET_TEMPLATES.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query)
      return matchCat && matchQuery
    })
  }, [selectedCategory, searchQuery])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '95vw',
          maxWidth: '1000px',
          maxHeight: '85vh',
          background: 'var(--surface-base, #10141a)',
          border: '1px solid var(--border-color, #30363d)',
          borderRadius: '8px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: 'var(--surface-low, #161b22)',
            borderBottom: '1px solid var(--border-color, #30363d)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#818cf8' }}>hub</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>
                Architecture & Diagram Blueprints Catalog
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                24+ production blueprints across Cloud, Microservices, Security, Databases, Git, and AI Pipelines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="diagram-modal-close-btn"
            style={{ width: '28px', height: '28px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--surface-lowest, #0a0e14)',
            borderBottom: '1px solid var(--border-color, #30363d)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <span
              className="material-symbols-outlined"
              style={{ position: 'absolute', left: '8px', top: '7px', fontSize: '16px', color: '#64748b' }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Search blueprints by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="studio-text-input"
              style={{ width: '100%', paddingLeft: '30px', fontSize: '11.5px', padding: '6px 8px 6px 30px' }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`diagram-quick-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '4px 9px',
                  fontSize: '11px',
                  background: selectedCategory === cat ? '#6366f1' : 'transparent',
                  color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                  borderColor: selectedCategory === cat ? '#6366f1' : 'var(--border-color)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blueprints Grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '12px'
          }}
        >
          {filteredPresets.map((preset) => (
            <div
              key={preset.id}
              style={{
                background: 'var(--surface-base, #10141a)',
                border: '1px solid var(--border-color, #30363d)',
                borderRadius: '6px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                transition: 'border-color 0.15s ease, transform 0.15s ease',
                cursor: 'pointer'
              }}
              onClick={() => {
                onSelectPreset(preset)
                onClose()
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#818cf8'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color, #30363d)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '9.5px',
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#818cf8',
                      border: '1px solid rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {preset.category}
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '9.5px',
                      color: '#64748b'
                    }}
                  >
                    {preset.type}
                  </span>
                </div>

                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
                  {preset.title}
                </h4>

                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
                  {preset.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>
                  {preset.code.split('\n').length} lines
                </span>
                <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Load Blueprint <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                </span>
              </div>
            </div>
          ))}

          {filteredPresets.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
              No blueprints matched your filter "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
