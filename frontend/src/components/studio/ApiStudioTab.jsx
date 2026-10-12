import React, { useState, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useStudioSplit } from '../../utils/useResizableSplit'

const API_PRESETS = [
  {
    id: 'auth-login',
    title: 'User Login & JWT Auth',
    method: 'POST',
    path: '/api/v1/auth/login',
    summary: 'Authenticate user with email and password to receive JWT bearer token.',
    auth: 'None (Public)',
    params: [
      { name: 'email', in: 'body', type: 'string', required: true, desc: 'User registered email address', example: 'alex@example.com' },
      { name: 'password', in: 'body', type: 'string', required: true, desc: 'Account secret password', example: '••••••••' }
    ],
    requestBody: JSON.stringify({ email: 'alex@example.com', password: 'secretpassword123' }, null, 2),
    statusCode: '200 OK',
    responseBody: JSON.stringify({ token: 'eyJhbGciOiJIUzI1NiIsIn...', user: { id: 'usr_981', email: 'alex@example.com' } }, null, 2)
  },
  {
    id: 'user-profile',
    title: 'Get User Profile',
    method: 'GET',
    path: '/api/v1/users/{userId}',
    summary: 'Retrieve user profile, preferences, and account metadata by user ID.',
    auth: 'Bearer JWT',
    params: [
      { name: 'userId', in: 'path', type: 'string', required: true, desc: 'Unique alphanumeric identifier', example: 'usr_981' },
      { name: 'include_teams', in: 'query', type: 'boolean', required: false, desc: 'Hydrate team associations', example: 'true' }
    ],
    requestBody: '',
    statusCode: '200 OK',
    responseBody: JSON.stringify({ id: 'usr_981', name: 'Alex Developer', role: 'admin', active: true }, null, 2)
  },
  {
    id: 'create-item',
    title: 'Create Resource Item',
    method: 'POST',
    path: '/api/v1/projects',
    summary: 'Create and deploy a new workspace project repository.',
    auth: 'Bearer JWT',
    params: [
      { name: 'name', in: 'body', type: 'string', required: true, desc: 'Human-readable project name', example: 'NextGen Analytics' },
      { name: 'visibility', in: 'body', type: 'string', required: false, desc: 'public or private', example: 'private' }
    ],
    requestBody: JSON.stringify({ name: 'NextGen Analytics', visibility: 'private', tags: ['saas', 'telemetry'] }, null, 2),
    statusCode: '201 Created',
    responseBody: JSON.stringify({ id: 'prj_001', name: 'NextGen Analytics', created_at: '2026-10-10T12:00:00Z' }, null, 2)
  },
  {
    id: 'health',
    title: 'Service Health Check',
    method: 'GET',
    path: '/api/health',
    summary: 'Liveness and database connectivity ping for orchestrator monitoring.',
    auth: 'None (Public)',
    params: [],
    requestBody: '',
    statusCode: '200 OK',
    responseBody: JSON.stringify({ status: 'ok', uptime_seconds: 48291, database: 'connected' }, null, 2)
  }
]

export default function ApiStudioTab({
  onInsertApi = () => {},
  onBackToReadme = () => {}
}) {
  const [method, setMethod] = useState('POST')
  const [path, setPath] = useState('/api/v1/auth/login')
  const [summary, setSummary] = useState('Authenticate user and obtain a JWT session token.')
  const [authType, setAuthType] = useState('Bearer JWT')
  const [outputTab, setOutputTab] = useState('table')
  const [copied, setCopied] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')

  // View Mode: 'both' | 'preview' | 'code'
  const [previewMode, setPreviewMode] = useState('both')
  // Render Style in preview: 'blueprint' (Interactive Swagger/REST Blueprint) | 'markdown' (GitHub GFM Render)
  const [renderStyle, setRenderStyle] = useState('blueprint')

  const { formWidth, isDragging, handleMouseDown, handleDoubleClick } = useStudioSplit(480)

  const [params, setParams] = useState([
    { name: 'email', in: 'body', type: 'string', required: true, desc: 'User registered email', example: 'developer@example.com' },
    { name: 'password', in: 'body', type: 'string', required: true, desc: 'Account secret password', example: '••••••••' }
  ])

  const [requestBody, setRequestBody] = useState(
    JSON.stringify({ email: 'developer@example.com', password: 'supersecretpassword' }, null, 2)
  )
  const [statusCode, setStatusCode] = useState('200 OK')
  const [responseBody, setResponseBody] = useState(
    JSON.stringify({ success: true, token: 'eyJhGciOiJIUzI1Ni...', expires_in: 3600 }, null, 2)
  )

  const handleLoadPreset = (preset) => {
    setMethod(preset.method)
    setPath(preset.path)
    setSummary(preset.summary)
    setAuthType(preset.auth)
    setParams(preset.params)
    setRequestBody(preset.requestBody)
    setStatusCode(preset.statusCode)
    setResponseBody(preset.responseBody)
  }

  const handleAddParam = () => {
    setParams((prev) => [
      ...prev,
      { name: `param_${prev.length + 1}`, in: 'query', type: 'string', required: false, desc: '', example: '' }
    ])
  }

  const handleUpdateParam = (index, field, value) => {
    setParams((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleRemoveParam = (index) => {
    setParams((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCopyText = useCallback((text, label = 'Copied') => {
    if (!text) return
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(label)
      setTimeout(() => setCopyFeedback(''), 1800)
    })
  }, [])

  const getStatusPillClass = (code) => {
    if (code.startsWith('2')) return 'success'
    if (code.startsWith('4')) return 'client-error'
    if (code.startsWith('5')) return 'server-error'
    return 'success'
  }

  // Generate cURL command
  const curlSnippet = useMemo(() => {
    let cmd = `curl -X ${method} "https://api.yourdomain.com${path}"`
    if (authType === 'Bearer JWT') {
      cmd += ` \\\n  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"`
    } else if (authType === 'API Key') {
      cmd += ` \\\n  -H "X-API-Key: <YOUR_API_KEY>"`
    }
    if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody.replace(/\n/g, ' ')}'`
    }
    return `\`\`\`bash\n${cmd}\n\`\`\``
  }, [method, path, authType, requestBody])

  // Generate JS Fetch snippet
  const jsSnippet = useMemo(() => {
    const headers = { 'Content-Type': 'application/json' }
    if (authType === 'Bearer JWT') headers['Authorization'] = 'Bearer <TOKEN>'
    if (authType === 'API Key') headers['X-API-Key'] = '<KEY>'

    const code = `const response = await fetch("https://api.yourdomain.com${path}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 4)}${['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim() ? `,\n  body: JSON.stringify(${requestBody})` : ''}
});
const data = await response.json();
console.log(data);`

    return `\`\`\`javascript\n${code}\n\`\`\``
  }, [method, path, authType, requestBody])

  // Generate Python snippet
  const pythonSnippet = useMemo(() => {
    const code = `import requests

url = "https://api.yourdomain.com${path}"
headers = {
    "Content-Type": "application/json"${authType === 'Bearer JWT' ? ',\n    "Authorization": "Bearer <TOKEN>"' : ''}${authType === 'API Key' ? ',\n    "X-API-Key": "<KEY>"' : ''}
}
${['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim() ? `payload = ${requestBody.replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None')}\n` : ''}
response = requests.${method.toLowerCase()}(url, headers=headers${['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim() ? ', json=payload' : ''})
print(response.json())`

    return `\`\`\`python\n${code}\n\`\`\``
  }, [method, path, authType, requestBody])

  // Generate Markdown Table representation
  const tableSnippet = useMemo(() => {
    let md = `### \`${method}\` ${path}\n\n`
    md += `> ${summary}\n\n`
    md += `- **Authentication:** \`${authType}\`\n\n`

    if (params.length > 0) {
      md += `#### Parameters\n\n`
      md += `| Name | In | Type | Required | Description |\n`
      md += `| :--- | :---: | :---: | :---: | :--- |\n`
      params.forEach((p) => {
        md += `| \`${p.name}\` | \`${p.in}\` | \`${p.type}\` | ${p.required ? '✅ Yes' : '⚪ No'} | ${p.desc} |\n`
      })
      md += `\n`
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
      md += `#### Request Payload\n\n\`\`\`json\n${requestBody}\n\`\`\`\n\n`
    }

    if (responseBody.trim()) {
      md += `#### Response (\`${statusCode}\`)\n\n\`\`\`json\n${responseBody}\n\`\`\`\n`
    }

    return md
  }, [method, path, summary, authType, params, requestBody, statusCode, responseBody])

  // Generate Collapsible Details block
  const detailsSnippet = useMemo(() => {
    let md = `<details>\n<summary><b><code>${method}</code> ${path}</b> — <i>${summary}</i></summary>\n\n`
    md += `- **Authentication:** \`${authType}\`\n\n`

    if (params.length > 0) {
      md += `##### Parameters\n\n`
      md += `| Name | In | Type | Required | Description |\n`
      md += `| :--- | :---: | :---: | :---: | :--- |\n`
      params.forEach((p) => {
        md += `| \`${p.name}\` | \`${p.in}\` | \`${p.type}\` | ${p.required ? '✅ Yes' : '⚪ No'} | ${p.desc} |\n`
      })
      md += `\n`
    }

    if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
      md += `##### Request Body\n\n\`\`\`json\n${requestBody}\n\`\`\`\n\n`
    }

    if (responseBody.trim()) {
      md += `##### Response (${statusCode})\n\n\`\`\`json\n${responseBody}\n\`\`\`\n`
    }

    md += `</details>\n`
    return md
  }, [method, path, summary, authType, params, requestBody, statusCode, responseBody])

  const activeSnippet = useMemo(() => {
    switch (outputTab) {
      case 'table':
        return tableSnippet
      case 'details':
        return detailsSnippet
      case 'curl':
        return curlSnippet
      case 'js':
        return jsSnippet
      case 'python':
        return pythonSnippet
      default:
        return tableSnippet
    }
  }, [outputTab, tableSnippet, detailsSnippet, curlSnippet, jsSnippet, pythonSnippet])

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = () => {
    onInsertApi(activeSnippet)
  }

  return (
    <div className="studio-tab-view select-none">
      {/* Studio Top Control Strip */}
      <div className="studio-top-bar">
        <div className="studio-bar-left">
          <div className="studio-badge-halo">
            <span className="material-symbols-outlined text-secondary" style={{ color: '#818cf8' }}>
              api
            </span>
          </div>
          <div>
            <div className="studio-title-row">
              <h2 className="studio-title">API & Endpoint Studio Pro</h2>
              <span className="studio-tag" style={{ borderColor: 'rgba(99, 102, 241, 0.4)', color: '#38bdf8' }}>
                REST Blueprint
              </span>
            </div>
            <p className="studio-subtitle">
              Design production API specifications, parameter matrices, and live cURL / fetch snippets.
            </p>
          </div>
        </div>

        <div className="studio-bar-actions">
          {onBackToReadme && (
            <button
              type="button"
              className="btn-studio-secondary"
              onClick={onBackToReadme}
              title="Return to active markdown document"
            >
              <span className="material-symbols-outlined icon-xs">arrow_back</span>
              <span>Back to Editor</span>
            </button>
          )}
          <button
            type="button"
            className="btn-studio-secondary"
            onClick={handleCopy}
            title="Copy current API snippet to clipboard"
          >
            <span className="material-symbols-outlined icon-xs">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
          </button>
          <button
            type="button"
            className="btn-studio-primary"
            onClick={handleInsert}
            title="Insert endpoint specification into an open document at cursor line"
          >
            <span className="material-symbols-outlined icon-xs">add_circle</span>
            <span>Insert into Document</span>
          </button>
        </div>
      </div>

      {/* Main Form & Preview Grid */}
      <div className="studio-content-grid">
        {/* Left Column: API Builder Controls */}
        <div
          className="studio-form-column custom-scrollbar"
          style={{ width: `${formWidth}px`, flexShrink: 0 }}
        >
          {/* Quick Presets */}
          <div className="studio-section">
            <label className="studio-section-label">Quick Endpoint Presets</label>
            <div className="api-presets-grid">
              {API_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`api-preset-card ${path === preset.path && method === preset.method ? 'active' : ''}`}
                  onClick={() => handleLoadPreset(preset)}
                >
                  <span className={`method-badge ${preset.method.toLowerCase()}`}>
                    {preset.method}
                  </span>
                  <div className="api-preset-info">
                    <span className="api-preset-title">{preset.title}</span>
                    <span className="api-preset-path">{preset.path}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Configuration Bar */}
          <div className="studio-section">
            <label className="studio-section-label">HTTP Method & Path Endpoint</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="studio-select"
                style={{ width: '120px', fontWeight: 'bold' }}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input
                type="text"
                className="studio-text-input"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/api/v1/resource/{id}"
                style={{ fontFamily: 'monospace' }}
              />
            </div>

            <div className="studio-input-duo" style={{ marginTop: '10px' }}>
              <div className="studio-field">
                <span className="studio-field-label">Summary / Purpose</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Authenticate user credentials"
                />
              </div>
              <div className="studio-field">
                <span className="studio-field-label">Auth Protocol</span>
                <select
                  className="studio-select"
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value)}
                >
                  <option value="Bearer JWT">Bearer JWT</option>
                  <option value="API Key">X-API-Key</option>
                  <option value="Basic Auth">HTTP Basic</option>
                  <option value="None (Public)">None (Public)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Parameters Builder */}
          <div className="studio-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="studio-section-label" style={{ margin: 0 }}>
                Request Parameters ({params.length})
              </label>
              <button
                type="button"
                className="btn-studio-secondary"
                onClick={handleAddParam}
                style={{ height: '26px', fontSize: '11px', padding: '0 8px' }}
              >
                <span className="material-symbols-outlined icon-xs">add</span>
                <span>Add Param</span>
              </button>
            </div>

            <div className="api-param-grid custom-scrollbar">
              {params.map((p, idx) => (
                <div key={idx} className="api-param-row">
                  <input
                    type="text"
                    className="studio-text-input param-name-input"
                    placeholder="Name"
                    value={p.name}
                    onChange={(e) => handleUpdateParam(idx, 'name', e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '12px', fontFamily: 'monospace' }}
                  />
                  <select
                    className="studio-select"
                    value={p.in}
                    onChange={(e) => handleUpdateParam(idx, 'in', e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    <option value="query">query</option>
                    <option value="path">path</option>
                    <option value="body">body</option>
                    <option value="header">header</option>
                  </select>
                  <select
                    className="studio-select"
                    value={p.type}
                    onChange={(e) => handleUpdateParam(idx, 'type', e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '11px' }}
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="object">object</option>
                    <option value="array">array</option>
                  </select>
                  <input
                    type="text"
                    className="studio-text-input"
                    placeholder="Description"
                    value={p.desc}
                    onChange={(e) => handleUpdateParam(idx, 'desc', e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  />
                  <button
                    type="button"
                    className="modal-close-icon-btn"
                    onClick={() => handleRemoveParam(idx)}
                    title="Remove parameter"
                  >
                    <span className="material-symbols-outlined icon-xs">close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Payload Editor */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="studio-section">
              <label className="studio-section-label">Request Body Payload (JSON)</label>
              <textarea
                className="csv-modal-textarea custom-scrollbar"
                rows={5}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{\n  "key": "value"\n}'
              />
            </div>
          )}

          {/* Response Payload Editor */}
          <div className="studio-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="studio-section-label" style={{ margin: 0 }}>Expected Response Body</label>
              <select
                className="studio-select"
                style={{ width: '130px', height: '28px', fontSize: '11px' }}
                value={statusCode}
                onChange={(e) => setStatusCode(e.target.value)}
              >
                <option value="200 OK">200 OK</option>
                <option value="201 Created">201 Created</option>
                <option value="400 Bad Request">400 Bad Request</option>
                <option value="401 Unauthorized">401 Unauthorized</option>
                <option value="404 Not Found">404 Not Found</option>
                <option value="500 Internal Error">500 Server Error</option>
              </select>
            </div>
            <textarea
              className="csv-modal-textarea custom-scrollbar"
              rows={5}
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              placeholder='{\n  "status": "ok"\n}'
            />
          </div>
        </div>

        {/* Resizer Splitter Handle */}
        <div
          className={`studio-resizer-handle ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          title="Drag to resize form and preview sections • Double-click to reset"
        />

        {/* Right Column: Live Documentation Preview & Code Output Canvas */}
        <div className="studio-preview-column custom-scrollbar" style={{ flex: 1, minWidth: 0 }}>
          {/* View Mode Toolbar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div className="studio-segmented-styles">
              <button
                type="button"
                className={`studio-style-btn ${previewMode === 'preview' ? 'active' : ''}`}
                onClick={() => setPreviewMode('preview')}
                title="Focus on live rendered documentation preview"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span>
                <span>Live Preview</span>
              </button>
              <button
                type="button"
                className={`studio-style-btn ${previewMode === 'both' ? 'active' : ''}`}
                onClick={() => setPreviewMode('both')}
                title="View both live preview and code exporter"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>vertical_split</span>
                <span>Split View</span>
              </button>
              <button
                type="button"
                className={`studio-style-btn ${previewMode === 'code' ? 'active' : ''}`}
                onClick={() => setPreviewMode('code')}
                title="Focus on generated Markdown and code snippets"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>code</span>
                <span>Markdown & Code</span>
              </button>
            </div>

            {previewMode !== 'code' && (
              <div className="studio-segmented-styles" style={{ transform: 'scale(0.92)', transformOrigin: 'right center' }}>
                <button
                  type="button"
                  className={`studio-style-btn ${renderStyle === 'blueprint' ? 'active' : ''}`}
                  onClick={() => setRenderStyle('blueprint')}
                  title="Interactive REST Blueprint Cards"
                >
                  Blueprint View
                </button>
                <button
                  type="button"
                  className={`studio-style-btn ${renderStyle === 'markdown' ? 'active' : ''}`}
                  onClick={() => setRenderStyle('markdown')}
                  title="GitHub Flavored Markdown Live Render"
                >
                  GitHub Render
                </button>
              </div>
            )}
          </div>

          {/* Section 1: Live Rendered API Documentation Card */}
          {previewMode !== 'code' && (
            <div className="studio-card" style={{ marginBottom: previewMode === 'both' ? '12px' : '0' }}>
              <div className="studio-card-header">
                <span className="studio-card-title">Live API Endpoint Documentation</span>
                <span className="studio-card-tag">
                  {renderStyle === 'blueprint' ? 'REST Blueprint' : 'GitHub GFM Render'}
                </span>
              </div>

              {renderStyle === 'blueprint' ? (
                <div className="api-live-preview-box custom-scrollbar">
                  {/* Endpoint Bar */}
                  <div className="api-preview-endpoint-bar">
                    <span className={`method-badge ${method.toLowerCase()}`}>{method}</span>
                    <span className="api-preview-route">{path}</span>
                    <span className="api-preview-auth-pill">
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span>
                      <span>{authType}</span>
                    </span>
                    <button
                      type="button"
                      className="btn-studio-secondary"
                      onClick={() => handleCopyText(path, 'Path Copied!')}
                      style={{ padding: '2px 8px', height: '24px', fontSize: '10px' }}
                      title="Copy endpoint path"
                    >
                      <span className="material-symbols-outlined icon-xs">content_copy</span>
                      <span>{copyFeedback === 'Path Copied!' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Summary Callout */}
                  {summary && (
                    <div className="api-preview-summary-callout">
                      {summary}
                    </div>
                  )}

                  {/* Parameters Table */}
                  <div>
                    <div className="api-preview-section-title">
                      <span>Request Parameters ({params.length})</span>
                    </div>
                    {params.length > 0 ? (
                      <div className="api-preview-table-container">
                        <table className="api-preview-table">
                          <thead>
                            <tr>
                              <th>Parameter</th>
                              <th>In</th>
                              <th>Type</th>
                              <th>Required</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {params.map((p, idx) => (
                              <tr key={idx}>
                                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                                  <code>{p.name}</code>
                                </td>
                                <td>
                                  <span className={`api-param-badge ${p.in}`}>{p.in}</span>
                                </td>
                                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                                  {p.type}
                                </td>
                                <td>
                                  <span className={`api-req-badge ${p.required ? 'required' : 'optional'}`}>
                                    {p.required ? 'Required' : 'Optional'}
                                  </span>
                                </td>
                                <td style={{ color: 'var(--text-secondary)' }}>
                                  {p.desc || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div style={{ padding: '10px 14px', background: 'var(--surface-mid)', borderRadius: '4px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        No request parameters required for this endpoint.
                      </div>
                    )}
                  </div>

                  {/* Request Body Payload (for POST/PUT/PATCH) */}
                  {['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim() && (
                    <div>
                      <div className="api-preview-section-title">
                        <span>Request Body Payload (JSON)</span>
                        <button
                          type="button"
                          className="snippet-copy-btn"
                          onClick={() => handleCopyText(requestBody, 'JSON Copied!')}
                        >
                          <span className="material-symbols-outlined icon-xs">content_copy</span>
                          <span>{copyFeedback === 'JSON Copied!' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="api-preview-json-block custom-scrollbar">
                        <code>{requestBody}</code>
                      </pre>
                    </div>
                  )}

                  {/* Response Body Payload */}
                  {responseBody.trim() && (
                    <div>
                      <div className="api-preview-section-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Expected Response</span>
                          <span className={`api-status-pill ${getStatusPillClass(statusCode)}`}>
                            {statusCode}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="snippet-copy-btn"
                          onClick={() => handleCopyText(responseBody, 'Response Copied!')}
                        >
                          <span className="material-symbols-outlined icon-xs">content_copy</span>
                          <span>{copyFeedback === 'Response Copied!' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="api-preview-json-block custom-scrollbar">
                        <code>{responseBody}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                /* GitHub Markdown Render with ReactMarkdown */
                <div className="table-render-viewport custom-scrollbar" style={{ padding: '16px', backgroundColor: 'var(--surface-base)' }}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      table({ node, children, ...props }) {
                        return (
                          <div className="preview-table-container">
                            <table className="preview-table rendered-markdown-table" {...props}>
                              {children}
                            </table>
                          </div>
                        )
                      }
                    }}
                  >
                    {outputTab === 'details' ? detailsSnippet : tableSnippet}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {/* Section 2: Endpoint Exporter (Markdown & Code) */}
          {previewMode !== 'preview' && (
            <div className="studio-card">
              <div className="studio-card-header">
                <span className="studio-card-title">Endpoint Exporter</span>
                <div className="studio-segmented-styles">
                  <button
                    type="button"
                    className={`studio-style-btn ${outputTab === 'table' ? 'active' : ''}`}
                    onClick={() => setOutputTab('table')}
                  >
                    Table
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${outputTab === 'details' ? 'active' : ''}`}
                    onClick={() => setOutputTab('details')}
                  >
                    &lt;details&gt;
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${outputTab === 'curl' ? 'active' : ''}`}
                    onClick={() => setOutputTab('curl')}
                  >
                    cURL
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${outputTab === 'js' ? 'active' : ''}`}
                    onClick={() => setOutputTab('js')}
                  >
                    Fetch
                  </button>
                  <button
                    type="button"
                    className={`studio-style-btn ${outputTab === 'python' ? 'active' : ''}`}
                    onClick={() => setOutputTab('python')}
                  >
                    Python
                  </button>
                </div>
              </div>

              {/* Generated Code Preview Block */}
              <pre className="studio-code-block custom-scrollbar" style={{ maxHeight: previewMode === 'both' ? '280px' : '480px' }}>
                <code>{activeSnippet}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
