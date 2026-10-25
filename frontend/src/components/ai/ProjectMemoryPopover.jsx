import React, { useState } from 'react'

/**
 * VisualMark Studio — Project Memory Popover
 * ==============================================================================
 * Displays and allows user to edit active project's memory (profile, rules, facts, milestones).
 * ==============================================================================
 */
export default function ProjectMemoryPopover({
  popoverRef,
  workspacePath,
  memory,
  onUpdateMemory,
  onClose,
  onRescanProfile
}) {
  const [activeTab, setActiveTab] = useState('rules') // 'rules' | 'profile' | 'facts' | 'milestones'
  const [newRuleText, setNewRuleText] = useState('')
  const [newFactText, setNewFactText] = useState('')

  const handleAddRule = (e) => {
    e?.preventDefault()
    const trimmed = newRuleText.trim()
    if (!trimmed) return
    const updated = {
      ...memory,
      rules: [...(memory.rules || []), trimmed]
    }
    onUpdateMemory(updated)
    setNewRuleText('')
  }

  const handleDeleteRule = (idx) => {
    const updatedRules = (memory.rules || []).filter((_, i) => i !== idx)
    onUpdateMemory({ ...memory, rules: updatedRules })
  }

  const handleAddFact = (e) => {
    e?.preventDefault()
    const trimmed = newFactText.trim()
    if (!trimmed) return
    const updated = {
      ...memory,
      learnedFacts: [...(memory.learnedFacts || []), trimmed]
    }
    onUpdateMemory(updated)
    setNewFactText('')
  }

  const handleDeleteFact = (idx) => {
    const updatedFacts = (memory.learnedFacts || []).filter((_, i) => i !== idx)
    onUpdateMemory({ ...memory, learnedFacts: updatedFacts })
  }

  const handleDeleteMilestone = (idx) => {
    const updatedSessions = (memory.recentSessions || []).filter((_, i) => i !== idx)
    onUpdateMemory({ ...memory, recentSessions: updatedSessions })
  }

  const handleClearMemory = () => {
    if (window.confirm('Reset all saved memory and learned rules for this project?')) {
      onUpdateMemory({
        ...memory,
        profile: { techStack: [], summary: '', updatedAt: null },
        rules: [],
        learnedFacts: [],
        recentSessions: []
      })
    }
  }

  const rulesCount = memory.rules?.length || 0
  const factsCount = memory.learnedFacts?.length || 0
  const stack = memory.profile?.techStack || []

  return (
    <div className="ai-memory-popover" ref={popoverRef}>
      {/* Popover Header */}
      <div className="ai-memory-popover-header">
        <div className="ai-memory-header-left">
          <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#818cf8' }}>psychology</span>
          <span className="ai-memory-header-title">Project Memory</span>
          <span className="ai-memory-project-tag" title={workspacePath || 'No workspace opened'}>
            {memory.projectName || 'Project'}
          </span>
        </div>
        <button
          type="button"
          className="ai-history-item-delete"
          onClick={onClose}
          title="Close memory viewer"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>close</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="ai-memory-tabs">
        <button
          type="button"
          className={`ai-memory-tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          <span>Rules</span>
          {rulesCount > 0 && <span className="ai-memory-count-badge">{rulesCount}</span>}
        </button>
        <button
          type="button"
          className={`ai-memory-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span>Profile</span>
          {stack.length > 0 && <span className="ai-memory-count-badge">{stack.length}</span>}
        </button>
        <button
          type="button"
          className={`ai-memory-tab ${activeTab === 'facts' ? 'active' : ''}`}
          onClick={() => setActiveTab('facts')}
        >
          <span>Facts</span>
          {factsCount > 0 && <span className="ai-memory-count-badge">{factsCount}</span>}
        </button>
        <button
          type="button"
          className={`ai-memory-tab ${activeTab === 'milestones' ? 'active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <span>Milestones</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="ai-memory-body custom-scrollbar">
        {/* TAB 1: RULES & CONVENTIONS */}
        {activeTab === 'rules' && (
          <div className="ai-memory-section">
            <div className="ai-memory-hint">
              VMarks will always follow these instructions when writing docs or proposing diffs for this project.
            </div>

            <form onSubmit={handleAddRule} className="ai-memory-add-form">
              <input
                type="text"
                className="ai-memory-input"
                placeholder="e.g. Always use flowchart TD for architecture..."
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
              />
              <button
                type="submit"
                className="ai-memory-add-btn"
                disabled={!newRuleText.trim()}
                title="Add custom rule"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>
                <span>Add</span>
              </button>
            </form>

            <div className="ai-memory-items-list">
              {memory.rules && memory.rules.length > 0 ? (
                memory.rules.map((rule, idx) => (
                  <div key={idx} className="ai-memory-item">
                    <span className="material-symbols-outlined ai-memory-bullet">rule</span>
                    <span className="ai-memory-item-text">{rule}</span>
                    <button
                      type="button"
                      className="ai-memory-item-del-btn"
                      onClick={() => handleDeleteRule(idx)}
                      title="Delete rule"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="ai-memory-empty">
                  No rules configured yet. Type a rule above or tell VMarks in chat: <em>"Remember that..."</em>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TECH PROFILE */}
        {activeTab === 'profile' && (
          <div className="ai-memory-section">
            <div className="ai-memory-hint">
              Detected technologies and architectural description for this workspace.
            </div>

            <div className="ai-memory-profile-block">
              <div className="ai-memory-block-label">Detected Tech Stack:</div>
              <div className="ai-memory-chips-wrap">
                {stack.length > 0 ? (
                  stack.map((tech, i) => (
                    <span key={i} className="ai-memory-tech-chip">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="ai-memory-empty-chip">No manifests scanned yet</span>
                )}
              </div>
            </div>

            {memory.profile?.summary && (
              <div className="ai-memory-profile-block">
                <div className="ai-memory-block-label">Project Summary:</div>
                <div className="ai-memory-summary-box">{memory.profile.summary}</div>
              </div>
            )}

            <button
              type="button"
              className="ai-memory-action-btn"
              onClick={onRescanProfile}
              title="Rescan package.json / requirements.txt to detect tech stack"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>sync</span>
              <span>Re-scan Workspace Manifests</span>
            </button>
          </div>
        )}

        {/* TAB 3: LEARNED FACTS */}
        {activeTab === 'facts' && (
          <div className="ai-memory-section">
            <div className="ai-memory-hint">
              Facts and decisions VMarks learned from your conversations.
            </div>

            <form onSubmit={handleAddFact} className="ai-memory-add-form">
              <input
                type="text"
                className="ai-memory-input"
                placeholder="e.g. Project licensed under MIT..."
                value={newFactText}
                onChange={(e) => setNewFactText(e.target.value)}
              />
              <button
                type="submit"
                className="ai-memory-add-btn"
                disabled={!newFactText.trim()}
                title="Add fact"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>add</span>
                <span>Add</span>
              </button>
            </form>

            <div className="ai-memory-items-list">
              {memory.learnedFacts && memory.learnedFacts.length > 0 ? (
                memory.learnedFacts.map((fact, idx) => (
                  <div key={idx} className="ai-memory-item">
                    <span className="material-symbols-outlined ai-memory-bullet">lightbulb</span>
                    <span className="ai-memory-item-text">{fact}</span>
                    <button
                      type="button"
                      className="ai-memory-item-del-btn"
                      onClick={() => handleDeleteFact(idx)}
                      title="Delete fact"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="ai-memory-empty">
                  No learned facts yet. As you chat, VMarks will automatically remember key project decisions.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: RECENT MILESTONES */}
        {activeTab === 'milestones' && (
          <div className="ai-memory-section">
            <div className="ai-memory-hint">
              Summaries of recent chat sessions and documentation milestones.
            </div>

            <div className="ai-memory-items-list">
              {memory.recentSessions && memory.recentSessions.length > 0 ? (
                memory.recentSessions.map((milestone, idx) => (
                  <div key={idx} className="ai-memory-item">
                    <span className="material-symbols-outlined ai-memory-bullet">history_edu</span>
                    <div className="ai-memory-item-milestone-wrap">
                      <span className="ai-memory-item-text">
                        {typeof milestone === 'string' ? milestone : milestone.summary}
                      </span>
                      {milestone.timestamp && (
                        <span className="ai-memory-time-tag">
                          {new Date(milestone.timestamp).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="ai-memory-item-del-btn"
                      onClick={() => handleDeleteMilestone(idx)}
                      title="Delete milestone"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="ai-memory-empty">
                  No session milestones recorded yet. When you complete chat sessions, summaries will appear here.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Popover Footer */}
      <div className="ai-history-popover-footer">
        <button
          type="button"
          className="ai-history-footer-btn"
          onClick={handleClearMemory}
          title="Reset project memory"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>delete_sweep</span>
          <span>Clear Memory</span>
        </button>
        <span className="ai-memory-status-text">
          {rulesCount + factsCount} items remembered
        </span>
      </div>
    </div>
  )
}
