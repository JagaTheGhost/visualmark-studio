import React, { useMemo, useState, useEffect } from 'react'
import StudioShell from './common/StudioShell'
import '../../styles/studios/extendedStudios.css'

const STANDARDS = [
  {
    id: 'readme',
    name: 'Open-Source README Gateway',
    shortName: 'README Gateway',
    icon: 'stars',
    badge: 'GitHub Standard',
    color: '#818cf8',
    description: 'Repository entry point: value proposition, quick start, preview demo, features, and onboarding.'
  },
  {
    id: 'contributing',
    name: 'Contributor Guidelines',
    shortName: 'Contributing Guide',
    icon: 'handshake',
    badge: 'Community Standard',
    color: '#34d399',
    description: 'Welcoming guidelines for OSS contributors: Code of Conduct, dev setup, PR checklists, and git flow.'
  },
  {
    id: 'setup',
    name: 'Setup & Installation Guide',
    shortName: 'Setup Manual',
    icon: 'construction',
    badge: 'Dev Setup',
    color: '#f59e0b',
    description: 'Detailed environment prerequisites, step-by-step commands, .env configuration, and troubleshooting.'
  },
  {
    id: 'architecture',
    name: 'System Architecture Spec',
    shortName: 'Architecture Spec',
    icon: 'account_tree',
    badge: 'Design Spec',
    color: '#38bdf8',
    description: 'Technical blueprints: system topology diagrams, component boundaries, and data flow sequences.'
  },
  {
    id: 'changelog',
    name: 'Changelog & Releases',
    shortName: 'Changelog & Releases',
    icon: 'history',
    badge: 'SemVer Standard',
    color: '#a78bfa',
    description: 'Chronological release log following Keep a Changelog and Semantic Versioning standards.'
  },
  {
    id: 'api',
    name: 'REST API & Endpoints',
    shortName: 'API Spec',
    icon: 'api',
    badge: 'API Reference',
    color: '#ec4899',
    description: 'Endpoint route matrix, authentication headers, JSON payload schemas, and HTTP error codes.'
  },
  {
    id: 'general',
    name: 'General Markdown Quality',
    shortName: 'Universal Markdown',
    icon: 'description',
    badge: 'Universal Doc',
    color: '#94a3b8',
    description: 'Universal Markdown documentation standards: heading hierarchy, depth, code snippets, and structure.'
  }
]

const AUDIT_MODES = [
  { id: 'readme', label: 'README Gateway', icon: 'stars' },
  { id: 'contributing', label: 'Contributing', icon: 'handshake' },
  { id: 'setup', label: 'Setup Guide', icon: 'construction' },
  { id: 'architecture', label: 'Architecture', icon: 'account_tree' },
  { id: 'changelog', label: 'Changelog', icon: 'history' },
  { id: 'api', label: 'REST API', icon: 'api' },
  { id: 'general', label: 'Universal', icon: 'description' }
]

function detectStandardForFile(filename) {
  if (!filename) return 'general'
  const lower = filename.toLowerCase()

  if (lower.includes('readme')) return 'readme'
  if (lower.includes('contribut') || lower.includes('conduct') || lower.includes('coc')) return 'contributing'
  if (lower.includes('setup') || lower.includes('install') || lower.includes('deploy') || lower.includes('get_started')) return 'setup'
  if (lower.includes('arch') || lower.includes('design') || lower.includes('spec') || lower.includes('system')) return 'architecture'
  if (lower.includes('changelog') || lower.includes('release') || lower.includes('history')) return 'changelog'
  if (lower.includes('api') || lower.includes('endpoint') || lower.includes('route')) return 'api'

  return 'general'
}

const SECTION_TEMPLATES = {
  // README Templates
  features: `## ✨ Key Features\n\n- **⚡ High Performance:** Engineered for rapid execution with minimal footprint.\n- **🔒 Secure by Design:** Comprehensive input sanitization and zero-trust boundaries.\n- **🧩 Modular Architecture:** Highly extensible plugin interface for custom developer workflows.\n- **📊 Observability & Metrics:** Built-in structured telemetry, audit logs, and status dashboards.\n`,
  installation: `## 📦 Installation\n\n### Prerequisites\n- Node.js \`>= 18.0.0\`\n- npm \`>= 9.0.0\`\n\n\`\`\`bash\n# Clone the repository\ngit clone https://github.com/your-org/your-repo.git\ncd your-repo\n\n# Install client & server dependencies\nnpm install\n\`\`\`\n`,
  usage: `## 🚀 Quick Start & Usage\n\n\`\`\`bash\n# Run the development environment\nnpm run dev\n\n# Run unit and integration tests\nnpm test\n\`\`\`\n\nOpen \`http://localhost:5173\` in your browser to interact with the application.\n`,
  configuration: `## ⚙️ Environment Configuration\n\nCreate a \`.env\` file in the project root based on the following reference matrix:\n\n| Variable | Type | Default | Description |\n| :--- | :---: | :---: | :--- |\n| \`PORT\` | \`number\` | \`3000\` | Web application port |\n| \`DATABASE_URL\` | \`string\` | \`""\` | Database connection string |\n| \`DEBUG\` | \`boolean\` | \`false\` | Enable verbose logging |\n`,
  architecture: `## 🏛️ System Architecture\n\n\`\`\`mermaid\ngraph TD\n    Client[Client UI / Browser] --> API[API Gateway / Router]\n    API --> Service[Core Business Services]\n    Service --> Cache[(Redis Cache)]\n    Service --> DB[(Primary Database)]\n\`\`\`\n`,
  contributing: `## 🤝 Contributing\n\nWe warmly welcome community contributions! Please review our [\`CONTRIBUTING.md\`](./CONTRIBUTING.md) guide before opening a pull request.\n`,
  license: `## 📄 License\n\nDistributed under the **MIT License**. See [\`LICENSE\`](./LICENSE) for terms.\n`,

  // Contributing Templates
  contributing_coc: `## 📜 Code of Conduct\n\nThis project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). We are committed to fostering an open, inclusive, and harassment-free environment for everyone.\n`,
  contributing_setup: `## 💻 Local Development Setup\n\n1. **Fork and Clone the Repository:**\n   \`\`\`bash\n   git clone https://github.com/your-username/your-repo.git\n   cd your-repo\n   \`\`\`\n2. **Install Dependencies:**\n   \`\`\`bash\n   npm install\n   \`\`\`\n3. **Start the Dev Server:**\n   \`\`\`bash\n   npm run dev\n   \`\`\`\n`,
  contributing_workflow: `## 🌿 Branching & Git Workflow\n\n- Create branches from \`main\` using standard prefixes:\n  - \`feat/feature-description\` for new functionality\n  - \`fix/issue-description\` for bug fixes\n  - \`docs/page-name\` for documentation improvements\n- Keep pull requests focused on a single logical change.\n`,
  contributing_commits: `## 📝 Commit Conventions\n\nWe follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:\n\n- \`feat:\` A new user-facing feature\n- \`fix:\` A bug fix\n- \`docs:\` Documentation modifications only\n- \`refactor:\` Code changes that neither fix a bug nor add a feature\n- \`test:\` Adding or updating tests\n`,
  contributing_tests: `## 🧪 Testing & Code Quality Gates\n\nBefore submitting a pull request, ensure all tests and linters pass:\n\n\`\`\`bash\n# Run automated test suites\nnpm test\n\n# Run static analysis and linting\nnpm run lint\n\`\`\`\n`,
  contributing_pr: `## 🚀 Pull Request Checklist\n\nWhen submitting a pull request, please verify:\n- [ ] Code compiles cleanly and passes all automated tests (\`npm test\`).\n- [ ] New code includes corresponding unit test coverage.\n- [ ] Documentation and comments have been updated accordingly.\n- [ ] No unneeded debug logs, credentials, or temporary files are committed.\n`,

  // Setup Manual Templates
  setup_prereq: `## 📋 System Prerequisites\n\nVerify that the following runtimes and tools are installed:\n\n| Runtime / Tool | Minimum Version | Recommended | Check Command |\n| :--- | :---: | :---: | :--- |\n| **Node.js** | \`v18.0.0\` | \`v20.x LTS\` | \`node -v\` |\n| **npm** | \`v9.0.0\` | \`v10.x\` | \`npm -v\` |\n| **Git** | \`v2.30.0\` | \`Latest\` | \`git --version\` |\n`,
  setup_steps: `## 🛠️ Step-by-Step Installation\n\n\`\`\`bash\n# 1. Clone repository\ngit clone https://github.com/your-org/your-repo.git\ncd your-repo\n\n# 2. Install all required dependencies\nnpm install\n\n# 3. Create initial environment file\ncp .env.example .env\n\`\`\`\n`,
  setup_env: `## 🔑 Environment Configuration (.env)\n\nConfigure the following variables in your local \`.env\` file:\n\n| Variable | Required | Default | Purpose |\n| :--- | :---: | :---: | :--- |\n| \`APP_ENV\` | Yes | \`development\` | Runtime environment mode |\n| \`PORT\` | No | \`3000\` | Local server listen port |\n| \`API_SECRET_KEY\` | Yes | — | Secret token for authentication |\n`,
  setup_services: `## 🗄️ Database & Services Initialization\n\n\`\`\`bash\n# Spin up required databases via Docker\ndocker compose up -d\n\n# Run database schema migrations\nnpm run db:migrate\n\n# (Optional) Seed initial development data\nnpm run db:seed\n\`\`\`\n`,
  setup_verify: `## ✅ Verification & Health Check\n\nConfirm that the service is operational:\n\n\`\`\`bash\n# Health check query\ncurl -i http://localhost:3000/api/health\n\`\`\`\n\nExpected response: \`{"status": "ok", "uptime": 12}\`.\n`,
  setup_troubleshoot: `## 🩺 Troubleshooting & Common Gotchas\n\n- **Port already in use (\`EADDRINUSE: 3000\`):** Change \`PORT=3001\` in your \`.env\` file or stop the conflicting process.\n- **Node Version Mismatch:** Use Node Version Manager (\`nvm use 20\`) to match the required LTS.\n- **Permission Errors:** Avoid \`sudo npm install\`; verify folder ownership with \`chown -R $USER .\`.\n`,

  // Architecture Spec Templates
  arch_diagram: `## 📐 System Architecture Diagram\n\n\`\`\`mermaid\nflowchart TD\n    subgraph Presentation ["Presentation Layer"]\n        UI[Client Application / Vite UI]\n    end\n\n    subgraph Core ["Application Core"]\n        Router[API Gateway & Router]\n        Engine[Business Logic Engine]\n    end\n\n    subgraph Storage ["Persistence Layer"]\n        DB[(Primary Database)]\n        Disk[File System Storage]\n    end\n\n    UI --> Router\n    Router --> Engine\n    Engine --> DB\n    Engine --> Disk\n\`\`\`\n`,
  arch_principles: `## 💡 Core Design Principles\n\n1. **Separation of Concerns:** Clear boundary isolation between UI presentation, domain rules, and storage.\n2. **Deterministic Behavior:** Input-driven modules with reproducible transformations.\n3. **Resilience & Fault Tolerance:** Graceful degradation on network or external API failures.\n4. **Security by Default:** Strict validation of all inputs at network and file boundaries.\n`,
  arch_components: `## 🧩 Component & Layer Boundaries\n\n- **\`frontend/\`**: User interface components, state management, and client routing.\n- **\`backend/\`**: REST endpoints, data transformation pipelines, and validation.\n- **\`shared/\`**: Type definitions, schemas, and utility constants used across tiers.\n`,
  arch_dataflow: `## 🔄 Data Flow & State Lifecycle\n\n\`\`\`mermaid\nsequenceDiagram\n    autonumber\n    actor User\n    participant UI as Frontend UI\n    participant API as Backend API\n    participant DB as Persistence\n\n    User->>UI: Submit Action\n    UI->>API: HTTP Request (JSON)\n    API->>API: Validate Schema\n    API->>DB: Write Record\n    DB-->>API: Confirm Save\n    API-->>UI: 200 OK (Response)\n    UI-->>User: Visual Update & Toast\n\`\`\`\n`,
  arch_security: `## 🛡️ Security & Access Control\n\n- **Authentication:** Token-based authentication passed via secure headers.\n- **Transport Security:** Strict TLS 1.3 enforced for all external communications.\n- **Sanitization:** All user-provided markdown and file paths are strictly sanitized to prevent traversal attacks.\n`,
  arch_tree: `## 📂 Codebase Directory Map\n\n\`\`\`bash\nproject-root/\n├── src/\n│   ├── components/      # UI components and views\n│   ├── hooks/           # Custom React hooks\n│   ├── services/        # API client and networking\n│   └── utils/           # Formatting and helpers\n├── public/              # Static icons and assets\n├── package.json         # Dependencies and scripts\n└── README.md            # Entry documentation\n\`\`\`\n`,

  // Changelog Templates
  cl_notice: `## 📌 Format & Specification Notice\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n`,
  cl_unreleased: `## [Unreleased]\n\n### Added\n- Staged experimental feature flags for upcoming release.\n\n### Fixed\n- Addressed edge-case bug in input validator.\n`,
  cl_version: `## [1.0.0] - 2026-10-18\n\n### Added\n- Initial production release.\n- Full documentation suite and interactive developer tools.\n\n### Fixed\n- Resolved cross-platform layout discrepancies.\n`,
  cl_categories: `### Added\n- New configuration preference settings.\n\n### Changed\n- Optimized caching layer for 35% faster rendering.\n\n### Fixed\n- Fixed listener leak on component unmount.\n\n### Security\n- Upgraded external dependencies to resolve security advisories.\n`,
  cl_links: `[unreleased]: https://github.com/your-org/your-repo/compare/v1.0.0...HEAD\n[1.0.0]: https://github.com/your-org/your-repo/releases/tag/v1.0.0\n`,

  // API Spec Templates
  api_auth: `## 🔐 Authentication & Headers\n\nAll authenticated API requests require a valid token in the \`Authorization\` header:\n\n\`\`\`http\nAuthorization: Bearer YOUR_API_KEY_HERE\nContent-Type: application/json\nAccept: application/json\n\`\`\`\n`,
  api_routes: `## 📡 Endpoints Matrix\n\n| Method | Endpoint | Description | Auth Required |\n| :---: | :--- | :--- | :---: |\n| \`GET\` | \`/api/v1/health\` | Service health status check | No |\n| \`GET\` | \`/api/v1/items\` | Retrieve paginated item collection | Yes |\n| \`POST\` | \`/api/v1/items\` | Create a new item resource | Yes |\n| \`GET\` | \`/api/v1/items/:id\` | Fetch item details by identifier | Yes |\n| \`DELETE\` | \`/api/v1/items/:id\` | Delete existing item resource | Yes |\n`,
  api_schemas: `## 📦 Request & Response Schemas\n\n### Create Resource\n\`POST /api/v1/items\`\n\n**Request Body:**\n\`\`\`json\n{\n  "name": "Production Cluster",\n  "category": "infrastructure",\n  "enabled": true\n}\n\`\`\`\n\n**Response (\`201 Created\`):**\n\`\`\`json\n{\n  "id": "item_82931",\n  "name": "Production Cluster",\n  "category": "infrastructure",\n  "enabled": true,\n  "createdAt": "2026-10-18T10:00:00Z"\n}\n\`\`\`\n`,
  api_errors: `## ⚠️ Error Responses & Status Codes\n\nErrors return a standardized JSON error structure:\n\n\`\`\`json\n{\n  "error": {\n    "code": "RESOURCE_NOT_FOUND",\n    "message": "The requested item was not found.",\n    "status": 404\n  }\n}\n\`\`\`\n\n| HTTP Code | Description |\n| :---: | :--- |\n| \`400 Bad Request\` | Invalid payload or missing parameters |\n| \`401 Unauthorized\` | Missing or invalid authentication token |\n| \`404 Not Found\` | Requested resource does not exist |\n| \`429 Too Many Requests\` | Rate limit threshold exceeded |\n`,
  api_ratelimits: `## ⏱️ Rate Limiting & Pagination\n\n- **Rate Limiting:** Requests are limited to \`100 requests per minute\` per API key. Exceeding returns HTTP \`429\`.\n- **Pagination:** Query collection endpoints with \`?page=1&limit=25\`. Total counts are returned in \`X-Total-Count\`.\n`,

  // General Markdown Templates
  gen_sections: `## 📖 Overview\n\nProvide an introductory summary describing the purpose, scope, and objectives of this documentation.\n\n### Key Objectives\n- Clearly document operational steps and expected outcomes.\n- Provide accessible reference points for engineering and operations teams.\n`,
  gen_summary: `> **Summary:** This document establishes reference standards and operational procedures. Review before making modifications to shared configurations.\n`,
  gen_code: `### Example Usage Snippet\n\n\`\`\`javascript\n// Example operational snippet\nimport { setupConfig } from './config'\n\nconst config = setupConfig({\n  env: 'production',\n  timeout: 5000\n})\n\`\`\`\n`,
  gen_table: `### Reference Matrix\n\n| Component | Status | Notes |\n| :--- | :---: | :--- |\n| Core Runtime | Stable | Verified across supported platforms |\n| API Gateway | Active | TLS 1.3 enforced |\n`,
  gen_links: `### 🔗 References & Related Documentation\n\n- [Architecture Specification](./ARCHITECTURE.md)\n- [Contributing Guidelines](./CONTRIBUTING.md)\n- [Setup & Deployment Guide](./SETUP.md)\n`
}

export default function AuditStudioTab({
  allFiles = {},
  openDocTabs = [],
  initialFile = 'README.md',
  markdown = '',
  activeFile = 'README.md',
  onInsertSection = () => {},
  onBackToReadme = () => {}
}) {
  // Available files for auditing
  const availableFiles = useMemo(() => {
    const keys = Object.keys(allFiles || {})
    if (keys.length > 0) return keys
    if (openDocTabs && openDocTabs.length > 0) {
      return openDocTabs.filter(
        (f) =>
          !f.endsWith('.studio') &&
          f !== 'settings' &&
          f !== 'shortcuts' &&
          f !== 'whats-new' &&
          f !== 'release-notes'
      )
    }
    return [activeFile || initialFile || 'README.md']
  }, [allFiles, openDocTabs, activeFile, initialFile])

  // Selected file state
  const [selectedFile, setSelectedFile] = useState(() => {
    if (initialFile && allFiles && allFiles[initialFile] !== undefined) return initialFile
    if (activeFile && allFiles && allFiles[activeFile] !== undefined) return activeFile
    return availableFiles[0] || 'README.md'
  })

  // Sync selectedFile if initialFile changes and exists
  useEffect(() => {
    if (initialFile && allFiles && allFiles[initialFile] !== undefined) {
      setSelectedFile(initialFile)
    }
  }, [initialFile])

  // Keep selectedFile valid if file list changes
  useEffect(() => {
    if (availableFiles.length > 0 && !availableFiles.includes(selectedFile)) {
      setSelectedFile(availableFiles[0])
    }
  }, [availableFiles, selectedFile])

  // Standard Profile state with auto-detection
  const [selectedStandard, setSelectedStandard] = useState(() => detectStandardForFile(selectedFile))
  const [isManualStandard, setIsManualStandard] = useState(false)
  const [checkFilter, setCheckFilter] = useState('all') // 'all' | 'missing' | 'passed'

  // Auto-switch standard when selectedFile changes (unless user manually locked a choice)
  const handleSelectFile = (file) => {
    setSelectedFile(file)
    if (!isManualStandard) {
      setSelectedStandard(detectStandardForFile(file))
    }
  }

  const handleSelectStandard = (stdId) => {
    setSelectedStandard(stdId)
    setIsManualStandard(true)
  }

  const handleResetAutoStandard = () => {
    setIsManualStandard(false)
    setSelectedStandard(detectStandardForFile(selectedFile))
  }

  // Active document content resolution
  const currentContent = useMemo(() => {
    if (allFiles && allFiles[selectedFile] !== undefined) {
      return allFiles[selectedFile] || ''
    }
    if (selectedFile === 'README.md' && markdown) {
      return markdown || ''
    }
    return ''
  }, [allFiles, selectedFile, markdown])

  // Active standard configuration
  const activeStandardConfig = useMemo(() => {
    return STANDARDS.find((s) => s.id === selectedStandard) || STANDARDS[0]
  }, [selectedStandard])

  // Rule-based audit evaluation against active standard
  const auditReport = useMemo(() => {
    const text = currentContent || ''
    const lines = text.split('\n')
    const words = text.trim() ? text.trim().split(/\s+/).length : 0

    let checks = []

    if (selectedStandard === 'readme') {
      checks = [
        {
          id: 'title',
          label: 'Project Heading (H1)',
          passed: /^#\s+.+/m.test(text),
          weight: 10,
          tip: 'Add a clear # Project Name heading at line 1'
        },
        {
          id: 'tagline',
          label: 'Subtitle / Value Proposition',
          passed: /^>\s+.+/m.test(text),
          weight: 8,
          tip: 'Add a single-sentence blockquote > summarizing project impact'
        },
        {
          id: 'badges',
          label: 'Shields.io / Status Badges',
          passed: /img\.shields\.io|shields\.io|badge/i.test(text),
          weight: 8,
          tip: 'Add status, version, and license badges via Badges Studio'
        },
        {
          id: 'demo',
          label: 'Visual Demo / Banner / Screenshot',
          passed: /!\[.*?\]\(.*?\)|<img\s+.*?src=/i.test(text),
          weight: 10,
          tip: 'Include a preview image or video demo to show how it works'
        },
        {
          id: 'features',
          label: 'Key Features Section',
          passed: /^#{1,3}\s+.*feature/im.test(text),
          weight: 12,
          tip: 'List core capabilities and differentiator bullet points',
          templateKey: 'features'
        },
        {
          id: 'installation',
          label: 'Installation & Prerequisites',
          passed: /^#{1,3}\s+.*(install|getting started|setup|prerequisite)/im.test(text),
          weight: 12,
          tip: 'Provide step-by-step installation commands',
          templateKey: 'installation'
        },
        {
          id: 'usage',
          label: 'Quick Start & Usage Examples',
          passed: /^#{1,3}\s+.*(usage|quick start|how to use|running)/im.test(text),
          weight: 12,
          tip: 'Add real code examples of how to run the project',
          templateKey: 'usage'
        },
        {
          id: 'configuration',
          label: 'Environment & Configuration Table',
          passed: /^#{1,3}\s+.*(config|environment|\.env)/im.test(text),
          weight: 8,
          tip: 'Document environment variables and .env settings',
          templateKey: 'configuration'
        },
        {
          id: 'architecture',
          label: 'Architecture / Directory Tree',
          passed: /^#{1,3}\s+.*(arch|tree|structure|diagram)/im.test(text) || /```mermaid/i.test(text),
          weight: 8,
          tip: 'Use Directory Tree Studio or Mermaid diagrams',
          templateKey: 'architecture'
        },
        {
          id: 'contributing',
          label: 'Contributing Guidelines Link',
          passed: /contribut/i.test(text),
          weight: 6,
          tip: 'Reference CONTRIBUTING.md for community contributors',
          templateKey: 'contributing'
        },
        {
          id: 'license',
          label: 'License Specification',
          passed: /license/i.test(text),
          weight: 6,
          tip: 'Specify open-source license (MIT, Apache, GPL)',
          templateKey: 'license'
        }
      ]
    } else if (selectedStandard === 'contributing') {
      checks = [
        {
          id: 'contributing_title',
          label: 'Contributing Guide Heading (H1)',
          passed: /^#\s+.*(contribut|guideline)/im.test(text) || /^#\s+.+/m.test(text),
          weight: 15,
          tip: 'State # Contributing to [Project]'
        },
        {
          id: 'contributing_coc',
          label: 'Code of Conduct Reference',
          passed: /code of conduct|contributor covenant/i.test(text),
          weight: 15,
          tip: 'Adopt Contributor Covenant or standard CoC guidelines',
          templateKey: 'contributing_coc'
        },
        {
          id: 'contributing_setup',
          label: 'Local Development Environment Setup',
          passed: /^#{1,3}\s+.*(setup|environment|getting started|install)/im.test(text),
          weight: 20,
          tip: 'Explain step-by-step dev fork, clone, and dependency install',
          templateKey: 'contributing_setup'
        },
        {
          id: 'contributing_workflow',
          label: 'Git Branching & PR Guidelines',
          passed: /^#{1,3}\s+.*(branch|workflow|git|pull request)/im.test(text),
          weight: 15,
          tip: 'Describe feature branch conventions and PR scopes',
          templateKey: 'contributing_workflow'
        },
        {
          id: 'contributing_commits',
          label: 'Commit Message Conventions',
          passed: /conventional commit|commit message|feat:|fix:/i.test(text),
          weight: 15,
          tip: 'Specify Conventional Commits (feat:, fix:, chore:)',
          templateKey: 'contributing_commits'
        },
        {
          id: 'contributing_tests',
          label: 'Testing & Quality Checks',
          passed: /^#{1,3}\s+.*(test|quality|lint)/im.test(text) || /npm test|pytest|go test/i.test(text),
          weight: 20,
          tip: 'Document how contributors run tests before pushing',
          templateKey: 'contributing_tests'
        }
      ]
    } else if (selectedStandard === 'setup') {
      checks = [
        {
          id: 'setup_title',
          label: 'Installation & Setup Heading (H1)',
          passed: /^#\s+.*(setup|install|getting started|deploy)/im.test(text) || /^#\s+.+/m.test(text),
          weight: 15,
          tip: 'Provide a clear # Setup & Installation Guide heading'
        },
        {
          id: 'setup_prereq',
          label: 'Prerequisites & Runtime Matrix',
          passed: /^#{1,3}\s+.*(prerequisite|requirement|system)/im.test(text),
          weight: 20,
          tip: 'List required Node, Python, Docker, or OS versions',
          templateKey: 'setup_prereq'
        },
        {
          id: 'setup_steps',
          label: 'Step-by-Step Installation Commands',
          passed: /```bash[\s\S]*?```/i.test(text) || /```shell[\s\S]*?```/i.test(text),
          weight: 20,
          tip: 'Use copy-pasteable bash code blocks for installation',
          templateKey: 'setup_steps'
        },
        {
          id: 'setup_env',
          label: 'Environment Variables Reference (.env)',
          passed: /\.env|environment variable/i.test(text),
          weight: 15,
          tip: 'Document all configuration variables with default values',
          templateKey: 'setup_env'
        },
        {
          id: 'setup_services',
          label: 'Database & Service Initialization',
          passed: /docker|database|migration|redis|postgres|seed/i.test(text),
          weight: 15,
          tip: 'Explain database seeding, migration, or Docker commands',
          templateKey: 'setup_services'
        },
        {
          id: 'setup_troubleshoot',
          label: 'Troubleshooting & Common Gotchas',
          passed: /^#{1,3}\s+.*(troubleshoot|faq|gotcha|issue)/im.test(text),
          weight: 15,
          tip: 'List common port conflicts, version mismatches, and solutions',
          templateKey: 'setup_troubleshoot'
        }
      ]
    } else if (selectedStandard === 'architecture') {
      checks = [
        {
          id: 'arch_title',
          label: 'System Architecture Heading (H1)',
          passed: /^#\s+.*(architecture|system|design|spec)/im.test(text) || /^#\s+.+/m.test(text),
          weight: 15,
          tip: 'Add a clear # Architecture Specification title'
        },
        {
          id: 'arch_diagram',
          label: 'Mermaid System Diagram',
          passed: /```mermaid[\s\S]*?```/i.test(text),
          weight: 25,
          tip: 'Embed a Mermaid flowchart or sequence diagram showing component interactions',
          templateKey: 'arch_diagram'
        },
        {
          id: 'arch_principles',
          label: 'Core Design Principles',
          passed: /^#{1,3}\s+.*(principle|concept|philosophy|overview)/im.test(text),
          weight: 15,
          tip: 'Outline architectural philosophy, separation of concerns, and invariants',
          templateKey: 'arch_principles'
        },
        {
          id: 'arch_components',
          label: 'Component & Module Boundaries',
          passed: /^#{1,3}\s+.*(component|module|package|layer|service)/im.test(text),
          weight: 15,
          tip: 'Define module responsibilities and cross-layer interfaces',
          templateKey: 'arch_components'
        },
        {
          id: 'arch_dataflow',
          label: 'Data Flow & State Lifecycle',
          passed: /^#{1,3}\s+.*(data flow|lifecycle|state|sequence)/im.test(text),
          weight: 15,
          tip: 'Document how requests or events traverse the system stack',
          templateKey: 'arch_dataflow'
        },
        {
          id: 'arch_security',
          label: 'Security & Boundary Isolation',
          passed: /^#{1,3}\s+.*(security|auth|isolation|boundary)/im.test(text),
          weight: 15,
          tip: 'Document encryption, sanitization, and access controls',
          templateKey: 'arch_security'
        }
      ]
    } else if (selectedStandard === 'changelog') {
      checks = [
        {
          id: 'cl_notice',
          label: 'SemVer & Keep a Changelog Notice',
          passed: /semver\.org|semantic versioning|keepachangelog\.com/i.test(text),
          weight: 15,
          tip: 'State adherence to Semantic Versioning and Keep a Changelog',
          templateKey: 'cl_notice'
        },
        {
          id: 'cl_unreleased',
          label: '[Unreleased] Staging Section',
          passed: /^##\s+.*\[?unreleased\]?/im.test(text),
          weight: 20,
          tip: 'Include an [Unreleased] section for staged changes before tagging',
          templateKey: 'cl_unreleased'
        },
        {
          id: 'cl_version',
          label: 'Version Entries with ISO Dates',
          passed: /^##\s+.*\[?\d+\.\d+\.\d+\]?.*(\d{4}-\d{2}-\d{2})?/im.test(text),
          weight: 20,
          tip: 'Format versions as ## [X.Y.Z] - YYYY-MM-DD',
          templateKey: 'cl_version'
        },
        {
          id: 'cl_categories',
          label: 'Categorized Change Subheadings',
          passed: /^###\s+.*(Added|Changed|Deprecated|Removed|Fixed|Security)/im.test(text),
          weight: 20,
          tip: 'Group changes under Added, Changed, Fixed, or Security',
          templateKey: 'cl_categories'
        },
        {
          id: 'cl_links',
          label: 'Version Comparison Diff Links',
          passed:
            /\[\d+\.\d+\.\d+\]:\s+https?:\/\/github\.com/i.test(text) ||
            /\[unreleased\]:\s+https?:\/\//i.test(text) ||
            /\[.*?\]:\s+http/i.test(text),
          weight: 15,
          tip: 'Add Markdown comparison links at the footer comparing release tags',
          templateKey: 'cl_links'
        }
      ]
    } else if (selectedStandard === 'api') {
      checks = [
        {
          id: 'api_title',
          label: 'API Title & Base URL (H1)',
          passed: /^#\s+.*(api|endpoint|reference|rest)/im.test(text) || /^#\s+.+/m.test(text),
          weight: 15,
          tip: 'Specify API Title and Base URL endpoint'
        },
        {
          id: 'api_auth',
          label: 'Authentication & Headers Specification',
          passed:
            /^#{1,3}\s+.*(auth|bearer|token|header|api key)/im.test(text) ||
            /Authorization:\s+Bearer/i.test(text),
          weight: 15,
          tip: 'Document Authorization headers, Bearer tokens, or API Keys',
          templateKey: 'api_auth'
        },
        {
          id: 'api_routes',
          label: 'Endpoint HTTP Methods & Routes',
          passed: /GET|POST|PUT|PATCH|DELETE/m.test(text),
          weight: 20,
          tip: 'Document endpoint HTTP verbs (GET, POST, etc.) and path patterns',
          templateKey: 'api_routes'
        },
        {
          id: 'api_schemas',
          label: 'Request & Response JSON Schemas',
          passed:
            /```json[\s\S]*?```/i.test(text) ||
            /\|[\s-:]+\|[\s\S]*?(body|param|type|field)/i.test(text),
          weight: 20,
          tip: 'Provide sample JSON request bodies and response payloads',
          templateKey: 'api_schemas'
        },
        {
          id: 'api_errors',
          label: 'Error Codes & HTTP Status Matrix',
          passed:
            /400|401|403|404|422|500/m.test(text) ||
            /^#{1,3}\s+.*(error|status code|response code)/im.test(text),
          weight: 15,
          tip: 'Include a status matrix with common error codes and explanations',
          templateKey: 'api_errors'
        },
        {
          id: 'api_ratelimits',
          label: 'Rate Limits & Pagination Guidelines',
          passed: /rate limit|paging|pagination|page_size|offset|cursor/i.test(text),
          weight: 15,
          tip: 'Document request throttling and pagination parameters',
          templateKey: 'api_ratelimits'
        }
      ]
    } else {
      // General Markdown Quality
      checks = [
        {
          id: 'gen_title',
          label: 'Clear Document Heading (H1)',
          passed: /^#\s+.+/m.test(text),
          weight: 15,
          tip: 'Add a single # Heading 1 document title at the top'
        },
        {
          id: 'gen_sections',
          label: 'Structured Subsections (H2 / H3)',
          passed: /^##\s+.+/m.test(text),
          weight: 15,
          tip: 'Organize content with clear ## Section and ### Subsection headings',
          templateKey: 'gen_sections'
        },
        {
          id: 'gen_summary',
          label: 'Executive Summary / Purpose Statement',
          passed: /^>\s+.+/m.test(text) || /^#{1,3}\s+.*(summary|overview|purpose|about)/im.test(text),
          weight: 15,
          tip: 'Provide a brief summary or callout blockquote explaining document purpose',
          templateKey: 'gen_summary'
        },
        {
          id: 'gen_code',
          label: 'Code Blocks or Practical Examples',
          passed: /```[a-z]*[\s\S]*?```/i.test(text),
          weight: 15,
          tip: 'Include syntax-highlighted code blocks or CLI demonstrations',
          templateKey: 'gen_code'
        },
        {
          id: 'gen_table',
          label: 'Structured Tables or Checklists',
          passed: /\|[\s-:]+\|/.test(text) || /- \[[ x]\]/.test(text),
          weight: 15,
          tip: 'Use Markdown tables or task checklists to organize information',
          templateKey: 'gen_table'
        },
        {
          id: 'gen_links',
          label: 'Related References & Deep Links',
          passed: /\[.*?\]\(https?:.*?\)|\[.*?\]\((\.\/|\.\.\/).*?\)/.test(text),
          weight: 15,
          tip: 'Link to related internal docs, specifications, or external resources',
          templateKey: 'gen_links'
        },
        {
          id: 'gen_words',
          label: 'Substantive Depth (> 150 Words)',
          passed: words >= 150,
          weight: 10,
          tip: 'Ensure the document has thorough context, explanations, and instructions'
        }
      ]
    }

    // Calculate score
    const totalPoints = checks.reduce((acc, c) => acc + (c.passed ? c.weight : 0), 0)
    const maxPoints = checks.reduce((acc, c) => acc + c.weight, 0) || 100
    const scorePct = Math.round((totalPoints / maxPoints) * 100)

    let grade = 'F'
    let gradeColor = '#ef4444'
    if (scorePct >= 92) {
      grade = 'A+'
      gradeColor = '#10b981'
    } else if (scorePct >= 84) {
      grade = 'A'
      gradeColor = '#10b981'
    } else if (scorePct >= 75) {
      grade = 'B'
      gradeColor = '#38bdf8'
    } else if (scorePct >= 62) {
      grade = 'C'
      gradeColor = '#f59e0b'
    } else if (scorePct >= 50) {
      grade = 'D'
      gradeColor = '#f97316'
    }

    // Metrics
    const codeBlocksCount = (text.match(/```/g) || []).length / 2
    const tablesCount = (text.match(/\|[\s-:]+\|/g) || []).length
    const headingsCount = (text.match(/^#{1,6}\s+/gm) || []).length
    const readingMinutes = Math.max(1, Math.ceil(words / 200))

    // Warnings
    const hasExamplePlaceholders = /your-org|your-repo|username\/project|alex@example\.com|\bTODO\b|\bFIXME\b/i.test(
      text
    )
    const emptyLinks = /\[.*?\]\(\s*\)/.test(text)

    const warnings = []
    if (hasExamplePlaceholders) {
      warnings.push(
        'Detected generic placeholders or TODOs (e.g., your-org/your-repo, TODO). Replace with project details.'
      )
    }
    if (emptyLinks) {
      warnings.push(
        'Detected empty link targets [text](). Ensure all links have valid relative or absolute URLs.'
      )
    }
    if (words === 0) {
      warnings.push(
        `The document "${selectedFile}" is currently empty. Add content or boilerplate to begin auditing.`
      )
    } else if (words < 80) {
      warnings.push('Word count is under 80 words. Consider providing more context, examples, and instructions.')
    }

    return {
      scorePct,
      grade,
      gradeColor,
      checks,
      metrics: {
        words,
        lines: lines.length,
        readingMinutes,
        headingsCount,
        codeBlocksCount: Math.floor(codeBlocksCount),
        tablesCount
      },
      warnings
    }
  }, [currentContent, selectedStandard, selectedFile])

  // Formatted report for copying / insertion
  const reportText = useMemo(() => {
    return (
      `## 📋 Documentation Health Audit Report (${selectedFile})\n` +
      `**Standard Profile:** ${activeStandardConfig.name} (${activeStandardConfig.badge})\n\n` +
      `- **Overall Grade:** ${auditReport.grade} (${auditReport.scorePct}/100)\n` +
      `- **Total Words:** ${auditReport.metrics.words.toLocaleString()} (~${auditReport.metrics.readingMinutes} min read)\n` +
      `- **Lines:** ${auditReport.metrics.lines} | **Headings:** ${auditReport.metrics.headingsCount} | **Code Blocks:** ${auditReport.metrics.codeBlocksCount} | **Tables:** ${auditReport.metrics.tablesCount}\n\n` +
      `### Passed Checks\n` +
      auditReport.checks
        .filter((c) => c.passed)
        .map((c) => `- ✅ ${c.label}`)
        .join('\n') +
      '\n\n' +
      `### Missing Elements\n` +
      (auditReport.checks
        .filter((c) => !c.passed)
        .map((c) => `- ⚠️ ${c.label} (${c.tip})`)
        .join('\n') || '- None! All checks passed.')
    )
  }, [auditReport, selectedFile, activeStandardConfig])

  const passedChecksCount = auditReport.checks.filter((c) => c.passed).length
  const missingChecks = auditReport.checks.filter((c) => !c.passed)
  const passedChecks = auditReport.checks.filter((c) => c.passed)

  // Filtered checks for display
  const displayedChecks = useMemo(() => {
    if (checkFilter === 'missing') return missingChecks
    if (checkFilter === 'passed') return passedChecks
    return auditReport.checks
  }, [checkFilter, auditReport.checks, missingChecks, passedChecks])

  const handleInsertReport = () => {
    onInsertSection(reportText, selectedFile)
  }

  // Canvas Header Extras: Document Pill, Auto Badge, Score Pill, Filter Control
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {/* Target Document Tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: '4px',
          background: 'var(--surface-mid, rgba(255,255,255,0.06))',
          border: '1px solid var(--border-color)',
          fontSize: '11px',
          fontFamily: 'var(--font-mono, monospace)',
          color: '#38bdf8'
        }}
        title={`Active Document: ${selectedFile}`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>description</span>
        <span style={{ fontWeight: 600 }}>{selectedFile}</span>
        <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '10px' }}>
          ({auditReport.metrics.words}w)
        </span>
      </div>

      {/* Auto / Manual Standard Indicator */}
      {isManualStandard ? (
        <button
          type="button"
          onClick={handleResetAutoStandard}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 7px',
            fontSize: '10.5px',
            fontWeight: 600,
            borderRadius: '4px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#f59e0b',
            cursor: 'pointer'
          }}
          title="Custom profile chosen. Click to reset to auto-detect."
        >
          <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>sync</span>
          <span>Custom Profile (Reset)</span>
        </button>
      ) : (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 7px',
            fontSize: '10.5px',
            fontWeight: 600,
            borderRadius: '4px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399'
          }}
          title="Standard profile automatically detected from filename"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>bolt</span>
          <span>Auto-Detected</span>
        </span>
      )}

      {/* Score Pill */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: `${auditReport.gradeColor}18`,
          color: auditReport.gradeColor,
          border: `1px solid ${auditReport.gradeColor}44`,
          fontFamily: 'var(--font-mono, monospace)'
        }}
      >
        <span>Grade {auditReport.grade}</span>
        <span style={{ opacity: 0.8 }}>({auditReport.scorePct}%)</span>
      </span>

      {/* Filter Segmented Control */}
      <div className="studio-segmented-styles" style={{ transform: 'scale(0.92)', transformOrigin: 'right center' }}>
        <button
          type="button"
          className={`studio-style-btn ${checkFilter === 'all' ? 'active' : ''}`}
          onClick={() => setCheckFilter('all')}
        >
          All ({auditReport.checks.length})
        </button>
        <button
          type="button"
          className={`studio-style-btn ${checkFilter === 'missing' ? 'active' : ''}`}
          onClick={() => setCheckFilter('missing')}
          style={{ color: missingChecks.length > 0 ? '#f59e0b' : undefined }}
        >
          Missing ({missingChecks.length})
        </button>
        <button
          type="button"
          className={`studio-style-btn ${checkFilter === 'passed' ? 'active' : ''}`}
          onClick={() => setCheckFilter('passed')}
          style={{ color: '#10b981' }}
        >
          Passed ({passedChecks.length})
        </button>
      </div>
    </div>
  )

  return (
    <StudioShell
      studioId="audit.studio"
      title="Documentation Auditor Pro"
      subtitle="Evaluate structure, completeness, readability metrics, and standard profiles across workspace documentation."
      icon="verified_user"
      accentColor="#10b981"
      badge={`Grade ${auditReport.grade} (${auditReport.scorePct}%)`}
      modes={AUDIT_MODES}
      activeMode={selectedStandard}
      onModeChange={handleSelectStandard}
      markdownCode={reportText}
      codeLanguage="markdown"
      onInsert={handleInsertReport}
      insertLabel="Insert Audit Report"
      onBackToReadme={() => onBackToReadme(selectedFile)}
      canvasHeaderExtras={canvasHeaderExtras}
      defaultSplitWidth={500}
      minSplitWidth={380}
      maxSplitWidth={880}
      inspectorContent={
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section 1: Target Document Selection */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              1 • Target Document ({availableFiles.length})
            </label>
            <div className="audit-file-pills custom-scrollbar" style={{ flexWrap: 'wrap', maxWidth: '100%' }}>
              {availableFiles.map((filename) => {
                const isSelected = selectedFile === filename
                const fileContent = allFiles?.[filename] ?? ''
                const wordCount = fileContent.trim() ? fileContent.trim().split(/\s+/).length : 0
                return (
                  <button
                    key={filename}
                    type="button"
                    className={`audit-file-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectFile(filename)}
                    title={`Audit ${filename} (${wordCount} words)`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
                      {isSelected ? 'check' : 'article'}
                    </span>
                    <span className="audit-file-pill-name">{filename}</span>
                    <span className="audit-file-pill-words">{wordCount}w</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Scorecard & Grade */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              2 • Overall Quality Scorecard
            </label>
            <div className="audit-grade-container">
              <div
                className="audit-grade-ring"
                style={{ borderColor: auditReport.gradeColor }}
              >
                <span className="audit-grade-letter" style={{ color: auditReport.gradeColor }}>
                  {auditReport.grade}
                </span>
                <span className="audit-grade-pct">{auditReport.scorePct}%</span>
              </div>

              <div className="audit-score-info">
                <span className="audit-score-title" style={{ fontSize: '14.5px' }}>
                  {auditReport.scorePct >= 85
                    ? 'Production Ready Documentation'
                    : auditReport.scorePct >= 65
                    ? 'Good Baseline, Needs Polish'
                    : 'Incomplete Documentation'}
                </span>
                <span className="audit-score-summary" style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                  Auditing <strong>{selectedFile}</strong> against <em>{activeStandardConfig.shortName}</em> ({passedChecksCount}/{auditReport.checks.length} criteria passed).
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Readability & Content Metrics */}
          <div className="studio-section">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              3 • Readability & Structure Metrics
            </label>
            <div className="audit-metrics-grid">
              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.words.toLocaleString()}</div>
                <div className="audit-metric-name">Total Words</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">~{auditReport.metrics.readingMinutes} min</div>
                <div className="audit-metric-name">Read Time</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.lines}</div>
                <div className="audit-metric-name">Lines</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.headingsCount}</div>
                <div className="audit-metric-name">Headings</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.codeBlocksCount}</div>
                <div className="audit-metric-name">Code Blocks</div>
              </div>

              <div className="audit-metric-card">
                <div className="audit-metric-value">{auditReport.metrics.tablesCount}</div>
                <div className="audit-metric-name">Tables</div>
              </div>
            </div>
          </div>

          {/* Section 4: Quality Warnings */}
          {auditReport.warnings.length > 0 && (
            <div className="studio-section">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#f59e0b', marginBottom: '8px' }}>
                4 • Quality Warnings ({auditReport.warnings.length})
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {auditReport.warnings.map((w, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#f59e0b'
                    }}
                  >
                    <span className="material-symbols-outlined icon-xs" style={{ fontSize: '15px' }}>
                      warning
                    </span>
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Missing Sections Quick-Fix Catalog */}
          {missingChecks.filter((c) => c.templateKey && SECTION_TEMPLATES[c.templateKey]).length > 0 && (
            <div className="studio-section">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#38bdf8', marginBottom: '8px' }}>
                5 • Quick-Fix Starter Sections ({missingChecks.filter((c) => c.templateKey && SECTION_TEMPLATES[c.templateKey]).length})
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {missingChecks
                  .filter((c) => c.templateKey && SECTION_TEMPLATES[c.templateKey])
                  .map((check) => (
                    <div
                      key={check.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        background: 'var(--surface-base)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#f1f5f9', display: 'block' }}>
                          {check.label}
                        </span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                          +{check.weight} pts boost
                        </span>
                      </div>
                      <button
                        type="button"
                        className="audit-fix-btn"
                        onClick={() => onInsertSection(SECTION_TEMPLATES[check.templateKey], selectedFile)}
                        title={`Insert ${check.label} starter boilerplate into ${selectedFile}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span>
                        <span>Insert Boilerplate</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      }
      canvasContent={
        <div style={{ width: '100%', maxWidth: '820px', padding: '24px', boxSizing: 'border-box' }}>
          {/* Main Audit Checklist Card */}
          <div
            className="audit-checklist-stage-card"
            style={{
              backgroundColor: 'var(--surface-base, #1e1e1e)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Header with Title & Progress Bar */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary, #ffffff)' }}>
                    {activeStandardConfig.name} Standards Checklist
                  </h3>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
                    Auditing quality criteria for <strong>{selectedFile}</strong>
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: auditReport.gradeColor }}>
                    {passedChecksCount} / {auditReport.checks.length} Passed
                  </span>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted, #94a3b8)' }}>
                    {auditReport.scorePct}% Score
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'var(--surface-mid, rgba(255, 255, 255, 0.08))',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${auditReport.scorePct}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, #6366f1 0%, ${auditReport.gradeColor} 100%)`,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {displayedChecks.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  No criteria match the current filter.
                </div>
              ) : (
                displayedChecks.map((check) => (
                  <div
                    key={check.id}
                    className={`audit-check-card ${check.passed ? 'passed' : 'missing'}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: '18px',
                          color: check.passed ? '#10b981' : '#f59e0b',
                          flexShrink: 0
                        }}
                      >
                        {check.passed ? 'check_circle' : 'error'}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="audit-check-label">{check.label}</span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontFamily: 'monospace',
                              color: 'var(--text-muted, #94a3b8)',
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              padding: '1px 5px',
                              borderRadius: '3px'
                            }}
                          >
                            +{check.weight} pts
                          </span>
                        </div>
                        <div className="audit-check-tip">{check.tip}</div>
                      </div>
                    </div>

                    {!check.passed && check.templateKey && SECTION_TEMPLATES[check.templateKey] && (
                      <button
                        type="button"
                        className="audit-fix-btn"
                        onClick={() => onInsertSection(SECTION_TEMPLATES[check.templateKey], selectedFile)}
                        title={`Insert ${check.label} starter boilerplate into ${selectedFile}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>add</span>
                        <span>Add Section</span>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      }
    />
  )
}
