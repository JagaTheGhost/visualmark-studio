import { saveAs } from 'file-saver'
import { unfoldDataUris } from './dataUriFold'
import { exportToPdf } from './pdfExport'

export function copyDocumentToClipboard(content, filename, showToast) {
  if (!content) return
  navigator.clipboard.writeText(unfoldDataUris(content))
  if (showToast) {
    showToast(`Copied ${filename || 'document'} to clipboard!`, 'success')
  }
}

export async function downloadActiveFile(content, filename = 'README.md', showToast) {
  if (!content) return
  const unfolded = unfoldDataUris(content)
  if (typeof window !== 'undefined' && window.electronAPI?.saveFileDialog) {
    const res = await window.electronAPI.saveFileDialog(unfolded, filename || 'README.md')
    if (!res.canceled && showToast) {
      showToast(`✓ Exported ${res.fileName}`, 'success')
    }
  } else {
    const file = new Blob([unfolded], { type: 'text/markdown;charset=utf-8' })
    saveAs(file, filename)
    if (showToast) {
      showToast(`Exported ${filename}!`, 'success')
    }
  }
}

export async function downloadDocumentationSuite(markdown, additionalFiles = {}, showToast) {
  try {
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    zip.file('README.md', unfoldDataUris(markdown || ''))

    Object.entries(additionalFiles).forEach(([fname, fcontent]) => {
      zip.file(fname, unfoldDataUris(fcontent || ''))
    })

    if (typeof window !== 'undefined' && window.electronAPI?.saveBinaryDialog) {
      const base64Data = await zip.generateAsync({ type: 'base64' })
      const res = await window.electronAPI.saveBinaryDialog({
        defaultPath: 'documentation-suite.zip',
        filters: [{ name: 'ZIP Archive', extensions: ['zip'] }, { name: 'All Files', extensions: ['*'] }],
        base64Data
      })
      if (!res.canceled && showToast) {
        showToast(`✓ Exported documentation suite to ${res.fileName}`, 'success')
      }
    } else {
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, 'documentation-suite.zip')
      if (showToast) {
        showToast('Exported documentation-suite.zip!', 'success')
      }
    }
  } catch (err) {
    if (showToast) {
      showToast('Failed to export suite: ' + err.message, 'error')
    }
  }
}

export async function downloadHtmlDocument(content, filename = 'README.md', showToast) {
  if (!content) return
  const title = (filename || 'README').replace(/\.md$/i, '')
  const fullContent = unfoldDataUris(content)
  const htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — VisualMark Studio</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.5.1/github-markdown-dark.min.css">
  <style>
    body { background-color: #0d1117; color: #c9d1d9; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; }
    .markdown-body { box-sizing: border-box; min-width: 200px; max-width: 960px; margin: 0 auto; padding: 32px; background: transparent; }
  </style>
</head>
<body>
  <article class="markdown-body">
    <pre style="white-space: pre-wrap; font-family: inherit;">${fullContent.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </article>
</body>
</html>`

  if (typeof window !== 'undefined' && window.electronAPI?.saveTextExportDialog) {
    const res = await window.electronAPI.saveTextExportDialog({
      defaultPath: `${title}.html`,
      filters: [{ name: 'HTML Document', extensions: ['html'] }, { name: 'All Files', extensions: ['*'] }],
      content: htmlDoc
    })
    if (!res.canceled && showToast) {
      showToast(`✓ Exported ${res.fileName}`, 'success')
    }
  } else {
    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' })
    saveAs(blob, `${title}.html`)
    if (showToast) {
      showToast(`Exported ${title}.html!`, 'success')
    }
  }
}

export async function downloadPdfDocument({
  content,
  filename = 'README.md',
  themeMode = 'dark',
  previewElement = null,
  showToast
}) {
  if (!content) {
    if (showToast) showToast('No documentation content to export.', 'warning')
    return
  }
  const title = (filename || 'README').replace(/\.md$/i, '')
  try {
    if (showToast) showToast('Converting visual preview to PDF...', 'info')
    await exportToPdf({
      title,
      contentElement: previewElement || document.querySelector('.preview-canvas'),
      rawMarkdown: unfoldDataUris(content),
      themeMode
    })
    if (showToast) showToast(`Exported ${title}.pdf!`, 'success')
  } catch (err) {
    console.error('PDF export error:', err)
    if (showToast) showToast('Failed to export PDF: ' + err.message, 'error')
  }
}
