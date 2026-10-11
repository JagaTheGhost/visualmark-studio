import React from 'react'

export default function ActivityBar({
  activeTab,
  onTabChange,
  sidebarCollapsed,
  onToggleSidebar,
  onOpenShortcuts,
  onOpenSettings,
  gitChangesCount = 0
}) {
  const tabs = [
    {
      id: 'explorer',
      label: 'Explorer (Ctrl+Shift+E)',
      icon: 'folder_open',
      badge: null
    },
    {
      id: 'git',
      label: 'Source Control / Git',
      icon: 'fork_right',
      badge: gitChangesCount > 0 ? gitChangesCount : null
    },
    {
      id: 'generator',
      label: 'Documentation Config',
      icon: 'tune',
      hasDot: false
    },
    {
      id: 'outline',
      label: 'Document Outline (TOC)',
      icon: 'toc',
      badge: null
    },
    {
      id: 'templates',
      label: 'Starter Presets & Templates',
      icon: 'bookmark_border',
      badge: null
    },
    {
      id: 'tools',
      label: 'Studio Tools & Builders (Badges, Diagrams, Tables, Snippets)',
      icon: 'widgets',
      badge: null
    }
  ]

  const handleTabClick = (tabId) => {
    if (activeTab === tabId) {
      // Toggle sidebar if clicking the already active tab
      onToggleSidebar()
    } else {
      // Switch tab and always open sidebar
      onTabChange(tabId)
    }
  }

  return (
    <aside className="activity-bar select-none">
      {/* Top Cluster */}
      <div className="activity-bar-top">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id && !sidebarCollapsed
          return (
            <button
              key={tab.id}
              type="button"
              className={`activity-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
              title={tab.label}
            >
              <span
                className="material-symbols-outlined activity-icon"
                style={tab.id === 'generator' && isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {tab.icon}
              </span>
              {tab.badge !== null && tab.badge !== undefined && (
                <span className="activity-tab-badge">{tab.badge}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom Cluster */}
      <div className="activity-bar-bottom" style={{ marginTop: 'auto' }}>
        <button
          type="button"
          className="activity-tab-btn"
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (Ctrl+/)"
        >
          <span className="material-symbols-outlined activity-icon">keyboard</span>
        </button>
        <button
          type="button"
          className="activity-tab-btn"
          onClick={onOpenSettings}
          title="Settings & Preferences (Ctrl+,)"
        >
          <span className="material-symbols-outlined activity-icon">settings</span>
        </button>
      </div>
    </aside>
  )
}
