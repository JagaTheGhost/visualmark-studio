import { useMemo, useCallback } from 'react'
import { THEMES } from '../themes/themeRegistry'
import { openAboutModal, openSponsorUrl } from '../utils/sponsorGratitude'

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
  setViewMode,
  handleCopy,
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
  handleCheckForUpdates,
  setThemeMode,
  toggleThemeMode,
  handleOpenWelcome,
  handleOpenSampleDoc,
  handleOpenQuickSetup
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
      shortcut: getBindingKey('git.clone', ''),
      action: () => setIsCloneModalOpen?.(true)
    },
    {
      id: 'file.closeWorkspace',
      title: 'File: Close Workspace',
      description: 'Close active workspace folder and return to Welcome Launcher',
      icon: 'close',
      category: 'File',
      shortcut: getBindingKey('file.closeWorkspace', 'Ctrl + Shift + W'),
      action: handleCloseWorkspace
    },
    {
      id: 'view.split',
      title: 'View: Split Editor & Preview',
      description: '50/50 Code Editor and GitHub preview',
      icon: 'vertical_split',
      category: 'Layout',
      shortcut: getBindingKey('view.split', ''),
      action: () => setViewMode?.('split')
    },
    {
      id: 'view.editor',
      title: 'View: Editor Only',
      description: 'Maximize raw code editor space',
      icon: 'code',
      category: 'Layout',
      shortcut: getBindingKey('view.editor', ''),
      action: () => setViewMode?.('editor')
    },
    {
      id: 'view.preview',
      title: 'View: Preview Only',
      description: 'Read-only GitHub formatted documentation view',
      icon: 'visibility',
      category: 'Layout',
      shortcut: getBindingKey('view.preview', ''),
      action: () => setViewMode?.('preview')
    },
    {
      id: 'edit.copyMarkdown',
      title: `Copy ${activeFile || 'README.md'} Markdown`,
      description: 'Copy active markdown text to system clipboard',
      icon: 'content_copy',
      category: 'Clipboard',
      shortcut: getBindingKey('edit.copyMarkdown', 'Ctrl + Shift + C'),
      action: handleCopy
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
      id: 'view.toggleZen',
      title: 'Toggle Zen / Focus Mode',
      description: 'Hide sidebar and chrome for distraction-free writing',
      icon: 'fullscreen',
      category: 'Layout',
      shortcut: getBindingKey('view.toggleZen', 'F11'),
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
      id: 'pref.toggleTheme',
      title: 'Preferences: Toggle Light / Dark Mode',
      description: 'Switch between preferred Light and Dark themes',
      icon: 'brightness_medium',
      category: 'Preferences',
      shortcut: getBindingKey('pref.toggleTheme', 'Ctrl + Alt + T'),
      action: toggleThemeMode
    },
    ...THEMES.map((theme) => ({
      id: `pref.theme.${theme.id}`,
      title: `Preferences: Color Theme: ${theme.name}`,
      description: theme.description,
      icon: 'palette',
      category: 'Preferences',
      action: () => setThemeMode?.(theme.id)
    })),
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
      id: 'studio.tree',
      title: 'Open Directory Tree Studio Tab',
      description: 'Visual ASCII, Unicode, and Emoji folder tree generator',
      icon: 'account_tree',
      category: 'Studio',
      shortcut: getBindingKey('studio.tree', 'Ctrl + Shift + D'),
      action: () => handleOpenStudioTab?.('tree.studio')
    },
    {
      id: 'studio.api',
      title: 'Open API & Endpoints Studio Tab',
      description: 'Interactive REST route designer with parameter matrix and cURL',
      icon: 'api',
      category: 'Studio',
      shortcut: getBindingKey('studio.api', 'Ctrl + Shift + A'),
      action: () => handleOpenStudioTab?.('api.studio')
    },
    {
      id: 'studio.audit',
      title: 'Open README Auditor & Linter Tab',
      description: 'Documentation health scorecard, A-F grade, and missing section boilerplate',
      icon: 'verified_user',
      category: 'Studio',
      shortcut: getBindingKey('studio.audit', 'Ctrl + Shift + U'),
      action: () => handleOpenStudioTab?.('audit.studio')
    },
    {
      id: 'studio.contributors',
      title: 'Open Contributor & Team Studio Tab',
      description: 'All-Contributors table, avatar matrix, and role badges',
      icon: 'group',
      category: 'Studio',
      shortcut: getBindingKey('studio.contributors', 'Ctrl + Shift + R'),
      action: () => handleOpenStudioTab?.('contributors.studio')
    },
    {
      id: 'studio.changelog',
      title: 'Open Changelog & Release Notes Tab',
      description: 'Keep-a-Changelog standard release notes with SemVer bumping',
      icon: 'history',
      category: 'Studio',
      shortcut: getBindingKey('studio.changelog', 'Ctrl + Shift + L'),
      action: () => handleOpenStudioTab?.('changelog.studio')
    },
    {
      id: 'studio.icons',
      title: 'Open Icons & Emoji Studio Tab',
      description: 'Curated developer emojis, GitHub shortcodes, vector symbols, and heading decorators',
      icon: 'sentiment_satisfied',
      category: 'Studio',
      shortcut: getBindingKey('studio.icons', 'Ctrl + Shift + Y'),
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
      id: 'file.clearDraft',
      title: 'Reset Active Markdown Buffer',
      description: 'Clear the current file content',
      icon: 'delete_sweep',
      category: 'Danger',
      shortcut: getBindingKey('file.clearDraft', ''),
      action: handleClear
    },
    {
      id: 'view.output',
      title: 'View: Toggle Output & Logs Panel',
      description: 'View IDE daemon and system output logs',
      icon: 'output',
      category: 'View',
      shortcut: getBindingKey('view.output', 'Ctrl + `'),
      action: () => handleToggleBottomPanel?.('output')
    },
    {
      id: 'view.problems',
      title: 'View: Toggle Problems Diagnostics',
      description: 'View markdown syntax errors and warnings',
      icon: 'error_outline',
      category: 'View',
      shortcut: getBindingKey('view.problems', 'Ctrl + J'),
      action: () => handleToggleBottomPanel?.('problems')
    },
    {
      id: 'help.whatsNew',
      title: 'Patch Notes',
      description: 'View version patch notes, highlights, and update changelog',
      icon: 'description',
      category: 'Help',
      shortcut: getBindingKey('help.whatsNew', ''),
      action: handleOpenWhatsNewTab
    },
    {
      id: 'help.checkUpdates',
      title: 'Check for Updates...',
      description: 'Check for latest application updates on GitHub',
      icon: 'system_update',
      category: 'Help',
      shortcut: getBindingKey('help.checkUpdates', ''),
      action: handleCheckForUpdates
    },
    {
      id: 'help.welcome',
      title: 'Help: Welcome & Getting Started',
      description: 'Open the first-run welcome and onboarding dashboard',
      icon: 'waving_hand',
      category: 'Help',
      shortcut: getBindingKey('help.welcome', ''),
      action: handleOpenWelcome
    },
    {
      id: 'help.openPlayground',
      title: 'Help: Open Interactive Playground',
      description: 'Open sample document with live Mermaid diagrams, badges, and tables',
      icon: 'play_circle',
      category: 'Help',
      shortcut: getBindingKey('help.openPlayground', ''),
      action: handleOpenSampleDoc
    },
    {
      id: 'help.quickSetup',
      title: 'Help: Run Workspace Setup Wizard',
      description: 'Re-open 1st-time onboarding setup popup to configure theme, engine & layout',
      icon: 'magic_button',
      category: 'Help',
      shortcut: getBindingKey('help.quickSetup', ''),
      action: handleOpenQuickSetup
    },
    {
      id: 'help.about',
      title: 'Help: About VisualMark Studio',
      description: 'View architecture specs, live ecosystem diagram, and project information',
      icon: 'info',
      category: 'Help',
      shortcut: getBindingKey('help.about', ''),
      action: openAboutModal
    },
    {
      id: 'help.sponsor',
      title: 'Help: Sponsor @JagaTheGhost on GitHub',
      description: 'Support independent, local-first development of VisualMark Studio on GitHub Sponsors',
      icon: 'favorite',
      category: 'Help',
      shortcut: getBindingKey('help.sponsor', ''),
      action: openSponsorUrl
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
      setViewMode,
    handleCopy,
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
    handleCheckForUpdates,
    setThemeMode,
    toggleThemeMode,
    handleOpenWelcome,
    handleOpenSampleDoc,
    handleOpenQuickSetup
  ])

  return commands
}
