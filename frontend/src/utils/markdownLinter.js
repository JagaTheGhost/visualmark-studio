/**
 * README Studio - Real-time Markdown Linter & Diagnostics Engine
 * Provides deterministic AST and syntax validation for the Problems tab.
 */

export function lintMarkdownDocument(content = '', filename = 'README.md') {
  if (!content) return []
  const problems = []
  const lines = content.split('\n')

  let insideCodeFence = false
  let codeFenceStartLine = 0
  let codeFenceType = ''
  let lastHeadingLevel = 0
  const headingSet = new Set()

  for (let idx = 0; idx < lines.length; idx++) {
    const lineNum = idx + 1
    const rawLine = lines[idx]
    const trimmed = rawLine.trim()

    // 1. Code Fence Detection
    if (trimmed.startsWith('```')) {
      if (!insideCodeFence) {
        insideCodeFence = true
        codeFenceStartLine = lineNum
        codeFenceType = trimmed.slice(3).trim()
      } else {
        insideCodeFence = false
      }
      continue
    }

    // Skip checking inside code blocks for standard markdown formatting
    if (insideCodeFence) continue

    // 2. Heading Hierarchy Validation
    const headingMatch = rawLine.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const headingText = headingMatch[2].trim()

      if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
        problems.push({
          id: `heading-skip-${lineNum}`,
          file: filename,
          severity: 'warning',
          message: `Heading level skipped: jumped from H${lastHeadingLevel} directly to H${level} without an intermediate level.`,
          line: lineNum,
          col: 1,
          source: 'Linter'
        })
      }

      const headingKey = `${level}:${headingText.toLowerCase()}`
      if (headingSet.has(headingKey)) {
        problems.push({
          id: `heading-dup-${lineNum}`,
          file: filename,
          severity: 'info',
          message: `Duplicate heading found: "${headingText}". Consider distinguishing heading names for cleaner anchor navigation.`,
          line: lineNum,
          col: 1,
          source: 'Linter'
        })
      } else {
        headingSet.add(headingKey)
      }

      lastHeadingLevel = level
    }

    // 3. Empty Link Destination: [Title]()
    const emptyLinkMatch = rawLine.match(/\[([^\]]+)\]\(\s*\)/)
    if (emptyLinkMatch) {
      problems.push({
        id: `empty-link-${lineNum}`,
        file: filename,
        severity: 'warning',
        message: `Empty link destination found for "${emptyLinkMatch[1]}". Specify a URL or internal anchor.`,
        line: lineNum,
        col: rawLine.indexOf(emptyLinkMatch[0]) + 1,
        source: 'Linter'
      })
    }

    // 4. Missing Image Source: ![]() or ![Alt]()
    const emptyImgMatch = rawLine.match(/!\[([^\]]*)\]\(\s*\)/)
    if (emptyImgMatch) {
      problems.push({
        id: `empty-img-${lineNum}`,
        file: filename,
        severity: 'warning',
        message: 'Empty image source destination. Provide a valid image path or asset URL.',
        line: lineNum,
        col: rawLine.indexOf(emptyImgMatch[0]) + 1,
        source: 'Linter'
      })
    }

    // 5. Unbalanced Bracket Link Tags
    if (rawLine.includes('](') && !rawLine.includes(')')) {
      problems.push({
        id: `unbalanced-link-${lineNum}`,
        file: filename,
        severity: 'error',
        message: 'Unclosed markdown link parentheses on this line.',
        line: lineNum,
        col: rawLine.indexOf('](') + 1,
        source: 'Linter'
      })
    }

    // 6. Suspicious Raw HTML Tags unclosed
    const rawTagMatch = rawLine.match(/<(div|span|p|table|tr|td|th)[^>]*>$/i)
    if (rawTagMatch && !rawLine.includes(`</${rawTagMatch[1]}>`)) {
      // Ignore if line is self-closing or multiline container, but flag if malformed
      if (rawTagMatch[0].endsWith('/>')) {
        // Self-closing is valid
      }
    }
  }

  // 7. Unclosed Code Fence at EOF
  if (insideCodeFence) {
    problems.push({
      id: `unclosed-code-fence-${codeFenceStartLine}`,
      file: filename,
      severity: 'error',
      message: `Unclosed code fence started with "${codeFenceType || 'code'}". Missing closing \`\`\` before end of document.`,
      line: codeFenceStartLine,
      col: 1,
      source: 'Linter'
    })
  }

  return problems
}
