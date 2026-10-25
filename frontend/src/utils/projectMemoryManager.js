/**
 * VisualMark Studio — Persistent Project Memory Manager
 * ==============================================================================
 * Manages project-specific profile, tech stack facts, user rules, and cross-session
 * summaries stored locally in localStorage per workspace path.
 * ==============================================================================
 */

/**
 * Compute stable hash from workspace path for localStorage keying
 */
export function getWorkspaceStorageKey(workspacePath) {
  if (!workspacePath) return 'visualmark_memory_default'
  const normalized = String(workspacePath).replace(/\\/g, '/').toLowerCase().trim()
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash) + normalized.charCodeAt(i)
    hash |= 0
  }
  return `visualmark_project_memory_${Math.abs(hash)}`
}

/**
 * Extract human-readable project folder name
 */
export function getProjectName(workspacePath) {
  if (!workspacePath) return 'Active Project'
  const parts = workspacePath.replace(/\\/g, '/').split('/').filter(Boolean)
  return parts[parts.length - 1] || 'Active Project'
}

/**
 * Load project memory structure from local storage
 */
export function loadProjectMemory(workspacePath) {
  const key = getWorkspaceStorageKey(workspacePath)
  const defaultMemory = {
    workspacePath: workspacePath || '',
    projectName: getProjectName(workspacePath),
    profile: {
      techStack: [],
      summary: '',
      updatedAt: null
    },
    rules: [],
    learnedFacts: [],
    recentSessions: []
  }

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return defaultMemory
    const parsed = JSON.parse(raw)
    return {
      ...defaultMemory,
      ...parsed,
      projectName: parsed.projectName || getProjectName(workspacePath),
      profile: {
        ...defaultMemory.profile,
        ...(parsed.profile || {})
      },
      rules: Array.isArray(parsed.rules) ? parsed.rules : [],
      learnedFacts: Array.isArray(parsed.learnedFacts) ? parsed.learnedFacts : [],
      recentSessions: Array.isArray(parsed.recentSessions) ? parsed.recentSessions : []
    }
  } catch {
    return defaultMemory
  }
}

/**
 * Save project memory structure into local storage
 */
export function saveProjectMemory(workspacePath, memory) {
  const key = getWorkspaceStorageKey(workspacePath)
  try {
    const payload = {
      ...memory,
      workspacePath: workspacePath || '',
      projectName: memory.projectName || getProjectName(workspacePath),
      updatedAt: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(payload))
    window.dispatchEvent(new CustomEvent('visualmark:project-memory-updated', { detail: { workspacePath } }))
    return true
  } catch (err) {
    console.warn('Failed to save project memory:', err)
    return false
  }
}

/**
 * Detect tech stack from file tree or open manifests
 */
export function autoDetectTechStack(manifests = {}) {
  const detected = new Set()

  const pkgContent = manifests['package.json'] || ''
  if (pkgContent) {
    try {
      const pkg = typeof pkgContent === 'string' ? JSON.parse(pkgContent) : pkgContent
      const allDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
        ...(pkg.peerDependencies || {})
      }
      if (allDeps['react']) detected.add('React')
      if (allDeps['vue']) detected.add('Vue')
      if (allDeps['@angular/core']) detected.add('Angular')
      if (allDeps['svelte']) detected.add('Svelte')
      if (allDeps['next']) detected.add('Next.js')
      if (allDeps['vite']) detected.add('Vite')
      if (allDeps['electron']) detected.add('Electron')
      if (allDeps['tailwindcss']) detected.add('TailwindCSS')
      if (allDeps['express']) detected.add('Express')
      if (allDeps['fastify']) detected.add('Fastify')
      if (allDeps['typescript'] || pkg.types || pkg.typings) detected.add('TypeScript')
      if (allDeps['monaco-editor'] || allDeps['@monaco-editor/react']) detected.add('Monaco Editor')
      if (allDeps['mermaid']) detected.add('Mermaid')
    } catch {}
  }

  const reqContent = (manifests['requirements.txt'] || manifests['pyproject.toml'] || '').toLowerCase()
  if (reqContent) {
    detected.add('Python')
    if (reqContent.includes('fastapi')) detected.add('FastAPI')
    if (reqContent.includes('flask')) detected.add('Flask')
    if (reqContent.includes('django')) detected.add('Django')
    if (reqContent.includes('pydantic')) detected.add('Pydantic')
    if (reqContent.includes('pytest')) detected.add('Pytest')
    if (reqContent.includes('torch') || reqContent.includes('pytorch')) detected.add('PyTorch')
    if (reqContent.includes('tensorflow')) detected.add('TensorFlow')
    if (reqContent.includes('uvicorn')) detected.add('Uvicorn')
  }

  if (manifests['Cargo.toml']) detected.add('Rust')
  if (manifests['go.mod']) detected.add('Go')
  if (manifests['Dockerfile'] || manifests['docker-compose.yml']) detected.add('Docker')

  return Array.from(detected)
}

/**
 * Format memory into concise text for prompt injection
 */
export function formatMemoryForPrompt(memory) {
  if (!memory) return ''
  const sections = []

  const projName = memory.projectName || 'Active Project'
  const stack = memory.profile?.techStack || []
  const summary = memory.profile?.summary || ''

  sections.push(`PROJECT: ${projName}`)
  if (stack.length > 0) {
    sections.push(`TECH STACK: ${stack.join(', ')}`)
  }
  if (summary) {
    sections.push(`OVERVIEW: ${summary}`)
  }

  if (memory.rules && memory.rules.length > 0) {
    sections.push(`USER RULES & PREFERENCES:\n${memory.rules.map(r => `• ${r}`).join('\n')}`)
  }

  if (memory.learnedFacts && memory.learnedFacts.length > 0) {
    sections.push(`PROJECT FACTS & DECISIONS:\n${memory.learnedFacts.map(f => `• ${f}`).join('\n')}`)
  }

  if (memory.recentSessions && memory.recentSessions.length > 0) {
    const recent = memory.recentSessions.slice(-3)
    sections.push(`RECENT WORK MILESTONES:\n${recent.map(s => `• ${s.summary || s}`).join('\n')}`)
  }

  if (sections.length === 0) return ''

  return `\n=== PERSISTENT PROJECT MEMORY ===\n${sections.join('\n\n')}\n=================================\n`
}

/**
 * Extract [MEMORY_ADD: <fact>] tags from LLM responses
 */
export function extractMemoryTags(replyText) {
  if (!replyText || typeof replyText !== 'string') return { cleanText: replyText || '', newFacts: [] }

  const newFacts = []
  const memoryRegex = /\[MEMORY_ADD:\s*([^\]]+)\]/gi
  let match
  while ((match = memoryRegex.exec(replyText)) !== null) {
    const fact = match[1].trim()
    if (fact) newFacts.push(fact)
  }

  const cleanText = replyText.replace(memoryRegex, '').trim()
  return { cleanText, newFacts }
}
