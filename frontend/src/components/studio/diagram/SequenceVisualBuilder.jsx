import React, { useState, useMemo, useEffect } from 'react'

/**
 * High-Fidelity Sequence Diagram Visual Builder
 * - Reorderable Lifeline Participants with architecture roles & quick-add presets
 * - Spacious 2-line Step Cards with route flow selector and full-width payload inputs
 * - Compact Timeline View for rapid scanning of long sequences
 * - Smart Response step insertion (auto-inverts source & target with 200 OK)
 * - Live filter/search bar across timeline calls
 * - Lifeline activation toggles and quick payload chips
 * - Two-way canvas click synchronization & smooth auto-scroll
 */
export default function SequenceVisualBuilder({
  autonumber = true,
  onAutonumberChange,
  participants = [],
  onParticipantsChange,
  messages = [],
  onMessagesChange,
  selectedMessageId,
  onSelectMessageId,
  selectedParticipantId,
  onSelectParticipantId
}) {
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'compact'
  const [searchQuery, setSearchQuery] = useState('')
  const [newPartName, setNewPartName] = useState('')
  const [newPartAlias, setNewPartAlias] = useState('')
  const [newPartType, setNewPartType] = useState('participant')
  const [showAddCustomParticipant, setShowAddCustomParticipant] = useState(false)

  // Auto-scroll selected step card into view when clicked on canvas or compact list
  useEffect(() => {
    if (selectedMessageId) {
      const el = document.getElementById(`seq-step-${selectedMessageId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedMessageId])

  // Get Role Icon for Participant
  const getParticipantIcon = (type, name = '', alias = '') => {
    const lower = `${name} ${alias}`.toLowerCase()
    if (type === 'actor' || lower.includes('user') || lower.includes('client') || lower.includes('human')) return 'person'
    if (lower.includes('spa') || lower.includes('web') || lower.includes('front') || lower.includes('browser') || lower.includes('app')) return 'devices'
    if (lower.includes('idp') || lower.includes('auth') || lower.includes('oauth') || lower.includes('sso') || lower.includes('security')) return 'security'
    if (lower.includes('db') || lower.includes('database') || lower.includes('sql') || lower.includes('mongo') || lower.includes('store')) return 'database'
    if (lower.includes('api') || lower.includes('gateway') || lower.includes('envoy') || lower.includes('ingress')) return 'hub'
    if (lower.includes('worker') || lower.includes('queue') || lower.includes('kafka') || lower.includes('rabbit')) return 'alt_route'
    return 'dns'
  }

  // Quick Preset Participants
  const PRESET_PARTICIPANTS = [
    { name: 'User', alias: 'End User', type: 'actor', label: '+ 👤 End User' },
    { name: 'SPA', alias: 'Single Page App', type: 'participant', label: '+ 💻 SPA Client' },
    { name: 'APIGW', alias: 'API Gateway', type: 'participant', label: '+ ⚙️ API Gateway' },
    { name: 'IdP', alias: 'Auth Provider', type: 'participant', label: '+ 🛡️ Auth IdP' },
    { name: 'Backend', alias: 'Core Service', type: 'participant', label: '+ 🖥️ Core Service' },
    { name: 'DB', alias: 'Database', type: 'participant', label: '+ 🗄️ Database' }
  ]

  // Add Participant
  const handleAddParticipant = (partDef) => {
    const rawName = (partDef?.name || newPartName).trim().replace(/[^a-zA-Z0-9_]/g, '_')
    if (!rawName) return

    // Avoid duplicate names by appending suffix if needed
    let finalName = rawName
    let count = 1
    while (participants.some((p) => p.name.toLowerCase() === finalName.toLowerCase())) {
      finalName = `${rawName}_${count++}`
    }

    const newP = {
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: partDef?.type || newPartType,
      name: finalName,
      alias: (partDef?.alias || newPartAlias || finalName).trim()
    }
    onParticipantsChange([...participants, newP])
    setNewPartName('')
    setNewPartAlias('')
    setShowAddCustomParticipant(false)
  }

  // Delete Participant
  const handleDeleteParticipant = (id) => {
    onParticipantsChange(participants.filter((p) => p.id !== id))
  }

  // Move Participant Left/Right (controls diagram column ordering!)
  const handleMoveParticipant = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= participants.length) return
    const updated = [...participants]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    onParticipantsChange(updated)
  }

  // Add Step: Request, Response, Self-Call, or Note
  const handleAddStep = (kind = 'request') => {
    const p1 = participants[0]?.name || 'User'
    const p2 = participants[1]?.name || p1

    if (kind === 'note') {
      const newNote = {
        id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'note',
        target: p1,
        text: 'Important protocol handshake verification'
      }
      onMessagesChange([...messages, newNote])
      if (onSelectMessageId) onSelectMessageId(newNote.id)
      return
    }

    if (kind === 'response') {
      // Smart Inversion: check the last message and invert from/to!
      const lastMsg = [...messages].reverse().find((m) => m.type !== 'note')
      const respFrom = lastMsg ? lastMsg.to : p2
      const respTo = lastMsg ? lastMsg.from : p1
      const newMsg = {
        id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'message',
        from: respFrom,
        arrow: '-->>',
        to: respTo,
        text: '200 OK (Response Payload JSON)',
        activate: false,
        deactivate: true
      }
      onMessagesChange([...messages, newMsg])
      if (onSelectMessageId) onSelectMessageId(newMsg.id)
      return
    }

    if (kind === 'self') {
      const newMsg = {
        id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        type: 'message',
        from: p2,
        arrow: '->>',
        to: p2,
        text: 'Process token validation & claims',
        activate: false,
        deactivate: false
      }
      onMessagesChange([...messages, newMsg])
      if (onSelectMessageId) onSelectMessageId(newMsg.id)
      return
    }

    // Default Request
    const newMsg = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: 'message',
      from: p1,
      arrow: '->>',
      to: p2,
      text: 'POST /api/v1/resource',
      activate: true,
      deactivate: false
    }
    onMessagesChange([...messages, newMsg])
    if (onSelectMessageId) onSelectMessageId(newMsg.id)
  }

  // Duplicate Step
  const handleDuplicateMessage = (msgId) => {
    const idx = messages.findIndex((m) => m.id === msgId)
    if (idx === -1) return
    const orig = messages[idx]
    const clone = {
      ...orig,
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: orig.text ? `${orig.text} (Copy)` : ''
    }
    const updated = [...messages]
    updated.splice(idx + 1, 0, clone)
    onMessagesChange(updated)
    if (onSelectMessageId) onSelectMessageId(clone.id)
  }

  // Update Message
  const handleUpdateMessage = (msgId, updates) => {
    onMessagesChange(messages.map((m) => (m.id === msgId ? { ...m, ...updates } : m)))
  }

  // Delete Message
  const handleDeleteMessage = (msgId) => {
    onMessagesChange(messages.filter((m) => m.id !== msgId))
  }

  // Move Message Up/Down
  const handleMoveMessage = (idx, direction) => {
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= messages.length) return
    const updated = [...messages]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    onMessagesChange(updated)
  }

  // Filter messages by search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages
    const q = searchQuery.trim().toLowerCase()
    return messages.filter(
      (m) =>
        (m.text && m.text.toLowerCase().includes(q)) ||
        (m.from && m.from.toLowerCase().includes(q)) ||
        (m.to && m.to.toLowerCase().includes(q)) ||
        (m.target && m.target.toLowerCase().includes(q))
    )
  }, [messages, searchQuery])

  // Selected message for compact mode detail view
  const activeSelectedMsg = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId) || messages[0] || null
  }, [messages, selectedMessageId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ---------------- 1. LIFELINE PARTICIPANTS (COLUMNS) ---------------- */}
      <div className="seq-participants-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#38bdf8' }}>group</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
              Lifeline Columns & Participants ({participants.length})
            </span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>(Reorder controls diagram columns left-to-right)</span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autonumber}
              onChange={(e) => onAutonumberChange && onAutonumberChange(e.target.checked)}
            />
            <span>Autonumber Steps</span>
          </label>
        </div>

        {/* Existing Participants Chips with Reorder Left/Right */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {participants.map((p, pIdx) => {
            const isActor = p.type === 'actor'
            const isSelected = selectedParticipantId === p.id
            const iconName = getParticipantIcon(p.type, p.name, p.alias)

            return (
              <div
                key={p.id}
                className={`seq-participant-chip ${isActor ? 'is-actor' : 'is-service'} ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectParticipantId && onSelectParticipantId(p.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                  {iconName}
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                  <span style={{ fontWeight: 600, fontSize: '11px' }}>{p.name}</span>
                  {p.alias && p.alias !== p.name && (
                    <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>{p.alias}</span>
                  )}
                </div>

                {/* Left/Right Reordering */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1px', marginLeft: '4px' }}>
                  <button
                    type="button"
                    disabled={pIdx === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveParticipant(pIdx, -1)
                    }}
                    title="Move column left in diagram"
                    className="seq-icon-mini-btn"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    disabled={pIdx === participants.length - 1}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMoveParticipant(pIdx, 1)
                    }}
                    title="Move column right in diagram"
                    className="seq-icon-mini-btn"
                  >
                    ▶
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteParticipant(p.id)
                    }}
                    title="Remove participant"
                    className="seq-icon-mini-btn delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Add Presets Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Quick Add:</span>
          {PRESET_PARTICIPANTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="seq-preset-chip"
              onClick={() => handleAddParticipant(preset)}
              title={`Add ${preset.alias} lifeline`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className="seq-preset-chip custom"
            onClick={() => setShowAddCustomParticipant((prev) => !prev)}
          >
            {showAddCustomParticipant ? '✕ Cancel' : '+ Custom Column'}
          </button>
        </div>

        {/* Custom Add Participant Input (Foldable) */}
        {showAddCustomParticipant && (
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.25)', padding: '8px', borderRadius: '5px', marginTop: '4px' }}>
            <select
              className="studio-text-input"
              value={newPartType}
              onChange={(e) => setNewPartType(e.target.value)}
              style={{ width: '100px', fontSize: '11px', padding: '4px 6px' }}
            >
              <option value="participant">Service Box</option>
              <option value="actor">Actor (User)</option>
            </select>

            <input
              type="text"
              className="studio-text-input"
              placeholder="Identifier (e.g. Cache)"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              style={{ flex: 1, minWidth: '90px', fontSize: '11px', padding: '4px 8px' }}
            />

            <input
              type="text"
              className="studio-text-input"
              placeholder="Display Label (e.g. Redis Cache)"
              value={newPartAlias}
              onChange={(e) => setNewPartAlias(e.target.value)}
              style={{ flex: 1.5, minWidth: '120px', fontSize: '11px', padding: '4px 8px' }}
            />

            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-primary"
              onClick={() => handleAddParticipant()}
              style={{ padding: '4px 12px', fontSize: '11px' }}
            >
              Save Column
            </button>
          </div>
        )}
      </div>

      {/* ---------------- 2. SEQUENCE TIMELINE & CONTROLS ---------------- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Section Header with View Mode and Quick Step Generators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sequence Timeline ({messages.length})
            </span>

            {/* View Mode Switcher */}
            <div className="seq-view-toggle">
              <button
                type="button"
                className={`seq-view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                title="Spacious step cards with route selector and full message inputs"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>view_agenda</span>
                <span>Cards</span>
              </button>
              <button
                type="button"
                className={`seq-view-btn ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => setViewMode('compact')}
                title="Compact timeline list for rapid scanning"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>table_rows</span>
                <span>Compact</span>
              </button>
            </div>
          </div>

          {/* Quick Insert Actions */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => handleAddStep('request')}
              title="Add a synchronous request call (──>>)"
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#818cf8' }}>arrow_forward</span>
              <span>+ Request</span>
            </button>

            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => handleAddStep('response')}
              title="Smart response: automatically inverts source & target with 200 OK (┄┄>>)"
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#10b981' }}>arrow_back</span>
              <span>+ Response</span>
            </button>

            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => handleAddStep('self')}
              title="Add internal loop/self call on the same participant"
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#38bdf8' }}>replay</span>
              <span>+ Loop</span>
            </button>

            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => handleAddStep('note')}
              title="Add documentation sticky note over a lifeline"
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#f59e0b' }}>sticky_note_2</span>
              <span>+ Note</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface-base)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748b' }}>search</span>
          <input
            type="text"
            className="seq-search-input"
            placeholder="Filter sequence steps (e.g. token, auth, /oauth, 200)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '11.5px', outline: 'none' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
            >
              ✕
            </button>
          )}
          <span style={{ fontSize: '10.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
            {filteredMessages.length} / {messages.length} steps
          </span>
        </div>

        {/* ---------------- 3A. VIEW MODE: FLOW CARDS ---------------- */}
        {viewMode === 'cards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredMessages.map((msg, fIdx) => {
              const actualIdx = messages.findIndex((m) => m.id === msg.id)
              const isSelected = selectedMessageId === msg.id

              if (msg.type === 'note') {
                return (
                  <div
                    key={msg.id}
                    id={`seq-step-${msg.id}`}
                    className={`seq-note-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => onSelectMessageId && onSelectMessageId(msg.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#f59e0b' }}>sticky_note_2</span>
                        <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>
                          NOTE OVER LIFELINE
                        </span>
                        <select
                          className="seq-select"
                          value={msg.target}
                          onChange={(e) => handleUpdateMessage(msg.id, { target: e.target.value })}
                          style={{ maxWidth: '160px' }}
                        >
                          {participants.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.alias ? `${p.name} (${p.alias})` : p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button
                          type="button"
                          disabled={actualIdx === 0}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveMessage(actualIdx, -1)
                          }}
                          className="seq-icon-action-btn"
                          title="Move step up"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          disabled={actualIdx === messages.length - 1}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoveMessage(actualIdx, 1)
                          }}
                          className="seq-icon-action-btn"
                          title="Move step down"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_downward</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteMessage(msg.id)
                          }}
                          className="seq-icon-action-btn delete"
                          title="Delete note"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      className="seq-text-input"
                      value={msg.text}
                      onChange={(e) => handleUpdateMessage(msg.id, { text: e.target.value })}
                      placeholder="Enter sticky note annotation text..."
                      style={{ width: '100%' }}
                    />
                  </div>
                )
              }

              // Message Step Card
              return (
                <div
                  key={msg.id}
                  id={`seq-step-${msg.id}`}
                  className={`seq-step-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => onSelectMessageId && onSelectMessageId(msg.id)}
                >
                  {/* Top Header: Route Bar (From -> Arrow -> To) & Action Buttons */}
                  <div className="seq-step-header">
                    <div className="seq-step-left">
                      <span className="seq-step-badge">
                        #{actualIdx + 1}
                      </span>

                      {/* Route Bar */}
                      <div className="seq-route-bar">
                        {/* Source Participant */}
                        <select
                          className="seq-select"
                          value={msg.from}
                          onChange={(e) => handleUpdateMessage(msg.id, { from: e.target.value })}
                          title="Source Lifeline (From)"
                        >
                          {participants.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.alias ? `${p.name} (${p.alias})` : p.name}
                            </option>
                          ))}
                        </select>

                        {/* Arrow Type */}
                        <select
                          className="seq-arrow-select"
                          value={msg.arrow || '->>'}
                          onChange={(e) => handleUpdateMessage(msg.id, { arrow: e.target.value })}
                          title="Protocol Call Style"
                        >
                          <option value="->>">──&gt;&gt; Sync Request</option>
                          <option value="-->>">┄┄&gt;&gt; Reply / Return</option>
                          <option value="->">──&gt; Async Message</option>
                          <option value="-->">┄┄&gt; Dotted Event</option>
                          <option value="-x">──x Failed / Abort</option>
                        </select>

                        {/* Target Participant */}
                        <select
                          className="seq-select"
                          value={msg.to}
                          onChange={(e) => handleUpdateMessage(msg.id, { to: e.target.value })}
                          title="Target Lifeline (To)"
                        >
                          {participants.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.alias ? `${p.name} (${p.alias})` : p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Step Action Buttons */}
                    <div className="seq-step-actions">
                      <button
                        type="button"
                        disabled={actualIdx === 0}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMoveMessage(actualIdx, -1)
                        }}
                        className="seq-icon-action-btn"
                        title="Move step earlier in timeline"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_upward</span>
                      </button>

                      <button
                        type="button"
                        disabled={actualIdx === messages.length - 1}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMoveMessage(actualIdx, 1)
                        }}
                        className="seq-icon-action-btn"
                        title="Move step later in timeline"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_downward</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDuplicateMessage(msg.id)
                        }}
                        className="seq-icon-action-btn"
                        title="Duplicate step"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>content_copy</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteMessage(msg.id)
                        }}
                        className="seq-icon-action-btn delete"
                        title="Delete step"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Body: Full-Width Message Payload Input */}
                  <div className="seq-msg-body">
                    <input
                      type="text"
                      className="seq-text-input"
                      value={msg.text}
                      onChange={(e) => handleUpdateMessage(msg.id, { text: e.target.value })}
                      placeholder="e.g. POST /oauth/token (code, code_verifier) or Click Login..."
                    />
                  </div>

                  {/* Footer: Quick Chips & Activation Toggles */}
                  <div className="seq-step-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>Snippets:</span>
                      <button
                        type="button"
                        className="seq-snippet-chip"
                        onClick={() => handleUpdateMessage(msg.id, { text: '200 OK (Payload)' })}
                      >
                        200 OK
                      </button>
                      <button
                        type="button"
                        className="seq-snippet-chip"
                        onClick={() => handleUpdateMessage(msg.id, { text: '401 Unauthorized' })}
                      >
                        401 Err
                      </button>
                      <button
                        type="button"
                        className="seq-snippet-chip"
                        onClick={() => handleUpdateMessage(msg.id, { text: `${msg.text || ''} (Bearer Token)`.trim() })}
                      >
                        + Token
                      </button>
                      <button
                        type="button"
                        className="seq-snippet-chip"
                        onClick={() => handleUpdateMessage(msg.id, { text: `${msg.text || ''} { JSON }`.trim() })}
                      >
                        + JSON
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: msg.activate ? '#818cf8' : '#94a3b8', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(msg.activate)}
                          onChange={(e) => handleUpdateMessage(msg.id, { activate: e.target.checked })}
                        />
                        <span>⚡ Activate</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: msg.deactivate ? '#38bdf8' : '#94a3b8', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(msg.deactivate)}
                          onChange={(e) => handleUpdateMessage(msg.id, { deactivate: e.target.checked })}
                        />
                        <span>⚡ Deactivate</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ---------------- 3B. VIEW MODE: COMPACT FLOW LIST ---------------- */}
        {viewMode === 'compact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="seq-compact-table">
              {filteredMessages.map((msg, fIdx) => {
                const actualIdx = messages.findIndex((m) => m.id === msg.id)
                const isSelected = selectedMessageId === msg.id

                return (
                  <div
                    key={msg.id}
                    id={`seq-step-${msg.id}`}
                    className={`seq-compact-row ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => onSelectMessageId && onSelectMessageId(msg.id)}
                  >
                    <span className="seq-step-badge">#{actualIdx + 1}</span>

                    {msg.type === 'note' ? (
                      <span style={{ color: '#f59e0b', fontSize: '11px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        📝 Note over <strong>{msg.target}</strong>: {msg.text}
                      </span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                        <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '11px' }}>{msg.from}</span>
                        <span style={{ color: '#818cf8', fontFamily: 'monospace', fontSize: '11px' }}>{msg.arrow}</span>
                        <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '11px' }}>{msg.to}:</span>
                        <span style={{ color: '#94a3b8', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {msg.text}
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <button
                        type="button"
                        disabled={actualIdx === 0}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMoveMessage(actualIdx, -1)
                        }}
                        className="seq-icon-action-btn"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={actualIdx === messages.length - 1}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMoveMessage(actualIdx, 1)
                        }}
                        className="seq-icon-action-btn"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteMessage(msg.id)
                        }}
                        className="seq-icon-action-btn delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Focused Step Inspector for Compact Mode */}
            {activeSelectedMsg && (
              <div className="seq-focused-editor">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Focused Step Detail Inspector
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Step ID: {activeSelectedMsg.id}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <select
                    className="seq-select"
                    value={activeSelectedMsg.from}
                    onChange={(e) => handleUpdateMessage(activeSelectedMsg.id, { from: e.target.value })}
                  >
                    {participants.map((p) => (
                      <option key={p.id} value={p.name}>{p.alias ? `${p.name} (${p.alias})` : p.name}</option>
                    ))}
                  </select>

                  <select
                    className="seq-arrow-select"
                    value={activeSelectedMsg.arrow || '->>'}
                    onChange={(e) => handleUpdateMessage(activeSelectedMsg.id, { arrow: e.target.value })}
                  >
                    <option value="->>">──&gt;&gt; Sync Request</option>
                    <option value="-->>">┄┄&gt;&gt; Reply / Return</option>
                    <option value="->">──&gt; Async Message</option>
                    <option value="-->">┄┄&gt; Dotted Event</option>
                    <option value="-x">──x Failed / Abort</option>
                  </select>

                  <select
                    className="seq-select"
                    value={activeSelectedMsg.to}
                    onChange={(e) => handleUpdateMessage(activeSelectedMsg.id, { to: e.target.value })}
                  >
                    {participants.map((p) => (
                      <option key={p.id} value={p.name}>{p.alias ? `${p.name} (${p.alias})` : p.name}</option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  className="seq-text-input"
                  value={activeSelectedMsg.text}
                  onChange={(e) => handleUpdateMessage(activeSelectedMsg.id, { text: e.target.value })}
                  placeholder="Enter message call or payload..."
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        )}

        {messages.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', background: 'var(--surface-base)', borderRadius: '8px', color: '#94a3b8', fontSize: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#6366f1', display: 'block', margin: '0 auto 8px' }}>
              schema
            </span>
            <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#f8fafc' }}>No steps in sequence timeline</p>
            <p style={{ margin: '0 0 14px', fontSize: '11px', color: '#64748b' }}>
              Click <strong>"+ Request"</strong> above to record your first message step or choose a quick column preset!
            </p>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-primary"
              onClick={() => handleAddStep('request')}
              style={{ padding: '6px 14px', fontSize: '11px' }}
            >
              + Add First Request Step
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
