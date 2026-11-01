/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    platform?: string
    isElectron?: boolean
    appVersion?: string
    readFile?: (path: string) => Promise<any>
    saveDirectFile?: (path: string, content: string) => Promise<any>
    deleteFileDirect?: (path: string) => Promise<any>
    createFileDirect?: (path: string, content: string) => Promise<any>
    readLocalMedia?: (path: string) => Promise<any>
    openFileDialog?: () => Promise<any>
    openFolderDialog?: () => Promise<any>
    saveFileDialog?: (options: any) => Promise<any>
    openExternalUrl?: (url: string) => Promise<any>
    openPathInOs?: (path: string) => Promise<any>
    showItemInFolder?: (path: string) => Promise<any>
    checkForUpdates?: () => Promise<any>
    downloadUpdate?: () => Promise<any>
    quitAndInstall?: () => Promise<any>
    onUpdateProgress?: (cb: (progress: any) => void) => () => void
    onUpdateDownloaded?: (cb: (info: any) => void) => () => void
    onUpdateError?: (cb: (err: any) => void) => () => void
    onOpenExternalFile?: (cb: (file: any) => void) => () => void
    setWorkspaceActive?: (folderPath: string) => Promise<any>
    getDefaultWorkspace?: () => Promise<any>
    [key: string]: any
  }
}

