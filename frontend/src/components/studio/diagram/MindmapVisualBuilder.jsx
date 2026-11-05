import React, { useState, useMemo, useEffect } from 'react'

export const MINDMAP_SHAPES = [
  { id: 'default', label: 'Plain', icon: 'format_size', preview: 'Text', syntax: 'text' },
  { id: 'rounded', label: 'Rounded', icon: 'rectangle', preview: '(Round)', syntax: '(text)' },
  { id: 'circle', label: 'Circle', icon: 'radio_button_unchecked', preview: '((Circle))', syntax: '((text))' },
  { id: 'square', label: 'Box', icon: 'check_box_outline_blank', preview: '[Box]', syntax: '[text]' },
  { id: 'cloud', label: 'Cloud', icon: 'cloud', preview: ')Cloud(', syntax: ')text(' },
  { id: 'bang', label: 'Bang', icon: 'bolt', preview: '))Bang((', syntax: '))text((' },
  { id: 'hexagon', label: 'Hexagon', icon: 'hexagon', preview: '{{Hex}}', syntax: '{{text}}' }
]

const DEPTH_CONFIGS = [
  { depth: 1, label: 'L1 Primary', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.15)' },
  { depth: 2, label: 'L2 Subtopic', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
  { depth: 3, label: 'L3 Component', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  { depth: 4, label: 'L4 Detail', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  { depth: 5, label: 'L5 Leaf', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)' },
  { depth: 6, label: 'L6 Deep', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' }
]

/**
 * Professional Mindmap & Concept Tree Visual Studio
 * - Section 1: Central Root Concept card with shape chips & blueprints
 * - Section 2: Compact Hierarchical Tree Outline (foldable branches, depth badges, child counters, search)
 * - Section 3: Focused Branch Inspector (dedicated shape chips, rename, promote/indent, reorder, add sibling/child)
 */
export default function MindmapVisualBuilder({
  rootTitle = 'Central Concept',
  onRootTitleChange,
  rootShape = 'circle',
  onRootShapeChange,
  nodes = [],
  onNodesChange,
  onBatchChange,
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
  const [collapsedIds, setCollapsedIds] = useState(new Set())

  // Keep selected node synced if current node gets deleted or list updates
  useEffect(() => {
    if (nodes.length > 0) {
      if (!selectedNodeId || !nodes.some((n) => n.id === selectedNodeId)) {
        setSelectedNodeId(nodes[0].id)
      }
    } else {
      setSelectedNodeId(null)
    }
  }, [nodes, selectedNodeId])

  // Preset Architecture Blueprints (Clean Material Icons, No Emojis)
  const PRESET_BLUEPRINTS = [
    {
      label: 'Cloud Architecture',
      icon: 'cloud',
      root: 'Cloud Native Platform',
      rootShape: 'circle',
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
      label: 'Tech Roadmap 2026',
      icon: 'rocket_launch',
      root: 'Engineering Vision 2026',
      rootShape: 'hexagon',
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
      label: 'Zero Trust AppSec',
      icon: 'security',
      root: 'Zero Trust Security Model',
      rootShape: 'bang',
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
    const newNodes = bp.nodes.map((n, idx) => ({
      id: `mm_${Date.now()}_${idx}`,
      text: n.text,
      depth: n.depth || 1,
      shape: n.shape || 'default'
    }))

    if (typeof onBatchChange === 'function') {
      onBatchChange({
        rootTitle: bp.root,
        rootShape: bp.rootShape || 'circle',
        nodes: newNodes
      })
    } else {
      if (typeof onRootTitleChange === 'function') onRootTitleChange(bp.root)
      if (typeof onRootShapeChange === 'function') onRootShapeChange(bp.rootShape || 'circle')
      onNodesChange(newNodes)
    }

    if (newNodes[0]) setSelectedNodeId(newNodes[0].id)
    setShowBlueprints(false)
    setCollapsedIds(new Set())
  }

  // Update Root Concept
  const handleRootTitleUpdate = (newTitle) => {
    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle: newTitle, rootShape, nodes })
    } else if (typeof onRootTitleChange === 'function') {
      onRootTitleChange(newTitle)
    }
  }

  const handleRootShapeUpdate = (newShape) => {
    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle, rootShape: newShape, nodes })
    } else if (typeof onRootShapeChange === 'function') {
      onRootShapeChange(newShape)
    }
  }

  // Add Root Branch (Level 1)
  const handleAddRootBranch = () => {
    if (!newTopicText.trim()) return
    const newNode = {
      id: `mm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: newTopicText.trim(),
      depth: 1,
      shape: 'default'
    }
    const nextNodes = [...nodes, newNode]

    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle, rootShape, nodes: nextNodes })
    } else {
      onNodesChange(nextNodes)
    }

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
    const nextNodes = [...nodes]
    nextNodes.splice(index + 1, 0, newNode)

    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle, rootShape, nodes: nextNodes })
    } else {
      onNodesChange(nextNodes)
    }

    // Ensure parent is expanded so new child is visible
    if (parentNode) {
      setCollapsedIds((prev) => {
        const next = new Set(prev)
        next.delete(parentNode.id)
        return next
      })
    }

    setSelectedNodeId(newNode.id)
  }

  // Add Sibling directly below a specific node
  const handleAddSibling = (index) => {
    const currentNode = nodes[index]
    const newNode = {
      id: `mm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: 'New Topic',
      depth: currentNode?.depth || 1,
      shape: 'default'
    }
    const nextNodes = [...nodes]
    nextNodes.splice(index + 1, 0, newNode)

    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle, rootShape, nodes: nextNodes })
    } else {
      onNodesChange(nextNodes)
    }

    setSelectedNodeId(newNode.id)
  }

  // Update Node
  const handleUpdateNode = (id, updates) => {
    const nextNodes = nodes.map((n) => (n.id === id ? { ...n, ...updates } : n))
    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle, rootShape, nodes: nextNodes })
    } else {
      onNodesChange(nextNodes)
    }
  }

  // Delete Node
  const handleDeleteNode = (id) => {
    const remaining = nodes.filter((n) => n.id !== id)
    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle, rootShape, nodes: remaining })
    } else {
      onNodesChange(remaining)
    }

    if (selectedNodeId === id) {
      setSelectedNodeId(remaining[0]?.id || null)
    }
  }

  // Indent (increase depth -> subtopic)
  const handleIndent = (index) => {
    const node = nodes[index]
    if (!node || node.depth >= 6) return
    handleUpdateNode(node.id, { depth: node.depth + 1 })
  }

  // Outdent (decrease depth -> promote)
  const handleOutdent = (index) => {
    const node = nodes[index]
    if (!node || node.depth <= 1) return
    handleUpdateNode(node.id, { depth: node.depth - 1 })
  }

  // Move Node Up/Down
  const handleMove = (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= nodes.length) return
    const nextNodes = [...nodes]
    const temp = nextNodes[index]
    nextNodes[index] = nextNodes[target]
    nextNodes[target] = temp

    if (typeof onBatchChange === 'function') {
      onBatchChange({ rootTitle, rootShape, nodes: nextNodes })
    } else {
      onNodesChange(nextNodes)
    }
  }

  // Toggle Collapse / Expand
  const toggleCollapse = (id) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Collapse / Expand All
  const handleExpandAll = () => setCollapsedIds(new Set())
  const handleCollapseAll = () => {
    const parentIds = new Set()
    for (let i = 0; i < nodes.length - 1; i++) {
      if (nodes[i + 1].depth > nodes[i].depth) {
        parentIds.add(nodes[i].id)
      }
    }
    setCollapsedIds(parentIds)
  }

  // Calculate child count for each node in flat list
  const nodeChildCounts = useMemo(() => {
    const map = new Map()
    for (let i = 0; i < nodes.length; i++) {
      const currentDepth = nodes[i].depth || 1
      let count = 0
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[j].depth <= currentDepth) break
        count++
      }
      map.set(nodes[i].id, count)
    }
    return map
  }, [nodes])

  // Filtered and Folded Tree Nodes
  const visibleNodes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const result = []
    let hiddenUnderDepth = null

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const depth = node.depth || 1

      // Search filter bypasses folding for visibility
      if (query) {
        if ((node.text || '').toLowerCase().includes(query)) {
          result.push({ node, index: i, hasChildren: (nodeChildCounts.get(node.id) || 0) > 0 })
        }
        continue
      }

      // Check if node is inside a collapsed ancestor
      if (hiddenUnderDepth !== null) {
        if (depth > hiddenUnderDepth) {
          continue // Skip collapsed descendant
        } else {
          hiddenUnderDepth = null // Exited collapsed subtree
        }
      }

      const hasChildren = (nodeChildCounts.get(node.id) || 0) > 0
      result.push({ node, index: i, hasChildren })

      if (hasChildren && collapsedIds.has(node.id)) {
        hiddenUnderDepth = depth
      }
    }

    return result
  }, [nodes, searchQuery, collapsedIds, nodeChildCounts])

  // Active Selected Node & Index
  const selectedIndex = nodes.findIndex((n) => n.id === selectedNodeId)
  const selectedNode = selectedIndex !== -1 ? nodes[selectedIndex] : null
  const selectedDepthConfig = selectedNode ? (DEPTH_CONFIGS[(selectedNode.depth || 1) - 1] || DEPTH_CONFIGS[0]) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* =========================================================================
          1. CENTRAL ROOT CONCEPT CARD
         ========================================================================= */}
      <div
        style={{
          background: 'var(--surface-base)',
          border: '1px solid #818cf8',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 0 16px rgba(129, 140, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#818cf8' }}>
              adjust
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Root Central Concept
            </span>
          </div>

          {/* Blueprints Menu */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => setShowBlueprints(!showBlueprints)}
              style={{ padding: '3px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#818cf8' }}>library_books</span>
              <span>Blueprints</span>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>expand_more</span>
            </button>

            {showBlueprints && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '30px',
                  zIndex: 40,
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '6px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.65)',
                  minWidth: '230px',
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Architecture Blueprints
                </div>
                {PRESET_BLUEPRINTS.map((bp) => (
                  <button
                    key={bp.label}
                    type="button"
                    onClick={() => handleApplyBlueprint(bp)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 8px',
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
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#818cf8' }}>{bp.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 600 }}>{bp.label}</span>
                      <span style={{ fontSize: '9.5px', color: '#94a3b8' }}>Root: {bp.root}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Root Title Input */}
        <input
          type="text"
          className="studio-text-input"
          value={rootTitle}
          onChange={(e) => handleRootTitleUpdate(e.target.value)}
          placeholder="Mindmap Root (e.g. Platform Engineering, Cloud System)"
          style={{
            fontSize: '13px',
            fontWeight: 700,
            padding: '7px 10px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderColor: 'rgba(129, 140, 248, 0.4)',
            color: '#ffffff'
          }}
        />

        {/* Root Node Shape Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>ROOT SHAPE</span>
          <div className="diagram-shape-chips">
            {MINDMAP_SHAPES.filter((s) => s.id !== 'default').map((sh) => {
              const isActive = (rootShape || 'circle') === sh.id
              return (
                <button
                  key={sh.id}
                  type="button"
                  className={`diagram-shape-chip-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleRootShapeUpdate(sh.id)}
                  title={sh.syntax}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>{sh.icon}</span>
                  <span>{sh.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. HIERARCHICAL MIND TREE OUTLINE
         ========================================================================= */}
      <div
        style={{
          background: 'var(--surface-base)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Outline Header & Quick Add */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#818cf8' }}>
              account_tree
            </span>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#f1f5f9' }}>
              Concept Tree Outline ({nodes.length})
            </span>
          </div>

          {/* Quick Collapse / Expand All */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={collapsedIds.size > 0 ? handleExpandAll : handleCollapseAll}
              style={{ padding: '2px 6px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}
              title={collapsedIds.size > 0 ? 'Expand all folded branches' : 'Collapse all subtopic branches'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                {collapsedIds.size > 0 ? 'unfold_more' : 'unfold_less'}
              </span>
              <span>{collapsedIds.size > 0 ? 'Expand All' : 'Collapse All'}</span>
            </button>
          </div>
        </div>

        {/* Quick Add Main Branch Input */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="text"
            className="studio-text-input"
            value={newTopicText}
            onChange={(e) => setNewTopicText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddRootBranch()}
            placeholder="+ Add main branch (e.g. Infrastructure, Security)..."
            style={{ flex: 1, fontSize: '11px', padding: '4px 8px' }}
          />
          <button
            type="button"
            className="studio-shell-btn studio-shell-btn-primary"
            onClick={handleAddRootBranch}
            style={{
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: '#6366f1',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#ffffff' }}>add</span>
            <span>Add Branch</span>
          </button>
        </div>

        {/* Tree Search Bar */}
        <div style={{ position: 'relative' }}>
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
            placeholder="Filter tree branches..."
            className="studio-text-input"
            style={{ width: '100%', paddingLeft: '28px', fontSize: '11px', height: '28px' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
            </button>
          )}
        </div>

        {/* Compact Tree Rows Container */}
        <div
          style={{
            maxHeight: '340px',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '4px'
          }}
        >
          {visibleNodes.map(({ node, index, hasChildren }) => {
            const isSelected = selectedNodeId === node.id
            const depth = node.depth || 1
            const depthConfig = DEPTH_CONFIGS[depth - 1] || DEPTH_CONFIGS[0]
            const isCollapsed = collapsedIds.has(node.id)
            const childCount = nodeChildCounts.get(node.id) || 0
            const shapeObj = MINDMAP_SHAPES.find((s) => s.id === (node.shape || 'default')) || MINDMAP_SHAPES[0]

            const indentPx = (depth - 1) * 16

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 6px',
                  paddingLeft: `${indentPx + 6}px`,
                  borderRadius: '4px',
                  marginBottom: '2px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid transparent',
                  borderLeft: `3px solid ${depthConfig.color}`,
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {/* Left: Fold toggle / Tree Guide + Depth Badge + Shape + Text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0, flex: 1 }}>
                  {/* Fold toggle if has children, otherwise tree branch connector */}
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleCollapse(node.id)
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        width: '16px',
                        height: '16px'
                      }}
                      title={isCollapsed ? 'Expand subtopics' : 'Collapse subtopics'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                        {isCollapsed ? 'chevron_right' : 'expand_more'}
                      </span>
                    </button>
                  ) : (
                    <span style={{ width: '16px', textAlign: 'center', fontSize: '10px', color: '#64748b' }}>
                      {depth > 1 ? '└' : '•'}
                    </span>
                  )}

                  {/* Depth Pill */}
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: depthConfig.color,
                      background: depthConfig.bg,
                      padding: '1px 4px',
                      borderRadius: '3px',
                      flexShrink: 0
                    }}
                  >
                    L{depth}
                  </span>

                  {/* Shape Mini Icon */}
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '13px', color: depthConfig.color, flexShrink: 0 }}
                    title={`Shape: ${shapeObj.label}`}
                  >
                    {shapeObj.icon}
                  </span>

                  {/* Branch Title Text */}
                  <span
                    style={{
                      fontSize: depth === 1 ? '11.5px' : '11px',
                      fontWeight: isSelected ? 600 : (depth === 1 ? 500 : 400),
                      color: isSelected ? '#ffffff' : '#e2e8f0',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {node.text || 'Untitled Topic'}
                  </span>

                  {/* Children counter */}
                  {hasChildren && (
                    <span
                      style={{
                        fontSize: '9px',
                        color: '#94a3b8',
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '1px 5px',
                        borderRadius: '10px',
                        flexShrink: 0
                      }}
                    >
                      {childCount}
                    </span>
                  )}
                </div>

                {/* Right: Quick actions (+ Child, Delete) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0, marginLeft: '6px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddChild(index)
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#38bdf8',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Add child subtopic directly inside this branch"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNode(node.id)
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Delete branch"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                  </button>
                </div>
              </div>
            )
          })}

          {visibleNodes.length === 0 && (
            <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '16px', textAlign: 'center' }}>
              No branches found. Add a branch above or select a blueprint preset.
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          3. FOCUSED BRANCH INSPECTOR (Dedicated, Clean Control Center)
         ========================================================================= */}
      {selectedNode ? (
        <div
          style={{
            background: 'var(--surface-base)',
            border: `1px solid ${selectedDepthConfig?.color || '#38bdf8'}`,
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: `0 4px 16px rgba(0, 0, 0, 0.35)`
          }}
        >
          {/* Inspector Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: selectedDepthConfig?.color || '#38bdf8' }}>
                tune
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Branch Inspector
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: selectedDepthConfig?.color,
                  background: selectedDepthConfig?.bg,
                  padding: '1px 6px',
                  borderRadius: '3px'
                }}
              >
                {selectedDepthConfig?.label}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                type="button"
                onClick={() => handleAddChild(selectedIndex)}
                className="studio-shell-btn studio-shell-btn-secondary"
                style={{ padding: '3px 8px', fontSize: '10.5px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px' }}
                title="Add a child nested subtopic"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add</span>
                <span>Subtopic</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteNode(selectedNode.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '10.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  cursor: 'pointer'
                }}
                title="Delete this branch and its children"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>delete</span>
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Branch Title Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>TOPIC / BRANCH LABEL</label>
            <input
              type="text"
              className="studio-text-input"
              value={selectedNode.text}
              onChange={(e) => handleUpdateNode(selectedNode.id, { text: e.target.value })}
              placeholder="e.g. Infrastructure as Code, Authentication"
              style={{ fontSize: '12px', padding: '6px 8px', fontWeight: 600 }}
            />
          </div>

          {/* Branch Shape Chips (1-Click Change) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>BRANCH NODE SHAPE</label>
            <div className="diagram-shape-chips">
              {MINDMAP_SHAPES.map((sh) => {
                const isActive = (selectedNode.shape || 'default') === sh.id
                return (
                  <button
                    key={sh.id}
                    type="button"
                    className={`diagram-shape-chip-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleUpdateNode(selectedNode.id, { shape: sh.id })}
                    title={`Format as: ${sh.syntax}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{sh.icon}</span>
                    <span>{sh.preview}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Hierarchy & Reorder Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
            <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>HIERARCHY & POSITION</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-secondary"
                onClick={() => handleOutdent(selectedIndex)}
                disabled={selectedNode.depth <= 1}
                style={{ padding: '3px 8px', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Promote topic to higher level (Outdent ◀)"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>chevron_left</span>
                <span>Promote (◀)</span>
              </button>

              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-secondary"
                onClick={() => handleIndent(selectedIndex)}
                disabled={selectedNode.depth >= 6}
                style={{ padding: '3px 8px', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                title="Nest as subtopic of branch above (Indent ▶)"
              >
                <span>Indent (▶)</span>
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>chevron_right</span>
              </button>

              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-secondary"
                onClick={() => handleMove(selectedIndex, -1)}
                disabled={selectedIndex === 0}
                style={{ padding: '3px 7px', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '3px' }}
                title="Move branch up"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_upward</span>
                <span>Up</span>
              </button>

              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-secondary"
                onClick={() => handleMove(selectedIndex, 1)}
                disabled={selectedIndex === nodes.length - 1}
                style={{ padding: '3px 7px', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '3px' }}
                title="Move branch down"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_downward</span>
                <span>Down</span>
              </button>

              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-secondary"
                onClick={() => handleAddSibling(selectedIndex)}
                style={{ padding: '3px 8px', fontSize: '10.5px', display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto' }}
                title="Add a sibling branch at the same level"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>playlist_add</span>
                <span>+ Sibling</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', background: 'var(--surface-base)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '11.5px', border: '1px dashed var(--border-color)' }}>
          No branch selected. Click a topic in the tree outline above to inspect or edit.
        </div>
      )}
    </div>
  )
}
