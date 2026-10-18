import React from 'react'

export default function TabBarControls({
  activeFile,
  isStudioTabActive,
  viewMode,
  setViewMode,
  orientation,
  setOrientation,
  zoomLevel,
  handleZoomToggle
}) {
  return (
    <div className="tab-controls-right">

      {activeFile && activeFile.startsWith('preset:') ? (
        /* Locked in Preview Mode for Preset blueprint comparison */
        <div className="preset-locked-mode-indicator" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#10b981' }}>visibility</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>Preview Only</span>
          <button
            type="button"
            className="btn-tab-ctrl zoom-badge"
            onClick={handleZoomToggle}
            title="Zoom Level (Click to cycle 90% / 100% / 115%)"
          >
            {zoomLevel}%
          </button>
        </div>
      ) : !isStudioTabActive && activeFile ? (
        <>
          {/* Split Orientation Toggle (moved to left of Split pill per request) */}
          {viewMode === 'split' && (
            <button
              type="button"
              className={`btn-tab-ctrl orientation-toggle-btn ${orientation === 'horizontal' ? 'is-horizontal' : 'is-vertical'}`}
              onClick={() => setOrientation((prev) => prev === 'horizontal' ? 'vertical' : 'horizontal')}
              title={
                orientation === 'horizontal'
                  ? 'Current: Stacked. Click for Side-by-Side'
                  : 'Current: Side-by-Side. Click for Stacked'
              }
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {orientation === 'horizontal' ? 'table_rows' : 'view_column'}
              </span>
              <span className="orientation-btn-text">
                {orientation === 'horizontal' ? 'Stacked' : 'Side-by-Side'}
              </span>
            </button>
          )}

          {/* View Mode Segmented Pill */}
          <div className="view-mode-segmented">
            <button
              type="button"
              className={`view-mode-pill ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => setViewMode('split')}
              title="Split View"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 3h12v10H2V3zm1 1v8h4.5V4H3zm5.5 0v8H13V4H8.5z"/>
              </svg>
              <span>Split</span>
            </button>

            <button
              type="button"
              className={`view-mode-pill ${viewMode === 'editor' ? 'active' : ''}`}
              onClick={() => setViewMode('editor')}
              title="Editor Only"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
              </svg>
              <span>Editor</span>
            </button>

            <button
              type="button"
              className={`view-mode-pill ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
              title="Preview Only"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>
              </svg>
              <span>Preview</span>
            </button>
          </div>

          {/* Zoom Badge */}
          <button
            type="button"
            className="btn-tab-ctrl zoom-badge"
            onClick={handleZoomToggle}
            title="Zoom Level (Click to cycle 90% / 100% / 115%)"
          >
            {zoomLevel}%
          </button>
        </>
      ) : null}
    </div>
  )
}
