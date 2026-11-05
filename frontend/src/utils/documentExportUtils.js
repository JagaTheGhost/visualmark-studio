import { saveAs } from 'file-saver'
import { unfoldDataUris } from './dataUriFold'
import { notifyExportGratitude } from './sponsorGratitude'

export function copyDocumentToClipboard(content, filename, showToast) {
  if (!content) return
  navigator.clipboard.writeText(unfoldDataUris(content))
  if (showToast) {
    showToast(`Copied ${filename || 'document'} to clipboard!`, 'info', { minor: true })
  }
}

export async function downloadActiveFile(content, filename = 'README.md', showToast) {
  if (!content) return
  const unfolded = unfoldDataUris(content)
  if (typeof window !== 'undefined' && window.electronAPI?.saveFileDialog) {
    const res = await window.electronAPI.saveFileDialog(unfolded, filename || 'README.md')
    if (!res.canceled && showToast) {
      notifyExportGratitude(showToast, `document (${res.fileName})`)
    }
  } else {
    const file = new Blob([unfolded], { type: 'text/markdown;charset=utf-8' })
    saveAs(file, filename)
    if (showToast) {
      notifyExportGratitude(showToast, `document (${filename})`)
    }
  }
}
