import React, { Component } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

class RootErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('VisualMark Studio: Uncaught React error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: '#0d1117',
          color: '#f85149',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          minHeight: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>⚠️</span>
            <h2 style={{ margin: 0, color: '#f85149', fontSize: '20px' }}>VisualMark Studio: UI Startup Exception</h2>
          </div>
          <p style={{ margin: 0, color: '#8b949e', fontSize: '14px' }}>
            A runtime error occurred during rendering. Details below:
          </p>
          <div style={{
            background: '#161b22',
            border: '1px solid #30363d',
            padding: '16px',
            borderRadius: '8px',
            color: '#ff7b72',
            fontFamily: 'monospace',
            fontSize: '13px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6'
          }}>
            {this.state.error?.toString()}
          </div>
          {this.state.error?.stack && (
            <pre style={{
              background: '#161b22',
              border: '1px solid #30363d',
              padding: '16px',
              borderRadius: '8px',
              color: '#8b949e',
              fontSize: '11px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              {this.state.error.stack}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: '#238636',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              ↻ Reload IDE
            </button>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
              style={{
                padding: '10px 20px',
                background: '#21262d',
                color: '#c9d1d9',
                border: '1px solid #30363d',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Reset Session Cache & Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

import { ToastProvider } from './context/ToastContext'
import { I18nProvider } from './i18n/I18nContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <I18nProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </I18nProvider>
    </RootErrorBoundary>
  </React.StrictMode>,
)


