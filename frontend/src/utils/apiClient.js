/**
 * README Studio - API Client & Dynamic Backend Resolver
 * Handles transparent connection resolution across Electron Desktop and Web modes.
 */
import axios from 'axios'

let cachedBaseUrl = null

/**
 * Resolve the active backend base URL.
 * Automatically queries Electron contextBridge IPC or falls back to Vite env.
 */
export async function resolveApiBaseUrl() {
  if (cachedBaseUrl !== null) {
    return cachedBaseUrl
  }

  // 1. Electron Native Desktop IPC
  if (typeof window !== 'undefined' && window.electronAPI && typeof window.electronAPI.getBackendUrl === 'function') {
    try {
      const electronUrl = await window.electronAPI.getBackendUrl()
      if (electronUrl) {
        cachedBaseUrl = electronUrl.replace(/\/$/, '')
        return cachedBaseUrl
      }
    } catch (err) {
      console.warn('[ApiClient] Failed to retrieve backend URL via Electron IPC:', err)
    }
  }

  // 2. Vite environment variable
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || ''
  if (envUrl) {
    cachedBaseUrl = envUrl.replace(/\/$/, '')
    return cachedBaseUrl
  }

  // 3. Web fallback (relative proxy via Vite or production reverse proxy)
  cachedBaseUrl = ''
  return cachedBaseUrl
}

/**
 * Get full API endpoint URL for a given route.
 * E.g. getApiUrl('/api/generate-readme') -> 'http://127.0.0.1:8000/api/generate-readme'
 */
export async function getApiUrl(route) {
  const base = await resolveApiBaseUrl()
  const cleanRoute = route.startsWith('/') ? route : `/${route}`
  return base ? `${base}${cleanRoute}` : cleanRoute
}

/**
 * Standard HTTP POST helper with automated URL resolution.
 */
export async function apiPost(route, data, config = {}) {
  const url = await getApiUrl(route)
  return axios.post(url, data, config)
}

/**
 * Standard HTTP GET helper with automated URL resolution.
 */
export async function apiGet(route, config = {}) {
  const url = await getApiUrl(route)
  return axios.get(url, config)
}
