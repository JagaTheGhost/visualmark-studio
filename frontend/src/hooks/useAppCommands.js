import { useMemo, useCallback } from 'react'

/**
 * Custom hook providing searchable commands for VisualMark Studio Command Palette.
 */
export function useAppCommands({
  keybindings = [],
  activeFile,
  orientation,
  handleGenerate,
  handleCreateUntitledFile,
  handleSaveNativeFile,
  handleOpenNativeFile,
  handleOpenNativeFolder,
  setIsCloneModalOpen,
  handleCloseWorkspace,
  handleDownloadPdf,
  setViewMode,
  handleCopy,
  handleDownloadActiveFile,
  handleDownloadSuite,
  handleDownloadHtml,
  setSidebarCollapsed,
  setIsZenMode,
  setOrientation,
  handleOpenShortcutsTab,
  handleOpenSettingsTab,
  handleOpenStudioTab,
  setFindReplaceMode,
  setFindReplaceOpen,
  setWordWrap,
  handleClear,
  handleToggleBottomPanel,
  handleOpenWhatsNewTab,
  handleCheckForUpdates
}) {
  const getBindingKey = useCallback(
    (id, fallback = '') => keybindings.find((k) => k.id === id)?.key || fallback,
    [keybindings]
  )

  const commands = useMemo(() => [
    {
      id: 'doc.create',
      title: 'Create: Create Documentation',
      description: 'Create documentation skeleton from configuration',
      icon: 'note_add',
      category: 'Create',
      shortcut: getBindingKey('doc.create', 'Ctrl + Enter'),
      action: () => handleGenerate?.()
    },
    {
      id: 'file.new',
      title: 'File: New Document',
      description: 'Create a new markdown document tab',
      icon: 'note_add',
      category: 'File',
      shortcut: getBindingKey('file.new', 'Ctrl + N'),
      action: handleCreateUntitledFile
    },
    {
      id: 'file.save',
      title: 'File: Quick Save Document',
      description: 'Save current active document to disk or local storage',
      icon: 'save',
      category: 'File',
      shortcut: getBindingKey('file.save', 'Ctrl + S'),
      action: handleSaveNativeFile
    },
    {
      id: 'file.open',
      title: 'File: Open File...',
      description: 'Open native markdown or text file',
      icon: 'file_open',
      category: 'File',
      shortcut: getBindingKey('file.open', 'Ctrl + O'),
      action: handleOpenNativeFile
    },
    {
      id: 'file.openFolder',
      title: 'File: Open Folder...',
      description: 'Open native folder directory',
      icon: 'folder_open',
      category: 'File',
      shortcut: getBindingKey('file.openFolder', 'Ctrl + Shift + O'),
      action: handleOpenNativeFolder
    },
    {
      id: 'git.clone',
      title: 'Git: Clone Repository...',
      description: 'Clone a remote Git repository to local disk and open workspace',
      icon: 'download',
      category: 'Git',
      shortcut: '',
      action: () => setIsCloneModalOpen?.(true)
    },
    {
      id: 'file.closeWorkspace',
      title: 'File: Close Workspace',
      description: 'Close active workspace folder and return to Welcome Launcher',
      icon: 'close',
      category: 'File',
      shortcut: 'Ctrl + K F',
      action: handleCloseWorkspace
    },
    {
      id: 'file.exportPdf',
      title: 'File: Export as PDF',
      description: 'High-fidelity GitHub-styled vector PDF document',
      icon: 'picture_as_pdf',
      category: 'File',
      shortcut: getBindingKey('file.exportPdf', 'Ctrl + P'),
      action: handleDownloadPdf
    },
    {
      id: 'view-split',
      title: 'View: Split Editor & Preview',
      description: '50/50 Code Editor and GitHub preview',
      icon: 'vertical_split',
      category: 'Layout',
      action: () => setViewMode?.('split')
    },
    {
      id: 'view-editor',
      title: 'View: Editor Only',
      description: 'Maximize raw code editor space',
      icon: 'code',
      category: 'Layout',
      action: () => setViewMode?.('editor')
    },
    {
      id: 'view-preview',
      title: 'View: Preview Only',
      description: 'Read-only GitHub formatted documentation view',
      icon: 'visibility',
      category: 'Layout',
      action: () => setViewMode?.('preview')
    },
    {
      id: 'copy-md',
      title: `Copy ${activeFile || 'README.md'} Markdown`,
      description: 'Copy active markdown text to system clipboard',
      icon: 'content_copy',
      category: 'Clipboard',
      shortcut: 'Ctrl+Shift+C',
      action: handleCopy
    },
    {
      id: 'download-file',
      title: `Export: Save Active File (${activeFile || 'README.md'})`,
      description: 'Download the current raw markdown buffer',
      icon: 'description',
      category: 'Export',
      action: handleDownloadActiveFile
    },
    {
      id: 'download-suite',
      title: 'Export: Download Documentation Suite (.zip)',
      description: 'Bundle all markdown documents into a zip archive',
      icon: 'folder_zip',
      category: 'Export',
      action: handleDownloadSuite
    },
    {
      id: 'download-html',
      title: 'Export: Standalone HTML Page',
      description: 'Self-contained GitHub-styled HTML file',
      icon: 'html',
      category: 'Export',
      action: handleDownloadHtml
    },
    {
      id: 'view.toggleSidebar',
      title: 'View: Toggle Primary Sidebar Drawer',
      description: 'Expand or collapse the left drawer panel',
      icon: 'view_sidebar',
      category: 'Layout',
      shortcut: getBindingKey('view.toggleSidebar', 'Ctrl + B'),
      action: () => setSidebarCollapsed?.((prev) => !prev)
    },
    {
      id: 'zen-mode',
      title: 'Toggle Zen / Focus Mode',
      description: 'Hide sidebar and chrome for distraction-free writing',
      icon: 'fullscreen',
      category: 'Layout',
      action: () => setIsZenMode?.((prev) => !prev)
    },
    {
      id: 'view.toggleOrientation',
      title: `Toggle Split Layout (${orientation === 'horizontal' ? 'Side-by-Side' : 'Top & Bottom'})`,
      description: 'Switch between side-by-side vertical split and top-and-bottom stacked horizontal split',
      icon: orientation === 'horizontal' ? 'view_column' : 'table_rows',
      category: 'Layout',
      shortcut: getBindingKey('view.toggleOrientation', 'Ctrl + \\'),
      action: () => setOrientation?.((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'))
    },
    {
      id: 'pref.shortcuts',
      title: 'Open Keyboard Shortcuts Tab',
      description: 'Configure and customize all IDE hotkeys and shortcuts',
      icon: 'keyboard',
      category: 'Preferences',
      shortcut: getBindingKey('pref.shortcuts', 'Ctrl + /'),
      action: handleOpenShortcutsTab
    },
    {
      id: 'pref.settings',
      title: 'Open Settings Tab',
      description: 'Configure editor, appearance, fonts, and export preferences',
      icon: 'settings',
      category: 'Preferences',
      shortcut: getBindingKey('pref.settings', 'Ctrl + ,'),
      action: handleOpenSettingsTab
    },
    {
      id: 'studio.badges',
      title: 'Open Shields.io Badge Studio Tab',
      description: 'Interactive custom badge designer & generator',
      icon: 'shield',
      category: 'Studio',
      shortcut: getBindingKey('studio.badges', 'Ctrl + Shift + B'),
      action: () => handleOpenStudioTab?.('badges.studio')
    },
    {
      id: 'studio.diagrams',
      title: 'Open Mermaid Architecture Studio Tab',
      description: 'Visually configure architecture diagrams, pipelines, and git graphs',
      icon: 'schema',
      category: 'Studio',
      shortcut: getBindingKey('studio.diagrams', 'Ctrl + Shift + M'),
      action: () => handleOpenStudioTab?.('diagrams.studio')
    },
    {
      id: 'studio.tables',
      title: 'Open Visual Markdown Table Studio Tab',
      description: 'Interactive visual table builder with live preview',
      icon: 'table_chart',
      category: 'Studio',
      shortcut: getBindingKey('studio.tables', 'Ctrl + Shift + T'),
      action: () => handleOpenStudioTab?.('tables.studio')
    },
    {
      id: 'studio.snippets',
      title: 'Open Code & Callouts Snippets Studio Tab',
      description: 'GitHub alerts, multi-language code blocks, and collapsible sections',
      icon: 'code_blocks',
      category: 'Studio',
      shortcut: getBindingKey('studio.snippets', 'Ctrl + Shift + K'),
      action: () => handleOpenStudioTab?.('snippets.studio')
    },
    {
      id: 'studio.images',
      title: 'Open Image & Banner Studio Tab',
      description: 'Hero banners, screenshot window frames, and comparison grids',
      icon: 'image',
      category: 'Studio',
      shortcut: getBindingKey('studio.images', 'Ctrl + Shift + I'),
      action: () => handleOpenStudioTab?.('images.studio')
    },
    {
      id: 'tree-studio',
      title: 'Open Directory Tree Studio Tab',
      description: 'Visual ASCII, Unicode, and Emoji folder tree generator',
      icon: 'account_tree',
      category: 'Studio',
      action: () => handleOpenStudioTab?.('tree.studio')
    },
    {
      id: 'api-studio',
      title: 'Open API & Endpoints Studio Tab',
      description: 'Interactive REST route designer with parameter matrix and cURL',
      icon: 'api',
      category: 'Studio',
      action: () => handleOpenStudioTab?.('api.studio')
    },
    {
      id: 'audit-studio',
      title: 'Open README Auditor & Linter Tab',
      description: 'Documentation health scorecard, A-F grade, and missing section boilerplate',
      icon: 'verified_user',
      category: 'Studio',
      action: () => handleOpenStudioTab?.('audit.studio')
    },
    {
      id: 'contributors-studio',
      title: 'Open Contributor & Team Studio Tab',
      description: 'All-Contributors table, avatar matrix, and role badges',
      icon: 'group',
      category: 'Studio',
      action: () => handleOpenStudioTab?.('contributors.studio')
    },
    {
      id: 'changelog-studio',
      title: 'Open Changelog & Release Notes Tab',
      description: 'Keep-a-Changelog standard release notes with SemVer bumping',
      icon: 'history',
      category: 'Studio',
      action: () => handleOpenStudioTab?.('changelog.studio')
    },
    {
      id: 'studio.icons',
      title: 'Open Icons & Emoji Studio Tab',
      description: 'Curated developer emojis, GitHub shortcodes, vector symbols, and heading decorators',
      icon: 'sentiment_satisfied',
      category: 'Studio',
      shortcut: getBindingKey('studio.icons', 'Ctrl + Shift + E'),
      action: () => handleOpenStudioTab?.('icons.studio')
    },
    {
      id: 'edit.find',
      title: 'Edit: Find in Document',
      description: 'Search and replace text in current document',
      icon: 'find_replace',
      category: 'Editor',
      shortcut: getBindingKey('edit.find', 'Ctrl + F'),
      action: () => {
        setFindReplaceMode?.('find')
        setFindReplaceOpen?.(true)
      }
    },
    {
      id: 'edit.replace',
      title: 'Edit: Find and Replace',
      description: 'Search and replace text in current document',
      icon: 'find_replace',
      category: 'Editor',
      shortcut: getBindingKey('edit.replace', 'Ctrl + H'),
      action: () => {
        setFindReplaceMode?.('replace')
        setFindReplaceOpen?.(true)
      }
    },
    {
      id: 'editor.addCursorAbove',
      title: 'Add Cursor Above',
      description: 'Insert additional cursor on the line above',
      icon: 'arrow_upward',
      category: 'Editor',
      shortcut: getBindingKey('editor.addCursorAbove', 'Ctrl + Alt + Up'),
      action: () => {
        window.activeMonacoEditor?.trigger('commandPalette', 'editor.action.insertCursorAbove')
      }
    },
    {
      id: 'editor.addCursorBelow',
      title: 'Add Cursor Below',
      description: 'Insert additional cursor on the line below',
      icon: 'arrow_downward',
      category: 'Editor',
      shortcut: getBindingKey('editor.addCursorBelow', 'Ctrl + Alt + Down'),
      action: () => {
        window.activeMonacoEditor?.trigger('commandPalette', 'editor.action.insertCursorBelow')
      }
    },
    {
      id: 'editor.changeAllOccurrences',
      title: 'Change All Occurrences',
      description: 'Select all instances of current word for multi-cursor editing',
      icon: 'find_in_page',
      category: 'Editor',
      shortcut: getBindingKey('editor.changeAllOccurrences', 'Ctrl + F2'),
      action: () => {
        window.activeMonacoEditor?.trigger('commandPalette', 'editor.action.changeAll')
      }
    },
    {
      id: 'editor.formatDocument',
      title: 'Format Document',
      description: 'Format and beautify document syntax',
      icon: 'format_align_left',
      category: 'Editor',
      shortcut: getBindingKey('editor.formatDocument', 'Shift + Alt + F'),
      action: () => {
        window.activeMonacoEditor?.trigger('commandPalette', 'editor.action.formatDocument')
      }
    },
    {
      id: 'editor.toggleWordWrap',
      title: 'Toggle Word Wrap',
      description: 'Toggle soft word wrap in code editor',
      icon: 'wrap_text',
      category: 'Editor',
      shortcut: getBindingKey('editor.toggleWordWrap', 'Alt + Z'),
      action: () => {
        setWordWrap?.((prev) => !prev)
      }
    },
    {
      id: 'clear-draft',
      title: 'Reset Active Markdown Buffer',
      description: 'Clear the current file content',
      icon: 'delete_sweep',
      category: 'Danger',
      action: handleClear
    },
    {
      id: 'toggle-output',
      title: 'View: Toggle Output & Logs Panel',
      description: 'View IDE daemon and system output logs',
      icon: 'output',
      category: 'View',
      shortcut: 'Ctrl+`',
      action: () => handleToggleBottomPanel?.('output')
    },
    {
      id: 'toggle-problems',
      title: 'View: Toggle Problems Diagnostics',
      description: 'View markdown syntax errors and warnings',
      icon: 'error_outline',
      category: 'View',
      shortcut: 'Ctrl+J',
      action: () => handleToggleBottomPanel?.('problems')
    },
    {
      id: 'whats-new',
      title: 'Patch Notes',
      description: 'View version patch notes, highlights, and update changelog',
      icon: 'description',
      category: 'Help',
      action: handleOpenWhatsNewTab
    },
    {
      id: 'check-updates',
      title: 'Check for Updates...',
      description: 'Check for latest application updates on GitHub',
      icon: 'system_update',
      category: 'Help',
      action: handleCheckForUpdates
    }
  ], [
    activeFile,
    orientation,
    keybindings,
    getBindingKey,
    handleGenerate,
    handleCreateUntitledFile,
    handleSaveNativeFile,
    handleOpenNativeFile,
    handleOpenNativeFolder,
    setIsCloneModalOpen,
    handleCloseWorkspace,
    handleDownloadPdf,
    setViewMode,
    handleCopy,
    handleDownloadActiveFile,
    handleDownloadSuite,
    handleDownloadHtml,
    setSidebarCollapsed,
    setIsZenMode,
    setOrientation,
    handleOpenShortcutsTab,
    handleOpenSettingsTab,
    handleOpenStudioTab,
    setFindReplaceMode,
    setFindReplaceOpen,
    setWordWrap,
    handleClear,
    handleToggleBottomPanel,
    handleOpenWhatsNewTab,
    handleCheckForUpdates
  ])

  return commands
}
