import React, { useState, useMemo, useEffect } from 'react'

const MINDMAP_SHAPES = [
  { id: 'default', label: 'Plain (Text)', icon: 'title', preview: 'Text' },
  { id: 'rounded', label: 'Rounded ()', icon: 'crop_square', preview: '(Round)' },
  { id: 'circle', label: 'Circle (())', icon: 'circle', preview: '((Circle))' },
  { id: 'square', label: 'Box []', icon: 'check_box_outline_blank', preview: '[Box]' },
  { id: 'cloud', label: 'Cloud )(', icon: 'cloud_queue', preview: ')Cloud(' },
  { id: 'bang', label: 'Bang }}{{', icon: 'offline_bolt', preview: '}}Bang{{' }
]

const DEPTH_COLORS = [
  { depth: 1, label: 'L1 Primary', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)' },
  { depth: 2, label: 'L2 Category', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  { depth: 3, label: 'L3 Component', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { depth: 4, label: 'L4 Detail', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { depth: 5, label: 'L5 Leaf', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)' },
  { depth: 6, label: 'L6 Deep', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' }
]

/**
 * High-Fidelity Mindmap & Concept Tree Visual Builder
 * - Prominent Root Central Concept Card
 * - 1-Click Concept Tree Blueprints (Cloud Native Stack, 2026 Roadmap, AppSec Defense)
 * - Color-coded depth hierarchy ribbons (L1 Indigo -> L2 Sky -> L3 Emerald -> L4 Amber -> L5 Purple)
 * - Visual branch guide lines & full-width text inputs
 * - Visual Shape Selectors (Plain, Rounded, Circle, Box, Cloud, Bang)
 * - Hierarchy actions (◀ Promote, ▶ Sub-branch, + Child, ▲ Move Up, ▼ Move Down)
 * - Live Search Filter across tree branches
 * - Two-Way Canvas Node Click Synchronization & Auto-scroll
 */
export default function MindmapVisualBuilder({
  rootTitle = 'Central Concept',
  onRootTitleChange,
  nodes = [],
  onNodesChange,
  selectedNodeId: controlledSelectedNodeId,
  onSelectNodeId
}) {
  const [internalSelectedNodeId, setInternalSelectedNodeId] = useState(nodes[0]?.id || null)
  const isControlled = controlledSelectedNodeId !== undefined
  const selectedNodeId = isControlled ? controlledSelectedNodeId : internalSelectedNodeId

  const setSelectedNodeId = (id) => {
    if (typeof onSelectNodeId === 'function') {
      onSelectNodeId(id)
    }
    if (!isControlled) {
      setInternalSelectedNodeId(id)
    }
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [newTopicText, setNewTopicText] = useState('')
  const [showBlueprints, setShowBlueprints] = useState(false)

  // Auto-scroll selected node into view
  useEffect(() => {
    if (selectedNodeId) {
      const el = document.getElementById(`mm-node-${selectedNodeId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedNodeId])

  // Preset Concept Tree Blueprints
  const PRESET_BLUEPRINTS = [
    {
      label: '☁️ Cloud Architecture',
      root: 'Cloud Native Platform',
      nodes: [
        { text: 'Frontend Layer', depth: 1, shape: 'square' },
        { text: 'Single Page App (React)', depth: 2, shape: 'rounded' },
        { text: 'CDN & Edge Caching', depth: 2, shape: 'rounded' },
        { text: 'API Gateway', depth: 1, shape: 'bang' },
        { text: 'Rate Limiting & WAF', depth: 2, shape: 'default' },
        { text: 'JWT Authentication', depth: 2, shape: 'default' },
        { text: 'Microservices', depth: 1, shape: 'square' },
        { text: 'Auth Service', depth: 2, shape: 'default' },
        { text: 'Order Processing', depth: 2, shape: 'default' },
        { text: 'Payment Engine', depth: 2, shape: 'default' },
        { text: 'Data & Storage', depth: 1, shape: 'cloud' },
        { text: 'PostgreSQL Primary', depth: 2, shape: 'rounded' },
        { text: 'Redis Session Cache', depth: 2, shape: 'rounded' },
        { text: 'DevOps & Observability', depth: 1, shape: 'circle' },
        { text: 'Kubernetes Cluster', depth: 2, shape: 'default' },
        { text: 'Prometheus & Grafana', depth: 2, shape: 'default' }
      ]
    },
    {
      label: '🚀 2026 Tech Roadmap',
      root: 'Engineering Vision 2026',
      nodes: [
        { text: 'Q1: Foundation & Reliability', depth: 1, shape: 'rounded' },
        { text: 'Zero-Downtime Deployments', depth: 2, shape: 'default' },
        { text: 'Database Sharding Proof', depth: 2, shape: 'default' },
        { text: 'Q2: Global Scalability', depth: 1, shape: 'rounded' },
        { text: 'Multi-Region Replication', depth: 2, shape: 'default' },
        { text: 'Edge Computing Services', depth: 2, shape: 'default' },
        { text: 'Q3: AI Acceleration', depth: 1, shape: 'bang' },
        { text: 'Semantic Search Embeddings', depth: 2, shape: 'default' },
        { text: 'Autonomous Coding Agents', depth: 2, shape: 'default' },
        { text: 'Q4: Enterprise Security', depth: 1, shape: 'cloud' },
        { text: 'SOC2 Type II Audit', depth: 2, shape: 'default' },
        { text: 'End-to-End Encryption', depth: 2, shape: 'default' }
      ]
    },
    {
      label: '🛡️ Zero Trust AppSec',
      root: 'Zero Trust Security Model',
      nodes: [
        { text: 'Identity Verification', depth: 1, shape: 'bang' },
        { text: 'MFA & WebAuthn', depth: 2, shape: 'default' },
        { text: 'Conditional Access Policies', depth: 2, shape: 'default' },
        { text: 'Network Segmentation', depth: 1, shape: 'square' },
        { text: 'Micro-perimeters & mTLS', depth: 2, shape: 'default' },
        { text: 'Service Mesh Mesh-wide Auth', depth: 2, shape: 'default' },
        { text: 'Data Protection', depth: 1, shape: 'cloud' },
        { text: 'Envelope Encryption at Rest', depth: 2, shape: 'default' },
        { text: 'Automated Secrets Rotation', depth: 2, shape: 'default' }
      ]
    }
  ]

  // Apply Blueprint
  const handleApplyBlueprint = (bp) => {
    onRootTitleChange(bp.root)
    const newNodes = bp.nodes.map((n, idx) => ({
      id: `mm_${Date.now()}_${idx}`,
      text: n.text,
      depth: n.depth || 1,
      shape: n.shape || 'default'
    }))
    onNodesChange(newNodes)
    if (newNodes[0]) setSelectedNodeId(newNodes[0].id)
    setShowBlueprints(false)
  }

  // Add Branch Node (Root Level)
  const handleAddRootBranch = () => {
    if (!newTopicText.trim()) return
    const newNode = {
      id: `mm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: newTopicText.trim(),
      depth: 1,
      shape: 'default'
    }
    onNodesChange([...nodes, newNode])
    setSelectedNodeId(newNode.id)
    setNewTopicText('')
  }

  // Add Child to a specific node
  const handleAddChild = (index) => {
    const parentNode = nodes[index]
    const newNode = {
      id: `mm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: 'New Subtopic',
      depth: Math.min(6, (parentNode?.depth || 1) + 1),
      shape: 'default'
    }
    const updated = [...nodes]
    updated.splice(index + 1, 0, newNode)
    onNodesChange(updated)
    setSelectedNodeId(newNode.id)
  }

  // Update Node
  const handleUpdateNode = (id, updates) => {
    onNodesChange(nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)))
  }

  // Delete Node
  const handleDeleteNode = (id) => {
    onNodesChange(nodes.filter((n) => n.id !== id))
    if (selectedNodeId === id) {
      const remaining = nodes.filter((n) => n.id !== id)
      setSelectedNodeId(remaining[0]?.id || null)
    }
  }

  // Indent (increase depth)
  const handleIndent = (index) => {
    const node = nodes[index]
    if (!node || node.depth >= 6) return
    handleUpdateNode(node.id, { depth: node.depth + 1 })
  }

  // Outdent (decrease depth)
  const handleOutdent = (index) => {
    const node = nodes[index]
    if (!node || node.depth <= 1) return
    handleUpdateNode(node.id, { depth: node.depth - 1 })
  }

  // Move Node Up/Down
  const handleMove = (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= nodes.length) return
    const updated = [...nodes]
    const temp = updated[index]
    updated[index] = updated[target]
    updated[target] = temp
    onNodesChange(updated)
  }

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes
    const q = searchQuery.toLowerCase()
    return nodes.filter((n) => n.text.toLowerCase().includes(q))
  }, [nodes, searchQuery])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. CENTRAL ROOT TOPIC CARD */}
      <div className="mm-root-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#818cf8' }}>
              adjust
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Root Central Concept
            </span>
          </div>

          {/* 1-Click Blueprints */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => setShowBlueprints(!showBlueprints)}
              style={{ padding: '3px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#818cf8' }}>psychology</span>
              <span>+ Blueprint</span>
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
                  Mindmap Tree Blueprints
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
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{bp.label}</span>
                    <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Root: {bp.root}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          type="text"
          className="studio-text-input mm-root-input"
          value={rootTitle}
          onChange={(e) => onRootTitleChange(e.target.value)}
          placeholder="Mindmap Root (e.g. Architecture Vision 2026)"
        />
      </div>

      {/* 2. HIERARCHICAL BRANCH OUTLINE & CONTROLS */}
      <div className="mm-outline-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#38bdf8' }}>
              account_tree
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>
              Concept Tree & Branches ({nodes.length})
            </span>
          </div>

          {/* Quick Add Main Branch */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              className="studio-text-input"
              value={newTopicText}
              onChange={(e) => setNewTopicText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRootBranch()}
              placeholder="+ Main Branch..."
              style={{ width: '140px', fontSize: '11px', padding: '3px 8px' }}
            />
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-primary"
              onClick={handleAddRootBranch}
              style={{ padding: '3px 10px', fontSize: '11px' }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
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
            placeholder="Search branches across tree..."
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

        {/* Tree Branch Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredNodes.map((node) => {
            const index = nodes.findIndex((n) => n.id === node.id)
            const isSelected = selectedNodeId === node.id
            const depthConfig = DEPTH_COLORS[(node.depth || 1) - 1] || DEPTH_COLORS[0]
            const indentPx = Math.max(0, (node.depth - 1) * 22)

            return (
              <div
                key={node.id}
                id={`mm-node-${node.id}`}
                onClick={() => setSelectedNodeId(node.id)}
                className={`mm-node-card ${isSelected ? 'is-selected' : ''}`}
                style={{
                  marginLeft: `${indentPx}px`,
                  borderLeft: `3px solid ${depthConfig.color}`
                }}
              >
                {/* Visual Branch Depth Guide */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    <span style={{ color: depthConfig.color, fontSize: '12px', fontWeight: 700 }}>
                      {node.depth > 1 ? '└─' : '●'}
                    </span>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        color: depthConfig.color,
                        background: depthConfig.bg,
                        padding: '1px 5px',
                        borderRadius: '3px'
                      }}
                    >
                      {depthConfig.label}
                    </span>
                  </div>

                  {/* Text Input */}
                  <input
                    type="text"
                    className="studio-text-input"
                    value={node.text}
                    onChange={(e) => handleUpdateNode(node.id, { text: e.target.value })}
                    placeholder="Topic / Concept"
                    style={{
                      flex: 1,
                      fontSize: node.depth === 1 ? '12px' : '11.5px',
                      fontWeight: node.depth === 1 ? 600 : 400,
                      padding: '4px 8px',
                      color: '#f8fafc'
                    }}
                  />

                  {/* Shape Selector */}
                  <select
                    className="cls-visibility-select"
                    value={node.shape || 'default'}
                    onChange={(e) => handleUpdateNode(node.id, { shape: e.target.value })}
                    style={{ width: '85px', fontSize: '10.5px', padding: '3px 4px', textAlign: 'left' }}
                    title="Node Shape"
                  >
                    {MINDMAP_SHAPES.map((s) => (
                      <option key={s.id} value={s.id}>{s.preview}</option>
                    ))}
                  </select>

                  {/* Hierarchy Navigation: Promote, Indent, +Child */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOutdent(index)
                      }}
                      disabled={node.depth <= 1}
                      title="Promote level (Outdent ◀)"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>chevron_left</span>
                    </button>
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleIndent(index)
                      }}
                      disabled={node.depth >= 6}
                      title="Sub-branch (Indent ▶)"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>chevron_right</span>
                    </button>
                    <button
                      type="button"
                      className="studio-shell-btn studio-shell-btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddChild(index)
                      }}
                      style={{ padding: '2px 6px', fontSize: '10px', color: '#38bdf8' }}
                      title="Add child branch directly below"
                    >
                      +child
                    </button>

                    {/* Move Up/Down */}
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
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMove(index, 1)
                      }}
                      disabled={index === nodes.length - 1}
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_downward</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNode(node.id)
                      }}
                      className="seq-icon-action-btn delete"
                      title="Delete branch"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredNodes.length === 0 && (
            <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>
              No branches found. Add a branch above or select a blueprint preset.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
