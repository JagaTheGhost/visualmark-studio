/**
 * Image URL normalization, auto-resolution, and heuristic helpers.
 * Converts Google Drive, GitHub blob, Dropbox, Imgur, and Google Image Search
 * URLs into direct renderable image asset URLs, and resolves redirect shortlinks.
 */

import { getApiUrl } from './apiClient'

// In-memory cache for resolved image URLs
const resolvedUrlCache = new Map()

/**
 * Perform synchronous heuristic transformations on known image hosting patterns.
 */
export function getOptimizedImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return ''
  const trimmed = rawUrl.trim()
  if (trimmed.startsWith('data:')) {
    // Strip accidental whitespace or newlines from wrapped base64 data URIs
    return trimmed.replace(/[\r\n\t]/g, '')
  }

  // Remove newline/carriage returns and collapse accidental spaces around delimiters and inside queries
  let sanitized = trimmed
    .replace(/[\r\n\t]+/g, '')
    .replace(/\s*([?&=,])\s*/g, (m, p1) => p1)

  // Encode remaining literal spaces (common in wrapped query params or titles)
  if (sanitized.includes(' ') && (sanitized.startsWith('http://') || sanitized.startsWith('https://'))) {
    sanitized = sanitized.replace(/ +/g, '%20')
  }

  try {
    const urlObj = new URL(sanitized)

    // 1. Google Image Search URL containing imgurl parameter
    // Example: https://www.google.com/imgres?imgurl=https%3A%2F%2F...
    if (urlObj.searchParams.has('imgurl')) {
      const extracted = urlObj.searchParams.get('imgurl')
      if (extracted) return decodeURIComponent(extracted)
    }

    // 2. Google Drive preview / view / open links
    // Example: https://drive.google.com/file/d/1a2b3c4d5e/view?usp=sharing
    // Example: https://drive.google.com/open?id=1a2b3c4d5e
    if (urlObj.hostname.includes('drive.google.com')) {
      let fileId = urlObj.searchParams.get('id')
      if (!fileId) {
        const fileMatch = urlObj.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
        if (fileMatch) fileId = fileMatch[1]
      }
      if (fileId) {
        // High-res direct image thumbnail endpoint
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`
      }
    }

    // 3. GitHub repository blob URLs (which return HTML view instead of raw image)
    // Example: https://github.com/user/repo/blob/main/docs/logo.png
    if (urlObj.hostname === 'github.com' && urlObj.pathname.includes('/blob/')) {
      return trimmed
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/')
    }

    // 4. Dropbox shared link
    // Example: https://www.dropbox.com/s/xyz123/banner.png?dl=0
    if (urlObj.hostname.includes('dropbox.com')) {
      urlObj.searchParams.set('raw', '1')
      urlObj.searchParams.delete('dl')
      return urlObj.toString()
    }

    // 5. Imgur gallery / direct link without extension
    // Example: https://imgur.com/aBcdEf
    if (urlObj.hostname === 'imgur.com' && !urlObj.pathname.includes('.')) {
      const id = urlObj.pathname.replace(/^\//, '')
      if (id && !id.includes('/')) {
        return `https://i.imgur.com/${id}.png`
      }
    }

    // 6. Giphy page URL
    // Example: https://giphy.com/gifs/cat-funny-3o7btPCcdNniyf0ArS
    if (urlObj.hostname.includes('giphy.com') && urlObj.pathname.includes('/gifs/')) {
      const parts = urlObj.pathname.split('-')
      const gifId = parts[parts.length - 1]
      if (gifId && /^[a-zA-Z0-9]+$/.test(gifId)) {
        return `https://media.giphy.com/media/${gifId}/giphy.gif`
      }
    }

    // 7. Unsplash photo page
    // Example: https://unsplash.com/photos/abc-123
    if (urlObj.hostname === 'unsplash.com' && urlObj.pathname.includes('/photos/')) {
      const photoIdMatch = urlObj.pathname.match(/\/photos\/([a-zA-Z0-9_-]+)/)
      if (photoIdMatch) {
        return `https://images.unsplash.com/photo-${photoIdMatch[1]}?auto=format&fit=crop&w=1200&q=80`
      }
    }
  } catch {
    // If invalid URL, return original trimmed string
  }

  return trimmed
}

/**
 * Check if a URL requires asynchronous redirect resolution (e.g., share.google links).
 */
export function requiresAsyncResolution(url) {
  if (!url || typeof url !== 'string' || url.startsWith('data:')) return false
  const lower = url.toLowerCase()
  return (
    lower.includes('share.google') ||
    lower.includes('bit.ly') ||
    lower.includes('tinyurl.com') ||
    lower.includes('t.co') ||
    lower.includes('goo.gl')
  )
}

/**
 * Asynchronously resolve redirect shortlinks (such as share.google) to direct image URLs.
 */
export async function resolveRedirectImageUrl(url, apiBaseUrl = '') {
  if (!url) return url
  const optimized = getOptimizedImageUrl(url)
  if (!requiresAsyncResolution(optimized)) {
    return optimized
  }

  if (resolvedUrlCache.has(optimized)) {
    return resolvedUrlCache.get(optimized)
  }

  try {
    const endpoint = apiBaseUrl ? `${apiBaseUrl}/resolve-image` : await getApiUrl('/api/resolve-image')
    const fullUrl = `${endpoint}?url=${encodeURIComponent(optimized)}`
    const res = await fetch(fullUrl)
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.direct_url) {
        resolvedUrlCache.set(optimized, data.direct_url)
        return data.direct_url
      }
    }
  } catch (err) {
    console.warn('Failed to resolve redirect image URL:', err)
  }

  return optimized
}
