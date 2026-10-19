import React, { useState, useMemo, useEffect } from 'react'

const DATA_TYPES = [
  'uuid',
  'string',
  'int',
  'bigint',
  'decimal',
  'boolean',
  'timestamp',
  'date',
  'jsonb',
  'text',
  'float'
]

const CARDINALITIES = [
  { id: '||--o{', label: '1 to Many (0..N) [||--o{]', short: '1 : 0..N' },
  { id: '||--|{', label: '1 to Many (1..N) [||--|{]', short: '1 : 1..N' },
  { id: '||--||', label: 'Exactly 1 to 1 [||--||]', short: '1 : 1' },
  { id: '||--o|', label: '1 to Optional (0..1) [||--o|]', short: '1 : 0..1' },
  { id: '}o--o{', label: 'Many to Many (0..N) [}o--o{]', short: '0..N : 0..N' },
  { id: '}|--|{', label: 'Many to Many (1..N) [}|--|{]', short: '1..N : 1..N' }
]

const QUICK_RELATION_VERBS = ['places', 'contains', 'owns', 'has', 'references', 'belongs_to', 'generates']

/**
 * High-Fidelity Database ER Model Visual Builder
 * - Interactive Table Outline with quick table chips & instant search
 * - Focused Table Inspector with inline rename, field reordering, and type selectors
 * - 1-Click Quick Column Presets (id PK, user_id FK, email, timestamps, etc.)
 * - 1-Click Standard Schema Table Presets (Users, Orders, Products, Payments)
 * - Visual Route Cards for Foreign Key Cardinalities with human-friendly labels
 * - Two-way canvas click synchronization & smooth auto-scroll
 */
export default function ErVisualBuilder({
  entities = [],
  onEntitiesChange,
  relationships = [],
  onRelationshipsChange,
  selectedEntityId,
  onSelectEntityId
}) {
  const [viewMode, setViewMode] = useState('focused') // 'focused' | 'expanded'
  const [searchQuery, setSearchQuery] = useState('')
  const [newEntityName, setNewEntityName] = useState('')
  const [showAddCustomTable, setShowAddCustomTable] = useState(false)

  // Ensure an entity is selected
  const activeSelectedEntity = useMemo(() => {
    return entities.find((e) => e.id === selectedEntityId) || entities[0] || null
  }, [entities, selectedEntityId])

  // Auto-scroll selected table into view when clicked on canvas or chip
  useEffect(() => {
    if (selectedEntityId) {
      const el = document.getElementById(`er-table-${selectedEntityId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedEntityId])

  // Quick Table Presets
  const PRESET_TABLES = [
    {
      label: '+ 👤 Users',
      name: 'USERS',
      attributes: [
        { id: 'a1', type: 'uuid', name: 'id', key: 'PK', comment: 'Primary key' },
        { id: 'a2', type: 'string', name: 'email', key: 'UK', comment: 'Unique login email' },
        { id: 'a3', type: 'string', name: 'full_name', key: '', comment: 'User display name' },
        { id: 'a4', type: 'string', name: 'role', key: '', comment: 'Role enum' },
        { id: 'a5', type: 'timestamp', name: 'created_at', key: '', comment: 'Creation time' }
      ]
    },
    {
      label: '+ 🛍️ Orders',
      name: 'ORDERS',
      attributes: [
        { id: 'a1', type: 'uuid', name: 'id', key: 'PK', comment: 'Order ID' },
        { id: 'a2', type: 'uuid', name: 'user_id', key: 'FK', comment: 'References USERS' },
        { id: 'a3', type: 'decimal', name: 'total_amount', key: '', comment: 'Order total' },
        { id: 'a4', type: 'string', name: 'currency', key: '', comment: 'Currency code' },
        { id: 'a5', type: 'string', name: 'status', key: '', comment: 'Status enum' },
        { id: 'a6', type: 'timestamp', name: 'placed_at', key: '', comment: 'Order timestamp' }
      ]
    },
    {
      label: '+ 📦 Products',
      name: 'PRODUCTS',
      attributes: [
        { id: 'a1', type: 'uuid', name: 'id', key: 'PK', comment: 'Product ID' },
        { id: 'a2', type: 'string', name: 'sku', key: 'UK', comment: 'Stock keeping unit' },
        { id: 'a3', type: 'string', name: 'title', key: '', comment: 'Product name' },
        { id: 'a4', type: 'decimal', name: 'price', key: '', comment: 'Unit price' },
        { id: 'a5', type: 'int', name: 'stock_quantity', key: '', comment: 'Current stock' }
      ]
    },
    {
      label: '+ 🧾 OrderItems',
      name: 'ORDER_ITEMS',
      attributes: [
        { id: 'a1', type: 'uuid', name: 'id', key: 'PK', comment: 'Line item ID' },
        { id: 'a2', type: 'uuid', name: 'order_id', key: 'FK', comment: 'References ORDERS' },
        { id: 'a3', type: 'uuid', name: 'product_id', key: 'FK', comment: 'References PRODUCTS' },
        { id: 'a4', type: 'int', name: 'quantity', key: '', comment: 'Item quantity' },
        { id: 'a5', type: 'decimal', name: 'unit_price', key: '', comment: 'Snapshot price' }
      ]
    },
    {
      label: '+ 💳 Payments',
      name: 'PAYMENTS',
      attributes: [
        { id: 'a1', type: 'uuid', name: 'id', key: 'PK', comment: 'Payment transaction ID' },
        { id: 'a2', type: 'uuid', name: 'order_id', key: 'FK', comment: 'References ORDERS' },
        { id: 'a3', type: 'decimal', name: 'amount', key: '', comment: 'Processed amount' },
        { id: 'a4', type: 'string', name: 'provider', key: '', comment: 'Stripe/PayPal' },
        { id: 'a5', type: 'string', name: 'status', key: '', comment: 'Payment state' }
      ]
    }
  ]

  // Add Table
  const handleAddTable = (preset) => {
    const rawName = (preset?.name || newEntityName).trim().toUpperCase().replace(/[^a-zA-Z0-9_]/g, '_')
    if (!rawName) return

    // Avoid duplicate table names
    let finalName = rawName
    let count = 1
    while (entities.some((e) => e.name.toUpperCase() === finalName)) {
      finalName = `${rawName}_${count++}`
    }

    const newEnt = {
      id: `ent_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: finalName,
      attributes: preset?.attributes
        ? preset.attributes.map((a) => ({
            ...a,
            id: `attr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
          }))
        : [
            { id: `attr_1`, type: 'uuid', name: 'id', key: 'PK', comment: 'Primary key' },
            { id: `attr_2`, type: 'timestamp', name: 'created_at', key: '', comment: 'Created time' }
          ]
    }

    onEntitiesChange([...entities, newEnt])
    if (onSelectEntityId) onSelectEntityId(newEnt.id)
    setNewEntityName('')
    setShowAddCustomTable(false)
  }

  // Rename Table (propagates to relationships automatically!)
  const handleRenameTable = (entId, newName) => {
    const cleanName = newName.trim().toUpperCase().replace(/[^a-zA-Z0-9_]/g, '_')
    if (!cleanName) return

    const orig = entities.find((e) => e.id === entId)
    if (!orig || orig.name === cleanName) return

    const oldName = orig.name
    onEntitiesChange(entities.map((e) => (e.id === entId ? { ...e, name: cleanName } : e)))

    // Update references in relationships
    onRelationshipsChange(
      relationships.map((r) => {
        let updated = { ...r }
        if (r.entity1 === oldName) updated.entity1 = cleanName
        if (r.entity2 === oldName) updated.entity2 = cleanName
        return updated
      })
    )
  }

  // Delete Table
  const handleDeleteTable = (entId) => {
    const ent = entities.find((e) => e.id === entId)
    const remaining = entities.filter((e) => e.id !== entId)
    onEntitiesChange(remaining)
    if (ent) {
      onRelationshipsChange(
        relationships.filter((r) => r.entity1 !== ent.name && r.entity2 !== ent.name)
      )
    }
    if (selectedEntityId === entId && remaining.length > 0) {
      if (onSelectEntityId) onSelectEntityId(remaining[0].id)
    }
  }

  // Add Column
  const handleAddColumn = (entId, colDef) => {
    onEntitiesChange(
      entities.map((ent) => {
        if (ent.id !== entId) return ent
        const newCol = {
          id: `attr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: colDef?.type || 'string',
          name: colDef?.name || `column_${ent.attributes.length + 1}`,
          key: colDef?.key || '',
          comment: colDef?.comment || ''
        }
        return { ...ent, attributes: [...ent.attributes, newCol] }
      })
    )
  }

  // Update Column
  const handleUpdateColumn = (entId, attrId, updates) => {
    onEntitiesChange(
      entities.map((ent) => {
        if (ent.id !== entId) return ent
        return {
          ...ent,
          attributes: ent.attributes.map((a) => (a.id === attrId ? { ...a, ...updates } : a))
        }
      })
    )
  }

  // Delete Column
  const handleDeleteColumn = (entId, attrId) => {
    onEntitiesChange(
      entities.map((ent) => {
        if (ent.id !== entId) return ent
        return {
          ...ent,
          attributes: ent.attributes.filter((a) => a.id !== attrId)
        }
      })
    )
  }

  // Move Column Up/Down
  const handleMoveColumn = (entId, colIdx, direction) => {
    const ent = entities.find((e) => e.id === entId)
    if (!ent) return
    const targetIdx = colIdx + direction
    if (targetIdx < 0 || targetIdx >= ent.attributes.length) return
    const updatedCols = [...ent.attributes]
    const temp = updatedCols[colIdx]
    updatedCols[colIdx] = updatedCols[targetIdx]
    updatedCols[targetIdx] = temp

    onEntitiesChange(
      entities.map((e) => (e.id === entId ? { ...e, attributes: updatedCols } : e))
    )
  }

  // Add Relationship
  const handleAddRelationship = () => {
    const e1 = entities[0] ? entities[0].name : 'CUSTOMERS'
    const e2 = entities[1] ? entities[1].name : e1
    const newRel = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      entity1: e1,
      cardinality: '||--o{',
      entity2: e2,
      label: 'places'
    }
    onRelationshipsChange([...relationships, newRel])
  }

  // Update Relationship
  const handleUpdateRelationship = (relId, updates) => {
    onRelationshipsChange(
      relationships.map((r) => (r.id === relId ? { ...r, ...updates } : r))
    )
  }

  // Delete Relationship
  const handleDeleteRelationship = (relId) => {
    onRelationshipsChange(relationships.filter((r) => r.id !== relId))
  }

  // Filtered entities based on search query
  const filteredEntities = useMemo(() => {
    if (!searchQuery.trim()) return entities
    const q = searchQuery.trim().toLowerCase()
    return entities.filter(
      (ent) =>
        ent.name.toLowerCase().includes(q) ||
        ent.attributes.some((a) => a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q))
    )
  }, [entities, searchQuery])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ---------------- 1. SCHEMA TABLES OUTLINE & SELECTOR ---------------- */}
      <div className="er-tables-outline-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>schema</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
              Database Tables ({entities.length})
            </span>
          </div>

          {/* View Mode Toggle */}
          <div className="seq-view-toggle">
            <button
              type="button"
              className={`seq-view-btn ${viewMode === 'focused' ? 'active' : ''}`}
              onClick={() => setViewMode('focused')}
              title="Focus on a single table for rich in-depth column editing"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>view_sidebar</span>
              <span>Focused</span>
            </button>
            <button
              type="button"
              className={`seq-view-btn ${viewMode === 'expanded' ? 'active' : ''}`}
              onClick={() => setViewMode('expanded')}
              title="Expand all tables simultaneously"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>view_agenda</span>
              <span>All Tables</span>
            </button>
          </div>
        </div>

        {/* Existing Table Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {entities.map((ent) => {
            const isSelected = activeSelectedEntity?.id === ent.id
            const pkCount = ent.attributes.filter((a) => a.key === 'PK').length
            const fkCount = ent.attributes.filter((a) => a.key === 'FK').length

            return (
              <div
                key={ent.id}
                className={`er-table-chip ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectEntityId && onSelectEntityId(ent.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#10b981' }}>
                  table_chart
                </span>

                <span style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.02em' }}>
                  {ent.name}
                </span>

                <span className="er-col-count-badge">
                  {ent.attributes.length} cols
                </span>

                {pkCount > 0 && <span style={{ fontSize: '9px', color: '#f59e0b', fontWeight: 700 }}>PK</span>}
                {fkCount > 0 && <span style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 700 }}>FK</span>}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteTable(ent.id)
                  }}
                  title={`Delete table ${ent.name}`}
                  className="seq-icon-mini-btn delete"
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>

        {/* Quick Add Presets Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Presets:</span>
          {PRESET_TABLES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="seq-preset-chip"
              onClick={() => handleAddTable(preset)}
              title={`Add ${preset.name} table template`}
            >
              {preset.label}
            </button>
          ))}
          <button
            type="button"
            className="seq-preset-chip custom"
            onClick={() => setShowAddCustomTable((prev) => !prev)}
          >
            {showAddCustomTable ? '✕ Cancel' : '+ Custom Table'}
          </button>
        </div>

        {/* Custom Add Table Input (Foldable) */}
        {showAddCustomTable && (
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(0, 0, 0, 0.25)', padding: '8px', borderRadius: '5px', marginTop: '4px' }}>
            <input
              type="text"
              className="studio-text-input"
              placeholder="Table Name (e.g. INVENTORY_LOGS)"
              value={newEntityName}
              onChange={(e) => setNewEntityName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTable()}
              style={{ flex: 1, fontSize: '11px', padding: '4px 8px', textTransform: 'uppercase' }}
            />
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-primary"
              onClick={() => handleAddTable()}
              style={{ padding: '4px 12px', fontSize: '11px' }}
            >
              + Create Table
            </button>
          </div>
        )}
      </div>

      {/* ---------------- 2. SEARCH / FILTER BAR ---------------- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface-base)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748b' }}>search</span>
        <input
          type="text"
          className="seq-search-input"
          placeholder="Filter schema tables or columns (e.g. users, order_id, email, status)..."
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
          {filteredEntities.length} / {entities.length} tables
        </span>
      </div>

      {/* ---------------- 3A. VIEW MODE: FOCUSED TABLE INSPECTOR ---------------- */}
      {viewMode === 'focused' && activeSelectedEntity && (
        <div id={`er-table-${activeSelectedEntity.id}`} className="er-focused-table-card">
          {/* Table Header Banner */}
          <div className="er-table-header-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>table_chart</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '9.5px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Active Table Name
                </span>
                <input
                  type="text"
                  className="er-table-rename-input"
                  value={activeSelectedEntity.name}
                  onChange={(e) => handleRenameTable(activeSelectedEntity.id, e.target.value)}
                  placeholder="TABLE_NAME"
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-secondary"
                onClick={() => handleAddColumn(activeSelectedEntity.id)}
                style={{ padding: '3px 8px', fontSize: '11px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#10b981' }}>add</span>
                <span>+ Column</span>
              </button>

              <button
                type="button"
                className="studio-shell-btn studio-shell-btn-secondary"
                onClick={() => handleDeleteTable(activeSelectedEntity.id)}
                title="Delete this table"
                style={{ padding: '3px 6px', color: '#f87171' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
              </button>
            </div>
          </div>

          {/* Quick Column Presets Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', padding: '6px 12px', background: 'rgba(0, 0, 0, 0.2)', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '9.5px', color: '#64748b', fontWeight: 600 }}>Quick Columns:</span>
            <button
              type="button"
              className="seq-snippet-chip"
              onClick={() => handleAddColumn(activeSelectedEntity.id, { type: 'uuid', name: 'id', key: 'PK', comment: 'Primary key' })}
            >
              + 🔑 id (PK)
            </button>
            <button
              type="button"
              className="seq-snippet-chip"
              onClick={() => handleAddColumn(activeSelectedEntity.id, { type: 'uuid', name: 'user_id', key: 'FK', comment: 'Foreign key' })}
            >
              + 🔗 user_id (FK)
            </button>
            <button
              type="button"
              className="seq-snippet-chip"
              onClick={() => handleAddColumn(activeSelectedEntity.id, { type: 'string', name: 'email', key: 'UK', comment: 'Unique email' })}
            >
              + 📧 email (UK)
            </button>
            <button
              type="button"
              className="seq-snippet-chip"
              onClick={() => handleAddColumn(activeSelectedEntity.id, { type: 'string', name: 'status', key: '', comment: 'Status enum' })}
            >
              + 🏷️ status
            </button>
            <button
              type="button"
              className="seq-snippet-chip"
              onClick={() => handleAddColumn(activeSelectedEntity.id, { type: 'decimal', name: 'price', key: '', comment: 'Monetary value' })}
            >
              + 💵 price
            </button>
            <button
              type="button"
              className="seq-snippet-chip"
              onClick={() => {
                handleAddColumn(activeSelectedEntity.id, { type: 'timestamp', name: 'created_at', key: '', comment: 'Creation time' })
                handleAddColumn(activeSelectedEntity.id, { type: 'timestamp', name: 'updated_at', key: '', comment: 'Update time' })
              }}
            >
              + ⏱️ timestamps
            </button>
          </div>

          {/* Columns Editor Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px' }}>
            {activeSelectedEntity.attributes.map((attr, colIdx) => (
              <div key={attr.id} className="er-col-row">
                {/* Key Selector */}
                <select
                  className="er-key-select"
                  value={attr.key || ''}
                  onChange={(e) => handleUpdateColumn(activeSelectedEntity.id, attr.id, { key: e.target.value })}
                  style={{
                    color: attr.key === 'PK' ? '#f59e0b' : attr.key === 'FK' ? '#38bdf8' : attr.key === 'UK' ? '#a855f7' : '#64748b'
                  }}
                  title="Constraint Key"
                >
                  <option value="">- None</option>
                  <option value="PK">PK 🔑 Primary</option>
                  <option value="FK">FK 🔗 Foreign</option>
                  <option value="UK">UK ★ Unique</option>
                </select>

                {/* Column Name */}
                <input
                  type="text"
                  className="er-col-name-input"
                  value={attr.name}
                  onChange={(e) => handleUpdateColumn(activeSelectedEntity.id, attr.id, { name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                  placeholder="column_name"
                />

                {/* Data Type */}
                <select
                  className="er-type-select"
                  value={attr.type}
                  onChange={(e) => handleUpdateColumn(activeSelectedEntity.id, attr.id, { type: e.target.value })}
                  title="SQL Column Data Type"
                >
                  {DATA_TYPES.map((dt) => (
                    <option key={dt} value={dt}>{dt}</option>
                  ))}
                </select>

                {/* Comment / Description */}
                <input
                  type="text"
                  className="er-col-comment-input"
                  value={attr.comment || ''}
                  onChange={(e) => handleUpdateColumn(activeSelectedEntity.id, attr.id, { comment: e.target.value })}
                  placeholder="Description..."
                  title="Column annotation comment"
                />

                {/* Action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                  <button
                    type="button"
                    disabled={colIdx === 0}
                    onClick={() => handleMoveColumn(activeSelectedEntity.id, colIdx, -1)}
                    className="seq-icon-mini-btn"
                    title="Move column up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={colIdx === activeSelectedEntity.attributes.length - 1}
                    onClick={() => handleMoveColumn(activeSelectedEntity.id, colIdx, 1)}
                    className="seq-icon-mini-btn"
                    title="Move column down"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteColumn(activeSelectedEntity.id, attr.id)}
                    className="seq-icon-mini-btn delete"
                    title="Delete column"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {activeSelectedEntity.attributes.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '11.5px' }}>
                No columns in this table yet. Click <strong>"+ Column"</strong> or pick a quick preset above!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- 3B. VIEW MODE: ALL TABLES EXPANDED ---------------- */}
      {viewMode === 'expanded' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredEntities.map((ent) => (
            <div key={ent.id} id={`er-table-${ent.id}`} className="er-focused-table-card">
              <div className="er-table-header-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#10b981' }}>table_chart</span>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: '#f8fafc' }}>{ent.name}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>({ent.attributes.length} fields)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    className="studio-shell-btn studio-shell-btn-secondary"
                    onClick={() => handleAddColumn(ent.id)}
                    style={{ padding: '2px 6px', fontSize: '10.5px' }}
                  >
                    + Column
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTable(ent.id)}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                  </button>
                </div>
              </div>

              <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {ent.attributes.map((attr, colIdx) => (
                  <div key={attr.id} className="er-col-row">
                    <select
                      className="er-key-select"
                      value={attr.key || ''}
                      onChange={(e) => handleUpdateColumn(ent.id, attr.id, { key: e.target.value })}
                    >
                      <option value="">-</option>
                      <option value="PK">PK 🔑</option>
                      <option value="FK">FK 🔗</option>
                      <option value="UK">UK ★</option>
                    </select>

                    <input
                      type="text"
                      className="er-col-name-input"
                      value={attr.name}
                      onChange={(e) => handleUpdateColumn(ent.id, attr.id, { name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                    />

                    <select
                      className="er-type-select"
                      value={attr.type}
                      onChange={(e) => handleUpdateColumn(ent.id, attr.id, { type: e.target.value })}
                    >
                      {DATA_TYPES.map((dt) => (
                        <option key={dt} value={dt}>{dt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      className="er-col-comment-input"
                      value={attr.comment || ''}
                      onChange={(e) => handleUpdateColumn(ent.id, attr.id, { comment: e.target.value })}
                      placeholder="Comment..."
                    />

                    <button
                      type="button"
                      onClick={() => handleDeleteColumn(ent.id, attr.id)}
                      className="seq-icon-mini-btn delete"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- 4. FOREIGN KEY RELATIONSHIPS (CARDINALITIES) ---------------- */}
      <div className="er-relationships-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#38bdf8' }}>linear_scale</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc' }}>
              Foreign Key Cardinalities ({relationships.length})
            </span>
          </div>

          <button
            type="button"
            className="studio-shell-btn studio-shell-btn-secondary"
            onClick={handleAddRelationship}
            style={{ padding: '3px 8px', fontSize: '11px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#38bdf8' }}>add</span>
            <span>+ Relationship</span>
          </button>
        </div>

        {/* List of Relationship Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {relationships.map((rel, rIdx) => (
            <div key={rel.id} className="er-rel-card">
              {/* Header Route Bar: Entity 1 ──[ Cardinality ]──▶ Entity 2 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0, flexWrap: 'wrap' }}>
                  <span className="seq-step-badge">#{rIdx + 1}</span>

                  {/* Entity 1 */}
                  <select
                    className="seq-select"
                    value={rel.entity1}
                    onChange={(e) => handleUpdateRelationship(rel.id, { entity1: e.target.value })}
                    title="Source Table"
                  >
                    {entities.map((e) => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
                  </select>

                  {/* Cardinality Selector */}
                  <select
                    className="er-cardinality-select"
                    value={rel.cardinality}
                    onChange={(e) => handleUpdateRelationship(rel.id, { cardinality: e.target.value })}
                    title="Foreign Key Cardinality Relation"
                  >
                    {CARDINALITIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>

                  {/* Entity 2 */}
                  <select
                    className="seq-select"
                    value={rel.entity2}
                    onChange={(e) => handleUpdateRelationship(rel.id, { entity2: e.target.value })}
                    title="Target Table"
                  >
                    {entities.map((e) => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteRelationship(rel.id)}
                  className="seq-icon-action-btn delete"
                  title="Delete relationship"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                </button>
              </div>

              {/* Bottom Verb & Description */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>Verb / Label:</span>
                <input
                  type="text"
                  className="seq-text-input"
                  value={rel.label}
                  onChange={(e) => handleUpdateRelationship(rel.id, { label: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                  placeholder="e.g. places, owns, contains..."
                  style={{ flex: 1, minWidth: '120px', padding: '4px 8px', fontSize: '11px' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {QUICK_RELATION_VERBS.slice(0, 4).map((verb) => (
                    <button
                      key={verb}
                      type="button"
                      className="seq-snippet-chip"
                      onClick={() => handleUpdateRelationship(rel.id, { label: verb })}
                    >
                      {verb}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {relationships.length === 0 && (
            <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '11.5px', fontStyle: 'italic' }}>
              No relationships defined yet. Click <strong>"+ Relationship"</strong> above to link tables!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
