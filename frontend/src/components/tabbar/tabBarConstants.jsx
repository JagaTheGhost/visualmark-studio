import React from 'react'

export const STUDIO_TABS_CONFIG = {
  'badges.studio': {
    id: 'badges.studio',
    label: 'Shields.io Badges',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">sell</span>
    )
  },
  'repocard.studio': {
    id: 'repocard.studio',
    label: 'GitHub Repo Card',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">view_agenda</span>
    )
  },
  'diagrams.studio': {
    id: 'diagrams.studio',
    label: 'Mermaid Diagrams',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">schema</span>
    )
  },
  'tables.studio': {
    id: 'tables.studio',
    label: 'Table Designer',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">table_chart</span>
    )
  },
  'snippets.studio': {
    id: 'snippets.studio',
    label: 'Code & Callouts',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">code_blocks</span>
    )
  },
  'images.studio': {
    id: 'images.studio',
    label: 'Image & Banners',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">image</span>
    )
  },
  'tree.studio': {
    id: 'tree.studio',
    label: 'Directory Tree',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">folder_open</span>
    )
  },
  'api.studio': {
    id: 'api.studio',
    label: 'API & Endpoints',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">api</span>
    )
  },
  'audit.studio': {
    id: 'audit.studio',
    label: 'Doc Auditor',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">fact_check</span>
    )
  },
  'contributors.studio': {
    id: 'contributors.studio',
    label: 'Contributors',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">groups</span>
    )
  },
  'changelog.studio': {
    id: 'changelog.studio',
    label: 'Changelog',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">rocket_launch</span>
    )
  },
  'icons.studio': {
    id: 'icons.studio',
    label: 'Icons & Emojis',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">palette</span>
    )
  },
  'settings': {
    id: 'settings',
    label: 'Settings',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">settings</span>
    )
  },
  'shortcuts': {
    id: 'shortcuts',
    label: 'Keyboard Shortcuts',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">keyboard</span>
    )
  },
  'whats-new': {
    id: 'whats-new',
    label: 'Patch Notes',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">auto_awesome</span>
    )
  },
  'release-notes': {
    id: 'release-notes',
    label: 'Patch Notes',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">auto_awesome</span>
    )
  },
  'welcome': {
    id: 'welcome',
    label: 'Welcome',
    iconColor: '#818cf8',
    icon: (
      <span className="material-symbols-outlined">home</span>
    )
  }
}

export function getTabIcon(fileName) {
  const lower = fileName.toLowerCase()

  if (lower.endsWith('.css')) {
    return {
      color: '#38bdf8',
      icon: (
        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>
          {'{ }'}
        </span>
      )
    }
  }

  if (lower.endsWith('.jsx') || lower.endsWith('.tsx')) {
    return {
      color: '#61dafb',
      icon: (
        <svg width="13" height="13" viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="0" cy="0" r="2.05" fill="currentColor" />
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </svg>
      )
    }
  }

  if (lower.endsWith('.js') || lower.endsWith('.ts') || lower.endsWith('.json')) {
    return {
      color: '#e5c07b',
      icon: (
        <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '-1px' }}>
          {'{ }'}
        </span>
      )
    }
  }

  if (lower.includes('license')) {
    return {
      color: '#e5c07b',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0c-.3 0-.6.1-.8.3L2.4 3.7c-.3.2-.4.6-.4.9v5.2c0 3.8 2.6 7.1 6 8.2 3.4-1.1 6-4.4 6-8.2V4.6c0-.3-.1-.7-.4-.9L8.8.3C8.6.1 8.3 0 8 0zm0 1.5l4.5 2.5v4.8c0 3-2 5.7-4.5 6.6-2.5-.9-4.5-3.6-4.5-6.6V4L8 1.5z"/>
        </svg>
      )
    }
  }
  if (lower.includes('setup')) {
    return {
      color: '#10b981',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.854 4.146a.5.5 0 1 0-.708-.708L2.793 7.793a.5.5 0 0 0 0 .708l2.353 2.353a.5.5 0 0 0 .708-.708L3.707 8.146l2.147-2zM8 10.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H8z"/>
        </svg>
      )
    }
  }
  if (lower.includes('contributing')) {
    return {
      color: '#34d399',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-1.8 0-4 1-4 2.5V13h5.2a5.5 5.5 0 0 1-.2-1.5c0-.9.3-1.8.8-2.5H4.5z"/>
        </svg>
      )
    }
  }
  if (lower.includes('architecture')) {
    return {
      color: '#a78bfa',
      icon: (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM9 2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zM5 10.5A1.5 1.5 0 0 1 6.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 5 13.5v-3z"/>
        </svg>
      )
    }
  }
  // Markdown file icon (M↓ style in Antigravity sky blue)
  return {
    color: '#38bdf8',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9-1.5l-1.5 2v-4.5h-1v4.5l-1.5-2-.7.7 2.7 2.8 2.7-2.8-.7-.7z"/>
      </svg>
    )
  }
}
