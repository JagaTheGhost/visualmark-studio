import React, { useState, useMemo } from 'react'
import { useStudioSplit } from '../../utils/useResizableSplit'

const SNIPPET_CATEGORIES = [
  { id: 'callouts', label: 'GitHub Alerts & Callouts', icon: 'campaign', desc: 'Official GFM alerts (Note, Tip, Warning, Caution)' },
  { id: 'multipm', label: 'Multi-PM & CLI Sync', icon: 'sync', desc: 'npm, pnpm, yarn, bun, pip, poetry, cargo commands' },
  { id: 'terminal', label: 'macOS CLI Window', icon: 'terminal', desc: 'Framed terminal window mockup with window controls' },
  { id: 'codeblock', label: 'Code & Diff Blocks', icon: 'code_blocks', desc: 'Language syntax blocks and migration git diffs' },
  { id: 'accordion', label: 'FAQ & Accordion List', icon: 'unfold_more', desc: 'Multi-item collapsible drawer sections' },
  { id: 'envvars', label: 'Environment Config (.env)', icon: 'settings_ethernet', desc: '.env.example specification & table' },
  { id: 'shortcuts', label: 'Keycaps & Shortcuts (<kbd>)', icon: 'keyboard', desc: 'Keyboard key bindings and hotkeys' },
  { id: 'license', label: 'License & Copyright', icon: 'verified', desc: 'MIT, Apache-2.0, GPL copyright notices' }
]

// 5 Official GitHub Alert Severity Types
const CALLOUT_TYPES = [
  { type: 'NOTE', icon: 'info', color: '#38bdf8', label: 'Note' },
  { type: 'TIP', icon: 'lightbulb', color: '#10b981', label: 'Tip' },
  { type: 'IMPORTANT', icon: 'error_outline', color: '#a855f7', label: 'Important' },
  { type: 'WARNING', icon: 'warning', color: '#f59e0b', label: 'Warning' },
  { type: 'CAUTION', icon: 'dangerous', color: '#ef4444', label: 'Caution' }
]

// Curated Callout Presets
const CALLOUT_PRESETS = [
  {
    id: 'prereq',
    severity: 'NOTE',
    title: 'Prerequisites & Environment Requirements',
    body: 'Requires **Node.js 20+** and **Python 3.11+**. Ensure Docker engine is active if using containerized orchestration.'
  },
  {
    id: 'perf',
    severity: 'TIP',
    title: 'Performance & Optimization Best Practice',
    body: 'Enable local disk caching with `CACHE_ENABLED=true` to accelerate AST syntax scanning by up to 80% on large multi-repo workspaces.'
  },
  {
    id: 'breaking',
    severity: 'WARNING',
    title: 'Breaking Changes in Version 2.0',
    body: 'Legacy session cookies are deprecated in favor of JWT Bearer tokens. Please review the [Migration Guide](./MIGRATION.md) before upgrading production clusters.'
  },
  {
    id: 'secrets',
    severity: 'CAUTION',
    title: 'Security Advisory: Secret Keys & Credentials',
    body: 'Never commit production secrets, database passwords, or private API keys to source control. Always populate sensitive values using `.env.local` or environment variables.'
  },
  {
    id: 'sec-report',
    severity: 'IMPORTANT',
    title: 'Responsible Security Disclosure',
    body: 'If you discover a security vulnerability, please do NOT file a public issue. Email security disclosures privately to security@yourdomain.com.'
  },
  {
    id: 'deprecation',
    severity: 'WARNING',
    title: 'API Endpoint Deprecation Schedule',
    body: 'The `/api/v1/generate` endpoint will sunset on **December 31, 2026**. Transition to the unified `/api/v2/stream` streaming endpoint.'
  }
]

// Multi-Package Manager Profiles
const PM_OPTIONS = [
  { id: 'npm', label: 'npm', cmd: (pkg, action) => action === 'run' ? `npm run ${pkg}` : action === 'create' ? `npm create ${pkg}` : `npm i ${pkg}` },
  { id: 'pnpm', label: 'pnpm', cmd: (pkg, action) => action === 'run' ? `pnpm ${pkg}` : action === 'create' ? `pnpm create ${pkg}` : `pnpm add ${pkg}` },
  { id: 'yarn', label: 'yarn', cmd: (pkg, action) => action === 'run' ? `yarn ${pkg}` : action === 'create' ? `yarn create ${pkg}` : `yarn add ${pkg}` },
  { id: 'bun', label: 'bun', cmd: (pkg, action) => action === 'run' ? `bun run ${pkg}` : action === 'create' ? `bun create ${pkg}` : `bun add ${pkg}` },
  { id: 'pip', label: 'pip', cmd: (pkg) => `pip install ${pkg}` },
  { id: 'poetry', label: 'poetry', cmd: (pkg) => `poetry add ${pkg}` },
  { id: 'uv', label: 'uv', cmd: (pkg) => `uv add ${pkg}` },
  { id: 'cargo', label: 'cargo', cmd: (pkg) => `cargo add ${pkg}` }
]

const CODE_LANGUAGES = [
  'bash', 'python', 'javascript', 'typescript', 'yaml', 'dockerfile', 'json', 'sql', 'rust', 'go', 'diff', 'html', 'css'
]

export default function SnippetStudioTab({
  onInsertSnippet,
  onBackToReadme
}) {
  const [activeCategory, setActiveCategory] = useState('callouts')
  const [copied, setCopied] = useState(false)
  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(520)

  // 1. Callouts State
  const [selectedCallout, setSelectedCallout] = useState('NOTE')
  const [calloutTitle, setCalloutTitle] = useState('Prerequisites & Environment Requirements')
  const [calloutText, setCalloutText] = useState('Requires Node.js 20+ and Python 3.11+. Ensure Docker engine is active if using containerized orchestration.')

  // 2. Multi-Package Manager State
  const [pmAction, setPmAction] = useState('install') // 'install' | 'run' | 'create'
  const [pmPackage, setPmPackage] = useState('auto-readme-generator')
  const [pmFormat, setPmFormat] = useState('collapsible') // 'collapsible' | 'stacked' | 'unified'
  const [activePmPreviewTab, setActivePmPreviewTab] = useState('npm')

  // 3. macOS Terminal State
  const [termTitle, setTermTitle] = useState('zsh — 80×24')
  const [termShell, setTermShell] = useState('$')
  const [termCmd, setTermCmd] = useState('curl -fsSL https://get.readme.dev/install.sh | bash')
  const [termOutput, setTermOutput] = useState('✓ Fetching latest studio bundle... Done\n✓ Verifying cryptographic SHA256 checksum\n🚀 Successfully installed to /usr/local/bin/readme-studio')

  // 4. Code & Diff Blocks State
  const [codeBlockMode, setCodeBlockMode] = useState('standard') // 'standard' | 'diff'
  const [codeLang, setCodeLang] = useState('bash')
  const [codeTitle, setCodeTitle] = useState('Installation & Setup')
  const [codeContent, setCodeContent] = useState(`# Clone the repository\ngit clone https://github.com/owner/project.git\ncd project\n\n# Install backend & frontend dependencies\npip install -r requirements.txt\nnpm --prefix frontend install\n\n# Start both local development servers\npython backend/main.py &\nnpm --prefix frontend run dev`)
  const [diffContent, setDiffContent] = useState(`// API Client v1 to v2 Migration Guide\n- const client = new LegacyReadmeClient({ token: 'abc' });\n- const res = await client.generateMarkdown();\n+ const client = new ModernStudioClient({ apiKey: 'key_live_123' });\n+ const res = await client.streamReadme({\n+   template: 'modern-saas',\n+   badgeEngine: 'native-svg'\n+ });`)

  // 5. Accordion & FAQ State
  const [faqTitle, setFaqTitle] = useState('Frequently Asked Questions')
  const [faqItems, setFaqItems] = useState([
    {
      id: '1',
      summary: 'Is this studio 100% free and open-source?',
      details: 'Yes! The entire studio engine is released under the permissive MIT license. You can self-host, customize, or contribute to it on GitHub.'
    },
    {
      id: '2',
      summary: 'How do the Native Vector SVG badges prevent rate limits?',
      details: 'Native cards are generated client-side with pure SVG vector graphics and self-hosted in your repository assets/ folder, avoiding external serverless API quotas entirely.'
    },
    {
      id: '3',
      summary: 'Can I export diagrams to vector SVG and PNG?',
      details: 'Yes, the Diagram Studio includes 1-click downloads for crisp .svg vector files and 2x Retina resolution .png images.'
    }
  ])

  // 6. Environment Variables State
  const [envFormat, setEnvFormat] = useState('table') // 'table' | 'envfile'
  const [envVars, setEnvVars] = useState([
    { key: 'PORT', desc: 'Backend HTTP listening port', defaultVal: '8000', required: true },
    { key: 'DATABASE_URL', desc: 'PostgreSQL connection URI', defaultVal: 'postgresql://user:pass@localhost:5432/app', required: true },
    { key: 'REDIS_URL', desc: 'In-memory Redis cache connection string', defaultVal: 'redis://localhost:6379/0', required: false },
    { key: 'SECRET_KEY', desc: 'Cryptographic session signing secret', defaultVal: '', required: true },
    { key: 'CACHE_ENABLED', desc: 'Enable local disk caching for AST scans', defaultVal: 'true', required: false }
  ])

  // 7. Keyboard Shortcuts State
  const [shortcuts, setShortcuts] = useState([
    { keys: ['Ctrl', 'Shift', 'P'], desc: 'Open Command Palette' },
    { keys: ['Ctrl', 'S'], desc: 'Save active README document' },
    { keys: ['⌘', 'K'], desc: 'Global Spotlight Search' },
    { keys: ['Ctrl', 'Enter'], desc: 'Create Documentation Suite' }
  ])

  // 8. License State
  const [licenseType, setLicenseType] = useState('MIT')
  const [licenseAuthor, setLicenseAuthor] = useState('Project Maintainers & Contributors')
  const [licenseYear, setLicenseYear] = useState(new Date().getFullYear().toString())

  // ======================== GENERATED MARKDOWN SNIPPET ========================

  const generatedSnippet = useMemo(() => {
    switch (activeCategory) {
      case 'callouts': {
        const titlePart = calloutTitle.trim() ? `**${calloutTitle.trim()}**\n> ` : ''
        const bodyPart = calloutText.trim().replace(/\n/g, '\n> ')
        return `> [!${selectedCallout}]\n> ${titlePart}${bodyPart}`
      }

      case 'multipm': {
        if (pmFormat === 'collapsible') {
          const blocks = PM_OPTIONS.slice(0, 4).map((pm) => {
            const command = pm.cmd(pmPackage, pmAction)
            return `<details ${pm.id === 'npm' ? 'open' : ''}>\n<summary><b>${pm.label}</b></summary>\n\n\`\`\`bash\n${command}\n\`\`\`\n\n</details>`
          })
          return `### Installation\n\n${blocks.join('\n\n')}`
        }

        if (pmFormat === 'stacked') {
          const lines = PM_OPTIONS.slice(0, 4).map((pm) => {
            return `# ${pm.label}\n${pm.cmd(pmPackage, pmAction)}`
          })
          return `### Installation\n\n\`\`\`bash\n${lines.join('\n\n')}\n\`\`\``
        }

        // Unified table matrix
        const tableRows = PM_OPTIONS.slice(0, 6).map((pm) => {
          return `| **${pm.label}** | \`${pm.cmd(pmPackage, pmAction)}\` |`
        })
        return `### Installation Command Matrix\n\n| Package Manager | Command |\n| :--- | :--- |\n${tableRows.join('\n')}`
      }

      case 'terminal': {
        return `\`\`\`bash\n# [${termTitle}]\n${termShell} ${termCmd.trim()}\n${termOutput.trim()}\n\`\`\``
      }

      case 'codeblock': {
        if (codeBlockMode === 'diff') {
          return `### ${codeTitle}\n\n\`\`\`diff\n${diffContent.trim()}\n\`\`\``
        }
        return `### ${codeTitle}\n\n\`\`\`${codeLang}\n${codeContent.trim()}\n\`\`\``
      }

      case 'accordion': {
        const blocks = faqItems.map((item) => {
          return `<details>\n<summary><b>${item.summary}</b></summary>\n\n${item.details.trim()}\n\n</details>`
        })
        return `## ${faqTitle}\n\n${blocks.join('\n\n')}`
      }

      case 'envvars': {
        if (envFormat === 'envfile') {
          const lines = envVars.map((v) => {
            const reqLabel = v.required ? '# [Required]' : '# [Optional]'
            return `# ${v.desc} ${reqLabel}\n${v.key}=${v.defaultVal}`
          })
          return `### Environment Configuration (\`.env.example\`)\n\n\`\`\`env\n${lines.join('\n\n')}\n\`\`\``
        }

        const rows = envVars.map((v) => {
          return `| \`${v.key}\` | ${v.desc} | \`${v.defaultVal || 'N/A'}\` | ${v.required ? '✅ Required' : '⚪ Optional'} |`
        })
        return `### Environment Variables\n\n| Variable | Description | Default | Requirement |\n| :--- | :--- | :--- | :--- |\n${rows.join('\n')}`
      }

      case 'shortcuts': {
        const rows = shortcuts.map((s) => {
          const kbdTags = s.keys.map((k) => `<kbd>${k}</kbd>`).join(' + ')
          return `| ${kbdTags} | ${s.desc} |`
        })
        return `### Keyboard Shortcuts\n\n| Shortcut | Action |\n| :--- | :--- |\n${rows.join('\n')}`
      }

      case 'license': {
        return `## License\n\nDistributed under the **${licenseType} License**. See [\`LICENSE\`](./LICENSE) for more details.\n\nCopyright (c) ${licenseYear} ${licenseAuthor}.`
      }

      default:
        return ''
    }
  }, [
    activeCategory, selectedCallout, calloutTitle, calloutText,
    pmAction, pmPackage, pmFormat,
    termTitle, termShell, termCmd, termOutput,
    codeBlockMode, codeLang, codeTitle, codeContent, diffContent,
    faqTitle, faqItems,
    envFormat, envVars,
    shortcuts,
    licenseType, licenseAuthor, licenseYear
  ])

  // Handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsertSnippet(generatedSnippet)
  }

  // Preset Applicator for Callouts
  const handleApplyCalloutPreset = (preset) => {
    setSelectedCallout(preset.severity)
    setCalloutTitle(preset.title)
    setCalloutText(preset.body)
  }

  // FAQ Item Handlers
  const handleAddFaqItem = () => {
    setFaqItems([
      ...faqItems,
      {
        id: Date.now().toString(),
        summary: 'New Question Title',
        details: 'Detailed explanation and answer text...'
      }
    ])
  }

  const handleUpdateFaqItem = (id, field, value) => {
    setFaqItems(faqItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleDeleteFaqItem = (id) => {
    setFaqItems(faqItems.filter((item) => item.id !== id))
  }

  // Env Var Handlers
  const handleAddEnvVar = () => {
    setEnvVars([
      ...envVars,
      { key: 'NEW_CONFIG_KEY', desc: 'Configuration description', defaultVal: '', required: false }
    ])
  }

  const handleUpdateEnvVar = (index, field, value) => {
    const updated = [...envVars]
    updated[index] = { ...updated[index], [field]: value }
    setEnvVars(updated)
  }

  const handleDeleteEnvVar = (index) => {
    setEnvVars(envVars.filter((_, i) => i !== index))
  }

  return (
    <div className="studio-tab-view select-none">
      {/* Top Control Bar */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div className="studio-badge-halo">
            <span className="material-symbols-outlined text-secondary" style={{ color: '#818cf8' }}>code_blocks</span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">Code & Callouts Studio</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>GFM Snippets Suite</span>
            </div>
            <p className="studio-subtitle">
              Build GitHub alerts, multi-package manager CLI switchers, macOS terminal mockups, diffs, and FAQ drawers.
            </p>
          </div>
        </div>

        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onBackToReadme}
              title="Return to active markdown document"
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>Back to Editor</span>
            </button>
          )}
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopy}
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Snippet'}</span>
          </button>
          <button
            type="button"
            className="btn-studio-primary"
            onClick={handleInsert}
            title="Insert snippet into an open document"
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>Insert into Document</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: 2-Column Responsive Layout */}
      <div className="studio-content-grid">
        {/* Left Column: Category Navigation & Interactive Configurator */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, minWidth: `${formWidth}px`, maxWidth: `${formWidth}px`, flex: 'none' }}
        >
          {/* Category Tabs */}
          <div className="studio-section">
            <label className="studio-section-label">Component Category ({SNIPPET_CATEGORIES.length})</label>
            <div className="studio-category-tabs">
              {SNIPPET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`studio-category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  title={cat.desc}
                >
                  <span className="material-symbols-outlined icon-xs">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* =========================================================================
              CATEGORY 1: GITHUB ALERTS & CALLOUTS 2.0
             ========================================================================= */}
          {activeCategory === 'callouts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Severity Buttons */}
              <div className="studio-section">
                <label className="studio-section-label">Alert Severity Level</label>
                <div className="callout-types-grid">
                  {CALLOUT_TYPES.map((c) => (
                    <button
                      key={c.type}
                      type="button"
                      className={`callout-type-btn ${selectedCallout === c.type ? 'active' : ''}`}
                      onClick={() => setSelectedCallout(c.type)}
                      style={selectedCallout === c.type ? { borderColor: c.color, backgroundColor: `${c.color}15` } : {}}
                    >
                      <span className="material-symbols-outlined icon-xs" style={{ color: c.color }}>{c.icon}</span>
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Curated Presets Library */}
              <div className="studio-section">
                <label className="studio-section-label">Curated Advisory Presets</label>
                <div className="diagram-preset-list">
                  {CALLOUT_PRESETS.map((p) => (
                    <div
                      key={p.id}
                      className="diagram-preset-card"
                      onClick={() => handleApplyCalloutPreset(p)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="preset-card-top">
                        <span className="preset-card-title">{p.title}</span>
                        <span className="preset-type-tag" style={{ color: CALLOUT_TYPES.find((c) => c.type === p.severity)?.color }}>
                          [!{p.severity}]
                        </span>
                      </div>
                      <p className="preset-card-desc">{p.body.slice(0, 90)}...</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title & Body Inputs */}
              <div className="studio-section">
                <div className="studio-field">
                  <span className="studio-field-label">Header Callout Title (Optional)</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={calloutTitle}
                    onChange={(e) => setCalloutTitle(e.target.value)}
                    placeholder="e.g. Prerequisites & Requirements"
                  />
                </div>
                <div className="studio-field" style={{ marginTop: '8px' }}>
                  <span className="studio-field-label">Callout Message Content</span>
                  <textarea
                    className="studio-text-area custom-scrollbar"
                    rows={4}
                    value={calloutText}
                    onChange={(e) => setCalloutText(e.target.value)}
                    placeholder="Enter callout markdown body..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CATEGORY 2: MULTI-PACKAGE MANAGER & CLI SYNC
             ========================================================================= */}
          {activeCategory === 'multipm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="studio-section">
                <div className="repocard-fields-grid">
                  <div className="studio-field">
                    <span className="studio-field-label">CLI Action</span>
                    <select
                      className="studio-select-input"
                      value={pmAction}
                      onChange={(e) => setPmAction(e.target.value)}
                    >
                      <option value="install">Install Package (npm i, pnpm add, etc.)</option>
                      <option value="run">Run Script (npm run, bun run, etc.)</option>
                      <option value="create">Scaffold Project (create-vite, etc.)</option>
                    </select>
                  </div>
                  <div className="studio-field">
                    <span className="studio-field-label">Package / Script Name</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={pmPackage}
                      onChange={(e) => setPmPackage(e.target.value)}
                      placeholder="e.g. auto-readme-generator"
                    />
                  </div>
                </div>
              </div>

              <div className="studio-section">
                <label className="studio-section-label">Presentation Layout</label>
                <div className="studio-segmented-styles">
                  <button
                    type="button"
                    className={`studio-style-btn ${pmFormat === 'collapsible' ? 'active' : ''}`}
                    onClick={() => setPmFormat('collapsible')}
                  >
                    📂 Collapsible Tabs (&lt;details&gt;)
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${pmFormat === 'stacked' ? 'active' : ''}`}
                    onClick={() => setPmFormat('stacked')}
                  >
                    📜 Single Stacked Codeblock
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${pmFormat === 'table' ? 'active' : ''}`}
                    onClick={() => setPmFormat('table')}
                  >
                    📊 Matrix Comparison Table
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CATEGORY 3: MACOS CLI TERMINAL WINDOW
             ========================================================================= */}
          {activeCategory === 'terminal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="studio-section">
                <div className="repocard-fields-grid">
                  <div className="studio-field">
                    <span className="studio-field-label">Window Title</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={termTitle}
                      onChange={(e) => setTermTitle(e.target.value)}
                      placeholder="zsh — 80×24"
                    />
                  </div>
                  <div className="studio-field">
                    <span className="studio-field-label">Shell Prompt Symbol</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={termShell}
                      onChange={(e) => setTermShell(e.target.value)}
                      placeholder="$"
                    />
                  </div>
                </div>
              </div>

              <div className="studio-section">
                <div className="studio-field">
                  <span className="studio-field-label">Input Command</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={termCmd}
                    onChange={(e) => setTermCmd(e.target.value)}
                    placeholder="curl -fsSL https://... | bash"
                  />
                </div>
                <div className="studio-field" style={{ marginTop: '8px' }}>
                  <span className="studio-field-label">Command Output Log</span>
                  <textarea
                    className="studio-text-area studio-code-area custom-scrollbar"
                    rows={5}
                    value={termOutput}
                    onChange={(e) => setTermOutput(e.target.value)}
                    placeholder="Terminal output response..."
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CATEGORY 4: CODE & DIFF BLOCKS
             ========================================================================= */}
          {activeCategory === 'codeblock' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="studio-section">
                <label className="studio-section-label">Block Subtype</label>
                <div className="studio-segmented-styles">
                  <button
                    type="button"
                    className={`studio-style-btn ${codeBlockMode === 'standard' ? 'active' : ''}`}
                    onClick={() => setCodeBlockMode('standard')}
                  >
                    💻 Standard Code Block
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${codeBlockMode === 'diff' ? 'active' : ''}`}
                    onClick={() => setCodeBlockMode('diff')}
                  >
                    🔄 Migration Git Diff Block
                  </button>
                </div>
              </div>

              {codeBlockMode === 'standard' ? (
                <>
                  <div className="studio-section">
                    <div className="repocard-fields-grid">
                      <div className="studio-field">
                        <span className="studio-field-label">Section Heading</span>
                        <input
                          type="text"
                          className="studio-text-input"
                          value={codeTitle}
                          onChange={(e) => setCodeTitle(e.target.value)}
                          placeholder="e.g. Installation & Setup"
                        />
                      </div>
                      <div className="studio-field">
                        <span className="studio-field-label">Syntax Language</span>
                        <select
                          className="studio-select-input"
                          value={codeLang}
                          onChange={(e) => setCodeLang(e.target.value)}
                        >
                          {CODE_LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="studio-section">
                    <label className="studio-section-label">Code Contents</label>
                    <textarea
                      className="studio-text-area studio-code-area custom-scrollbar"
                      rows={8}
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      placeholder="Enter source code..."
                      spellCheck={false}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="studio-section">
                    <span className="studio-field-label">Migration Diff Title</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={codeTitle}
                      onChange={(e) => setCodeTitle(e.target.value)}
                      placeholder="e.g. v1 to v2 Upgrade Guide"
                    />
                  </div>

                  <div className="studio-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="studio-section-label">Diff Code (+ for additions, - for removals)</label>
                      <span style={{ fontSize: '10px', color: '#10b981' }}>+ Green / - Red</span>
                    </div>
                    <textarea
                      className="studio-text-area studio-code-area custom-scrollbar"
                      rows={8}
                      value={diffContent}
                      onChange={(e) => setDiffContent(e.target.value)}
                      placeholder="+ Added line\n- Removed line"
                      spellCheck={false}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* =========================================================================
              CATEGORY 5: FAQ & ACCORDION LIST
             ========================================================================= */}
          {activeCategory === 'accordion' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="studio-section">
                <span className="studio-field-label">Section Heading</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={faqTitle}
                  onChange={(e) => setFaqTitle(e.target.value)}
                  placeholder="Frequently Asked Questions"
                />
              </div>

              <div className="studio-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="studio-section-label">Accordion Items ({faqItems.length})</label>
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={handleAddFaqItem}
                    style={{ height: '24px', fontSize: '10px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span>
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="accordion-items-list custom-scrollbar">
                  {faqItems.map((item, index) => (
                    <div key={item.id} className="accordion-item-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10.5px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{index + 1}</span>
                        <input
                          type="text"
                          className="studio-text-input"
                          value={item.summary}
                          onChange={(e) => handleUpdateFaqItem(item.id, 'summary', e.target.value)}
                          placeholder="Question or summary heading..."
                          style={{ flex: 1, fontWeight: 600 }}
                        />
                        <button
                          type="button"
                          className="diagram-edge-del-btn"
                          onClick={() => handleDeleteFaqItem(item.id)}
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      </div>
                      <textarea
                        className="studio-text-area custom-scrollbar"
                        rows={2}
                        value={item.details}
                        onChange={(e) => handleUpdateFaqItem(item.id, 'details', e.target.value)}
                        placeholder="Detailed markdown answer or content..."
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CATEGORY 6: ENVIRONMENT VARIABLES (.env.example)
             ========================================================================= */}
          {activeCategory === 'envvars' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="studio-section">
                <label className="studio-section-label">Output Style</label>
                <div className="studio-segmented-styles">
                  <button
                    type="button"
                    className={`studio-style-btn ${envFormat === 'table' ? 'active' : ''}`}
                    onClick={() => setEnvFormat('table')}
                  >
                    📊 Markdown Table
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${envFormat === 'envfile' ? 'active' : ''}`}
                    onClick={() => setEnvFormat('envfile')}
                  >
                    📄 .env.example Code Block
                  </button>
                </div>
              </div>

              <div className="studio-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="studio-section-label">Config Keys ({envVars.length})</label>
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={handleAddEnvVar}
                    style={{ height: '24px', fontSize: '10px' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span>
                    <span>Add Variable</span>
                  </button>
                </div>

                <div className="env-vars-list custom-scrollbar">
                  {envVars.map((v, i) => (
                    <div key={i} className="env-var-card">
                      <input
                        type="text"
                        className="studio-text-input"
                        value={v.key}
                        onChange={(e) => handleUpdateEnvVar(i, 'key', e.target.value)}
                        placeholder="VAR_NAME"
                        style={{ width: '130px', fontFamily: 'monospace', fontWeight: 700 }}
                      />
                      <input
                        type="text"
                        className="studio-text-input"
                        value={v.desc}
                        onChange={(e) => handleUpdateEnvVar(i, 'desc', e.target.value)}
                        placeholder="Description"
                        style={{ flex: 1 }}
                      />
                      <input
                        type="text"
                        className="studio-text-input"
                        value={v.defaultVal}
                        onChange={(e) => handleUpdateEnvVar(i, 'defaultVal', e.target.value)}
                        placeholder="Default"
                        style={{ width: '90px', fontFamily: 'monospace' }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={v.required}
                          onChange={(e) => handleUpdateEnvVar(i, 'required', e.target.checked)}
                        />
                        <span>Req</span>
                      </label>
                      <button
                        type="button"
                        className="diagram-edge-del-btn"
                        onClick={() => handleDeleteEnvVar(i)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CATEGORY 7: KEYCAPS & SHORTCUTS (<kbd>)
             ========================================================================= */}
          {activeCategory === 'shortcuts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="studio-section">
                <label className="studio-section-label">Configured Hotkeys</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {shortcuts.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {s.keys.map((k, ki) => (
                          <span key={ki} className="kbd-chip">{k}</span>
                        ))}
                      </div>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', flex: 1 }}>{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              CATEGORY 8: LICENSE & COPYRIGHT
             ========================================================================= */}
          {activeCategory === 'license' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="studio-section">
                <label className="studio-section-label">License Standard</label>
                <div className="studio-segmented-styles">
                  {['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicense'].map((lic) => (
                    <button
                      key={lic}
                      type="button"
                      className={`studio-style-btn ${licenseType === lic ? 'active' : ''}`}
                      onClick={() => setLicenseType(lic)}
                    >
                      {lic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="studio-section">
                <div className="repocard-fields-grid">
                  <div className="studio-field">
                    <span className="studio-field-label">Copyright Holder / Organization</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={licenseAuthor}
                      onChange={(e) => setLicenseAuthor(e.target.value)}
                      placeholder="e.g. Acme Corp / Maintainers"
                    />
                  </div>
                  <div className="studio-field">
                    <span className="studio-field-label">Copyright Year</span>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={licenseYear}
                      onChange={(e) => setLicenseYear(e.target.value)}
                      placeholder="2026"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Column: True-to-Life Live Render & Markdown Output */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* Live Render Card */}
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="studio-card-title">Live GitHub Visual Render</span>
              <span className="studio-card-tag">{activeCategory}</span>
            </div>
            <div className="snippet-render-viewport custom-scrollbar">
              {/* Callout Render */}
              {activeCategory === 'callouts' && (
                <div className={`github-callout callout-${selectedCallout.toLowerCase()}`}>
                  <div className="callout-header">
                    <span className="material-symbols-outlined icon-xs">
                      {CALLOUT_TYPES.find((c) => c.type === selectedCallout)?.icon || 'info'}
                    </span>
                    <span className="callout-title">{selectedCallout}</span>
                  </div>
                  {calloutTitle && (
                    <strong style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                      {calloutTitle}
                    </strong>
                  )}
                  <p className="callout-body">{calloutText}</p>
                </div>
              )}

              {/* Multi-PM Render */}
              {activeCategory === 'multipm' && (
                <div className="multipm-preview-box">
                  <div className="multipm-tabs-bar">
                    {PM_OPTIONS.slice(0, 4).map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        className={`multipm-tab-btn ${activePmPreviewTab === pm.id ? 'active' : ''}`}
                        onClick={() => setActivePmPreviewTab(pm.id)}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                  <pre className="multipm-code-area">
                    <code>{PM_OPTIONS.find((pm) => pm.id === activePmPreviewTab)?.cmd(pmPackage, pmAction)}</code>
                  </pre>
                </div>
              )}

              {/* macOS Terminal Render */}
              {activeCategory === 'terminal' && (
                <div className="terminal-window-mockup">
                  <div className="terminal-window-header">
                    <div className="terminal-window-dots">
                      <span className="terminal-dot red" />
                      <span className="terminal-dot yellow" />
                      <span className="terminal-dot green" />
                    </div>
                    <span className="terminal-window-title">{termTitle}</span>
                    <div style={{ width: '40px' }} />
                  </div>
                  <pre className="terminal-window-body">
                    <div>
                      <span className="terminal-prompt-sym">{termShell}</span>
                      <span className="terminal-cmd-text">{termCmd}</span>
                    </div>
                    <div className="terminal-output-text" style={{ marginTop: '6px' }}>
                      {termOutput}
                    </div>
                  </pre>
                </div>
              )}

              {/* Code & Diff Render */}
              {activeCategory === 'codeblock' && (
                codeBlockMode === 'diff' ? (
                  <div className="diff-render-box">
                    <div style={{ borderBottom: '1px solid #30363d', paddingBottom: '4px', marginBottom: '8px', color: '#8b949e', fontSize: '10.5px' }}>
                      {codeTitle} (Unified Diff)
                    </div>
                    {diffContent.split('\n').map((line, idx) => {
                      if (line.startsWith('+')) {
                        return <span key={idx} className="diff-line-add">{line}</span>
                      }
                      if (line.startsWith('-')) {
                        return <span key={idx} className="diff-line-del">{line}</span>
                      }
                      return <span key={idx} className="diff-line-ctx">{line}</span>
                    })}
                  </div>
                ) : (
                  <div className="code-render-preview">
                    <div className="code-render-header">
                      <span className="code-title-tag">{codeTitle}</span>
                      <span className="code-lang-tag">{codeLang}</span>
                    </div>
                    <pre className="code-render-body"><code>{codeContent}</code></pre>
                  </div>
                )
              )}

              {/* Accordion FAQ Render */}
              {activeCategory === 'accordion' && (
                <div className="details-render-preview">
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--text-primary)' }}>{faqTitle}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {faqItems.map((item, idx) => (
                      <details key={item.id} open={idx === 0} style={{ padding: '6px 8px', backgroundColor: 'var(--surface-base)', borderRadius: '4px' }}>
                        <summary className="details-summary"><b>{item.summary}</b></summary>
                        <div className="details-content">
                          <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.details}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* Env Vars Render */}
              {activeCategory === 'envvars' && (
                <div style={{ padding: '4px' }}>
                  {envFormat === 'table' ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '6px 8px' }}>Variable</th>
                            <th style={{ padding: '6px 8px' }}>Description</th>
                            <th style={{ padding: '6px 8px' }}>Default</th>
                            <th style={{ padding: '6px 8px' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {envVars.map((v, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                              <td style={{ padding: '6px 8px', fontFamily: 'monospace', color: '#58a6ff', fontWeight: 600 }}>{v.key}</td>
                              <td style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>{v.desc}</td>
                              <td style={{ padding: '6px 8px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{v.defaultVal || '-'}</td>
                              <td style={{ padding: '6px 8px' }}>
                                {v.required ? (
                                  <span style={{ color: '#ef4444', fontWeight: 600 }}>Required</span>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)' }}>Optional</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <pre className="code-render-body" style={{ backgroundColor: '#070a0e', borderRadius: '4px', padding: '10px' }}>
                      <code>
                        {envVars.map((v) => `# ${v.desc}\n${v.key}=${v.defaultVal}\n`).join('\n')}
                      </code>
                    </pre>
                  )}
                </div>
              )}

              {/* Shortcuts Render */}
              {activeCategory === 'shortcuts' && (
                <div style={{ padding: '6px' }}>
                  <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '6px 8px' }}>Shortcut</th>
                        <th style={{ padding: '6px 8px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortcuts.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '6px 8px' }}>
                            <div style={{ display: 'flex', gap: '3px' }}>
                              {s.keys.map((k, ki) => (
                                <span key={ki} className="kbd-chip">{k}</span>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>{s.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* License Render */}
              {activeCategory === 'license' && (
                <div className="license-render-preview">
                  <div className="license-header">
                    <span className="material-symbols-outlined text-emerald">verified</span>
                    <span className="license-title">{licenseType} License</span>
                  </div>
                  <p className="license-text">
                    Distributed under the <strong>{licenseType} License</strong>. See <code>LICENSE</code> for full details.
                  </p>
                  <p className="license-subtext">
                    Copyright (c) {licenseYear} {licenseAuthor}.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Generated Markdown Syntax Block */}
          <div className="studio-card">
            <div className="studio-card-header">
              <span className="studio-card-title">Generated Markdown Code</span>
              <button
                type="button"
                className="snippet-copy-btn"
                onClick={handleCopy}
              >
                <span className="material-symbols-outlined icon-xs">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="studio-code-block custom-scrollbar">
              <code>{generatedSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
