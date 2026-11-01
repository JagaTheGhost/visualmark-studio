import React from 'react'

import appLogo from '../assets/logo.png'



/**

 * WelcomeLauncher

 * Streamlined Workspace Hub for VisualMark Studio.

 * Focuses on essential fast start actions (Open Folder, Clone Repo, Open File, New File, Doc Gen),

 * recent workspaces, integrated studio discovery, and launching the interactive playground.

 * Deep personalization (theme, editor engine comparison, default view) is handled in the

 * 1st-time setup popup and can be re-run anytime via the Quick Setup Wizard.

 */

export default function WelcomeLauncher({

  onCloneRepo = () => {},

  onOpenFolder = () => {},

  onCreateNewDoc = () => {},

  onOpenNativeFile = () => {},

  onOpenConfig = () => {},

  onOpenSampleDoc = () => {},

  onOpenStudioTab = () => {},

  recentWorkspaces = [],

  onOpenRecentWorkspace = () => {},

  onClearRecentWorkspaces = () => {},

  appVersion = '1.1.2',

  showWelcomeOnStartup = true,

  onToggleShowWelcomeOnStartup = () => {},

  onOpenQuickSetup = () => {},

  onOpenSettings = () => {}

}) {

  const studios = [

    {

      id: 'diagrams.studio',

      title: 'Mermaid Diagrams',

      badge: 'Visual Flowcharts',

      icon: 'schema',

      color: '#818cf8',

      desc: 'Flowcharts, sequence, class, state, and ER diagrams with live interactive rendering.'

    },

    {

      id: 'badges.studio',

      title: 'Shields.io Badges',

      badge: 'Status & Stack',

      icon: 'shield',

      color: '#38bdf8',

      desc: 'Visually generate customizable build status, license, and technology stack badges.'

    },

    {

      id: 'tables.studio',

      title: 'Table Designer',

      badge: 'Spreadsheet Grid',

      icon: 'table_chart',

      color: '#34d399',

      desc: 'Visual spreadsheet-style markdown table builder with sorting, alignment, and formatting.'

    },

    {

      id: 'changelog.studio',

      title: 'Changelog Studio',

      badge: 'Keep a Changelog',

      icon: 'history_edu',

      color: '#fbbf24',

      desc: 'Draft and manage semantic versioning release notes and structured project changelogs.'

    },

    {

      id: 'contributors.studio',

      title: 'Contributors Studio',

      badge: 'Team Showcase',

      icon: 'group',

      color: '#38bdf8',

      desc: 'Generate interactive contributor grids, team avatars, and open-source credit showcases.'

    }

  ]



  return (

    <div className="welcome-launcher-container custom-scrollbar">

      <div className="welcome-launcher-card welcome-launcher-embedded">

        {/* Brand Header with App Logo */}

        <div className="welcome-brand-header">

          <div className="welcome-logo-wrap">

            <img

              src={appLogo}

              alt="VisualMark Studio"

              className="welcome-app-logo"

              onError={(e) => {

                e.currentTarget.onerror = null

                if (!e.currentTarget.dataset.fallbackTried) {

                  e.currentTarget.dataset.fallbackTried = 'true'

                  e.currentTarget.src = `${import.meta.env.BASE_URL}logo.png`

                }

              }}

            />

            <div className="welcome-logo-glow" />

          </div>



          <div className="welcome-title-row">

            <h1 className="welcome-app-name">VisualMark Studio</h1>

            <span className="welcome-version-badge">v{appVersion}</span>

          </div>



          <p className="welcome-tagline">

            Professional Markdown Editor, Architecture Visualizer &amp; Documentation Engineering Studio

          </p>

        </div>



        {/* Primary Essentials Fast Start Grid (4 Cards: Open Folder, Clone Repo, Open File, New Document) */}

        <div className="welcome-primary-cards">

          {/* 1. Open Local Folder Card */}

          <button

            type="button"

            className="welcome-card welcome-card-open"

            onClick={onOpenFolder}

            title="Open an existing directory or repository on your computer"

          >

            <div className="welcome-card-icon-wrap icon-amber">

              <span className="material-symbols-outlined">folder_open</span>

            </div>

            <div className="welcome-card-content">

              <div className="welcome-card-title-row">

                <span className="welcome-card-title">Open Folder...</span>

                <span className="welcome-card-badge">Workspace</span>

              </div>

              <p className="welcome-card-desc">

                Open an existing local project folder or documentation repository from disk.

              </p>

            </div>

            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>

          </button>



          {/* 2. Git Clone Card */}

          <button

            type="button"

            className="welcome-card welcome-card-clone"

            onClick={onCloneRepo}

            title="Clone a remote repository from GitHub, GitLab, or any Git remote URL"

          >

            <div className="welcome-card-icon-wrap icon-cyan">

              <span className="material-symbols-outlined">cloud_download</span>

            </div>

            <div className="welcome-card-content">

              <div className="welcome-card-title-row">

                <span className="welcome-card-title">Clone Repository</span>

                <span className="welcome-card-badge">Git Remote</span>

              </div>

              <p className="welcome-card-desc">

                Clone from GitHub, GitLab, or Git URL directly to your machine and start editing.

              </p>

            </div>

            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>

          </button>



          {/* 3. Open Single File Card */}

          <button

            type="button"

            className="welcome-card welcome-card-file"

            onClick={onOpenNativeFile}

            title="Open a single markdown or text file (Ctrl+O)"

          >

            <div className="welcome-card-icon-wrap icon-blue">

              <span className="material-symbols-outlined">description</span>

            </div>

            <div className="welcome-card-content">

              <div className="welcome-card-title-row">

                <span className="welcome-card-title">Open File...</span>

                <span className="welcome-card-badge">Ctrl+O</span>

              </div>

              <p className="welcome-card-desc">

                Open a standalone markdown, documentation, or plain text file.

              </p>

            </div>

            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>

          </button>



          {/* 4. New Blank File Card */}

          <button

            type="button"

            className="welcome-card welcome-card-new"

            onClick={onCreateNewDoc}

            title="Create a new untitled markdown file (Ctrl+N)"

          >

            <div className="welcome-card-icon-wrap icon-emerald">

              <span className="material-symbols-outlined">note_add</span>

            </div>

            <div className="welcome-card-content">

              <div className="welcome-card-title-row">

                <span className="welcome-card-title">New Document</span>

                <span className="welcome-card-badge">Ctrl+N</span>

              </div>

              <p className="welcome-card-desc">

                Create a fresh markdown document with real-time synchronized live preview.

              </p>

            </div>

            <span className="material-symbols-outlined welcome-card-arrow">arrow_forward</span>

          </button>

        </div>



        {/* Featured Playground Banner */}

        <div className="welcome-playground-banner">

          <div className="welcome-playground-content">

            <div className="welcome-playground-header">

              <span className="material-symbols-outlined welcome-playground-icon">rocket_launch</span>

              <span className="welcome-playground-title">Interactive Live Playground</span>

              <span className="welcome-playground-badge">Sample Demo</span>

            </div>

            <p className="welcome-playground-desc">

              New to VisualMark Studio? Open our live sample document pre-loaded with editable Mermaid architecture flowcharts, Shields badges, and rich tables.

            </p>

          </div>

          <button

            type="button"

            className="welcome-playground-btn"

            onClick={onOpenSampleDoc}

            title="Open interactive sample document"

          >

            <span>Open Playground</span>

            <span className="material-symbols-outlined">play_arrow</span>

          </button>

        </div>



        {/* Secondary Quick Action Buttons */}

        <div className="welcome-secondary-actions">

          <button

            type="button"

            className="welcome-sub-btn"

            onClick={onOpenConfig}

            title="Open Documentation Configuration Generator"

          >

            <span className="material-symbols-outlined">tune</span>

            <span>Doc Generator</span>

          </button>



          <button

            type="button"

            className="welcome-sub-btn"

            onClick={onOpenQuickSetup}

            title="Re-open the 15-second Quick Setup Wizard"

          >

            <span className="material-symbols-outlined">magic_button</span>

            <span>Quick Setup Wizard</span>

          </button>



          <button

            type="button"

            className="welcome-sub-btn"

            onClick={() => onOpenSettings?.('appearance')}

            title="Customize themes, fonts, and editor preferences"

          >

            <span className="material-symbols-outlined">palette</span>

            <span>Appearance &amp; Settings</span>

          </button>

        </div>



        {/* Explore Visual Studios Section */}

        <div className="welcome-section welcome-studios-section">

          <div className="welcome-section-header">

            <span className="welcome-section-title">

              <span className="material-symbols-outlined">dashboard_customize</span>

              Explore Visual Studios

            </span>

            <span className="welcome-section-sub">

              Built-in visual authoring tools without typing markdown pipes or raw syntax

            </span>

          </div>



          <div className="welcome-studios-grid">

            {studios.map((st) => (

              <button

                key={st.id}

                type="button"

                className="welcome-studio-card"

                onClick={() => onOpenStudioTab(st.id)}

                title={`Open ${st.title}`}

              >

                <div className="welcome-studio-header">

                  <span className="material-symbols-outlined welcome-studio-icon" style={{ color: st.color }}>

                    {st.icon}

                  </span>

                  <span className="welcome-studio-badge">{st.badge}</span>

                </div>

                <span className="welcome-studio-name">{st.title}</span>

                <p className="welcome-studio-desc">{st.desc}</p>

              </button>

            ))}

          </div>

        </div>



        {/* Recent Workspaces Section (if user has opened workspaces previously) */}

        {recentWorkspaces && recentWorkspaces.length > 0 && (

          <div className="welcome-recent-section">

            <div className="welcome-recent-header">

              <span className="welcome-recent-title">

                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>history</span>

                Recent Workspaces

              </span>

              <button

                type="button"

                className="welcome-recent-clear-btn"

                onClick={onClearRecentWorkspaces}

                title="Clear recent workspaces list"

              >

                Clear History

              </button>

            </div>



            <div className="welcome-recent-list">

              {recentWorkspaces.slice(0, 5).map((ws) => (

                <div

                  key={ws.path}

                  className="welcome-recent-item"

                  onClick={() => onOpenRecentWorkspace(ws.path)}

                  title={`Open workspace: ${ws.path}`}

                  role="button"

                  tabIndex={0}

                  onKeyDown={(e) => {

                    if (e.key === 'Enter' || e.key === ' ') {

                      e.preventDefault()

                      onOpenRecentWorkspace(ws.path)

                    }

                  }}

                >

                  <span className="material-symbols-outlined welcome-recent-icon">folder</span>

                  <div className="welcome-recent-details truncate">

                    <span className="welcome-recent-name">{ws.name}</span>

                    <span className="welcome-recent-path truncate">{ws.path}</span>

                  </div>

                  <span className="material-symbols-outlined welcome-recent-arrow">chevron_right</span>

                </div>

              ))}

            </div>

          </div>

        )}



        {/* Footer Bar: Keyboard Shortcuts + Startup Preference */}

        <div className="welcome-footer-bar">

          <div className="welcome-shortcuts-bar">

            <div className="welcome-shortcut-item">

              <kbd>Ctrl</kbd> + <kbd>K</kbd>

              <span>Command Palette</span>

            </div>

            <div className="welcome-shortcut-item">

              <kbd>Ctrl</kbd> + <kbd>O</kbd>

              <span>Open File</span>

            </div>

            <div className="welcome-shortcut-item">

              <kbd>Ctrl</kbd> + <kbd>N</kbd>

              <span>New Document</span>

            </div>

            <div className="welcome-shortcut-item">

              <kbd>Ctrl</kbd> + <kbd>J</kbd>

              <span>Problems</span>

            </div>

            <div className="welcome-shortcut-item">

              <kbd>Ctrl</kbd> + <kbd>`</kbd>

              <span>Output &amp; Logs</span>

            </div>

          </div>



          <div className="welcome-startup-toggle">

            <label className="welcome-checkbox-label">

              <input

                type="checkbox"

                checked={Boolean(showWelcomeOnStartup)}

                onChange={(e) => onToggleShowWelcomeOnStartup(e.target.checked)}

              />

              <span>Show Welcome page on startup</span>

            </label>

          </div>

        </div>

      </div>

    </div>

  )

}

