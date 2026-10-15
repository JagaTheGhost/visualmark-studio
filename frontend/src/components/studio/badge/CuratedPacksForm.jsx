import React from 'react'
import { CURATED_PACKS } from '../../../data/badgeStudioData'
import { escapeShieldsText } from '../../../utils/modernRepoCardEngine'

export default function CuratedPacksForm({
  selectedPackId,
  setSelectedPackId,
  style,
  handleLoadPackIntoRack,
  onInsertBadge,
  getPackMarkdown
}) {
  return (
    <div className="badge-pack-grid">
      {CURATED_PACKS.map((pack) => {
        const isSelected = selectedPackId === pack.id
        return (
          <div
            key={pack.id}
            className={`badge-pack-card ${isSelected ? 'active' : ''}`}
            onClick={() => setSelectedPackId(pack.id)}
            title={`Click to preview ${pack.title} in the Live Canvas`}
          >
            <div className="badge-pack-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-pack-title">{pack.title}</span>
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
                    <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>visibility</span>
                    <span>Active Preview</span>
                  </span>
                )}
              </div>
              <span className="badge-pack-count">{pack.category}</span>
            </div>
            <span className="badge-pack-desc">{pack.desc}</span>

            <div className="badge-pack-preview-rack">
              {pack.badges.map((b, idx) => {
                const bL = escapeShieldsText(b.label)
                const bM = escapeShieldsText(b.message)
                let bUrl = `https://img.shields.io/badge/${bL}-${bM}-${b.color}?style=${b.style || style}`
                if (b.logo) bUrl += `&logo=${encodeURIComponent(b.logo)}&logoColor=white`
                return (
                  <img
                    key={idx}
                    src={bUrl}
                    alt={`${b.label} ${b.message}`}
                    style={{ height: '20px' }}
                  />
                )
              })}
            </div>

            <div className="badge-pack-actions">
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLoadPackIntoRack(pack)
                }}
                style={{ height: '26px', fontSize: '10.5px' }}
                title="Load this pack into Rack Editor for custom rearranging and badge additions"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit</span>
                <span>Customize in Rack</span>
              </button>
              <button
                type="button"
                className="btn-studio-primary"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPackId(pack.id)
                  onInsertBadge(getPackMarkdown(pack))
                }}
                style={{ height: '26px', fontSize: '10.5px' }}
                title={`Insert ${pack.title} into your document or table`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add_circle</span>
                <span>Insert Pack into Document</span>
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
