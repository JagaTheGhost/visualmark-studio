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
        badge: 'Recommended',
        badgeColor: '#10b981',
        desc: 'Fast, intelligent, multimodal markdown and diagram synthesizer'
      },
      {
        id: 'gemini-3-flash-preview',
        name: 'Gemini 3 Flash Preview',
        badge: 'Preview',
        badgeColor: '#818cf8',
        desc: 'High speed next-gen flash model'
      },
      {
        id: 'gemini-3.1-flash-lite',
        name: 'Gemini 3.1 Flash Lite',
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
        badge: 'Fast & Efficient',
        badgeColor: '#10a37f',
        desc: 'High-speed, low-cost intelligence for documentation'
      },
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
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
        badge: 'Best for Writing',
        badgeColor: '#d97706',
        desc: 'Unmatched prose quality, technical docs and code analysis'
      },
      {
        id: 'claude-3-5-haiku-latest',
        name: 'Claude 3.5 Haiku',
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
        badge: 'Ultra Fast',
        badgeColor: '#f97316',
        desc: 'Meta Llama 3.3 running at 300+ tokens/sec on LPUs'
      },
      {
        id: 'deepseek-r1-distill-llama-70b',
        name: 'DeepSeek R1 (70B)',
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
        badge: 'Offline',
        badgeColor: '#06b6d4',
        desc: 'Local Meta model running natively on your hardware'
      },
      {
        id: 'qwen2.5',
        name: 'Qwen 2.5 (Local)',
        badge: 'Offline',
        badgeColor: '#06b6d4',
        desc: 'Exceptional local markdown and code formatting model'
      },
      {
        id: 'mistral',
        name: 'Mistral 7B (Local)',
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
  if (!modelId) return AI_PROVIDERS.gemini.models[0]
  for (const provider of Object.values(AI_PROVIDERS)) {
    const found = provider.models.find((m) => m.id === modelId)
    if (found) {
      return { ...found, provider: provider.id, providerName: provider.name, providerIcon: provider.icon, providerColor: provider.color }
    }
  }
  // Fallback if model ID is unrecognized
  return {
    id: modelId,
    name: modelId,
    badge: 'Custom',
    badgeColor: '#64748b',
    desc: 'Custom model',
    provider: 'gemini',
    providerName: 'Google Gemini',
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

/**
 * Checks if a specific provider has a valid key configured in localStorage.
 */
export function hasProviderKey(providerId) {
  if (typeof window === 'undefined' || !window.localStorage) return false
  const provider = AI_PROVIDERS[providerId]
  if (!provider) return false
  if (provider.isLocal) {
    // For Ollama, having it enabled or having a URL is valid
    return true
  }
  const key = window.localStorage.getItem(provider.keyStorageKey)
  return Boolean(key && key.trim())
}

/**
 * Checks if ANY provider has a key configured.
 */
export function hasAnyProviderConfigured() {
  if (typeof window === 'undefined' || !window.localStorage) return false
  return Object.keys(AI_PROVIDERS).some((pId) => {
    if (AI_PROVIDERS[pId].isLocal) {
      return window.localStorage.getItem('visualmark_ollama_enabled') === 'true'
    }
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

