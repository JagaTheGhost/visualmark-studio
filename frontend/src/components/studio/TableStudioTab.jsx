import React, { useState, useMemo, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import StudioShell from './common/StudioShell'
import BadgeStudioTab from './badge/BadgeStudioTab'
import '../../styles/studios/tableStudio.css'

const TABLE_PRESETS = [
  {
    id: 'conventional-commits',
    title: 'Conventional Commits',
    category: 'Git Workflow',
    description: 'Standard git commit types with colorful status badges, scopes, and SemVer release bumps.',
    headers: ['Type', 'Badge', 'Scope & Description', 'SemVer Bump'],
    alignments: ['left', 'center', 'left', 'center'],
    rows: [
      ['`feat`', '![Feat](https://img.shields.io/badge/-Feature-007ACC?style=flat-square)', 'New user-facing feature or capability', '`MINOR` (0.x.0)'],
      ['`fix`', '![Fix](https://img.shields.io/badge/-Fix-E05D44?style=flat-square)', 'Bug fix or patch in existing functionality', '`PATCH` (0.0.x)'],
      ['`docs`', '![Docs](https://img.shields.io/badge/-Docs-4C1?style=flat-square)', 'Documentation additions or modifications only', 'None'],
      ['`refactor`', '![Refactor](https://img.shields.io/badge/-Refactor-9B59B6?style=flat-square)', 'Code refactoring without behavioral or API change', 'None'],
      ['`test`', '![Test](https://img.shields.io/badge/-Test-00C7B7?style=flat-square)', 'Adding or fixing automated unit/e2e test suites', 'None'],
      ['`perf`', '![Perf](https://img.shields.io/badge/-Perf-F39C12?style=flat-square)', 'Performance optimization and latency reduction', '`PATCH` (0.0.x)'],
      ['`chore`', '![Chore](https://img.shields.io/badge/-Chore-7F8C8D?style=flat-square)', 'Maintenance tasks, dependency updates, tooling', 'None'],
      ['`ci`', '![CI](https://img.shields.io/badge/-CI-2ECC71?style=flat-square)', 'Continuous integration and deployment pipelines', 'None']
    ]
  },
  {
    id: 'features',
    title: 'Feature Matrix & Modules',
    category: 'Architecture',
    description: 'Feature name, implementation module, status badge, and readiness level.',
    headers: ['Module / Feature', 'Architecture Role', 'Status', 'Readiness'],
    alignments: ['left', 'left', 'center', 'center'],
    rows: [
      ['AST Document Scanner', 'Deep-scans dependencies and repository tree', '![Ready](https://img.shields.io/badge/Status-Ready-success?style=flat-square)', '✅ Stable'],
      ['Visual Table Studio', 'Interactive grid editor with badge generators & CSV import', '![Active](https://img.shields.io/badge/Status-Active-blue?style=flat-square)', '✅ Stable'],
      ['Mermaid Visualizer', 'Vector diagram engine for flowcharts & ER graphs', '![Live](https://img.shields.io/badge/Status-Live-purple?style=flat-square)', '✅ Stable'],
      ['Multi-Doc Compiler', 'Standardized skeletons for README, CONTRIBUTING & SETUP', '![Ready](https://img.shields.io/badge/Status-Ready-success?style=flat-square)', '✅ Stable']
    ]
  },
  {
    id: 'api-endpoints',
    title: 'REST API Endpoints',
    category: 'API Spec',
    description: 'HTTP method, path, authentication requirement, and summary.',
    headers: ['Method', 'Endpoint', 'Auth Required', 'Description'],
    alignments: ['center', 'left', 'center', 'left'],
    rows: [
      ['![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square)', '`/api/v1/generate-readme`', 'Bearer Token', 'Creates complete documentation suite from input parameters'],
      ['![POST](https://img.shields.io/badge/-POST-49cc90?style=flat-square)', '`/api/v1/scan-repo`', 'None', 'Deep-scans GitHub repository tree and config files'],
      ['![GET](https://img.shields.io/badge/-GET-61affe?style=flat-square)', '`/api/v1/health`', 'None', 'Returns system heartbeat and generator services health'],
      ['![DELETE](https://img.shields.io/badge/-DELETE-f93e3e?style=flat-square)', '`/api/v1/sessions/{id}`', 'Bearer Token', 'Terminates active workspace editing session']
    ]
  },
  {
    id: 'env-vars',
    title: 'Environment Variables (.env)',
    category: 'Configuration',
    description: 'Configuration options, variable types, defaults, and necessity.',
    headers: ['Variable', 'Type', 'Default', 'Required', 'Description'],
    alignments: ['left', 'center', 'center', 'center', 'left'],
    rows: [
      ['`DATABASE_URL`', 'String (URI)', '`sqlite:///./app.db`', '✅ Yes', 'Primary database connection string'],
      ['`JWT_SECRET`', 'String (Hex)', 'None', '✅ Yes', 'Cryptographic secret for signing session tokens'],
      ['`PORT`', 'Integer', '`8000`', 'Optional', 'Listening port for the backend web service'],
      ['`DEBUG`', 'Boolean', '`false`', 'Optional', 'Enable verbose server tracebacks and reload']
    ]
  },
  {
    id: 'tech-stack',
    title: 'Tech Stack Specifications',
    category: 'Architecture',
    description: 'Architecture layer, technology, version requirements, and role.',
    headers: ['Layer', 'Technology', 'Badge', 'Version', 'Role'],
    alignments: ['left', 'left', 'center', 'center', 'left'],
    rows: [
      ['Frontend UI', 'React 19 + Vite', '![React](https://img.shields.io/badge/-React_19-20232A?style=flat-square&logo=react)', '`^19.0.0`', 'High-density developer IDE interface'],
      ['Backend Core', 'FastAPI + Python', '![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)', '`>=3.11`', 'Asynchronous REST gateway and AST processor'],
      ['Diagram Engine', 'Mermaid.js', '![Mermaid](https://img.shields.io/badge/-Mermaid.js-ff3670?style=flat-square)', '`^10.9.0`', 'Vector SVG system architectures and ER maps'],
      ['Build & Package', 'Electron + Vite', '![Electron](https://img.shields.io/badge/-Electron-47848F?style=flat-square&logo=electron)', '`^34.0.0`', 'Cross-platform native desktop execution']
    ]
  },
  {
    id: 'compatibility',
    title: 'Platform Compatibility',
    category: 'Support',
    description: 'Operating systems, runtimes, tested versions, and support tier.',
    headers: ['Platform / Runtime', 'Engine', 'Tested Version', 'Status'],
    alignments: ['left', 'center', 'center', 'center'],
    rows: [
      ['Node.js', 'V8', '`20.x` (LTS), `22.x`', '![Passing](https://img.shields.io/badge/Tests-Passing-success?style=flat-square)'],
      ['Python', 'CPython', '`3.11`, `3.12`', '![Passing](https://img.shields.io/badge/Tests-Passing-success?style=flat-square)'],
      ['Windows', 'x64 / ARM64', 'Windows 10 / 11', '![Supported](https://img.shields.io/badge/Tier-Tier_1-blue?style=flat-square)'],
      ['macOS', 'Apple Silicon / Intel', 'macOS 13+ (Ventura+)', '![Supported](https://img.shields.io/badge/Tier-Tier_1-blue?style=flat-square)'],
      ['Linux', 'glibc >= 2.31', 'Ubuntu 22.04 LTS+', '![Supported](https://img.shields.io/badge/Tier-Tier_1-blue?style=flat-square)']
    ]
  },
  {
    id: 'roadmap-milestones',
    title: 'Roadmap & Milestones',
    category: 'Project Plan',
    description: 'Quarterly delivery goals, priority levels, status badges, and module owners.',
    headers: ['Quarter', 'Milestone Goal', 'Priority', 'Status', 'Lead'],
    alignments: ['center', 'left', 'center', 'center', 'left'],
    rows: [
      ['`Q1 2025`', 'Native Desktop Workspace Engine', '![High](https://img.shields.io/badge/Priority-High-red?style=flat-square)', '![Done](https://img.shields.io/badge/Status-Complete-success?style=flat-square)', '@team-core'],
      ['`Q2 2025`', 'Full Shields.io & Repo Card Vector Suite', '![High](https://img.shields.io/badge/Priority-High-red?style=flat-square)', '![Active](https://img.shields.io/badge/Status-Active-blue?style=flat-square)', '@team-ui'],
      ['`Q3 2025`', 'Interactive Mermaid Flowchart Studio', '![Medium](https://img.shields.io/badge/Priority-Med-orange?style=flat-square)', '![WIP](https://img.shields.io/badge/Status-In_Progress-yellow?style=flat-square)', '@team-diagrams'],
      ['`Q4 2025`', 'Cloud Sync & GitHub Pull Request Bot', '![Low](https://img.shields.io/badge/Priority-Low-lightgrey?style=flat-square)', '![Planned](https://img.shields.io/badge/Status-Planned-purple?style=flat-square)', '@team-cloud']
    ]
  },
  {
    id: 'pricing-matrix',
    title: 'Plan & Feature Matrix',
    category: 'Comparison',
    description: 'Feature tiers, limits, user seats, and support guarantees.',
    headers: ['Feature / Capability', 'Community', 'Pro Tier', 'Enterprise'],
    alignments: ['left', 'center', 'center', 'center'],
    rows: [
      ['Markdown & Table Studios', '✅ Free Forever', '✅ Free Forever', '✅ Free Forever'],
      ['Custom Vector Themes', '3 Included', 'Unlimited', 'Unlimited'],
      ['Team Collaboration Seats', '1 User', 'Up to 10', 'Unlimited'],
      ['Priority GitHub CI Support', '❌ Community', '24h Response', 'Dedicated SLA']
    ]
  },
  {
    id: 'performance-benchmarks',
    title: 'Performance Benchmarks',
    category: 'Benchmarks',
    description: 'Throughput, latency (p99), memory footprint, and cold boot benchmark scores.',
    headers: ['Engine', 'Throughput (req/s)', 'p99 Latency', 'Memory', 'Score'],
    alignments: ['left', 'center', 'center', 'center', 'center'],
    rows: [
      ['VisualMark V2 (Wasm)', '48,200', '1.4 ms', '18 MB', '![Grade](https://img.shields.io/badge/Score-A%2B-brightgreen?style=flat-square)'],
      ['Legacy Generator V1', '12,400', '6.8 ms', '74 MB', '![Grade](https://img.shields.io/badge/Score-B-yellow?style=flat-square)'],
      ['Standard AST CLI', '8,900', '14.2 ms', '112 MB', '![Grade](https://img.shields.io/badge/Score-C-orange?style=flat-square)']
    ]
  },
  {
    id: 'faq-documentation',
    title: 'FAQ & Troubleshooting Reference',
    category: 'Documentation',
    description: 'Frequently encountered developer questions, error codes, and quick resolution steps.',
    headers: ['Topic / Error', 'Impact', 'Root Cause', 'Resolution'],
    alignments: ['left', 'center', 'left', 'left'],
    rows: [
      ['`E_BADGE_OVERFLOW`', '⚠️ Warning', 'Badge URL string exceeds GitHub character limit', 'Switch to SVG vector embed or short URL'],
      ['`E_GFM_ESCAPE`', '❌ Fatal', 'Unescaped pipe `|` in raw cell text breaks markdown table', 'Use `\\|` or enclose expression inside code backticks'],
      ['`E_TOKEN_EXPIRED`', '🔒 Auth', 'GitHub personal access token expired', 'Regenerate token with `repo` scope in settings']
    ]
  }
]

/**
 * Markdown Table Studio Pro
 * High-density interactive tabular data designer with Shields.io badges,
 * CSV/TSV paste import, GFM alignment cycling, and live WYSIWYG render.
 */
export default function TableStudioTab({
  onInsertTable,
  onBackToReadme
}) {
  const [headers, setHeaders] = useState(TABLE_PRESETS[0].headers)
  const [alignments, setAlignments] = useState(TABLE_PRESETS[0].alignments)
  const [rows, setRows] = useState(TABLE_PRESETS[0].rows)

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)
  const [isBadgeStudioModalOpen, setIsBadgeStudioModalOpen] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [csvDelimiter, setCsvDelimiter] = useState('auto')
  const [csvError, setCsvError] = useState('')

  // Selected / Active cell for quick formatting
  const [activeCell, setActiveCell] = useState({ rowIndex: 0, colIndex: 0 })

  // Count cells with badges wrapped in backticks (e.g. `![Feat](...)`)
  const backtickBadges = useMemo(() => {
    let count = 0
    rows.forEach((r) => {
      r.forEach((c) => {
        if (typeof c === 'string' && /^`\s*(!\[.*?\]\(.*?\))\s*`$/.test(c.trim())) {
          count++
        }
      })
    })
    return count
  }, [rows])

  // 1-Click unwrap backtick badges across the entire table
  const handleUnwrapAllBadges = () => {
    setRows((prev) =>
      prev.map((row) =>
        row.map((cell) => {
          if (typeof cell === 'string') {
            const match = cell.trim().match(/^`\s*(!\[.*?\]\(.*?\))\s*`$/)
            if (match) return match[1]
          }
          return cell
        })
      )
    )
  }

  // Import CSV / TSV / Excel
  const handleImportCsv = () => {
    if (!csvText.trim()) {
      setCsvError('Please paste some CSV, TSV, or spreadsheet text.')
      return
    }

    const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim() !== '')
    if (lines.length === 0) {
      setCsvError('No valid rows found.')
      return
    }

    let delim = '\t'
    if (csvDelimiter === 'tab') {
      delim = '\t'
    } else if (csvDelimiter === 'comma') {
      delim = ','
    } else if (csvDelimiter === 'pipe') {
      delim = '|'
    } else {
      const firstLine = lines[0]
      const tabCount = (firstLine.match(/\t/g) || []).length
      const commaCount = (firstLine.match(/,/g) || []).length
      const pipeCount = (firstLine.match(/\|/g) || []).length

      if (tabCount >= commaCount && tabCount >= pipeCount && tabCount > 0) {
        delim = '\t'
      } else if (pipeCount > commaCount && pipeCount > 0) {
        delim = '|'
      } else {
        delim = ','
      }
    }

    const parseLine = (line) => {
      if (delim === '|') {
        return line
          .split('|')
          .map((c) => c.trim())
          .filter((c, idx, arr) => !(idx === 0 && c === '') && !(idx === arr.length - 1 && c === ''))
      }
      if (delim === '\t') {
        return line.split('\t').map((c) => c.trim())
      }
      const cells = []
      let curr = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inQuotes = !inQuotes
        } else if (char === delim && !inQuotes) {
          cells.push(curr.trim().replace(/^"|"$/g, ''))
          curr = ''
        } else {
          curr += char
        }
      }
      cells.push(curr.trim().replace(/^"|"$/g, ''))
      return cells
    }

    const parsedLines = lines.map(parseLine).filter((row) => !row.every((c) => /^:?-+:?$/.test(c)))

    if (parsedLines.length === 0) {
      setCsvError('Could not parse any rows from input.')
      return
    }

    const newHeaders = parsedLines[0].map((h, i) => h || `Col ${i + 1}`)
    const newAligns = newHeaders.map(() => 'left')
    const rawRows = parsedLines.slice(1)
    const newRows =
      rawRows.length > 0
        ? rawRows.map((row) => {
            const filled = new Array(newHeaders.length).fill('')
            row.forEach((cell, idx) => {
              if (idx < newHeaders.length) filled[idx] = cell
            })
            return filled
          })
        : [new Array(newHeaders.length).fill('')]

    setHeaders(newHeaders)
    setAlignments(newAligns)
    setRows(newRows)
    setCsvText('')
    setCsvError('')
    setIsCsvModalOpen(false)
  }

  // Alignments helper
  const cycleAlignment = (colIndex) => {
    setAlignments((prev) => {
      const next = [...prev]
      const current = next[colIndex] || 'left'
      if (current === 'left') next[colIndex] = 'center'
      else if (current === 'center') next[colIndex] = 'right'
      else next[colIndex] = 'left'
      return next
    })
  }

  // Row and Column operations
  const handleAddColumn = () => {
    const newColNum = headers.length + 1
    setHeaders((prev) => [...prev, `Column ${newColNum}`])
    setAlignments((prev) => [...prev, 'left'])
    setRows((prev) => prev.map((row) => [...row, '']))
  }

  const handleRemoveColumn = (colIndex) => {
    if (headers.length <= 1) return
    setHeaders((prev) => prev.filter((_, idx) => idx !== colIndex))
    setAlignments((prev) => prev.filter((_, idx) => idx !== colIndex))
    setRows((prev) => prev.map((row) => row.filter((_, idx) => idx !== colIndex)))
  }

  const handleAddRow = () => {
    const emptyRow = new Array(headers.length).fill('')
    setRows((prev) => [...prev, emptyRow])
    setActiveCell({ rowIndex: rows.length, colIndex: 0 })
  }

  const handleRemoveRow = (rowIndex) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((_, idx) => idx !== rowIndex))
    setActiveCell((prev) => ({
      rowIndex: Math.max(0, Math.min(prev.rowIndex, rows.length - 2)),
      colIndex: prev.colIndex
    }))
  }

  const handleMoveRow = (rowIndex, direction) => {
    const targetIndex = rowIndex + direction
    if (targetIndex < 0 || targetIndex >= rows.length) return
    setRows((prev) => {
      const next = [...prev]
      const [moved] = next.splice(rowIndex, 1)
      next.splice(targetIndex, 0, moved)
      return next
    })
    setActiveCell((prev) => ({ ...prev, rowIndex: targetIndex }))
  }

  const handleDuplicateRow = (rowIndex) => {
    setRows((prev) => {
      const next = [...prev]
      const clone = [...next[rowIndex]]
      next.splice(rowIndex + 1, 0, clone)
      return next
    })
    setActiveCell({ rowIndex: rowIndex + 1, colIndex: activeCell.colIndex })
  }

  const handleClearTable = () => {
    if (window.confirm('Reset table grid to blank 3x3 template?')) {
      setHeaders(['Column 1', 'Column 2', 'Column 3'])
      setAlignments(['left', 'left', 'left'])
      setRows([
        ['', '', ''],
        ['', '', '']
      ])
      setActiveCell({ rowIndex: 0, colIndex: 0 })
    }
  }

  const handleHeaderChange = (idx, value) => {
    setHeaders((prev) => {
      const next = [...prev]
      next[idx] = value
      return next
    })
  }

  // Sanitize cell content: strip wrapping div/p tags, replace newlines with spaces so markdown table does not break
  const cleanCellContent = (val) => {
    if (val === null || val === undefined) return ''
    let s = String(val)
    if (s.includes('<div') || s.includes('<p') || s.includes('\n')) {
      s = s
        .replace(/<\/?(div|p)[^>]*>/gi, ' ')
        .replace(/\r?\n+/g, ' ')
        .replace(/\s{2,}/g, ' ')
    }
    return s.trim()
  }

  const handleCellChange = (rowIndex, colIndex, value) => {
    const sanitizedVal = cleanCellContent(value)
    setRows((prev) => {
      const next = [...prev]
      next[rowIndex] = [...next[rowIndex]]
      next[rowIndex][colIndex] = sanitizedVal
      return next
    })
  }

  // Auto-clean any existing broken cells in state
  useEffect(() => {
    let hasDirtyCell = false
    const sanitized = rows.map((r) =>
      r.map((c) => {
        if (typeof c === 'string' && (c.includes('\n') || c.includes('<div') || c.includes('<p'))) {
          hasDirtyCell = true
          return cleanCellContent(c)
        }
        return c
      })
    )
    if (hasDirtyCell) {
      setRows(sanitized)
    }
  }, [rows])

  const handleApplyPreset = (preset) => {
    setHeaders(preset.headers)
    setAlignments(preset.alignments)
    setRows(preset.rows)
    setActiveCell({ rowIndex: 0, colIndex: 0 })
  }

  // Active cell quick formatting
  const handleInsertBadgeToActiveCell = (badgeMarkdown) => {
    const { rowIndex, colIndex } = activeCell
    if (rowIndex < rows.length && colIndex < headers.length) {
      handleCellChange(rowIndex, colIndex, badgeMarkdown)
    }
    setIsBadgeStudioModalOpen(false)
  }

  const handleToggleCodeOnActiveCell = () => {
    const { rowIndex, colIndex } = activeCell
    if (rowIndex >= rows.length || colIndex >= headers.length) return
    const val = (rows[rowIndex][colIndex] || '').trim()
    if (!val) return

    if (val.startsWith('`') && val.endsWith('`') && val.length > 1) {
      handleCellChange(rowIndex, colIndex, val.slice(1, -1))
    } else {
      handleCellChange(rowIndex, colIndex, `\`${val}\``)
    }
  }

  const handleToggleBoldOnActiveCell = () => {
    const { rowIndex, colIndex } = activeCell
    if (rowIndex >= rows.length || colIndex >= headers.length) return
    const val = (rows[rowIndex][colIndex] || '').trim()
    if (!val) return

    if (val.startsWith('**') && val.endsWith('**') && val.length > 3) {
      handleCellChange(rowIndex, colIndex, val.slice(2, -2))
    } else {
      handleCellChange(rowIndex, colIndex, `**${val}**`)
    }
  }

  const handleToggleItalicOnActiveCell = () => {
    const { rowIndex, colIndex } = activeCell
    if (rowIndex >= rows.length || colIndex >= headers.length) return
    const val = (rows[rowIndex][colIndex] || '').trim()
    if (!val) return

    if (val.startsWith('*') && val.endsWith('*') && !val.startsWith('**') && val.length > 2) {
      handleCellChange(rowIndex, colIndex, val.slice(1, -1))
    } else {
      handleCellChange(rowIndex, colIndex, `*${val}*`)
    }
  }

  const handleInsertStatusToActiveCell = (statusText) => {
    const { rowIndex, colIndex } = activeCell
    if (rowIndex < rows.length && colIndex < headers.length) {
      handleCellChange(rowIndex, colIndex, statusText)
    }
  }

  // Generate markdown table string
  const markdownTable = useMemo(() => {
    const formatAlign = (align) => {
      if (align === 'center') return ':---:'
      if (align === 'right') return '---:'
      return ':---'
    }

    const headerLine = `| ${headers.map((h) => cleanCellContent(h) || ' ').join(' | ')} |`
    const dividerLine = `| ${alignments.map((a) => formatAlign(a)).join(' | ')} |`
    const bodyLines = rows.map(
      (row) => `| ${headers.map((_, colIdx) => cleanCellContent(row[colIdx]) || '').join(' | ')} |`
    )

    return `${headerLine}\n${dividerLine}\n${bodyLines.join('\n')}\n`
  }, [headers, alignments, rows])

  const handleInsert = () => {
    if (typeof onInsertTable === 'function') {
      onInsertTable(markdownTable)
    }
  }

  const handleExportCsv = () => {
    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((c) => `"${(c || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'table-export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  // Extra action: Export CSV button in top shell toolbar
  const extraHeaderActions = (
    <button
      type="button"
      className="studio-shell-btn studio-shell-btn-secondary"
      onClick={handleExportCsv}
      title="Download table data as CSV spreadsheet"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
      <span>Export CSV</span>
    </button>
  )

  // Status & fix pills in canvas header
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="canvas-header-divider" />
      <span className="canvas-mode-tag">
        {headers.length} COLS × {rows.length} ROWS
      </span>
      {backtickBadges > 0 && (
        <button
          type="button"
          onClick={handleUnwrapAllBadges}
          className="studio-shell-btn studio-shell-btn-secondary"
          style={{
            fontSize: '11px',
            padding: '3px 8px',
            color: '#f59e0b',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            gap: '4px'
          }}
          title="Unwrap backticks around badges so they render as graphics"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>auto_fix_high</span>
          <span>Fix {backtickBadges} Badges</span>
        </button>
      )}
    </div>
  )

  return (
    <>
      <StudioShell
        studioId="tables.studio"
        title="Markdown Table Studio"
        subtitle="High-density interactive tabular data designer with Shields.io badges, CSV/TSV paste, and GFM alignment"
        badge="GFM Table Pro"
        accentColor="#38bdf8"
        icon={<span className="material-symbols-outlined" style={{ fontSize: '20px' }}>table_chart</span>}
        markdownCode={markdownTable}
        onInsert={handleInsert}
        insertLabel="Insert Table"
        onBackToReadme={onBackToReadme}
        extraHeaderActions={extraHeaderActions}
        canvasHeaderExtras={canvasHeaderExtras}
        defaultSplitWidth={560}
        minSplitWidth={380}
        maxSplitWidth={880}
        inspectorContent={
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. Quick Presets Bar */}
            <div className="studio-section">
              <div className="section-header-row" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="studio-section-label" style={{ fontWeight: 600, fontSize: '12px', color: '#94a3b8' }}>
                  1 • Table Presets Catalog
                </label>
                <span className="preset-count-tag" style={{ fontSize: '10px', color: '#64748b' }}>
                  {TABLE_PRESETS.length} Templates
                </span>
              </div>
              <div className="studio-presets-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {TABLE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="studio-preset-pill"
                    onClick={() => handleApplyPreset(p)}
                    title={p.description}
                  >
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Grid Dimension & Import Controls */}
            <div className="studio-section">
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="studio-section-label" style={{ fontWeight: 600, fontSize: '12px', color: '#94a3b8' }}>
                  2 • Dimensions & Import
                </label>
                <span className="dimension-stats" style={{ fontSize: '11px', color: '#64748b' }}>
                  {headers.length} columns × {rows.length} rows
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  type="button"
                  className="table-action-pill"
                  onClick={handleAddColumn}
                  title="Add new column to the right"
                >
                  <span className="material-symbols-outlined icon-xs">view_column</span>
                  <span>+ Column</span>
                </button>
                <button
                  type="button"
                  className="table-action-pill"
                  onClick={handleAddRow}
                  title="Add new row at the bottom"
                >
                  <span className="material-symbols-outlined icon-xs">table_rows</span>
                  <span>+ Row</span>
                </button>
                <button
                  type="button"
                  className="table-action-pill highlight"
                  onClick={() => setIsCsvModalOpen(true)}
                  title="Paste spreadsheet cells from Excel/Sheets or raw CSV/TSV text"
                >
                  <span className="material-symbols-outlined icon-xs">content_paste</span>
                  <span>Paste CSV / Excel</span>
                </button>
                <button
                  type="button"
                  className="table-action-pill"
                  onClick={handleClearTable}
                  title="Reset table grid to blank template"
                  style={{ marginLeft: 'auto' }}
                >
                  <span className="material-symbols-outlined icon-xs">restart_alt</span>
                  <span>Reset Grid</span>
                </button>
              </div>
            </div>

            {/* 3. Active Cell Quick Formatting Tools */}
            <div className="studio-section table-quick-tools-card">
              <div className="quick-tools-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="quick-tools-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>
                  <span className="material-symbols-outlined icon-xs" style={{ color: '#38bdf8' }}>
                    edit_attributes
                  </span>
                  Cell Tools (Row {activeCell.rowIndex + 1}, Col {activeCell.colIndex + 1})
                </span>
                <span className="quick-tools-tip" style={{ fontSize: '11px', color: '#64748b' }}>
                  Click any cell to edit & format
                </span>
              </div>

              <div className="quick-tools-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <button
                  type="button"
                  className="btn-quick-tool badge-tool"
                  onClick={() => setIsBadgeStudioModalOpen(true)}
                  title="Launch Shields.io Badges Studio to design and insert any badge into this cell"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8'
                  }}
                >
                  <span className="material-symbols-outlined icon-xs">shield</span>
                  <span>+ Badge Studio</span>
                </button>

                <button
                  type="button"
                  className="btn-quick-tool"
                  onClick={handleToggleCodeOnActiveCell}
                  title="Toggle backticks `code` on current cell value"
                >
                  <span className="material-symbols-outlined icon-xs">code</span>
                  <span>`Code`</span>
                </button>

                <button
                  type="button"
                  className="btn-quick-tool"
                  onClick={handleToggleBoldOnActiveCell}
                  title="Toggle bold **text** on current cell value"
                >
                  <span className="material-symbols-outlined icon-xs">format_bold</span>
                  <span>Bold</span>
                </button>

                <button
                  type="button"
                  className="btn-quick-tool"
                  onClick={handleToggleItalicOnActiveCell}
                  title="Toggle italic *text* on current cell value"
                >
                  <span className="material-symbols-outlined icon-xs">format_italic</span>
                  <span>Italic</span>
                </button>

                <button
                  type="button"
                  className="btn-quick-tool"
                  onClick={() => handleInsertStatusToActiveCell('✅ Ready')}
                  title="Insert ready status tag"
                >
                  <span>✅ Ready</span>
                </button>

                <button
                  type="button"
                  className="btn-quick-tool"
                  onClick={() => handleInsertStatusToActiveCell('⚠️ WIP')}
                  title="Insert in-progress status tag"
                >
                  <span>⚠️ WIP</span>
                </button>

                <button
                  type="button"
                  className="btn-quick-tool"
                  onClick={() => handleInsertStatusToActiveCell('❌ Deprecated')}
                  title="Insert deprecated status tag"
                >
                  <span>❌ Deprecated</span>
                </button>
              </div>
            </div>

            {/* 4. Interactive Editable Visual Table Grid */}
            <div className="studio-section">
              <label className="studio-section-label" style={{ display: 'block', fontWeight: 600, fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                3 • Interactive Table Grid
              </label>

              <div className="table-grid-container custom-scrollbar">
                <table className="interactive-table-editor">
                  <thead>
                    <tr>
                      <th className="row-number-header">#</th>
                      {headers.map((header, colIdx) => (
                        <th key={colIdx} className="table-header-cell">
                          <div className="header-cell-inner">
                            <input
                              type="text"
                              className="table-header-input"
                              value={header}
                              onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                              placeholder={`Col ${colIdx + 1}`}
                            />
                            <button
                              type="button"
                              className="align-cycle-btn"
                              onClick={() => cycleAlignment(colIdx)}
                              title={`Alignment: ${alignments[colIdx] || 'left'} (Click to cycle)`}
                            >
                              <span className="material-symbols-outlined icon-xs">
                                {alignments[colIdx] === 'center'
                                  ? 'format_align_center'
                                  : alignments[colIdx] === 'right'
                                  ? 'format_align_right'
                                  : 'format_align_left'}
                              </span>
                            </button>
                            {headers.length > 1 && (
                              <button
                                type="button"
                                className="col-delete-btn"
                                onClick={() => handleRemoveColumn(colIdx)}
                                title="Remove this column"
                              >
                                <span className="material-symbols-outlined icon-xs">close</span>
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                      <th className="row-action-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="row-number-cell">{rowIdx + 1}</td>
                        {headers.map((_, colIdx) => {
                          const cellVal = row[colIdx] || ''
                          const isFocused = activeCell.rowIndex === rowIdx && activeCell.colIndex === colIdx
                          const isBacktickBadge = /^`\s*(!\[.*?\]\(.*?\))\s*`$/.test(cellVal.trim())

                          return (
                            <td
                              key={colIdx}
                              className={`table-data-cell ${isFocused ? 'cell-active' : ''} ${
                                isBacktickBadge ? 'cell-warning-badge' : ''
                              }`}
                            >
                              <div className="table-cell-wrapper">
                                <input
                                  type="text"
                                  className="table-cell-input"
                                  value={cellVal}
                                  onFocus={() => setActiveCell({ rowIndex: rowIdx, colIndex: colIdx })}
                                  onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                                  placeholder="Cell text or badge..."
                                />
                                {isBacktickBadge && (
                                  <button
                                    type="button"
                                    className="cell-quick-fix-btn"
                                    onClick={() => {
                                      const match = cellVal.trim().match(/^`\s*(!\[.*?\]\(.*?\))\s*`$/)
                                      if (match) handleCellChange(rowIdx, colIdx, match[1])
                                    }}
                                    title="Click to unwrap backticks so badge renders as graphic"
                                  >
                                    Fix
                                  </button>
                                )}
                              </div>
                            </td>
                          )
                        })}
                        <td className="row-delete-cell">
                          <div className="row-actions-group">
                            <button
                              type="button"
                              className="row-tool-btn"
                              disabled={rowIdx === 0}
                              onClick={() => handleMoveRow(rowIdx, -1)}
                              title="Move row up"
                            >
                              <span className="material-symbols-outlined icon-xs">arrow_upward</span>
                            </button>
                            <button
                              type="button"
                              className="row-tool-btn"
                              disabled={rowIdx === rows.length - 1}
                              onClick={() => handleMoveRow(rowIdx, 1)}
                              title="Move row down"
                            >
                              <span className="material-symbols-outlined icon-xs">arrow_downward</span>
                            </button>
                            <button
                              type="button"
                              className="row-tool-btn"
                              onClick={() => handleDuplicateRow(rowIdx)}
                              title="Duplicate row"
                            >
                              <span className="material-symbols-outlined icon-xs">content_copy</span>
                            </button>
                            {rows.length > 1 && (
                              <button
                                type="button"
                                className="row-tool-btn danger"
                                onClick={() => handleRemoveRow(rowIdx)}
                                title="Remove this row"
                              >
                                <span className="material-symbols-outlined icon-xs">delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
        canvasContent={
          <div
            className="table-render-viewport custom-scrollbar"
            style={{
              width: '100%',
              maxWidth: '100%',
              padding: '24px',
              boxSizing: 'border-box'
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                table({ node, children, ...props }) {
                  return (
                    <div className="preview-table-container">
                      <table className="preview-table rendered-markdown-table" {...props}>
                        {children}
                      </table>
                    </div>
                  )
                }
              }}
            >
              {markdownTable}
            </ReactMarkdown>
          </div>
        }
      />

      {/* ==================== FULL-FIDELITY SHIELDS.IO BADGES STUDIO MODAL ==================== */}
      {isBadgeStudioModalOpen && (
        <div className="studio-badge-modal-overlay" onClick={() => setIsBadgeStudioModalOpen(false)}>
          <div className="studio-badge-modal-container" onClick={(e) => e.stopPropagation()}>
            <BadgeStudioTab
              onInsertBadge={(badgeMd) => {
                handleInsertBadgeToActiveCell(badgeMd)
                setIsBadgeStudioModalOpen(false)
              }}
              onBackToReadme={() => setIsBadgeStudioModalOpen(false)}
              targetContext={{
                type: 'table-cell',
                label: `Table Cell (Row ${activeCell.rowIndex + 1}, Col ${activeCell.colIndex + 1})`
              }}
            />
          </div>
        </div>
      )}

      {/* ==================== CSV / TSV / EXCEL IMPORT MODAL ==================== */}
      {isCsvModalOpen && (
        <div className="studio-modal-backdrop" onClick={() => setIsCsvModalOpen(false)}>
          <div className="studio-modal-content custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <div className="modal-title-group">
                <span className="material-symbols-outlined text-primary">table_view</span>
                <h3>Paste CSV / Spreadsheet Data</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCsvModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <p className="modal-subtitle">
              Copy cells from Excel, Google Sheets, or Notion, or paste comma/tab/pipe separated text. The first row will be converted into column headers.
            </p>

            <div className="csv-options-row">
              <label className="csv-option-label">Delimiter Format:</label>
              <div className="csv-pills">
                {['auto', 'tab', 'comma', 'pipe'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`csv-pill ${csvDelimiter === d ? 'active' : ''}`}
                    onClick={() => setCsvDelimiter(d)}
                  >
                    {d === 'auto' ? 'Auto-Detect' : d.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="csv-modal-textarea custom-scrollbar"
              rows={8}
              placeholder="Paste tab-separated or comma-separated values here...&#10;e.g.&#10;Type	Badge	Scope & Description&#10;feat	![Feat](...)	New feature&#10;fix	![Fix](...)	Bug patch"
              value={csvText}
              onChange={(e) => {
                setCsvText(e.target.value)
                setCsvError('')
              }}
              autoFocus
            />

            {csvError && (
              <div className="csv-error-alert">
                <span className="material-symbols-outlined icon-xs">error</span>
                <span>{csvError}</span>
              </div>
            )}

            <div className="modal-footer-row">
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={() => {
                  setCsvText(
                    `Type\tBadge\tScope & Description\nfeat\t![Feat](https://img.shields.io/badge/-Feature-007ACC?style=flat-square)\tNew user-facing feature\nfix\t![Fix](https://img.shields.io/badge/-Fix-E05D44?style=flat-square)\tBug fix or patch\ndocs\t![Docs](https://img.shields.io/badge/-Docs-4C1?style=flat-square)\tDocumentation updates`
                  )
                }}
              >
                Insert Sample Commits Table
              </button>
              <div className="modal-actions-right">
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={() => setIsCsvModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-studio-primary"
                  onClick={handleImportCsv}
                >
                  <span className="material-symbols-outlined icon-xs">file_download</span>
                  <span>Import into Grid</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
