/**
 * VisualMark Studio - Document Outline Parser Engine
 * Deterministically parses H1-H6 ATX headings, Setext headings, and HTML headings
 * across CRLF (Windows) and LF (POSIX) markdown documents while ignoring fenced code blocks.
 */

/**
 * Clean markdown heading text from inline markup, links, images, and HTML tags.
 * Preserves alphanumeric characters, spaces, and expressive emojis.
 *
 * @param {string} rawText
 * @returns {string}
 */
export function cleanHeadingText(rawText = '') {
  if (!rawText) return ''

  return rawText
    // Remove HTML tags e.g. <span ...>...</span> or <b>...</b>
    .replace(/<[^>]+>/g, '')
    // Replace markdown links [Link Text](url) with "Link Text"
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Replace markdown images ![Alt Text](url) with "Alt Text"
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove inline code ticks `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove bold/italic markers (*, _, ~)
    .replace(/[*_~`]/g, '')
    // Remove trailing hash closing syntax (e.g. "## Title ##")
    .replace(/\s+#+\s*$/, '')
    // Clean redundant spaces
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Generate a URL/preview anchor slug from heading text.
 *
 * @param {string} text
 * @returns {string}
 */
export function generateHeadingSlug(text = '') {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/**
 * Parse all markdown headings from the document into an outline array.
 *
 * @param {string} markdown - The markdown document content.
 * @returns {Array<{level: number, text: string, raw: string, lineNumber: number, slug: string}>}
 */
export function parseMarkdownOutline(markdown = '') {
  if (!markdown || typeof markdown !== 'string') {
    return []
  }

  // Normalize Windows CRLF (\r\n) and legacy CR (\r) into standard LF (\n)
  const normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n')
  const headings = []

  let insideCodeBlock = false
  let fenceChar = ''
  let fenceLength = 0

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]
    const trimmed = line.trim()
    const lineNumber = idx + 1 // 1-indexed for Monaco editor & gutter

    // 1. Detect and track fenced code blocks (``` or ~~~)
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/)
    if (fenceMatch) {
      const char = fenceMatch[2][0]
      const len = fenceMatch[2].length

      if (!insideCodeBlock) {
        insideCodeBlock = true
        fenceChar = char
        fenceLength = len
      } else if (char === fenceChar && len >= fenceLength) {
        // Closing fence must match or exceed opening fence length
        insideCodeBlock = false
        fenceChar = ''
        fenceLength = 0
      }
      continue
    }

    // Skip checking inside code blocks so bash/python comments (# comment) are ignored
    if (insideCodeBlock) {
      continue
    }

    // 2. ATX Headings: # through ###### (CommonMark allows 0-3 leading spaces)
    const atxMatch = line.match(/^[ \t]{0,3}(#{1,6})[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*$/)
    if (atxMatch) {
      const level = atxMatch[1].length
      const rawHeading = atxMatch[2].trim()
      const cleaned = cleanHeadingText(rawHeading)

      if (cleaned.length > 0) {
        headings.push({
          level,
          text: cleaned,
          raw: rawHeading,
          lineNumber,
          slug: generateHeadingSlug(cleaned)
        })
      }
      continue
    }

    // 3. HTML Headings: <h1> through <h6> or <h1 align="...">...</h1>
    const htmlHeadingMatch = line.match(/<h([1-6])(?:\s+[^>]*)?>(.*?)<\/h\1>/i)
    if (htmlHeadingMatch) {
      const level = parseInt(htmlHeadingMatch[1], 10)
      const rawHeading = htmlHeadingMatch[2].trim()
      const cleaned = cleanHeadingText(rawHeading)

      if (cleaned.length > 0) {
        headings.push({
          level,
          text: cleaned,
          raw: rawHeading,
          lineNumber,
          slug: generateHeadingSlug(cleaned)
        })
      }
      continue
    }

    // 4. Setext Headings:
    // H1: Text line followed by === (at least 2 '=' characters)
    // H2: Text line followed by --- (at least 2 '-' characters)
    if (idx > 0 && trimmed.length >= 2) {
      const prevLine = lines[idx - 1]
      const prevTrimmed = prevLine.trim()

      // Ensure previous line is non-blank and not already an ATX heading, list bullet, quote, or fence
      const isPrevLineValidText =
        prevTrimmed.length > 0 &&
        !prevTrimmed.startsWith('#') &&
        !prevTrimmed.startsWith('```') &&
        !prevTrimmed.startsWith('~~~') &&
        !prevTrimmed.startsWith('>') &&
        !prevTrimmed.startsWith('- ') &&
        !prevTrimmed.startsWith('* ') &&
        !prevTrimmed.startsWith('+ ') &&
        !/^\d+\.\s/.test(prevTrimmed) &&
        !/^[ \t]*[-*_]{3,}[ \t]*$/.test(prevTrimmed)

      if (isPrevLineValidText) {
        const isH1Setext = /^[ \t]*={2,}[ \t]*$/.test(line)
        const isH2Setext = /^[ \t]*-{2,}[ \t]*$/.test(line)

        if (isH1Setext || isH2Setext) {
          const level = isH1Setext ? 1 : 2
          const cleaned = cleanHeadingText(prevTrimmed)

          if (cleaned.length > 0) {
            headings.push({
              level,
              text: cleaned,
              raw: prevTrimmed,
              lineNumber: idx, // The heading text is on the preceding line
              slug: generateHeadingSlug(cleaned)
            })
          }
          continue
        }
      }
    }
  }

  return headings
}
