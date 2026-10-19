import React, { useState, useMemo, useEffect } from 'react'

const STEP_TYPES = [
  { id: 'commit', label: 'Commit', icon: 'commit', color: '#10b981', desc: 'Snapshot code change' },
  { id: 'branch', label: 'New Branch', icon: 'call_split', color: '#a855f7', desc: 'Fork new branch' },
  { id: 'checkout', label: 'Checkout', icon: 'arrow_forward', color: '#38bdf8', desc: 'Switch active branch' },
  { id: 'merge', label: 'Merge', icon: 'call_merge', color: '#f59e0b', desc: 'Merge branch into current' }
]

const CONVENTIONAL_PREFIXES = ['feat:', 'fix:', 'refactor:', 'docs:', 'chore:', 'test:', 'perf:', 'style:']
const QUICK_TAGS = ['v1.0.0', 'v1.0.1', 'v1.1.0', 'v2.0.0', 'RC-1', 'beta-1']
const BRANCH_PREFIXES = ['feature/', 'fix/', 'release/', 'hotfix/']

/**
 * High-Fidelity Git Branching & History Graph Visual Builder
 * - Interactive Branch Outline & Detected Branches Counter
 * - 1-Click Standard Git Workflow Blueprints (GitFlow, GitHub Flow PR, Production Hotfix)
 * - Spacious 2-Line Step Cards with color-coded type badges & full-width un-truncated inputs
 * - Quick Conventional Commit Prefix Chips (+ feat:, + fix:, etc.)
 * - Quick SemVer Tag Chips (+ v1.0.0, + v1.1.0, etc.)
 * - Compact History Log vs Expanded Cards View Modes
 * - Live Search & Filter Bar across commits, branches, and tags
 */
export default function GitVisualBuilder({
  steps = [],
  onStepsChange,
  selectedStepId: controlledSelectedStepId,
  onSelectStepId
}) {
  const [internalSelectedStepId, setInternalSelectedStepId] = useState(steps[0]?.id || null)
  const isControlled = controlledSelectedStepId !== undefined
  const selectedStepId = isControlled ? controlledSelectedStepId : internalSelectedStepId

  const setSelectedStepId = (id) => {
    if (typeof onSelectStepId === 'function') {
      onSelectStepId(id)
    }
    if (!isControlled) {
      setInternalSelectedStepId(id)
    }
  }

  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'compact'
  const [searchQuery, setSearchQuery] = useState('')
  const [showBlueprints, setShowBlueprints] = useState(false)
  const [branchFilter, setBranchFilter] = useState('ALL')

  // Auto-scroll selected step into view
  useEffect(() => {
    if (selectedStepId) {
      const el = document.getElementById(`git-step-${selectedStepId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedStepId])

  // Extract all unique branch names from steps
  const detectedBranches = useMemo(() => {
    const set = new Set(['main'])
    steps.forEach((s) => {
      if (s.type === 'branch' && s.name) set.add(s.name)
      if (s.type === 'checkout' && s.name) set.add(s.name)
      if (s.type === 'merge' && s.target) set.add(s.target)
    })
    return Array.from(set)
  }, [steps])

  // Preset Git Workflows
  const PRESET_WORKFLOWS = [
    {
      label: '🌱 GitFlow Architecture',
      desc: 'main ➔ develop ➔ feature/auth ➔ PR merge ➔ v1.0.0 release',
      steps: [
        { type: 'commit', idLabel: 'feat: initial repository scaffold', tag: '' },
        { type: 'branch', name: 'develop' },
        { type: 'checkout', name: 'develop' },
        { type: 'commit', idLabel: 'feat: core database schema & entities' },
        { type: 'branch', name: 'feature/auth' },
        { type: 'checkout', name: 'feature/auth' },
        { type: 'commit', idLabel: 'feat: jwt authentication & token refresh' },
        { type: 'commit', idLabel: 'test: add unit tests for auth guard' },
        { type: 'checkout', name: 'develop' },
        { type: 'merge', target: 'feature/auth', idLabel: 'Merge PR #101 feature/auth', tag: '' },
        { type: 'checkout', name: 'main' },
        { type: 'merge', target: 'develop', idLabel: 'Release v1.0.0', tag: 'v1.0.0' }
      ]
    },
    {
      label: '🚀 GitHub Flow (Feature PR)',
      desc: 'main ➔ feature/checkout ➔ commits ➔ PR merge into main',
      steps: [
        { type: 'commit', idLabel: 'feat: base application setup' },
        { type: 'branch', name: 'feature/stripe-billing' },
        { type: 'checkout', name: 'feature/stripe-billing' },
        { type: 'commit', idLabel: 'feat: stripe webhook integration' },
        { type: 'commit', idLabel: 'fix: handle currency conversion edge case' },
        { type: 'checkout', name: 'main' },
        { type: 'merge', target: 'feature/stripe-billing', idLabel: 'Merge pull request #42', tag: 'v1.1.0' }
      ]
    },
    {
      label: '🔥 Production Hotfix Release',
      desc: 'main ➔ hotfix/cve-patch ➔ commit fix ➔ tag v1.0.1',
      steps: [
        { type: 'commit', idLabel: 'feat: initial production launch', tag: 'v1.0.0' },
        { type: 'branch', name: 'hotfix/token-leak' },
        { type: 'checkout', name: 'hotfix/token-leak' },
        { type: 'commit', idLabel: 'fix: redact bearer credentials in logs' },
        { type: 'checkout', name: 'main' },
        { type: 'merge', target: 'hotfix/token-leak', idLabel: 'Merge hotfix/token-leak', tag: 'v1.0.1' }
      ]
    }
  ]

  // Apply Blueprint
  const handleApplyWorkflow = (wf) => {
    const newSteps = wf.steps.map((s, idx) => ({
      id: `git_${Date.now()}_${idx}`,
      type: s.type,
      idLabel: s.idLabel || '',
      name: s.name || '',
      target: s.target || '',
      tag: s.tag || ''
    }))
    onStepsChange(newSteps)
    if (newSteps[0]) setSelectedStepId(newSteps[0].id)
    setShowBlueprints(false)
  }

  // Add Step
  const handleAddStep = (type) => {
    const count = steps.length + 1
    const newStep = {
      id: `git_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      idLabel: type === 'commit' ? `feat: step ${count}` : '',
      name: type === 'branch' ? `feature/branch-${count}` : type === 'checkout' ? (detectedBranches[0] || 'main') : '',
      target: type === 'merge' ? (detectedBranches[1] || detectedBranches[0] || 'develop') : '',
      tag: ''
    }
    onStepsChange([...steps, newStep])
    setSelectedStepId(newStep.id)
  }

  // Update Step
  const handleUpdateStep = (id, updates) => {
    onStepsChange(steps.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  // Delete Step
  const handleDeleteStep = (id) => {
    onStepsChange(steps.filter((s) => s.id !== id))
    if (selectedStepId === id) {
      const remaining = steps.filter((s) => s.id !== id)
      setSelectedStepId(remaining[0]?.id || null)
    }
  }

  // Move Step
  const handleMove = (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= steps.length) return
    const updated = [...steps]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    onStepsChange(updated)
  }

  // Apply Prefix to Commit Message
  const handleApplyPrefix = (stepId, currentMsg, prefix) => {
    let clean = currentMsg.trim()
    for (const p of CONVENTIONAL_PREFIXES) {
      if (clean.startsWith(p)) {
        clean = clean.slice(p.length).trim()
        break
      }
    }
    handleUpdateStep(stepId, { idLabel: `${prefix} ${clean}`.trim() })
  }

  // Filtered steps
  const filteredSteps = useMemo(() => {
    return steps.filter((s) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchMsg = (s.idLabel || '').toLowerCase().includes(q)
        const matchName = (s.name || '').toLowerCase().includes(q)
        const matchTarget = (s.target || '').toLowerCase().includes(q)
        const matchTag = (s.tag || '').toLowerCase().includes(q)
        if (!matchMsg && !matchName && !matchTarget && !matchTag) return false
      }
      return true
    })
  }, [steps, searchQuery])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. GIT WORKSPACE OUTLINE & BRANCHES */}
      <div className="git-outline-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a855f7' }}>
              call_split
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.02em' }}>
              Git History & Branches ({steps.length} steps)
            </span>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(0,0,0,0.4)', padding: '2px', borderRadius: '5px' }}>
            <button
              type="button"
              className={`diagram-mode-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Expanded Cards View"
              style={{ fontSize: '10px', padding: '3px 7px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>view_agenda</span>
              <span>Cards</span>
            </button>
            <button
              type="button"
              className={`diagram-mode-btn ${viewMode === 'compact' ? 'active' : ''}`}
              onClick={() => setViewMode('compact')}
              title="Compact Timeline Log View"
              style={{ fontSize: '10px', padding: '3px 7px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>density_medium</span>
              <span>Log</span>
            </button>
          </div>
        </div>

        {/* Live Filter Bar & Workflow Blueprints */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span
              className="material-symbols-outlined"
              style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#64748b' }}
            >
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commit messages, branches, tags..."
              className="studio-text-input"
              style={{ width: '100%', paddingLeft: '28px', fontSize: '11px', height: '28px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Workflow Blueprints Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => setShowBlueprints(!showBlueprints)}
              style={{ height: '28px', padding: '0 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#a855f7' }}>account_tree</span>
              <span>+ Workflow</span>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>expand_more</span>
            </button>

            {showBlueprints && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '32px',
                  zIndex: 20,
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  minWidth: '220px',
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Git Workflow Presets
                </div>
                {PRESET_WORKFLOWS.map((wf) => (
                  <button
                    key={wf.label}
                    type="button"
                    onClick={() => handleApplyWorkflow(wf)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '6px 8px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#f8fafc',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{wf.label}</span>
                    <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>{wf.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detected Branches Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Branches:
          </span>
          {detectedBranches.map((br) => (
            <div key={br} className="git-branch-chip">
              <span className="material-symbols-outlined" style={{ fontSize: '12px', color: '#a855f7' }}>fork_right</span>
              <span>{br}</span>
            </div>
          ))}
        </div>

        {/* Quick Add Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {STEP_TYPES.map((st) => (
            <button
              key={st.id}
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => handleAddStep(st.id)}
              style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: st.color }}>{st.icon}</span>
              <span>+ {st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. CHRONOLOGICAL GIT HISTORY STEPS */}
      {viewMode === 'cards' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredSteps.map((step, index) => {
            const isSelected = selectedStepId === step.id
            const typeConfig = STEP_TYPES.find((t) => t.id === step.type) || STEP_TYPES[0]

            return (
              <div
                key={step.id}
                id={`git-step-${step.id}`}
                onClick={() => setSelectedStepId(step.id)}
                className={`git-step-card ${isSelected ? 'is-selected' : ''}`}
                style={{
                  borderLeft: `3px solid ${typeConfig.color}`
                }}
              >
                {/* Header Row: Index, Action Type Selector, Tag & Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="seq-step-index">#{index + 1}</span>

                    {/* Step Type Selector */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: `${typeConfig.color}20`,
                        border: `1px solid ${typeConfig.color}60`,
                        color: typeConfig.color,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>{typeConfig.icon}</span>
                      <select
                        value={step.type}
                        onChange={(e) => handleUpdateStep(step.id, { type: e.target.value })}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: typeConfig.color,
                          fontWeight: 700,
                          fontSize: '11px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        {STEP_TYPES.map((st) => (
                          <option key={st.id} value={st.id} style={{ background: '#1e293b', color: '#f8fafc' }}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tag Badge (if exists) */}
                    {step.tag && (
                      <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '1px 6px', borderRadius: '3px', fontWeight: 600 }}>
                        🏷️ {step.tag}
                      </span>
                    )}
                  </div>

                  {/* Actions: Move Up, Move Down, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMove(index, -1)
                      }}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMove(index, 1)
                      }}
                      disabled={index === steps.length - 1}
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_downward</span>
                    </button>
                    <button
                      type="button"
                      className="seq-icon-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteStep(step.id)
                      }}
                      title="Delete step"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>close</span>
                    </button>
                  </div>
                </div>

                {/* Body Row: Action-Specific Inputs */}
                {step.type === 'commit' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={step.idLabel || ''}
                        onChange={(e) => handleUpdateStep(step.id, { idLabel: e.target.value })}
                        placeholder="Commit message (e.g. feat: implement auth flow)"
                        style={{ flex: 1, fontSize: '12px', padding: '5px 8px', color: '#f8fafc' }}
                      />

                      <input
                        type="text"
                        className="studio-text-input"
                        value={step.tag || ''}
                        onChange={(e) => handleUpdateStep(step.id, { tag: e.target.value })}
                        placeholder="tag (e.g. v1.0.0)"
                        style={{ width: '100px', fontSize: '11px', padding: '5px 8px' }}
                      />
                    </div>

                    {/* Conventional Commit Snippets & Quick Tags */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {CONVENTIONAL_PREFIXES.map((prefix) => (
                          <button
                            key={prefix}
                            type="button"
                            className="seq-snippet-chip"
                            onClick={() => handleApplyPrefix(step.id, step.idLabel || '', prefix)}
                          >
                            +{prefix}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '3px' }}>
                        {QUICK_TAGS.slice(0, 3).map((tg) => (
                          <button
                            key={tg}
                            type="button"
                            className="seq-snippet-chip"
                            style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b' }}
                            onClick={() => handleUpdateStep(step.id, { tag: tg })}
                          >
                            +{tg}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step.type === 'branch' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#a855f7' }}>call_split</span>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={step.name || ''}
                        onChange={(e) => handleUpdateStep(step.id, { name: e.target.value.replace(/[^a-zA-Z0-9_\-./]/g, '_') })}
                        placeholder="Branch name (e.g. feature/user-profile, develop)"
                        style={{ flex: 1, fontSize: '12px', padding: '5px 8px', color: '#f8fafc', fontWeight: 600 }}
                      />
                    </div>

                    {/* Quick Branch Prefix Chips */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {BRANCH_PREFIXES.map((bp) => (
                        <button
                          key={bp}
                          type="button"
                          className="seq-snippet-chip"
                          onClick={() => {
                            const current = (step.name || '').replace(/^(feature\/|fix\/|release\/|hotfix\/)/, '')
                            handleUpdateStep(step.id, { name: `${bp}${current || 'task'}` })
                          }}
                        >
                          +{bp}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step.type === 'checkout' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#38bdf8' }}>arrow_forward</span>
                    <select
                      className="studio-text-input"
                      value={step.name || 'main'}
                      onChange={(e) => handleUpdateStep(step.id, { name: e.target.value })}
                      style={{ flex: 1, fontSize: '12px', padding: '5px 8px', fontWeight: 600, color: '#38bdf8' }}
                    >
                      {detectedBranches.map((br) => (
                        <option key={br} value={br}>Checkout: {br}</option>
                      ))}
                    </select>
                  </div>
                )}

                {step.type === 'merge' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#f59e0b' }}>call_merge</span>
                      <select
                        className="studio-text-input"
                        value={step.target || ''}
                        onChange={(e) => handleUpdateStep(step.id, { target: e.target.value })}
                        style={{ flex: 1, fontSize: '12px', padding: '5px 8px', fontWeight: 600, color: '#f59e0b' }}
                      >
                        <option value="">-- Select branch to merge --</option>
                        {detectedBranches.map((br) => (
                          <option key={br} value={br}>Merge: {br}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        className="studio-text-input"
                        value={step.tag || ''}
                        onChange={(e) => handleUpdateStep(step.id, { tag: e.target.value })}
                        placeholder="tag (e.g. v1.0.0)"
                        style={{ width: '100px', fontSize: '11px', padding: '5px 8px' }}
                      />
                    </div>

                    <input
                      type="text"
                      className="studio-text-input"
                      value={step.idLabel || ''}
                      onChange={(e) => handleUpdateStep(step.id, { idLabel: e.target.value })}
                      placeholder="Merge commit message (e.g. Merge PR #42 into main)"
                      style={{ width: '100%', fontSize: '11px', padding: '4px 8px', color: '#94a3b8' }}
                    />
                  </div>
                )}
              </div>
            )
          })}

          {filteredSteps.length === 0 && (
            <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>
              No git actions found. Click "+ Commit" or "+ Workflow" above to begin.
            </div>
          )}
        </div>
      ) : (
        /* COMPACT TIMELINE LOG VIEW */
        <div className="seq-compact-table">
          {filteredSteps.map((step, idx) => {
            const isSelected = selectedStepId === step.id
            const typeConfig = STEP_TYPES.find((t) => t.id === step.type) || STEP_TYPES[0]

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={`seq-compact-row ${isSelected ? 'is-selected' : ''}`}
              >
                <span style={{ fontSize: '10px', color: '#64748b', width: '20px' }}>#{idx + 1}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: typeConfig.color }}>
                  {typeConfig.icon}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: typeConfig.color, width: '60px' }}>
                  {typeConfig.label}
                </span>
                <span style={{ fontSize: '11px', color: '#f8fafc', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {step.type === 'commit' && (step.idLabel || 'Commit')}
                  {step.type === 'branch' && `New branch: ${step.name}`}
                  {step.type === 'checkout' && `Switch to: ${step.name}`}
                  {step.type === 'merge' && `Merge ${step.target}`}
                </span>
                {step.tag && (
                  <span style={{ fontSize: '9.5px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '1px 5px', borderRadius: '3px' }}>
                    🏷️ {step.tag}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
