import React from 'react'

export default function ComparisonForm({
  compTitle1,
  setCompTitle1,
  compUrl1,
  setCompUrl1,
  compTitle2,
  setCompTitle2,
  compUrl2,
  setCompUrl2
}) {
  return (
    <div className="studio-section">
      <label className="studio-section-label">Side-by-Side Comparison Grid</label>
      <div className="studio-input-duo">
        <div className="studio-field">
          <span className="studio-field-label">Left Column Title</span>
          <input
            type="text"
            className="studio-text-input"
            value={compTitle1}
            onChange={(e) => setCompTitle1(e.target.value)}
          />
        </div>
        <div className="studio-field">
          <span className="studio-field-label">Right Column Title</span>
          <input
            type="text"
            className="studio-text-input"
            value={compTitle2}
            onChange={(e) => setCompTitle2(e.target.value)}
          />
        </div>
      </div>

      <div className="studio-field">
        <span className="studio-field-label">Left Image URL</span>
        <input
          type="text"
          className="studio-text-input"
          value={compUrl1}
          onChange={(e) => setCompUrl1(e.target.value)}
        />
      </div>

      <div className="studio-field">
        <span className="studio-field-label">Right Image URL</span>
        <input
          type="text"
          className="studio-text-input"
          value={compUrl2}
          onChange={(e) => setCompUrl2(e.target.value)}
        />
      </div>
    </div>
  )
}
