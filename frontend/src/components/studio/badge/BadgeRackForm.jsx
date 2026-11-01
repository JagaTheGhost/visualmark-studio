import React, { useState } from 'react'
import { BADGE_STYLES, COLOR_THEMES } from '../../../data/badgeStudioData'
import { getRackBadgeUrl, saveCustomPack } from '../../../utils/badgeEngine'

export default function BadgeRackForm({
  rackBadges = [],
  setRackBadges,
  style = 'for-the-badge',
  setActiveMode,
  onSwitchToSingle,
  handleRemoveRackBadge,
  rackLayout,
  setRackLayout,
  handleApplyStyleToRack,
  handleApplyThemeToRack,
  onEditBadgeInSingle
}) {
  const [saveName, setSaveName] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showSaveInput, setShowSaveInput] = useState(false)

  const goToSingle = () => {
    if (typeof onSwitchToSingle === 'function') {
      onSwitchToSingle()
    } else if (typeof setActiveMode === 'function') {
      setActiveMode('single')
    }
  }

  // Move badge Up in rack
  const handleMoveUp = (index) => {
    if (index <= 0) return
    setRackBadges((prev) => {
      const copy = [...prev]
      const temp = copy[index - 1]
      copy[index - 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  // Move badge Down in rack
  const handleMoveDown = (index) => {
    if (index >= rackBadges.length - 1) return
    setRackBadges((prev) => {
      const copy = [...prev]
      const temp = copy[index + 1]
      copy[index + 1] = copy[index]
      copy[index] = temp
      return copy
    })
  }

  // Duplicate badge in rack
  const handleDuplicate = (badge, index) => {
    const copy = {
      ...badge,
      id: `${Date.now()}_dup_${index}`
    }
    setRackBadges((prev) => {
      const next = [...prev]
      next.splice(index + 1, 0, copy)
      return next
    })
  }

  // Clear all badges
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all badges from the rack?')) {
      setRackBadges([])
    }
  }

  // Save current rack as a custom pack
  const handleSaveAsPreset = () => {
    if (!saveName.trim() || !rackBadges.length) return
    const res = saveCustomPack(saveName.trim(), rackBadges)
    if (res) {
      setSaveSuccess(true)
      setSaveName('')
      setShowSaveInput(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  return (
    <div className="badge-rack-container" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Configured Badges List with Reordering */}
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">
            Configured Badges Rack ({rackBadges.length} Active)
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={goToSingle}
              style={{ height: '26px', fontSize: '11px', padding: '0 8px' }}
              title="Design and add a new badge"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
              <span>Create New</span>
            </button>
            {rackBadges.length > 0 && (
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={handleClearAll}
                style={{ height: '26px', fontSize: '11px', padding: '0 8px', color: '#f87171' }}
                title="Clear all badges"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete_sweep</span>
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="badge-rack-list custom-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '340px', overflowY: 'auto' }}>
          {rackBadges.map((b, idx) => {
            const bUrl = getRackBadgeUrl(b, style)

            return (
              <div
                key={b.id || idx}
                className="badge-rack-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  backgroundColor: 'var(--surface-base)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xs, 6px)',
                  gap: '10px'
                }}
              >
                <div className="badge-rack-item-left" style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: '16px' }}>
                    #{idx + 1}
                  </span>
                  <img
                    src={bUrl}
                    alt={`${b.label} ${b.message}`}
                    className="badge-rack-img"
                    style={{ height: '24px', maxWidth: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.style.opacity = '0.5' }}
                  />
                </div>

                <div className="badge-rack-item-actions" style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                  {/* Move Up */}
                  <button
                    type="button"
                    className="btn-rack-mini"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    title="Move up"
                    style={{ opacity: idx === 0 ? 0.3 : 1 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
                  </button>
                  {/* Move Down */}
                  <button
                    type="button"
                    className="btn-rack-mini"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === rackBadges.length - 1}
                    title="Move down"
                    style={{ opacity: idx === rackBadges.length - 1 ? 0.3 : 1 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_downward</span>
                  </button>
                  {/* Duplicate */}
                  <button
                    type="button"
                    className="btn-rack-mini"
                    onClick={() => handleDuplicate(b, idx)}
                    title="Duplicate badge"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>content_copy</span>
                  </button>
                  {/* Edit in Single Designer */}
                  {typeof onEditBadgeInSingle === 'function' && (
                    <button
                      type="button"
                      className="btn-rack-mini"
                      onClick={() => onEditBadgeInSingle(b)}
                      title="Edit badge properties in Single Designer"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                    </button>
                  )}
                  {/* Delete */}
                  <button
                    type="button"
                    className="btn-rack-mini delete"
                    onClick={() => handleRemoveRackBadge(b.id)}
                    title="Remove badge from rack"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                  </button>
                </div>
              </div>
            )
          })}

          {rackBadges.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '11px', background: 'var(--surface-lowest)', borderRadius: 'var(--radius-xs)' }}>
              No badges in your rack yet. Switch to "Single" or "Packs" to add badges to your tech rack.
            </div>
          )}
        </div>
      </div>

      {/* 2. Layout Structure Alignment */}
      <div className="studio-section">
        <label className="studio-section-label">Rack Markdown Layout Structure</label>
        <div className="studio-segmented-styles" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
          <button
            type="button"
            className={`studio-style-btn ${rackLayout === 'center-div' ? 'active' : ''}`}
            onClick={() => setRackLayout('center-div')}
          >
            📐 Centered HTML Grid
          </button>
          <button
            type="button"
            className={`studio-style-btn ${rackLayout === 'paragraph' ? 'active' : ''}`}
            onClick={() => setRackLayout('paragraph')}
          >
            📄 Centered Paragraph
          </button>
          <button
            type="button"
            className={`studio-style-btn ${rackLayout === 'table' ? 'active' : ''}`}
            onClick={() => setRackLayout('table')}
          >
            📊 Markdown Table
          </button>
          <button
            type="button"
            className={`studio-style-btn ${rackLayout === 'inline' ? 'active' : ''}`}
            onClick={() => setRackLayout('inline')}
          >
            🔗 Inline Row
          </button>
        </div>
      </div>

      {/* 3. Batch Style & Theme Operations */}
      <div className="studio-section">
        <label className="studio-section-label">Batch Operations for Entire Rack</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Apply Geometry Style to All:
            </span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {BADGE_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className="studio-style-btn"
                  onClick={() => handleApplyStyleToRack(st.id)}
                  style={{ fontSize: '10px', padding: '3px 7px' }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Apply Theme Color Palette to All:
            </span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {COLOR_THEMES.slice(0, 8).map((th) => (
                <button
                  key={th.id}
                  type="button"
                  className="studio-style-btn"
                  onClick={() => handleApplyThemeToRack(th)}
                  style={{ fontSize: '10px', padding: '3px 7px' }}
                >
                  {th.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Save Rack as Custom Preset */}
      {rackBadges.length > 0 && (
        <div className="studio-section">
          <div className="studio-section-header">
            <label className="studio-section-label">Save Rack as Custom Preset</label>
            {!showSaveInput && (
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={() => setShowSaveInput(true)}
                style={{ height: '24px', fontSize: '10.5px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>bookmark_add</span>
                <span>Save Stack</span>
              </button>
            )}
          </div>

          {showSaveInput && (
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
              <input
                type="text"
                className="studio-text-input"
                placeholder="Stack name (e.g. My Next.js 15 AI Stack)..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn-studio-primary"
                onClick={handleSaveAsPreset}
                disabled={!saveName.trim()}
                style={{ height: '32px', fontSize: '11px', padding: '0 12px' }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={() => setShowSaveInput(false)}
                style={{ height: '32px', fontSize: '11px', padding: '0 8px' }}
              >
                Cancel
              </button>
            </div>
          )}

          {saveSuccess && (
            <div style={{ fontSize: '11px', color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>check_circle</span>
              <span>Saved to My Custom Packs! Viewable in Packs tab.</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
