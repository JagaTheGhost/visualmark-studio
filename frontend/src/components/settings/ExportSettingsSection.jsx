import React from 'react'

export default function ExportSettingsSection({
  activeCategory,
  matchesSearch,
  badgeStyle,
  handleBadgeStyleChange,
  pdfPageSize,
  handlePdfPageSizeChange
}) {
  if (activeCategory !== 'all' && activeCategory !== 'files') return null

  return (
    <section className="settings-group-section">
      <div className="settings-group-header">
        <span className="material-symbols-outlined">folder</span>
        <h3>Files & Exporting</h3>
      </div>

      {/* Badge Style */}
      {matchesSearch('badge style shields flat') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Shields.io: Default Badge Style</div>
            <div className="settings-card-sublabel">Aesthetic appearance used when inserting dynamic repository badges.</div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={badgeStyle}
              onChange={(e) => handleBadgeStyleChange(e.target.value)}
            >
              <option value="flat-square">flat-square (Modern Developer)</option>
              <option value="flat">flat (Classic Rounded)</option>
              <option value="for-the-badge">for-the-badge (Bold Uppercase)</option>
              <option value="plastic">plastic (Glossy)</option>
            </select>
          </div>
        </div>
      )}

      {/* PDF Paper Size */}
      {matchesSearch('pdf export paper size a4 letter') && (
        <div className="settings-card">
          <div className="settings-card-info">
            <div className="settings-card-label">Export: PDF Paper Size</div>
            <div className="settings-card-sublabel">Standard page format used when generating printable PDF documents.</div>
          </div>
          <div className="settings-card-control">
            <select
              className="settings-input-select"
              value={pdfPageSize}
              onChange={(e) => handlePdfPageSizeChange(e.target.value)}
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">US Letter (8.5 × 11 in)</option>
            </select>
          </div>
        </div>
      )}
    </section>
  )
}
