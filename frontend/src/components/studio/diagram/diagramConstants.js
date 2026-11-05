/**
 * Diagram Studio Constants & Preset Architecture Blueprints
 * High-fidelity definitions for Flowcharts, Sequence Diagrams, ER Models, Class, State, Git & Mindmaps.
 */

export const DIAGRAM_TYPES = [
  { id: 'flowchart', label: 'Flowchart', fullLabel: 'Architecture Flowchart', icon: 'account_tree', desc: 'System architectures, microservices, cloud topologies with subgraphs' },
  { id: 'sequence', label: 'Sequence', fullLabel: 'Sequence Diagram', icon: 'swap_horiz', desc: 'API handshakes, message protocols, event timelines, OAuth2 flows' },
  { id: 'er', label: 'ER Model', fullLabel: 'Database ER Model', icon: 'storage', desc: 'Relational database entities, foreign keys, tables, cardinalities' },
  { id: 'class', label: 'Class', fullLabel: 'Class & Object Diagram', icon: 'view_quilt', desc: 'Classes, interfaces, inheritance, composition, system interfaces' },
  { id: 'state', label: 'State', fullLabel: 'State Machine Diagram', icon: 'motion_photos_on', desc: 'Finite state machines, order processing lifecycles, auth transitions' },
  { id: 'git', label: 'Git Graph', fullLabel: 'Git Branching Graph', icon: 'commit', desc: 'GitFlow, trunk development, feature branch releases & hotfixes' },
  { id: 'mindmap', label: 'Mindmap', fullLabel: 'Mindmap & Roadmap', icon: 'hub', desc: 'Hierarchical roadmaps, knowledge trees, architecture decision breakdowns' }
]

// 8 Curated High-Fidelity Diagram Themes
export const DIAGRAM_THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Obsidian',
    dot: '#6366f1',
    bg: '#090d16',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#090d16',
        primaryColor: '#1e293b',
        primaryTextColor: '#f8fafc',
        textColor: '#f8fafc',
        nodeTextColor: '#f8fafc',
        mainBkg: '#1e293b',
        primaryBorderColor: '#6366f1',
        lineColor: '#38bdf8',
        secondaryColor: '#0f172a',
        tertiaryColor: '#161b22',
        actorBorder: '#6366f1',
        actorBkg: '#1e293b',
        actorTextColor: '#f8fafc',
        actorLineColor: '#38bdf8',
        signalColor: '#38bdf8',
        signalTextColor: '#f8fafc',
        labelBoxBkgColor: '#1e293b',
        labelBoxBorderColor: '#6366f1',
        labelTextColor: '#f8fafc',
        loopTextColor: '#38bdf8',
        noteBorderColor: '#f59e0b',
        noteBkgColor: '#291805',
        noteTextColor: '#fef3c7',
        activationBorderColor: '#6366f1',
        activationBkgColor: '#312e81',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        mindmapRootColor: '#4f46e5',
        mindmapRootTextColor: '#ffffff',
        cScale0: '#6366f1',
        cScaleLabel0: '#ffffff',
        cScale1: '#0ea5e9',
        cScaleLabel1: '#ffffff',
        cScale2: '#10b981',
        cScaleLabel2: '#ffffff',
        cScale3: '#f59e0b',
        cScaleLabel3: '#0f172a',
        cScale4: '#ec4899',
        cScaleLabel4: '#ffffff',
        cScale5: '#8b5cf6',
        cScaleLabel5: '#ffffff',
        cScale6: '#06b6d4',
        cScaleLabel6: '#ffffff',
        cScale7: '#f97316',
        cScaleLabel7: '#ffffff'
      }
    }
  },
  {
    id: 'tokyonight',
    name: 'Tokyo Night',
    dot: '#06b6d4',
    bg: '#1a1b26',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#1a1b26',
        primaryColor: '#24283b',
        primaryTextColor: '#c0caf5',
        textColor: '#c0caf5',
        nodeTextColor: '#c0caf5',
        mainBkg: '#24283b',
        primaryBorderColor: '#06b6d4',
        lineColor: '#bb9af7',
        secondaryColor: '#1f2335',
        tertiaryColor: '#292e42',
        actorBorder: '#06b6d4',
        actorBkg: '#24283b',
        actorTextColor: '#c0caf5',
        actorLineColor: '#bb9af7',
        signalColor: '#bb9af7',
        signalTextColor: '#c0caf5',
        labelBoxBkgColor: '#24283b',
        labelBoxBorderColor: '#06b6d4',
        labelTextColor: '#c0caf5',
        noteBorderColor: '#e0af68',
        noteBkgColor: '#2a241c',
        noteTextColor: '#ffedd5',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        mindmapRootColor: '#7aa2f7',
        mindmapRootTextColor: '#1a1b26',
        cScale0: '#7aa2f7',
        cScaleLabel0: '#1a1b26',
        cScale1: '#bb9af7',
        cScaleLabel1: '#1a1b26',
        cScale2: '#7dcfff',
        cScaleLabel2: '#1a1b26',
        cScale3: '#e0af68',
        cScaleLabel3: '#1a1b26',
        cScale4: '#f7768e',
        cScaleLabel4: '#ffffff',
        cScale5: '#9ece6a',
        cScaleLabel5: '#1a1b26',
        cScale6: '#2ac3de',
        cScaleLabel6: '#1a1b26',
        cScale7: '#ff9e64',
        cScaleLabel7: '#1a1b26'
      }
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    dot: '#ec4899',
    bg: '#080c14',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#080c14',
        primaryColor: '#180b33',
        primaryTextColor: '#fdf4ff',
        textColor: '#fdf4ff',
        nodeTextColor: '#fdf4ff',
        mainBkg: '#180b33',
        primaryBorderColor: '#ec4899',
        lineColor: '#06b6d4',
        secondaryColor: '#100826',
        tertiaryColor: '#1c133a',
        actorBorder: '#ec4899',
        actorBkg: '#180b33',
        actorTextColor: '#fdf4ff',
        actorLineColor: '#06b6d4',
        signalColor: '#06b6d4',
        signalTextColor: '#fdf4ff',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '13px',
        mindmapRootColor: '#ec4899',
        mindmapRootTextColor: '#ffffff',
        cScale0: '#ec4899',
        cScaleLabel0: '#ffffff',
        cScale1: '#06b6d4',
        cScaleLabel1: '#080c14',
        cScale2: '#a855f7',
        cScaleLabel2: '#ffffff',
        cScale3: '#facc15',
        cScaleLabel3: '#080c14',
        cScale4: '#3b82f6',
        cScaleLabel4: '#ffffff',
        cScale5: '#10b981',
        cScaleLabel5: '#080c14',
        cScale6: '#f43f5e',
        cScaleLabel6: '#ffffff',
        cScale7: '#14b8a6',
        cScaleLabel7: '#080c14'
      }
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    dot: '#10b981',
    bg: '#06281e',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#06281e',
        primaryColor: '#064e3b',
        primaryTextColor: '#ecfdf5',
        textColor: '#ecfdf5',
        nodeTextColor: '#ecfdf5',
        mainBkg: '#064e3b',
        primaryBorderColor: '#10b981',
        lineColor: '#34d399',
        secondaryColor: '#042f24',
        tertiaryColor: '#0c3d30',
        actorBorder: '#10b981',
        actorBkg: '#064e3b',
        actorTextColor: '#ecfdf5',
        actorLineColor: '#34d399',
        signalColor: '#34d399',
        signalTextColor: '#ecfdf5',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        mindmapRootColor: '#059669',
        mindmapRootTextColor: '#ffffff',
        cScale0: '#10b981',
        cScaleLabel0: '#06281e',
        cScale1: '#34d399',
        cScaleLabel1: '#06281e',
        cScale2: '#06b6d4',
        cScaleLabel2: '#06281e',
        cScale3: '#14b8a6',
        cScaleLabel3: '#06281e',
        cScale4: '#84cc16',
        cScaleLabel4: '#06281e',
        cScale5: '#22c55e',
        cScaleLabel5: '#06281e',
        cScale6: '#38bdf8',
        cScaleLabel6: '#06281e',
        cScale7: '#a3e635',
        cScaleLabel7: '#06281e'
      }
    }
  },
  {
    id: 'glacier',
    name: 'Nordic Glacier',
    dot: '#38bdf8',
    bg: '#082f49',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#082f49',
        primaryColor: '#0c4a6e',
        primaryTextColor: '#f0f9ff',
        textColor: '#f0f9ff',
        nodeTextColor: '#f0f9ff',
        mainBkg: '#0c4a6e',
        primaryBorderColor: '#38bdf8',
        lineColor: '#7dd3fc',
        secondaryColor: '#032034',
        tertiaryColor: '#0b3954',
        actorBorder: '#38bdf8',
        actorBkg: '#0c4a6e',
        actorTextColor: '#f0f9ff',
        actorLineColor: '#7dd3fc',
        signalColor: '#7dd3fc',
        signalTextColor: '#f0f9ff',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        mindmapRootColor: '#0284c7',
        mindmapRootTextColor: '#ffffff',
        cScale0: '#38bdf8',
        cScaleLabel0: '#082f49',
        cScale1: '#67e8f9',
        cScaleLabel1: '#082f49',
        cScale2: '#818cf8',
        cScaleLabel2: '#ffffff',
        cScale3: '#34d399',
        cScaleLabel3: '#082f49',
        cScale4: '#a78bfa',
        cScaleLabel4: '#ffffff',
        cScale5: '#60a5fa',
        cScaleLabel5: '#ffffff',
        cScale6: '#2dd4bf',
        cScaleLabel6: '#082f49',
        cScale7: '#c084fc',
        cScaleLabel7: '#ffffff'
      }
    }
  },
  {
    id: 'dracula',
    name: 'Dracula Purple',
    dot: '#bd93f9',
    bg: '#282a36',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#282a36',
        primaryColor: '#44475a',
        primaryTextColor: '#f8f8f2',
        textColor: '#f8f8f2',
        nodeTextColor: '#f8f8f2',
        mainBkg: '#44475a',
        primaryBorderColor: '#bd93f9',
        lineColor: '#50fa7b',
        secondaryColor: '#343746',
        tertiaryColor: '#21222c',
        actorBorder: '#bd93f9',
        actorBkg: '#44475a',
        actorTextColor: '#f8f8f2',
        actorLineColor: '#ff79c6',
        signalColor: '#ff79c6',
        signalTextColor: '#f8f8f2',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        mindmapRootColor: '#bd93f9',
        mindmapRootTextColor: '#282a36',
        cScale0: '#bd93f9',
        cScaleLabel0: '#282a36',
        cScale1: '#ff79c6',
        cScaleLabel1: '#282a36',
        cScale2: '#50fa7b',
        cScaleLabel2: '#282a36',
        cScale3: '#8be9fd',
        cScaleLabel3: '#282a36',
        cScale4: '#ffb86c',
        cScaleLabel4: '#282a36',
        cScale5: '#f1fa8c',
        cScaleLabel5: '#282a36',
        cScale6: '#ff5555',
        cScaleLabel6: '#ffffff',
        cScale7: '#6272a4',
        cScaleLabel7: '#ffffff'
      }
    }
  },
  {
    id: 'solarized',
    name: 'Solarized Dark',
    dot: '#268bd2',
    bg: '#002b36',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: true,
        background: '#002b36',
        primaryColor: '#073642',
        primaryTextColor: '#93a1a1',
        textColor: '#93a1a1',
        nodeTextColor: '#93a1a1',
        mainBkg: '#073642',
        primaryBorderColor: '#268bd2',
        lineColor: '#2aa198',
        secondaryColor: '#001e26',
        tertiaryColor: '#073642',
        actorBorder: '#268bd2',
        actorBkg: '#073642',
        actorTextColor: '#93a1a1',
        actorLineColor: '#2aa198',
        signalColor: '#2aa198',
        signalTextColor: '#93a1a1',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        mindmapRootColor: '#268bd2',
        mindmapRootTextColor: '#ffffff',
        cScale0: '#268bd2',
        cScaleLabel0: '#ffffff',
        cScale1: '#2aa198',
        cScaleLabel1: '#ffffff',
        cScale2: '#859900',
        cScaleLabel2: '#ffffff',
        cScale3: '#b58900',
        cScaleLabel3: '#ffffff',
        cScale4: '#cb4b16',
        cScaleLabel4: '#ffffff',
        cScale5: '#dc322f',
        cScaleLabel5: '#ffffff',
        cScale6: '#d33682',
        cScaleLabel6: '#ffffff',
        cScale7: '#6c71c4',
        cScaleLabel7: '#ffffff'
      }
    }
  },
  {
    id: 'primer',
    name: 'GitHub Primer Light',
    dot: '#0969da',
    bg: '#ffffff',
    config: {
      theme: 'base',
      themeVariables: {
        darkMode: false,
        background: '#ffffff',
        primaryColor: '#f6f8fa',
        primaryTextColor: '#1f2328',
        textColor: '#1f2328',
        nodeTextColor: '#1f2328',
        mainBkg: '#f6f8fa',
        primaryBorderColor: '#0969da',
        lineColor: '#57606a',
        secondaryColor: '#eaeef2',
        tertiaryColor: '#d0d7de',
        actorBorder: '#0969da',
        actorBkg: '#f6f8fa',
        actorTextColor: '#1f2328',
        actorLineColor: '#57606a',
        signalColor: '#0969da',
        signalTextColor: '#1f2328',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        mindmapRootColor: '#0969da',
        mindmapRootTextColor: '#ffffff',
        cScale0: '#0969da',
        cScaleLabel0: '#ffffff',
        cScale1: '#1a7f37',
        cScaleLabel1: '#ffffff',
        cScale2: '#8250df',
        cScaleLabel2: '#ffffff',
        cScale3: '#cf222e',
        cScaleLabel3: '#ffffff',
        cScale4: '#bf8700',
        cScaleLabel4: '#ffffff',
        cScale5: '#218bff',
        cScaleLabel5: '#ffffff',
        cScale6: '#0550ae',
        cScaleLabel6: '#ffffff',
        cScale7: '#116329',
        cScaleLabel7: '#ffffff'
      }
    }
  }
]

// Flowchart Node Shapes
export const SHAPES = [
  { id: 'box', label: 'Box', icon: 'crop_square', open: '[', close: ']' },
  { id: 'pill', label: 'Pill', icon: 'stadium', open: '([', close: '])' },
  { id: 'cylinder', label: 'Database', icon: 'database', open: '[(', close: ')]' },
  { id: 'diamond', label: 'Decision', icon: 'change_history', open: '{', close: '}' },
  { id: 'hexagon', label: 'Hexagon', icon: 'hexagon', open: '{{', close: '}}' },
  { id: 'circle', label: 'Circle', icon: 'radio_button_unchecked', open: '((', close: '))' },
  { id: 'subroutine', label: 'Subroutine', icon: 'view_compact', open: '[[', close: ']]' },
  { id: 'asymmetric', label: 'Flag / Banner', icon: 'bookmark', open: '>', close: ']' }
]

// Flowchart Edge Connection Styles
export const CONNECTION_STYLES = [
  { id: 'arrow', label: 'Solid Arrow', symbol: '-->' },
  { id: 'dotted', label: 'Dotted Arrow', symbol: '-.->' },
  { id: 'thick', label: 'Thick Arrow', symbol: '==>' },
  { id: 'twoway', label: 'Bidirectional', symbol: '<-->' },
  { id: 'open', label: 'Open Line', symbol: '---' },
  { id: 'dotted_open', label: 'Dotted Line', symbol: '-.-' },
  { id: 'thick_open', label: 'Thick Line', symbol: '===' }
]

// Canvas Background Patterns
export const CANVAS_BACKGROUNDS = [
  { id: 'dots', label: 'Dot Grid', icon: 'apps' },
  { id: 'grid', label: 'Graph Grid', icon: 'grid_on' },
  { id: 'dark', label: 'Obsidian', icon: 'dark_mode' },
  { id: 'slate', label: 'Navy Slate', icon: 'contrast' },
  { id: 'light', label: 'Whiteboard', icon: 'light_mode' }
]

// Accent Colors
export const ACCENT_COLORS = [
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Rose', color: '#ec4899' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Purple', color: '#a855f7' },
  { name: 'Sky', color: '#38bdf8' },
  { name: 'None', color: '' }
]

// Quick Node Tech Templates
export const TECH_NODE_PRESETS = [
  { id: 'client', name: 'Web & Mobile Client', shape: 'pill', color: '#06b6d4', icon: 'devices' },
  { id: 'gateway', name: 'API Gateway / Envoy', shape: 'box', color: '#818cf8', icon: 'door_sliding' },
  { id: 'service', name: 'Microservice API', shape: 'box', color: '#6366f1', icon: 'dns' },
  { id: 'db', name: 'PostgreSQL Database', shape: 'cylinder', color: '#38bdf8', icon: 'database' },
  { id: 'cache', name: 'Redis KV Cache', shape: 'cylinder', color: '#ef4444', icon: 'memory' },
  { id: 'queue', name: 'Kafka / SQS Queue', shape: 'hexagon', color: '#ec4899', icon: 'queue' },
  { id: 'storage', name: 'S3 Object Storage', shape: 'cylinder', color: '#f59e0b', icon: 'folder' },
  { id: 'auth', name: 'OAuth2 / Policy Svc', shape: 'diamond', color: '#10b981', icon: 'lock' }
]

// Preset Full Architecture Blueprints (24+ Categorized Templates)
export const PRESET_TEMPLATES = [
  // --- FLOWCHART / CLOUD / ARCHITECTURE ---
  {
    id: 'arch-microservices-subgraphs',
    type: 'flowchart',
    category: 'Cloud Architecture',
    title: 'Microservices with VPC Subgraphs',
    description: 'Public DMZ Gateway, Private Service Mesh with Subgraphs, Distributed Caching & PostgreSQL Cluster.',
    code: `flowchart TD
  subgraph Public_Zone ["Public DMZ & Ingress"]
    CDN([Cloudflare Edge CDN])
    APIGW[API Gateway :: Envoy]
    CDN -->|HTTPS / WSS| APIGW
  end

  subgraph Private_Mesh ["Private Service Mesh (K8s)"]
    APIGW --> AuthSvc[Auth & Policy Svc]
    APIGW --> AppSvc[Core Application API]
    APIGW --> PaymentSvc[Payment Processing Svc]
    AppSvc --> Worker[Background Task Worker]
  end

  subgraph Data_Tier ["Persistence & Streaming Tier"]
    AppSvc --> Cache[(Redis Cache Cluster)]
    AppSvc --> DB[(PostgreSQL Primary)]
    Worker -->|Async Events| Broker{{Kafka Event Bus}}
    PaymentSvc --> Stripe([Stripe External API])
  end

  style Public_Zone fill:#1e1e38,stroke:#6366f1,stroke-width:1px
  style Private_Mesh fill:#152238,stroke:#38bdf8,stroke-width:1px
  style Data_Tier fill:#1a2822,stroke:#10b981,stroke-width:1px`
  },
  {
    id: 'arch-serverless',
    type: 'flowchart',
    category: 'Cloud Architecture',
    title: 'AWS Serverless Event Pipeline',
    description: 'Route 53, CloudFront CDN, S3, API Gateway, AWS Lambda workers, and DynamoDB.',
    code: `flowchart TD
  DNS[Route 53 DNS] --> CF[CloudFront CDN]
  CF --> S3[(Static S3 Asset Bucket)]
  CF --> APIGW[Amazon API Gateway]
  APIGW --> LambdaAuth[Auth Authorizer Lambda]
  APIGW --> LambdaApp[Core API Lambda]
  LambdaApp --> Dynamo[(DynamoDB NoSQL)]
  LambdaApp --> SQS{{SQS Message Queue}}
  SQS --> LambdaWorker[Async Batch Worker]
  LambdaWorker --> SNS{{SNS Notifications}}`
  },
  {
    id: 'arch-rag-pipeline',
    type: 'flowchart',
    category: 'AI & Data Pipelines',
    title: 'Modern RAG & Vector Pipeline',
    description: 'Document ingestion, chunking, embeddings, ChromaDB vector store, semantic retrieval, and LLM synthesis.',
    code: `flowchart LR
  subgraph Ingestion ["1. Document Ingestion Pipeline"]
    Docs[PDF / Markdown / Code] --> Chunker[Semantic Document Chunker]
    Chunker --> Embedder[Text Embedding Model]
    Embedder --> VectorDB[(Vector DB :: ChromaDB / Pinecone)]
  end

  subgraph Retrieval ["2. Query & Generation Flow"]
    UserQuery([User Question]) --> QueryEmbed[Embed Query]
    QueryEmbed --> Retriever[Semantic Hybrid Retriever]
    VectorDB -. Similarity Search .-> Retriever
    Retriever --> PromptSynth[Context Augmented Prompt]
    PromptSynth --> LLM[Frontier LLM Engine]
    LLM --> Response([Synthesized Response & Citations])
  end

  style Ingestion fill:#1e1e38,stroke:#6366f1,stroke-width:1px
  style Retrieval fill:#15282e,stroke:#06b6d4,stroke-width:1px`
  },
  {
    id: 'arch-cqrs',
    type: 'flowchart',
    category: 'Cloud Architecture',
    title: 'CQRS & Event Sourcing Architecture',
    description: 'Commands write to Event Store log while Projections update read-optimized search indices.',
    code: `flowchart TD
  Client([Client Application]) -->|Write Command| CmdHandler[Command Handler API]
  CmdHandler -->|Validate & Append| EventStore[(Event Store Log)]
  EventStore -->|Stream Subscription| Projector[Read Model Projector]
  Projector -->|Update Projections| ReadDB[(Elasticsearch / Read DB)]
  Client -->|Read Query| ReadDB`
  },
  {
    id: 'cicd-github-actions',
    type: 'flowchart',
    category: 'DevOps & CI/CD',
    title: 'Automated CI/CD Delivery Pipeline',
    description: 'Git Push/PR -> Lint & Security -> Pytest/Jest -> Multi-Stage Docker -> GHCR -> Kubernetes Deploy.',
    code: `flowchart LR
  Push[Git Push / PR Open] --> Lint[Linter & Static Analysis]
  Lint --> Test[Unit & Integration Tests]
  Test --> Scan[Security Vulnerability Scan]
  Scan --> Build[Multi-Stage Docker Build]
  Build --> Reg[Container Registry :: GHCR]
  Reg --> Deploy[Kubernetes Production Cluster]
  Deploy --> HealthCheck{Health Heartbeat OK?}
  HealthCheck -->|Yes| Notify[Slack Notification :: Success]
  HealthCheck -->|No| Rollback[Automated Rollback]`
  },

  // --- SEQUENCE DIAGRAMS ---
  {
    id: 'seq-oauth2-flow',
    type: 'sequence',
    category: 'Authentication & Security',
    title: 'OAuth 2.0 Authorization Code & PKCE Flow',
    description: 'Single Page App client, Identity Provider (IdP), and API Backend token verification.',
    code: `sequenceDiagram
  autonumber
  actor User as End User
  participant SPA as Single Page App (Client)
  participant IdP as Identity Provider (OAuth2 / OIDC)
  participant API as Backend Resource Server

  User->>SPA: Click "Sign in with GitHub/Google"
  SPA->>SPA: Generate code_verifier & code_challenge (PKCE)
  SPA->>IdP: GET /oauth/authorize (challenge, client_id, scopes)
  IdP->>User: Display Consent Dialog
  User->>IdP: Grant Consent
  IdP-->>SPA: Redirect with Authorization Code
  SPA->>IdP: POST /oauth/token (code, code_verifier)
  IdP-->>SPA: 200 OK (access_token, id_token, refresh_token)
  SPA->>API: GET /api/v1/user/profile (Bearer access_token)
  API->>API: Verify JWT signature & scopes
  API-->>SPA: 200 OK (User Profile JSON)
  SPA-->>User: Render Dashboard UI`
  },
  {
    id: 'seq-stripe-webhook',
    type: 'sequence',
    category: 'Payment & E-Commerce',
    title: 'Stripe Checkout & Webhook Handshake',
    description: 'Customer checkout initiation, session creation, Stripe webhook dispatch, and database fulfillment.',
    code: `sequenceDiagram
  autonumber
  actor Customer
  participant Frontend as React Storefront
  participant Backend as Node/FastAPI Server
  participant Stripe as Stripe API Engine
  participant DB as PostgreSQL Database

  Customer->>Frontend: Click "Checkout Now"
  Frontend->>Backend: POST /api/checkout/session
  Backend->>Stripe: stripe.checkout.sessions.create()
  Stripe-->>Backend: Return session_id & checkout_url
  Backend-->>Frontend: Return checkout_url
  Frontend->>Customer: Redirect to Stripe Hosted Checkout
  Customer->>Stripe: Enter Card Credentials & Pay
  Stripe-->>Customer: Payment Successful (Redirect to Success URL)
  
  Note over Stripe,Backend: Asynchronous Secure Webhook Notification
  Stripe->>Backend: POST /webhooks/stripe (event: checkout.session.completed)
  Backend->>Backend: Verify Stripe-Signature header
  Backend->>DB: UPDATE orders SET status = 'PAID', paid_at = NOW()
  DB-->>Backend: Order Updated
  Backend->>Backend: Dispatch Order Confirmation Email
  Backend-->>Stripe: 200 HTTP OK Received`
  },
  {
    id: 'seq-websocket-chat',
    type: 'sequence',
    category: 'Real-Time Protocols',
    title: 'WebSocket Live Presence & Chat Protocol',
    description: 'HTTP Upgrade handshake, bidirectional packet streaming, Redis Pub/Sub fanout, and heartbeat pings.',
    code: `sequenceDiagram
  autonumber
  actor Alice as User Alice
  participant Gateway as WS Gateway
  participant Redis as Redis Pub/Sub
  actor Bob as User Bob

  Alice->>Gateway: GET /ws/chat (HTTP 101 Switching Protocols)
  Gateway-->>Alice: Connection Established (Sec-WebSocket-Accept)
  Bob->>Gateway: GET /ws/chat (HTTP 101 Switching Protocols)
  Gateway-->>Bob: Connection Established
  
  Alice->>Gateway: WS Send: {"type": "chat_msg", "text": "Hello world!"}
  Gateway->>Redis: PUBLISH room_general {"user": "Alice", "text": "Hello world!"}
  Redis-->>Gateway: Broadcast message to room subscribers
  Gateway-->>Bob: WS Receive: {"user": "Alice", "text": "Hello world!"}
  Gateway-->>Alice: WS Receive ACK: {"status": "DELIVERED"}

  loop Heartbeat Pulse (Every 30s)
    Gateway->>Alice: PING
    Alice-->>Gateway: PONG
  end`
  },

  // --- ENTITY RELATIONSHIP (ER) DIAGRAMS ---
  {
    id: 'er-ecommerce-schema',
    type: 'er',
    category: 'Database Schemas',
    title: 'E-Commerce Core Relational Schema',
    description: 'Users, Profiles, Orders, Line Items, Products, Categories, and Payment Transactions.',
    code: `erDiagram
  USERS ||--o{ ORDERS : places
  USERS ||--|| PROFILES : has
  ORDERS ||--|{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : referenced_in
  CATEGORIES ||--o{ PRODUCTS : categorizes
  ORDERS ||--|| PAYMENTS : settled_by

  USERS {
    uuid id PK
    string email UK
    string password_hash
    string full_name
    timestamp created_at
  }

  PROFILES {
    uuid id PK
    uuid user_id FK
    string avatar_url
    string phone_number
    string shipping_address
  }

  ORDERS {
    uuid id PK
    uuid user_id FK
    string order_number UK
    decimal total_amount
    string status
    timestamp placed_at
  }

  ORDER_ITEMS {
    uuid id PK
    uuid order_id FK
    uuid product_id FK
    int quantity
    decimal unit_price
  }

  PRODUCTS {
    uuid id PK
    uuid category_id FK
    string sku UK
    string title
    decimal price
    int stock_quantity
  }

  CATEGORIES {
    uuid id PK
    string slug UK
    string name
    string description
  }

  PAYMENTS {
    uuid id PK
    uuid order_id FK
    string provider
    string transaction_ref
    decimal amount
    string status
  }`
  },
  {
    id: 'er-saas-multitenant',
    type: 'er',
    category: 'Database Schemas',
    title: 'Multi-Tenant SaaS Organizations & RBAC',
    description: 'Tenants, Memberships, Roles, Permissions, Invoices, and API Keys.',
    code: `erDiagram
  TENANTS ||--|{ MEMBERSHIPS : has
  USERS ||--|{ MEMBERSHIPS : belongs_to
  ROLES ||--|{ MEMBERSHIPS : assigns
  ROLES ||--|{ ROLE_PERMISSIONS : defines
  PERMISSIONS ||--|{ ROLE_PERMISSIONS : grants
  TENANTS ||--o{ API_KEYS : owns
  TENANTS ||--o{ SUBSCRIPTION_INVOICES : billed

  TENANTS {
    uuid id PK
    string slug UK
    string company_name
    string tier
    timestamp created_at
  }

  USERS {
    uuid id PK
    string email UK
    string name
    boolean is_verified
  }

  MEMBERSHIPS {
    uuid id PK
    uuid tenant_id FK
    uuid user_id FK
    uuid role_id FK
    timestamp joined_at
  }

  ROLES {
    uuid id PK
    string role_name
    string description
  }

  PERMISSIONS {
    uuid id PK
    string scope UK
    string description
  }

  API_KEYS {
    uuid id PK
    uuid tenant_id FK
    string key_hash UK
    string label
    timestamp expires_at
  }`
  },

  // --- GIT GRAPHS ---
  {
    id: 'git-gitflow',
    type: 'git',
    category: 'Git & Workflows',
    title: 'GitFlow Branching Strategy',
    description: 'Main production branch, develop integration, feature branches, release hardening, and hotfixes.',
    code: `gitGraph
  commit id: "v1.0.0"
  branch develop
  checkout develop
  commit id: "feat: setup core"
  branch feature/user-auth
  checkout feature/user-auth
  commit id: "feat: login route"
  commit id: "feat: jwt session"
  checkout develop
  merge feature/user-auth id: "PR #12 merged"
  branch release/v1.1.0
  checkout release/v1.1.0
  commit id: "chore: bump version"
  checkout main
  merge release/v1.1.0 tag: "v1.1.0"
  checkout develop
  merge release/v1.1.0
  checkout main
  branch hotfix/auth-leak
  checkout hotfix/auth-leak
  commit id: "fix: sanitize tokens"
  checkout main
  merge hotfix/auth-leak tag: "v1.1.1"
  checkout develop
  merge hotfix/auth-leak`
  },

  // --- STATE MACHINES ---
  {
    id: 'state-order-lifecycle',
    type: 'state',
    category: 'State Machines & Lifecycles',
    title: 'E-Commerce Order State Machine',
    description: 'Created, Payment Processing, Paid, Packaging, In Transit, Delivered, and Cancelled/Refunded paths.',
    code: `stateDiagram-v2
  [*] --> Created : Cart Submitted
  
  Created --> PaymentPending : Payment Intent Issued
  PaymentPending --> PaymentFailed : Card Declined / Timeout
  PaymentFailed --> PaymentPending : Customer Retries
  PaymentFailed --> Cancelled : Auto-expire 24h

  PaymentPending --> Paid : Webhook Confirmed
  Paid --> Processing : Pick & Pack Started
  Processing --> Shipped : Carrier Label Scanned
  
  Shipped --> OutForDelivery : Local Hub Arrival
  OutForDelivery --> Delivered : Customer Signed
  Delivered --> [*]

  Paid --> RefundRequested : Dispute Opened
  RefundRequested --> Refunded : Approved
  Refunded --> [*]
  Cancelled --> [*]`
  },

  // --- CLASS DIAGRAMS ---
  {
    id: 'class-clean-architecture',
    type: 'class',
    category: 'System Design',
    title: 'Clean Architecture (Hexagonal Ports & Adapters)',
    description: 'Domain Entities, Use Cases, Repository Ports, and Database/API Adapters.',
    code: `classDiagram
  class UserEntity {
    +UUID id
    +String email
    +String fullName
    +validateEmail() Boolean
    +changePassword(String hash) void
  }

  class UserRepositoryPort {
    <<interface>>
    +findById(UUID id) UserEntity
    +save(UserEntity user) UserEntity
    +delete(UUID id) Boolean
  }

  class RegisterUserUseCase {
    -UserRepositoryPort userRepo
    -HasherPort hasher
    +execute(RegisterDTO dto) UserEntity
  }

  class PostgresUserAdapter {
    -DatabaseClient client
    +findById(UUID id) UserEntity
    +save(UserEntity user) UserEntity
    +delete(UUID id) Boolean
  }

  class UserRestController {
    -RegisterUserUseCase registerUseCase
    +handlePost(Request req) Response
  }

  RegisterUserUseCase --> UserRepositoryPort : depends on
  RegisterUserUseCase --> UserEntity : returns
  PostgresUserAdapter ..|> UserRepositoryPort : implements
  UserRestController --> RegisterUserUseCase : invokes`
  },

  // --- MINDMAPS ---
  {
    id: 'mindmap-devops-roadmap',
    type: 'mindmap',
    category: 'Mindmaps & Roadmaps',
    title: 'Modern DevOps & Platform Engineering',
    description: 'Infrastructure as Code, Containers, Observability, CI/CD, and Security guardrails.',
    code: `mindmap
  root((Platform Engineering))
    Infrastructure as Code
      Terraform
      OpenTofu
      Pulumi
      AWS CDK
    Containers & Orchestration
      Docker
      Kubernetes
      Helm Charts
      ArgoCD GitOps
    CI / CD Pipelines
      GitHub Actions
      GitLab CI
      Tekton
    Observability & SRE
      Prometheus Metrics
      Grafana Dashboards
      OpenTelemetry Tracing
      Loki Log Aggregation
    Security & Policy
      Trivy Scanner
      Falco Runtime Guard
      HashiCorp Vault
      Cosign Image Sign`
  },
  // --- KUBERNETES SERVICE MESH (FLOWCHART) ---
  {
    id: 'arch-k8s-service-mesh',
    type: 'flowchart',
    category: 'Cloud Architecture',
    title: 'Kubernetes Istio Service Mesh & Ingress',
    description: 'Envoy sidecar proxies, mutual TLS traffic encryption, Istiod control plane, and Jaeger/Prometheus observability.',
    code: `flowchart TD
  subgraph Ingress ["Edge Ingress Tier"]
    Traffic([External HTTPS Traffic]) --> EnvoyIngress[Istio Ingress Gateway]
  end

  subgraph MeshCluster ["Service Mesh Cluster (K8s)"]
    EnvoyIngress -->|mTLS Route| SidecarA[Sidecar Proxy :: Envoy]
    SidecarA --- WebApp[Frontend Service Pod]
    
    WebApp --> SidecarB[Sidecar Proxy :: Envoy]
    SidecarB --- OrderSvc[Order Processing Pod]
    
    OrderSvc --> SidecarC[Sidecar Proxy :: Envoy]
    SidecarC --- InvSvc[Inventory Service Pod]
  end

  subgraph ControlPlane ["Istio Control Plane"]
    Istiod[Istiod Controller] -. Dynamic Config .-> SidecarA
    Istiod -. Certificate Rotation .-> SidecarB
    Istiod -. Telemetry Policy .-> SidecarC
  end

  subgraph Observability ["Observability Mesh"]
    SidecarB -->|Otel Traces| Jaeger[Jaeger Distributed Tracing]
    SidecarC -->|Metrics Scrape| Prometheus[Prometheus Engine]
  end

  style Ingress fill:#1e1e38,stroke:#6366f1,stroke-width:1px
  style MeshCluster fill:#152238,stroke:#38bdf8,stroke-width:1px
  style ControlPlane fill:#2a1e38,stroke:#c084fc,stroke-width:1px
  style Observability fill:#1a2822,stroke:#10b981,stroke-width:1px`
  },
  // --- REAL-TIME EVENT STREAMING (FLOWCHART) ---
  {
    id: 'arch-event-driven-streaming',
    type: 'flowchart',
    category: 'AI & Data Pipelines',
    title: 'Real-Time IoT Event Streaming & Analytics',
    description: 'Edge MQTT sensors, Kafka event streaming, Apache Flink real-time stream processing, and TimescaleDB analytics.',
    code: `flowchart LR
  subgraph EdgeTier ["IoT & Mobile Edge Tier"]
    Sensors([Edge IoT Devices]) --> MQTT[MQTT Gateway Broker]
    MobileApp([Mobile Clients]) --> HTTPGateway[REST Event Ingestion]
  end

  subgraph StreamingCore ["Distributed Streaming Tier"]
    MQTT --> KafkaIngress{{Kafka Topic :: raw_telemetry}}
    HTTPGateway --> KafkaIngress
    KafkaIngress --> Flink[Apache Flink Stream Processor]
    Flink --> KafkaOut{{Kafka Topic :: aggregated_events}}
  end

  subgraph StorageTier ["Analytical & Time-Series Storage"]
    KafkaOut --> Timescale[(TimescaleDB Time-Series)]
    KafkaOut --> Lakehouse[(Apache Iceberg Data Lake)]
  end

  subgraph ConsumerTier ["Consumers & Dashboards"]
    Timescale --> Grafana[Grafana Realtime Dashboard]
    Lakehouse --> Spark[Spark ML Anomaly Detector]
  end

  style EdgeTier fill:#1e1e38,stroke:#6366f1,stroke-width:1px
  style StreamingCore fill:#15282e,stroke:#06b6d4,stroke-width:1px
  style StorageTier fill:#1a2822,stroke:#10b981,stroke-width:1px
  style ConsumerTier fill:#2e2615,stroke:#f59e0b,stroke-width:1px`
  },
  // --- MFA TOTP VERIFICATION (SEQUENCE) ---
  {
    id: 'seq-mfa-totp',
    type: 'sequence',
    category: 'Authentication & Security',
    title: 'Two-Factor TOTP Authenticator Protocol',
    description: 'User login challenge, 6-digit TOTP verification against RFC 6238 time drift windows, and session issuance.',
    code: `sequenceDiagram
  autonumber
  actor User as End User
  participant Web as Web Client (Browser)
  participant Auth as Authentication Service
  participant TOTP as TOTP Engine (RFC 6238)
  participant DB as User Database

  User->>Web: Enter Username & Password
  Web->>Auth: POST /auth/login (credentials)
  Auth->>DB: Query user hash & MFA status
  DB-->>Auth: User verified (MFA_ENABLED = true)
  Auth-->>Web: 202 Accepted (temp_session_token, mfa_required)
  Web-->>User: Display MFA Code Prompt
  User->>Web: Input 6-Digit Authenticator Code
  Web->>Auth: POST /auth/mfa/verify (temp_token, code)
  Auth->>DB: Fetch user TOTP secret key
  DB-->>Auth: Return encrypted_totp_secret
  Auth->>TOTP: ValidateCode(secret, code, window=1)
  alt Code Matches Valid Time Window
    TOTP-->>Auth: Verification Success
    Auth->>Auth: Generate JWT Access & Refresh Tokens
    Auth-->>Web: 200 OK (access_token, refresh_token)
    Web-->>User: Redirect to Secure Dashboard
  else Code Invalid or Expired
    TOTP-->>Auth: Verification Failed
    Auth-->>Web: 401 Unauthorized (Invalid 2FA Code)
    Web-->>User: Display "Invalid Code, Please Try Again"
  end`
  },
  // --- SAGA DISTRIBUTED TRANSACTIONS (SEQUENCE) ---
  {
    id: 'seq-saga-distributed-txn',
    type: 'sequence',
    category: 'Payment & E-Commerce',
    title: 'Distributed Saga Pattern & Compensations',
    description: 'Choreographed order checkout with compensating refund rollbacks upon inventory stockout failures.',
    code: `sequenceDiagram
  autonumber
  actor Customer
  participant Orch as Order Saga Orchestrator
  participant OrderSvc as Order Service
  participant PaymentSvc as Payment Service
  participant StockSvc as Inventory Service

  Customer->>Orch: Submit Order Checkout
  Orch->>OrderSvc: 1. CreatePendingOrder(orderId)
  OrderSvc-->>Orch: Order Created (Status: PENDING)
  
  Orch->>PaymentSvc: 2. ProcessPayment(orderId, amount)
  PaymentSvc-->>Orch: Payment Successful (txId: 9812)

  Orch->>StockSvc: 3. ReserveInventory(items)
  alt Inventory Available
    StockSvc-->>Orch: Stock Reserved Successfully
    Orch->>OrderSvc: 4. MarkOrderConfirmed(orderId)
    OrderSvc-->>Orch: Order Confirmed (Status: CONFIRMED)
    Orch-->>Customer: Order Placed Successfully!
  else Out of Stock (Compensating Transaction)
    StockSvc-->>Orch: Error: Insufficient Stock
    Note over Orch,PaymentSvc: Rollback: Compensating Refund
    Orch->>PaymentSvc: RefundPayment(txId: 9812)
    PaymentSvc-->>Orch: Refund Issued Successfully
    Orch->>OrderSvc: CancelOrder(orderId, reason: "Out of Stock")
    OrderSvc-->>Orch: Order Cancelled
    Orch-->>Customer: Checkout Failed: Item Out of Stock
  end`
  },
  // --- SOCIAL NETWORK RELATIONAL SCHEMA (ER) ---
  {
    id: 'er-social-network',
    type: 'er',
    category: 'Database Schemas',
    title: 'Social Network Platform Relational Schema',
    description: 'Users, Profiles, Posts, Nested Comments, Likes, Directed Follower Graph, and Tagging.',
    code: `erDiagram
  USERS ||--o{ POSTS : authors
  USERS ||--o{ COMMENTS : writes
  POSTS ||--o{ COMMENTS : receives
  USERS ||--o{ LIKES : gives
  POSTS ||--o{ LIKES : receives
  USERS ||--o{ FOLLOWS : follower
  USERS ||--o{ FOLLOWS : following
  POSTS }o--o{ HASHTAGS : tagged_with

  USERS {
    uuid id PK
    string username UK
    string display_name
    string email UK
    string bio
    timestamp created_at
  }

  POSTS {
    uuid id PK
    uuid user_id FK
    text content
    string media_url
    int likes_count
    int comments_count
    timestamp published_at
  }

  COMMENTS {
    uuid id PK
    uuid post_id FK
    uuid user_id FK
    text comment_text
    timestamp created_at
  }

  LIKES {
    uuid id PK
    uuid user_id FK
    uuid post_id FK
    timestamp created_at
  }

  FOLLOWS {
    uuid follower_id FK
    uuid following_id FK
    timestamp created_at
  }

  HASHTAGS {
    uuid id PK
    string tag_name UK
    int usage_count
  }`
  },
  // --- HEALTHCARE EHR SYSTEM (ER) ---
  {
    id: 'er-healthcare-hospital',
    type: 'er',
    category: 'Database Schemas',
    title: 'Hospital & Healthcare Electronic Health Records',
    description: 'Patients, Doctors, Medical Departments, Clinical Appointments, Diagnostic Records, and Prescriptions.',
    code: `erDiagram
  PATIENTS ||--o{ APPOINTMENTS : books
  DOCTORS ||--o{ APPOINTMENTS : attends
  DEPARTMENTS ||--|{ DOCTORS : employs
  PATIENTS ||--o{ MEDICAL_RECORDS : has
  DOCTORS ||--o{ MEDICAL_RECORDS : creates
  MEDICAL_RECORDS ||--o{ PRESCRIPTIONS : contains

  PATIENTS {
    uuid id PK
    string medical_record_no UK
    string full_name
    date date_of_birth
    string blood_group
    string contact_phone
  }

  DOCTORS {
    uuid id PK
    uuid department_id FK
    string license_number UK
    string full_name
    string specialization
    string office_room
  }

  DEPARTMENTS {
    uuid id PK
    string dept_name UK
    string building_floor
    string emergency_contact
  }

  APPOINTMENTS {
    uuid id PK
    uuid patient_id FK
    uuid doctor_id FK
    datetime scheduled_time
    string status
    text reason_for_visit
  }

  MEDICAL_RECORDS {
    uuid id PK
    uuid patient_id FK
    uuid doctor_id FK
    datetime diagnosis_date
    text diagnosis_notes
    string icd10_code
  }

  PRESCRIPTIONS {
    uuid id PK
    uuid record_id FK
    string medication_name
    string dosage
    string frequency
    int duration_days
  }`
  },
  // --- GOF OBSERVER & FACTORY (CLASS) ---
  {
    id: 'class-gof-patterns',
    type: 'class',
    category: 'System Design',
    title: 'GoF Observer & Factory Method Patterns',
    description: 'Subject abstraction, concrete notification observers, and extensible polymorphic product factories.',
    code: `classDiagram
  class Subject {
    <<abstract>>
    -List~Observer~ observers
    +attach(Observer o) void
    +detach(Observer o) void
    +notifyObservers(Event e) void
  }

  class ConcreteSubject {
    -String state
    +getState() String
    +setState(String s) void
  }

  class Observer {
    <<interface>>
    +update(Event e) void
  }

  class EmailNotificationObserver {
    -String smtpServer
    +update(Event e) void
  }

  class AuditLogObserver {
    -Logger logger
    +update(Event e) void
  }

  class ProductFactory {
    <<abstract>>
    +createProduct(String type) Product
  }

  class ConcreteProductFactory {
    +createProduct(String type) Product
  }

  class Product {
    <<interface>>
    +execute() void
  }

  Subject <|-- ConcreteSubject : inherits
  Observer <|.. EmailNotificationObserver : implements
  Observer <|.. AuditLogObserver : implements
  Subject o-- Observer : notifies
  ProductFactory <|-- ConcreteProductFactory : implements
  ConcreteProductFactory ..> Product : instantiates`
  },
  // --- DOMAIN-DRIVEN DESIGN AGGREGATE (CLASS) ---
  {
    id: 'class-ecommerce-ddd',
    type: 'class',
    category: 'System Design',
    title: 'Domain-Driven Design (DDD) Order Aggregate',
    description: 'Order aggregate root, OrderItem entity, immutable Value Objects (Money, Address), and encapsulation.',
    code: `classDiagram
  class OrderAggregate {
    -UUID id
    -CustomerId customerId
    -OrderStatus status
    -List~OrderItem~ items
    -Money totalAmount
    +addItem(ProductId pid, int qty, Money price) void
    +removeItem(ProductId pid) void
    +confirmOrder() void
    +cancelOrder(String reason) void
    +calculateTotal() Money
  }

  class OrderItem {
    -UUID id
    -ProductId productId
    -int quantity
    -Money unitPrice
    +getSubtotal() Money
  }

  class Money {
    <<ValueObject>>
    +Decimal amount
    +Currency currency
    +add(Money other) Money
    +multiply(int qty) Money
  }

  class CustomerId {
    <<ValueObject>>
    +UUID value
  }

  class Address {
    <<ValueObject>>
    +String street
    +String city
    +String postalCode
    +String country
  }

  OrderAggregate *-- OrderItem : contains
  OrderAggregate --> Money : uses
  OrderAggregate --> CustomerId : references
  OrderAggregate --> Address : shippingAddress
  OrderItem --> Money : unitPrice`
  },
  // --- USER AUTH & JWT SESSION LIFECYCLE (STATE) ---
  {
    id: 'state-user-auth-session',
    type: 'state',
    category: 'State Machines & Lifecycles',
    title: 'User Authentication & JWT Session Lifecycle',
    description: 'Anonymous visitor, credential challenge, composite active session, auto token refreshing, and lockouts.',
    code: `stateDiagram-v2
  [*] --> Anonymous : App Launched
  
  Anonymous --> Authenticating : Submit Credentials
  Authenticating --> ActiveSession : MFA & Password Valid
  Authenticating --> FailedAttempt : Invalid Credentials
  FailedAttempt --> Authenticating : Retry (< 5 attempts)
  FailedAttempt --> LockedOut : >= 5 Consecutive Failures

  LockedOut --> Anonymous : Admin Reset or 30m Lockout Expiry

  state ActiveSession {
    [*] --> Idle
    Idle --> Interacting : User Gesture
    Interacting --> Idle : Inactivity > 5m
    Idle --> TokenRefreshing : Access Token Expiring (15m)
    TokenRefreshing --> Idle : Refresh Token Exchange OK
  }

  ActiveSession --> SessionExpired : Inactivity Timeout (24h)
  ActiveSession --> Anonymous : Explicit Logout
  ActiveSession --> Revoked : Remote Force Logout / Password Change

  SessionExpired --> Anonymous : Redirect to Login
  Revoked --> Anonymous : Clear Cookies & LocalStorage`
  },
  // --- EDITORIAL PUBLISHING WORKFLOW (STATE) ---
  {
    id: 'state-content-publishing',
    type: 'state',
    category: 'State Machines & Lifecycles',
    title: 'CMS Editorial Content Publishing Lifecycle',
    description: 'Draft authoring, editorial peer review, revisions, scheduling, live publication, and archival.',
    code: `stateDiagram-v2
  [*] --> Draft : Create New Document
  
  Draft --> ReviewPending : Submit for Review
  Draft --> Draft : Autosave Edits
  
  ReviewPending --> InReview : Assigned to Senior Editor
  InReview --> ChangesRequested : Feedback Provided
  ChangesRequested --> Draft : Author Resumes Editing
  
  InReview --> Approved : Editorial Sign-off
  Approved --> Scheduled : Set Target Publish Date
  Scheduled --> Published : Cron Target Triggered
  Approved --> Published : Instant One-Click Publish
  
  Published --> Archived : Deprecated / Sunset
  Archived --> Draft : Restore as Working Copy
  Archived --> [*]`
  },
  // --- GITHUB FLOW FEATURE BRANCHING (GIT) ---
  {
    id: 'git-github-flow',
    type: 'git',
    category: 'Git & Workflows',
    title: 'GitHub Flow Pull Request & Staging',
    description: 'Lightweight feature branching from main, continuous integration commits, sync merges, and pull request squash.',
    code: `gitGraph
  commit id: "init repo"
  commit id: "add package.json"
  branch feature/dark-mode
  checkout feature/dark-mode
  commit id: "feat: add theme tokens"
  commit id: "feat: toggle switch component"
  commit id: "test: theme switch specs"
  checkout main
  commit id: "docs: update readme"
  checkout feature/dark-mode
  merge main id: "sync main into PR"
  checkout main
  merge feature/dark-mode id: "Squash & Merge PR #42" tag: "v1.2.0"
  commit id: "chore: deploy staging"`
  },
  // --- TRUNK-BASED HOTFIX CYCLE (GIT) ---
  {
    id: 'git-hotfix-release',
    type: 'git',
    category: 'Git & Workflows',
    title: 'Trunk-Based Release & Cherry-Pick Hotfix',
    description: 'Release tagging, branch hardening, production critical hotfix isolation, and merge propagation.',
    code: `gitGraph
  commit id: "release v2.0" tag: "v2.0.0"
  branch release/v2.0
  checkout release/v2.0
  commit id: "chore: lock dependencies"
  checkout main
  commit id: "feat: new dashboard layout"
  commit id: "feat: user analytics table"
  checkout release/v2.0
  branch hotfix/memory-leak
  checkout hotfix/memory-leak
  commit id: "fix: clean event listeners"
  checkout release/v2.0
  merge hotfix/memory-leak tag: "v2.0.1-patch"
  checkout main
  merge hotfix/memory-leak id: "cherry-pick hotfix into main"`
  },
  // --- AI ENGINEER 2026 ROADMAP (MINDMAP) ---
  {
    id: 'mindmap-ai-engineer',
    type: 'mindmap',
    category: 'Mindmaps & Roadmaps',
    title: 'AI & LLM Systems Engineer Roadmap 2026',
    description: 'In-Context Prompting, RAG architectures, Autonomous Agent loops, Fine-Tuning LoRA, and Production Guardrails.',
    code: `mindmap
  root((AI Engineer 2026))
    Prompt Engineering
      Few-Shot In-Context Learning
      Chain-of-Thought Reasoning
      Structured Outputs JSON Schema
    Retrieval Augmented Generation
      Semantic Embeddings
      Hybrid Search Sparse and Dense
      Reranking Models Cohere
      Vector Databases Chroma Pinecone
    Autonomous Agents
      ReAct Planning Loops
      Tool Calling and Function Exec
      Multi-Agent Teams Orchestration
      Sandboxed Code Execution
    Fine-Tuning and Alignment
      LoRA and QLoRA Adapters
      Direct Preference Opt DPO
      Synthetic Data Curation
    Evaluation and Production
      LLM as a Judge
      Latency and Token Cost Guard
      Prompt Injection Firewalls`
  },
  // --- ZERO TRUST ARCHITECTURE (MINDMAP) ---
  {
    id: 'mindmap-zero-trust-sec',
    type: 'mindmap',
    category: 'Mindmaps & Roadmaps',
    title: 'Zero Trust Cybersecurity Architecture',
    description: 'Passwordless identity verification, micro-perimeter network segmentation, workload attestation, and data protection.',
    code: `mindmap
  root((Zero Trust Architecture))
    Identity and Access
      Passwordless WebAuthn
      Contextual Conditional Access
      Short-Lived Ephemeral JWTs
      Least Privilege RBAC
    Micro-Perimeter Network
      Mutual TLS WireGuard
      Software-Defined Perimeter
      Kubernetes Network Policies
    Workload and Compute
      Hardened Minimal Containers
      Runtime eBPF Monitoring
      Vulnerability SBOM Scans
    Data Protection
      Envelope Encryption AES-256
      Automated Secret Rotation
      Data Loss Prevention DLP
    Threat Analytics
      SIEM Realtime Ingestion
      Behavioral Anomaly Detection
      Automated Incident Playbooks`
  }

]
