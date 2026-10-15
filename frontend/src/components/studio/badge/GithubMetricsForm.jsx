import React from 'react'
import { GITHUB_METRICS, BADGE_STYLES } from '../../../data/badgeStudioData'

export default function GithubMetricsForm({
  customRepo,
  cleanRepo,
  setCustomRepo,
  selectedMetrics,
  toggleAllMetrics,
  toggleMetric,
  githubMetricsStyle,
  setGithubMetricsStyle
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="studio-section">
        <label className="studio-section-label">Target GitHub Repository</label>
        <input
          type="text"
          className="studio-text-input"
          value={customRepo || cleanRepo}
          onChange={(e) => setCustomRepo(e.target.value)}
          placeholder="owner/repo (e.g. facebook/react)"
        />
      </div>

      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">
            Live Shields.io Metrics ({selectedMetrics.length} selected)
          </label>
          <button
            type="button"
            className="studio-style-btn"
            onClick={toggleAllMetrics}
            style={{ fontSize: '9.5px', padding: '1px 6px' }}
          >
            {selectedMetrics.length === GITHUB_METRICS.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="badge-github-metrics-grid">
          {GITHUB_METRICS.map((metric) => {
            const isChecked = selectedMetrics.includes(metric.id)
            return (
              <div
                key={metric.id}
                className={`badge-metric-card ${isChecked ? 'active' : ''}`}
                onClick={() => toggleMetric(metric.id)}
              >
                <input
                  type="checkbox"
                  className="badge-metric-checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                />
                <div className="badge-metric-details">
                  <span className="badge-metric-title">{metric.title}</span>
                  <span className="badge-metric-endpoint">/github/{metric.path}/...</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="studio-section">
        <label className="studio-section-label">Metric Badge Geometry</label>
        <div className="studio-segmented-styles">
          {BADGE_STYLES.map((st) => (
            <button
              key={st.id}
              type="button"
              className={`studio-style-btn ${githubMetricsStyle === st.id ? 'active' : ''}`}
              onClick={() => setGithubMetricsStyle(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
