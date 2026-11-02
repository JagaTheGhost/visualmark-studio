import { sanitizeSafeMediaUrl } from '../../../utils/securityUtils'
import React, { useState, useEffect, useMemo } from 'react'
import { CURATED_PACKS } from '../../../data/badgeStudioData'
import { cleanHexColor, escapeShieldsText, formatPackMarkdown, getStoredCustomPacks, deleteCustomPack } from '../../../utils/badgeEngine'

export default function CuratedPacksForm({
  selectedPackId,
  setSelectedPackId,
  style = 'for-the-badge',
  setStyle,
  packLayout = 'centered',
  setPackLayout,
  handleLoadPackIntoRack,
  onInsertBadge,
  repoUrl = ''
}) {
  const [customPacks, setCustomPacks] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Load user custom saved packs
  useEffect(() => {
    setCustomPacks(getStoredCustomPacks())
  }, [])

  // All packs combined
  const allPacks = useMemo(() => {
    return [...customPacks, ...CURATED_PACKS]
  }, [customPacks])

  // Category counts and taxonomy list
  const categoryOptions = useMemo(() => {
    const counts = {}
    allPacks.forEach((p) => {
      const cat = p.category || 'Other'
      counts[cat] = (counts[cat] || 0) + 1
    })

    const list = Object.keys(counts).map((name) => ({
      name,
      count: counts[name]
    }))

    // Sort categories alphabetically, keeping User Custom Packs at top if present
    list.sort((a, b) => {
      if (a.name === 'User Custom Packs') return -1
      if (b.name === 'User Custom Packs') return 1
      return a.name.localeCompare(b.name)
    })

    return list
  }, [allPacks])

  // Deep Multi-Attribute Search & Filter
  const filteredPacks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return allPacks.filter((pack) => {
      // 1. Category Filter
      if (selectedCategory !== 'all') {
        const pCat = pack.category || 'Other'
        if (selectedCategory === 'custom' && !pack.isCustom) return false
        if (selectedCategory !== 'custom' && pCat !== selectedCategory) return false
      }

      // 2. Search Query (Title, Description, Category, and individual Badges)
      if (q) {
        const titleMatch = (pack.title || '').toLowerCase().includes(q)
        const descMatch = (pack.desc || '').toLowerCase().includes(q)
        const catMatch = (pack.category || '').toLowerCase().includes(q)

        const badgeMatch = (pack.badges || []).some((b) => {
          const lMatch = (b.label || '').toLowerCase().includes(q)
          const mMatch = (b.message || '').toLowerCase().includes(q)
          const logoMatch = (b.logo || '').toLowerCase().includes(q)
          return lMatch || mMatch || logoMatch
        })

        if (!titleMatch && !descMatch && !catMatch && !badgeMatch) {
          return false
        }
      }

      return true
    })
  }, [allPacks, selectedCategory, searchQuery])

  // Delete custom pack handler
  const handleDeleteCustom = (packId, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this custom stack preset?')) {
      const updated = deleteCustomPack(packId)
      setCustomPacks(updated)
      if (selectedPackId === packId) {
        setSelectedPackId(CURATED_PACKS[0]?.id || 'pack-fullstack-next')
      }
    }
  }

  // Safe insert pack handler
  const handleInsert = (pack, e) => {
    e.stopPropagation()
    setSelectedPackId(pack.id)
    if (typeof onInsertBadge === 'function') {
      const md = formatPackMarkdown(pack, style, repoUrl, packLayout)
      onInsertBadge(md)
    }
  }

  // Clear all filters helper
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
  }

  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'all'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Omnibox Tech Search Bar */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span
          className="material-symbols-outlined"
          style={{
            position: 'absolute',
            left: '11px',
            fontSize: '17px',
            color: 'var(--text-muted)',
            pointerEvents: 'none'
          }}
        >
          search
        </span>
        <input
          type="text"
          className="studio-text-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search stacks or tech (e.g. Next.js, PyTorch, Docker, Rust)..."
          style={{
            paddingLeft: '34px',
            paddingRight: searchQuery ? '32px' : '10px',
            width: '100%',
            height: '32px',
            fontSize: '12px'
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            title="Clear search"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
              close
            </span>
          </button>
        )}
      </div>

      {/* 2. Compact Control Deck: Category Dropdown + Style + Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '8px',
          alignItems: 'flex-end',
          backgroundColor: 'var(--surface-sunken)',
          padding: '8px 10px',
          borderRadius: 'var(--radius-xs, 6px)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Category Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <label
            style={{
              fontSize: '9.5px',
              color: 'var(--text-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>
              folder_open
            </span>
            <span>Category</span>
          </label>
          <select
            className="studio-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              height: '26px',
              fontSize: '11px',
              padding: '0 6px',
              backgroundColor: 'var(--surface-base)'
            }}
          >
            <option value="all">All Stacks ({allPacks.length})</option>
            {customPacks.length > 0 && (
              <option value="custom">User Custom Stacks ({customPacks.length})</option>
            )}
            {categoryOptions.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* Badge Style Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <label
            style={{
              fontSize: '9.5px',
              color: 'var(--text-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>
              palette
            </span>
            <span>Style</span>
          </label>
          <div
            style={{
              display: 'flex',
              gap: '2px',
              background: 'var(--surface-base)',
              padding: '2px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)'
            }}
          >
            {[
              { id: 'for-the-badge', label: 'Bold', title: 'For The Badge (Bold uppercase)' },
              { id: 'flat-square', label: 'Square', title: 'Flat Square (90° technical)' },
              { id: 'flat', label: 'Flat', title: 'Modern Flat (Rounded corners)' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStyle && setStyle(st.id)}
                title={st.title}
                style={{
                  height: '22px',
                  padding: '0 7px',
                  fontSize: '10px',
                  fontWeight: style === st.id ? 600 : 400,
                  background: style === st.id ? 'var(--primary, #6366f1)' : 'transparent',
                  color: style === st.id ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Output Layout Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <label
            style={{
              fontSize: '9.5px',
              color: 'var(--text-muted)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>
              view_agenda
            </span>
            <span>Layout</span>
          </label>
          <div
            style={{
              display: 'flex',
              gap: '2px',
              background: 'var(--surface-base)',
              padding: '2px',
              borderRadius: '4px',
              border: '1px solid var(--border-color)'
            }}
          >
            {[
              { id: 'centered', icon: 'format_align_center', title: 'Centered Banner (<div align="center">)' },
              { id: 'inline', icon: 'view_week', title: 'Inline Row (Space-separated)' },
              { id: 'table', icon: 'table_chart', title: 'Markdown Table Matrix' }
            ].map((lo) => (
              <button
                key={lo.id}
                type="button"
                onClick={() => setPackLayout && setPackLayout(lo.id)}
                title={lo.title}
                style={{
                  height: '22px',
                  width: '24px',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: packLayout === lo.id ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: packLayout === lo.id ? 'var(--secondary, #38bdf8)' : 'var(--text-muted)',
                  border: packLayout === lo.id ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                  {lo.icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Filter Summary & Count Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '10.5px',
          color: 'var(--text-muted)',
          padding: '0 2px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{filteredPacks.length}</strong> of {allPacks.length} stacks
          </span>
          {isFiltered && (
            <span
              style={{
                fontSize: '9.5px',
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--secondary, #38bdf8)'
              }}
            >
              Filtered
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleClearFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '10.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              padding: '1px 4px'
            }}
            title="Reset filters and show all stacks"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
              restart_alt
            </span>
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* 4. Filtered Stacks Card Feed */}
      <div className="badge-pack-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredPacks.map((pack) => {
          const isSelected = selectedPackId === pack.id
          const isCustom = pack.isCustom

          return (
            <div
              key={pack.id}
              className={`badge-pack-card ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedPackId(pack.id)}
              title={`Click to preview ${pack.title} in the Live Canvas`}
              style={{
                backgroundColor: 'var(--surface-base)',
                border: isSelected ? '1px solid var(--primary, #6366f1)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xs, 6px)',
                padding: '11px 13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Stack Header */}
              <div
                className="badge-pack-header"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                  <span
                    className="badge-pack-title"
                    style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--text-primary)' }}
                  >
                    {pack.title}
                  </span>
                  {isCustom && (
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: 'rgba(236, 72, 153, 0.2)',
                        color: '#f472b6',
                        fontWeight: 600
                      }}
                    >
                      Custom
                    </span>
                  )}
                  {isSelected && (
                    <span
                      className="studio-tag"
                      style={{
                        fontSize: '9.5px',
                        padding: '1px 7px',
                        background: 'rgba(99, 102, 241, 0.2)',
                        color: '#818cf8',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>
                        visibility
                      </span>
                      <span>Active Preview</span>
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '9.5px',
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--surface-sunken)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {pack.badges?.length || 0} badges
                  </span>
                  <span
                    className="badge-pack-count"
                    style={{
                      fontSize: '9.5px',
                      color: 'var(--secondary, #38bdf8)',
                      backgroundColor: 'rgba(56, 189, 248, 0.1)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {pack.category}
                  </span>
                  {isCustom && (
                    <button
                      type="button"
                      className="btn-rack-mini delete"
                      onClick={(e) => handleDeleteCustom(pack.id, e)}
                      title="Delete this custom preset"
                      style={{ height: '20px', width: '20px' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                        delete
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {pack.desc && (
                <span
                  className="badge-pack-desc"
                  style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}
                >
                  {pack.desc}
                </span>
              )}

              {/* Dynamic Badges preview rack rendered with active style */}
              <div
                className="badge-pack-preview-rack"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px',
                  padding: '7px 8px',
                  backgroundColor: 'var(--surface-sunken)',
                  borderRadius: '4px'
                }}
              >
                {(pack.badges || []).map((b, idx) => {
                  const bC = cleanHexColor(b.color || '6366f1')
                  const bL = escapeShieldsText(b.label)
                  const bM = escapeShieldsText(b.message || '')
                  const bStyle = encodeURIComponent(style || b.style || 'for-the-badge')
                  let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${bC}?style=${bStyle}`
                  if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
                  const safeSrc = sanitizeSafeMediaUrl(bUrl)
                  return (
                    <img
                      key={idx}
                      src={safeSrc}
                      alt={`${b.label} ${b.message || ''}`}
                      style={{
                        height: bStyle === 'for-the-badge' ? '22px' : '18px',
                        maxWidth: '100%',
                        transition: 'height 0.12s ease'
                      }}
                      onError={(e) => {
                        e.target.style.opacity = '0.5'
                      }}
                    />
                  )
                })}
              </div>

              {/* Actions Footer */}
              <div className="badge-pack-actions" style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (typeof handleLoadPackIntoRack === 'function') {
                      handleLoadPackIntoRack(pack)
                    }
                  }}
                  style={{ height: '26px', fontSize: '11px', flex: 1, justifyContent: 'center' }}
                  title="Load this pack into Rack Editor for custom reordering, editing, or additions"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                    edit
                  </span>
                  <span>Customize in Rack</span>
                </button>
                <button
                  type="button"
                  className="btn-studio-primary"
                  onClick={(e) => handleInsert(pack, e)}
                  style={{ height: '26px', fontSize: '11px', flex: 1, justifyContent: 'center' }}
                  title={`Insert ${pack.title} into your README document`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                    add_circle
                  </span>
                  <span>Insert Stack</span>
                </button>
              </div>
            </div>
          )
        })}

        {/* Empty Search State */}
        {filteredPacks.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '36px 16px',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--surface-sunken)',
              borderRadius: 'var(--radius-xs, 6px)',
              border: '1px dashed var(--border-color)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--text-muted)' }}>
              manage_search
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              No tech stacks found
            </span>
            <span style={{ fontSize: '11px', maxWidth: '280px', lineHeight: 1.4 }}>
              No presets matched {searchQuery ? `"${searchQuery}"` : ''}{' '}
              {selectedCategory !== 'all' ? `in ${selectedCategory}` : ''}.
            </span>
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={handleClearFilters}
              style={{ marginTop: '6px', fontSize: '11px', height: '26px' }}
            >
              Reset search & filter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
