/**
 * README Studio - Badge & Metric Studio Datasets
 * Static configuration presets, catalog taxonomies, swatches, and supported icons.
 */

// Studio Workflow Modes
export const STUDIO_MODES = [
  { id: 'single', label: 'Single', icon: 'shield' },
  { id: 'rack', label: 'Rack', icon: 'layers' },
  { id: 'skillicons', label: 'SkillIcons', icon: 'grid_view' },
  { id: 'github', label: 'Metrics', icon: 'monitoring' },
  { id: 'packs', label: 'Packs', icon: 'inventory_2' }
]

// Badge Format Architectures
export const BADGE_FORMATS = [
  { id: 'split', title: 'Dual Segment', subtitle: 'Label | Value', icon: 'splitscreen' },
  { id: 'brand-plate', title: 'Brand Plate', subtitle: 'Solid Chip', icon: 'view_agenda' },
  { id: 'icon-only', title: 'Micro Tile', subtitle: 'Logo Only', icon: 'crop_square' },
  { id: 'badgen', title: 'Badgen.net', subtitle: 'Micro SVG', icon: 'bolt' }
]

// Shields.io Core Badge Geometry Styles
export const BADGE_STYLES = [
  {
    id: 'for-the-badge',
    label: 'For the Badge',
    tag: 'Bold',
    desc: 'Heavy uppercase banner with generous horizontal padding. Industry standard for top-level README hero headers.'
  },
  {
    id: 'flat-square',
    label: 'Flat Square',
    tag: 'Square',
    desc: 'Sharp 90-degree square corners. Crisp, technical, and compact for dense tech stack matrices.'
  },
  {
    id: 'flat',
    label: 'Flat',
    tag: 'Default',
    desc: 'Subtle 3px rounded rectangle corners with clean, balanced typography. Universally recognized.'
  },
  {
    id: 'plastic',
    label: 'Plastic',
    tag: 'Glossy',
    desc: 'Rounded corners with a subtle convex glossy gradient highlight along the upper half.'
  },
  {
    id: 'social',
    label: 'Social',
    tag: 'Bubble',
    desc: 'White arrow bubble callout counter modeled after GitHub native star and follower buttons.'
  }
]

// 14 Curated Dual-Tone Color Themes (with Left Label and Right Message pairings)
export const COLOR_THEMES = [
  { id: 'cyberpunk', name: 'Cyberpunk', labelColor: '180b33', color: 'ec4899', accent: '06b6d4' },
  { id: 'emerald', name: 'Emerald', labelColor: '064e3b', color: '10b981', accent: '34d399' },
  { id: 'indigo', name: 'Indigo', labelColor: '1e1b4b', color: '6366f1', accent: '818cf8' },
  { id: 'obsidian', name: 'Obsidian', labelColor: '090d16', color: '1e293b', accent: '38bdf8' },
  { id: 'amber', name: 'Amber', labelColor: '451a03', color: 'f59e0b', accent: 'fbbf24' },
  { id: 'crimson', name: 'Crimson', labelColor: '4c0519', color: 'ef4444', accent: 'f43f5e' },
  { id: 'glacier', name: 'Glacier', labelColor: '082f49', color: '0ea5e9', accent: '38bdf8' },
  { id: 'dracula', name: 'Dracula', labelColor: '282a36', color: 'bd93f9', accent: 'ff79c6' },
  { id: 'monokai', name: 'Monokai', labelColor: '272822', color: 'a6e22e', accent: 'e6db74' },
  { id: 'github', name: 'GitHub', labelColor: '24292e', color: '0969da', accent: '2ea44f' },
  { id: 'minimal', name: 'Mono', labelColor: '18181b', color: '52525b', accent: 'fafafa' },
  { id: 'sunset', name: 'Sunset', labelColor: '7c2d12', color: 'ea580c', accent: 'fb923c' },
  { id: 'vaporwave', name: 'Vaporwave', labelColor: '3b0764', color: 'c084fc', accent: 'f472b6' },
  { id: 'teal', name: 'Oceanic', labelColor: '042f2e', color: '0d9488', accent: '2dd4bf' }
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
  { id: 'stars', title: 'Stars', path: 'stars', icon: 'star', color: 'f59e0b', defaultActive: true, linkSuffix: '/stargazers' },
  { id: 'forks', title: 'Forks', path: 'forks', icon: 'call_split', color: '3b82f6', defaultActive: true, linkSuffix: '/network/members' },
  { id: 'issues', title: 'Open Issues', path: 'issues', icon: 'bug_report', color: '10b981', defaultActive: true, linkSuffix: '/issues' },
  { id: 'issues-closed', title: 'Closed Issues', path: 'issues-closed', icon: 'task_alt', color: '8b5cf6', defaultActive: false, linkSuffix: '/issues?q=is%3Aissue+is%3Aclosed' },
  { id: 'prs', title: 'Pull Requests', path: 'issues-pr', icon: 'merge', color: '06b6d4', defaultActive: true, linkSuffix: '/pulls' },
  { id: 'release', title: 'Release', path: 'v/release', icon: 'sell', color: '6366f1', defaultActive: true, linkSuffix: '/releases' },
  { id: 'license', title: 'License', path: 'license', icon: 'verified', color: '10b981', defaultActive: true, linkSuffix: '/blob/main/LICENSE' },
  { id: 'repo-size', title: 'Repo Size', path: 'repo-size', icon: 'folder_zip', color: '64748b', defaultActive: false, linkSuffix: '' },
  { id: 'languages-top', title: 'Top Language', path: 'languages/top', icon: 'code', color: 'f97316', defaultActive: false, linkSuffix: '' },
  { id: 'last-commit', title: 'Last Commit', path: 'last-commit', icon: 'schedule', color: 'a855f7', defaultActive: false, linkSuffix: '/commits' },
  { id: 'contributors', title: 'Contributors', path: 'contributors', icon: 'group', color: '14b8a6', defaultActive: false, linkSuffix: '/graphs/contributors' },
  { id: 'actions', title: 'CI Build', path: 'actions/workflow/status', workflow: 'ci.yml', icon: 'rocket_launch', color: '22c55e', defaultActive: false, linkSuffix: '/actions' }
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


// 45+ Curated Tech Packs organized into clean, production-grade categories
export const CURATED_PACKS = [
  // --- Category: Web & Full-Stack ---
  {
    id: 'pack-fullstack-next',
    title: 'Modern Next.js 15 & React 19',
    desc: 'React 19, Next.js 15, TypeScript 5, Tailwind CSS v4, Node.js 22, Docker',
    category: 'Web & Full-Stack',
    badges: [
      { label: 'React', message: '19.0', color: '61dafb', logo: 'react' },
      { label: 'Next.js', message: '15.0', color: '000000', logo: 'nextdotjs' },
      { label: 'TypeScript', message: '5.8+', color: '3178c6', logo: 'typescript' },
      { label: 'Tailwind', message: 'v4.0', color: '06b6d4', logo: 'tailwindcss' },
      { label: 'Node.js', message: '22_LTS', color: '5fa04e', logo: 'nodedotjs' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },
  {
    id: 'pack-t3-stack',
    title: 'T3 Stack Production',
    desc: 'Next.js, TypeScript, tRPC, Tailwind CSS, Prisma ORM, PostgreSQL',
    category: 'Web & Full-Stack',
    badges: [
      { label: 'Next.js', message: '15.0', color: '000000', logo: 'nextdotjs' },
      { label: 'tRPC', message: 'v11', color: '2596be', logo: 'trpc' },
      { label: 'TypeScript', message: '5.8', color: '3178c6', logo: 'typescript' },
      { label: 'Prisma', message: 'ORM', color: '2d3748', logo: 'prisma' },
      { label: 'PostgreSQL', message: '16', color: '4169e1', logo: 'postgresql' },
      { label: 'Tailwind', message: 'CSS', color: '06b6d4', logo: 'tailwindcss' }
    ]
  },
  {
    id: 'pack-vite-remix',
    title: 'Vite 6 & Remix SPA',
    desc: 'React 19, Remix / React Router 7, Vite 6, Tailwind CSS, Vitest, Netlify',
    category: 'Web & Full-Stack',
    badges: [
      { label: 'Vite', message: '6.0', color: '646cff', logo: 'vite' },
      { label: 'React', message: '19.0', color: '61dafb', logo: 'react' },
      { label: 'Router', message: 'Remix_v7', color: '000000', logo: 'remix' },
      { label: 'Tailwind', message: 'v4.0', color: '06b6d4', logo: 'tailwindcss' },
      { label: 'Tests', message: 'Vitest', color: '729b1b', logo: 'vitest' },
      { label: 'Deploy', message: 'Netlify', color: '00c7b7', logo: 'netlify' }
    ]
  },
  {
    id: 'pack-astro-content',
    title: 'Astro 5 Content & SSG',
    desc: 'Astro 5, MDX Markdown, Tailwind CSS, TypeScript, Vercel Edge',
    category: 'Web & Full-Stack',
    badges: [
      { label: 'Astro', message: '5.0', color: 'ff5d01', logo: 'astro' },
      { label: 'Format', message: 'MDX', color: '1b1f24', logo: 'markdown' },
      { label: 'TypeScript', message: 'Strict', color: '3178c6', logo: 'typescript' },
      { label: 'Tailwind', message: 'v4.0', color: '06b6d4', logo: 'tailwindcss' },
      { label: 'Deploy', message: 'Vercel', color: '000000', logo: 'vercel' }
    ]
  },
  {
    id: 'pack-mern-modern',
    title: 'MERN Enterprise Stack',
    desc: 'MongoDB 7, Express.js, React 19, Node.js 22 LTS, Redux Toolkit, Docker',
    category: 'Web & Full-Stack',
    badges: [
      { label: 'MongoDB', message: '7.0', color: '47a248', logo: 'mongodb' },
      { label: 'Express', message: '4.21', color: '000000', logo: 'express' },
      { label: 'React', message: '19.0', color: '61dafb', logo: 'react' },
      { label: 'Node.js', message: '22_LTS', color: '5fa04e', logo: 'nodedotjs' },
      { label: 'Redux', message: 'Toolkit', color: '764abc', logo: 'redux' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },

  // --- Category: Frontend Frameworks ---
  {
    id: 'pack-vue-nuxt',
    title: 'Vue 3 & Nuxt 3 Ecosystem',
    desc: 'Vue.js 3.5, Nuxt 3.14, TypeScript 5, Vite, Pinia, Tailwind CSS',
    category: 'Frontend Frameworks',
    badges: [
      { label: 'Vue.js', message: 'v3.5', color: '4fc08d', logo: 'vuedotjs' },
      { label: 'Nuxt', message: 'v3.14', color: '00dc82', logo: 'nuxt' },
      { label: 'TypeScript', message: '5.8+', color: '3178c6', logo: 'typescript' },
      { label: 'Vite', message: 'v6.0', color: '646cff', logo: 'vite' },
      { label: 'Pinia', message: 'Store', color: 'ffd859', logo: 'vuedotjs' },
      { label: 'Tailwind', message: 'CSS', color: '06b6d4', logo: 'tailwindcss' }
    ]
  },
  {
    id: 'pack-svelte-runes',
    title: 'Svelte 5 Runes & SvelteKit',
    desc: 'Svelte 5 Runes, SvelteKit 2, TypeScript, Tailwind, Vitest, Netlify',
    category: 'Frontend Frameworks',
    badges: [
      { label: 'Svelte', message: 'v5.0_Runes', color: 'ff3e00', logo: 'svelte' },
      { label: 'SvelteKit', message: 'v2.0', color: 'ff3e00', logo: 'svelte' },
      { label: 'TypeScript', message: 'Strict', color: '3178c6', logo: 'typescript' },
      { label: 'Tailwind', message: 'v4.0', color: '06b6d4', logo: 'tailwindcss' },
      { label: 'Vitest', message: 'Passing', color: '729b1b', logo: 'vitest' }
    ]
  },
  {
    id: 'pack-angular-enterprise',
    title: 'Angular 18 Enterprise',
    desc: 'Angular 18, RxJS 7, TypeScript, Signals, NgRx Store, Karma',
    category: 'Frontend Frameworks',
    badges: [
      { label: 'Angular', message: '18.2', color: 'dd0031', logo: 'angular' },
      { label: 'TypeScript', message: '5.8', color: '3178c6', logo: 'typescript' },
      { label: 'RxJS', message: 'Reactive', color: 'b7178c', logo: 'reactivex' },
      { label: 'NgRx', message: 'State', color: 'ba2bd2', logo: 'ngrx' },
      { label: 'Signals', message: 'Native', color: '00b4d8', logo: 'angular' }
    ]
  },
  {
    id: 'pack-solidjs-reactive',
    title: 'SolidJS Ultra-Reactive',
    desc: 'SolidStart, SolidJS, TypeScript, Vite 6, Tailwind CSS',
    category: 'Frontend Frameworks',
    badges: [
      { label: 'SolidJS', message: '1.9', color: '2c4f7c', logo: 'solid' },
      { label: 'Meta', message: 'SolidStart', color: '4488aa', logo: 'solid' },
      { label: 'TypeScript', message: '5.8', color: '3178c6', logo: 'typescript' },
      { label: 'Vite', message: '6.0', color: '646cff', logo: 'vite' },
      { label: 'Tailwind', message: 'CSS', color: '06b6d4', logo: 'tailwindcss' }
    ]
  },

  // --- Category: Backend & Microservices ---
  {
    id: 'pack-go-microservices',
    title: 'Go High-Throughput Microservices',
    desc: 'Go 1.23, gRPC, PostgreSQL 16, Redis 7, Prometheus, Docker',
    category: 'Backend & Microservices',
    badges: [
      { label: 'Golang', message: '1.23', color: '00add8', logo: 'go' },
      { label: 'Protocol', message: 'gRPC', color: '244c5a', logo: 'grpc' },
      { label: 'PostgreSQL', message: '16', color: '4169e1', logo: 'postgresql' },
      { label: 'Cache', message: 'Redis_7', color: 'dc382d', logo: 'redis' },
      { label: 'Metrics', message: 'Prometheus', color: 'e6522c', logo: 'prometheus' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },
  {
    id: 'pack-rust-axum',
    title: 'Rust Axum & Tokio Async',
    desc: 'Rust 2024, Axum Web, Tokio Runtime, SQLx, Redis, Docker',
    category: 'Backend & Microservices',
    badges: [
      { label: 'Rust', message: '2024_Edition', color: 'dea584', logo: 'rust' },
      { label: 'Web', message: 'Axum_0.7', color: '000000', logo: 'rust' },
      { label: 'Async', message: 'Tokio', color: '38a169', logo: 'rust' },
      { label: 'Database', message: 'SQLx_Postgres', color: '4169e1', logo: 'postgresql' },
      { label: 'Cache', message: 'Redis', color: 'dc382d', logo: 'redis' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },
  {
    id: 'pack-fastapi-backend',
    title: 'Python FastAPI Modern API',
    desc: 'Python 3.12, FastAPI, Pydantic v2, PostgreSQL, Celery, Redis',
    category: 'Backend & Microservices',
    badges: [
      { label: 'Python', message: '3.12+', color: '3776ab', logo: 'python' },
      { label: 'FastAPI', message: 'v0.115', color: '009688', logo: 'fastapi' },
      { label: 'Schema', message: 'Pydantic_v2', color: 'e92063', logo: 'pydantic' },
      { label: 'PostgreSQL', message: '16', color: '4169e1', logo: 'postgresql' },
      { label: 'Queue', message: 'Celery', color: '37814a', logo: 'celery' },
      { label: 'Cache', message: 'Redis', color: 'dc382d', logo: 'redis' }
    ]
  },
  {
    id: 'pack-node-fastify',
    title: 'Node.js 22 & Fastify Microservices',
    desc: 'Node.js 22 LTS, Fastify, TypeScript, Prisma ORM, Redis, Docker',
    category: 'Backend & Microservices',
    badges: [
      { label: 'Node.js', message: '22_LTS', color: '5fa04e', logo: 'nodedotjs' },
      { label: 'Fastify', message: 'v5.0', color: '000000', logo: 'fastify' },
      { label: 'TypeScript', message: '5.8', color: '3178c6', logo: 'typescript' },
      { label: 'Prisma', message: 'ORM', color: '2d3748', logo: 'prisma' },
      { label: 'Redis', message: 'Cache', color: 'dc382d', logo: 'redis' }
    ]
  },
  {
    id: 'pack-enterprise-java',
    title: 'Enterprise Java & Spring Boot 3.3',
    desc: 'Java 21 LTS, Spring Boot 3.3, Hibernate, PostgreSQL, Gradle, Docker',
    category: 'Backend & Microservices',
    badges: [
      { label: 'Java', message: '21_LTS', color: 'ed8b00', logo: 'openjdk' },
      { label: 'Spring Boot', message: '3.3', color: '6db33f', logo: 'springboot' },
      { label: 'ORM', message: 'Hibernate', color: '59666c', logo: 'hibernate' },
      { label: 'Database', message: 'PostgreSQL', color: '4169e1', logo: 'postgresql' },
      { label: 'Build', message: 'Gradle', color: '02303a', logo: 'gradle' },
      { label: 'Deploy', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },
  {
    id: 'pack-dotnet-core',
    title: 'ASP.NET Core 8 Web API',
    desc: 'C# 12, .NET 8 LTS, Entity Framework Core, SQL Server, Redis, Docker',
    category: 'Backend & Microservices',
    badges: [
      { label: '.NET', message: '8.0_LTS', color: '512bd4', logo: 'dotnet' },
      { label: 'C#', message: '12.0', color: '239120', logo: 'csharp' },
      { label: 'ORM', message: 'EF_Core', color: '68217a', logo: 'dotnet' },
      { label: 'Database', message: 'SQL_Server', color: 'cc292b', logo: 'microsoftsqlserver' },
      { label: 'Deploy', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },

  // --- Category: AI & Data Science ---
  {
    id: 'pack-pytorch-ai',
    title: 'Deep Learning & PyTorch 2.5',
    desc: 'Python 3.12, PyTorch 2.5, CUDA 12.4, Weights & Biases, Hugging Face, Poetry',
    category: 'AI & Data Science',
    badges: [
      { label: 'Python', message: '3.12+', color: '3776ab', logo: 'python' },
      { label: 'PyTorch', message: '2.5+', color: 'ee4c2c', logo: 'pytorch' },
      { label: 'CUDA', message: '12.4', color: '76b900', logo: 'nvidia' },
      { label: 'Hugging Face', message: 'Models', color: 'ffd21e', logo: 'huggingface' },
      { label: 'Tracking', message: 'W&B', color: 'ffbe00', logo: 'weightsandbiases' },
      { label: 'Poetry', message: 'Managed', color: '60a5fa', logo: 'poetry' }
    ]
  },
  {
    id: 'pack-genai-rag',
    title: 'Generative AI & LLM Agents',
    desc: 'OpenAI GPT-4o, LangChain, Hugging Face, Pinecone Vector DB, FastAPI, Python',
    category: 'AI & Data Science',
    badges: [
      { label: 'OpenAI', message: 'GPT-4o', color: '412991', logo: 'openai' },
      { label: 'LangChain', message: '0.3', color: '1c3c3c', logo: 'langchain' },
      { label: 'Vector_DB', message: 'Pinecone', color: '000000', logo: 'pinecone' },
      { label: 'API', message: 'FastAPI', color: '009688', logo: 'fastapi' },
      { label: 'Python', message: '3.12', color: '3776ab', logo: 'python' }
    ]
  },
  {
    id: 'pack-local-llm',
    title: 'Local LLM & Edge Inference',
    desc: 'Ollama, vLLM, Hugging Face Transformers, Python, FastAPI, Docker',
    category: 'AI & Data Science',
    badges: [
      { label: 'Ollama', message: 'Local_LLMs', color: 'ffffff', logo: 'ollama' },
      { label: 'Inference', message: 'vLLM', color: '6366f1', logo: 'python' },
      { label: 'Transformers', message: 'HuggingFace', color: 'ffd21e', logo: 'huggingface' },
      { label: 'API', message: 'FastAPI', color: '009688', logo: 'fastapi' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },
  {
    id: 'pack-datascience-pandas',
    title: 'Classical Data Science & ML',
    desc: 'Python 3.12, Scikit-learn, Pandas, NumPy, Jupyter Notebooks, Matplotlib',
    category: 'AI & Data Science',
    badges: [
      { label: 'Python', message: '3.12', color: '3776ab', logo: 'python' },
      { label: 'Scikit-Learn', message: 'ML', color: 'f7931e', logo: 'scikitlearn' },
      { label: 'Pandas', message: 'DataFrames', color: '150458', logo: 'pandas' },
      { label: 'NumPy', message: 'Arrays', color: '013243', logo: 'numpy' },
      { label: 'Jupyter', message: 'Notebooks', color: 'f37626', logo: 'jupyter' }
    ]
  },
  {
    id: 'pack-cv-vision',
    title: 'Computer Vision & Media AI',
    desc: 'OpenCV 4, PyTorch, MediaPipe, Python 3.12, CUDA, Albumentations',
    category: 'AI & Data Science',
    badges: [
      { label: 'OpenCV', message: '4.10', color: '5c3ee8', logo: 'opencv' },
      { label: 'PyTorch', message: 'Vision', color: 'ee4c2c', logo: 'pytorch' },
      { label: 'MediaPipe', message: 'Vision', color: '00875a', logo: 'google' },
      { label: 'CUDA', message: 'Accelerated', color: '76b900', logo: 'nvidia' },
      { label: 'Python', message: '3.12', color: '3776ab', logo: 'python' }
    ]
  },

  // --- Category: DevOps & Cloud ---
  {
    id: 'pack-k8s-gitops',
    title: 'Cloud-Native Kubernetes & GitOps',
    desc: 'Kubernetes Cluster, Helm, Docker, ArgoCD, Prometheus, Grafana',
    category: 'DevOps & Cloud',
    badges: [
      { label: 'Kubernetes', message: 'Cluster', color: '326ce5', logo: 'kubernetes' },
      { label: 'Package', message: 'Helm_v3', color: '0f1689', logo: 'helm' },
      { label: 'GitOps', message: 'ArgoCD', color: 'ef7b4d', logo: 'argo' },
      { label: 'Metrics', message: 'Prometheus', color: 'e6522c', logo: 'prometheus' },
      { label: 'Dashboards', message: 'Grafana', color: 'f46800', logo: 'grafana' },
      { label: 'Container', message: 'Docker', color: '2496ed', logo: 'docker' }
    ]
  },
  {
    id: 'pack-aws-serverless',
    title: 'AWS Serverless Architecture',
    desc: 'AWS Lambda, Terraform IaC, API Gateway, DynamoDB, CloudWatch, S3',
    category: 'DevOps & Cloud',
    badges: [
      { label: 'AWS', message: 'Serverless', color: 'ff9900', logo: 'amazonwebservices' },
      { label: 'Compute', message: 'Lambda', color: 'ff9900', logo: 'awslambda' },
      { label: 'IaC', message: 'Terraform', color: '844fba', logo: 'terraform' },
      { label: 'Database', message: 'DynamoDB', color: '4053d6', logo: 'amazondynamodb' },
      { label: 'Storage', message: 'S3', color: '569a31', logo: 'amazons3' }
    ]
  },
  {
    id: 'pack-devops-pipeline',
    title: 'Container & DevOps Pipeline',
    desc: 'Kubernetes, Docker Compose, Terraform, Linux, GitHub Actions CI/CD',
    category: 'DevOps & Cloud',
    badges: [
      { label: 'Kubernetes', message: 'Cluster', color: '326ce5', logo: 'kubernetes' },
      { label: 'Docker', message: 'Compose', color: '2496ed', logo: 'docker' },
      { label: 'Terraform', message: 'IaC', color: '844fba', logo: 'terraform' },
      { label: 'CI/CD', message: 'GitHub_Actions', color: '2088ff', logo: 'githubactions' },
      { label: 'Platform', message: 'Linux', color: 'fcc624', logo: 'linux' }
    ]
  },
  {
    id: 'pack-gcp-cloud',
    title: 'Google Cloud Platform (GCP)',
    desc: 'Google Cloud, Cloud Run, GKE Kubernetes, Terraform, BigQuery',
    category: 'DevOps & Cloud',
    badges: [
      { label: 'Google Cloud', message: 'Platform', color: '4285f4', logo: 'googlecloud' },
      { label: 'Serverless', message: 'Cloud_Run', color: '4285f4', logo: 'googlecloud' },
      { label: 'Cluster', message: 'GKE', color: '326ce5', logo: 'kubernetes' },
      { label: 'Warehouse', message: 'BigQuery', color: '669df6', logo: 'googlecloud' },
      { label: 'IaC', message: 'Terraform', color: '844fba', logo: 'terraform' }
    ]
  },

  // --- Category: Database & Big Data ---
  {
    id: 'pack-bigdata-spark',
    title: 'Data Engineering & Streaming Pipeline',
    desc: 'Apache Spark, Apache Kafka, Airflow, Snowflake, dbt, Python',
    category: 'Database & Big Data',
    badges: [
      { label: 'Apache Spark', message: 'Analytics', color: 'e25a1c', logo: 'apachespark' },
      { label: 'Apache Kafka', message: 'Streaming', color: '231f20', logo: 'apachekafka' },
      { label: 'Airflow', message: 'Orchestration', color: '017cee', logo: 'apacheairflow' },
      { label: 'Snowflake', message: 'Warehouse', color: '29b5e8', logo: 'snowflake' },
      { label: 'Transforms', message: 'dbt', color: 'ff694b', logo: 'dbt' },
      { label: 'Python', message: '3.12', color: '3776ab', logo: 'python' }
    ]
  },
  {
    id: 'pack-modern-db-edge',
    title: 'Modern Edge SQL & Cache',
    desc: 'PostgreSQL 16, Supabase, Redis 7, Prisma ORM, ClickHouse',
    category: 'Database & Big Data',
    badges: [
      { label: 'PostgreSQL', message: '16', color: '4169e1', logo: 'postgresql' },
      { label: 'Backend', message: 'Supabase', color: '3ecf8e', logo: 'supabase' },
      { label: 'In-Memory', message: 'Redis_7', color: 'dc382d', logo: 'redis' },
      { label: 'Analytics', message: 'ClickHouse', color: 'ffcc00', logo: 'clickhouse' },
      { label: 'ORM', message: 'Prisma', color: '2d3748', logo: 'prisma' }
    ]
  },

  // --- Category: Mobile Applications ---
  {
    id: 'pack-flutter-cross',
    title: 'Flutter Cross-Platform Mobile',
    desc: 'Flutter 3.24, Dart 3.5, Firebase, Riverpod, Android, iOS',
    category: 'Mobile Applications',
    badges: [
      { label: 'Flutter', message: '3.24', color: '02569b', logo: 'flutter' },
      { label: 'Dart', message: '3.5', color: '0175c2', logo: 'dart' },
      { label: 'Backend', message: 'Firebase', color: 'ffca28', logo: 'firebase' },
      { label: 'iOS', message: 'Ready', color: '000000', logo: 'apple' },
      { label: 'Android', message: 'Ready', color: '3ddc84', logo: 'android' }
    ]
  },
  {
    id: 'pack-react-native-expo',
    title: 'React Native & Expo SDK 52',
    desc: 'Expo SDK 52, React Native, TypeScript, Tailwind CSS / NativeWind',
    category: 'Mobile Applications',
    badges: [
      { label: 'React Native', message: '0.76', color: '61dafb', logo: 'react' },
      { label: 'Expo', message: 'SDK_52', color: '000020', logo: 'expo' },
      { label: 'TypeScript', message: '5.8', color: '3178c6', logo: 'typescript' },
      { label: 'Styling', message: 'NativeWind', color: '06b6d4', logo: 'tailwindcss' }
    ]
  },
  {
    id: 'pack-ios-swift',
    title: 'Native iOS & Swift 6',
    desc: 'Swift 6, SwiftUI, Combine, CoreData, Xcode, TestFlight',
    category: 'Mobile Applications',
    badges: [
      { label: 'iOS', message: '18+', color: '000000', logo: 'apple' },
      { label: 'Swift', message: '6.0', color: 'f05138', logo: 'swift' },
      { label: 'UI', message: 'SwiftUI', color: '0071e3', logo: 'swift' },
      { label: 'IDE', message: 'Xcode_16', color: '1575f9', logo: 'xcode' }
    ]
  },
  {
    id: 'pack-android-kotlin',
    title: 'Native Android & Kotlin 2.0',
    desc: 'Kotlin 2.0, Jetpack Compose, Coroutines, Android SDK, Gradle',
    category: 'Mobile Applications',
    badges: [
      { label: 'Android', message: 'API_35', color: '3ddc84', logo: 'android' },
      { label: 'Kotlin', message: '2.0', color: '7f52ff', logo: 'kotlin' },
      { label: 'UI', message: 'Jetpack_Compose', color: '4285f4', logo: 'jetpackcompose' },
      { label: 'Build', message: 'Gradle', color: '02303a', logo: 'gradle' }
    ]
  },

  // --- Category: Desktop Engineering ---
  {
    id: 'pack-tauri-rust',
    title: 'Tauri 2.0 & Rust Desktop',
    desc: 'Tauri 2.0, Rust, React 19, TypeScript, Vite, Cross-Platform',
    category: 'Desktop Engineering',
    badges: [
      { label: 'Tauri', message: 'v2.0', color: '24c8db', logo: 'tauri' },
      { label: 'Rust', message: 'Core', color: 'dea584', logo: 'rust' },
      { label: 'Frontend', message: 'React_19', color: '61dafb', logo: 'react' },
      { label: 'Bundler', message: 'Vite', color: '646cff', logo: 'vite' },
      { label: 'OS', message: 'Win_macOS_Linux', color: '374151', logo: 'windows' }
    ]
  },
  {
    id: 'pack-electron-desktop',
    title: 'Electron Enterprise Desktop',
    desc: 'Electron 32, TypeScript, React 19, Vite, Node.js',
    category: 'Desktop Engineering',
    badges: [
      { label: 'Electron', message: 'v32', color: '47848f', logo: 'electron' },
      { label: 'Frontend', message: 'React_19', color: '61dafb', logo: 'react' },
      { label: 'TypeScript', message: '5.8', color: '3178c6', logo: 'typescript' },
      { label: 'Node.js', message: '22_LTS', color: '5fa04e', logo: 'nodedotjs' },
      { label: 'Platforms', message: 'Cross_Platform', color: '0078d7', logo: 'windows' }
    ]
  },

  // --- Category: Systems & Performance ---
  {
    id: 'pack-systems-rust',
    title: 'Systems & High-Performance Rust',
    desc: 'Rust 2024, WebAssembly, Cargo, Linux, C++20 Interop',
    category: 'Systems & Performance',
    badges: [
      { label: 'Rust', message: '2024', color: 'dea584', logo: 'rust' },
      { label: 'WebAssembly', message: 'Wasm', color: '654ff0', logo: 'webassembly' },
      { label: 'Build', message: 'Cargo', color: 'ea580c', logo: 'rust' },
      { label: 'C++', message: 'C++20', color: '00599c', logo: 'cplusplus' },
      { label: 'Memory', message: 'Safe', color: '10b981', logo: 'shield' }
    ]
  },
  {
    id: 'pack-cpp-systems',
    title: 'Modern C++20 Systems & Toolchain',
    desc: 'C++20, CMake, Clang, Linux, LLVM, GDB',
    category: 'Systems & Performance',
    badges: [
      { label: 'Language', message: 'C++20', color: '00599c', logo: 'cplusplus' },
      { label: 'Build', message: 'CMake', color: '064f8c', logo: 'cmake' },
      { label: 'Compiler', message: 'Clang/LLVM', color: '26888c', logo: 'cplusplus' },
      { label: 'Platform', message: 'Linux', color: 'fcc624', logo: 'linux' }
    ]
  },

  // --- Category: Cybersecurity & Quality ---
  {
    id: 'pack-cybersecurity-devsecops',
    title: 'Security, SAST & DevSecOps',
    desc: 'OWASP Verified, SonarQube A, Snyk Zero Vulns, Dependabot, Trivy, GPG Signed',
    category: 'Cybersecurity & Quality',
    badges: [
      { label: 'Security', message: 'OWASP_Verified', color: '0284c7', logo: 'security' },
      { label: 'SonarQube', message: 'Passed_A', color: '4b9fd5', logo: 'sonarqube' },
      { label: 'Snyk', message: 'Zero_Vulns', color: '4c1e95', logo: 'snyk' },
      { label: 'Dependabot', message: 'Active', color: '02569b', logo: 'dependabot' },
      { label: 'Container_Scan', message: 'Trivy', color: '1976d2', logo: 'shield' },
      { label: 'Commits', message: 'GPG_Signed', color: '10b981', logo: 'git' }
    ]
  },
  {
    id: 'pack-qa-testing',
    title: 'Automated Testing & QA Suite',
    desc: 'Playwright E2E, Vitest, Jest, Codecov 98%, GitHub Actions',
    category: 'Cybersecurity & Quality',
    badges: [
      { label: 'E2E_Tests', message: 'Playwright', color: '2ead33', logo: 'playwright' },
      { label: 'Unit_Tests', message: 'Vitest', color: '729b1b', logo: 'vitest' },
      { label: 'Codecov', message: '98%', color: '06b6d4', logo: 'codecov' },
      { label: 'CI', message: 'Passing', color: '2ea44f', logo: 'githubactions' }
    ]
  },

  // --- Category: Game & 3D Graphics ---
  {
    id: 'pack-game-unreal',
    title: 'Unreal Engine 5 Next-Gen',
    desc: 'Unreal Engine 5.4, C++, DirectX 12, Blender 4, PhysX',
    category: 'Game & 3D Graphics',
    badges: [
      { label: 'Unreal Engine', message: '5.4', color: '0e1128', logo: 'unrealengine' },
      { label: 'Native', message: 'C++', color: '00599c', logo: 'cplusplus' },
      { label: '3D_Assets', message: 'Blender_4', color: 'f5792a', logo: 'blender' },
      { label: 'Graphics', message: 'DirectX_12', color: '0078d7', logo: 'windows' }
    ]
  },
  {
    id: 'pack-game-unity',
    title: 'Unity 6 Cross-Platform',
    desc: 'Unity 6.0, C#, Universal Render Pipeline, ShaderGraph, Blender',
    category: 'Game & 3D Graphics',
    badges: [
      { label: 'Unity', message: '6.0', color: '000000', logo: 'unity' },
      { label: 'Language', message: 'C#', color: '239120', logo: 'csharp' },
      { label: 'Render', message: 'URP', color: '4c4c4c', logo: 'unity' },
      { label: 'Assets', message: 'Blender', color: 'f5792a', logo: 'blender' }
    ]
  },
  {
    id: 'pack-threejs-webgl',
    title: 'WebGL & Three.js 3D Web',
    desc: 'Three.js, WebGL, TypeScript, Vite 6, GLSL Shaders, Blender',
    category: 'Game & 3D Graphics',
    badges: [
      { label: 'Three.js', message: 'r169', color: '000000', logo: 'threedotjs' },
      { label: 'API', message: 'WebGL', color: '990000', logo: 'opengl' },
      { label: 'TypeScript', message: '5.8', color: '3178c6', logo: 'typescript' },
      { label: 'Bundler', message: 'Vite', color: '646cff', logo: 'vite' }
    ]
  },

  // --- Category: Blockchain & Web3 ---
  {
    id: 'pack-web3-ethereum',
    title: 'Web3 & EVM Smart Contracts',
    desc: 'Solidity 0.8.28, Ethereum EVM, Hardhat, Polygon, IPFS, Ethers.js',
    category: 'Blockchain & Web3',
    badges: [
      { label: 'Solidity', message: '0.8.28', color: '363636', logo: 'solidity' },
      { label: 'Ethereum', message: 'EVM', color: '3c3c3d', logo: 'ethereum' },
      { label: 'Toolchain', message: 'Hardhat', color: 'fff100', logo: 'hardhat' },
      { label: 'Network', message: 'Polygon', color: '8247e5', logo: 'polygon' },
      { label: 'Storage', message: 'IPFS', color: '65c2cb', logo: 'ipfs' }
    ]
  },
  {
    id: 'pack-solana-web3',
    title: 'Solana High-Speed Web3',
    desc: 'Rust, Solana, Anchor Framework, TypeScript, Web3.js',
    category: 'Blockchain & Web3',
    badges: [
      { label: 'Solana', message: 'Mainnet', color: '14f195', logo: 'solana' },
      { label: 'Programs', message: 'Rust', color: 'dea584', logo: 'rust' },
      { label: 'Framework', message: 'Anchor', color: '4e44e9', logo: 'solana' },
      { label: 'Client', message: 'TypeScript', color: '3178c6', logo: 'typescript' }
    ]
  },

  // --- Category: Open Source & Community ---
  {
    id: 'pack-oss-health',
    title: 'Open Source Project Health',
    desc: 'MIT License, PRs Welcome, Semantic Release, Codecov 98%, GitHub Stars',
    category: 'Open Source & Community',
    badges: [
      { label: 'License', message: 'MIT', color: '10b981', logo: '' },
      { label: 'PRs', message: 'welcome', color: '3b82f6', logo: 'git' },
      { label: 'Release', message: 'v1.0.0', color: '6366f1', logo: 'github' },
      { label: 'Codecov', message: '98%', color: '06b6d4', logo: 'codecov' },
      { label: 'Semantic', message: 'Release', color: 'e11d48', logo: 'semanticrelease' }
    ]
  },
  {
    id: 'pack-community-hub',
    title: 'Sponsor & Community Engagement',
    desc: 'Discord Chat, X / Twitter, YouTube Channel, GitHub Sponsors, LinkedIn',
    category: 'Open Source & Community',
    badges: [
      { label: 'Discord', message: 'Join_Chat', color: '5865f2', logo: 'discord' },
      { label: 'Twitter', message: 'Follow', color: '000000', logo: 'x' },
      { label: 'YouTube', message: 'Subscribe', color: 'ff0000', logo: 'youtube' },
      { label: 'Sponsor', message: 'GitHub', color: 'ea4aaa', logo: 'githubsponsors' },
      { label: 'LinkedIn', message: 'Connect', color: '0077b5', logo: 'linkedin' }
    ]
  }
]

