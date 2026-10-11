/**
 * Normalizes and sanitizes user input for documentation filenames.
 * Handles dot extensions, illegal characters, and enforces .md format.
 */
export function normalizeDocFilename(input) {
  if (!input || typeof input !== 'string') return ''

  // 1. Trim whitespace
  let name = input.trim()

  // 2. Remove characters illegal on Windows/POSIX filesystems: \ / : * ? " < > |
  name = name.replace(/[\\/:*?"<>|]/g, '')

  // 3. Remove leading and trailing dots and whitespace
  name = name.replace(/^[\.\s]+/, '').replace(/[\.\s]+$/, '')

  if (!name) return ''

  // 4. Handle extensions case-insensitively
  // If user typed .markdown, .mdown, or .mkd, normalize to .md
  if (/\.(markdown|mdown|mkd)$/i.test(name)) {
    name = name.replace(/\.(markdown|mdown|mkd)$/i, '.md')
  } else if (/\.md$/i.test(name)) {
    // If it already ends with .md (or .MD), standardize to lowercase .md
    name = name.replace(/\.md$/i, '.md')
  } else {
    // If name has other dots (e.g. release-1.0 or api.v1), strip trailing dots and append .md
    name = `${name.replace(/\.+$/, '')}.md`
  }

  return name
}

export function validateDocFilename(input) {
  const normalized = normalizeDocFilename(input)
  if (!normalized) {
    return { valid: false, error: 'Filename cannot be empty or contain only symbols.', filename: '' }
  }
  // Disallow empty basename like just ".md"
  if (normalized.toLowerCase() === '.md') {
    return { valid: false, error: 'Please enter a filename before the .md extension.', filename: '' }
  }
  return { valid: true, error: null, filename: normalized }
}
