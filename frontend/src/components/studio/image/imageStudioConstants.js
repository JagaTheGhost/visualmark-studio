export const STUDIO_MODES = [
  { id: 'banner', label: 'Hero Banner', icon: 'featured_play_list' },
  { id: 'motion', label: 'Motion & Video', icon: 'smart_display' },
  { id: 'link', label: 'Device Mockups', icon: 'devices' },
  { id: 'upload', label: 'Paste Screenshot', icon: 'add_photo_alternate' },
  { id: 'adaptive', label: 'Theme Adaptive', icon: 'contrast' },
  { id: 'comparison', label: 'Compare Grid', icon: 'compare' }
]


export const BANNER_STYLES = [
  { id: 'capsule', label: 'Dynamic GitHub Header', icon: 'waves', desc: 'Capsule Render waving/curved gradient (works on GitHub instantly)' },
  { id: 'typing', label: 'Animated Typing Loop', icon: 'keyboard', desc: 'Live terminal typing text animation (works on GitHub instantly)' },
  { id: 'cover', label: 'Tech Photo Cover', icon: 'photo_camera', desc: 'Curated high-res developer landscape from Unsplash' },
  { id: 'hud-telemetry', label: 'Sci-Fi HUD Telemetry', icon: 'sensors', desc: 'Stitch bio-telemetry HUD card (requires SVG file in repo)' },
  { id: 'neofetch', label: 'Neofetch CLI Terminal', icon: 'terminal', desc: 'Developer terminal with system info (requires SVG file in repo)' },
  { id: 'cyberpunk-grid', label: 'Cyberpunk Neon Grid', icon: 'grid_view', desc: 'Perspective wireframe matrix horizon (requires SVG file in repo)' },
  { id: 'swiss-minimal', label: 'Swiss Typographic Grid', icon: 'view_quilt', desc: 'High-contrast editorial layout (requires SVG file in repo)' },
  { id: 'glass-orbit', label: 'Glassmorphism Tech Matrix', icon: 'blur_on', desc: 'Translucent frosted glass card (requires SVG file in repo)' },
  { id: 'gradient-ribbon', label: 'Aurora Flowing Ribbon', icon: 'grain', desc: 'Sleek abstract gradient ribbon (requires SVG file in repo)' }
]


export const LOCAL_SVG_TYPES = ['hud-telemetry', 'neofetch', 'cyberpunk-grid', 'swiss-minimal', 'glass-orbit', 'gradient-ribbon']

export const POPULAR_TECH_STACK = []

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
  { id: 'rect', label: 'Rect' },
  { id: 'shark', label: 'Shark Fin' },
  { id: 'mountain', label: 'Mountain' },
  { id: 'transparent', label: 'Clean Glass' }
]

export const CAPSULE_ANIMATIONS = [
  { id: 'none', label: 'Static' },
  { id: 'fadeIn', label: 'Fade In' },
  { id: 'scaleIn', label: 'Scale In' }
]

export const TEXT_COLOR_PRESETS = [
  { label: 'Crisp White', hex: 'ffffff' },
  { label: 'Ice Cyan', hex: '38bdf8' },
  { label: 'Amber Gold', hex: 'fbbf24' },
  { label: 'Emerald Glow', hex: '34d399' },
  { label: 'Neon Rose', hex: 'fb7185' },
  { label: 'Silver Mist', hex: 'cbd5e1' }
]

export const COLOR_THEMES = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Violet',
    bg: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
    capsuleList: '0:4f46e5,100:db2777',
    colorParam: '0:4f46e5,100:db2777',
    hex1: '#4f46e5',
    hex2: '#db2777',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'emerald',
    name: 'Emerald Matrix',
    bg: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)',
    capsuleList: '0:064e3b,100:10b981',
    colorParam: '0:064e3b,100:10b981',
    hex1: '#064e3b',
    hex2: '#10b981',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    bg: 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #38bdf8 100%)',
    capsuleList: '0:0284c7,100:38bdf8',
    colorParam: '0:0284c7,100:38bdf8',
    hex1: '#0284c7',
    hex2: '#38bdf8',
    coverUrl: 'https://images.unsplash.com/photo-1534972195531-a756b112697b?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'sunset',
    name: 'Sunset Crimson',
    bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f59e0b 100%)',
    capsuleList: '0:ea580c,100:f59e0b',
    colorParam: '0:ea580c,100:f59e0b',
    hex1: '#ea580c',
    hex2: '#f59e0b',
    coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'midnight',
    name: 'Velvet Midnight',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #6366f1 100%)',
    capsuleList: '0:1e1b4b,100:6366f1',
    colorParam: '0:1e1b4b,100:6366f1',
    hex1: '#1e1b4b',
    hex2: '#6366f1',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'synthwave',
    name: 'Synthwave Neon',
    bg: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #f43f5e 100%)',
    capsuleList: '0:831843,100:f43f5e',
    colorParam: '0:831843,100:f43f5e',
    hex1: '#831843',
    hex2: '#f43f5e',
    coverUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'nordic',
    name: 'Nordic Frost',
    bg: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #38bdf8 100%)',
    capsuleList: '0:0c4a6e,100:38bdf8',
    colorParam: '0:0c4a6e,100:38bdf8',
    hex1: '#0c4a6e',
    hex2: '#38bdf8',
    coverUrl: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&auto=format&fit=crop&q=80'
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Obsidian',
    bg: 'linear-gradient(135deg, #090d16 0%, #161e2e 50%, #232f46 100%)',
    capsuleList: '0:161e2e,100:232f46',
    colorParam: '0:161e2e,100:232f46',
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

export const MOCKUP_GLOW_STYLES = [
  { id: 'none', label: 'None' },
  { id: 'soft', label: 'Soft Shadow' },
  { id: 'deep', label: 'Deep Studio' },
  { id: 'glow', label: 'Neon Glow' }
]


export const FONT_FAMILIES = [
  { id: 'sans', label: 'Modern Sans', font: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'mono', label: 'Code Mono', font: 'ui-monospace, SFMono-Regular, "Fira Code", "JetBrains Mono", monospace' },
  { id: 'cyber', label: 'Cyber Display', font: '"Orbitron", "Trebuchet MS", "Segoe UI", sans-serif' },
  { id: 'serif', label: 'Editorial Serif', font: 'Georgia, Cambria, "Times New Roman", serif' }
]

export const MOTION_FRAME_STYLES = [
  { id: 'banner', label: 'Wide Video Banner', icon: 'view_carousel', desc: 'Full-width cinematic motion header' },
  { id: 'mac-window', label: 'macOS Window Frame', icon: 'laptop_mac', desc: 'Framed inside native macOS title bar' },
  { id: 'browser-bar', label: 'Browser Address Bar', icon: 'web', desc: 'Web browser mockup with URL chip' },
  { id: 'terminal', label: 'CLI Terminal Frame', icon: 'terminal', desc: 'Hacker / developer command prompt' },
  { id: 'clean', label: 'Clean Border & Shadow', icon: 'crop_free', desc: 'Minimal border with elevation shadow' }
]

export const MOTION_PRESETS = [
  {
    name: 'VHS Terminal Workflow',
    url: 'https://raw.githubusercontent.com/charmbracelet/vhs/main/examples/demo.gif',
    type: 'gif',
    title: 'VisualMark Studio Workflow'
  },
  {
    name: 'Automated Code Session',
    url: 'https://vhs.charm.sh/vhs-1.gif',
    type: 'gif',
    title: 'Automated Coding Session'
  },
  {
    name: 'Bunny HD Video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    title: 'HD Video Demo'
  },
  {
    name: 'Tears of Steel 4K',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'video',
    title: 'Cinematic Motion Demo'
  }
]

