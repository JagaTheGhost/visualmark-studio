import React, { useState, useEffect } from 'react'
import { SHAPES, ACCENT_COLORS, TECH_NODE_PRESETS, CONNECTION_STYLES } from './diagramConstants'

export default function FlowchartVisualBuilder({
  direction = 'TD',
  onDirectionChange,
  subgraphs = [],
  onSubgraphsChange,
  nodes = [],
  onNodesChange,
  edges = [],
  onEdgesChange,
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

  const [newClusterTitle, setNewClusterTitle] = useState('')
  const [showClusterCreator, setShowClusterCreator] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  // Sync selectedNodeId if current selected gets deleted or empty
  useEffect(() => {
    if (nodes.length > 0) {
      if (!selectedNodeId || !nodes.some((n) => n.id === selectedNodeId)) {
        setSelectedNodeId(nodes[0].id)
      }
    } else {
      setSelectedNodeId(null)
    }
  }, [nodes, selectedNodeId])

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null
  const selectedNodeEdges = selectedNode ? edges.filter((e) => e.from === selectedNode.id) : []

  // Quick Add Component
  const handleAddPresetComponent = (presetId) => {
    const preset = TECH_NODE_PRESETS.find((p) => p.id === presetId) || {
      name: 'New Service',
      shape: 'box',
      color: '#6366f1'
    }

    const newNodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    const newNode = {
      id: newNodeId,
      name: preset.name,
      shape: preset.shape,
      color: preset.color
    }

    onNodesChange([...nodes, newNode])
    setSelectedNodeId(newNodeId)
  }

  // Rename node
  const handleRenameNode = (id, newName) => {
    onNodesChange(nodes.map((n) => (n.id === id ? { ...n, name: newName } : n)))
  }

  // Change shape
  const handleChangeShape = (id, newShape) => {
    onNodesChange(nodes.map((n) => (n.id === id ? { ...n, shape: newShape } : n)))
  }

  // Change color
  const handleChangeColor = (id, newColor) => {
    onNodesChange(nodes.map((n) => (n.id === id ? { ...n, color: newColor } : n)))
  }

  // Assign or remove node from a Subgraph
  const handleAssignSubgraph = (nodeId, targetSgId) => {
    const updatedSgs = subgraphs.map((sg) => {
      const currentNodes = sg.nodeIds || []
      if (sg.id === targetSgId) {
        if (!currentNodes.includes(nodeId)) {
          return { ...sg, nodeIds: [...currentNodes, nodeId] }
        }
        return sg
      }
      return { ...sg, nodeIds: currentNodes.filter((id) => id !== nodeId) }
    })
    onSubgraphsChange(updatedSgs)
  }

  // Delete node
  const handleDeleteNode = (id) => {
    const remainingNodes = nodes.filter((n) => n.id !== id)
    onNodesChange(remainingNodes)
    onEdgesChange(edges.filter((e) => e.from !== id && e.to !== id))
    onSubgraphsChange(
      subgraphs.map((sg) => ({
        ...sg,
        nodeIds: (sg.nodeIds || []).filter((nid) => nid !== id)
      }))
    )
    if (selectedNodeId === id) {
      setSelectedNodeId(remainingNodes[0]?.id || null)
    }
  }

  // Add Cluster / Subgraph
  const handleCreateCluster = () => {
    if (!newClusterTitle.trim()) return
    const newSg = {
      id: `sg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: newClusterTitle.trim(),
      nodeIds: []
    }
    onSubgraphsChange([...subgraphs, newSg])
    setNewClusterTitle('')
    setShowClusterCreator(false)
  }

  const handleDeleteCluster = (sgId) => {
    onSubgraphsChange(subgraphs.filter((sg) => sg.id !== sgId))
  }

  // Connections
  const handleAddConnection = (fromNodeId) => {
    const target = nodes.find((n) => n.id !== fromNodeId) || nodes[0]
    if (!target) return

    const newEdge = {
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      from: fromNodeId,
      to: target.id,
      label: 'HTTPS',
      type: 'arrow'
    }
    onEdgesChange([...edges, newEdge])
  }

  const handleUpdateEdge = (edgeId, updates) => {
    onEdgesChange(edges.map((e) => (e.id === edgeId ? { ...e, ...updates } : e)))
  }

  const handleDeleteEdge = (edgeId) => {
    onEdgesChange(edges.filter((e) => e.id !== edgeId))
  }

  // Filtered nodes for outline
  const filteredNodes = nodes.filter((n) =>
    (n.name || '').toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. FLOWCHART SETTINGS: DIRECTION & SUBGRAPH CLUSTERS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Flow Direction & Clusters
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--surface-lowest)', padding: '2px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'TD', label: '⬇️ Top-Down' },
              { id: 'LR', label: '➡️ Left-Right' },
              { id: 'BT', label: '⬆️ Bottom-Up' }
            ].map((dir) => (
              <button
                key={dir.id}
                type="button"
                className={`studio-style-btn ${direction === dir.id ? 'active' : ''}`}
                onClick={() => onDirectionChange(dir.id)}
                style={{ padding: '3px 7px', fontSize: '10.5px' }}
              >
                {dir.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subgraph / VPC Clusters Manager */}
        <div style={{ background: 'var(--surface-base)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#818cf8' }}>folder_supervised</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>
                VPC / Subgraph Clusters ({subgraphs.length})
              </span>
            </div>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => setShowClusterCreator(!showClusterCreator)}
              style={{ padding: '3px 8px', fontSize: '11px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{showClusterCreator ? 'close' : 'add'}</span>
              <span>{showClusterCreator ? 'Cancel' : 'New Cluster'}</span>
            </button>
          </div>

          {showClusterCreator && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <input
                type="text"
                className="studio-text-input"
                placeholder="Cluster Name (e.g. Private Subnet, Public DMZ)"
                value={newClusterTitle}
                onChange={(e) => setNewClusterTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateCluster()}
                style={{ flex: 1, padding: '5px 8px', fontSize: '11px' }}
                autoFocus
              />
              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-primary"
                onClick={handleCreateCluster}
                style={{ padding: '5px 10px', fontSize: '11px' }}
              >
                Add
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {subgraphs.map((sg) => (
              <div
                key={sg.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: '#c7d2fe'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>folder</span>
                <span>{sg.title}</span>
                <span style={{ fontSize: '10px', opacity: 0.7 }}>({(sg.nodeIds || []).length} nodes)</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCluster(sg.id)}
                  style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0 2px' }}
                  title="Delete cluster container"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                </button>
              </div>
            ))}
            {subgraphs.length === 0 && !showClusterCreator && (
              <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                No subgraphs configured. Nodes are placed at the root level.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. QUICK ADD NODE TOOLBAR */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Add Architecture Nodes ({nodes.length})
          </span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            {edges.length} Total Connections
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            type="button"
            className="btn-add-component"
            onClick={() => handleAddPresetComponent('service')}
          >
            <span className="material-symbols-outlined icon-xs">add</span>
            <span>+ Service Node</span>
          </button>

          <div className="diagram-quick-chips">
            {TECH_NODE_PRESETS.map((tp) => (
              <button
                key={tp.id}
                type="button"
                className="diagram-quick-chip"
                onClick={() => handleAddPresetComponent(tp.id)}
                title={`Add ${tp.name}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px', color: tp.color }}>{tp.icon}</span>
                <span>+{tp.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FOCUSED INSPECTOR & OUTLINE TREE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Node Outline & Focused Inspector
          </span>
          {nodes.length > 5 && (
            <input
              type="text"
              placeholder="Filter nodes..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="studio-text-input"
              style={{ padding: '2px 6px', fontSize: '10.5px', width: '110px' }}
            />
          )}
        </div>

        {/* Outline Selector List (Horizontal Scroller or Compact Cards) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            maxHeight: '180px',
            overflowY: 'auto',
            background: 'var(--surface-lowest)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '6px'
          }}
        >
          {filteredNodes.map((node, index) => {
            const isSelected = node.id === selectedNodeId
            const parentSg = subgraphs.find((sg) => (sg.nodeIds || []).includes(node.id))
            const nodeWires = edges.filter((e) => e.from === node.id)
            const shapeObj = SHAPES.find((s) => s.id === node.shape) || SHAPES[0]

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  border: isSelected ? '1px solid #6366f1' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{ fontSize: '10px', color: '#64748b', width: '16px' }}>#{index + 1}</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '14px', color: node.color || '#818cf8' }}
                  >
                    {shapeObj.icon}
                  </span>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#f8fafc' : '#cbd5e1',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px'
                    }}
                  >
                    {node.name || 'Untitled Node'}
                  </span>
                  {parentSg && (
                    <span
                      style={{
                        fontSize: '9.5px',
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: '#a5b4fc',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        border: '1px solid rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      {parentSg.title}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: '3px' }}>
                    {nodeWires.length} wires
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteNode(node.id)
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                    title="Delete node"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>close</span>
                  </button>
                </div>
              </div>
            )
          })}

          {filteredNodes.length === 0 && (
            <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '11px' }}>
              No nodes match search filter.
            </div>
          )}
        </div>

        {/* 4. FOCUSED INSPECTOR PANEL */}
        {selectedNode ? (
          <div
            style={{
              background: 'var(--surface-base)',
              border: '1px solid #6366f1',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Inspector Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: selectedNode.color || '#818cf8' }}>
                  tune
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Node Inspector
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNode(selectedNode.id)}
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>delete</span>
                <span>Delete Node</span>
              </button>
            </div>

            {/* Name Input & Subgraph assignment */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px' }}>
                <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>COMPONENT NAME</label>
                <input
                  type="text"
                  className="studio-text-input"
                  value={selectedNode.name}
                  onChange={(e) => handleRenameNode(selectedNode.id, e.target.value)}
                  placeholder="e.g. Auth Gateway, Redis Cache"
                  style={{ fontSize: '12px', padding: '5px 8px', fontWeight: 600 }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '140px' }}>
                <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>CLUSTER CONTAINER</label>
                <select
                  className="studio-text-input"
                  value={
                    subgraphs.find((sg) => (sg.nodeIds || []).includes(selectedNode.id))?.id || ''
                  }
                  onChange={(e) => handleAssignSubgraph(selectedNode.id, e.target.value)}
                  style={{ fontSize: '11px', padding: '5px 8px' }}
                >
                  <option value="">(Root Canvas Flow)</option>
                  {subgraphs.map((sg) => (
                    <option key={sg.id} value={sg.id}>📁 {sg.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shape Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>NODE SHAPE</label>
              <div className="diagram-shape-chips">
                {SHAPES.map((sh) => (
                  <button
                    key={sh.id}
                    type="button"
                    className={`diagram-shape-chip-btn ${selectedNode.shape === sh.id ? 'active' : ''}`}
                    onClick={() => handleChangeShape(selectedNode.id, sh.id)}
                    title={sh.label}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{sh.icon}</span>
                    <span>{sh.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>ACCENT COLOR</label>
              <div className="diagram-color-swatches-mini">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`diagram-color-dot-btn ${selectedNode.color === c.color ? 'active' : ''}`}
                    style={{ backgroundColor: c.color || '#334155' }}
                    onClick={() => handleChangeColor(selectedNode.id, c.color)}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Outgoing Connections (Wires) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#f1f5f9' }}>
                  Outgoing Wires & Protocols ({selectedNodeEdges.length})
                </span>
                <button
                  type="button"
                  className="studio-shell-btn studio-shell-btn-secondary"
                  onClick={() => handleAddConnection(selectedNode.id)}
                  style={{ padding: '2px 7px', fontSize: '10.5px' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add</span>
                  <span>Connect to Node</span>
                </button>
              </div>

              {selectedNodeEdges.map((edge) => (
                <div key={edge.id} className="diagram-conn-row">
                  <span className="diagram-conn-arrow-indicator">➔</span>

                  {/* Target Dropdown */}
                  <select
                    className="diagram-conn-target-select"
                    value={edge.to}
                    onChange={(e) => handleUpdateEdge(edge.id, { to: e.target.value })}
                  >
                    {nodes.map((target) => (
                      <option key={target.id} value={target.id}>
                        {target.name} {target.id === selectedNode.id ? '(Self)' : ''}
                      </option>
                    ))}
                  </select>

                  {/* Protocol Label */}
                  <input
                    type="text"
                    className="diagram-conn-label-input"
                    value={edge.label}
                    onChange={(e) => handleUpdateEdge(edge.id, { label: e.target.value })}
                    placeholder="Protocol (e.g. HTTPS, SQL, Async)"
                  />

                  {/* Wire Style */}
                  <select
                    className="diagram-conn-type-select"
                    value={edge.type}
                    onChange={(e) => handleUpdateEdge(edge.id, { type: e.target.value })}
                  >
                    {CONNECTION_STYLES.map((cs) => (
                      <option key={cs.id} value={cs.id}>{cs.symbol} {cs.label}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="diagram-conn-del-btn"
                    onClick={() => handleDeleteEdge(edge.id)}
                    title="Delete connection"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                  </button>
                </div>
              ))}

              {selectedNodeEdges.length === 0 && (
                <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '4px 0' }}>
                  No outgoing wires from this node. Click "+ Connect to Node" to wire it.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', background: 'var(--surface-base)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border-color)' }}>
            No node selected. Click a component in the outline or add a new one above.
          </div>
        )}
      </div>
    </div>
  )
}
