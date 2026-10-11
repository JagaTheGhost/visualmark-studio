/**
 * README Studio - Advanced Markdown IDE Editor Helpers
 * Provides deterministic, line-aware formatting, list continuation,
 * auto-closing pairs, and document cleanup modeling VS Code / Antigravity IDE.
 */

// 1. Smart Formatting (Line-Aware & Selection-Aware)
export function applySmartFormat(content, selectionStart, selectionEnd, action, options = {}) {
  const start = Math.min(selectionStart, selectionEnd)
  const end = Math.max(selectionStart, selectionEnd)
  const selectedText = content.substring(start, end)

  // Find start and end line boundaries for line-based actions
  const lineStart = content.lastIndexOf('\n', start - 1) + 1
  let lineEnd = content.indexOf('\n', end)
  if (lineEnd === -1) lineEnd = content.length

  const fullLineText = content.substring(lineStart, lineEnd)
  const selectedLines = content.substring(lineStart, lineEnd).split('\n')

  switch (action) {
    case 'heading': {
      const level = options.level || 1
      const prefix = '#'.repeat(level) + ' '
      
      // Check if current line already has this heading
      const headingMatch = fullLineText.match(/^(#{1,6})\s*(.*)$/)
      let nextLineText = ''
      if (headingMatch) {
        const currentLevel = headingMatch[1].length
        const rawContent = headingMatch[2]
        if (currentLevel === level) {
          // Toggle off -> convert to normal paragraph
          nextLineText = rawContent
        } else {
          // Change to new level
          nextLineText = prefix + rawContent
        }
      } else {
        nextLineText = prefix + fullLineText
      }

      const newContent = content.substring(0, lineStart) + nextLineText + content.substring(lineEnd)
      const diff = nextLineText.length - fullLineText.length
      return {
        newContent,
        newStart: Math.max(lineStart, start + diff),
        newEnd: Math.max(lineStart, end + diff)
      }
    }

    case 'bold': {
      return wrapInline(content, start, end, '**', '**')
    }

    case 'italic': {
      return wrapInline(content, start, end, '*', '*')
    }

    case 'strikethrough': {
      return wrapInline(content, start, end, '~~', '~~')
    }

    case 'inlineCode': {
      return wrapInline(content, start, end, '`', '`')
    }

    case 'codeBlock': {
      const lang = options.language || 'bash'
      if (selectedText) {
        const codeText = `\`\`\`${lang}\n${selectedText}\n\`\`\`\n`
        const newContent = content.substring(0, start) + codeText + content.substring(end)
        return {
          newContent,
          newStart: start + lang.length + 4,
          newEnd: start + codeText.length - 4
        }
      } else {
        const snippet = `\`\`\`${lang}\n# Add ${lang} code here\n\`\`\`\n`
        const newContent = content.substring(0, start) + snippet + content.substring(end)
        return {
          newContent,
          newStart: start + lang.length + 4,
          newEnd: start + lang.length + 4 + `# Add ${lang} code here`.length
        }
      }
    }

    case 'blockquote': {
      const allQuoted = selectedLines.every(l => l.trimStart().startsWith('> '))
      const transformed = selectedLines.map(line => {
        if (allQuoted) {
          return line.replace(/^(\s*)>\s?/, '$1')
        } else {
          return `> ${line}`
        }
      }).join('\n')

      const newContent = content.substring(0, lineStart) + transformed + content.substring(lineEnd)
      return {
        newContent,
        newStart: lineStart,
        newEnd: lineStart + transformed.length
      }
    }

    case 'bulletList': {
      const allBulleted = selectedLines.every(l => /^\s*[-*+]\s/.test(l))
      const transformed = selectedLines.map(line => {
        if (allBulleted) {
          return line.replace(/^(\s*)[-*+]\s/, '$1')
        } else {
          // Strip any existing numbered prefix first
          const cleaned = line.replace(/^(\s*)\d+\.\s/, '$1')
          return `- ${cleaned.trimStart()}`
        }
      }).join('\n')

      const newContent = content.substring(0, lineStart) + transformed + content.substring(lineEnd)
      return {
        newContent,
        newStart: lineStart,
        newEnd: lineStart + transformed.length
      }
    }

    case 'numberList': {
      const allNumbered = selectedLines.every(l => /^\s*\d+\.\s/.test(l))
      let counter = 1
      const transformed = selectedLines.map(line => {
        if (allNumbered) {
          return line.replace(/^(\s*)\d+\.\s/, '$1')
        } else {
          const cleaned = line.replace(/^(\s*)[-*+]\s/, '$1')
          const res = `${counter}. ${cleaned.trimStart()}`
          counter++
          return res
        }
      }).join('\n')

      const newContent = content.substring(0, lineStart) + transformed + content.substring(lineEnd)
      return {
        newContent,
        newStart: lineStart,
        newEnd: lineStart + transformed.length
      }
    }

    case 'taskList': {
      const allTasks = selectedLines.every(l => /^\s*[-*+]\s\[[ xX]\]\s/.test(l))
      const transformed = selectedLines.map(line => {
        if (allTasks) {
          return line.replace(/^(\s*)[-*+]\s\[[ xX]\]\s/, '$1')
        } else {
          const cleaned = line.replace(/^(\s*)(?:[-*+]|\d+\.)\s*(?:\[[ xX]\]\s*)?/, '$1')
          return `- [ ] ${cleaned.trimStart()}`
        }
      }).join('\n')

      const newContent = content.substring(0, lineStart) + transformed + content.substring(lineEnd)
      return {
        newContent,
        newStart: lineStart,
        newEnd: lineStart + transformed.length
      }
    }

    case 'link': {
      if (selectedText) {
        // If selection is URL, make it [Title](selection)
        if (/^https?:\/\//i.test(selectedText.trim())) {
          const snippet = `[Link Title](${selectedText.trim()})`
          const newContent = content.substring(0, start) + snippet + content.substring(end)
          return {
            newContent,
            newStart: start + 1,
            newEnd: start + 11
          }
        } else {
          const snippet = `[${selectedText}](https://example.com)`
          const newContent = content.substring(0, start) + snippet + content.substring(end)
          return {
            newContent,
            newStart: start + selectedText.length + 3,
            newEnd: start + snippet.length - 1
          }
        }
      } else {
        const snippet = '[Link Text](https://example.com)'
        const newContent = content.substring(0, start) + snippet + content.substring(end)
        return {
          newContent,
          newStart: start + 1,
          newEnd: start + 10
        }
      }
    }

    case 'image': {
      const alt = options.alt || (selectedText || 'Image description')
      const url = options.url || 'https://raw.githubusercontent.com/username/project/main/assets/banner.png'
      const snippet = `![${alt}](${url})\n`
      const newContent = content.substring(0, start) + snippet + content.substring(end)
      return {
        newContent,
        newStart: start + 2 + alt.length + 2,
        newEnd: start + snippet.length - 2
      }
    }

    case 'table': {
      const rows = options.rows || 3
      const cols = options.cols || 3
      let tableMd = '\n'
      // Headers
      tableMd += '| ' + Array.from({ length: cols }, (_, i) => `Header ${i + 1}`).join(' | ') + ' |\n'
      // Separator
      tableMd += '| ' + Array.from({ length: cols }, () => ':---').join(' | ') + ' |\n'
      // Rows
      for (let r = 0; r < rows; r++) {
        tableMd += '| ' + Array.from({ length: cols }, (_, c) => `Item ${r + 1}.${c + 1}`).join(' | ') + ' |\n'
      }
      tableMd += '\n'
      const newContent = content.substring(0, start) + tableMd + content.substring(end)
      return {
        newContent,
        newStart: start + tableMd.length,
        newEnd: start + tableMd.length
      }
    }

    case 'callout': {
      const calloutType = options.type || 'NOTE' // NOTE | TIP | IMPORTANT | WARNING | CAUTION
      const body = selectedText || 'Add important contextual notes or instructions here.'
      const snippet = `\n> [!${calloutType.toUpperCase()}]\n> ${body.split('\n').join('\n> ')}\n\n`
      const newContent = content.substring(0, start) + snippet + content.substring(end)
      return {
        newContent,
        newStart: start + snippet.length,
        newEnd: start + snippet.length
      }
    }

    case 'details': {
      const title = options.title || (selectedText ? 'Expand details' : 'Click to expand')
      const body = selectedText || 'Add hidden detailed content, logs, or long outputs here.'
      const snippet = `\n<details>\n<summary>${title}</summary>\n\n${body}\n\n</details>\n\n`
      const newContent = content.substring(0, start) + snippet + content.substring(end)
      return {
        newContent,
        newStart: start + snippet.length,
        newEnd: start + snippet.length
      }
    }

    case 'divider': {
      const snippet = '\n\n---\n\n'
      const newContent = content.substring(0, start) + snippet + content.substring(end)
      return {
        newContent,
        newStart: start + snippet.length,
        newEnd: start + snippet.length
      }
    }

    case 'toc': {
      const toc = generateTableOfContents(content)
      const snippet = `\n## Table of Contents\n\n${toc}\n\n`
      const newContent = content.substring(0, start) + snippet + content.substring(end)
      return {
        newContent,
        newStart: start + snippet.length,
        newEnd: start + snippet.length
      }
    }

    default:
      return { newContent: content, newStart: start, newEnd: end }
  }
}

// Wrap inline text, or unwrap if already wrapped
function wrapInline(content, start, end, open, close) {
  const selectedText = content.substring(start, end)
  if (selectedText) {
    // Check if already wrapped
    if (selectedText.startsWith(open) && selectedText.endsWith(close) && selectedText.length >= open.length + close.length) {
      const unwrapped = selectedText.substring(open.length, selectedText.length - close.length)
      const newContent = content.substring(0, start) + unwrapped + content.substring(end)
      return { newContent, newStart: start, newEnd: start + unwrapped.length }
    }

    // Check if surrounding text is already wrapping
    const textBefore = content.substring(Math.max(0, start - open.length), start)
    const textAfter = content.substring(end, end + close.length)
    if (textBefore === open && textAfter === close) {
      const newContent = content.substring(0, start - open.length) + selectedText + content.substring(end + close.length)
      return { newContent, newStart: start - open.length, newEnd: end - open.length }
    }

    const wrapped = open + selectedText + close
    const newContent = content.substring(0, start) + wrapped + content.substring(end)
    return { newContent, newStart: start, newEnd: start + wrapped.length }
  } else {
    // No text selected: check if inside word
    let wordStart = start
    let wordEnd = start
    while (wordStart > 0 && /[\w-]/.test(content[wordStart - 1])) wordStart--
    while (wordEnd < content.length && /[\w-]/.test(content[wordEnd])) wordEnd++

    if (wordStart < wordEnd) {
      const word = content.substring(wordStart, wordEnd)
      const wrapped = open + word + close
      const newContent = content.substring(0, wordStart) + wrapped + content.substring(wordEnd)
      return { newContent, newStart: wordStart, newEnd: wordStart + wrapped.length }
    }

    // Empty insertion
    const placeholder = open + close
    const newContent = content.substring(0, start) + placeholder + content.substring(end)
    return { newContent, newStart: start + open.length, newEnd: start + open.length }
  }
}

// 2. Auto List Continuation on Enter (VS Code / Antigravity Style)
export function handleListContinuationOnEnter(content, cursorPos) {
  const lineStart = content.lastIndexOf('\n', cursorPos - 1) + 1
  const lineText = content.substring(lineStart, cursorPos)

  // 1. Task List: - [ ] or - [x]
  const taskMatch = lineText.match(/^(\s*)([-*+]\s\[[ xX]\]\s)(.*)$/)
  if (taskMatch) {
    const indent = taskMatch[1]
    const prefix = taskMatch[2]
    const itemContent = taskMatch[3].trim()
    // If empty item: pressing Enter clears bullet and exits list!
    if (!itemContent) {
      const newContent = content.substring(0, lineStart) + content.substring(cursorPos)
      return { handled: true, newContent, newCursor: lineStart }
    }
    const continuation = `\n${indent}- [ ] `
    const newContent = content.substring(0, cursorPos) + continuation + content.substring(cursorPos)
    return { handled: true, newContent, newCursor: cursorPos + continuation.length }
  }

  // 2. Numbered List: 1. 2. 3.
  const numMatch = lineText.match(/^(\s*)(\d+)\.\s(.*)$/)
  if (numMatch) {
    const indent = numMatch[1]
    const num = parseInt(numMatch[2], 10)
    const itemContent = numMatch[3].trim()
    if (!itemContent) {
      const newContent = content.substring(0, lineStart) + content.substring(cursorPos)
      return { handled: true, newContent, newCursor: lineStart }
    }
    const continuation = `\n${indent}${num + 1}. `
    const newContent = content.substring(0, cursorPos) + continuation + content.substring(cursorPos)
    return { handled: true, newContent, newCursor: cursorPos + continuation.length }
  }

  // 3. Bullet List: - * +
  const bulletMatch = lineText.match(/^(\s*)([-*+]\s)(.*)$/)
  if (bulletMatch) {
    const indent = bulletMatch[1]
    const symbol = bulletMatch[2].trim()
    const itemContent = bulletMatch[3].trim()
    if (!itemContent) {
      const newContent = content.substring(0, lineStart) + content.substring(cursorPos)
      return { handled: true, newContent, newCursor: lineStart }
    }
    const continuation = `\n${indent}${symbol} `
    const newContent = content.substring(0, cursorPos) + continuation + content.substring(cursorPos)
    return { handled: true, newContent, newCursor: cursorPos + continuation.length }
  }

  // 4. Blockquote continuation: >
  const quoteMatch = lineText.match(/^(\s*)(>\s?)(.*)$/)
  if (quoteMatch) {
    const indent = quoteMatch[1]
    const itemContent = quoteMatch[3].trim()
    if (!itemContent) {
      const newContent = content.substring(0, lineStart) + content.substring(cursorPos)
      return { handled: true, newContent, newCursor: lineStart }
    }
    const continuation = `\n${indent}> `
    const newContent = content.substring(0, cursorPos) + continuation + content.substring(cursorPos)
    return { handled: true, newContent, newCursor: cursorPos + continuation.length }
  }

  return { handled: false }
}

// 3. Tab and Shift+Tab Indentation
export function handleTabIndentation(content, start, end, isShift = false) {
  const lineStart = content.lastIndexOf('\n', start - 1) + 1
  let lineEnd = content.indexOf('\n', end)
  if (lineEnd === -1) lineEnd = content.length

  const isMultiLine = content.substring(lineStart, lineEnd).includes('\n') || start !== end

  if (isMultiLine) {
    const lines = content.substring(lineStart, lineEnd).split('\n')
    let delta = 0
    const transformed = lines.map(line => {
      if (isShift) {
        if (line.startsWith('  ')) {
          delta -= 2
          return line.slice(2)
        } else if (line.startsWith(' ')) {
          delta -= 1
          return line.slice(1)
        }
        return line
      } else {
        delta += 2
        return '  ' + line
      }
    }).join('\n')

    const newContent = content.substring(0, lineStart) + transformed + content.substring(lineEnd)
    return {
      handled: true,
      newContent,
      newStart: Math.max(lineStart, start + (isShift ? -2 : 2)),
      newEnd: Math.max(lineStart, end + delta)
    }
  } else {
    if (isShift) {
      // Outdent current line
      const lineText = content.substring(lineStart, lineEnd)
      if (lineText.startsWith('  ')) {
        const newContent = content.substring(0, lineStart) + lineText.slice(2) + content.substring(lineEnd)
        return { handled: true, newContent, newStart: Math.max(lineStart, start - 2), newEnd: Math.max(lineStart, end - 2) }
      }
      return { handled: true, newContent: content, newStart: start, newEnd: end }
    } else {
      // Insert 2 spaces
      const newContent = content.substring(0, start) + '  ' + content.substring(end)
      return { handled: true, newContent, newStart: start + 2, newEnd: start + 2 }
    }
  }
}

// 4. Duplicate Line Down (Shift+Alt+Down)
export function duplicateCurrentLine(content, cursorPos) {
  const lineStart = content.lastIndexOf('\n', cursorPos - 1) + 1
  let lineEnd = content.indexOf('\n', cursorPos)
  if (lineEnd === -1) lineEnd = content.length

  const lineText = content.substring(lineStart, lineEnd)
  const newContent = content.substring(0, lineEnd) + '\n' + lineText + content.substring(lineEnd)
  const newCursor = cursorPos + lineText.length + 1
  return { newContent, newCursor }
}

// 5. Move Line Up or Down (Alt+Up / Alt+Down)
export function moveLine(content, cursorPos, direction = 'up') {
  const lines = content.split('\n')
  const charPos = Math.min(cursorPos, content.length)
  
  // Find line index
  let running = 0
  let targetIdx = 0
  for (let i = 0; i < lines.length; i++) {
    const nextRunning = running + lines[i].length + 1
    if (charPos >= running && charPos < nextRunning) {
      targetIdx = i
      break
    }
    running = nextRunning
  }

  if (direction === 'up' && targetIdx > 0) {
    const temp = lines[targetIdx]
    lines[targetIdx] = lines[targetIdx - 1]
    lines[targetIdx - 1] = temp
    const newContent = lines.join('\n')
    const newCursor = Math.max(0, cursorPos - lines[targetIdx].length - 1)
    return { handled: true, newContent, newCursor }
  } else if (direction === 'down' && targetIdx < lines.length - 1) {
    const temp = lines[targetIdx]
    lines[targetIdx] = lines[targetIdx + 1]
    lines[targetIdx + 1] = temp
    const newContent = lines.join('\n')
    const newCursor = Math.min(newContent.length, cursorPos + lines[targetIdx].length + 1)
    return { handled: true, newContent, newCursor }
  }

  return { handled: false }
}

// 6. Generate Table of Contents
export function generateTableOfContents(markdown) {
  const lines = markdown.split('\n')
  const tocEntries = []
  let insideCode = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      insideCode = !insideCode
      continue
    }
    if (insideCode) continue

    const match = line.match(/^(#{1,6})\s+(.*)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      const indent = '  '.repeat(Math.max(0, level - 1))
      tocEntries.push(`${indent}- [${text}](#${slug})`)
    }
  }

  return tocEntries.length > 0 ? tocEntries.join('\n') : '- *(No headings found in document)*'
}

// 7. Auto-Format Markdown Tables & Spacing
export function formatMarkdownDocument(markdown) {
  const lines = markdown.split('\n')
  const formattedLines = []
  let inTable = false
  let tableBuffer = []

  const flushTable = () => {
    if (tableBuffer.length === 0) return
    // Calculate max width per column
    const colWidths = []
    const parsedRows = tableBuffer.map(row => {
      const cells = row.split('|').slice(1, -1).map(c => c.trim())
      cells.forEach((c, idx) => {
        colWidths[idx] = Math.max(colWidths[idx] || 3, c.length)
      })
      return cells
    })

    parsedRows.forEach((row, rIdx) => {
      if (rIdx === 1) {
        // Separator row
        const sep = '| ' + colWidths.map(w => ':---' + '-'.repeat(Math.max(0, w - 4))).join(' | ') + ' |'
        formattedLines.push(sep)
      } else {
        const line = '| ' + row.map((c, idx) => (c || '').padEnd(colWidths[idx] || 3, ' ')).join(' | ') + ' |'
        formattedLines.push(line)
      }
    })
    tableBuffer = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|')) {
      inTable = true
      tableBuffer.push(trimmed)
    } else {
      if (inTable) {
        flushTable()
        inTable = false
      }
      formattedLines.push(line)
    }
  }

  if (inTable) {
    flushTable()
  }

  return formattedLines.join('\n')
}
