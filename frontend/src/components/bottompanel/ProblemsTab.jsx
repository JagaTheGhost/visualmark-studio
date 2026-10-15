import React, { useMemo } from 'react'

export default function ProblemsTab({
  activeFile = 'README.md',
  filteredProblems = [],
  onSelectProblem = () => {},
  onRemoveProblem = () => {},
  onClearProblems = () => {}
}) {
  // Group problems by file or category
  const groupedProblems = useMemo(() => {
    const groups = new Map()
    for (const p of filteredProblems) {
      let groupKey = p.file || activeFile || 'Workspace'
      // If p.source indicates Git, System, or Workspace, and p.file is default or not a specific path
      if (!p.file || p.file === 'Workspace') {
        if (p.source && ['GIT', 'Git'].includes(p.source)) {
          groupKey = 'Git / Source Control'
        } else if (p.source && ['EXPORT', 'Export'].includes(p.source)) {
          groupKey = 'Export & Render'
        } else if (p.source && ['UPDATE', 'Update'].includes(p.source)) {
          groupKey = 'App Updates'
        } else {
          groupKey = 'Workspace Diagnostics'
        }
      }

      if (!groups.has(groupKey)) {
        groups.set(groupKey, [])
      }
      groups.get(groupKey).push(p)
    }
    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      items
    }))
  }, [filteredProblems, activeFile])

  if (filteredProblems.length === 0) {
    return (
      <div className="panel-problems-view custom-scrollbar">
        <div className="problems-empty-state">
          <span className="material-symbols-outlined problems-empty-icon">check_circle</span>
          <p>No problems have been detected in the current workspace.</p>
          <span style={{ fontSize: '11px', color: '#666', marginTop: '-4px' }}>
            Diagnostics, runtime errors, and warnings will appear here instead of popups.
          </span>
        </div>
      </div>
    )
  }

  const getGroupIcon = (key) => {
    if (key.includes('Git')) return { icon: 'fork_right', color: '#e2c08d' }
    if (key.includes('Export')) return { icon: 'file_download', color: '#4ec9b0' }
    if (key.includes('Update')) return { icon: 'update', color: '#9cdcfe' }
    if (key.includes('Workspace')) return { icon: 'dns', color: '#cca700' }
    return { icon: 'description', color: '#007acc' }
  }

  return (
    <div className="panel-problems-view custom-scrollbar">
      <div className="problems-list">
        {groupedProblems.map((group) => {
          const { icon, color } = getGroupIcon(group.key)
          return (
            <div key={group.key} className="problem-group-section">
              <div className="problem-file-header">
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color }}>
                  {icon}
                </span>
                <span className="problem-group-title">{group.key}</span>
                <span className="problem-count-badge">
                  {group.items.length} issue{group.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {group.items.map((p) => {
                const isRuntimeProblem = Boolean(p.id && (String(p.id).startsWith('prob-') || !p.line))
                const tooltip = p.line
                  ? `Click to navigate to Ln ${p.line}, Col ${p.col || 1}`
                  : (p.message || 'Diagnostic issue')

                return (
                  <div
                    key={p.id}
                    className={`problem-item-row problem-item-${p.severity}`}
                    onClick={() => onSelectProblem(p)}
                    title={tooltip}
                  >
                    <span
                      className={`material-symbols-outlined problem-icon ${
                        p.severity === 'error'
                          ? 'icon-error'
                          : p.severity === 'warning'
                          ? 'icon-warn'
                          : 'icon-info'
                      }`}
                    >
                      {p.severity === 'error' ? 'cancel' : p.severity === 'warning' ? 'warning' : 'info'}
                    </span>
                    <span className="problem-message">{p.message}</span>
                    <span className="problem-source">[{p.source || 'Markdown'}]</span>
                    {p.line != null ? (
                      <span className="problem-location">
                        [{p.line}, {p.col || 1}]
                      </span>
                    ) : p.timestamp ? (
                      <span className="problem-location problem-time">
                        [{p.timestamp}]
                      </span>
                    ) : null}

                    {isRuntimeProblem && onRemoveProblem && (
                      <button
                        type="button"
                        className="problem-dismiss-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          onRemoveProblem(p.id)
                        }}
                        title="Dismiss this problem"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                          close
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
