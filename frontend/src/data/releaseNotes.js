/**
 * VisualMark Studio - Release Notes & Update History Dataset
 * Powers the "What's New" modal dialog, update notifications, and in-IDE release history.
 */
export const APP_CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.3'

export const RELEASE_HISTORY = [
  {
    version: '1.0.3',
    type: 'patch',
    title: 'VisualMark Studio 1.0.3 — Command Palette, Terminals & Stability Overhaul',
    date: 'October 2026',
    isCurrent: true,
    highlights: [
      'Interactive Command Palette (F1 / Ctrl+Shift+P) with in-line ⚙ Keybinding Configuration and Alt+Enter trigger',
      'Monaco right-click context menu redirection directly into VisualMark Command Palette',
      'Integrated Bottom Panel Drawer (Ctrl+`) with PowerShell/CMD terminals, Markdown diagnostics, and system output',
      'Deep-linked Keyboard Shortcuts tab with auto-fill and auto-open keybinding recorder modal',
      'Notification Center & dark theme synchronization with persistent unread counters',
      'Multi-cursor editor commands: Add Cursor Above/Below, Change All Occurrences, Format Document, and Word Wrap',
      'Fixed React UI startup mount errors and sanitized shortcuts query event handling'
    ],
    sections: [
      {
        category: 'Command Palette & Keybindings',
        icon: 'terminal',
        badge: 'Major',
        color: '#6366f1',
        items: [
          {
            title: 'In-Line Keybinding Configuration (⚙️)',
            desc: 'Every command in the Command Palette now displays a settings gear on hover/selection to configure its shortcut directly, matching VS Code workflows.'
          },
          {
            title: 'Monaco Right-Click & F1 Interception',
            desc: 'Selecting "Command Palette" from the editor context menu or pressing F1 directly opens the VisualMark palette instead of the uncustomizable Monaco popup.'
          },
          {
            title: 'Shortcuts Tab Deep Linking',
            desc: 'Clicking ⚙ on any command switches directly to the Keyboard Shortcuts tab, pre-filters the table, and pops open the Keybinding Recorder modal.'
          },
          {
            title: 'Multi-Cursor Editor Commands',
            desc: 'Added Add Cursor Above (Ctrl+Alt+Up), Add Cursor Below (Ctrl+Alt+Down), Change All Occurrences (Ctrl+F2), Format Document (Shift+Alt+F), and Word Wrap (Alt+Z).'
          }
        ]
      },
      {
        category: 'Integrated Bottom Panel Drawer',
        icon: 'view_agenda',
        badge: 'New',
        color: '#38bdf8',
        items: [
          {
            title: 'Embedded PowerShell & CMD Terminals',
            desc: 'Direct execution of local shells with session tabs, add/switch/clear controls, and external launch shortcuts.'
          },
          {
            title: 'Markdown Problems & Diagnostics',
            desc: 'Real-time document linter reporting broken links, malformed tables, and heading level skips with click-to-line navigation.'
          },
          {
            title: 'System Output Telemetry',
            desc: 'Live timestamped log viewer tracking file operations, Git actions, and IDE daemon events.'
          }
        ]
      },
      {
        category: 'Stability & Bug Fixes',
        icon: 'bug_report',
        badge: 'Fix',
        color: '#10b981',
        items: [
          {
            title: 'Snippet Modal State Scope Fix',
            desc: 'Restored insertModalState in root component, eliminating ReferenceError on launch.'
          },
          {
            title: 'Shortcuts Initial Query Type Guard',
            desc: 'Sanitized parameters in ShortcutsTab to handle event objects safely and prevent TypeError: replace is not a function.'
          },
          {
            title: 'Notification Theme & Counter Fix',
            desc: 'Synchronized notification drawer dark theme with IDE chrome and ensured accurate unread counter tracking.'
          }
        ]
      }
    ]
  },
  {
    version: '1.0.2',
    type: 'patch',
    title: 'VisualMark Studio 1.0.2 — Live Update Progress & Security Hardening',
    date: 'October 2026',
    isCurrent: false,
    highlights: [
      'Live auto-updater progress bar with real-time transfer speed (MB/s) and percentage feedback',
      'Instant network and download failure diagnostic alerting in the Status Bar',
      'Synchronized Windows NSIS installer artifact filenames to prevent auto-updater 404 errors',
      'SSRF defense on backend endpoints, preventing private and loopback address lookups',
      'Strict domain matching in imageUtils to prevent host spoofing vulnerabilities'
    ],
    sections: [
      {
        category: 'Auto-Updater & Desktop UX',
        icon: 'system_update',
        badge: 'Feature',
        color: '#38bdf8',
        items: [
          {
            title: 'Live Download Progress Bar',
            desc: 'Status bar and What’s New views now display live percent, transferred MB, total size, and download speed.'
          },
          {
            title: 'Installer Asset Alignment',
            desc: 'Aligned release asset naming across NSIS installer and electron-updater metadata to ensure 100% reliable updates.'
          }
        ]
      },
      {
        category: 'Security Hardening',
        icon: 'security',
        badge: 'Security',
        color: '#10b981',
        items: [
          {
            title: 'SSRF & Loopback Defense',
            desc: 'Backend image resolution rejects private, loopback (127.0.0.1, localhost), link-local, and multicast IP addresses.'
          },
          {
            title: 'Strict Subdomain Sanitization',
            desc: 'Frontend hostname checking enforces exact domain boundaries, blocking substring spoofing.'
          }
        ]
      }
    ]
  },
  {
    version: '1.0.1',
    type: 'patch',
    title: 'VisualMark Studio 1.0.1 — Maintenance & UX Fixes',
    date: 'October 2026',
    isCurrent: false,
    highlights: [
      'Fixed titlebar application logo asset rendering under file:// protocol',
      'Prevented packaged desktop app from defaulting to installation folder on launch',
      'Added empty workspace state ("No Folder Opened") with quick folder picker',
      'Implemented repository security disclosure policy, CodeQL scanning, and Dependabot'
    ],
    sections: [
      {
        category: 'Desktop & Shell Fixes',
        icon: 'build',
        badge: 'Fix',
        color: '#10b981',
        items: [
          {
            title: 'Titlebar Logo Asset Resolution',
            desc: 'Bundled application icon directly via Vite assets pipeline to guarantee crisp rendering in packaged desktop builds.'
          },
          {
            title: 'Clean Workspace Startup',
            desc: 'Desktop app now launches into a clean welcome state when no CLI argument is passed, rather than opening internal binaries.'
          }
        ]
      },
      {
        category: 'Security Hardening',
        icon: 'security',
        badge: 'Security',
        color: '#6366f1',
        items: [
          {
            title: 'Security Policy & Scanning',
            desc: 'Integrated SECURITY.md, CodeQL static analysis workflow, and Dependabot for continuous vulnerability tracking.'
          }
        ]
      }
    ]
  },
  {
    version: '1.0.0',
    type: 'major', // 'major' | 'minor' | 'patch'
    title: 'Initial Release: The Code + Visual Markdown IDE',
    date: 'October 2026',
    isCurrent: false,
    highlights: [
      'Authentic VS Code Monaco Editor with minimap, code folding, and smart GFM completions',
      'Dual-Engine Architecture: switch seamlessly between Monaco and Classic lightweight editor',
      '10+ Built-in Visual Studio Workspaces (Mermaid Diagrams, Badges, Tables, API, Audit, and more)',
      '100% Local-First Desktop Shell powered by Electron and embedded FastAPI Sidecar engine'
    ],
    sections: [
      {
        category: 'New Features',
        icon: 'stars',
        badge: 'Major',
        color: '#6366f1',
        items: [
          {
            title: 'VS Code Monaco Editor Engine',
            desc: 'Real VS Code Monaco Editor embedded with custom Obsidian/Slate dark themes, indentation code folding, interactive minimap, smooth cursor caret, and GFM autocompletions.'
          },
          {
            title: 'Synchronized Split-Pane Scrolling',
            desc: 'Real-time bidirectional scroll synchronization between Monaco lines and the live rendered HTML preview canvas using document anchor lines.'
          },
          {
            title: 'Integrated Terminal & Diagnostics Drawer',
            desc: 'Native bottom panel (Ctrl+`) with embedded PowerShell & CMD terminal sessions, error diagnostics pipeline, and real-time output streams.'
          },
          {
            title: '10+ Visual Studio Workspaces',
            desc: 'Mermaid Architecture Studio, Shields.io Badge Studio, Table Designer, Image Banner Designer, Directory Tree Studio, API Endpoint Builder, and Documentation Quality Auditor.'
          }
        ]
      },
      {
        category: 'Performance & Architecture',
        icon: 'speed',
        badge: 'Optimization',
        color: '#10b981',
        items: [
          {
            title: '78% Bundle Size Reduction',
            desc: 'Code-split PDF export, Mermaid rendering engine, and modal workspaces, slashing initial bundle from 1.68 MB down to 395 kB.'
          },
          {
            title: 'Dynamic Port Collision Resolution',
            desc: 'FastAPI local sidecar automatically scans and resolves free ports from 8000 to 8030 to prevent network conflicts.'
          },
          {
            title: 'Dual Editor Fallback',
            desc: 'Choose between high-powered Monaco or lightweight classic editor under Settings or View menu anytime.'
          }
        ]
      },
      {
        category: 'In-App Auto-Updates',
        icon: 'sync',
        badge: 'Seamless',
        color: '#38bdf8',
        items: [
          {
            title: 'Zero-Reinstall Updates',
            desc: 'Automatic background update downloads via GitHub Releases with one-click restart to apply patches and new releases.'
          }
        ]
      }
    ]
  }
]

export function getLatestRelease() {
  return RELEASE_HISTORY[0] || null
}

export function getReleaseByVersion(version) {
  return RELEASE_HISTORY.find((r) => r.version === version) || null
}