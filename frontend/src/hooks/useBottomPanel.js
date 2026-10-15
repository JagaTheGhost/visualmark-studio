import { useState, useCallback } from 'react'

export function useBottomPanel() {
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false)
  const [activeBottomTab, setActiveBottomTab] = useState('problems') // 'problems' | 'output'
  const [systemLogs, setSystemLogs] = useState(() => [
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      channel: 'system',
      type: 'info',
      message: 'VisualMark Studio Desktop IDE daemon initialized.'
    },
    {
      id: 2,
      time: new Date().toLocaleTimeString(),
      channel: 'system',
      type: 'info',
      message: 'Diagnostics and System Output pipelines ready.'
    }
  ])

  const handleToggleBottomPanel = useCallback((tab = null) => {
    setIsBottomPanelOpen((prev) => {
      if (!prev) {
        if (tab) setActiveBottomTab(tab)
        return true
      }
      if (tab && activeBottomTab !== tab) {
        setActiveBottomTab(tab)
        return true
      }
      return false
    })
  }, [activeBottomTab])

  const addSystemLog = useCallback((message, type = 'info', channel = 'system') => {
    setSystemLogs((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString(),
        channel,
        type,
        message
      }
    ])
  }, [])

  const clearSystemLogs = useCallback(() => {
    setSystemLogs([])
  }, [])

  return {
    isBottomPanelOpen,
    setIsBottomPanelOpen,
    activeBottomTab,
    setActiveBottomTab,
    systemLogs,
    setSystemLogs,
    handleToggleBottomPanel,
    addSystemLog,
    clearSystemLogs
  }
}
