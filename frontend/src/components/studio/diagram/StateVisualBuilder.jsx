import React, { useState, useMemo, useEffect } from 'react'

const QUICK_EVENT_TRIGGERS = [
  'SUBMIT',
  'SUCCESS',
  'FAILURE',
  'TIMEOUT',
  'CANCEL',
  'RETRY',
  'APPROVE',
  'REJECT',
  'PAYMENT_CONFIRMED',
  'DISPATCH'
]

/**
 * High-Fidelity State Machine & Lifecycle Diagram Visual Builder
 * - Interactive States Outline with start/end badges & live search
 * - 1-Click Standard Lifecycle Blueprints (E-Commerce Order, Auth Session, Approval Flow, Job Queue)
 * - Focused State Inspector with inline rename propagation to all transitions
 * - Start State ([*] --> S) and End State (S --> [*]) visual markers & toggles
 * - Spacious 2-Line Visual Transition Route Cards (From ──[ Event Trigger ]──▶ To)
 * - Quick Event Trigger Snippet Chips ([SUCCESS], [FAILURE], [TIMEOUT], etc.)
 * - Two-Way Canvas Selection Synchronization & Auto-scroll
 */
export default function StateVisualBuilder({
  states = [],
  onStatesChange,
  transitions = [],
  onTransitionsChange,
  selectedStateId: controlledSelectedStateId,
  onSelectStateId
}) {
  const [internalSelectedStateId, setInternalSelectedStateId] = useState(states[0]?.id || null)
  const isControlled = controlledSelectedStateId !== undefined
  const selectedStateId = isControlled ? controlledSelectedStateId : internalSelectedStateId

  const setSelectedStateId = (id) => {
    if (typeof onSelectStateId === 'function') {
      onSelectStateId(id)
    }
    if (!isControlled) {
      setInternalSelectedStateId(id)
    }
  }

  const [viewMode, setViewMode] = useState('focused') // 'focused' | 'expanded'
  const [searchQuery, setSearchQuery] = useState('')
  const [newStateName, setNewStateName] = useState('')
  const [showBlueprintMenu, setShowBlueprintMenu] = useState(false)

  // Ensure active state exists
  const activeState = useMemo(() => {
    return states.find((s) => s.id === selectedStateId) || states[0] || null
  }, [states, selectedStateId])

  // Auto-scroll selected state into view
  useEffect(() => {
    if (selectedStateId) {
      const el = document.getElementById(`state-card-${selectedStateId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedStateId])

  // Preset State Machine Blueprints
  const PRESET_BLUEPRINTS = [
    {
      label: '🛒 Order Lifecycle',
      description: 'Created -> Paid -> Shipped -> Delivered',
      states: [
        { name: 'Created', description: 'Order initialized by customer', isInitial: true, isFinal: false },
        { name: 'Paid', description: 'Payment authorized successfully', isInitial: false, isFinal: false },
        { name: 'Processing', description: 'Warehouse picking & packaging', isInitial: false, isFinal: false },
        { name: 'Shipped', description: 'Carrier tracking attached', isInitial: false, isFinal: false },
        { name: 'Delivered', description: 'Package receipt confirmed', isInitial: false, isFinal: true },
        { name: 'Cancelled', description: 'Order cancelled / refunded', isInitial: false, isFinal: true }
      ],
      transitions: [
        { from: 'Created', to: 'Paid', event: 'PAY_SUCCESS' },
        { from: 'Created', to: 'Cancelled', event: 'CANCEL_BY_USER' },
        { from: 'Paid', to: 'Processing', event: 'SEND_TO_WAREHOUSE' },
        { from: 'Processing', to: 'Shipped', event: 'CARRIER_PICKUP' },
        { from: 'Shipped', to: 'Delivered', event: 'DELIVERY_CONFIRMED' },
        { from: 'Paid', to: 'Cancelled', event: 'REFUND_REQUESTED' }
      ]
    },
    {
      label: '🔐 Auth Session',
      description: 'LoggedOut -> Authenticating -> Active -> Expired',
      states: [
        { name: 'LoggedOut', description: 'Anonymous guest state', isInitial: true, isFinal: false },
        { name: 'Authenticating', description: 'Verifying credentials / MFA', isInitial: false, isFinal: false },
        { name: 'Authenticated', description: 'Active JWT session issued', isInitial: false, isFinal: false },
        { name: 'SessionExpired', description: 'Token TTL reached', isInitial: false, isFinal: false },
        { name: 'Locked', description: 'Account locked due to brute force', isInitial: false, isFinal: true }
      ],
      transitions: [
        { from: 'LoggedOut', to: 'Authenticating', event: 'LOGIN_SUBMIT' },
        { from: 'Authenticating', to: 'Authenticated', event: 'MFA_VERIFIED' },
        { from: 'Authenticating', to: 'Locked', event: 'MAX_ATTEMPTS_EXCEEDED' },
        { from: 'Authenticated', to: 'SessionExpired', event: 'TTL_TIMEOUT' },
        { from: 'SessionExpired', to: 'Authenticating', event: 'REFRESH_TOKEN' },
        { from: 'Authenticated', to: 'LoggedOut', event: 'LOGOUT_CLICK' }
      ]
    },
    {
      label: '📄 Document Approval',
      description: 'Draft -> InReview -> Approved -> Published',
      states: [
        { name: 'Draft', description: 'Author drafting content', isInitial: true, isFinal: false },
        { name: 'InReview', description: 'Peer reviewers evaluating', isInitial: false, isFinal: false },
        { name: 'Approved', description: 'Executive sign-off given', isInitial: false, isFinal: false },
        { name: 'Published', description: 'Publicly readable document', isInitial: false, isFinal: true },
        { name: 'Archived', description: 'Sunset document', isInitial: false, isFinal: true }
      ],
      transitions: [
        { from: 'Draft', to: 'InReview', event: 'SUBMIT_FOR_REVIEW' },
        { from: 'InReview', to: 'Draft', event: 'CHANGES_REQUESTED' },
        { from: 'InReview', to: 'Approved', event: 'PEER_APPROVAL' },
        { from: 'Approved', to: 'Published', event: 'RELEASE_SCHEDULE' },
        { from: 'Published', to: 'Archived', event: 'DEPRECATE' }
      ]
    },
    {
      label: '⚡ Job Processing Queue',
      description: 'Queued -> Running -> Success / Retrying / Failed',
      states: [
        { name: 'Queued', description: 'Waiting for worker pickup', isInitial: true, isFinal: false },
        { name: 'Running', description: 'Task executing on worker', isInitial: false, isFinal: false },
        { name: 'Retrying', description: 'Transient failure backoff', isInitial: false, isFinal: false },
        { name: 'Success', description: 'Job completed 200 OK', isInitial: false, isFinal: true },
        { name: 'DeadLetter', description: 'Max retries exhausted', isInitial: false, isFinal: true }
      ],
      transitions: [
        { from: 'Queued', to: 'Running', event: 'WORKER_ACQUIRE' },
        { from: 'Running', to: 'Success', event: 'JOB_FINISH' },
        { from: 'Running', to: 'Retrying', event: 'TRANSIENT_ERROR' },
        { from: 'Retrying', to: 'Running', event: 'BACKOFF_TIMER' },
        { from: 'Retrying', to: 'DeadLetter', event: 'MAX_RETRIES_HIT' }
      ]
    }
  ]

  // Apply Blueprint
  const handleApplyBlueprint = (blueprint) => {
    const newStates = blueprint.states.map((s, idx) => ({
      id: `s_${Date.now()}_${idx}`,
      name: s.name,
      description: s.description || '',
      isInitial: Boolean(s.isInitial),
      isFinal: Boolean(s.isFinal)
    }))
    const newTransitions = blueprint.transitions.map((t, idx) => ({
      id: `t_${Date.now()}_${idx}`,
      from: t.from,
      to: t.to,
      event: t.event || ''
    }))

    onStatesChange(newStates)
    onTransitionsChange(newTransitions)
    if (newStates[0]) setSelectedStateId(newStates[0].id)
    setShowBlueprintMenu(false)
  }

  // Add Single State
  const handleAddState = (isInit = false) => {
    const rawName = (newStateName.trim() || `State_${states.length + 1}`).replace(/[^a-zA-Z0-9_]/g, '_')
    if (!rawName) return

    let finalName = rawName
    let count = 1
    while (states.some((s) => s.name.toLowerCase() === finalName.toLowerCase())) {
      finalName = `${rawName}_${count++}`
    }

    const newState = {
      id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: finalName,
      description: '',
      isInitial: isInit || states.length === 0,
      isFinal: false
    }

    onStatesChange([...states, newState])
    setSelectedStateId(newState.id)
    setNewStateName('')
  }

  // Update State with Rename Propagation to Transitions
  const handleUpdateState = (id, updates) => {
    const targetState = states.find((s) => s.id === id)
    if (!targetState) return

    const oldName = targetState.name
    const newName = updates.name !== undefined ? updates.name.trim() : null

    // Rename propagation
    if (newName && newName !== oldName) {
      const updatedTransitions = transitions.map((t) => {
        let updatedFrom = t.from === oldName ? newName : t.from
        let updatedTo = t.to === oldName ? newName : t.to
        return { ...t, from: updatedFrom, to: updatedTo }
      })
      onTransitionsChange(updatedTransitions)
    }

    onStatesChange(states.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  }

  // Delete State
  const handleDeleteState = (id) => {
    const targetState = states.find((s) => s.id === id)
    if (!targetState) return
    onStatesChange(states.filter((s) => s.id !== id))
    onTransitionsChange(transitions.filter((t) => t.from !== targetState.name && t.to !== targetState.name))
    if (selectedStateId === id) {
      const remaining = states.filter((s) => s.id !== id)
      setSelectedStateId(remaining[0]?.id || null)
    }
  }

  // Add Transition
  const handleAddTransition = (fromName = null, toName = null, event = 'TRIGGER_EVENT') => {
    const defaultFrom = fromName || states[0]?.name || '[*]'
    const defaultTo = toName || states[1]?.name || states[0]?.name || '[*]'
    const newTrans = {
      id: `t_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      from: defaultFrom,
      to: defaultTo,
      event
    }
    onTransitionsChange([...transitions, newTrans])
  }

  // Update Transition
  const handleUpdateTransition = (id, updates) => {
    onTransitionsChange(transitions.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  // Delete Transition
  const handleDeleteTransition = (id) => {
    onTransitionsChange(transitions.filter((t) => t.id !== id))
  }

  // Filtered States
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return states
    const q = searchQuery.toLowerCase()
    return states.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        transitions.some((t) => (t.from === s.name || t.to === s.name) && t.event.toLowerCase().includes(q))
    )
  }, [states, transitions, searchQuery])

  // Count transitions for active state
  const getTransitionCount = (stateName) => {
    return transitions.filter((t) => t.from === stateName || t.to === stateName).length
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. STATES OUTLINE BAR */}
      <div className="state-outline-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>
              motion_photos_on
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.02em' }}>
              States & Lifecycles ({states.length})
            </span>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(0,0,0,0.4)', padding: '2px', borderRadius: '5px' }}>
            <button
              type="button"
              className={`diagram-mode-btn ${viewMode === 'focused' ? 'active' : ''}`}
              onClick={() => setViewMode('focused')}
              title="Focus on selected state"
              style={{ fontSize: '10px', padding: '3px 7px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>center_focus_strong</span>
              <span>Focused</span>
            </button>
            <button
              type="button"
              className={`diagram-mode-btn ${viewMode === 'expanded' ? 'active' : ''}`}
              onClick={() => setViewMode('expanded')}
              title="View all states"
              style={{ fontSize: '10px', padding: '3px 7px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>view_agenda</span>
              <span>All ({states.length})</span>
            </button>
          </div>
        </div>

        {/* Live Filter Bar & Blueprint Presets */}
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
              placeholder="Search states, events, notes..."
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

          {/* 1-Click Lifecycle Blueprints Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => setShowBlueprintMenu(!showBlueprintMenu)}
              style={{ height: '28px', padding: '0 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#10b981' }}>auto_awesome</span>
              <span>+ Blueprint</span>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>expand_more</span>
            </button>

            {showBlueprintMenu && (
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
                  Lifecycle Blueprints
                </div>
                {PRESET_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.label}
                    type="button"
                    onClick={() => handleApplyBlueprint(bp)}
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
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.18)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{bp.label}</span>
                    <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>{bp.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* States Selector Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {filteredStates.map((state) => {
            const isSelected = activeState && activeState.id === state.id
            const transCount = getTransitionCount(state.name)

            return (
              <div
                key={state.id}
                onClick={() => setSelectedStateId(state.id)}
                className={`state-table-chip ${isSelected ? 'is-selected' : ''}`}
                title={`Click to inspect ${state.name}`}
              >
                {/* State Type Icon / Indicator */}
                {state.isInitial ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#10b981' }} title="Initial State">
                    play_circle
                  </span>
                ) : state.isFinal ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#f43f5e' }} title="Final State">
                    stop_circle
                  </span>
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#38bdf8' }}>
                    circle
                  </span>
                )}

                <span style={{ fontWeight: isSelected ? 700 : 500 }}>{state.name}</span>

                {state.isInitial && <span className="state-badge-start">Start</span>}
                {state.isFinal && <span className="state-badge-end">End</span>}

                <span className="state-trans-count-badge">T:{transCount}</span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteState(state.id)
                  }}
                  className="seq-icon-action-btn delete"
                  style={{ width: '16px', height: '16px', padding: 0 }}
                  title="Delete state"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                </button>
              </div>
            )
          })}
        </div>

        {/* Add State Row */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            className="studio-text-input"
            placeholder="New State Name (e.g. Processing, InReview, Paid)"
            value={newStateName}
            onChange={(e) => setNewStateName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddState(false)}
            style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
          />
          <button
            type="button"
            className="studio-shell-btn studio-shell-btn-primary"
            onClick={() => handleAddState(false)}
            style={{ padding: '4px 12px', fontSize: '11px' }}
          >
            + Add State
          </button>
        </div>
      </div>

      {/* 2. STATE INSPECTOR (FOCUSED OR ALL) */}
      {(viewMode === 'focused' ? (activeState ? [activeState] : []) : filteredStates).map((state) => {
        const isSelected = activeState && activeState.id === state.id
        const connectedTransitions = transitions.filter((t) => t.from === state.name || t.to === state.name)

        return (
          <div
            key={state.id}
            id={`state-card-${state.id}`}
            className="state-focused-card"
            style={{
              borderColor: isSelected ? '#10b981' : undefined,
              boxShadow: isSelected ? '0 0 14px rgba(16, 185, 129, 0.25)' : undefined
            }}
          >
            {/* State Header Banner */}
            <div className="state-header-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>
                  motion_photos_on
                </span>

                {/* Inline Rename with Transition Propagation */}
                <input
                  type="text"
                  className="state-rename-input"
                  value={state.name}
                  onChange={(e) => handleUpdateState(state.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '_') })}
                  title="Rename state (auto-updates connected transitions)"
                />

                {/* Start Entry Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#94a3b8', cursor: 'pointer', marginLeft: '6px' }} title="Is Initial Entry State [*] --> State">
                  <input
                    type="checkbox"
                    checked={Boolean(state.isInitial)}
                    onChange={(e) => handleUpdateState(state.id, { isInitial: e.target.checked })}
                  />
                  <span style={{ color: state.isInitial ? '#10b981' : '#94a3b8', fontWeight: state.isInitial ? 700 : 400 }}>
                    ● Start ([*])
                  </span>
                </label>

                {/* Final Terminal Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#94a3b8', cursor: 'pointer' }} title="Is Final Terminal State State --> [*]">
                  <input
                    type="checkbox"
                    checked={Boolean(state.isFinal)}
                    onChange={(e) => handleUpdateState(state.id, { isFinal: e.target.checked })}
                  />
                  <span style={{ color: state.isFinal ? '#f43f5e' : '#94a3b8', fontWeight: state.isFinal ? 700 : 400 }}>
                    ◎ End ([*])
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  className="studio-shell-btn studio-shell-btn-secondary"
                  onClick={() => handleAddTransition(state.name, null, 'TRIGGER_EVENT')}
                  style={{ padding: '2px 7px', fontSize: '10.5px' }}
                >
                  + Outgoing
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteState(state.id)}
                  className="seq-icon-action-btn delete"
                  title="Delete state"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                </button>
              </div>
            </div>

            {/* State Details */}
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Description / Annotation */}
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                  State Annotation / Description
                </label>
                <input
                  type="text"
                  className="studio-text-input"
                  value={state.description || ''}
                  onChange={(e) => handleUpdateState(state.id, { description: e.target.value })}
                  placeholder="e.g. Order submitted and awaiting warehouse confirmation"
                  style={{ width: '100%', fontSize: '11.5px', padding: '5px 8px' }}
                />
              </div>

              {/* Connected Transitions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#f1f5f9' }}>
                  Connected Transitions ({connectedTransitions.length})
                </span>

                {connectedTransitions.map((t) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', background: 'rgba(0,0,0,0.25)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: t.from === state.name ? '#10b981' : '#cbd5e1', fontWeight: 600 }}>{t.from}</span>
                    <span style={{ color: '#38bdf8' }}>──[{t.event || 'transition'}]──▶</span>
                    <span style={{ color: t.to === state.name ? '#10b981' : '#cbd5e1', fontWeight: 600 }}>{t.to}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}

      {/* 3. TRANSITIONS & EVENTS CARDS */}
      <div className="state-transitions-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#38bdf8' }}>
              alt_route
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>
              State Transitions & Triggers ({transitions.length})
            </span>
          </div>

          <button
            type="button"
            className="studio-shell-btn studio-shell-btn-secondary"
            onClick={() => handleAddTransition()}
            disabled={states.length === 0}
            style={{ padding: '3px 9px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#38bdf8' }}>add</span>
            <span>+ Transition</span>
          </button>
        </div>

        {/* Visual Transition Route Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transitions.map((trans) => (
            <div key={trans.id} className="state-trans-card">
              {/* Route Line: [ From State ▾ ] ────[ Event Trigger ]────▶ [ To State ▾ ] */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* From State */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '120px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#10b981' }}>motion_photos_on</span>
                  <select
                    className="studio-text-input"
                    value={trans.from}
                    onChange={(e) => handleUpdateTransition(trans.id, { from: e.target.value })}
                    style={{ flex: 1, fontSize: '11px', padding: '4px 6px', fontWeight: 600 }}
                  >
                    <option value="[*]">[*] (Initial / Start)</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 700 }}>──▶</span>

                {/* To State */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '120px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#38bdf8' }}>motion_photos_on</span>
                  <select
                    className="studio-text-input"
                    value={trans.to}
                    onChange={(e) => handleUpdateTransition(trans.id, { to: e.target.value })}
                    style={{ flex: 1, fontSize: '11px', padding: '4px 6px', fontWeight: 600 }}
                  >
                    <option value="[*]">[*] (Final / End)</option>
                    {states.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Swap Direction */}
                <button
                  type="button"
                  className="seq-icon-action-btn"
                  onClick={() => handleUpdateTransition(trans.id, { from: trans.to, to: trans.from })}
                  title="Invert transition direction"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>swap_horiz</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteTransition(trans.id)}
                  className="seq-icon-action-btn delete"
                  title="Delete transition"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>close</span>
                </button>
              </div>

              {/* Event / Action Trigger Input & Quick Chips */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#f59e0b' }}>bolt</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={trans.event || ''}
                  onChange={(e) => handleUpdateTransition(trans.id, { event: e.target.value })}
                  placeholder="Event Trigger (e.g. PAYMENT_SUCCESS, TIMEOUT, CANCEL)"
                  style={{ flex: 1, fontSize: '11px', padding: '3px 8px', color: '#f1f5f9' }}
                />

                {/* Quick Event Trigger Chips */}
                <div style={{ display: 'flex', gap: '3px' }}>
                  {QUICK_EVENT_TRIGGERS.slice(0, 4).map((trig) => (
                    <button
                      key={trig}
                      type="button"
                      className="seq-snippet-chip"
                      onClick={() => handleUpdateTransition(trans.id, { event: trig })}
                    >
                      +{trig}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {transitions.length === 0 && (
            <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '8px', textAlign: 'center' }}>
              No transitions defined yet. Click "+ Transition" above to connect states.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
