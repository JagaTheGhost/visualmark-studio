import React, { useState, useMemo } from 'react'
import StudioShell from './common/StudioShell'
import '../../styles/studios/snippetStudio.css'

const SNIPPET_CATEGORIES = [
  { id: 'callouts', label: 'GitHub Alerts & Callouts', icon: 'campaign', desc: 'Official GFM alerts (Note, Tip, Warning, Caution)' },
  { id: 'multipm', label: 'Multi-PM & CLI Sync', icon: 'sync', desc: 'npm, pnpm, yarn, bun, pip, poetry, uv, cargo commands' },
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

const AVAILABLE_LICENSES = [
  'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'MPL-2.0', 'Unlicense'
]

/**
 * Code & Callouts Studio Pro
 * High-density GFM markdown components: GitHub alerts, multi-package managers,
 * macOS terminal mockups, code & diff blocks, FAQ accordions, and environment configs.
 */
export default function SnippetStudioTab({
  onInsertSnippet,
  onBackToReadme
}) {
  const [activeCategory, setActiveCategory] = useState('callouts')

  // 1. Callouts State
  const [selectedCallout, setSelectedCallout] = useState('NOTE')
  const [calloutTitle, setCalloutTitle] = useState('Prerequisites & Environment Requirements')
  const [calloutText, setCalloutText] = useState('Requires Node.js 20+ and Python 3.11+. Ensure Docker engine is active if using containerized orchestration.')

  // 2. Multi-Package Manager State
  const [pmAction, setPmAction] = useState('install') // 'install' | 'run' | 'create'
  const [pmPackage, setPmPackage] = useState('visualmark-studio')
  const [pmFormat, setPmFormat] = useState('collapsible') // 'collapsible' | 'stacked' | 'unified'
  const [activePmPreviewTab, setActivePmPreviewTab] = useState('npm')

  // 3. macOS Terminal State
  const [termTitle, setTermTitle] = useState('zsh — 80×24')
  const [termShell, setTermShell] = useState('$')
  const [termCmd, setTermCmd] = useState('curl -fsSL https://get.visualmark.dev/install.sh | bash')
  const [termOutput, setTermOutput] = useState('✓ Fetching latest studio bundle... Done\n✓ Verifying cryptographic SHA256 checksum\n🚀 Successfully installed to /usr/local/bin/visualmark')

  // 4. Code & Diff Blocks State
  const [codeBlockMode, setCodeBlockMode] = useState('standard') // 'standard' | 'diff'
  const [codeLang, setCodeLang] = useState('bash')
  const [codeTitle, setCodeTitle] = useState('Installation & Setup')
  const [codeContent, setCodeContent] = useState(`# Clone the repository\ngit clone https://github.com/owner/project.git\ncd project\n\n# Install backend & frontend dependencies\npip install -r requirements.txt\nnpm --prefix frontend install\n\n# Start development servers\npython backend/main.py &\nnpm --prefix frontend run dev`)
  const [diffContent, setDiffContent] = useState(`// API Client v1 to v2 Migration Guide\n- const client = new LegacyReadmeClient({ token: 'abc' });\n- const res = await client.generateMarkdown();\n+ const client = new ModernStudioClient({ apiKey: 'key_live_123' });\n+ const res = await client.streamReadme({\n+   template: 'modern-saas',\n+   badgeEngine: 'native-svg'\n+ });`)

  // 5. Accordion & FAQ State
  const [faqTitle, setFaqTitle] = useState('Frequently Asked Questions')
  const [faqItems, setFaqItems] = useState([
    {
      id: '1',
      summary: 'Is VisualMark Studio 100% free and open-source?',
      details: 'Yes! The entire studio suite is released under the permissive MIT license. You can self-host, customize, or contribute to it on GitHub.'
    },
    {
      id: '2',
      summary: 'How do the Native Vector SVG cards avoid GitHub rate limits?',
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
    { keys: ['Ctrl', 'Enter'], desc: 'Insert Studio Component' }
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
  const handleInsert = () => {
    if (typeof onInsertSnippet === 'function') {
      onInsertSnippet(generatedSnippet)
    }
  }

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

  // Active Category Meta
  const activeCatMeta = SNIPPET_CATEGORIES.find((c) => c.id === activeCategory) || SNIPPET_CATEGORIES[0]

  // Canvas Header Extras
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="canvas-header-divider" />
      <span className="canvas-mode-tag" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.3)', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
        {activeCatMeta.label.toUpperCase()}
      </span>

      {/* Quick Category Action Controls */}
      {activeCategory === 'multipm' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(0,0,0,0.25)', padding: '2px', borderRadius: '4px' }}>
          <button
            type="button"
            className={`studio-style-btn ${pmFormat === 'collapsible' ? 'active' : ''}`}
            onClick={() => setPmFormat('collapsible')}
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            Collapsible
          </button>
          <button
            type="button"
            className={`studio-style-btn ${pmFormat === 'stacked' ? 'active' : ''}`}
            onClick={() => setPmFormat('stacked')}
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            Stacked
          </button>
          <button
            type="button"
            className={`studio-style-btn ${pmFormat === 'unified' ? 'active' : ''}`}
            onClick={() => setPmFormat('unified')}
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            Matrix
          </button>
        </div>
      )}

      {activeCategory === 'codeblock' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(0,0,0,0.25)', padding: '2px', borderRadius: '4px' }}>
          <button
            type="button"
            className={`studio-style-btn ${codeBlockMode === 'standard' ? 'active' : ''}`}
            onClick={() => setCodeBlockMode('standard')}
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            Standard Code
          </button>
          <button
            type="button"
            className={`studio-style-btn ${codeBlockMode === 'diff' ? 'active' : ''}`}
            onClick={() => setCodeBlockMode('diff')}
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            Git Unified Diff
          </button>
        </div>
      )}

      {activeCategory === 'envvars' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(0,0,0,0.25)', padding: '2px', borderRadius: '4px' }}>
          <button
            type="button"
            className={`studio-style-btn ${envFormat === 'table' ? 'active' : ''}`}
            onClick={() => setEnvFormat('table')}
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            Markdown Table
          </button>
          <button
            type="button"
            className={`studio-style-btn ${envFormat === 'envfile' ? 'active' : ''}`}
            onClick={() => setEnvFormat('envfile')}
            style={{ padding: '2px 6px', fontSize: '10px' }}
          >
            .env.example
          </button>
        </div>
      )}
    </div>
  )

  return (
    <StudioShell
      studioId="snippets.studio"
      title="Code & Callouts Studio"
      subtitle="High-density GFM markdown components: GitHub alerts, multi-package managers, terminal mockups, and FAQ accordions"
      badge="GFM Components Pro"
      accentColor="#f59e0b"
      icon={<span className="material-symbols-outlined" style={{ fontSize: '20px' }}>code_blocks</span>}
      markdownCode={generatedSnippet}
      codeLanguage="markdown"
      onInsert={handleInsert}
      insertLabel="Insert Snippet"
      onBackToReadme={onBackToReadme}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={520}
      minSplitWidth={380}
      maxSplitWidth={880}
      inspectorContent={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Snippet Component Category Selector */}
          <div className="studio-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>
                1 • Component Category ({SNIPPET_CATEGORIES.length})
              </label>
              <span style={{ fontSize: '10px', color: '#64748b' }}>
                {activeCatMeta.label}
              </span>
            </div>

            <div className="studio-category-tabs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {SNIPPET_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`studio-category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                  title={cat.desc}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    textAlign: 'left',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  <span className="material-symbols-outlined icon-xs" style={{ fontSize: '16px' }}>{cat.icon}</span>
                  <span style={{ fontWeight: 500 }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Active Category Configurator */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '10px' }}>
              2 • Configure {activeCatMeta.label}
            </label>

            {/* CATEGORY 1: GITHUB ALERTS & CALLOUTS 2.0 */}
            {activeCategory === 'callouts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                    Alert Severity Level
                  </span>
                  <div className="callout-types-grid">
                    {CALLOUT_TYPES.map((c) => (
                      <button
                        key={c.type}
                        type="button"
                        className={`callout-type-btn ${selectedCallout === c.type ? 'active' : ''}`}
                        onClick={() => setSelectedCallout(c.type)}
                        style={selectedCallout === c.type ? { borderColor: c.color, backgroundColor: `${c.color}15`, color: '#ffffff' } : {}}
                      >
                        <span className="material-symbols-outlined icon-xs" style={{ color: c.color }}>{c.icon}</span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Presets Library */}
                <div>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>
                    Curated Advisory Presets
                  </span>
                  <div className="diagram-preset-list" style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                    {CALLOUT_PRESETS.map((p) => (
                      <div
                        key={p.id}
                        className="diagram-preset-card"
                        onClick={() => handleApplyCalloutPreset(p)}
                        style={{ cursor: 'pointer', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)' }}
                      >
                        <div className="preset-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="preset-card-title" style={{ fontWeight: 600, fontSize: '11.5px', color: '#f1f5f9' }}>{p.title}</span>
                          <span className="preset-type-tag" style={{ color: CALLOUT_TYPES.find((c) => c.type === p.severity)?.color, fontSize: '10px', fontWeight: 600 }}>
                            [!{p.severity}]
                          </span>
                        </div>
                        <p className="preset-card-desc" style={{ fontSize: '11px', color: '#94a3b8', margin: '3px 0 0 0' }}>{p.body.slice(0, 85)}...</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Header Callout Title (Optional)</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={calloutTitle}
                    onChange={(e) => setCalloutTitle(e.target.value)}
                    placeholder="e.g. Prerequisites & Requirements"
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  />
                </div>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Callout Message Content</span>
                  <textarea
                    className="studio-text-area custom-scrollbar"
                    rows={4}
                    value={calloutText}
                    onChange={(e) => setCalloutText(e.target.value)}
                    placeholder="Enter callout markdown body..."
                    style={{ width: '100%', padding: '8px 10px', marginTop: '4px', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* CATEGORY 2: MULTI-PACKAGE MANAGER CLI */}
            {activeCategory === 'multipm' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>CLI Command Action</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    {['install', 'run', 'create'].map((act) => (
                      <button
                        key={act}
                        type="button"
                        className={`studio-style-btn ${pmAction === act ? 'active' : ''}`}
                        onClick={() => setPmAction(act)}
                        style={{ flex: 1, padding: '6px', fontSize: '11px' }}
                      >
                        {act.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Package / Binary Name</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={pmPackage}
                    onChange={(e) => setPmPackage(e.target.value)}
                    placeholder="e.g. visualmark-studio"
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  />
                </div>

                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Supported Package Managers Preview</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {PM_OPTIONS.map((pm) => (
                      <span
                        key={pm.id}
                        style={{
                          fontSize: '10.5px',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-color)',
                          color: '#94a3b8'
                        }}
                      >
                        {pm.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORY 3: MACOS TERMINAL CLI WINDOW */}
            {activeCategory === 'terminal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Window Title Bar</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={termTitle}
                    onChange={(e) => setTermTitle(e.target.value)}
                    placeholder="zsh — 80×24"
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  />
                </div>

                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Prompt & Executed Command</span>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <input
                      type="text"
                      className="studio-text-input"
                      value={termShell}
                      onChange={(e) => setTermShell(e.target.value)}
                      style={{ width: '36px', textAlign: 'center' }}
                    />
                    <input
                      type="text"
                      className="studio-text-input"
                      value={termCmd}
                      onChange={(e) => setTermCmd(e.target.value)}
                      style={{ flex: 1, padding: '6px 10px' }}
                    />
                  </div>
                </div>

                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Terminal Output Body</span>
                  <textarea
                    className="studio-text-area custom-scrollbar"
                    rows={5}
                    value={termOutput}
                    onChange={(e) => setTermOutput(e.target.value)}
                    placeholder="Output text emitted by command..."
                    style={{ width: '100%', padding: '8px 10px', marginTop: '4px', fontFamily: 'monospace', fontSize: '11px', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {/* CATEGORY 4: CODE & DIFF BLOCKS */}
            {activeCategory === 'codeblock' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Block Header Title</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={codeTitle}
                    onChange={(e) => setCodeTitle(e.target.value)}
                    placeholder="e.g. Installation & Setup"
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  />
                </div>

                {codeBlockMode === 'standard' ? (
                  <>
                    <div className="studio-field">
                      <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Syntax Language</span>
                      <select
                        className="studio-text-input"
                        value={codeLang}
                        onChange={(e) => setCodeLang(e.target.value)}
                        style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                      >
                        {CODE_LANGUAGES.map((l) => (
                          <option key={l} value={l}>{l.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="studio-field">
                      <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Code Content</span>
                      <textarea
                        className="studio-text-area custom-scrollbar"
                        rows={7}
                        value={codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        placeholder="Enter snippet source code..."
                        style={{ width: '100%', padding: '8px 10px', marginTop: '4px', fontFamily: 'monospace', fontSize: '11px', resize: 'vertical' }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="studio-field">
                    <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Unified Diff Content (+ additions, - deletions)</span>
                    <textarea
                      className="studio-text-area custom-scrollbar"
                      rows={8}
                      value={diffContent}
                      onChange={(e) => setDiffContent(e.target.value)}
                      placeholder="- old code line\n+ new replacement line"
                      style={{ width: '100%', padding: '8px 10px', marginTop: '4px', fontFamily: 'monospace', fontSize: '11px', resize: 'vertical' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* CATEGORY 5: FAQ ACCORDION LIST */}
            {activeCategory === 'accordion' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Section Title</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={faqTitle}
                    onChange={(e) => setFaqTitle(e.target.value)}
                    placeholder="Frequently Asked Questions"
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Accordion Items ({faqItems.length})</span>
                    <button
                      type="button"
                      className="studio-shell-btn studio-shell-btn-secondary"
                      onClick={handleAddFaqItem}
                      style={{ padding: '2px 8px', fontSize: '11px' }}
                    >
                      + Add Item
                    </button>
                  </div>

                  {faqItems.map((item, index) => (
                    <div key={item.id} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#64748b' }}>#{index + 1}</span>
                        <input
                          type="text"
                          className="studio-text-input"
                          value={item.summary}
                          onChange={(e) => handleUpdateFaqItem(item.id, 'summary', e.target.value)}
                          placeholder="Question / Summary"
                          style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                        />
                        <button
                          type="button"
                          className="diagram-card-del-btn"
                          onClick={() => handleDeleteFaqItem(item.id)}
                          title="Delete item"
                          style={{ padding: '2px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      </div>
                      <textarea
                        className="studio-text-area custom-scrollbar"
                        rows={2}
                        value={item.details}
                        onChange={(e) => handleUpdateFaqItem(item.id, 'details', e.target.value)}
                        placeholder="Answer / Details content..."
                        style={{ width: '100%', padding: '6px 8px', fontSize: '11px', resize: 'vertical' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY 6: ENVIRONMENT VARIABLES */}
            {activeCategory === 'envvars' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Variables List ({envVars.length})</span>
                  <button
                    type="button"
                    className="studio-shell-btn studio-shell-btn-secondary"
                    onClick={handleAddEnvVar}
                    style={{ padding: '2px 8px', fontSize: '11px' }}
                  >
                    + Add Variable
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '280px', overflowY: 'auto' }}>
                  {envVars.map((v, i) => (
                    <div key={i} style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' }}>
                        <input
                          type="text"
                          className="studio-text-input"
                          value={v.key}
                          onChange={(e) => handleUpdateEnvVar(i, 'key', e.target.value)}
                          placeholder="KEY_NAME"
                          style={{ flex: 1, padding: '4px 6px', fontFamily: 'monospace', fontSize: '11px' }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: '#94a3b8', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={v.required}
                            onChange={(e) => handleUpdateEnvVar(i, 'required', e.target.checked)}
                          />
                          Req
                        </label>
                        <button
                          type="button"
                          onClick={() => handleDeleteEnvVar(i)}
                          title="Delete variable"
                          style={{ padding: '2px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          className="studio-text-input"
                          value={v.desc}
                          onChange={(e) => handleUpdateEnvVar(i, 'desc', e.target.value)}
                          placeholder="Description"
                          style={{ flex: 2, padding: '4px 6px', fontSize: '11px' }}
                        />
                        <input
                          type="text"
                          className="studio-text-input"
                          value={v.defaultVal}
                          onChange={(e) => handleUpdateEnvVar(i, 'defaultVal', e.target.value)}
                          placeholder="Default value"
                          style={{ flex: 1, padding: '4px 6px', fontFamily: 'monospace', fontSize: '11px' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY 7: KEYBOARD SHORTCUTS */}
            {activeCategory === 'shortcuts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Keybindings Matrix ({shortcuts.length})</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {shortcuts.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)' }}>
                      <input
                        type="text"
                        className="studio-text-input"
                        value={s.keys.join(', ')}
                        onChange={(e) => {
                          const updated = [...shortcuts]
                          updated[idx] = { ...updated[idx], keys: e.target.value.split(',').map((k) => k.trim()) }
                          setShortcuts(updated)
                        }}
                        placeholder="Ctrl, Shift, P"
                        style={{ width: '130px', padding: '4px 8px', fontFamily: 'monospace', fontSize: '11px' }}
                      />
                      <input
                        type="text"
                        className="studio-text-input"
                        value={s.desc}
                        onChange={(e) => {
                          const updated = [...shortcuts]
                          updated[idx] = { ...updated[idx], desc: e.target.value }
                          setShortcuts(updated)
                        }}
                        placeholder="Action Description"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CATEGORY 8: LICENSE & COPYRIGHT */}
            {activeCategory === 'license' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Open-Source License</span>
                  <select
                    className="studio-text-input"
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value)}
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  >
                    {AVAILABLE_LICENSES.map((lic) => (
                      <option key={lic} value={lic}>{lic}</option>
                    ))}
                  </select>
                </div>

                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Copyright Year</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={licenseYear}
                    onChange={(e) => setLicenseYear(e.target.value)}
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  />
                </div>

                <div className="studio-field">
                  <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Copyright Author / Organization</span>
                  <input
                    type="text"
                    className="studio-text-input"
                    value={licenseAuthor}
                    onChange={(e) => setLicenseAuthor(e.target.value)}
                    placeholder="Project Maintainers & Contributors"
                    style={{ width: '100%', padding: '6px 10px', marginTop: '4px' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      }
      canvasContent={
        <div
          className="snippet-preview-stage custom-scrollbar"
          style={{
            width: '100%',
            maxWidth: '820px',
            padding: '24px',
            boxSizing: 'border-box'
          }}
        >
          {/* GitHub Callouts Render */}
          {activeCategory === 'callouts' && (
            <div className={`github-callout callout-${selectedCallout.toLowerCase()}`}>
              <div className="callout-header" style={{ color: CALLOUT_TYPES.find((c) => c.type === selectedCallout)?.color }}>
                <span className="material-symbols-outlined icon-xs">
                  {CALLOUT_TYPES.find((c) => c.type === selectedCallout)?.icon}
                </span>
                <span>{selectedCallout}</span>
              </div>
              <div className="callout-body">
                {calloutTitle && <strong style={{ display: 'block', marginBottom: '4px' }}>{calloutTitle}</strong>}
                <p style={{ margin: 0 }}>{calloutText}</p>
              </div>
            </div>
          )}

          {/* Multi-PM Render */}
          {activeCategory === 'multipm' && (
            <div className="multipm-render-preview" style={{ borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)', overflow: 'hidden' }}>
              <div className="multipm-preview-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-low)', padding: '4px 6px', gap: '4px' }}>
                {PM_OPTIONS.slice(0, 6).map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    className={`multipm-tab-btn ${activePmPreviewTab === pm.id ? 'active' : ''}`}
                    onClick={() => setActivePmPreviewTab(pm.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      background: activePmPreviewTab === pm.id ? 'var(--surface-base)' : 'transparent',
                      color: activePmPreviewTab === pm.id ? '#ffffff' : 'var(--text-muted)',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '12px' }}>
                <code>{PM_OPTIONS.find((p) => p.id === activePmPreviewTab)?.cmd(pmPackage, pmAction)}</code>
                <button
                  type="button"
                  className="studio-shell-btn studio-shell-btn-secondary"
                  onClick={() => {
                    const cmd = PM_OPTIONS.find((p) => p.id === activePmPreviewTab)?.cmd(pmPackage, pmAction)
                    if (cmd) navigator.clipboard.writeText(cmd)
                  }}
                  style={{ padding: '3px 8px', fontSize: '10px' }}
                >
                  Copy
                </button>
              </div>
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
                  <details key={item.id} open={idx === 0} style={{ padding: '8px 10px', backgroundColor: 'var(--surface-base)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    <summary className="details-summary"><b>{item.summary}</b></summary>
                    <div className="details-content" style={{ marginTop: '6px' }}>
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
                <div style={{ overflowX: 'auto', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)' }}>
                  <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-low)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '8px 10px' }}>Variable</th>
                        <th style={{ padding: '8px 10px' }}>Description</th>
                        <th style={{ padding: '8px 10px' }}>Default</th>
                        <th style={{ padding: '8px 10px' }}>Requirement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {envVars.map((v, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#58a6ff', fontWeight: 600 }}>{v.key}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--text-primary)' }}>{v.desc}</td>
                          <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{v.defaultVal || '-'}</td>
                          <td style={{ padding: '8px 10px' }}>
                            {v.required ? (
                              <span style={{ color: '#ef4444', fontWeight: 600, fontSize: '10px' }}>Required</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Optional</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre className="code-render-body" style={{ backgroundColor: '#070a0e', borderRadius: '6px', padding: '12px', border: '1px solid var(--border-color)' }}>
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
              <div style={{ borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)', overflow: 'hidden' }}>
                <table style={{ width: '100%', fontSize: '11.5px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface-low)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '8px 10px' }}>Shortcut</th>
                      <th style={{ padding: '8px 10px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shortcuts.map((s, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px 10px' }}>
                          <div style={{ display: 'flex', gap: '3px' }}>
                            {s.keys.map((k, ki) => (
                              <span key={ki} className="kbd-chip">{k}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '8px 10px', color: 'var(--text-primary)' }}>{s.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* License Render */}
          {activeCategory === 'license' && (
            <div className="license-render-preview" style={{ borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--surface-base)' }}>
              <div className="license-header">
                <span className="material-symbols-outlined text-emerald" style={{ color: '#10b981' }}>verified</span>
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
      }
    />
  )
}
