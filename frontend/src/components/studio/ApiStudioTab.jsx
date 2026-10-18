import React, { useState, useMemo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import StudioShell from './common/StudioShell'
import '../../styles/studios/extendedStudios.css'

const API_PRESETS = [
  {
    id: 'auth-login',
    title: 'User Login & JWT Auth',
    method: 'POST',
    path: '/api/v1/auth/login',
    summary: 'Authenticate user with email and password to receive JWT bearer token.',
    auth: 'Bearer JWT',
    params: [
      { name: 'email', in: 'body', type: 'string', required: true, desc: 'Registered user email address', example: 'alex@example.com' },
      { name: 'password', in: 'body', type: 'string', required: true, desc: 'Account secret password', example: '••••••••' }
    ],
    requestBody: JSON.stringify({ email: 'alex@example.com', password: 'secretpassword123' }, null, 2),
    statusCode: '200 OK',
    responseBody: JSON.stringify({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTgxIn0...',
      token_type: 'Bearer',
      expires_in: 86400,
      user: { id: 'usr_981', email: 'alex@example.com', role: 'developer' }
    }, null, 2)
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
    responseBody: JSON.stringify({
      id: 'usr_981',
      name: 'Alex Developer',
      role: 'admin',
      teams: ['Core Infrastructure', 'Frontend'],
      active: true,
      created_at: '2025-04-12T08:30:00Z'
    }, null, 2)
  },
  {
    id: 'create-project',
    title: 'Create Workspace Project',
    method: 'POST',
    path: '/api/v1/projects',
    summary: 'Create and deploy a new workspace project repository.',
    auth: 'Bearer JWT',
    params: [
      { name: 'name', in: 'body', type: 'string', required: true, desc: 'Human-readable project name', example: 'NextGen Analytics' },
      { name: 'visibility', in: 'body', type: 'string', required: false, desc: 'public or private', example: 'private' },
      { name: 'tags', in: 'body', type: 'array', required: false, desc: 'Categorical tags list', example: '["saas", "telemetry"]' }
    ],
    requestBody: JSON.stringify({
      name: 'NextGen Analytics',
      visibility: 'private',
      tags: ['saas', 'telemetry'],
      default_branch: 'main'
    }, null, 2),
    statusCode: '201 Created',
    responseBody: JSON.stringify({
      id: 'prj_001',
      name: 'NextGen Analytics',
      status: 'active',
      created_at: '2026-10-18T10:00:00Z',
      clone_url: 'https://git.yourdomain.com/org/nextgen-analytics.git'
    }, null, 2)
  },
  {
    id: 'update-status',
    title: 'Update Resource Status',
    method: 'PATCH',
    path: '/api/v1/projects/{projectId}/status',
    summary: 'Transition a project between draft, active, archived, or maintenance states.',
    auth: 'Bearer JWT',
    params: [
      { name: 'projectId', in: 'path', type: 'string', required: true, desc: 'Target project UUID', example: 'prj_001' },
      { name: 'status', in: 'body', type: 'string', required: true, desc: 'Target lifecycle status', example: 'archived' },
      { name: 'reason', in: 'body', type: 'string', required: false, desc: 'Optional audit note', example: 'Deprecated v1 codebase' }
    ],
    requestBody: JSON.stringify({
      status: 'archived',
      reason: 'Deprecated v1 codebase migrated to cloud v2'
    }, null, 2),
    statusCode: '200 OK',
    responseBody: JSON.stringify({
      id: 'prj_001',
      status: 'archived',
      updated_at: '2026-10-18T10:15:00Z',
      archived_by: 'usr_981'
    }, null, 2)
  },
  {
    id: 'delete-resource',
    title: 'Delete Resource Item',
    method: 'DELETE',
    path: '/api/v1/projects/{projectId}',
    summary: 'Permanently purge a project and all associated deployment artifacts.',
    auth: 'Bearer JWT',
    params: [
      { name: 'projectId', in: 'path', type: 'string', required: true, desc: 'Target project UUID', example: 'prj_001' },
      { name: 'hard_delete', in: 'query', type: 'boolean', required: false, desc: 'Bypass soft delete trash bin', example: 'false' }
    ],
    requestBody: '',
    statusCode: '204 No Content',
    responseBody: ''
  },
  {
    id: 'paginated-search',
    title: 'Paginated Search & Filter',
    method: 'GET',
    path: '/api/v1/search',
    summary: 'Query documents with full-text fuzzy matching, sorting, and pagination cursors.',
    auth: 'X-API-Key',
    params: [
      { name: 'q', in: 'query', type: 'string', required: true, desc: 'Search keyword query', example: 'docker orchestrator' },
      { name: 'page', in: 'query', type: 'number', required: false, desc: 'Page number index (1-based)', example: '1' },
      { name: 'limit', in: 'query', type: 'number', required: false, desc: 'Results per page (max 100)', example: '25' },
      { name: 'sort', in: 'query', type: 'string', required: false, desc: 'Sort order attribute', example: 'created_at:desc' }
    ],
    requestBody: '',
    statusCode: '200 OK',
    responseBody: JSON.stringify({
      results: [
        { id: 'doc_102', title: 'Docker Orchestration Architecture', score: 0.98 },
        { id: 'doc_105', title: 'Container Security Playbook', score: 0.84 }
      ],
      pagination: { total: 42, page: 1, limit: 25, pages: 2 }
    }, null, 2)
  },
  {
    id: 'stripe-webhook',
    title: 'Inbound Webhook Listener',
    method: 'POST',
    path: '/api/v1/webhooks/stripe',
    summary: 'Receive signed async event notifications from external payment gateways.',
    auth: 'None (Signature Header)',
    params: [
      { name: 'Stripe-Signature', in: 'header', type: 'string', required: true, desc: 'HMAC-SHA256 signature header', example: 't=1697...,v1=45a...' },
      { name: 'event', in: 'body', type: 'object', required: true, desc: 'Serialized event payload', example: '{"id":"evt_1"}' }
    ],
    requestBody: JSON.stringify({
      id: 'evt_3MjjL2LkdIwHu7ix',
      type: 'invoice.payment_succeeded',
      created: 1729238400,
      data: {
        object: {
          id: 'in_1MjjL2LkdIwHu7',
          amount_paid: 4900,
          customer: 'cus_N8x2jK91',
          currency: 'usd',
          status: 'paid'
        }
      }
    }, null, 2),
    statusCode: '200 OK',
    responseBody: JSON.stringify({ received: true, event_id: 'evt_3MjjL2LkdIwHu7ix' }, null, 2)
  },
  {
    id: 'health-ping',
    title: 'Service Health & Liveness',
    method: 'GET',
    path: '/api/health',
    summary: 'Liveness, readiness, and database latency ping for orchestrators.',
    auth: 'None (Public)',
    params: [],
    requestBody: '',
    statusCode: '200 OK',
    responseBody: JSON.stringify({
      status: 'healthy',
      version: '2.4.0',
      uptime_seconds: 48291,
      database: 'connected',
      latency_ms: 1.4
    }, null, 2)
  }
]

const API_MODES = [
  { id: 'table', label: 'Markdown Spec Table', icon: 'table_chart' },
  { id: 'details', label: 'Collapsible Drawer', icon: 'unfold_more' },
  { id: 'curl', label: 'cURL Command', icon: 'terminal' },
  { id: 'fetch', label: 'JS Fetch', icon: 'javascript' },
  { id: 'python', label: 'Python Requests', icon: 'code' }
]

export default function ApiStudioTab({
  onInsertApi = () => {},
  onBackToReadme = () => {}
}) {
  const [method, setMethod] = useState('POST')
  const [path, setPath] = useState('/api/v1/auth/login')
  const [summary, setSummary] = useState('Authenticate user with email and password to receive JWT bearer token.')
  const [authType, setAuthType] = useState('Bearer JWT')
  const [baseUrl, setBaseUrl] = useState('https://api.yourdomain.com')
  const [outputTab, setOutputTab] = useState('table')
  const [selectedPresetId, setSelectedPresetId] = useState('auth-login')

  // Render style: 'blueprint' (Interactive Swagger/REST Blueprint) | 'markdown' (GitHub GFM Live Render)
  const [renderStyle, setRenderStyle] = useState('blueprint')
  const [copyFeedback, setCopyFeedback] = useState('')

  const [params, setParams] = useState([
    { name: 'email', in: 'body', type: 'string', required: true, desc: 'Registered user email address', example: 'alex@example.com' },
    { name: 'password', in: 'body', type: 'string', required: true, desc: 'Account secret password', example: '••••••••' }
  ])

  const [requestBody, setRequestBody] = useState(
    JSON.stringify({ email: 'alex@example.com', password: 'secretpassword123' }, null, 2)
  )
  const [statusCode, setStatusCode] = useState('200 OK')
  const [responseBody, setResponseBody] = useState(
    JSON.stringify({
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTgxIn0...',
      token_type: 'Bearer',
      expires_in: 86400,
      user: { id: 'usr_981', email: 'alex@example.com', role: 'developer' }
    }, null, 2)
  )

  const handleLoadPreset = (preset) => {
    setSelectedPresetId(preset.id)
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

  const handleClearParams = () => {
    setParams([])
  }

  const handlePrettifyJson = (target) => {
    try {
      if (target === 'request') {
        if (!requestBody.trim()) return
        const parsed = JSON.parse(requestBody)
        setRequestBody(JSON.stringify(parsed, null, 2))
      } else {
        if (!responseBody.trim()) return
        const parsed = JSON.parse(responseBody)
        setResponseBody(JSON.stringify(parsed, null, 2))
      }
    } catch (e) {
      setCopyFeedback('Invalid JSON format!')
      setTimeout(() => setCopyFeedback(''), 1800)
    }
  }

  const handleCopyText = useCallback((text, label = 'Copied!') => {
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
    const cleanedBase = baseUrl.replace(/\/$/, '')
    let cmd = `curl -X ${method} "${cleanedBase}${path}"`
    if (authType === 'Bearer JWT') {
      cmd += ` \\\n  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"`
    } else if (authType === 'X-API-Key' || authType === 'API Key') {
      cmd += ` \\\n  -H "X-API-Key: <YOUR_API_KEY>"`
    } else if (authType === 'Basic Auth') {
      cmd += ` \\\n  -u "<USERNAME>:<PASSWORD>"`
    }

    // Add header params if defined
    params.filter((p) => p.in === 'header').forEach((h) => {
      cmd += ` \\\n  -H "${h.name}: ${h.example || '<VALUE>'}"`
    })

    if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody.replace(/\n/g, ' ')}'`
    }
    return `\`\`\`bash\n${cmd}\n\`\`\``
  }, [method, path, baseUrl, authType, params, requestBody])

  // Generate JS Fetch snippet
  const jsSnippet = useMemo(() => {
    const cleanedBase = baseUrl.replace(/\/$/, '')
    const headers = { 'Content-Type': 'application/json' }
    if (authType === 'Bearer JWT') headers['Authorization'] = 'Bearer <TOKEN>'
    if (authType === 'X-API-Key' || authType === 'API Key') headers['X-API-Key'] = '<KEY>'
    params.filter((p) => p.in === 'header').forEach((h) => {
      headers[h.name] = h.example || '<VALUE>'
    })

    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()
    const code = `const response = await fetch("${cleanedBase}${path}", {
  method: "${method}",
  headers: ${JSON.stringify(headers, null, 4)}${hasBody ? `,\n  body: JSON.stringify(${requestBody})` : ''}
});
const data = await response.json();
console.log(data);`

    return `\`\`\`javascript\n${code}\n\`\`\``
  }, [method, path, baseUrl, authType, params, requestBody])

  // Generate Python snippet
  const pythonSnippet = useMemo(() => {
    const cleanedBase = baseUrl.replace(/\/$/, '')
    const headers = ['"Content-Type": "application/json"']
    if (authType === 'Bearer JWT') headers.push('"Authorization": "Bearer <TOKEN>"')
    if (authType === 'X-API-Key' || authType === 'API Key') headers.push('"X-API-Key": "<KEY>"')

    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()
    let pyPayload = ''
    if (hasBody) {
      pyPayload = `payload = ${requestBody.replace(/true/g, 'True').replace(/false/g, 'False').replace(/null/g, 'None')}\n`
    }

    const code = `import requests

url = "${cleanedBase}${path}"
headers = {
    ${headers.join(',\n    ')}
}
${pyPayload}response = requests.${method.toLowerCase()}(
    url,
    headers=headers${hasBody ? ', json=payload' : ''}
)
print(response.json())`

    return `\`\`\`python\n${code}\n\`\`\``
  }, [method, path, baseUrl, authType, requestBody])

  // Generate Markdown Table representation
  const tableSnippet = useMemo(() => {
    let md = `### \`${method}\` ${path}\n\n`
    if (summary) {
      md += `> ${summary}\n\n`
    }
    md += `- **Authentication:** \`${authType}\`\n\n`

    if (params.length > 0) {
      md += `#### Request Parameters\n\n`
      md += `| Name | In | Type | Required | Description |\n`
      md += `| :--- | :---: | :---: | :---: | :--- |\n`
      params.forEach((p) => {
        md += `| \`${p.name}\` | \`${p.in}\` | \`${p.type}\` | ${p.required ? '✅ Yes' : '⚪ No'} | ${p.desc || '—'} |\n`
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
      md += `##### Request Parameters\n\n`
      md += `| Name | In | Type | Required | Description |\n`
      md += `| :--- | :---: | :---: | :---: | :--- |\n`
      params.forEach((p) => {
        md += `| \`${p.name}\` | \`${p.in}\` | \`${p.type}\` | ${p.required ? '✅ Yes' : '⚪ No'} | ${p.desc || '—'} |\n`
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
      case 'fetch':
        return jsSnippet
      case 'python':
        return pythonSnippet
      default:
        return tableSnippet
    }
  }, [outputTab, tableSnippet, detailsSnippet, curlSnippet, jsSnippet, pythonSnippet])

  const getCodeLanguage = () => {
    if (outputTab === 'curl') return 'bash'
    if (outputTab === 'fetch') return 'javascript'
    if (outputTab === 'python') return 'python'
    return 'markdown'
  }

  const handleInsert = () => {
    onInsertApi(activeSnippet)
  }

  // Canvas Header Extras: Method Badge, Path Tag, Auth Pill, Render Style Switcher, Copy Path
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {/* Method & Path Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className={`method-badge ${method.toLowerCase()}`} style={{ fontWeight: 800 }}>
          {method}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#38bdf8',
            maxWidth: '180px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={path}
        >
          {path}
        </span>
      </div>

      {/* Auth Pill */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '10.5px',
          padding: '2px 7px',
          borderRadius: '4px',
          background: 'var(--surface-mid, rgba(255,255,255,0.06))',
          border: '1px solid var(--border-color)',
          color: 'var(--text-muted, #94a3b8)',
          fontFamily: 'var(--font-mono, monospace)'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>lock</span>
        <span>{authType}</span>
      </span>

      {/* Copy Path Button */}
      <button
        type="button"
        className="btn-studio-secondary"
        onClick={() => handleCopyText(path, 'Path Copied!')}
        style={{ height: '26px', fontSize: '11px', padding: '0 8px' }}
        title="Copy path route to clipboard"
      >
        <span className="material-symbols-outlined icon-xs">content_copy</span>
        <span>{copyFeedback === 'Path Copied!' ? 'Copied' : 'Copy Path'}</span>
      </button>

      {/* Render Style Toggle */}
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
    </div>
  )

  return (
    <StudioShell
      studioId="api.studio"
      title="API & Endpoint Studio Pro"
      subtitle="Design production REST blueprints, interactive parameter matrices, and multi-language snippets (cURL, Fetch, Python)."
      icon="api"
      accentColor="#0ea5e9"
      badge="REST Blueprint"
      modes={API_MODES}
      activeMode={outputTab}
      onModeChange={setOutputTab}
      markdownCode={activeSnippet}
      codeLanguage={getCodeLanguage()}
      onInsert={handleInsert}
      insertLabel="Insert Endpoint"
      onBackToReadme={onBackToReadme}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={500}
      minSplitWidth={380}
      maxSplitWidth={880}
      inspectorContent={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Quick Blueprints Catalog */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              1 • Quick Blueprint Presets ({API_PRESETS.length})
            </label>
            <div className="badge-styles-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {API_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`badge-style-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleLoadPreset(preset)}
                    style={{ padding: '8px 10px', textAlign: 'left', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className={`method-badge ${preset.method.toLowerCase()}`} style={{ fontSize: '9.5px', padding: '1px 5px' }}>
                        {preset.method}
                      </span>
                      <span style={{ fontSize: '9.5px', color: '#94a3b8', fontFamily: 'var(--font-mono, monospace)' }}>
                        {preset.statusCode.split(' ')[0]}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '11px', color: '#f1f5f9', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {preset.title}
                    </span>
                    <span style={{ fontSize: '9.5px', color: '#64748b', fontFamily: 'monospace', display: 'block', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {preset.path}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Endpoint Route & Protocol */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              2 • Route & Authentication Protocol
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="studio-select"
                style={{ width: '110px', fontWeight: 'bold' }}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="OPTIONS">OPTIONS</option>
                <option value="HEAD">HEAD</option>
              </select>
              <input
                type="text"
                className="studio-text-input"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/api/v1/resource/{id}"
                style={{ fontFamily: 'monospace', flex: 1 }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Summary / Description</span>
                <input
                  type="text"
                  className="studio-text-input"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. Authenticate user credentials"
                  style={{ width: '100%', fontSize: '11px' }}
                />
              </div>
              <div className="studio-field">
                <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Auth Protocol</span>
                <select
                  className="studio-select"
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value)}
                  style={{ width: '100%', fontSize: '11px' }}
                >
                  <option value="Bearer JWT">Bearer JWT</option>
                  <option value="X-API-Key">X-API-Key</option>
                  <option value="Basic Auth">HTTP Basic</option>
                  <option value="OAuth 2.0">OAuth 2.0</option>
                  <option value="None (Public)">None (Public)</option>
                  <option value="None (Signature Header)">Signature Header</option>
                </select>
              </div>
            </div>

            <div className="studio-field" style={{ marginTop: '8px' }}>
              <span className="studio-field-label" style={{ fontSize: '11px', color: '#94a3b8' }}>Base API Host URL (For cURL / Fetch / Python)</span>
              <input
                type="text"
                className="studio-text-input"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.yourdomain.com"
                style={{ width: '100%', fontSize: '11px', fontFamily: 'monospace' }}
              />
            </div>
          </div>

          {/* Section 3: Parameters Builder */}
          <div className="studio-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                3 • Request Parameters ({params.length})
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {params.length > 0 && (
                  <button
                    type="button"
                    className="btn-studio-secondary"
                    onClick={handleClearParams}
                    style={{ height: '24px', fontSize: '10px', padding: '0 6px', color: '#f87171' }}
                    title="Remove all parameters"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={handleAddParam}
                  style={{ height: '24px', fontSize: '10px', padding: '0 8px' }}
                >
                  <span className="material-symbols-outlined icon-xs">add</span>
                  <span>Add Param</span>
                </button>
              </div>
            </div>

            <div className="api-param-grid custom-scrollbar" style={{ maxHeight: '260px', overflowY: 'auto' }}>
              {params.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', borderRadius: '4px', background: 'var(--surface-base)', border: '1px dashed var(--border-color)', fontSize: '11.5px', color: '#64748b' }}>
                  No parameters defined. Click "Add Param" above to specify path, query, header, or body arguments.
                </div>
              ) : (
                params.map((p, idx) => (
                  <div key={idx} className="api-param-row">
                    <input
                      type="text"
                      className="studio-text-input param-name-input"
                      placeholder="Name"
                      value={p.name}
                      onChange={(e) => handleUpdateParam(idx, 'name', e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '11.5px', fontFamily: 'monospace' }}
                    />
                    <select
                      className="studio-select"
                      value={p.in}
                      onChange={(e) => handleUpdateParam(idx, 'in', e.target.value)}
                      style={{ padding: '4px 6px', fontSize: '11px' }}
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
                      style={{ padding: '4px 6px', fontSize: '11px' }}
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                      <option value="object">object</option>
                      <option value="array">array</option>
                    </select>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="text"
                        className="studio-text-input"
                        placeholder="Description"
                        value={p.desc}
                        onChange={(e) => handleUpdateParam(idx, 'desc', e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '11.5px', flex: 1 }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', fontSize: '10px', color: p.required ? '#f43f5e' : '#64748b' }} title="Required parameter">
                        <input
                          type="checkbox"
                          checked={p.required}
                          onChange={(e) => handleUpdateParam(idx, 'required', e.target.checked)}
                          style={{ margin: 0 }}
                        />
                        <span>Req</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      className="modal-close-icon-btn"
                      onClick={() => handleRemoveParam(idx)}
                      title="Remove parameter"
                    >
                      <span className="material-symbols-outlined icon-xs">close</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 4: Request Payload (JSON) */}
          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div className="studio-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                  4 • Request Body Payload (JSON)
                </label>
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={() => handlePrettifyJson('request')}
                  style={{ height: '22px', fontSize: '10px', padding: '0 6px' }}
                  title="Format and validate JSON"
                >
                  <span className="material-symbols-outlined icon-xs">format_align_left</span>
                  <span>Prettify</span>
                </button>
              </div>
              <textarea
                className="csv-modal-textarea custom-scrollbar"
                rows={5}
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{\n  "key": "value"\n}'
                style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11.5px' }}
              />
            </div>
          )}

          {/* Section 5: Response Payload & Status Code */}
          <div className="studio-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>
                {['POST', 'PUT', 'PATCH'].includes(method) ? '5' : '4'} • Expected Response Payload
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <select
                  className="studio-select"
                  style={{ width: '130px', height: '24px', fontSize: '11px', fontWeight: 600 }}
                  value={statusCode}
                  onChange={(e) => setStatusCode(e.target.value)}
                >
                  <option value="200 OK">200 OK</option>
                  <option value="201 Created">201 Created</option>
                  <option value="204 No Content">204 No Content</option>
                  <option value="400 Bad Request">400 Bad Request</option>
                  <option value="401 Unauthorized">401 Unauthorized</option>
                  <option value="403 Forbidden">403 Forbidden</option>
                  <option value="404 Not Found">404 Not Found</option>
                  <option value="422 Unprocessable">422 Unprocessable</option>
                  <option value="500 Internal Error">500 Server Error</option>
                </select>
                <button
                  type="button"
                  className="btn-studio-secondary"
                  onClick={() => handlePrettifyJson('response')}
                  style={{ height: '22px', fontSize: '10px', padding: '0 6px' }}
                  title="Format and validate JSON"
                >
                  <span className="material-symbols-outlined icon-xs">format_align_left</span>
                  <span>Prettify</span>
                </button>
              </div>
            </div>
            <textarea
              className="csv-modal-textarea custom-scrollbar"
              rows={5}
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              placeholder='{\n  "status": "ok"\n}'
              style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11.5px' }}
            />
          </div>
        </div>
      }
      canvasContent={
        <div style={{ width: '100%', maxWidth: '820px', padding: '24px', boxSizing: 'border-box' }}>
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
                            <td style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, color: '#38bdf8' }}>
                              <code>{p.name}</code>
                            </td>
                            <td>
                              <span className={`api-param-badge ${p.in}`}>{p.in}</span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary)' }}>
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
                  <div className="api-stage-empty-msg" style={{ padding: '10px 14px', borderRadius: '4px', fontSize: '11.5px' }}>
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
            <div
              className="api-gfm-render-wrapper table-render-viewport custom-scrollbar"
              style={{
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                lineHeight: 1.6
              }}
            >
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
      }
    />
  )
}
