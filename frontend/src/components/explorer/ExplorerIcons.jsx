import React from 'react'

export function FolderIcon({ isExpanded, isSpecial = null }) {
  if (isSpecial === 'github') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path
          d={isExpanded
            ? "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v1.9H1.5M14.5 6l-1.8 6.5H1.5L3.3 6h11.2z"
            : "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v6.4c0 .5-.4.9-.9.9H1.5c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9z"
          }
          stroke="#9d9d9d"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 5.6a2.4 2.4 0 0 0-.76 4.67c.12.02.16-.05.16-.12v-.42c-.67.14-.81-.32-.81-.32-.11-.28-.27-.35-.27-.35-.22-.15.02-.15.02-.15.24.02.37.25.37.25.22.37.57.26.71.2.02-.16.09-.27.16-.33-1.04-.12-1.76-.52-1.76-1.84 0-.38.14-.68.36-.92-.04-.09-.16-.43.03-.9 0 0 .29-.09.94.35a3.3 3.3 0 0 1 1.7 0c.65-.45.94-.35.94-.35.19.47.07.82.03.9.22.24.36.55.36.92 0 1.33-.73 1.72-1.77 1.83.09.08.16.23.16.47v.7c0 .07.05.14.17.12A2.4 2.4 0 0 0 8 5.6z"
          fill="#c084fc"
        />
      </svg>
    )
  }

  if (isSpecial === 'test') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path
          d={isExpanded
            ? "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v1.9H1.5M14.5 6l-1.8 6.5H1.5L3.3 6h11.2z"
            : "M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v6.4c0 .5-.4.9-.9.9H1.5c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9z"
          }
          stroke="#9d9d9d"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.5 8L4 9.5l1.5 1.5M10.5 8L12 9.5l-1.5 1.5"
          stroke="#f87171"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (isExpanded) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
        <path
          d="M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v1.9H1.5M14.5 6l-1.8 6.5H1.5L3.3 6h11.2z"
          stroke="#eab308"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M1.5 3.5h4l1.2 1.2h7.8c.5 0 .9.4.9.9v6.4c0 .5-.4.9-.9.9H1.5c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9z"
        stroke="#d4d4d8"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function getTreeItemIcon(item, isExpanded) {
  if (item.isDirectory) {
    const nameLower = item.name.toLowerCase()
    if (nameLower === '.github') return <FolderIcon isExpanded={isExpanded} isSpecial="github" />
    if (nameLower === 'test' || nameLower === 'tests') return <FolderIcon isExpanded={isExpanded} isSpecial="test" />
    return <FolderIcon isExpanded={isExpanded} />
  }

  const nameLower = item.name.toLowerCase()
  const ext = nameLower.split('.').pop() || ''

  if (ext === 'md' || ext === 'markdown') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#38bdf8" style={{ flexShrink: 0 }}>
        <path d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM3 11V6h1.5l1.5 2 1.5-2H9v5H7.5V8.5L6 10.5 4.5 8.5V11H3zm9.5 0L10 8.5h1.5V6H13v2.5h1.5L12.5 11z"/>
      </svg>
    )
  }

  if (ext === 'jsx') {
    return (
      <svg width="15" height="15" viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="#61dafb" strokeWidth="1.3" style={{ flexShrink: 0 }}>
        <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </svg>
    )
  }

  if (ext === 'tsx') {
    return (
      <svg width="15" height="15" viewBox="-11.5 -10.23 23 20.46" fill="none" stroke="#3178c6" strokeWidth="1.3" style={{ flexShrink: 0 }}>
        <circle cx="0" cy="0" r="2.05" fill="#3178c6" />
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </svg>
    )
  }

  if (ext === 'ts') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#3178c6" style={{ flexShrink: 0 }}>
        <path d="M2 2v12h12V2H2zm3 3h4v1.5H7.2V11H5.8V6.5H5V5zm4.8 2.2h1.5c.6 0 1 .4 1 1 0 .4-.2.7-.6.9.5.1.8.5.8 1 0 .7-.5 1.1-1.2 1.1H9.8V7.2zm1.2 1.1c.3 0 .5-.2.5-.4 0-.3-.2-.4-.5-.4h-.4v.8h.4zm.1 1.9c.3 0 .6-.2.6-.5 0-.3-.3-.5-.6-.5h-.5v1h.5z"/>
      </svg>
    )
  }

  if (ext === 'js' || ext === 'mjs' || ext === 'cjs') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#f7df1e" style={{ flexShrink: 0 }}>
        <path d="M2 2v12h12V2H2zm8.5 8.5c-.3.5-.8.8-1.5.8-1.2 0-1.8-.8-1.8-2 0-1.4.8-2.1 2-2.1.6 0 1.1.2 1.4.6l-.6.6c-.2-.3-.5-.4-.8-.4-.7 0-1.2.5-1.2 1.3 0 .8.4 1.3 1.1 1.3.4 0 .7-.2.9-.4l.5.5z"/>
      </svg>
    )
  }

  if (ext === 'py') {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path fill="#387eb8" d="M11.91 2C6.4 2 6.42 4.49 6.42 4.49H11.9v1.99H4.42S1.93 6.46 1.93 11.97s2.49 5.48 2.49 5.48h1.49v-2.73s-.08-3.23 3.19-3.23h5.48v-2.5s.4-3.5-3.59-3.5h-1.5zm-2.49 1.74a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/>
        <path fill="#ffe873" d="M12.09 22c5.51 0 5.49-2.49 5.49-2.49h-5.48v-1.99h7.48s2.49.02 2.49-5.49-2.49-5.48-2.49-5.48h-1.49v2.73s.08 3.23-3.19 3.23h-5.48v2.5s-.4 3.5 3.59 3.5h1.5zm2.49-1.74a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"/>
      </svg>
    )
  }

  if (ext === 'json') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#f59e0b" style={{ flexShrink: 0 }}>
        <path d="M4 2v3c0 1-1 1-1 2 0 1 1 1 1 2v3c0 1 1 1 2 1v-1c-.5 0-1 0-1-1v-2.5c0-.8-.7-1.2-1.2-1.5.5-.3 1.2-.7 1.2-1.5V3c0-1 .5-1 1-1V1c-1 0-2 0-2 1zm8 0c-1 0-2 0-2-1v1c.5 0 1 0 1 1v2.5c0 .8.7 1.2 1.2 1.5-.5.3-1.2.7-1.2 1.5V11c0 1-.5 1-1 1v1c1 0 2 0 2-1v-3c0-1 1-1 1-2 0-1-1-1-1-2V2z"/>
      </svg>
    )
  }

  if (ext === 'css' || ext === 'scss' || ext === 'less') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#38bdf8" style={{ flexShrink: 0 }}>
        <path d="M2 1h12l-1.5 13L8 15.5 3.5 14 2 1zm10.2 3.5H4.2l.3 2.5h7.3l-.4 3.5-3.4 1-3.4-1-.2-1.8H3l.3 3.2 4.7 1.4 4.7-1.4.8-7.4z"/>
      </svg>
    )
  }

  if (ext === 'html' || ext === 'htm') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#f97316" style={{ flexShrink: 0 }}>
        <path d="M5.5 3.5L2 8l3.5 4.5 1.2-1L3.9 8l2.8-3.5-1.2-1zm5 0l-1.2 1L12.1 8l-2.8 3.5 1.2 1L14 8l-3.5-4.5z"/>
      </svg>
    )
  }

  if (ext === 'svg' || ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp' || ext === 'gif') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#c084fc" style={{ flexShrink: 0 }}>
        <path d="M2 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2zm11 11H3l3.5-4.5 2.5 3 2-2.5 2 4zm0-8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
      </svg>
    )
  }

  if (ext === 'sh' || ext === 'bash' || ext === 'ps1' || ext === 'bat' || ext === 'cmd') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#10b981" style={{ flexShrink: 0 }}>
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-11zM3 4.5l3 3-3 3 .8.8 3.8-3.8L3.8 3.7 3 4.5zm5 7h4v-1.2H8v1.2z"/>
      </svg>
    )
  }

  if (ext === 'yaml' || ext === 'yml' || ext === 'toml') {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#ef4444" style={{ flexShrink: 0 }}>
        <path d="M2 3h12v10H2V3zm1 1v8h10V4H3zm2 2h6v1H5V6zm0 2h6v1H5V8zm0 2h4v1H5v-1z"/>
      </svg>
    )
  }

  if (nameLower.startsWith('license')) {
    return (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="#eab308" style={{ flexShrink: 0 }}>
        <path d="M8 0L1 3v5c0 4.42 3.06 8.55 7 9.5 3.94-.95 7-5.08 7-9.5V3l-7-3zm3 7.5L7.25 11.25a.75.75 0 0 1-1.06 0l-1.5-1.5a.75.75 0 1 1 1.06-1.06l.97.97 3.22-3.22a.75.75 0 1 1 1.06 1.06z"/>
      </svg>
    )
  }

  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="#94a3b8" style={{ flexShrink: 0 }}>
      <path d="M9 1H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7L9 1zm1 5V2.5L13.5 6H10z"/>
    </svg>
  )
}
