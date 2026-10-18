import React from 'react'

export const STUDIO_TABS_CONFIG = {
  'badges.studio': {
    id: 'badges.studio',
    label: 'Shields.io Badges',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0c-.3 0-.6.1-.8.3L2.4 3.7c-.3.2-.4.6-.4.9v5.2c0 3.8 2.6 7.1 6 8.2 3.4-1.1 6-4.4 6-8.2V4.6c0-.3-.1-.7-.4-.9L8.8.3C8.6.1 8.3 0 8 0zm0 1.5l4.5 2.5v4.8c0 3-2 5.7-4.5 6.6-2.5-.9-4.5-3.6-4.5-6.6V4L8 1.5z"/>
      </svg>
    )
  },
  'repocard.studio': {
    id: 'repocard.studio',
    label: 'GitHub Repo Card',
    iconColor: '#58a6ff',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    )
  },
  'diagrams.studio': {
    id: 'diagrams.studio',
    label: 'Mermaid Diagrams',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zM5 10.5A1.5 1.5 0 0 1 6.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 5 13.5v-3z"/>
      </svg>
    )
  },
  'tables.studio': {
    id: 'tables.studio',
    label: 'Table Designer',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm1 3v9a1 1 0 0 0 1 1h4.5V5H1zm6.5 10H14a1 1 0 0 0 1-1V5H7.5v10zM15 4V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2h14z"/>
      </svg>
    )
  },
  'snippets.studio': {
    id: 'snippets.studio',
    label: 'Code & Callouts',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
      </svg>
    )
  },
  'images.studio': {
    id: 'images.studio',
    label: 'Image & Banners',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
      </svg>
    )
  },
  'tree.studio': {
    id: 'tree.studio',
    label: 'Directory Tree',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v1.25A1.5 1.5 0 0 1 5.5 5.25H2.5v5.5H5v-1.5A1.5 1.5 0 0 1 6.5 7.75h3A1.5 1.5 0 0 1 11 9.25v2.5A1.5 1.5 0 0 1 9.5 13.25h-3A1.5 1.5 0 0 1 5 11.75V11.5H2v-6A.5.5 0 0 1 2.5 5h3a.5.5 0 0 0 .5-.5V2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H5v1.25a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-2.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V12H2.5a1.5 1.5 0 0 1-1.5-1.5v-8z"/>
      </svg>
    )
  },
  'api.studio': {
    id: 'api.studio',
    label: 'API & Endpoints',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 2.5A2.5 2.5 0 0 1 3.5 0h9A2.5 2.5 0 0 1 15 2.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5v-11zM3.5 1A1.5 1.5 0 0 0 2 2.5v11A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-11A1.5 1.5 0 0 0 12.5 1h-9zm1.75 3.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5H6v1.5a.75.75 0 0 1-1.5 0V8.25H3a.75.75 0 0 1 0-1.5h1.5V5.25a.75.75 0 0 1 .75-.75zm4.25 1a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75zm0 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75z"/>
      </svg>
    )
  },
  'audit.studio': {
    id: 'audit.studio',
    label: 'Doc Auditor',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0c-.3 0-.6.1-.8.3L2.4 3.7c-.3.2-.4.6-.4.9v5.2c0 3.8 2.6 7.1 6 8.2 3.4-1.1 6-4.4 6-8.2V4.6c0-.3-.1-.7-.4-.9L8.8.3C8.6.1 8.3 0 8 0zm2.854 6.854l-3.5 3.5a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 9.293l3.146-3.147a.5.5 0 0 1 .708.708z"/>
      </svg>
    )
  },
  'contributors.studio': {
    id: 'contributors.studio',
    label: 'Contributors',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 1c-1.8 0-4 1-4 2.5V13h5.2a5.5 5.5 0 0 1-.2-1.5c0-.9.3-1.8.8-2.5H4.5z"/>
      </svg>
    )
  },
  'changelog.studio': {
    id: 'changelog.studio',
    label: 'Changelog',
    iconColor: '#818cf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
      </svg>
    )
  },
  'icons.studio': {
    id: 'icons.studio',
    label: 'Icons & Emojis',
    iconColor: '#38bdf8',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
      </svg>
    )
  },
  'settings': {
    id: 'settings',
    label: 'Settings',
    iconColor: '#38bdf8',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M9.1 1.2a1 1 0 0 0-2.2 0l-.3 1a6.002 6.002 0 0 0-1.4.8l-1-.4a1 1 0 0 0-1.6 1.6l.4 1a6.002 6.002 0 0 0-.8 1.4l-1 .3a1 1 0 0 0 0 2.2l1 .3a6.002 6.002 0 0 0 .8 1.4l-.4 1a1 1 0 0 0 1.6 1.6l1-.4a6.002 6.002 0 0 0 1.4.8l.3 1a1 1 0 0 0 2.2 0l.3-1a6.002 6.002 0 0 0 1.4-.8l1 .4a1 1 0 0 0 1.6-1.6l-.4-1a6.002 6.002 0 0 0 .8-1.4l1-.3a1 1 0 0 0 0-2.2l-1-.3a6.002 6.002 0 0 0-.8-1.4l.4-1a1 1 0 0 0-1.6-1.6l-1 .4a6.002 6.002 0 0 0-1.4-.8l-.3-1zM8 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>
      </svg>
    )
  },
  'shortcuts': {
    id: 'shortcuts',
    label: 'Keyboard Shortcuts',
    iconColor: '#38bdf8',
    icon: (
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M14 2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM2 3h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2h2v2H3V5zm3 0h2v2H6V5zm3 0h2v2H9V5zm3 0h1v2h-1V5zM3 8h1v2H3V8zm2 0h6v2H5V8zm7 0h1v2h-1V8z"/>
      </svg>
    )
  },
  'whats-new': {
    id: 'whats-new',
    label: 'Patch Notes',
    iconColor: '#a855f7',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
      </svg>
    )
  },
  'release-notes': {
    id: 'release-notes',
    label: 'Patch Notes',
    iconColor: '#a855f7',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
      </svg>
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
