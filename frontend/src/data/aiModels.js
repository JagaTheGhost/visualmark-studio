/**
 * VisualMark Studio — Multi-Provider AI Model Registry
 * Central catalog of supported AI providers, models, capabilities, and key configurations.
 */

export const AI_PROVIDERS = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    shortName: 'Gemini',
    icon: 'auto_awesome',
    color: '#818cf8',
    keyStorageKey: 'visualmark_gemini_key',
    keyPlaceholder: 'AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://aistudio.google.com/app/apikey',
    keyHelp: 'Get a free Gemini API key from Google AI Studio',
    defaultModel: 'gemini-3.5-flash',
    models: [
      {
        id: 'gemini-3.5-flash',
        name: 'Gemini 3.5 Flash',
        shortName: '3.5 Flash',
        badge: 'Recommended',
        badgeColor: '#10b981',
        desc: 'Fast, intelligent, multimodal markdown and diagram synthesizer'
      },
      {
        id: 'gemini-3-flash-preview',
        name: 'Gemini 3 Flash Preview',
        shortName: '3 Flash preview',
        badge: 'Preview',
        badgeColor: '#818cf8',
        desc: 'High speed next-gen flash model'
      },
      {
        id: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash Lite',
        shortName: '3.1 Flash lite',
        badge: 'Ultra Fast',
        badgeColor: '#06b6d4',
        desc: 'Lightweight model with sub-second response times'
      }
    ]
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    shortName: 'OpenAI',
    icon: 'psychology',
    color: '#10a37f',
    keyStorageKey: 'visualmark_openai_key',
    keyPlaceholder: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://platform.openai.com/api-keys',
    keyHelp: 'API key from OpenAI Platform Console',
    defaultModel: 'gpt-4o-mini',
    models: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        shortName: 'GPT-4o Mini',
        badge: 'Fast & Efficient',
        badgeColor: '#10a37f',
        desc: 'High-speed, low-cost intelligence for documentation'
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        shortName: 'GPT-4o',
        badge: 'Flagship',
        badgeColor: '#8b5cf6',
        desc: 'Top-tier reasoning and deep architectural code analysis'
      }
    ]
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    shortName: 'Claude',
    icon: 'neurology',
    color: '#d97706',
    keyStorageKey: 'visualmark_anthropic_key',
    keyPlaceholder: 'sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://console.anthropic.com/settings/keys',
    keyHelp: 'API key from Anthropic Console',
    defaultModel: 'claude-3-5-sonnet-latest',
    models: [
      {
        id: 'claude-3-5-sonnet-latest',
        name: 'Claude 3.5 Sonnet',
        shortName: '3.5 Sonnet',
        badge: 'Best for Writing',
        badgeColor: '#d97706',
        desc: 'Unmatched prose quality, technical docs and code analysis'
      },
      {
        id: 'claude-3-5-haiku-latest',
        name: 'Claude 3.5 Haiku',
        shortName: '3.5 Haiku',
        badge: 'Rapid',
        badgeColor: '#f59e0b',
        desc: 'Lightning-fast responses for quick questions and snippets'
      }
    ]
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    shortName: 'Groq',
    icon: 'bolt',
    color: '#f97316',
    keyStorageKey: 'visualmark_groq_key',
    keyPlaceholder: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    keyLink: 'https://console.groq.com/keys',
    keyHelp: 'Free ultra-fast open-weights inference on Groq LPU',
    defaultModel: 'llama-3.3-70b-versatile',
    models: [
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B',
        shortName: 'Llama 3.3 70B',
        badge: 'Ultra Fast',
        badgeColor: '#f97316',
        desc: 'Meta Llama 3.3 running at 300+ tokens/sec on LPUs'
      },
      {
        id: 'deepseek-r1-distill-llama-70b',
        name: 'DeepSeek R1 (70B)',
        shortName: 'DeepSeek R1',
        badge: 'Deep Reasoning',
        badgeColor: '#6366f1',
        desc: 'DeepSeek reasoning model distilled on Llama architecture'
      }
    ]
  },
  ollama: {
    id: 'ollama',
    name: 'Ollama (Local Offline)',
    shortName: 'Ollama',
    icon: 'dns',
    color: '#06b6d4',
    keyStorageKey: 'visualmark_ollama_url',
    keyPlaceholder: 'http://localhost:11434',
    keyLink: 'https://ollama.com',
    keyHelp: '100% offline & local. No API key or internet required.',
    defaultModel: 'llama3.2',
    isLocal: true,
    models: [
      {
        id: 'llama3.2',
        name: 'Llama 3.2 (Local)',
        shortName: 'Llama 3.2',
        badge: 'Offline',
        badgeColor: '#06b6d4',
        desc: 'Local Meta model running natively on your hardware'
      },
      {
        id: 'qwen2.5',
        name: 'Qwen 2.5 (Local)',
        shortName: 'Qwen 2.5',
        badge: 'Offline',
        badgeColor: '#06b6d4',
        desc: 'Exceptional local markdown and code formatting model'
      },
      {
        id: 'mistral',
        name: 'Mistral 7B (Local)',
        shortName: 'Mistral 7B',
        badge: 'Offline',
        badgeColor: '#06b6d4',
        desc: 'Popular lightweight general-purpose local model'
      }
    ]
  }
}

export const DEFAULT_PROVIDER_ID = 'gemini'
export const DEFAULT_MODEL_ID = 'gemini-3.5-flash'

/**
 * Find model details across all providers.
 */
export function getModelInfo(modelId) {
  if (!modelId) {
    const defaultM = AI_PROVIDERS.gemini.models[0]
    return {
      ...defaultM,
      shortName: defaultM.shortName || defaultM.name,
      provider: 'gemini',
      providerName: AI_PROVIDERS.gemini.name,
      providerShortName: AI_PROVIDERS.gemini.shortName,
      providerIcon: AI_PROVIDERS.gemini.icon,
      providerColor: AI_PROVIDERS.gemini.color
    }
  }
  for (const provider of Object.values(AI_PROVIDERS)) {
    const found = provider.models.find((m) => m.id === modelId)
    if (found) {
      return {
        ...found,
        shortName: found.shortName || found.name,
        provider: provider.id,
        providerName: provider.name,
        providerShortName: provider.shortName,
        providerIcon: provider.icon,
        providerColor: provider.color
      }
    }
  }
  // Fallback if model ID is unrecognized
  return {
    id: modelId,
    name: modelId,
    shortName: modelId,
    badge: 'Custom',
    badgeColor: '#64748b',
    desc: 'Custom model',
    provider: 'gemini',
    providerName: 'Google Gemini',
    providerShortName: 'Gemini',
    providerIcon: 'auto_awesome',
    providerColor: '#818cf8'
  }
}

/**
 * Returns provider configuration by ID or auto-detected from model ID.
 */
export function getProviderForModel(modelId, providerId = null) {
  if (providerId && AI_PROVIDERS[providerId]) {
    return AI_PROVIDERS[providerId]
  }
  if (!modelId) return AI_PROVIDERS.gemini
  for (const provider of Object.values(AI_PROVIDERS)) {
    if (provider.models.some((m) => m.id === modelId)) {
      return provider
    }
  }
  if (modelId.startsWith('gpt-')) return AI_PROVIDERS.openai
  if (modelId.startsWith('claude-')) return AI_PROVIDERS.anthropic
  if (modelId.startsWith('llama-') || modelId.startsWith('deepseek-')) return AI_PROVIDERS.groq
  return AI_PROVIDERS.gemini
}

// In-memory cache of backend environment-configured providers
let backendProviderStatus = {}

export function setBackendProviderStatus(status) {
  backendProviderStatus = status || {}
}

export function isBackendProviderConfigured(providerId) {
  return Boolean(backendProviderStatus[providerId])
}

/**
 * Checks if a specific provider has a valid key configured in localStorage or backend.
 */
export function hasProviderKey(providerId) {
  if (typeof window === 'undefined' || !window.localStorage) return false
  const provider = AI_PROVIDERS[providerId]
  if (!provider) return false
  if (provider.isLocal) {
    // For Ollama, having it enabled in localStorage is valid
    return window.localStorage.getItem('visualmark_ollama_enabled') === 'true'
  }
  const key = window.localStorage.getItem(provider.keyStorageKey)
  if (key && key.trim()) return true
  // Also check if legacy gemini key is set
  if (providerId === 'gemini') {
    const legacyKey = window.localStorage.getItem('visualmark_gemini_key')
    if (legacyKey && legacyKey.trim()) return true
  }
  if (backendProviderStatus && backendProviderStatus[providerId]) {
    return true
  }
  return false
}

/**
 * Checks if ANY provider has a key configured.
 */
export function hasAnyProviderConfigured() {
  if (typeof window === 'undefined' || !window.localStorage) return false
  return Object.keys(AI_PROVIDERS).some((pId) => {
    return hasProviderKey(pId)
  })
}

/**
 * Retrieves the stored API key or base URL for a given provider.
 */
export function getStoredKeyForProvider(providerId) {
  if (typeof window === 'undefined' || !window.localStorage) return ''
  const provider = AI_PROVIDERS[providerId]
  if (!provider) return ''
  return (window.localStorage.getItem(provider.keyStorageKey) || '').trim()
}

export const USAGE_LEDGER_KEY = 'visualmark_ai_usage_ledger'
export const USAGE_STATS_KEY = 'visualmark_ai_usage_stats'

export const PROVIDER_QUOTAS = {
  gemini: {
    fiveHourLimit: 250,    // 250 requests per 5h window
    weeklyLimit: 3500      // 3500 requests per 7d window
  },
  openai: {
    fiveHourLimit: 200,    // 200 requests per 5h window
    weeklyLimit: 2500      // 2500 requests per 7d window
  },
  anthropic: {
    fiveHourLimit: 150,    // 150 requests per 5h window
    weeklyLimit: 2000      // 2000 requests per 7d window
  },
  groq: {
    fiveHourLimit: 300,    // 300 requests per 5h window
    weeklyLimit: 4000      // 4000 requests per 7d window
  },
  claudeGpt: {
    fiveHourLimit: 150,    // 150 requests per 5h window (legacy)
    weeklyLimit: 2000      // 2000 requests per 7d window (legacy)
  }
}

function formatCountdown(ms) {
  if (ms <= 0) return 'Ready'
  const totalMinutes = Math.floor(ms / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${Math.max(1, minutes)}m`
}

/**
 * Dynamic AI Quota & Limits usage tracking based on genuine API ledger
 */
export function getAIUsageStats() {
  const emptyStats = {
    isConfigured: false,
    weeklyLeft: null,
    fiveHourLeft: null,
    weeklyReset: 'Ready',
    fiveHourReset: 'Ready',
    requests5h: 0,
    requestsWeekly: 0
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      gemini: { ...emptyStats },
      openai: { ...emptyStats },
      anthropic: { ...emptyStats },
      groq: { ...emptyStats },
      ollama: { ...emptyStats },
      claudeGpt: { ...emptyStats }
    }
  }

  const geminiConfigured = hasProviderKey('gemini')
  const openaiConfigured = hasProviderKey('openai')
  const anthropicConfigured = hasProviderKey('anthropic')
  const groqConfigured = hasProviderKey('groq')
  const ollamaConfigured = hasProviderKey('ollama')
  const claudeGptConfigured = anthropicConfigured || openaiConfigured || groqConfigured

  let ledger = []
  try {
    const raw = window.localStorage.getItem(USAGE_LEDGER_KEY)
    if (raw) {
      ledger = JSON.parse(raw)
      if (!Array.isArray(ledger)) ledger = []
    }
  } catch {
    ledger = []
  }

  const now = Date.now()
  const FIVE_HOURS_MS = 5 * 60 * 60 * 1000
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

  // Filter within 7-day window
  const recentLedger = ledger.filter((item) => (now - item.timestamp) < SEVEN_DAYS_MS)
  if (recentLedger.length !== ledger.length) {
    try {
      window.localStorage.setItem(USAGE_LEDGER_KEY, JSON.stringify(recentLedger))
    } catch {}
  }

  const calculateGroup = (providers, quota, isConfigured) => {
    if (!isConfigured) {
      return {
        isConfigured: false,
        weeklyLeft: null,
        fiveHourLeft: null,
        weeklyReset: 'Configure in Settings',
        fiveHourReset: 'Configure in Settings',
        requests5h: 0,
        requestsWeekly: 0,
        tokens5h: 0,
        tokensWeekly: 0
      }
    }

    const groupCalls = recentLedger.filter((item) => providers.includes(item.provider))
    const calls5h = groupCalls.filter((item) => (now - item.timestamp) < FIVE_HOURS_MS)
    const callsWeekly = groupCalls

    const tokens5h = calls5h.reduce((acc, c) => acc + (c.totalTokens || 0), 0)
    const tokensWeekly = callsWeekly.reduce((acc, c) => acc + (c.totalTokens || 0), 0)

    const reqCount5h = calls5h.length
    const reqCountWeekly = callsWeekly.length

    // Percentage left calculation
    let fiveHourLeft = Math.max(0, Math.round(100 - (reqCount5h / quota.fiveHourLimit) * 100))
    let weeklyLeft = Math.max(0, Math.round(100 - (reqCountWeekly / quota.weeklyLimit) * 100))

    // If server returned rate limit headers, use them for high-precision synchronization
    const latestWithRateLimit = [...groupCalls].reverse().find(c => c.rateLimits && c.rateLimits.remaining_requests != null)
    if (latestWithRateLimit?.rateLimits?.remaining_requests != null) {
      const rem = Number(latestWithRateLimit.rateLimits.remaining_requests)
      const lim = Number(latestWithRateLimit.rateLimits.limit_requests || 15)
      if (lim > 0) {
        fiveHourLeft = Math.max(0, Math.min(100, Math.round((rem / lim) * 100)))
      }
    }

    let fiveHourReset = 'Ready'
    if (calls5h.length > 0) {
      const oldest5h = Math.min(...calls5h.map((c) => c.timestamp))
      const timeRemaining = (oldest5h + FIVE_HOURS_MS) - now
      fiveHourReset = formatCountdown(Math.max(0, timeRemaining))
    }

    let weeklyReset = 'Ready'
    if (callsWeekly.length > 0) {
      const oldestWeekly = Math.min(...callsWeekly.map((c) => c.timestamp))
      const timeRemaining = (oldestWeekly + SEVEN_DAYS_MS) - now
      weeklyReset = formatCountdown(Math.max(0, timeRemaining))
    }

    return {
      isConfigured: true,
      weeklyLeft,
      weeklyReset,
      fiveHourLeft,
      fiveHourReset,
      requests5h: reqCount5h,
      requestsWeekly: reqCountWeekly,
      tokens5h,
      tokensWeekly
    }
  }

  const ollamaCalls = recentLedger.filter((item) => ['ollama', 'local'].includes(item.provider))
  const ollamaCalls5h = ollamaCalls.filter((item) => (now - item.timestamp) < FIVE_HOURS_MS)

  return {
    gemini: calculateGroup(['gemini', 'google'], PROVIDER_QUOTAS.gemini, geminiConfigured),
    openai: calculateGroup(['openai', 'chatgpt', 'gpt'], PROVIDER_QUOTAS.openai, openaiConfigured),
    anthropic: calculateGroup(['anthropic', 'claude'], PROVIDER_QUOTAS.anthropic, anthropicConfigured),
    groq: calculateGroup(['groq'], PROVIDER_QUOTAS.groq, groqConfigured),
    ollama: {
      isConfigured: ollamaConfigured,
      isLocal: true,
      unlimited: true,
      requests5h: ollamaCalls5h.length,
      requestsWeekly: ollamaCalls.length
    },
    claudeGpt: calculateGroup(['anthropic', 'openai', 'groq', 'claude'], PROVIDER_QUOTAS.claudeGpt, claudeGptConfigured)
  }
}

/**
 * Record genuine AI usage on each completed API call.
 */
export function recordAIUsage(param = 'gemini') {
  if (typeof window === 'undefined' || !window.localStorage) return

  let opts = {}
  if (typeof param === 'string') {
    opts = { provider: param }
  } else if (param && typeof param === 'object') {
    opts = param
  }

  let provider = (opts.provider || 'gemini').toLowerCase()
  if (provider === 'claude') provider = 'anthropic'
  const model = opts.model || ''
  const promptTokens = opts.promptTokens || opts.usage?.prompt_tokens || 0
  const completionTokens = opts.completionTokens || opts.usage?.completion_tokens || 0
  const totalTokens = opts.totalTokens || opts.usage?.total_tokens || (promptTokens + completionTokens) || 250
  const action = opts.action || 'chat'
  const rateLimits = opts.rateLimits || opts.usage || null

  try {
    let ledger = []
    const raw = window.localStorage.getItem(USAGE_LEDGER_KEY)
    if (raw) {
      ledger = JSON.parse(raw)
      if (!Array.isArray(ledger)) ledger = []
    }

    ledger.push({
      id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      provider,
      model,
      promptTokens,
      completionTokens,
      totalTokens,
      action,
      rateLimits: rateLimits ? {
        remaining_requests: rateLimits.ratelimit_remaining_requests || rateLimits.remaining_requests,
        remaining_tokens: rateLimits.ratelimit_remaining_tokens || rateLimits.remaining_tokens,
        reset_requests: rateLimits.ratelimit_reset || rateLimits.reset_requests
      } : null
    })

    window.localStorage.setItem(USAGE_LEDGER_KEY, JSON.stringify(ledger))
    const stats = getAIUsageStats()
    window.localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(stats))
    window.dispatchEvent(new CustomEvent('visualmark:ai-usage-updated', { detail: stats }))
    return stats
  } catch (err) {
    console.warn('Failed to record AI usage in ledger:', err)
  }
}

