/**
 * README Studio - Badge & Metric Studio Datasets
 * Static configuration presets, catalog taxonomies, swatches, and supported icons.
 */

// Studio Workflow Modes
export const STUDIO_MODES = [
  { id: 'single', label: 'Badge Designer', icon: 'shield' },
  { id: 'rack', label: 'Tech Stack & Rack', icon: 'layers' },
  { id: 'skillicons', label: 'SkillIcons Squircles', icon: 'grid_view' },
  { id: 'github', label: 'Dynamic GitHub Metrics', icon: 'monitoring' },
  { id: 'repocards', label: 'GitHub Repo Pin Cards', icon: 'featured_play_list' },
  { id: 'packs', label: 'Curated Tech Packs', icon: 'collections_bookmark' }
]

// Badge Format Architectures
export const BADGE_FORMATS = [
  { id: 'split', title: 'Dual Segment', subtitle: 'Label | Value', icon: 'splitscreen' },
  { id: 'brand-plate', title: 'Brand Plate', subtitle: 'Solid Branded Chip', icon: 'view_agenda' },
  { id: 'icon-only', title: 'Micro Tile', subtitle: 'Logo Square Only', icon: 'crop_square' },
  { id: 'badgen', title: 'Badgen.net', subtitle: 'Compact Micro SVG', icon: 'bolt' }
]

// Shields.io Core Badge Geometry Styles
export const BADGE_STYLES = [
  {
    id: 'for-the-badge',
    label: 'For the Badge',
    tag: 'Bold & Uppercase',
    desc: 'Heavy uppercase banner with generous horizontal padding. Industry standard for top-level README hero headers.'
  },
  {
    id: 'flat-square',
    label: 'Flat Square',
    tag: 'Developer Standard',
    desc: 'Sharp 90-degree square corners. Crisp, technical, and compact for dense tech stack matrices.'
  },
  {
    id: 'flat',
    label: 'Flat',
    tag: 'Shields Default',
    desc: 'Subtle 3px rounded rectangle corners with clean, balanced typography. Universally recognized.'
  },
  {
    id: 'plastic',
    label: 'Plastic 3D',
    tag: 'Glossy Highlight',
    desc: 'Rounded corners with a subtle convex glossy gradient highlight along the upper half.'
  },
  {
    id: 'social',
    label: 'Social Callout',
    tag: 'GitHub Bubble',
    desc: 'White arrow bubble callout counter modeled after GitHub native star and follower buttons.'
  }
]

// 14 Curated Dual-Tone Color Themes (with Left Label and Right Message pairings)
export const COLOR_THEMES = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon', labelColor: '180b33', color: 'ec4899', accent: '06b6d4' },
  { id: 'emerald', name: 'Emerald Matrix', labelColor: '064e3b', color: '10b981', accent: '34d399' },
  { id: 'indigo', name: 'Electric Indigo', labelColor: '1e1b4b', color: '6366f1', accent: '818cf8' },
  { id: 'obsidian', name: 'Midnight Obsidian', labelColor: '090d16', color: '1e293b', accent: '38bdf8' },
  { id: 'amber', name: 'Solar Amber', labelColor: '451a03', color: 'f59e0b', accent: 'fbbf24' },
  { id: 'crimson', name: 'Rose Crimson', labelColor: '4c0519', color: 'ef4444', accent: 'f43f5e' },
  { id: 'glacier', name: 'Nordic Glacier', labelColor: '082f49', color: '0ea5e9', accent: '38bdf8' },
  { id: 'dracula', name: 'Dracula Purple', labelColor: '282a36', color: 'bd93f9', accent: 'ff79c6' },
  { id: 'monokai', name: 'Monokai Neon', labelColor: '272822', color: 'a6e22e', accent: 'e6db74' },
  { id: 'github', name: 'GitHub Primer', labelColor: '24292e', color: '0969da', accent: '2ea44f' },
  { id: 'minimal', name: 'Minimal Mono', labelColor: '18181b', color: '52525b', accent: 'fafafa' },
  { id: 'sunset', name: 'Sunset Horizon', labelColor: '7c2d12', color: 'ea580c', accent: 'fb923c' },
  { id: 'vaporwave', name: 'Vaporwave Orchid', labelColor: '3b0764', color: 'c084fc', accent: 'f472b6' },
  { id: 'teal', name: 'Deep Oceanic', labelColor: '042f2e', color: '0d9488', accent: '2dd4bf' }
]

// Categorized 36 Swatches Matrix
export const COLOR_SWATCHES = [
  // Vibrant Accents
  { name: 'Electric Indigo', hex: '6366f1', group: 'vibrant' },
  { name: 'Bright Emerald', hex: '10b981', group: 'vibrant' },
  { name: 'Amber Gold', hex: 'f59e0b', group: 'vibrant' },
  { name: 'Rose Red', hex: 'ef4444', group: 'vibrant' },
  { name: 'Cyber Cyan', hex: '06b6d4', group: 'vibrant' },
  { name: 'Purple Neon', hex: 'a855f7', group: 'vibrant' },
  { name: 'Hot Pink', hex: 'ec4899', group: 'vibrant' },
  { name: 'Lime Spark', hex: '84cc16', group: 'vibrant' },
  { name: 'Sky Blue', hex: '0ea5e9', group: 'vibrant' },
  { name: 'Orange Blaze', hex: 'f97316', group: 'vibrant' },
  { name: 'Teal Ocean', hex: '14b8a6', group: 'vibrant' },
  { name: 'Violet Gem', hex: '8b5cf6', group: 'vibrant' },

  // Dark & Sleek Neutrals
  { name: 'Midnight Obsidian', hex: '090d16', group: 'neutral' },
  { name: 'Deep Slate', hex: '1e293b', group: 'neutral' },
  { name: 'Dark Charcoal', hex: '27272a', group: 'neutral' },
  { name: 'Midnight Blue', hex: '0f172a', group: 'neutral' },
  { name: 'Carbon Black', hex: '18181b', group: 'neutral' },
  { name: 'Ghost Stone', hex: '44403c', group: 'neutral' },
  { name: 'GitHub Dark', hex: '24292e', group: 'neutral' },
  { name: 'Pitch Black', hex: '000000', group: 'neutral' },

  // Tech Brands
  { name: 'Python Blue', hex: '3776ab', group: 'brand' },
  { name: 'React Cyan', hex: '61dafb', group: 'brand' },
  { name: 'TypeScript', hex: '3178c6', group: 'brand' },
  { name: 'JavaScript', hex: 'f7df1e', group: 'brand' },
  { name: 'Node.js Green', hex: '5fa04e', group: 'brand' },
  { name: 'Docker Blue', hex: '2496ed', group: 'brand' },
  { name: 'Rust Orange', hex: 'dea584', group: 'brand' },
  { name: 'Go Cyan', hex: '00add8', group: 'brand' },
  { name: 'FastAPI Teal', hex: '009688', group: 'brand' },
  { name: 'Tailwind Cyan', hex: '06b6d4', group: 'brand' },
  { name: 'Discord Blurple', hex: '5865f2', group: 'brand' },
  { name: 'PostgreSQL', hex: '4169e1', group: 'brand' },
  { name: 'MongoDB Green', hex: '47a248', group: 'brand' },
  { name: 'YouTube Red', hex: 'ff0000', group: 'brand' },
  { name: 'AWS Orange', hex: 'ff9900', group: 'brand' },
  { name: 'GitHub Purple', hex: '8250df', group: 'brand' }
]

// 75+ Verified SimpleIcons Directory with Default Brand Colors
export const SIMPLE_ICONS = [
  // Languages
  { name: 'JavaScript', slug: 'javascript', category: 'languages', color: 'f7df1e', label: 'javascript', message: 'ES2024' },
  { name: 'TypeScript', slug: 'typescript', category: 'languages', color: '3178c6', label: 'typescript', message: '5.8+' },
  { name: 'Python', slug: 'python', category: 'languages', color: '3776ab', label: 'python', message: '3.12+' },
  { name: 'Rust', slug: 'rust', category: 'languages', color: 'dea584', label: 'rust', message: '2024' },
  { name: 'Go', slug: 'go', category: 'languages', color: '00add8', label: 'go', message: '1.24+' },
  { name: 'C++', slug: 'cplusplus', category: 'languages', color: '00599c', label: 'c++', message: 'C++20' },
  { name: 'C#', slug: 'csharp', category: 'languages', color: '239120', label: 'c#', message: '.NET 9' },
  { name: 'Java', slug: 'openjdk', category: 'languages', color: 'ed8b00', label: 'java', message: 'OpenJDK 21' },
  { name: 'Swift', slug: 'swift', category: 'languages', color: 'f05138', label: 'swift', message: '6.0' },
  { name: 'Kotlin', slug: 'kotlin', category: 'languages', color: '7f52ff', label: 'kotlin', message: '2.0+' },
  { name: 'PHP', slug: 'php', category: 'languages', color: '777bb4', label: 'php', message: '8.3' },
  { name: 'Ruby', slug: 'ruby', category: 'languages', color: 'cc342d', label: 'ruby', message: '3.3' },
  { name: 'Dart', slug: 'dart', category: 'languages', color: '0175c2', label: 'dart', message: '3.0' },
  { name: 'HTML5', slug: 'html5', category: 'languages', color: 'e34f26', label: 'html5', message: 'standard' },
  { name: 'CSS3', slug: 'css3', category: 'languages', color: '1572b6', label: 'css3', message: 'styled' },

  // Frameworks
  { name: 'React', slug: 'react', category: 'frameworks', color: '61dafb', label: 'react', message: '19.0' },
  { name: 'Next.js', slug: 'nextdotjs', category: 'frameworks', color: '000000', label: 'next.js', message: '15.0' },
  { name: 'Vue.js', slug: 'vuedotjs', category: 'frameworks', color: '4fc08d', label: 'vue', message: '3.5+' },
  { name: 'Nuxt', slug: 'nuxtdotjs', category: 'frameworks', color: '00dc82', label: 'nuxt', message: '3.x' },
  { name: 'Angular', slug: 'angular', category: 'frameworks', color: 'dd0031', label: 'angular', message: '19.0' },
  { name: 'Svelte', slug: 'svelte', category: 'frameworks', color: 'ff3e00', label: 'svelte', message: '5.0' },
  { name: 'FastAPI', slug: 'fastapi', category: 'frameworks', color: '009688', label: 'fastapi', message: 'v0.115' },
  { name: 'Django', slug: 'django', category: 'frameworks', color: '092e20', label: 'django', message: '5.1' },
  { name: 'Flask', slug: 'flask', category: 'frameworks', color: '000000', label: 'flask', message: '3.0' },
  { name: 'Express', slug: 'express', category: 'frameworks', color: '000000', label: 'express', message: '4.21' },
  { name: 'NestJS', slug: 'nestjs', category: 'frameworks', color: 'e0234e', label: 'nest.js', message: '10.0' },
  { name: 'Spring Boot', slug: 'springboot', category: 'frameworks', color: '6db33f', label: 'spring', message: '3.3' },
  { name: 'Laravel', slug: 'laravel', category: 'frameworks', color: 'ff2d20', label: 'laravel', message: '11.0' },
  { name: 'Flutter', slug: 'flutter', category: 'frameworks', color: '02569b', label: 'flutter', message: '3.24' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', category: 'frameworks', color: '06b6d4', label: 'tailwind', message: 'v4.0' },
  { name: 'Bootstrap', slug: 'bootstrap', category: 'frameworks', color: '7952b3', label: 'bootstrap', message: '5.3' },

  // Databases & Storage
  { name: 'PostgreSQL', slug: 'postgresql', category: 'databases', color: '4169e1', label: 'postgresql', message: '16.0' },
  { name: 'MySQL', slug: 'mysql', category: 'databases', color: '4479a1', label: 'mysql', message: '8.0' },
  { name: 'SQLite', slug: 'sqlite', category: 'databases', color: '003b57', label: 'sqlite', message: '3.45' },
  { name: 'MongoDB', slug: 'mongodb', category: 'databases', color: '47a248', label: 'mongodb', message: '7.0' },
  { name: 'Redis', slug: 'redis', category: 'databases', color: 'dc382d', label: 'redis', message: 'cache' },
  { name: 'Supabase', slug: 'supabase', category: 'databases', color: '3ecf8e', label: 'supabase', message: 'backend' },
  { name: 'Firebase', slug: 'firebase', category: 'databases', color: 'ffca28', label: 'firebase', message: 'cloud' },
  { name: 'Prisma', slug: 'prisma', category: 'databases', color: '2d3748', label: 'prisma', message: 'orm' },

  // DevOps & Infrastructure
  { name: 'Docker', slug: 'docker', category: 'devops', color: '2496ed', label: 'docker', message: 'ready' },
  { name: 'Kubernetes', slug: 'kubernetes', category: 'devops', color: '326ce5', label: 'k8s', message: 'cluster' },
  { name: 'AWS', slug: 'amazonwebservices', category: 'devops', color: '232f3e', label: 'aws', message: 'cloud' },
  { name: 'Google Cloud', slug: 'googlecloud', category: 'devops', color: '4285f4', label: 'gcp', message: 'services' },
  { name: 'Azure', slug: 'microsoftazure', category: 'devops', color: '0078d4', label: 'azure', message: 'services' },
  { name: 'Cloudflare', slug: 'cloudflare', category: 'devops', color: 'f38020', label: 'cloudflare', message: 'edge/cdn' },
  { name: 'Netlify', slug: 'netlify', category: 'devops', color: '00c7b7', label: 'netlify', message: 'live' },
  { name: 'Terraform', slug: 'terraform', category: 'devops', color: '844fba', label: 'terraform', message: 'iac' },
  { name: 'GitHub Actions', slug: 'githubactions', category: 'devops', color: '2088ff', label: 'ci/cd', message: 'passing' },
  { name: 'Linux', slug: 'linux', category: 'devops', color: 'fcc624', label: 'linux', message: 'supported' },
  { name: 'Ubuntu', slug: 'ubuntu', category: 'devops', color: 'e95420', label: 'ubuntu', message: '24.04' },
  { name: 'Nginx', slug: 'nginx', category: 'devops', color: '009639', label: 'nginx', message: 'proxy' },

  // Ecosystem & Tools
  { name: 'Git', slug: 'git', category: 'tools', color: 'f05032', label: 'git', message: 'vcs' },
  { name: 'GitHub', slug: 'github', category: 'tools', color: '181717', label: 'github', message: 'repo' },
  { name: 'GitLab', slug: 'gitlab', category: 'tools', color: 'fc6d26', label: 'gitlab', message: 'pipeline' },
  { name: 'VS Code', slug: 'visualstudiocode', category: 'tools', color: '007acc', label: 'vscode', message: 'extension' },
  { name: 'Vite', slug: 'vite', category: 'tools', color: '646cff', label: 'vite', message: '6.0' },
  { name: 'Webpack', slug: 'webpack', category: 'tools', color: '8dd6f9', label: 'webpack', message: 'bundle' },
  { name: 'Jest', slug: 'jest', category: 'tools', color: 'c21325', label: 'jest', message: 'tested' },
  { name: 'Pytest', slug: 'pytest', category: 'tools', color: '0a9edc', label: 'pytest', message: 'passed' },
  { name: 'Postman', slug: 'postman', category: 'tools', color: 'ff6c37', label: 'postman', message: 'api' },
  { name: 'GraphQL', slug: 'graphql', category: 'tools', color: 'e10098', label: 'graphql', message: 'schema' },
  { name: 'Node.js', slug: 'nodedotjs', category: 'tools', color: '5fa04e', label: 'node.js', message: '22 LTS' },
  { name: 'Bun', slug: 'bun', category: 'tools', color: 'fbf0df', label: 'bun', message: 'runtime' },
  { name: 'Deno', slug: 'deno', category: 'tools', color: '000000', label: 'deno', message: 'runtime' },
  { name: 'npm', slug: 'npm', category: 'tools', color: 'cb3837', label: 'npm', message: 'package' },

  // Social & Community
  { name: 'Discord', slug: 'discord', category: 'social', color: '5865f2', label: 'discord', message: 'chat' },
  { name: 'X / Twitter', slug: 'x', category: 'social', color: '000000', label: 'follow', message: '@developer' },
  { name: 'YouTube', slug: 'youtube', category: 'social', color: 'ff0000', label: 'youtube', message: 'channel' },
  { name: 'LinkedIn', slug: 'linkedin', category: 'social', color: '0077b5', label: 'linkedin', message: 'network' },
  { name: 'GitHub Sponsors', slug: 'githubsponsors', category: 'social', color: 'ea4aaa', label: 'sponsor', message: 'support' },
  { name: 'Reddit', slug: 'reddit', category: 'social', color: 'ff4500', label: 'reddit', message: 'community' },
  { name: 'Slack', slug: 'slack', category: 'social', color: '4a154b', label: 'slack', message: 'workspace' },
  { name: 'Telegram', slug: 'telegram', category: 'social', color: '26a5e4', label: 'telegram', message: 'channel' }
]

// SkillIcons.dev Official Supported Icons (with local color & short code for offline/fast tile rendering)
export const SKILL_ICONS_LIST = [
  { id: 'react', name: 'React', category: 'frameworks', color: '#61dafb', short: '⚛️' },
  { id: 'nextjs', name: 'Next.js', category: 'frameworks', color: '#ffffff', short: '▲' },
  { id: 'vue', name: 'Vue.js', category: 'frameworks', color: '#42b883', short: 'Vu' },
  { id: 'angular', name: 'Angular', category: 'frameworks', color: '#dd0031', short: 'Ng' },
  { id: 'svelte', name: 'Svelte', category: 'frameworks', color: '#ff3e00', short: 'Sv' },
  { id: 'ts', name: 'TypeScript', category: 'languages', color: '#3178c6', short: 'TS' },
  { id: 'js', name: 'JavaScript', category: 'languages', color: '#f7df1e', short: 'JS' },
  { id: 'py', name: 'Python', category: 'languages', color: '#3776ab', short: 'Py' },
  { id: 'rust', name: 'Rust', category: 'languages', color: '#dea584', short: 'Rs' },
  { id: 'go', name: 'Go', category: 'languages', color: '#00add8', short: 'Go' },
  { id: 'cpp', name: 'C++', category: 'languages', color: '#00599c', short: 'C++' },
  { id: 'cs', name: 'C#', category: 'languages', color: '#239120', short: 'C#' },
  { id: 'java', name: 'Java', category: 'languages', color: '#ed8b00', short: '☕' },
  { id: 'kotlin', name: 'Kotlin', category: 'languages', color: '#7f52ff', short: 'Kt' },
  { id: 'swift', name: 'Swift', category: 'languages', color: '#f05138', short: 'Sw' },
  { id: 'dart', name: 'Dart', category: 'languages', color: '#0175c2', short: 'Da' },
  { id: 'php', name: 'PHP', category: 'languages', color: '#777bb4', short: 'PHP' },
  { id: 'ruby', name: 'Ruby', category: 'languages', color: '#cc342d', short: 'Rb' },
  { id: 'html', name: 'HTML5', category: 'languages', color: '#e34f26', short: 'H5' },
  { id: 'css', name: 'CSS3', category: 'languages', color: '#1572b6', short: 'C3' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frameworks', color: '#06b6d4', short: 'TW' },
  { id: 'bootstrap', name: 'Bootstrap', category: 'frameworks', color: '#7952b3', short: 'Bs' },
  { id: 'sass', name: 'Sass', category: 'frameworks', color: '#cc6699', short: 'Sa' },
  { id: 'fastapi', name: 'FastAPI', category: 'frameworks', color: '#009688', short: 'FA' },
  { id: 'django', name: 'Django', category: 'frameworks', color: '#092e20', short: 'Dj' },
  { id: 'flask', name: 'Flask', category: 'frameworks', color: '#ffffff', short: 'Fl' },
  { id: 'nodejs', name: 'Node.js', category: 'frameworks', color: '#5fa04e', short: 'Node' },
  { id: 'express', name: 'Express', category: 'frameworks', color: '#ffffff', short: 'Ex' },
  { id: 'flutter', name: 'Flutter', category: 'frameworks', color: '#02569b', short: 'Fl' },
  { id: 'postgres', name: 'PostgreSQL', category: 'databases', color: '#4169e1', short: 'PG' },
  { id: 'mongodb', name: 'MongoDB', category: 'databases', color: '#47a248', short: 'MG' },
  { id: 'mysql', name: 'MySQL', category: 'databases', color: '#4479a1', short: 'SQL' },
  { id: 'sqlite', name: 'SQLite', category: 'databases', color: '#003b57', short: 'LT' },
  { id: 'redis', name: 'Redis', category: 'databases', color: '#dc382d', short: 'Rd' },
  { id: 'supabase', name: 'Supabase', category: 'databases', color: '#3ecf8e', short: 'SB' },
  { id: 'firebase', name: 'Firebase', category: 'databases', color: '#ffca28', short: 'FB' },
  { id: 'graphql', name: 'GraphQL', category: 'databases', color: '#e10098', short: 'GQL' },
  { id: 'docker', name: 'Docker', category: 'devops', color: '#2496ed', short: '🐳' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', color: '#326ce5', short: 'K8s' },
  { id: 'aws', name: 'AWS', category: 'devops', color: '#ff9900', short: 'AWS' },
  { id: 'gcp', name: 'Google Cloud', category: 'devops', color: '#4285f4', short: 'GCP' },
  { id: 'azure', name: 'Azure', category: 'devops', color: '#0078d4', short: 'Az' },
  { id: 'cloudflare', name: 'Cloudflare', category: 'devops', color: '#f38020', short: 'CF' },
  { id: 'netlify', name: 'Netlify', category: 'devops', color: '#00c7b7', short: 'NL' },
  { id: 'linux', name: 'Linux', category: 'devops', color: '#fcc624', short: '🐧' },
  { id: 'ubuntu', name: 'Ubuntu', category: 'devops', color: '#e95420', short: 'Ub' },
  { id: 'git', name: 'Git', category: 'tools', color: '#f05032', short: 'Git' },
  { id: 'github', name: 'GitHub', category: 'tools', color: '#ffffff', short: '🐙' },
  { id: 'gitlab', name: 'GitLab', category: 'tools', color: '#fc6d26', short: 'GL' },
  { id: 'vscode', name: 'VS Code', category: 'tools', color: '#007acc', short: 'VSC' },
  { id: 'vite', name: 'Vite', category: 'tools', color: '#646cff', short: '⚡' },
  { id: 'webpack', name: 'Webpack', category: 'tools', color: '#8dd6f9', short: 'WP' },
  { id: 'npm', name: 'npm', category: 'tools', color: '#cb3837', short: 'npm' },
  { id: 'pnpm', name: 'pnpm', category: 'tools', color: '#f69220', short: 'pnpm' },
  { id: 'bun', name: 'Bun', category: 'tools', color: '#fbf0df', short: '🍞' },
  { id: 'deno', name: 'Deno', category: 'tools', color: '#ffffff', short: 'Dn' },
  { id: 'postman', name: 'Postman', category: 'tools', color: '#ff6c37', short: 'PM' },
  { id: 'figma', name: 'Figma', category: 'tools', color: '#f24e1e', short: 'Fig' },
  { id: 'redux', name: 'Redux', category: 'frameworks', color: '#764abc', short: 'Rdx' }
]

// 12 Dynamic GitHub Metrics
export const GITHUB_METRICS = [
  { id: 'stars', title: 'GitHub Stars', path: 'stars', icon: 'star', color: 'f59e0b', defaultActive: true, linkSuffix: '/stargazers' },
  { id: 'forks', title: 'GitHub Forks', path: 'forks', icon: 'call_split', color: '3b82f6', defaultActive: true, linkSuffix: '/network/members' },
  { id: 'issues', title: 'Open Issues', path: 'issues', icon: 'bug_report', color: '10b981', defaultActive: true, linkSuffix: '/issues' },
  { id: 'issues-closed', title: 'Closed Issues', path: 'issues-closed', icon: 'task_alt', color: '8b5cf6', defaultActive: false, linkSuffix: '/issues?q=is%3Aissue+is%3Aclosed' },
  { id: 'prs', title: 'Pull Requests', path: 'issues-pr', icon: 'merge', color: '06b6d4', defaultActive: true, linkSuffix: '/pulls' },
  { id: 'release', title: 'Latest Release', path: 'v/release', icon: 'sell', color: '6366f1', defaultActive: true, linkSuffix: '/releases' },
  { id: 'license', title: 'License', path: 'license', icon: 'verified', color: '10b981', defaultActive: true, linkSuffix: '/blob/main/LICENSE' },
  { id: 'repo-size', title: 'Repo Size', path: 'repo-size', icon: 'folder_zip', color: '64748b', defaultActive: false, linkSuffix: '' },
  { id: 'languages-top', title: 'Top Language', path: 'languages/top', icon: 'code', color: 'f97316', defaultActive: false, linkSuffix: '' },
  { id: 'last-commit', title: 'Last Commit', path: 'last-commit', icon: 'schedule', color: 'a855f7', defaultActive: false, linkSuffix: '/commits' },
  { id: 'contributors', title: 'Contributors', path: 'contributors', icon: 'group', color: '14b8a6', defaultActive: false, linkSuffix: '/graphs/contributors' },
  { id: 'actions', title: 'CI Build Status', path: 'actions/workflow/status', workflow: 'ci.yml', icon: 'rocket_launch', color: '22c55e', defaultActive: false, linkSuffix: '/actions' }
]

// 10 Native High-Fidelity Vector SVG Card Architectures (100% Free, Local Generation)
export const GITHUB_LANG_COLORS = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Golang: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Java: '#b07219',
  Kotlin: '#A97BFF',
  Swift: '#F05138',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  SCSS: '#c6538c',
  Markdown: '#083fa1',
  Solidity: '#AA6746'
}


// 16 Curated Tech Packs
export const CURATED_PACKS = [
  {
    id: 'pack-fullstack',
    title: 'Modern Full-Stack Web',
    desc: 'React 19, Next.js 15, TypeScript 5, Tailwind CSS, Node.js 22, Docker',
    category: 'Web Development',
    badges: [
      { label: 'React', message: '19.0', color: '61dafb', logo: 'react', style: 'for-the-badge' },
      { label: 'Next.js', message: '15.0', color: '000000', logo: 'nextdotjs', style: 'for-the-badge' },
      { label: 'TypeScript', message: '5.8+', color: '3178c6', logo: 'typescript', style: 'for-the-badge' },
      { label: 'Tailwind', message: 'v4.0', color: '06b6d4', logo: 'tailwindcss', style: 'for-the-badge' },
      { label: 'Node.js', message: '22_LTS', color: '5fa04e', logo: 'nodedotjs', style: 'for-the-badge' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-python-ai',
    title: 'Python AI & Data Stack',
    desc: 'Python 3.12, FastAPI, PyTorch, Docker, Poetry, Pytest',
    category: 'AI & Data Science',
    badges: [
      { label: 'Python', message: '3.12+', color: '3776ab', logo: 'python', style: 'for-the-badge' },
      { label: 'FastAPI', message: 'v0.115', color: '009688', logo: 'fastapi', style: 'for-the-badge' },
      { label: 'PyTorch', message: '2.5+', color: 'ee4c2c', logo: 'pytorch', style: 'for-the-badge' },
      { label: 'Docker', message: 'ready', color: '2496ed', logo: 'docker', style: 'for-the-badge' },
      { label: 'Poetry', message: 'managed', color: '60a5fa', logo: 'poetry', style: 'for-the-badge' },
      { label: 'Tests', message: 'Pytest_Passed', color: '0a9edc', logo: 'pytest', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-devops',
    title: 'Container & DevOps Pipeline',
    desc: 'Kubernetes, Docker Compose, Terraform, Linux, GitHub Actions',
    category: 'DevOps & Infrastructure',
    badges: [
      { label: 'Kubernetes', message: 'Cluster', color: '326ce5', logo: 'kubernetes', style: 'for-the-badge' },
      { label: 'Docker', message: 'Compose', color: '2496ed', logo: 'docker', style: 'for-the-badge' },
      { label: 'Terraform', message: 'IaC', color: '844fba', logo: 'terraform', style: 'for-the-badge' },
      { label: 'CI/CD', message: 'GitHub Actions', color: '2088ff', logo: 'githubactions', style: 'for-the-badge' },
      { label: 'Platform', message: 'Linux', color: 'fcc624', logo: 'linux', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-oss-health',
    title: 'Open Source Project Health',
    desc: 'MIT License, PRs Welcome, Semantic Release, Codecov 98%, GitHub Stars',
    category: 'Open Source Essentials',
    badges: [
      { label: 'License', message: 'MIT', color: '10b981', logo: '', style: 'for-the-badge' },
      { label: 'PRs', message: 'welcome', color: '3b82f6', logo: 'git', style: 'for-the-badge' },
      { label: 'Release', message: 'v1.0.0', color: '6366f1', logo: 'github', style: 'for-the-badge' },
      { label: 'Codecov', message: '98%', color: '06b6d4', logo: 'codecov', style: 'for-the-badge' },
      { label: 'Semantic', message: 'Release', color: 'e11d48', logo: 'semanticrelease', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-mern',
    title: 'MERN Enterprise Stack',
    desc: 'MongoDB, Express.js, React 19, Node.js, Redux, Jest',
    category: 'Full-Stack JavaScript',
    badges: [
      { label: 'MongoDB', message: '7.0', color: '47a248', logo: 'mongodb', style: 'for-the-badge' },
      { label: 'Express', message: '4.21', color: '000000', logo: 'express', style: 'for-the-badge' },
      { label: 'React', message: '19.0', color: '61dafb', logo: 'react', style: 'for-the-badge' },
      { label: 'Node.js', message: '22 LTS', color: '5fa04e', logo: 'nodedotjs', style: 'for-the-badge' },
      { label: 'Redux', message: 'Toolkit', color: '764abc', logo: 'redux', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-systems-rust',
    title: 'Systems & High-Performance Rust',
    desc: 'Rust 2024, WebAssembly, Cargo, Linux, C++20',
    category: 'Systems Programming',
    badges: [
      { label: 'Rust', message: '2024', color: 'dea584', logo: 'rust', style: 'for-the-badge' },
      { label: 'WebAssembly', message: 'Wasm', color: '654ff0', logo: 'webassembly', style: 'for-the-badge' },
      { label: 'Build', message: 'Cargo', color: 'ea580c', logo: 'rust', style: 'for-the-badge' },
      { label: 'C++', message: 'C++20', color: '00599c', logo: 'cplusplus', style: 'for-the-badge' },
      { label: 'Memory', message: 'Safe', color: '10b981', logo: 'shield', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-mobile',
    title: 'Mobile Cross-Platform',
    desc: 'Flutter, React Native, Swift, Kotlin, Firebase',
    category: 'Mobile Applications',
    badges: [
      { label: 'Flutter', message: '3.24', color: '02569b', logo: 'flutter', style: 'for-the-badge' },
      { label: 'React Native', message: '0.76', color: '61dafb', logo: 'react', style: 'for-the-badge' },
      { label: 'iOS', message: 'Swift 6', color: 'f05138', logo: 'swift', style: 'for-the-badge' },
      { label: 'Android', message: 'Kotlin 2.0', color: '7f52ff', logo: 'kotlin', style: 'for-the-badge' },
      { label: 'Backend', message: 'Firebase', color: 'ffca28', logo: 'firebase', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-community',
    title: 'Sponsor & Community Engagement',
    desc: 'Discord Chat, X / Twitter, YouTube Channel, GitHub Sponsors',
    category: 'Social & Community',
    badges: [
      { label: 'Discord', message: 'Join Chat', color: '5865f2', logo: 'discord', style: 'for-the-badge' },
      { label: 'Twitter', message: 'Follow', color: '000000', logo: 'x', style: 'for-the-badge' },
      { label: 'YouTube', message: 'Subscribe', color: 'ff0000', logo: 'youtube', style: 'for-the-badge' },
      { label: 'Sponsor', message: 'GitHub', color: 'ea4aaa', logo: 'githubsponsors', style: 'for-the-badge' },
      { label: 'LinkedIn', message: 'Connect', color: '0077b5', logo: 'linkedin', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-ai-llm',
    title: 'Generative AI & LLM Stack',
    desc: 'OpenAI GPT-4o, LangChain, Hugging Face, Ollama, Python 3.12, Pinecone Vector DB',
    category: 'GenAI & Machine Learning',
    badges: [
      { label: 'OpenAI', message: 'GPT-4o', color: '412991', logo: 'openai', style: 'for-the-badge' },
      { label: 'LangChain', message: '0.3', color: '1c3c3c', logo: 'langchain', style: 'for-the-badge' },
      { label: 'Hugging Face', message: 'Transformers', color: 'ffd21e', logo: 'huggingface', style: 'for-the-badge' },
      { label: 'Ollama', message: 'Local LLMs', color: 'ffffff', logo: 'ollama', style: 'for-the-badge' },
      { label: 'Vector_DB', message: 'Pinecone', color: '000000', logo: 'pinecone', style: 'for-the-badge' },
      { label: 'Python', message: '3.12+', color: '3776ab', logo: 'python', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-vue-nuxt',
    title: 'Vue 3 & Nuxt 3 Ecosystem',
    desc: 'Vue.js 3.5, Nuxt 3.13, TypeScript 5, Vite, Pinia, Tailwind CSS',
    category: 'Frontend Frameworks',
    badges: [
      { label: 'Vue.js', message: 'v3.5', color: '4fc08d', logo: 'vuedotjs', style: 'for-the-badge' },
      { label: 'Nuxt', message: 'v3.13', color: '00dc82', logo: 'nuxt', style: 'for-the-badge' },
      { label: 'TypeScript', message: '5.8+', color: '3178c6', logo: 'typescript', style: 'for-the-badge' },
      { label: 'Vite', message: 'v6.0', color: '646cff', logo: 'vite', style: 'for-the-badge' },
      { label: 'Pinia', message: 'Store', color: 'ffd859', logo: 'vuedotjs', style: 'for-the-badge' },
      { label: 'Tailwind', message: 'CSS', color: '06b6d4', logo: 'tailwindcss', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-go-microservices',
    title: 'Go Microservices Architecture',
    desc: 'Go 1.23, gRPC, Docker, PostgreSQL 16, Redis 7, Prometheus',
    category: 'Backend & Distributed Systems',
    badges: [
      { label: 'Golang', message: '1.23', color: '00add8', logo: 'go', style: 'for-the-badge' },
      { label: 'Protocol', message: 'gRPC', color: '244c5a', logo: 'grpc', style: 'for-the-badge' },
      { label: 'PostgreSQL', message: '16', color: '4169e1', logo: 'postgresql', style: 'for-the-badge' },
      { label: 'Cache', message: 'Redis 7', color: 'dc382d', logo: 'redis', style: 'for-the-badge' },
      { label: 'Metrics', message: 'Prometheus', color: 'e6522c', logo: 'prometheus', style: 'for-the-badge' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-svelte',
    title: 'Svelte 5 & SvelteKit',
    desc: 'Svelte 5 Runes, SvelteKit 2, TypeScript, Tailwind, Vitest, Netlify',
    category: 'Modern Web',
    badges: [
      { label: 'Svelte', message: 'v5.0 Runes', color: 'ff3e00', logo: 'svelte', style: 'for-the-badge' },
      { label: 'SvelteKit', message: 'v2.0', color: 'ff3e00', logo: 'svelte', style: 'for-the-badge' },
      { label: 'TypeScript', message: 'Strict', color: '3178c6', logo: 'typescript', style: 'for-the-badge' },
      { label: 'Tailwind', message: 'v4.0', color: '06b6d4', logo: 'tailwindcss', style: 'for-the-badge' },
      { label: 'Vitest', message: 'Passing', color: '729b1b', logo: 'vitest', style: 'for-the-badge' },
      { label: 'Deploy', message: 'Netlify', color: '00c7b7', logo: 'netlify', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-data-engineering',
    title: 'Data Engineering & Streaming Pipeline',
    desc: 'Apache Spark, Apache Kafka, Airflow, Snowflake, Python, dbt',
    category: 'Data Engineering & Big Data',
    badges: [
      { label: 'Apache Spark', message: 'Analytics', color: 'e25a1c', logo: 'apachespark', style: 'for-the-badge' },
      { label: 'Apache Kafka', message: 'Streaming', color: '231f20', logo: 'apachekafka', style: 'for-the-badge' },
      { label: 'Airflow', message: 'Orchestration', color: '017cee', logo: 'apacheairflow', style: 'for-the-badge' },
      { label: 'Snowflake', message: 'Warehouse', color: '29b5e8', logo: 'snowflake', style: 'for-the-badge' },
      { label: 'Transforms', message: 'dbt', color: 'ff694b', logo: 'dbt', style: 'for-the-badge' },
      { label: 'Python', message: '3.12', color: '3776ab', logo: 'python', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-cybersecurity',
    title: 'Security, SAST & DevSecOps',
    desc: 'OWASP Verified, SonarQube A, Snyk Zero Vulns, Dependabot, Trivy, GPG Signed',
    category: 'Cybersecurity & Compliance',
    badges: [
      { label: 'Security', message: 'OWASP Verified', color: '0284c7', logo: 'security', style: 'for-the-badge' },
      { label: 'SonarQube', message: 'Passed A', color: '4b9fd5', logo: 'sonarqube', style: 'for-the-badge' },
      { label: 'Snyk', message: 'Zero Vulns', color: '4c1e95', logo: 'snyk', style: 'for-the-badge' },
      { label: 'Dependabot', message: 'Active', color: '02569b', logo: 'dependabot', style: 'for-the-badge' },
      { label: 'Container Scan', message: 'Trivy', color: '1976d2', logo: 'shield', style: 'for-the-badge' },
      { label: 'Commits', message: 'GPG Signed', color: '10b981', logo: 'git', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-game-dev',
    title: 'Game Development & Graphics 3D',
    desc: 'Unreal Engine 5.4, Unity 6, C#, C++, OpenGL, Blender 4',
    category: 'Game Engine & Graphics',
    badges: [
      { label: 'Unreal Engine', message: '5.4', color: '0e1128', logo: 'unrealengine', style: 'for-the-badge' },
      { label: 'Unity', message: '6.0', color: '000000', logo: 'unity', style: 'for-the-badge' },
      { label: 'Language', message: 'C#', color: '239120', logo: 'csharp', style: 'for-the-badge' },
      { label: 'Native', message: 'C++', color: '00599c', logo: 'cplusplus', style: 'for-the-badge' },
      { label: '3D Assets', message: 'Blender 4', color: 'f5792a', logo: 'blender', style: 'for-the-badge' },
      { label: 'Graphics', message: 'OpenGL', color: '5586a4', logo: 'opengl', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-desktop-electron',
    title: 'Cross-Platform Desktop Apps',
    desc: 'Electron 32, Tauri 2, Rust, React 19, Vite, Node.js',
    category: 'Desktop Engineering',
    badges: [
      { label: 'Electron', message: 'v32', color: '47848f', logo: 'electron', style: 'for-the-badge' },
      { label: 'Tauri', message: 'v2.0', color: '24c8db', logo: 'tauri', style: 'for-the-badge' },
      { label: 'Rust', message: 'Core', color: 'dea584', logo: 'rust', style: 'for-the-badge' },
      { label: 'Frontend', message: 'React 19', color: '61dafb', logo: 'react', style: 'for-the-badge' },
      { label: 'Bundler', message: 'Vite', color: '646cff', logo: 'vite', style: 'for-the-badge' },
      { label: 'OS', message: 'Win / macOS / Linux', color: '374151', logo: 'windows', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-web3-blockchain',
    title: 'Web3 & Smart Contracts',
    desc: 'Solidity 0.8.28, Ethereum EVM, Hardhat, Ethers.js, IPFS, Polygon',
    category: 'Blockchain & DeFi',
    badges: [
      { label: 'Solidity', message: '0.8.28', color: '363636', logo: 'solidity', style: 'for-the-badge' },
      { label: 'Ethereum', message: 'EVM', color: '3c3c3d', logo: 'ethereum', style: 'for-the-badge' },
      { label: 'Toolchain', message: 'Hardhat', color: 'fff100', logo: 'hardhat', style: 'for-the-badge' },
      { label: 'Network', message: 'Polygon', color: '8247e5', logo: 'polygon', style: 'for-the-badge' },
      { label: 'Storage', message: 'IPFS', color: '65c2cb', logo: 'ipfs', style: 'for-the-badge' },
      { label: 'Web3', message: 'Ethers.js', color: '2535a0', logo: 'javascript', style: 'for-the-badge' }
    ]
  },
  {
    id: 'pack-enterprise-java',
    title: 'Enterprise Java & Spring Boot',
    desc: 'Java 21 LTS, Spring Boot 3.3, Hibernate, PostgreSQL, Docker, Gradle',
    category: 'Enterprise Backend',
    badges: [
      { label: 'Java', message: '21 LTS', color: 'ed8b00', logo: 'openjdk', style: 'for-the-badge' },
      { label: 'Spring Boot', message: '3.3', color: '6db33f', logo: 'springboot', style: 'for-the-badge' },
      { label: 'ORM', message: 'Hibernate', color: '59666c', logo: 'hibernate', style: 'for-the-badge' },
      { label: 'Database', message: 'PostgreSQL', color: '4169e1', logo: 'postgresql', style: 'for-the-badge' },
      { label: 'Build', message: 'Gradle', color: '02303a', logo: 'gradle', style: 'for-the-badge' },
      { label: 'Deploy', message: 'Docker', color: '2496ed', logo: 'docker', style: 'for-the-badge' }
    ]
  }
]
