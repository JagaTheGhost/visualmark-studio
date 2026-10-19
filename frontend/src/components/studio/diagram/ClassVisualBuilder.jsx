import React, { useState, useMemo, useEffect } from 'react'

const RELATIONSHIP_TYPES = [
  { id: '<|--', label: 'Inherits (<|--)', desc: 'Inheritance / Generalization', symbol: '◀───' },
  { id: '..|>', label: 'Implements (..|>)', desc: 'Realization / Interface', symbol: '◀ - -' },
  { id: '*--', label: 'Composes (*--)', desc: 'Composition (Part-of)', symbol: '◆───' },
  { id: 'o--', label: 'Aggregates (o--)', desc: 'Aggregation (Has-a)', symbol: '◇───' },
  { id: '-->', label: 'Associates (-->)', desc: 'Direct Association', symbol: '───▶' },
  { id: '..>', label: 'Depends (..>)', desc: 'Dependency / Uses', symbol: '- - ▶' }
]

const VISIBILITIES = [
  { id: '+', label: '+ Public', color: '#10b981' },
  { id: '-', label: '- Private', color: '#f87171' },
  { id: '#', label: '# Protected', color: '#f59e0b' },
  { id: '~', label: '~ Package', color: '#38bdf8' }
]

const COMMON_DATA_TYPES = [
  'String',
  'UUID',
  'Number',
  'Boolean',
  'Date',
  'List',
  'Map',
  'Promise',
  'void',
  'any'
]

const QUICK_RELATION_VERBS = ['inherits', 'implements', 'manages', 'injects', 'uses', 'aggregates', 'calls']

/**
 * High-Fidelity OOP Class & Object Diagram Visual Builder
 * - Interactive Class Outline Chips with field/method badges & live search
 * - 1-Click Architecture Class Presets (Controller, Service, Repository, Entity, Interface)
 * - Focused Class Inspector with inline rename propagation to relationships
 * - 1-Click Field Presets (id, email, status, timestamps) & Method Presets (find, save, execute)
 * - Field & Method Reordering (▲ ▼) & Visibility Selectors
 * - Spacious Visual Route Cards for Inheritance & Associations (From ──[ Type ]──▶ To)
 * - Two-Way Canvas Selection Synchronization & Auto-scroll
 */
export default function ClassVisualBuilder({
  classes = [],
  onClassesChange,
  relationships = [],
  onRelationshipsChange,
  selectedClassId: controlledSelectedClassId,
  onSelectClassId
}) {
  const [internalSelectedClassId, setInternalSelectedClassId] = useState(classes[0]?.id || null)
  const isControlled = controlledSelectedClassId !== undefined
  const selectedClassId = isControlled ? controlledSelectedClassId : internalSelectedClassId

  const setSelectedClassId = (id) => {
    if (typeof onSelectClassId === 'function') {
      onSelectClassId(id)
    }
    if (!isControlled) {
      setInternalSelectedClassId(id)
    }
  }

  const [viewMode, setViewMode] = useState('focused') // 'focused' | 'expanded'
  const [searchQuery, setSearchQuery] = useState('')
  const [newClassName, setNewClassName] = useState('')
  const [showAddPresetMenu, setShowAddPresetMenu] = useState(false)

  // Ensure active class exists
  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || classes[0] || null
  }, [classes, selectedClassId])

  // Auto-scroll selected class into view when clicked on canvas or chip
  useEffect(() => {
    if (selectedClassId) {
      const el = document.getElementById(`class-card-${selectedClassId}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedClassId])

  // Preset Architecture Blueprints
  const PRESET_CLASSES = [
    {
      label: '+ 🧱 Controller',
      name: 'UserController',
      isInterface: false,
      attributes: [
        { id: 'a1', visibility: '-', type: 'UserService', name: 'userService' },
        { id: 'a2', visibility: '-', type: 'Logger', name: 'logger' }
      ],
      methods: [
        { id: 'm1', visibility: '+', name: 'getUser', params: 'id: UUID', returnType: 'UserDto' },
        { id: 'm2', visibility: '+', name: 'create', params: 'req: CreateUserDto', returnType: 'UserDto' },
        { id: 'm3', visibility: '+', name: 'listAll', params: 'page: Number', returnType: 'List~User~' }
      ]
    },
    {
      label: '+ 🏛️ Service',
      name: 'UserService',
      isInterface: false,
      attributes: [
        { id: 'a1', visibility: '-', type: 'UserRepository', name: 'userRepo' },
        { id: 'a2', visibility: '-', type: 'EventPublisher', name: 'events' }
      ],
      methods: [
        { id: 'm1', visibility: '+', name: 'findById', params: 'id: UUID', returnType: 'User' },
        { id: 'm2', visibility: '+', name: 'register', params: 'dto: RegisterDto', returnType: 'User' },
        { id: 'm3', visibility: '+', name: 'deactivate', params: 'id: UUID', returnType: 'void' }
      ]
    },
    {
      label: '+ 📦 Repository',
      name: 'UserRepository',
      isInterface: false,
      attributes: [
        { id: 'a1', visibility: '-', type: 'DbContext', name: 'db' },
        { id: 'a2', visibility: '-', type: 'CacheService', name: 'cache' }
      ],
      methods: [
        { id: 'm1', visibility: '+', name: 'find', params: 'id: UUID', returnType: 'User' },
        { id: 'm2', visibility: '+', name: 'save', params: 'entity: User', returnType: 'User' },
        { id: 'm3', visibility: '+', name: 'delete', params: 'id: UUID', returnType: 'Boolean' }
      ]
    },
    {
      label: '+ 📐 Entity',
      name: 'User',
      isInterface: false,
      attributes: [
        { id: 'a1', visibility: '+', type: 'UUID', name: 'id' },
        { id: 'a2', visibility: '+', type: 'String', name: 'email' },
        { id: 'a3', visibility: '+', type: 'String', name: 'fullName' },
        { id: 'a4', visibility: '+', type: 'Boolean', name: 'isActive' },
        { id: 'a5', visibility: '+', type: 'Date', name: 'createdAt' }
      ],
      methods: [
        { id: 'm1', visibility: '+', name: 'validate', params: '', returnType: 'Boolean' },
        { id: 'm2', visibility: '+', name: 'markActive', params: '', returnType: 'void' }
      ]
    },
    {
      label: '+ 🔌 Interface',
      name: 'IAuthService',
      isInterface: true,
      attributes: [],
      methods: [
        { id: 'm1', visibility: '+', name: 'login', params: 'creds: LoginDto', returnType: 'AuthToken' },
        { id: 'm2', visibility: '+', name: 'validateToken', params: 'token: String', returnType: 'Boolean' },
        { id: 'm3', visibility: '+', name: 'logout', params: 'userId: UUID', returnType: 'void' }
      ]
    }
  ]

  // Add Class
  const handleAddClass = (preset) => {
    const rawName = (preset?.name || newClassName).trim().replace(/[^a-zA-Z0-9_]/g, '_')
    if (!rawName) return

    let finalName = rawName
    let count = 1
    while (classes.some((c) => c.name.toLowerCase() === finalName.toLowerCase())) {
      finalName = `${rawName}_${count++}`
    }

    const newCls = {
      id: `cls_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: finalName,
      isInterface: Boolean(preset?.isInterface),
      attributes: preset?.attributes
        ? preset.attributes.map((a, i) => ({ ...a, id: `a_${Date.now()}_${i}` }))
        : [{ id: `a_${Date.now()}_1`, visibility: '+', type: 'UUID', name: 'id' }],
      methods: preset?.methods
        ? preset.methods.map((m, i) => ({ ...m, id: `m_${Date.now()}_${i}` }))
        : [{ id: `m_${Date.now()}_1`, visibility: '+', name: 'execute', params: '', returnType: 'void' }]
    }

    onClassesChange([...classes, newCls])
    setSelectedClassId(newCls.id)
    setNewClassName('')
    setShowAddPresetMenu(false)
  }

  // Update Class with Rename Propagation
  const handleUpdateClass = (id, updates) => {
    const targetClass = classes.find((c) => c.id === id)
    if (!targetClass) return

    const oldName = targetClass.name
    const newName = updates.name !== undefined ? updates.name.trim() : null

    // Rename propagation to all relationships
    if (newName && newName !== oldName) {
      const updatedRels = relationships.map((r) => {
        let updatedFrom = r.from === oldName ? newName : r.from
        let updatedTo = r.to === oldName ? newName : r.to
        return { ...r, from: updatedFrom, to: updatedTo }
      })
      onRelationshipsChange(updatedRels)
    }

    onClassesChange(classes.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  // Delete Class
  const handleDeleteClass = (id) => {
    const cls = classes.find((c) => c.id === id)
    if (!cls) return
    onClassesChange(classes.filter((c) => c.id !== id))
    onRelationshipsChange(relationships.filter((r) => r.from !== cls.name && r.to !== cls.name))
    if (selectedClassId === id) {
      const remaining = classes.filter((c) => c.id !== id)
      setSelectedClassId(remaining[0]?.id || null)
    }
  }

  // Attributes Management
  const handleAddAttribute = (presetType = 'String', presetName = '') => {
    if (!activeClass) return
    const count = (activeClass.attributes || []).length + 1
    const newAttr = {
      id: `attr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      visibility: '+',
      type: presetType,
      name: presetName || `field_${count}`
    }
    handleUpdateClass(activeClass.id, {
      attributes: [...(activeClass.attributes || []), newAttr]
    })
  }

  const handleUpdateAttribute = (attrId, updates) => {
    if (!activeClass) return
    handleUpdateClass(activeClass.id, {
      attributes: (activeClass.attributes || []).map((a) => (a.id === attrId ? { ...a, ...updates } : a))
    })
  }

  const handleDeleteAttribute = (attrId) => {
    if (!activeClass) return
    handleUpdateClass(activeClass.id, {
      attributes: (activeClass.attributes || []).filter((a) => a.id !== attrId)
    })
  }

  const handleMoveAttribute = (index, dir) => {
    if (!activeClass) return
    const attrs = [...(activeClass.attributes || [])]
    const target = index + dir
    if (target < 0 || target >= attrs.length) return
    const temp = attrs[index]
    attrs[index] = attrs[target]
    attrs[target] = temp
    handleUpdateClass(activeClass.id, { attributes: attrs })
  }

  // Methods Management
  const handleAddMethod = (presetName = '', presetParams = '', presetRet = 'void') => {
    if (!activeClass) return
    const count = (activeClass.methods || []).length + 1
    const newMethod = {
      id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      visibility: '+',
      name: presetName || `method_${count}`,
      params: presetParams,
      returnType: presetRet
    }
    handleUpdateClass(activeClass.id, {
      methods: [...(activeClass.methods || []), newMethod]
    })
  }

  const handleUpdateMethod = (mId, updates) => {
    if (!activeClass) return
    handleUpdateClass(activeClass.id, {
      methods: (activeClass.methods || []).map((m) => (m.id === mId ? { ...m, ...updates } : m))
    })
  }

  const handleDeleteMethod = (mId) => {
    if (!activeClass) return
    handleUpdateClass(activeClass.id, {
      methods: (activeClass.methods || []).filter((m) => m.id !== mId)
    })
  }

  const handleMoveMethod = (index, dir) => {
    if (!activeClass) return
    const meths = [...(activeClass.methods || [])]
    const target = index + dir
    if (target < 0 || target >= meths.length) return
    const temp = meths[index]
    meths[index] = meths[target]
    meths[target] = temp
    handleUpdateClass(activeClass.id, { methods: meths })
  }

  // Relationships Management
  const handleAddRelationship = (type = '<|--', label = 'inherits') => {
    const fromName = classes[0]?.name || 'ClassA'
    const toName = classes[1]?.name || fromName
    const newRel = {
      id: `crel_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      from: fromName,
      type,
      to: toName,
      label
    }
    onRelationshipsChange([...relationships, newRel])
  }

  const handleUpdateRelationship = (id, updates) => {
    onRelationshipsChange(relationships.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }

  const handleDeleteRelationship = (id) => {
    onRelationshipsChange(relationships.filter((r) => r.id !== id))
  }

  // Filtered classes for search
  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classes
    const q = searchQuery.toLowerCase()
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.attributes || []).some((a) => a.name.toLowerCase().includes(q) || (a.type || '').toLowerCase().includes(q)) ||
        (c.methods || []).some((m) => m.name.toLowerCase().includes(q))
    )
  }, [classes, searchQuery])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 1. INTERACTIVE CLASSES OUTLINE */}
      <div className="cls-outline-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#818cf8' }}>
              view_quilt
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.02em' }}>
              Classes & Interfaces ({classes.length})
            </span>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(0,0,0,0.4)', padding: '2px', borderRadius: '5px' }}>
            <button
              type="button"
              className={`diagram-mode-btn ${viewMode === 'focused' ? 'active' : ''}`}
              onClick={() => setViewMode('focused')}
              title="Focus on selected class details"
              style={{ fontSize: '10px', padding: '3px 7px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>center_focus_strong</span>
              <span>Focused</span>
            </button>
            <button
              type="button"
              className={`diagram-mode-btn ${viewMode === 'expanded' ? 'active' : ''}`}
              onClick={() => setViewMode('expanded')}
              title="View all classes expanded"
              style={{ fontSize: '10px', padding: '3px 7px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>view_agenda</span>
              <span>All ({classes.length})</span>
            </button>
          </div>
        </div>

        {/* Live Filter Bar */}
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
              placeholder="Filter classes, fields, methods..."
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

          {/* 1-Click Architecture Presets Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="studio-shell-btn studio-shell-btn-secondary"
              onClick={() => setShowAddPresetMenu(!showAddPresetMenu)}
              style={{ height: '28px', padding: '0 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#818cf8' }}>add_circle</span>
              <span>+ Blueprint</span>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>expand_more</span>
            </button>

            {showAddPresetMenu && (
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
                  minWidth: '180px',
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Architecture Blueprints
                </div>
                {PRESET_CLASSES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddClass(preset)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#f8fafc',
                      fontSize: '11px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Classes Selector Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {filteredClasses.map((cls) => {
            const isSelected = activeClass && activeClass.id === cls.id
            const fieldsCount = (cls.attributes || []).length
            const methodsCount = (cls.methods || []).length

            return (
              <div
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`cls-table-chip ${isSelected ? 'is-selected' : ''}`}
                title={`Click to inspect ${cls.name}`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px', color: cls.isInterface ? '#38bdf8' : '#818cf8' }}>
                  {cls.isInterface ? 'integration_instructions' : 'data_object'}
                </span>
                <span style={{ fontWeight: isSelected ? 700 : 500 }}>{cls.name}</span>
                {cls.isInterface && <span style={{ fontSize: '9px', color: '#38bdf8', opacity: 0.85 }}>&lt;&lt;interface&gt;&gt;</span>}

                <span className="cls-member-count-badge">
                  F:{fieldsCount} M:{methodsCount}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClass(cls.id)
                  }}
                  className="seq-icon-action-btn delete"
                  style={{ width: '16px', height: '16px', padding: 0 }}
                  title="Delete class"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>close</span>
                </button>
              </div>
            )
          })}
        </div>

        {/* Quick Add Custom Class */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            className="studio-text-input"
            placeholder="New Class Name (e.g. OrderProcessor, ITokenProvider)"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddClass()}
            style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
          />
          <button
            type="button"
            className="studio-shell-btn studio-shell-btn-primary"
            onClick={() => handleAddClass()}
            style={{ padding: '4px 12px', fontSize: '11px' }}
          >
            + Add Class
          </button>
        </div>
      </div>

      {/* 2. CLASS INSPECTOR (FOCUSED OR ALL) */}
      {(viewMode === 'focused' ? (activeClass ? [activeClass] : []) : filteredClasses).map((cls) => {
        const isSelected = activeClass && activeClass.id === cls.id

        return (
          <div
            key={cls.id}
            id={`class-card-${cls.id}`}
            className="cls-focused-card"
            style={{
              borderColor: isSelected ? '#818cf8' : undefined,
              boxShadow: isSelected ? '0 0 14px rgba(129, 140, 248, 0.25)' : undefined
            }}
          >
            {/* Class Header Banner */}
            <div className="cls-header-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: cls.isInterface ? '#38bdf8' : '#818cf8' }}>
                  {cls.isInterface ? 'integration_instructions' : 'data_object'}
                </span>

                {/* Inline Class Rename with propagation */}
                <input
                  type="text"
                  className="cls-rename-input"
                  value={cls.name}
                  onChange={(e) => handleUpdateClass(cls.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '_') })}
                  title="Rename class (auto-updates connected relationships)"
                />

                {/* Interface toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', color: '#94a3b8', cursor: 'pointer', marginLeft: '6px' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(cls.isInterface)}
                    onChange={(e) => handleUpdateClass(cls.id, { isInterface: e.target.checked })}
                  />
                  <span style={{ color: cls.isInterface ? '#38bdf8' : '#94a3b8', fontWeight: cls.isInterface ? 600 : 400 }}>
                    &lt;&lt;interface&gt;&gt;
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  className="studio-shell-btn studio-shell-btn-secondary"
                  onClick={() => handleAddAttribute('String', '')}
                  style={{ padding: '2px 7px', fontSize: '10.5px' }}
                >
                  + Field
                </button>
                <button
                  type="button"
                  className="studio-shell-btn studio-shell-btn-secondary"
                  onClick={() => handleAddMethod('', '', 'void')}
                  style={{ padding: '2px 7px', fontSize: '10.5px' }}
                >
                  + Method
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClass(cls.id)}
                  className="seq-icon-action-btn delete"
                  title="Delete class"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>delete</span>
                </button>
              </div>
            </div>

            {/* Class Members Container */}
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* ATTRIBUTES SECTION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.03em' }}>
                    FIELDS / PROPERTIES ({(cls.attributes || []).length})
                  </span>

                  {/* Quick Field Presets */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddAttribute('UUID', 'id')}>+ id (UUID)</button>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddAttribute('String', 'name')}>+ name</button>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddAttribute('String', 'status')}>+ status</button>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddAttribute('Date', 'createdAt')}>+ createdAt</button>
                  </div>
                </div>

                {(cls.attributes || []).map((attr, aIdx) => (
                  <div key={attr.id} className="cls-member-row">
                    {/* Visibility */}
                    <select
                      className="cls-visibility-select"
                      value={attr.visibility || '+'}
                      onChange={(e) => handleUpdateAttribute(attr.id, { visibility: e.target.value })}
                      title="Visibility modifier"
                    >
                      {VISIBILITIES.map((v) => (
                        <option key={v.id} value={v.id}>{v.id} ({v.label.split(' ')[1]})</option>
                      ))}
                    </select>

                    {/* Data Type */}
                    <input
                      type="text"
                      className="cls-type-input"
                      value={attr.type || 'String'}
                      onChange={(e) => handleUpdateAttribute(attr.id, { type: e.target.value })}
                      list={`types-list-${cls.id}`}
                      placeholder="Type"
                      title="Field type (e.g. String, UUID, User)"
                    />
                    <datalist id={`types-list-${cls.id}`}>
                      {COMMON_DATA_TYPES.map((t) => (
                        <option key={t} value={t} />
                      ))}
                      {classes.map((c) => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>

                    {/* Field Name */}
                    <input
                      type="text"
                      className="cls-name-input"
                      value={attr.name || ''}
                      onChange={(e) => handleUpdateAttribute(attr.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '_') })}
                      placeholder="field_name"
                    />

                    {/* Reordering */}
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={() => handleMoveAttribute(aIdx, -1)}
                      disabled={aIdx === 0}
                      title="Move Up"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={() => handleMoveAttribute(aIdx, 1)}
                      disabled={aIdx === (cls.attributes || []).length - 1}
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_downward</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteAttribute(attr.id)}
                      className="seq-icon-action-btn delete"
                      title="Delete field"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
                    </button>
                  </div>
                ))}

                {(cls.attributes || []).length === 0 && (
                  <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '4px' }}>
                    No attributes defined. Click "+ Field" or a quick preset above.
                  </div>
                )}
              </div>

              {/* METHODS SECTION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '0.03em' }}>
                    METHODS / FUNCTIONS ({(cls.methods || []).length})
                  </span>

                  {/* Quick Method Presets */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddMethod('findById', 'id: UUID', cls.name)}>+ findById()</button>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddMethod('save', 'entity', cls.name)}>+ save()</button>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddMethod('delete', 'id: UUID', 'Boolean')}>+ delete()</button>
                    <button type="button" className="seq-snippet-chip" onClick={() => handleAddMethod('execute', '', 'void')}>+ execute()</button>
                  </div>
                </div>

                {(cls.methods || []).map((m, mIdx) => (
                  <div key={m.id} className="cls-member-row">
                    {/* Visibility */}
                    <select
                      className="cls-visibility-select"
                      value={m.visibility || '+'}
                      onChange={(e) => handleUpdateMethod(m.id, { visibility: e.target.value })}
                      title="Method visibility"
                    >
                      {VISIBILITIES.map((v) => (
                        <option key={v.id} value={v.id}>{v.id} ({v.label.split(' ')[1]})</option>
                      ))}
                    </select>

                    {/* Method Name */}
                    <input
                      type="text"
                      className="cls-name-input"
                      value={m.name || ''}
                      onChange={(e) => handleUpdateMethod(m.id, { name: e.target.value.replace(/[^a-zA-Z0-9_]/g, '_') })}
                      placeholder="methodName"
                      style={{ flex: 1.2 }}
                    />

                    {/* Params */}
                    <input
                      type="text"
                      className="cls-params-input"
                      value={m.params || ''}
                      onChange={(e) => handleUpdateMethod(m.id, { params: e.target.value })}
                      placeholder="params (e.g. id, opts)"
                      style={{ flex: 1.5 }}
                    />

                    {/* Return Type */}
                    <input
                      type="text"
                      className="cls-type-input"
                      value={m.returnType || 'void'}
                      onChange={(e) => handleUpdateMethod(m.id, { returnType: e.target.value })}
                      placeholder="returnType"
                      style={{ width: '85px' }}
                    />

                    {/* Reordering */}
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={() => handleMoveMethod(mIdx, -1)}
                      disabled={mIdx === 0}
                      title="Move Up"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      className="seq-icon-action-btn"
                      onClick={() => handleMoveMethod(mIdx, 1)}
                      disabled={mIdx === (cls.methods || []).length - 1}
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>arrow_downward</span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteMethod(m.id)}
                      className="seq-icon-action-btn delete"
                      title="Delete method"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>close</span>
                    </button>
                  </div>
                ))}

                {(cls.methods || []).length === 0 && (
                  <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '4px' }}>
                    No methods defined. Click "+ Method" or a quick preset above.
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* 3. VISUAL CLASS RELATIONSHIPS & INHERITANCE */}
      <div className="cls-relationships-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a855f7' }}>
              hub
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>
              Inheritance, Aggregations & Dependencies ({relationships.length})
            </span>
          </div>

          <button
            type="button"
            className="studio-shell-btn studio-shell-btn-secondary"
            onClick={() => handleAddRelationship('<|--', 'inherits')}
            disabled={classes.length === 0}
            style={{ padding: '3px 9px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#a855f7' }}>add</span>
            <span>+ Relationship</span>
          </button>
        </div>

        {/* Visual Relationship Route Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {relationships.map((rel) => {
            const relConfig = RELATIONSHIP_TYPES.find((r) => r.id === rel.type) || RELATIONSHIP_TYPES[0]

            return (
              <div key={rel.id} className="cls-rel-card">
                {/* Visual Route Bar: From ──[ Type ]──▶ To */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* From Class */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '110px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#818cf8' }}>data_object</span>
                    <select
                      className="studio-text-input"
                      value={rel.from}
                      onChange={(e) => handleUpdateRelationship(rel.id, { from: e.target.value })}
                      style={{ flex: 1, fontSize: '11px', padding: '4px 6px', fontWeight: 600 }}
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Relationship Type Selector with symbol */}
                  <select
                    className="cls-rel-type-select"
                    value={rel.type}
                    onChange={(e) => handleUpdateRelationship(rel.id, { type: e.target.value })}
                    title={relConfig.desc}
                  >
                    {RELATIONSHIP_TYPES.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.symbol} {rt.label}
                      </option>
                    ))}
                  </select>

                  {/* To Class */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '110px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#38bdf8' }}>data_object</span>
                    <select
                      className="studio-text-input"
                      value={rel.to}
                      onChange={(e) => handleUpdateRelationship(rel.id, { to: e.target.value })}
                      style={{ flex: 1, fontSize: '11px', padding: '4px 6px', fontWeight: 600 }}
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Invert direction */}
                  <button
                    type="button"
                    className="seq-icon-action-btn"
                    onClick={() => handleUpdateRelationship(rel.id, { from: rel.to, to: rel.from })}
                    title="Swap relationship direction (Invert)"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>swap_horiz</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteRelationship(rel.id)}
                    className="seq-icon-action-btn delete"
                    title="Delete relationship"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>close</span>
                  </button>
                </div>

                {/* Sub-row: Human Label & Quick Verb Snippets */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={rel.label || ''}
                    onChange={(e) => handleUpdateRelationship(rel.id, { label: e.target.value })}
                    placeholder="relationship description / verb (e.g. manages, implements, extends)"
                    style={{ flex: 1, fontSize: '11px', padding: '3px 8px', color: '#cbd5e1' }}
                  />

                  {/* Quick Verb Chips */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {QUICK_RELATION_VERBS.slice(0, 4).map((verb) => (
                      <button
                        key={verb}
                        type="button"
                        className="seq-snippet-chip"
                        onClick={() => handleUpdateRelationship(rel.id, { label: verb })}
                      >
                        +{verb}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}

          {relationships.length === 0 && (
            <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', padding: '8px', textAlign: 'center' }}>
              No relationships defined yet. Click "+ Relationship" above to connect classes.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
