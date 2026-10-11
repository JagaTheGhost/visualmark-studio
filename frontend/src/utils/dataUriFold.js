/**
 * Data URI Vault & Folding Utility
 * Folds long data URIs (>120 chars) into compact, single-line tokens with interactive ellipsis markers.
 * Automatically persists full assets in memory and localStorage so preview, exports, and copies are never corrupted.
 */

const STORAGE_KEY = 'readme_data_uri_vault';

// In-memory vault cache
const vault = new Map();

// Initialize vault from localStorage if available
function initVault() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([k, v]) => {
        if (typeof v === 'string') vault.set(k, v);
      });
    }
  } catch (err) {
    console.warn('Failed to load dataUriVault from localStorage:', err);
  }
}

initVault();

function persistVault() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const obj = {};
    // Cap vault at 100 entries to prevent localStorage quota issues
    const entries = Array.from(vault.entries()).slice(-100);
    entries.forEach(([k, v]) => {
      obj[k] = v;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (err) {
    console.warn('Failed to persist dataUriVault to localStorage:', err);
  }
}

/**
 * Fast string hash
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).slice(0, 8);
}

/**
 * Formats byte size into human readable string (e.g. "4.2kB")
 */
export function formatByteSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  return `${(bytes / 1024).toFixed(1)}kB`;
}

/**
 * Folds long data URIs (> minLength chars) in a markdown string into compact tokens.
 * Matches:
 *  - HTML attributes: src="data:image/..." or src='data:image/...'
 *  - Markdown images: ![alt](data:image/...)
 *  - CSS / SVG url(data:image/...)
 */
export function foldDataUris(markdown, options = {}) {
  if (!markdown || typeof markdown !== 'string') return markdown || '';
  const minLength = options.minLength || 120;

  // Unfold any existing tokens first to normalize the string
  const source = unfoldDataUris(markdown);

  let changed = false;

  const foldUri = (prefix, rawUri, suffix) => {
    // Clean internal line breaks / tabs created by word wrapping
    const cleanUri = rawUri.replace(/[\r\n\t]/g, '').trim();
    if (cleanUri.length < minLength) {
      return `${prefix}${rawUri}${suffix}`;
    }

    const id = 'v_' + hashString(cleanUri);
    vault.set(id, cleanUri);
    changed = true;

    const sizeStr = formatByteSize(cleanUri.length);

    // Keep prefix (~32 chars) and suffix (~12 chars)
    const head = cleanUri.slice(0, 32);
    const tail = cleanUri.slice(-12);
    const token = `${head}...[··· ${sizeStr} #${id}]...${tail}`;

    return `${prefix}${token}${suffix}`;
  };

  // 1. Double-quoted attributes: src="..." or href="..." or url("...")
  let result = source.replace(/(src="|href="|url\(")(data:image\/(?:svg\+xml|png|jpeg|webp|gif|avif)[^"]+)(")/gi, (m, p1, uri, p3) => {
    return foldUri(p1, uri, p3);
  });

  // 2. Single-quoted attributes: src='...' or href='...' or url('...')
  result = result.replace(/(src='|href='|url\(')(data:image\/(?:svg\+xml|png|jpeg|webp|gif|avif)[^']+)(')/gi, (m, p1, uri, p3) => {
    return foldUri(p1, uri, p3);
  });

  // 3. Markdown images / links: ![alt](data:image/...) or url(data:image/...)
  result = result.replace(/(\()(data:image\/(?:svg\+xml|png|jpeg|webp|gif|avif)[^)\s]+)(\))/gi, (m, p1, uri, p3) => {
    return foldUri(p1, uri, p3);
  });

  if (changed) {
    persistVault();
  }

  return result;
}

/**
 * Unfolds all fold tokens in markdown back into their full, original data URIs.
 * Used for live preview rendering, copy to clipboard, and file downloads.
 */
export function unfoldDataUris(markdown) {
  if (!markdown || typeof markdown !== 'string') return markdown || '';

  const foldTokenRegex = /data:image\/[a-zA-Z0-9%_\+\-;=,]*?\.\.\.\[(?:···\s*)?[^#\]]+#([a-zA-Z0-9_]+)\]\.\.\.[a-zA-Z0-9%_\+\-;=]*/g;

  return markdown.replace(foldTokenRegex, (match, id) => {
    if (vault.has(id)) {
      return vault.get(id);
    }
    return match;
  });
}

/**
 * Expands a single folded token by its vault ID to full text in the editor buffer
 */
export function expandSingleVaultToken(markdown, targetId) {
  if (!markdown || !targetId || !vault.has(targetId)) return markdown;
  const targetRegex = new RegExp(`data:image\\/[a-zA-Z0-9%_\\+\\-\\;=,]*?\\.\\.\\.\\[(?:···\\s*)?[^#\\]]+#${targetId}\\]\\.\\.\\.[a-zA-Z0-9%_\\+\\-\\;=]*`, 'g');
  return markdown.replace(targetRegex, vault.get(targetId));
}

/**
 * Collapses a specific full data URI in markdown back into a folded token
 */
export function collapseSingleDataUri(markdown, targetUri) {
  if (!markdown || !targetUri) return markdown;
  const cleanUri = targetUri.replace(/[\r\n\t]/g, '').trim();
  const id = 'v_' + hashString(cleanUri);
  vault.set(id, cleanUri);
  persistVault();

  const sizeStr = formatByteSize(cleanUri.length);
  const head = cleanUri.slice(0, 32);
  const tail = cleanUri.slice(-12);
  const token = `${head}...[··· ${sizeStr} #${id}]...${tail}`;

  return markdown.split(cleanUri).join(token);
}

/**
 * Returns full URI by vault ID
 */
export function getVaultDataUri(id) {
  return vault.get(id) || null;
}

/**
 * Check if text contains any folded tokens
 */
export function hasFoldedTokens(markdown) {
  if (!markdown || typeof markdown !== 'string') return false;
  return /data:image\/[a-zA-Z0-9%_\+\-;=,]*?\.\.\.\[(?:···\s*)?[^#\]]+#([a-zA-Z0-9_]+)\]\.\.\./.test(markdown);
}

/**
 * Check if markdown contains any unfold/raw long data URIs (> minLength chars)
 */
export function hasLongDataUris(markdown, minLength = 120) {
  if (!markdown || typeof markdown !== 'string') return false;
  const regex = /(?:src="|href="|url\(")(data:image\/(?:svg\+xml|png|jpeg|webp|gif|avif)[^"]+)(")|(?:src='|href='|url\(')(data:image\/(?:svg\+xml|png|jpeg|webp|gif|avif)[^']+)(')|(\()(data:image\/(?:svg\+xml|png|jpeg|webp|gif|avif)[^)\s]+)(\))/gis;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const rawUri = match[1] || match[3] || match[5];
    if (rawUri) {
      const clean = rawUri.replace(/[\r\n\t]/g, '').trim();
      if (!clean.includes('...[') && clean.length >= minLength) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Finds all vault IDs present in the markdown
 */
export function getFoldedVaultIds(markdown) {
  if (!markdown || typeof markdown !== 'string') return [];
  const ids = [];
  const regex = /data:image\/[a-zA-Z0-9%_\+\-;=,]*?\.\.\.\[(?:···\s*)?[^#\]]+#([a-zA-Z0-9_]+)\]\.\.\./g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

/**
 * Enhances Prism syntax highlighted HTML by styling fold tokens into an interactive chip
 */
export function decorateFoldTokensInPrismHtml(html) {
  if (!html || typeof html !== 'string') return html;

  const foldTokenRegex = /(data:image\/[a-zA-Z0-9%_\+\-;=,]*?)\.\.\.\[(?:···\s*)?([^#\]]+)#([a-zA-Z0-9_]+)\]\.\.\.([a-zA-Z0-9%_\+\-;=]*)/g;

  return html.replace(foldTokenRegex, (match, head, size, id, tail) => {
    const cleanSize = size.trim();
    return `<span class="editor-fold-anchor" data-vault-id="${id}"><span class="token-uri-head">${head}</span><button type="button" class="editor-fold-chip" data-vault-id="${id}" title="Click or press Alt+F to expand full Data URI (${cleanSize})"><span class="fold-chip-dots">···</span><span class="fold-chip-badge">${cleanSize}</span><span class="material-symbols-outlined fold-chip-icon">unfold_more</span></button><span class="token-uri-tail">${tail}</span></span>`;
  });
}