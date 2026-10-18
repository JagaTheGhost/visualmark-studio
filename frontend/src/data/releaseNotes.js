/**
 * VisualMark Studio - Release Notes & Update History Dataset
 * Powers the "What's New" modal dialog, update notifications, and in-IDE release history.
 */
export const APP_CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.1.2'

export const RELEASE_HISTORY = [
  {
    version: '1.1.2',
    type: 'patch',
    title: 'VisualMark Studio 1.1.2 — GitHub Repo Card Studio, Internationalization (i18n), Collapsible Tab Groups & StudioShell Architecture',
    date: 'October 2026',
    isCurrent: true,
    highlights: [
      'GitHub Repo Card Studio: Standalone first-class visual studio generating 100% client-side vector SVG repo cards with live telemetry and auto-adaptive dark/light themes',
      'Comprehensive Internationalization (i18n): Native multi-language support across 10 locales (English, Simplified Chinese, Spanish, Japanese, German, French, Russian, Hindi, Portuguese-BR, Italian) with custom language pack import/export',
      'Syntax & Document Language Mode Switcher: Interactive Status Bar picker modal supporting instant switching and extension-based detection for 30+ language modes',
      'Chrome/Arc-Style Collapsible Tab Groups: Visual workspace tab bar separating Open Documents and Active Visual Studios with individual accent chips, counters, and accordion collapse states',
      'Universal StudioShell Architecture: Unified 2-pane resizable layout container across all 12 visual studios with persistent action bars (Insert at Cursor, Copy, Reset, Back) and live code drawers',
      'Motion Hero & Animated Media Studio: New animated GIF and MP4/WebM motion hero generator with framed macOS/Windows 11 app mockups, autoplay, and ambient glow accents',
      'Local Workspace Media Engine: Native Electron IPC channel resolving and rendering local workspace SVGs, PNGs, and videos directly in Markdown Live Preview with zero external servers',
      'Tactile Unsupported File Screen: Seamless embedded canvas view for binary and media assets with file metadata specs, reveal in Explorer, and system app launcher buttons',
      'FastAPI Sidecar Lifecycle Resiliency: Startup health check polling and reliable Windows taskkill process tree termination on application exit preventing orphaned daemons'
    ],
    sections: [
      {
        category: 'New: GitHub Repo Card Studio',
        icon: 'credit_card',
        badge: 'New Studio',
        color: '#58a6ff',
        items: [
          {
            title: '100% Client-Side Vector SVG Generation',
            desc: 'Generates self-contained, high-DPI vector repository cards without external API dependencies or rate limits.'
          },
          {
            title: 'Auto-Adaptive Dark & Light Theming',
            desc: 'Dynamic SVGs leveraging @media (prefers-color-scheme) alongside curated presets: Official GitHub Dark, GitHub Light, Obsidian Slate, Nord Frost, and Dracula.'
          },
          {
            title: '4 Production Layout Templates',
            desc: 'Choose from Official Pin, Bento Telemetry, Language Distribution Ribbon, and Minimal Compact layouts.'
          },
          {
            title: '1-Click Snippet & Vector Download',
            desc: 'Instantly insert markdown image links at the cursor or download standalone SVG cards directly to your workspace assets folder.'
          }
        ]
      },
      {
        category: 'New: Internationalization (i18n) & Language Modes',
        icon: 'translate',
        badge: 'i18n',
        color: '#10b981',
        items: [
          {
            title: '10 Built-In World Languages',
            desc: 'Full UI localization in English, 简体中文, Español, 日本語, Deutsch, Français, Русский, हिन्दी, Português (BR), and Italiano with automatic browser/system language detection.'
          },
          {
            title: 'Custom Language Pack Import & Export',
            desc: 'Export current translation dictionaries or import community JSON language packs with live hot-reloading and localStorage persistence.'
          },
          {
            title: 'Document & Syntax Language Mode Picker',
            desc: 'Interactive Status Bar button and modal dialog for switching syntax highlighting across Markdown, MDX, LaTeX, Plain Text, Mermaid, HTML, CSS, JavaScript, TypeScript, Python, Rust, Go, and more.'
          }
        ]
      },
      {
        category: 'New: Collapsible Tab Groups',
        icon: 'tab_group',
        badge: 'Workspace',
        color: '#8b5cf6',
        items: [
          {
            title: 'Documents vs Studios Partitioning',
            desc: 'Automatically groups open files and active studio tabs into distinct collapsible groups to keep complex workspaces organized.'
          },
          {
            title: 'Accent-Themed Header Chips & Badges',
            desc: 'Chrome and Arc-inspired pill headers with status dots, item counters, and smooth collapse/expand transitions.'
          }
        ]
      },
      {
        category: 'Architecture: Universal StudioShell Container',
        icon: 'dashboard',
        badge: 'Refactor',
        color: '#38bdf8',
        items: [
          {
            title: 'Unified 2-Pane Resizable Layout',
            desc: 'Refactored all 12 visual studios to use StudioShell, providing consistent property inspectors, WYSIWYG preview stages, and resizable dividers.'
          },
          {
            title: 'Persistent Universal Action Bar',
            desc: 'Standardized [Insert into Document (Ctrl+Enter)], [Copy Markdown], [Reset], and [Back to Readme] buttons across every studio tab.'
          },
          {
            title: 'Preview Stage Theming & Live Code Drawer',
            desc: 'Toggle canvas backgrounds (Dark, Midnight, Light, Grid) and inspect real-time character and line count statistics in the expandable code drawer.'
          }
        ]
      },
      {
        category: 'Enhanced: Image Studio & Motion Heroes',
        icon: 'movie',
        badge: 'Visual Design',
        color: '#ec4899',
        items: [
          {
            title: 'Motion Hero & Video Banner Generator',
            desc: 'Embed animated GIFs and MP4/WebM videos wrapped in authentic macOS or Windows 11 browser frames with configurable autoplay, loop, mute, and controls.'
          },
          {
            title: 'Animated SVG Vectors & Visual Sweeps',
            desc: 'Enhanced SVG banner generators with sweeping gradient animations and modern aesthetic presets.'
          }
        ]
      },
      {
        category: 'Reliability: Media Engine & Sidecar Daemon',
        icon: 'bolt',
        badge: 'Reliability',
        color: '#f59e0b',
        items: [
          {
            title: 'Direct Workspace Media Streaming',
            desc: 'New read-local-media Electron IPC resolves and renders relative workspace images, SVGs, and videos in the Live Preview Pane.'
          },
          {
            title: 'Embedded Unsupported File Screen',
            desc: 'Tactile embedded canvas view for binary formats with metadata inspection, Reveal in Explorer, and system app launching.'
          },
          {
            title: 'Sidecar Health Polling & Teardown',
            desc: 'FastAPI sidecar startup now polls health checks before accepting requests, and Windows taskkill cleanly terminates the process tree on shutdown.'
          }
        ]
      }
    ]
  },
  {
    version: '1.1.1',
    type: 'patch',
    title: 'VisualMark Studio 1.1.1 — Embedded Canvas Launcher, Tactile Physical Depth UI & Security Hardening',
    date: 'October 2026',
    isCurrent: false,
    highlights: [
      'Embedded Canvas Launcher: Eliminated generic floating card container; launcher now merges seamlessly into the background canvas',
      'Tactile Physical Depth Controls: Multi-layered ambient drop shadows, top rim light-catch bevel highlights, and mechanical press animations',
      'Engraved Background Typography: Soft recessed text shadows giving headings, taglines, and labels an authentic embedded appearance',
      'Explorer Context & Dropdown Menus: Fixed unstyled browser-default popups with modern dark glassmorphism and elevated z-index',
      'Streamlined Workspace Workflow: Pruned redundant Create Project wizard from launcher in favor of direct local/remote workspace entry',
      'Integrated Diagnostics Routing: Diverted intrusive runtime errors & warnings into bottom panel ProblemsTab with grouped origin cards',
      'Modernized Windows Installer: Bypassed redundant all-users prompt, applied Fluent Slate-100 theme, and max LZMA2 compression',
      'Cryptographic Release Verification: Embedded automated SHA-256 checksum generation into GitHub Releases',
      'Studio Scrolling Fixed: Resolved wheel event traps and flex layout bounds enabling smooth vertical scrolling across all studio tabs',
      'Electron IPC Security Hardening: Enforced double-dash argument delimiters, protocol validation, and executable launch blocks'
    ],
    sections: [
      {
        category: 'Changed: Embedded Canvas Launcher & Tactile UI',
        icon: 'palette',
        badge: 'UI Polish',
        color: '#38bdf8',
        items: [
          {
            title: 'Seamless Embedded Background Integration',
            desc: 'Replaced the legacy floating card box with a transparent embedded canvas layout that integrates directly into the IDE background without artificial borders.'
          },
          {
            title: 'Tactile Physical Depth Buttons',
            desc: 'Primary cards (Clone Repository & Open Folder), secondary action pills, and recent workspace items now feature multi-tier shadows, top rim highlights, and mechanical click depression.'
          },
          {
            title: 'Recessed & Engraved Typography',
            desc: 'Headings, version badges, taglines, and keyboard shortcuts feature soft recessed text-shadows seamlessly etched into the dark canvas floor.'
          },
          {
            title: 'Pruned Redundant Launcher Workflows',
            desc: 'Removed the legacy Create Project card from the launcher, focusing initial startup directly on opening folders or cloning remote git repositories.'
          }
        ]
      },
      {
        category: 'Fixed: Explorer Menus & Missing CSS',
        icon: 'menu',
        badge: 'Fixed',
        color: '#eab308',
        items: [
          {
            title: 'Explorer More Actions Dropdown Styling',
            desc: 'Fixed missing CSS rules for .ide-dropdown-menu, converting unstyled white browser-default menus into modern dark glassmorphism with glowing vector icons.'
          },
          {
            title: 'Context Menu Stacking & Dark Theme',
            desc: 'Elevated context menu z-index to 99999 and applied backdrop blur, consistent padding, and danger hover states.'
          }
        ]
      },
      {
        category: 'Security: IPC & Preview Hardening',
        icon: 'security',
        badge: 'Security',
        color: '#10b981',
        items: [
          {
            title: 'Git Remote Argument Injection Prevention',
            desc: 'Enforced explicit "--" delimiter before target directories in Electron git clone calls to prevent flag injection.'
          },
          {
            title: 'Protocol & Path Traversal Guards',
            desc: 'Restricted openExternal calls strictly to http:// and https:// schemes, and blocked executable launch via openPath.'
          },
          {
            title: 'Preview Sanitization',
            desc: 'Audited and hardened DOMPurify configurations in LivePreviewPane and MermaidRenderer to prevent script injection.'
          }
        ]
      },
      {
        category: 'Fixed: Studio Scrolling & Layout Boundaries',
        icon: 'swap_vert',
        badge: 'Fixed',
        color: '#6366f1',
        items: [
          {
            title: 'Wheel Event Trap Elimination',
            desc: 'Removed e.preventDefault() boundaries in horizontalScrollHelper to allow natural vertical mouse and trackpad scrolling across all studio forms.'
          },
          {
            title: 'Flex Column Height Bounds',
            desc: 'Added min-height: 0 and height: 100% constraints across studio columns and main editor wrapper to ensure unconstrained scroll overflow.'
          }
        ]
      }
    ]
  },
  {
    version: '1.1.0',
    type: 'minor',
    title: 'VisualMark Studio 1.1.0 — Icons & Emoji Studio, Live API Documentation Preview & UI Polish',
    date: 'October 2026',
    isCurrent: false,
    highlights: [
      '11th Specialized Visual Studio: Icons & Emoji Studio (icons.studio) with dedicated Vector Icons and Emojis tabs',
      'Vector Icon Color Customizer with 9 preset themes, native color wheel, hex input, and live catalog tinting',
      'Dual-flavor icon embedding: colored SVG downloads, Iconify image Markdown syntax, and direct Monaco injection',
      'Monaco editor ":" inline autocomplete integration for both emojis and Material vector symbols',
      'API Studio Live Documentation Preview with Live Preview, Split View, and Markdown & Code modes',
      'Dual API render engines: interactive Swagger-style REST Blueprint and authentic GitHub GFM Render',
      'Fluid 30 FPS animated banner GIF showcasing IDE features and visual studio workspaces',
      'Resolved Iconify ligature underscore 404 broken images, diagram color dots overflow, and Chromium scrollbar corner glitch'
    ],
    sections: [
      {
        category: 'Added: Icons & Emoji Studio (11th Studio)',
        icon: 'sentiment_satisfied',
        badge: 'Added',
        color: '#6366f1',
        items: [
          {
            title: 'Dedicated Dual-Mode Studio Workspace',
            desc: 'Cleanly partitions Vector Material Icons (Material Symbols) and Developer Emojis into dedicated sub-tabs to prevent visual clutter and workflow disruption.'
          },
          {
            title: 'Vector Icon Color Customizer',
            desc: 'Features 9 preset color swatches tailored for dark/light IDE and GitHub themes, native HTML5 color wheel, and direct HEX code input with auto-formatting.'
          },
          {
            title: 'Live Catalog Tinting Toggle',
            desc: 'Enabling the "[x] Tint catalog preview" checkbox dynamically recolors every vector icon card across the entire catalog in real time.'
          },
          {
            title: 'Dual-Flavor SVG Export Engine',
            desc: 'Exports customized icons via direct local .svg downloads with baked-in vector fills, or generates remote Iconify markdown image syntax (<img src="https://api.iconify.design/material-symbols:...svg?color=..." />).'
          },
          {
            title: 'Monaco ":" Inline Autocomplete',
            desc: 'Typing ":" directly inside the Monaco editor summons instantaneous autocompletion for both Unicode emojis and Material vector icons.'
          }
        ]
      },
      {
        category: 'Added: API Studio Live Documentation Preview',
        icon: 'api',
        badge: 'Added',
        color: '#0ea5e9',
        items: [
          {
            title: 'Multi-Mode View Switcher',
            desc: 'Switch between Live Preview (full canvas), Split View (interactive form builder alongside live documentation preview), and Markdown & Code (raw syntax view).'
          },
          {
            title: 'REST Blueprint Interactive Spec Card',
            desc: 'Swagger/Postman-style card featuring color-coded HTTP method badges (GET, POST, PUT, DELETE, PATCH), parameter matrix, JSON request body viewer, and multi-status response tabs (200 OK, 400 Bad Request, 500 Server Error).'
          },
          {
            title: 'GitHub GFM Render Engine',
            desc: 'Authentic GitHub-Flavored Markdown preview powered by ReactMarkdown, displaying the exact markdown layout that appears on GitHub repositories.'
          },
          {
            title: '1-Click Insert into Active Document',
            desc: 'Injects fully-rendered API documentation tables and specs into the active document at the current cursor line.'
          }
        ]
      },
      {
        category: 'Added: Modular Floating Toolbar (HUD)',
        icon: 'auto_fix_high',
        badge: 'Major',
        color: '#eab308',
        items: [
          {
            title: 'Contextual Quick Action HUD',
            desc: 'Highlighting text in the Monaco editor instantly summons a floating toolbar with dropdowns for Headings (H1-H4), Code Blocks (8 languages), Hyperlinks, and GitHub Callouts ([!NOTE], [!TIP], etc.).'
          },
          {
            title: 'Monaco Focus Retention & Undo/Redo',
            desc: 'Preserves native Monaco Undo/Redo stack via editor.executeEdits and prevents blur through onMouseDown event guards.'
          },
          {
            title: 'Dedicated Settings Tab Category',
            desc: 'Configure every tool under Settings > Floating Toolbar with quick bulk toggles, persistent localStorage syncing, and real-time cross-tab reactivity.'
          }
        ]
      },
      {
        category: 'Added: Modern GitHub Repo Cards Studio',
        icon: 'featured_play_list',
        badge: 'Major',
        color: '#10b981',
        items: [
          {
            title: '3-Step Guided Inspector',
            desc: 'Streamlined configuration into Target & Sync -> Card Template -> Theme & Styling. Replaced cluttered forms with an intuitive guided workflow.'
          },
          {
            title: '100% Client-Side Pure Vector SVG Engine',
            desc: 'Zero external API quotas or render servers. Auto-adapts to dark and light GitHub themes via native @media (prefers-color-scheme) CSS rules.'
          },
          {
            title: '4 Modern Vector Templates',
            desc: 'Choose between Official GitHub Pin with authentic Octicons, Linear Bento Telemetry Matrix, Proportional Languages Stacked Bar, and Minimal Compact Spec.'
          },
          {
            title: 'Unified Action Bar & Offline Export',
            desc: 'One-click "Insert into Document" saves self-hosted SVGs directly into your workspace assets/ folder, plus Copy SVG markup and Download .svg.'
          }
        ]
      },
      {
        category: 'Added: Fluid 30 FPS Showcase Banner',
        icon: 'animation',
        badge: 'Added',
        color: '#ec4899',
        items: [
          {
            title: 'High-FPS Animated Banner GIF',
            desc: 'Replaced static/legacy media with a high-fidelity 1200x600 30 FPS animated banner showcasing the workspace, editor capabilities, and studio suites.'
          }
        ]
      },
      {
        category: 'Changed: Layout & Studio UX Refinements',
        icon: 'tune',
        badge: 'Changed',
        color: '#f59e0b',
        items: [
          {
            title: 'API Studio Column Proportioning',
            desc: 'Balanced split-view builder width to 480px with a fluid documentation canvas for optimal dual-column spacing.'
          },
          {
            title: 'Studio Form Overflow Hardening',
            desc: 'Added overflow-x: hidden to .studio-form-column across studios, eliminating horizontal jitter and scrollbar artifacts during tab switches.'
          },
          {
            title: 'Responsive Control Toolbars',
            desc: 'Standardized view mode and style toggle buttons into responsive wrapped pills for all display aspect ratios.'
          }
        ]
      },
      {
        category: 'Fixed: Stability & Rendering Normalizations',
        icon: 'bug_report',
        badge: 'Fixed',
        color: '#10b981',
        items: [
          {
            title: 'Iconify Ligature Underscore 404 Bug',
            desc: 'Normalized Google Material ligature names containing underscores (bug_report, rocket_launch, check_circle, inventory_2) to Iconify-compliant kebab-case.'
          },
          {
            title: 'API Preset Cards Styling',
            desc: 'Fixed unstyled white button background and text collision in API Studio preset cards with dark theme token alignment.'
          },
          {
            title: 'Architecture Diagram Shape & Color Overflow',
            desc: 'Resolved shape selector and color swatches clipping out of bounds in Diagram Studio using responsive flex-wrapping.'
          },
          {
            title: 'Chromium Scrollbar White Corner Glitch',
            desc: 'Eliminated solid white unstyled square appearing at the intersection of vertical and horizontal scrollbars in Chromium and Electron.'
          }
        ]
      },
      {
        category: 'Removed: Legacy Assets & Deprecations',
        icon: 'delete_sweep',
        badge: 'Removed',
        color: '#94a3b8',
        items: [
          {
            title: 'Deprecated IDE Showcase GIF',
            desc: 'Removed legacy VisualMark_Studio_IDE.gif from assets and frontend bundles to reduce bundle footprint.'
          },
          {
            title: 'Legacy Unstyled Preset Elements',
            desc: 'Removed unstyled legacy button structures in API Studio preset components.'
          }
        ]
      }
    ]
  },

  {
    version: '1.0.3',
    type: 'patch',
    title: 'VisualMark Studio 1.0.3 — Command Palette, Terminals & Stability Overhaul',
    date: 'October 2026',
    isCurrent: false,
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