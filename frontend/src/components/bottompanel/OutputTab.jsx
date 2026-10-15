import React from 'react'

export default function OutputTab({
  outputChannel = 'system',
  systemLogs = [],
  channelData = {}
}) {
  const currentLogs = outputChannel === 'system' ? systemLogs : (channelData[outputChannel] || [])

  return (
    <div className="panel-output-view custom-scrollbar">
      {outputChannel === 'system' ? (
        systemLogs.length === 0 ? (
          <div className="output-empty-state">
            No output logged for channel "VisualMark Studio (System)".
          </div>
        ) : (
          systemLogs.map((log, idx) => (
            <div key={idx} className="output-log-line">
              <span className="output-time">[{log.time || new Date().toLocaleTimeString()}]</span>
              <span className="output-tag">[System]</span>
              <span>{log.message || log}</span>
            </div>
          ))
        )
      ) : currentLogs.length === 0 ? (
        <div className="output-empty-state">
          No output logged for channel "{outputChannel}". Click Refresh above to poll data.
        </div>
      ) : (
        currentLogs.map((log, idx) => (
          <div key={idx} className="output-log-line">
            <span className="output-time">[{log.time || new Date().toLocaleTimeString()}]</span>
            <span className="output-tag">[{outputChannel.toUpperCase()}]</span>
            <span>{log.message || log}</span>
          </div>
        ))
      )}
    </div>
  )
}
