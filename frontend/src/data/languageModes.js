// VisualMark Studio - Registry of Supported Document & Syntax Language Modes

export const LANGUAGE_MODES = [
  // Documentation & Markup
  {
    id: 'markdown',
    label: 'Markdown (GFM)',
    category: 'Documentation',
    extensions: ['.md', '.markdown', '.mdown', '.mkdn'],
    color: '#38bdf8',
    icon: 'description',
    desc: 'GitHub Flavored Markdown with tables, alerts & math'
  },
  {
    id: 'mdx',
    label: 'MDX (Markdown + React)',
    category: 'Documentation',
    extensions: ['.mdx'],
    color: '#818cf8',
    icon: 'code_blocks',
    desc: 'Markdown embedded with JSX and interactive components'
  },
  {
    id: 'plaintext',
    label: 'Plain Text',
    category: 'Text',
    extensions: ['.txt', '.text', '.log'],
    color: '#94a3b8',
    icon: 'text_snippet',
    desc: 'Unformatted plain text notes and system logs'
  },
  {
    id: 'mermaid',
    label: 'Mermaid Diagram',
    category: 'Diagrams',
    extensions: ['.mmd', '.mermaid'],
    color: '#ec4899',
    icon: 'schema',
    desc: 'Mermaid architecture diagram scripts and sequence charts'
  },
  {
    id: 'latex',
    label: 'LaTeX / KaTeX',
    category: 'Scientific',
    extensions: ['.tex', '.latex', '.sty'],
    color: '#a855f7',
    icon: 'functions',
    desc: 'Scientific typesetting, equations and mathematical papers'
  },

  // Web & UI
  {
    id: 'html',
    label: 'HTML',
    category: 'Web',
    extensions: ['.html', '.htm', '.xhtml'],
    color: '#f97316',
    icon: 'html',
    desc: 'HyperText Markup Language'
  },
  {
    id: 'xml',
    label: 'XML / SVG',
    category: 'Web',
    extensions: ['.xml', '.svg', '.plist', '.xaml'],
    color: '#fb923c',
    icon: 'code',
    desc: 'Extensible Markup Language and SVG vector graphics'
  },
  {
    id: 'css',
    label: 'CSS Stylesheet',
    category: 'Web',
    extensions: ['.css'],
    color: '#06b6d4',
    icon: 'css',
    desc: 'Cascading Style Sheets'
  },
  {
    id: 'scss',
    label: 'SCSS / SASS',
    category: 'Web',
    extensions: ['.scss', '.sass'],
    color: '#f43f5e',
    icon: 'style',
    desc: 'Sass CSS Preprocessor'
  },

  // Data & Configurations
  {
    id: 'json',
    label: 'JSON',
    category: 'Data & Config',
    extensions: ['.json', '.jsonc', '.geojson'],
    color: '#f59e0b',
    icon: 'data_object',
    desc: 'JavaScript Object Notation data and configurations'
  },
  {
    id: 'yaml',
    label: 'YAML',
    category: 'Data & Config',
    extensions: ['.yaml', '.yml'],
    color: '#ef4444',
    icon: 'tune',
    desc: 'YAML Ain\'t Markup Language configurations'
  },
  {
    id: 'dockerfile',
    label: 'Dockerfile',
    category: 'Data & Config',
    extensions: ['dockerfile', '.dockerfile'],
    color: '#2563eb',
    icon: 'deployed_code',
    desc: 'Docker container build instructions'
  },

  // Programming & Scripting
  {
    id: 'javascript',
    label: 'JavaScript',
    category: 'Programming',
    extensions: ['.js', '.jsx', '.cjs', '.mjs'],
    color: '#eab308',
    icon: 'javascript',
    desc: 'JavaScript (ECMAScript) and React JSX'
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    category: 'Programming',
    extensions: ['.ts', '.tsx', '.mts'],
    color: '#3b82f6',
    icon: 'code',
    desc: 'TypeScript typed superset of JavaScript and TSX'
  },
  {
    id: 'python',
    label: 'Python',
    category: 'Programming',
    extensions: ['.py', '.pyw', '.ipynb'],
    color: '#22c55e',
    icon: 'terminal',
    desc: 'Python programming language'
  },
  {
    id: 'shell',
    label: 'Shell Script',
    category: 'Scripting',
    extensions: ['.sh', '.bash', '.zsh', '.command'],
    color: '#10b981',
    icon: 'terminal',
    desc: 'Bourne-Again SHell, Zsh and Unix scripts'
  },
  {
    id: 'sql',
    label: 'SQL',
    category: 'Database',
    extensions: ['.sql', '.pgsql', '.mysql'],
    color: '#0ea5e9',
    icon: 'database',
    desc: 'Structured Query Language databases'
  },
  {
    id: 'rust',
    label: 'Rust',
    category: 'Systems',
    extensions: ['.rs'],
    color: '#ea580c',
    icon: 'memory',
    desc: 'Rust safe systems programming language'
  },
  {
    id: 'go',
    label: 'Go',
    category: 'Systems',
    extensions: ['.go'],
    color: '#00add8',
    icon: 'code',
    desc: 'Go (Golang) compiled systems programming language'
  },
  {
    id: 'cpp',
    label: 'C / C++',
    category: 'Systems',
    extensions: ['.c', '.cpp', '.cc', '.cxx', '.h', '.hpp'],
    color: '#0284c7',
    icon: 'memory',
    desc: 'C and C++ systems code'
  },
  {
    id: 'csharp',
    label: 'C#',
    category: 'Programming',
    extensions: ['.cs'],
    color: '#8b5cf6',
    icon: 'code',
    desc: 'C# Microsoft .NET programming language'
  },
  {
    id: 'java',
    label: 'Java',
    category: 'Programming',
    extensions: ['.java', '.class'],
    color: '#dc2626',
    icon: 'code',
    desc: 'Java enterprise language'
  },
  {
    id: 'php',
    label: 'PHP',
    category: 'Web',
    extensions: ['.php', '.phtml'],
    color: '#6366f1',
    icon: 'php',
    desc: 'PHP Hypertext Preprocessor'
  },
  {
    id: 'ruby',
    label: 'Ruby',
    category: 'Programming',
    extensions: ['.rb', '.rake'],
    color: '#e11d48',
    icon: 'code',
    desc: 'Ruby programming language'
  }
]

/**
 * Detect language mode ID based on file path or extension.
 */
export function detectLanguageFromFilename(filename) {
  if (!filename) return 'markdown'
  const lower = filename.toLowerCase()

  // Exact filename matches (e.g. Dockerfile)
  if (lower === 'dockerfile' || lower.endsWith('/dockerfile') || lower.endsWith('\\dockerfile')) {
    return 'dockerfile'
  }

  const ext = '.' + lower.split('.').pop()
  const matched = LANGUAGE_MODES.find(m => m.extensions.includes(ext))
  return matched ? matched.id : 'markdown'
}

/**
 * Get language mode metadata object by ID.
 */
export function getLanguageInfo(modeId) {
  return LANGUAGE_MODES.find(m => m.id === modeId) || LANGUAGE_MODES[0]
}

/**
 * Get formatted display name for status bar or badges.
 */
export function getLanguageDisplayName(modeId) {
  const info = getLanguageInfo(modeId)
  return info?.label || 'Markdown'
}

/**
 * Get dot indicator color for status bar badge.
 */
export function getLanguageDotColor(modeId) {
  const info = getLanguageInfo(modeId)
  return info?.color || '#38bdf8'
}
