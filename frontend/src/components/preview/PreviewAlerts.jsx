import React from 'react'

// GitHub Alert Octicons matching official GitHub specifications
export const ALERT_ICONS = {
  NOTE: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  ),
  TIP: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.21c-.04-.287-.197-.625-.453-.996a8.03 8.03 0 0 0-.776-.983l-.213-.253C2.88 7.31 2.25 6.326 2.25 5.25c0-2.89 2.36-5.25 5.75-5.25 3.39 0 5.75 2.36 5.75 5.25 0 1.076-.63 2.06-1.316 2.873l-.213.253c-.266.315-.53.642-.776.983-.256.371-.413.71-.453.996a.75.75 0 0 1-1.484-.21c.084-.594.337-1.079.621-1.49.204-.292.45-.584.673-.848l.214-.253c.56-.679.984-1.32.984-2.304 0-2.06-1.637-3.75-4-3.75ZM6 13.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75ZM7.25 15a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Z" />
    </svg>
  ),
  IMPORTANT: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25v-9.5ZM8 3.5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 3.5ZM8 10.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  ),
  WARNING: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575L6.457 1.047ZM8 5a.75.75 0 0 0-.75.75v3.5a.75.75 0 0 0 1.5 0v-3.5A.75.75 0 0 0 8 5ZM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  ),
  CAUTION: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4.47.04c.328-.04.652-.04.98 0l7.26 1.452a1.75 1.75 0 0 1 1.38 1.38l1.452 7.26c.04.328.04.652 0 .98l-1.452 7.26a1.75 1.75 0 0 1-1.38 1.38l-7.26 1.452c-.328.04-.652.04-.98 0l-7.26-1.452a1.75 1.75 0 0 1-1.38-1.38L.04 11.112a2.025 2.025 0 0 1 0-.98L1.492 2.872A1.75 1.75 0 0 1 2.872 1.492L4.47.04ZM8 4a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-4.5A.75.75 0 0 0 8 4ZM8 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
    </svg>
  )
}

// Custom Remark Plugin to parse GitHub-Flavored Markdown Callouts / Alerts ([!NOTE], [!TIP], etc.)
export function remarkGithubAlerts() {
  return (tree) => {
    function walk(node) {
      if (!node || !node.children) return
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        if (child.type === 'blockquote') {
          processBlockquote(child)
        }
        walk(child)
      }
    }

    function processBlockquote(node) {
      if (!node.children || node.children.length === 0) return
      const firstChild = node.children[0]
      if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return

      const firstTextNode = firstChild.children[0]
      if (firstTextNode.type !== 'text') return

      const match = firstTextNode.value.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\r?\n|[ \t]+)?/i)
      if (!match) return

      const alertType = match[1].toUpperCase()

      // Strip the "[!NOTE]" prefix from text
      firstTextNode.value = firstTextNode.value.slice(match[0].length)

      if (!firstTextNode.value.trim()) {
        firstChild.children.shift()
      }
      if (firstChild.children.length === 0) {
        node.children.shift()
      }

      node.data = node.data || {}
      node.data.hName = 'div'
      node.data.hProperties = {
        ...(node.data.hProperties || {}),
        className: ['markdown-alert', `markdown-alert-${alertType.toLowerCase()}`],
        'data-alert-type': alertType
      }

      const titleNode = {
        type: 'paragraph',
        data: {
          hProperties: {
            className: ['markdown-alert-title'],
            'data-alert-type': alertType
          }
        },
        children: [
          {
            type: 'text',
            value: alertType.charAt(0) + alertType.slice(1).toLowerCase()
          }
        ]
      }

      node.children.unshift(titleNode)
    }

    walk(tree)
  }
}
