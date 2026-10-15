export const STUDIO_MODES = [
  { id: 'banner', label: 'Hero Banner', icon: 'featured_play_list' },
  { id: 'link', label: 'Device Mockups', icon: 'devices' },
  { id: 'upload', label: 'Paste Screenshot', icon: 'add_photo_alternate' },
  { id: 'adaptive', label: 'Theme Adaptive', icon: 'contrast' },
  { id: 'comparison', label: 'Compare Grid', icon: 'compare' }
]

export const BANNER_STYLES = [
  { id: 'capsule', label: 'Dynamic GitHub Header', icon: 'waves', desc: 'Capsule Render waving/curved gradient (works on GitHub instantly)' },
  { id: 'typing', label: 'Animated Typing Loop', icon: 'keyboard', desc: 'Live terminal typing text animation (works on GitHub instantly)' },
  { id: 'github-stats', label: 'Live GitHub Repo Pin', icon: 'star', desc: 'Dynamic live GitHub star/fork pin & activity stats (works on GitHub instantly)' },
  { id: 'cover', label: 'Tech Photo Cover', icon: 'photo_camera', desc: 'Curated high-res developer landscape from Unsplash' },
  { id: 'hud-telemetry', label: 'Sci-Fi HUD Telemetry', icon: 'sensors', desc: 'Stitch bio-telemetry HUD card (requires SVG file in repo)' },
  { id: 'neofetch', label: 'Neofetch CLI Terminal', icon: 'terminal', desc: 'Developer terminal with system info (requires SVG file in repo)' },
  { id: 'cyberpunk-grid', label: 'Cyberpunk Neon Grid', icon: 'grid_view', desc: 'Perspective wireframe matrix horizon (requires SVG file in repo)' },
  { id: 'swiss-minimal', label: 'Swiss Typographic Grid', icon: 'view_quilt', desc: 'High-contrast editorial layout (requires SVG file in repo)' },
  { id: 'glass-orbit', label: 'Glassmorphism Tech Matrix', icon: 'blur_on', desc: 'Translucent frosted glass card (requires SVG file in repo)' },
  { id: 'gradient-ribbon', label: 'Aurora Flowing Ribbon', icon: 'grain', desc: 'Sleek abstract gradient ribbon (requires SVG file in repo)' }
]

export const LOCAL_SVG_TYPES = ['hud-telemetry', 'neofetch', 'cyberpunk-grid', 'swiss-minimal', 'glass-orbit', 'gradient-ribbon']

export const escapeXml = (unsafe = '') => {
  return String(unsafe ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export const CAPSULE_SHAPES = [
  { id: 'waving', label: 'Waving' },
  { id: 'cylinder', label: 'Cylinder' },
  { id: 'soft', label: 'Soft' },
  { id: 'slice', label: 'Slice' },
  { id: 'rect', label: 'Rect' }
]

export const COLOR_THEMES = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Violet',
    bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
    capsuleList: '1,6,11',
    hex1: '#4f46e5',
    hex2: '#db2777',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    bg: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
    capsuleList: '3,8,13',
    hex1: '#06b6d4',
    hex2: '#10b981',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    bg: 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #38bdf8 100%)',
    capsuleList: '0,2,7',
    hex1: '#0284c7',
    hex2: '#38bdf8',
    coverUrl: 'https://images.unsplash.com/photo-1534972195531-a756b112697b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'sunset',
    name: 'Sunset Crimson',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f59e0b 100%)',
    capsuleList: '5,10,15',
    hex1: '#ea580c',
    hex2: '#f59e0b',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Obsidian',
    bg: 'linear-gradient(135deg, #090d16 0%, #161e2e 50%, #232f46 100%)',
    capsuleList: '20,22,25',
    hex1: '#161e2e',
    hex2: '#232f46',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80'
  }
]

export const FRAME_STYLES = [
  { id: 'clean', label: 'Clean Borderless (GitHub)', desc: 'Standard responsive markdown image' },
  { id: 'mac-window', label: 'macOS Window Title', desc: 'Header chrome with window dots' },
  { id: 'browser-bar', label: 'Browser Address Bar', desc: 'Secure URL address chip' },
  { id: 'terminal', label: 'Terminal / CLI Prompt', desc: 'Command prompt chip with code styling' },
  { id: 'mobile', label: 'Mobile Device Frame', desc: 'Mobile device labeled preview' },
  { id: 'rounded-card', label: 'Centered Image Card', desc: 'Centered clean image presentation' }
]

export const POPULAR_TECH_STACK = [
  'React', 'Next.js', 'Vue', 'Python', 'FastAPI', 'Django',
  'TypeScript', 'JavaScript', 'Node.js', 'Go', 'Rust',
  'Docker', 'Kubernetes', 'AWS', 'Tailwind', 'PostgreSQL', 'MongoDB', 'GraphQL'
]
