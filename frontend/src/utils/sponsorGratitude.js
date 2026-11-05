/**
 * Sponsor & Export Gratitude Helper
 * Connects high-value user milestones (exports, achievements) with subtle,
 * appreciative sponsor prompts for @JagaTheGhost.
 */

export const SPONSOR_URL = 'https://github.com/sponsors/JagaTheGhost'
export const REPO_URL = 'https://github.com/JagaTheGhost/visualmark-studio'

/**
 * Open external URL using Electron IPC or browser fallback
 */
export function openExternalUrl(url) {
  if (typeof window !== 'undefined' && window.electronAPI?.openExternalUrl) {
    window.electronAPI.openExternalUrl(url)
  } else if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

/**
 * Open Jaga's GitHub Sponsors page in the default external browser
 */
export function openSponsorUrl() {
  openExternalUrl(SPONSOR_URL)
}

/**
 * Open the main GitHub repository
 */
export function openRepoUrl() {
  openExternalUrl(REPO_URL)
}

/**
 * Dispatch an application-wide event to toggle or display the About VisualMark modal
 */
export function openAboutModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-about-modal'))
  }
}

/**
 * Trigger gratitude toast after a successful export (SVG, PNG, Markdown, etc.)
 * Intelligently spaces notifications so it never feels spammy.
 */
export function notifyExportGratitude(showToast, assetLabel = 'diagram') {
  if (!showToast) return

  try {
    const now = Date.now()
    const count = parseInt(localStorage.getItem('vm_export_count') || '0', 10) + 1
    localStorage.setItem('vm_export_count', String(count))

    const lastPrompt = parseInt(localStorage.getItem('vm_last_sponsor_toast') || '0', 10)
    const fifteenMinutes = 15 * 60 * 1000

    // Show sponsor gratitude prompt on the 1st export, or every 4th export thereafter,
    // provided at least 15 minutes have passed since the last prompt.
    const shouldPromptSponsor = (count === 1 || count % 4 === 0) && (now - lastPrompt > fifteenMinutes)

    if (shouldPromptSponsor) {
      localStorage.setItem('vm_last_sponsor_toast', String(now))
      showToast(
        `🎉 Successfully exported ${assetLabel}! If VisualMark Studio saved you time, consider fueling the project ☕`,
        'success',
        {
          source: 'EXPORT',
          important: true,
          duration: 8000,
          action: {
            label: '💖 Sponsor Jaga',
            onClick: openSponsorUrl
          }
        }
      )
      return
    }
  } catch (e) {
    console.warn('Could not read/write sponsor gratitude tracking:', e)
  }

  // Normal export confirmation toast
  showToast(`✓ Exported ${assetLabel}!`, 'success', {
    source: 'EXPORT',
    minor: true
  })
}

