import React, { useState } from 'react'
import { GITHUB_METRICS, BADGE_STYLES } from '../../../data/badgeStudioData'

export default function GithubMetricsForm({
  customRepo,
  cleanRepo = 'facebook/react',
  setCustomRepo,
  selectedMetrics = [],
  toggleAllMetrics,
  toggleMetric,
  githubMetricsStyle = 'for-the-badge',
  setGithubMetricsStyle,
  ciWorkflow = 'ci.yml',
  setCiWorkflow
}) {
  const [metricFilter, setMetricFilter] = useState('all')

  const isActionsSelected = selectedMetrics.includes('actions')

  const filteredMetrics = metricFilter === 'all'
    ? GITHUB_METRICS
    : metricFilter === 'core'
    ? GITHUB_METRICS.filter((m) => ['stars', 'forks', 'issues', 'prs', 'license', 'release'].includes(m.id))
    : GITHUB_METRICS.filter((m) => ['actions', 'last-commit', 'contributors', 'repo-size', 'languages-top'].includes(m.id))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Target Repository */}
      <div className="studio-section">
        <label className="studio-section-label">Target GitHub Repository</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            className="studio-text-input"
            value={customRepo}
            onChange={(e) => setCustomRepo(e.target.value)}
            placeholder="owner/repo (e.g. facebook/react)"
            style={{ flex: 1 }}
          />
        </div>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Currently previewing: <strong style={{ color: 'var(--text-primary)' }}>{cleanRepo}</strong>
        </span>
      </div>

      {/* 2. Live Metrics Selection */}
      <div className="studio-section">
        <div className="studio-section-header">
          <label className="studio-section-label">
            Repository Metric Shields ({selectedMetrics.length} Active)
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              type="button"
              className="studio-style-btn"
              onClick={toggleAllMetrics}
              style={{ fontSize: '9.5px', padding: '2px 7px' }}
            >
              {selectedMetrics.length === GITHUB_METRICS.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          <button
            type="button"
            className={`badge-icon-cat-btn ${metricFilter === 'all' ? 'active' : ''}`}
            onClick={() => setMetricFilter('all')}
            style={{ fontSize: '9.5px', padding: '2px 7px' }}
          >
            All Metrics
          </button>
          <button
            type="button"
            className={`badge-icon-cat-btn ${metricFilter === 'core' ? 'active' : ''}`}
            onClick={() => setMetricFilter('core')}
            style={{ fontSize: '9.5px', padding: '2px 7px' }}
          >
            Core Essentials
          </button>
          <button
            type="button"
            className={`badge-icon-cat-btn ${metricFilter === 'activity' ? 'active' : ''}`}
            onClick={() => setMetricFilter('activity')}
            style={{ fontSize: '9.5px', padding: '2px 7px' }}
          >
            Activity & Health
          </button>
        </div>

        <div className="badge-github-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {filteredMetrics.map((metric) => {
            const isChecked = selectedMetrics.includes(metric.id)
            return (
              <div
                key={metric.id}
                className={`badge-metric-card ${isChecked ? 'active' : ''}`}
                onClick={() => toggleMetric(metric.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: isChecked ? 'rgba(99, 102, 241, 0.12)' : 'var(--surface-base)',
                  border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-xs, 6px)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  className="badge-metric-checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  style={{ cursor: 'pointer' }}
                />
                <div className="badge-metric-details" style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="badge-metric-title" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {metric.title}
                  </span>
                  <span className="badge-metric-endpoint" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    /github/{metric.path}/...
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Workflow file input if CI Actions selected */}
        {isActionsSelected && (
          <div style={{ marginTop: '10px', padding: '10px', background: 'var(--surface-base)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
              GitHub Actions Workflow File
            </span>
            <input
              type="text"
              className="studio-text-input"
              value={ciWorkflow || 'ci.yml'}
              onChange={(e) => setCiWorkflow && setCiWorkflow(e.target.value)}
              placeholder="e.g. ci.yml, test.yml, build.yml"
            />
          </div>
        )}
      </div>

      {/* 3. Metric Badge Geometry */}
      <div className="studio-section">
        <label className="studio-section-label">Metric Badge Geometry</label>
        <div className="studio-segmented-styles" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
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
