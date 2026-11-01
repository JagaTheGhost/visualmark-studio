/**
 * Media Detection, Resolution & Embedding Utilities
 * Supports HTML5 Video, Audio, Animated GIFs, and secure Video Embeds.
 */

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'ogv', 'mov', 'm4v', 'mkv']
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac']

/**
 * Checks whether a URL, data URI, or file path represents a video resource.
 */
export function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.replace(/[\r\n\t]/g, '').trim()
  if (!trimmed) return false

  if (trimmed.startsWith('data:video/')) return true

  // Also consider YouTube / Vimeo embeds as video
  if (parseVideoEmbed(trimmed)) return true

  const cleanPath = trimmed.split('?')[0].split('#')[0].toLowerCase()
  const ext = cleanPath.split('.').pop()
  return VIDEO_EXTENSIONS.includes(ext)
}

/**
 * Checks whether a URL, data URI, or file path represents an audio resource.
 */
export function isAudioUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.replace(/[\r\n\t]/g, '').trim()
  if (!trimmed) return false

  if (trimmed.startsWith('data:audio/')) return true

  const cleanPath = trimmed.split('?')[0].split('#')[0].toLowerCase()
  const ext = cleanPath.split('.').pop()
  return AUDIO_EXTENSIONS.includes(ext)
}

/**
 * Checks whether a URL, data URI, or file path represents an animated GIF.
 */
export function isGifUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.replace(/[\r\n\t]/g, '').trim()
  if (!trimmed) return false

  if (trimmed.startsWith('data:image/gif')) return true

  const cleanPath = trimmed.split('?')[0].split('#')[0].toLowerCase()
  return cleanPath.endsWith('.gif')
}

/**
 * Returns the MIME type for a given media URL or filename.
 */
export function getMediaMimeType(url) {
  if (!url || typeof url !== 'string') return 'application/octet-stream'
  const cleanPath = url.split('?')[0].split('#')[0].toLowerCase()
  const ext = cleanPath.split('.').pop()

  const mimeMap = {
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    ogv: 'video/ogg',
    mov: 'video/quicktime',
    m4v: 'video/mp4',
    mkv: 'video/x-matroska',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    oga: 'audio/ogg',
    m4a: 'audio/mp4',
    aac: 'audio/aac',
    flac: 'audio/flac',
    gif: 'image/gif',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    svg: 'image/svg+xml'
  }

  return mimeMap[ext] || 'application/octet-stream'
}

/**
 * Resolves relative workspace paths (e.g. assets/demo.mp4) to an absolute disk path.
 * Strips query parameters, hashes, and handles active document directory.
 */
export function resolveLocalMediaPath(relativePath, workspaceDirectory, activeFile = '') {
  if (!relativePath || typeof relativePath !== 'string') return null
  if (/^(https?:|\/\/|data:|blob:)/i.test(relativePath)) return null

  let clean = relativePath.split('?')[0].split('#')[0].trim()
  try {
    clean = decodeURIComponent(clean)
  } catch {}

  // Absolute Windows (C:\...) or Unix (/...) path
  if (/^[a-zA-Z]:[\\/]/.test(clean) || clean.startsWith('/')) {
    return clean
  }

  const cleanRel = clean.replace(/^\.[\\/]/, '')
  const wsPath = workspaceDirectory?.path || (typeof workspaceDirectory === 'string' ? workspaceDirectory : null)

  // If activeFile is provided and has a subdirectory, resolve relative to activeFile's folder
  if (activeFile && typeof activeFile === 'string') {
    const cleanActive = activeFile.split('?')[0].split('#')[0].replace(/\\/g, '/')
    const lastSlash = cleanActive.lastIndexOf('/')
    if (lastSlash !== -1) {
      const activeDir = cleanActive.slice(0, lastSlash)
      if (wsPath) {
        const sep = wsPath.includes('\\') ? '\\' : '/'
        const normalizedWs = wsPath.replace(/[\\/]+$/, '')
        const combinedRel = `${activeDir}/${cleanRel}`.replace(/[\\/]+/g, sep)
        return `${normalizedWs}${sep}${combinedRel}`
      }
    }
  }

  if (wsPath) {
    const sep = wsPath.includes('\\') ? '\\' : '/'
    const normalizedWs = wsPath.replace(/[\\/]+$/, '')
    const normalizedRel = cleanRel.replace(/[\\/]+/g, sep)
    return `${normalizedWs}${sep}${normalizedRel}`
  }

  // Fallback: return clean relative path so Electron IPC can check activeWorkspaces directly
  return cleanRel
}

/**
 * Extracts embed details for popular video services (YouTube, Vimeo, Loom).
 * Extremely resilient against query params, shorts, share links, and embed formats.
 */
export function parseVideoEmbed(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null

  // 1. YouTube (youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/..., youtube.com/shorts/...)
  try {
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
      let videoId = ''
      if (parsed.hostname.includes('youtu.be')) {
        videoId = parsed.pathname.slice(1).split('/')[0].split('?')[0]
      } else if (parsed.searchParams.has('v')) {
        videoId = parsed.searchParams.get('v')
      } else if (parsed.pathname.includes('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0]
      } else if (parsed.pathname.includes('/shorts/')) {
        videoId = parsed.pathname.split('/shorts/')[1]?.split('/')[0]?.split('?')[0]
      }
      if (videoId && /^[a-zA-Z0-9_-]+$/.test(videoId)) {
        return {
          type: 'youtube',
          videoId,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
          originalUrl: trimmed
        }
      }
    }
  } catch {}

  // 2. Vimeo (vimeo.com/123456789 or player.vimeo.com/video/123456789)
  try {
    if (trimmed.includes('vimeo.com')) {
      const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/)
      if (vimeoMatch && vimeoMatch[1]) {
        return {
          type: 'vimeo',
          videoId: vimeoMatch[1],
          embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`,
          originalUrl: trimmed
        }
      }
    }
  } catch {}

  // 3. Loom (loom.com/share/... or loom.com/embed/...)
  try {
    if (trimmed.includes('loom.com')) {
      const loomMatch = trimmed.match(/(?:loom\.com\/(?:share|embed)\/)([a-zA-Z0-9]+)/)
      if (loomMatch && loomMatch[1]) {
        return {
          type: 'loom',
          videoId: loomMatch[1],
          embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
          originalUrl: trimmed
        }
      }
    }
  } catch {}

  return null
}

/**
 * Checks whether an iframe src originates from a trusted video/embed host.
 */
export function isSafeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`)
    const hostname = parsed.hostname.toLowerCase()
    const allowedHosts = [
      'youtube.com',
      'www.youtube.com',
      'youtube-nocookie.com',
      'www.youtube-nocookie.com',
      'youtu.be',
      'vimeo.com',
      'player.vimeo.com',
      'loom.com',
      'www.loom.com',
      'codepen.io'
    ]
    return allowedHosts.some((allowed) => hostname === allowed || hostname.endsWith('.' + allowed))
  } catch {
    return false
  }
}
