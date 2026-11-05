/**
 * VisualMark Studio - Release Notes & Update History Dataset
 * Powers the "What's New" modal dialog, update notifications, and in-IDE release history.
 */
export const APP_CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.2.3'

export const RELEASE_HISTORY = [
  {
    version: '1.2.3',
    type: 'patch',
    title: 'VisualMark Studio 1.2.3 — Visual Studio Architecture Optimizations, Native About Dialog & GitHub Sponsors',
    date: 'November 2026',
    isCurrent: true,
    overview: 'VisualMark Studio **1.2.3** delivers a comprehensive architecture overhaul to **Mermaid Diagram Studio** (featuring a completely redesigned 3-section Mindmap Studio, resilient syntax compilers for Git graphs and Flowcharts, smooth canvas zoom up to 500%, and multi-level theme color scales). It also introduces an industry-standard **Native About Dialog** with one-click diagnostic copying, the complete **GitHub Sponsorship Suite**, multi-platform release identity, and an optimized download conversion funnel.',
    highlights: [
      'Mindmap Studio Architecture Overhaul: 3-section visual studio featuring root concept shapes, a collapsible tree hierarchy with L1–L5 depth badges, and a dedicated branch inspector',
      'Resilient Diagram Compilers: Crash guards for Git graphs (mandatory main commit, auto-branch declaration) and Flowcharts (empty subgraph bounding placeholders)',
      'Adaptive Canvas Zoom to 500%: Smooth non-passive mouse wheel and trackpad pinch scaling with adaptive acceleration steps up to 500%',
      'Multi-Level Theme Color Scales: Extended all 8 diagram themes with 8-step color palettes (cScale0–cScale7) and custom root nodes for rich mindmap visualizations',
      'Native About & Diagnostics Dialog: Completely rebuilt 2-tab About modal featuring 1-click diagnostic system info copying, open-source foundation credits, and live version status',
      'GitHub Sponsorship Integration: Introduced FUNDING.yml, status bar sponsor pill, Help menu integration, command palette actions, and subtle export gratitude toasts',
      'Single-Source-of-Truth Wiki: Consolidated documentation into the GitHub Wiki repository (.wiki_staging) and added rich in-repo screenshots to README'
    ],
    sections: [
      {
        category: 'Visual Studio & Diagram Architecture',
        icon: 'schema',
        badge: 'Studio Engine',
        color: '#818cf8',
        items: [
          {
            title: '3-Section Visual Mindmap Studio',
            desc: 'Redesigned MindmapVisualBuilder with a Central Root Concept card, foldable tree outline with depth badges and child counters, and a focused Branch Inspector with instant promote/indent and reordering.'
          },
          {
            title: 'Resilient Git Graph & Flowchart Compilers',
            desc: 'Hardened compilers with automatic initial commit guards, auto-branch declaration on checkout, self-merge prevention, and empty subgraph placeholder nodes to eliminate layout crashes.'
          },
          {
            title: '500% Canvas Zoom & Theme Palettes',
            desc: 'Upgraded DiagramCanvas with non-passive mouse wheel zoom up to 500% and extended all 8 themes with comprehensive cScale0–cScale7 branch color palettes.'
          }
        ]
      },
      {
        category: 'Dialogs & Developer Diagnostics',
        icon: 'info',
        badge: 'System Diagnostics',
        color: '#6366f1',
        items: [
          {
            title: 'Native 2-Tab About Dialog',
            desc: 'Streamlined, compact 450px native IDE dialog with About and Credits & Backers tabs, displaying platform info, MIT licensing, and community foundations.'
          },
          {
            title: '1-Click System Info Copying',
            desc: 'Quickly copies OS, architecture, Electron, Node, and app versions to clipboard for frictionless bug reports and diagnostics.'
          }
        ]
      },
      {
        category: 'Open Source & Sponsorship',
        icon: 'favorite',
        badge: 'Funding',
        color: '#ec4899',
        items: [
          {
            title: 'GitHub Sponsorship Integration',
            desc: 'Added official FUNDING.yml metadata, status bar expandable sponsor pill, top Help menu items, and non-intrusive export milestone gratitude toasts.'
          },
          {
            title: 'Multi-Platform Desktop Distribution',
            desc: 'Refactored hero badges and documentation to highlight universal Windows (.exe), macOS (.dmg), and Linux (.AppImage, .deb) availability.'
          }
        ]
      },
      {
        category: 'Documentation & Architecture',
        icon: 'menu_book',
        badge: 'Wiki First',
        color: '#10b981',
        items: [
          {
            title: 'Consolidated Wiki Architecture',
            desc: 'Standardized all technical manuals, testing checklists, and developer guides on the official GitHub Wiki (.wiki_staging) to avoid documentation duplication.'
          },
          {
            title: 'Visual Proof & Optimized Funnel',
            desc: 'Showcases authentic IDE screenshots upfront with a targeted pitch callout directly before the download matrix.'
          }
        ]
      }
    ]
  },
  {
    version: '1.2.2',
    type: 'patch',
    title: 'VisualMark Studio 1.2.2 — Delta Differential Updates & Minimalist Circular Download Indicator',
    date: 'November 2026',
    isCurrent: false,
    overview: 'VisualMark Studio **1.2.2** resolves community feedback from Discussion #17 regarding auto-update performance and UI clutter. This release re-enables **NSIS differential delta updates (`.blockmap`)**, shrinking patch downloads from ~170MB down to **~5–15MB** by downloading only changed 64KB code blocks. It resolves background auto-update download triggering, fixes Windows sidecar process locking during restart, and unifies all download indications into an elegant **SVG circular progress ring** in the bottom Status Bar displaying the live percentage inside the ring.',
    highlights: [
      'Differential Delta Patching: Enabled NSIS blockmap delta updates, slashing patch download size from ~170MB to ~5–15MB by downloading only modified blocks',
      'Auto-Updater Pipeline Resolution: Fixed auto-download initiation in background and resolved Windows sidecar process-locking errors on update restarts',
      'Minimalist Circular Download UI: Integrated a clean SVG circular progress indicator in the bottom Status Bar with percentage displayed inside the circle',
      'De-Cluttered Download Indicators: Pruned redundant floating tabs, tab header pills, linear banners, and noisy in-flight toast notifications',
      'CI/CD Delta Artifact Staging: Updated release workflow to bundle and publish *.blockmap and latest*.yml manifests directly to GitHub Releases'
    ],
    sections: [
      {
        category: 'Auto-Update & Delta Updates',
        icon: 'system_update',
        badge: 'Delta Patching',
        color: '#38bdf8',
        items: [
          {
            title: 'Blockmap Differential Downloads (~5–15MB Patches)',
            desc: 'Re-enabled NSIS differential blockmap packaging. Existing users updating from v1.2.1 now download only modified code blocks instead of re-downloading the entire ~170MB desktop installer.'
          },
          {
            title: 'Auto-Download Triggering Fix',
            desc: 'Resolved an issue where auto-updates detected by the renderer failed to trigger download in the main process, eliminating the stuck 0% download state.'
          },
          {
            title: 'Safe Process Shutdown on Restart',
            desc: 'Hardened update installation lifecycle with synchronous sidecar process termination (spawnSync) to prevent Windows executable file-locking conflicts during update installation.'
          }
        ]
      },
      {
        category: 'UI & UX Streamlining',
        icon: 'donut_large',
        badge: 'Interface',
        color: '#10b981',
        items: [
          {
            title: 'Bottom Panel Circular Progress Indicator',
            desc: 'Replaced linear progress bars and text badges with a sleek, non-intrusive SVG circular progress ring in the bottom status bar showing the live percentage inside the circle.'
          },
          {
            title: 'Detailed Hover Telemetry',
            desc: 'Hovering the status bar circular indicator reveals transferred MB, total MB, and current transfer speed in a clean tooltip.'
          },
          {
            title: 'Elimination of Notification Clutter',
            desc: 'Removed distracting floating tabs from the document tab bar, tab header progress badges, and repeated in-flight download toasts.'
          }
        ]
      }
    ]
  },
  {
    version: '1.2.1',
    type: 'patch',
    title: 'VisualMark Studio 1.2.1 — Multi-Platform Releases, Security Confinement & Zero-Telemetry Transparency',
    date: 'November 2026',
    isCurrent: false,
    overview: 'VisualMark Studio **1.2.1** expands desktop distribution to **Linux** (`.AppImage`, `.deb`) and **macOS** (`.dmg`, `.zip` for **Apple Silicon** & **Intel**), while streamlining Windows to a dedicated **NSIS Setup installer**. This release hardens **workspace boundary confinement** (`isPathWithinWorkspace`), enforces strict **DOMPurify vector sanitization** for Mermaid and Markdown previews, and solidifies our **local-first, zero-telemetry** architecture with dynamic Python sidecar lifecycle management.',
    highlights: [
      'Multi-Platform Desktop Releases: Official distribution for Linux (.AppImage, .deb) and macOS (.dmg, .zip for Apple Silicon arm64 & Intel x64)',
      'Windows Distribution Streamlining: Exclusively packages the non-elevated NSIS setup installer, eliminating redundant portable bloat and ensuring reliable background updates',
      'Workspace Path Confinement & Sandboxing: Hardened IPC filesystem and Git handlers strictly confine disk operations to authorized project roots (isPathWithinWorkspace)',
      'Strict Vector & AST Sanitization: Hardened DOMPurify allowlists for all Mermaid diagrams and Markdown HTML previews, eliminating script injection and unsafe protocols',
      'Zero-Telemetry Local Sovereignty: Transparently documented local-first architecture where workspace data remains local with zero background analytics or cloud lock-in',
      'Cross-Platform Python Sidecar: Dynamic server/server.exe lifecycle management with automated Unix execution permissions and python3 fallback'
    ],
    sections: [
      {
        category: 'Multi-Platform Distribution',
        icon: 'devices',
        badge: 'Cross-Platform',
        color: '#6366f1',
        items: [
          {
            title: 'Linux Support (AppImage & deb)',
            desc: 'Universal plug-and-play AppImage running seamlessly across Ubuntu, Fedora, Arch, and Debian distributions alongside native .deb packages.'
          },
          {
            title: 'macOS Support (Apple Silicon & Intel)',
            desc: 'Dedicated drag-and-drop DMG installers and zip archives tailored for both Apple Silicon (M-series arm64) and Intel (x64) Macs.'
          },
          {
            title: 'Windows Setup Installer Focus',
            desc: 'Streamlined Windows releases to the fast, per-user NSIS installer, guaranteeing proper .md file associations and seamless background auto-updates.'
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
            title: 'Workspace Boundary Confinement',
            desc: 'All file read, write, create, move, and delete actions are strictly locked to explicitly opened workspace directories, blocking directory traversal and symlink escapes.'
          },
          {
            title: 'IPC Origin & Sender Validation',
            desc: 'Privileged Electron IPC handlers validate event.senderFrame origin to verify that all requests originate from legitimate local UI frames.'
          },
          {
            title: 'Strict SVG & Markdown Sanitization',
            desc: 'Previews run in strict security mode with DOMPurify allowlists that strip inline executable handlers, malicious script tags, and unauthorized protocols.'
          }
        ]
      },
      {
        category: 'Architecture & Privacy',
        icon: 'lock',
        badge: 'Privacy',
        color: '#f59e0b',
        items: [
          {
            title: 'Zero-Telemetry Local Sovereignty',
            desc: 'All documents, AST scans, and edits remain strictly local with zero background telemetry, user tracking, or forced cloud accounts.'
          },
          {
            title: 'Cross-Platform Sidecar Engine',
            desc: 'The embedded FastAPI sidecar daemon now automatically adapts between server.exe and server with proper Unix execution permissions.'
          }
        ]
      }
    ]
  },
  {
    version: '1.2.0',
    type: 'feature',
    title: 'VisualMark Studio 1.2.0 — Theme Suite, Welcome Hub, Source Control Suite & Quick Setup Wizard',
    date: 'October 2026',
    isCurrent: false,
    overview: 'VisualMark Studio **1.2.0** introduces a **10-Theme Palette Suite** with an instant header switcher, a sleek glassmorphic **Workspace Welcome Launcher** featuring an interactive playground, a **15-second Quick Setup Wizard**, and an overhauled **Source Control Git Drawer** with staging controls and commit validation.',
    highlights: [
      '10-Theme Palette Suite & Quick Picker: Tokyo Night, Dracula, GitHub Dark/Light, One Dark, Solarized Dark/Light, Monokai, Nord, Synthwave 84, and Modern with 1-click Dark/Light toggle and top bar quick-switcher',
      'Workspace Welcome Launcher: Glassmorphic onboarding hub with quick start templates, recent workspaces, and an interactive sample document (Playground.md)',
      '15-Second Quick Setup Wizard: Instant setup modal for new and existing users to configure theme, editor engine, and view mode',
      'Source Control / Git Drawer Overhaul: Native commit box with staged vs. unstaged diffs, Commit Confirmation safeguard modal, Commit Guide, and commit history',
      'Monaco Pro Editor Hardening: Real-time markdown lint diagnostics, word wrap, smooth minimap, line-height & font controls, and enhanced selection HUD',
      '100% Local-First & Zero-Cloud: Zero network telemetry, pure offline privacy, and lightning-fast local disk performance'
    ],
    sections: [
      {
        category: 'Theme System',
        icon: 'palette',
        badge: 'Appearance',
        color: '#8b5cf6',
        items: [
          {
            title: '10 Calibrated Color Themes',
            desc: 'Custom-tailored themes across high-contrast dark and clean light modes, including Tokyo Night, Dracula, GitHub Slate, One Dark, Solarized, and Synthwave.'
          },
          {
            title: 'Fast Dark / Light Mode Toggle',
            desc: 'Instant one-click toggle in the top menu bar to switch between dark and light variants with automatic Monaco tokenizer matching.'
          }
        ]
      },
      {
        category: 'Welcome & Onboarding',
        icon: 'rocket_launch',
        badge: 'Productivity',
        color: '#06b6d4',
        items: [
          {
            title: 'Workspace Welcome Launcher',
            desc: 'Visual hub with instant access to recent workspaces, template starters, visual studios, and interactive Playground.'
          },
          {
            title: 'Quick Setup Wizard Modal',
            desc: '15-second configuration wizard allowing quick personalization of theme, editor engine, and view modes.'
          }
        ]
      },
      {
        category: 'Git & Source Control',
        icon: 'fork_right',
        badge: 'Version Control',
        color: '#10b981',
        items: [
          {
            title: 'Redesigned Git Drawer & Commit Box',
            desc: 'Integrated commit composer with staged vs unstaged change counters, commit message validation, and commit history.'
          },
          {
            title: 'Commit Confirmation & Help Safeguards',
            desc: 'Safety modals preventing accidental commits and providing conventional commit message guidelines.'
          }
        ]
      }
    ]
  },
  {
    version: '1.1.4',
    type: 'feature',
    title: 'VisualMark Studio 1.1.4 — Diagram Studio Rebuild: 7 Visual Builders, 8 Themes & Monaco Tokenizer',
    date: 'October 2026',
    isCurrent: false,
    highlights: [
      '7 Specialized Visual Builders: Complete visual designer suites for Architecture Flowcharts, Sequence Diagrams, Database ER Models, Class & Object Models, State Machines, Git Branch Graphs, and Mindmaps',
      '8 Curated Diagram Themes: Midnight Obsidian, Tokyo Night, Cyber Neon, Forest Emerald, Dracula, Monokai Pro, Sunset Horizon, and GitHub Slate Light',
      'Monaco Mermaid Syntax Tokenizer: Custom syntax highlighting for Mermaid keywords, directions, arrows, nodes, and subgraphs in the code editor',
      'Interactive Pan & Zoom Canvas: Smooth 10% to 500% zoom controls, drag panning, grid canvas backdrops, and instant SVG/PNG export',
      'Architecture Blueprint Preset Catalog: Comprehensive library of pre-built, production-ready system architectures and data models'
    ],
    sections: [
      {
        category: 'Diagram Studio Rebuild',
        icon: 'account_tree',
        badge: 'Major Studio',
        color: '#6366f1',
        items: [
          {
            title: '7 Specialized Visual Builders',
            desc: 'Visually configure flowcharts, API handshakes, database entities with keys/types, class methods, state transitions, GitFlow branch lifelines, and hierarchical mindmaps with live two-way synchronization.'
          },
          {
            title: '8 High-Fidelity Theming Engines',
            desc: 'Tailored dark, neon, and slate themes that harmonize perfectly with modern documentation, GitHub READMEs, and presentations.'
          },
          {
            title: 'Monaco Mermaid Syntax Tokenizer',
            desc: 'Native syntax highlighting and Monarch tokenizer for Mermaid diagrams directly inside the Monaco code editor.'
          },
          {
            title: 'Interactive Canvas with Multi-Format Export',
            desc: 'Pan and zoom through massive cloud topologies, toggle grid canvas backdrops, and export directly to crisp SVG, high-resolution PNG, or GFM code blocks.'
          }
        ]
      }
    ]
  },
  {
    version: '1.1.3',
    type: 'patch',
    title: 'VisualMark Studio 1.1.3 — Packaging Pipeline Modernization, Differential Updates & Asset Fixes',
    date: 'October 2026',
    isCurrent: false,
    highlights: [
      'Packaging Modernization: Cleaned up setup packaging pipeline by removing legacy bitmaps and scripts in favor of standardized, non-elevated user-level installation',
      'Differential Auto-Updates: Verified delta blockmap pipeline allowing existing desktop installations to download only changed byte blocks without reinstalling',
      'Asset Resolution & Stability Patch: Fixed 16,000+ recursive console error loops caused by missing favicon requests and restored local launcher branding assets',
      'Streamlined Build Pipeline: Optimized production builds and CI/CD workflow compatibility'
    ],
    sections: [
      {
        category: 'Packaging & Updates',
        icon: 'system_update',
        badge: 'Setup',
        color: '#6366f1',
        items: [
          {
            title: 'Clean User-Level Installer',
            desc: 'Installs seamlessly into AppData without requiring administrator elevation, creating Start Menu and Desktop shortcuts.'
          },
          {
            title: 'Differential Delta Updates',
            desc: 'Utilizes blockmap manifests to download only modified byte chunks during auto-update, saving bandwidth and time.'
          }
        ]
      },
      {
        category: 'Bug Fixes & Stability',
        icon: 'bug_report',
        badge: 'Fixes',
        color: '#10b981',
        items: [
          {
            title: 'Console Error Loop Resolution',
            desc: 'Eliminated recursive missing favicon requests that caused over 16,000 console errors, ensuring smooth launch performance.'

          },
          {
            title: 'Launcher Brand Asset Bundling',
            desc: 'Resolved missing launcher logo by bundling the local high-resolution asset directly into the application.'
          }
        ]
      }
    ]
  },
  {
    version: '1.1.2',
    type: 'patch',
    title: 'VisualMark Studio 1.1.2 — GitHub Repo Card Studio, Internationalization (i18n), Collapsible Tab Groups & StudioShell Architecture',
    date: 'October 2026',
    isCurrent: false,
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
            desc: 'Exports customized icons via direct local .svg downloads with baked-in vector fills, or generates remote Iconify markdown image syntax (<img src="https://api.iconify.design/material-symbols/...svg?color=..." />).'
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