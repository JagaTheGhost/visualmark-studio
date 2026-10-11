import React, { useState, useEffect } from 'react'

const DEFAULT_SECTIONS = [
  { id: 'features', label: '✨ Features' },
  { id: 'tech_stack', label: '📚 Tech Stack' },
  { id: 'project_structure', label: '🏗️ Project Structure' },
  { id: 'installation', label: '🚀 Installation & Setup' },
  { id: 'usage', label: '📖 Usage Guide' },
  { id: 'configuration', label: '🔧 Environment & Config' },
  { id: 'architecture', label: '📁 Architecture' },
  { id: 'testing', label: '🧪 Testing' },
  { id: 'troubleshooting', label: '🐛 Troubleshooting' },
  { id: 'deployment', label: '🌐 Deployment' },
  { id: 'contributing', label: '📝 Contributing & License' }
]

export default function SectionOrder({ sectionOrder, setSectionOrder, disabled }) {
  const [isOpen, setIsOpen] = useState(false)
  const [sections, setSections] = useState(() => {
    return DEFAULT_SECTIONS.map((s) => ({
      ...s,
      enabled: sectionOrder?.length > 0 ? sectionOrder.includes(s.id) : true
    }))
  })
  const [draggedItem, setDraggedItem] = useState(null)

  // Sync active enabled IDs to parent when sections change
  const updateParent = (newSections) => {
    setSections(newSections)
    const activeIds = newSections.filter((s) => s.enabled).map((s) => s.id)
    setSectionOrder(activeIds)
  }

  // Initialize once on mount
  useEffect(() => {
    if (!sectionOrder || sectionOrder.length === 0) {
      setSectionOrder(DEFAULT_SECTIONS.map((s) => s.id))
    }
  }, [])

  const toggleSection = (id) => {
    if (disabled) return
    const newSections = sections.map((s) =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    )
    updateParent(newSections)
  }

  const moveUp = (index) => {
    if (disabled || index === 0) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index - 1]
    newSections[index - 1] = temp
    updateParent(newSections)
  }

  const moveDown = (index) => {
    if (disabled || index === sections.length - 1) return
    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[index + 1]
    newSections[index + 1] = temp
    updateParent(newSections)
  }

  const handleReset = (e) => {
    e.stopPropagation()
    const reset = DEFAULT_SECTIONS.map((s) => ({ ...s, enabled: true }))
    updateParent(reset)
  }

  const activeCount = sections.filter((s) => s.enabled).length

  return (
    <div className="section-order-accordion">
      {/* Collapsible Header */}
      <button
        type="button"
        className="section-order-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="header-left">
          <span className="material-symbols-outlined accordion-icon">
            {isOpen ? 'expand_more' : 'chevron_right'}
          </span>
          <span className="order-title">Sections Blueprint</span>
          <span className="active-sections-tag">
            {activeCount}/{sections.length} Active
          </span>
        </div>
        <span className="toggle-hint-text">
          {isOpen ? 'Collapse' : 'Customize'}
        </span>
      </button>

      {/* Expandable Sections List */}
      {isOpen && (
        <div className="section-order-body">
          <div className="section-order-actions">
            <span className="hint-micro">Drag or use ▲ ▼ to reorder sections:</span>
            <button
              type="button"
              className="btn-reset-order"
              onClick={handleReset}
              disabled={disabled}
              title="Reset to default section ordering"
            >
              Reset
            </button>
          </div>

          <div className="section-order-list custom-scrollbar">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`section-order-item ${section.enabled ? 'enabled' : 'disabled'}`}
              >
                <div className="item-left">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => toggleSection(section.id)}
                    disabled={disabled}
                    className="section-checkbox"
                    title={section.enabled ? 'Disable section' : 'Enable section'}
                  />
                  <span className="drag-handle" title="Section item">
                    {index + 1}.
                  </span>
                  <span className="section-name truncate">
                    {section.label}
                  </span>
                </div>

                <div className="item-controls">
                  <button
                    type="button"
                    className="btn-arrow"
                    onClick={() => moveUp(index)}
                    disabled={disabled || index === 0}
                    title="Move section up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="btn-arrow"
                    onClick={() => moveDown(index)}
                    disabled={disabled || index === sections.length - 1}
                    title="Move section down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
