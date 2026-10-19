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
        fontSize: '13px'
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
        fontSize: '13px'
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
        fontSize: '13px'
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
        fontSize: '13px'
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
        fontSize: '13px'
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
        fontSize: '13px'
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
        fontSize: '13px'
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
        fontSize: '13px'
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
  }
]
