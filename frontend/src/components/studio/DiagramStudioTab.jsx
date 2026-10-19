import React, { useState, useMemo, useCallback, useRef } from 'react'
import StudioShell from './common/StudioShell'
import {
  DIAGRAM_TYPES,
  DIAGRAM_THEMES,
  PRESET_TEMPLATES
} from './diagram/diagramConstants'
import {
  detectDiagramType,
  applyThemeDirective,
  compileFlowchart,
  parseFlowchart,
  compileSequenceDiagram,
  parseSequenceDiagram,
  compileErDiagram,
  parseErDiagram,
  compileStateDiagram,
  parseStateDiagram,
  compileClassDiagram,
  parseClassDiagram,
  compileMindmap,
  parseMindmap,
  compileGitGraph,
  parseGitGraph
} from './diagram/diagramCompilers'
import FlowchartVisualBuilder from './diagram/FlowchartVisualBuilder'
import SequenceVisualBuilder from './diagram/SequenceVisualBuilder'
import ErVisualBuilder from './diagram/ErVisualBuilder'
import StateVisualBuilder from './diagram/StateVisualBuilder'
import ClassVisualBuilder from './diagram/ClassVisualBuilder'
import MindmapVisualBuilder from './diagram/MindmapVisualBuilder'
import GitVisualBuilder from './diagram/GitVisualBuilder'
import DiagramCanvas from './diagram/DiagramCanvas'
import DiagramCodeEditor from './diagram/DiagramCodeEditor'
import PresetCatalogModal from './diagram/PresetCatalogModal'
import '../../styles/studios/diagramStudio.css'

const STUDIO_MODES = [
  { id: 'visual', label: 'Visual Builder', icon: 'account_tree' },
  { id: 'code', label: 'Monaco Code Editor', icon: 'code' }
]

/**
 * Rebuilt Architecture Diagram Studio Pro
 * Multi-type diagram visual builders (Flowchart with Subgraphs, Sequence, ER Models),
 * Monaco Code Editor with Monarch Mermaid tokenizer, unified single-stage canvas,
 * 8 high-fidelity themes, and 24+ architecture blueprints.
 */
export default function DiagramStudioTab({
  onInsertDiagram,
  onBackToReadme
}) {
  const canvasRef = useRef(null)
  const [currentZoom, setCurrentZoom] = useState(100)

  // Mode: 'visual' | 'code'
  const [studioMode, setStudioMode] = useState('visual')

  // Diagram Type: 'flowchart' | 'sequence' | 'er' | 'class' | 'state' | 'git' | 'mindmap'
  const [diagramType, setDiagramType] = useState('flowchart')

  // Theme Key: 'midnight' | 'tokyonight' | 'cyberpunk' | 'emerald' | 'glacier' | 'dracula' | 'solarized' | 'primer'
  const [themeKey, setThemeKey] = useState('midnight')

  // Presets Catalog Modal
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)

  // Raw Code State (Defaults to Microservices with Subgraphs blueprint)
  const [code, setCode] = useState(PRESET_TEMPLATES[0].code)

  // ---------------- Flowchart Visual State ----------------
  const initialFlowchart = useMemo(() => parseFlowchart(PRESET_TEMPLATES[0].code), [])
  const [flowDirection, setFlowDirection] = useState(initialFlowchart.direction)
  const [flowSubgraphs, setFlowSubgraphs] = useState(initialFlowchart.subgraphs)
  const [flowNodes, setFlowNodes] = useState(initialFlowchart.nodes)
  const [flowEdges, setFlowEdges] = useState(initialFlowchart.edges)
  const [selectedFlowchartNodeId, setSelectedFlowchartNodeId] = useState(initialFlowchart.nodes[0]?.id || null)

  // ---------------- Sequence Visual State ----------------
  const initialSequence = useMemo(() => {
    const seqPreset = PRESET_TEMPLATES.find((p) => p.id === 'seq-oauth2-flow')
    return seqPreset ? parseSequenceDiagram(seqPreset.code) : { autonumber: true, participants: [], messages: [] }
  }, [])
  const [seqAutonumber, setSeqAutonumber] = useState(initialSequence.autonumber)
  const [seqParticipants, setSeqParticipants] = useState(initialSequence.participants)
  const [seqMessages, setSeqMessages] = useState(initialSequence.messages)
  const [selectedSeqMessageId, setSelectedSeqMessageId] = useState(initialSequence.messages[0]?.id || null)
  const [selectedSeqParticipantId, setSelectedSeqParticipantId] = useState(null)

  // ---------------- ER Visual State ----------------
  const initialEr = useMemo(() => {
    const erPreset = PRESET_TEMPLATES.find((p) => p.id === 'er-ecommerce-schema')
    return erPreset ? parseErDiagram(erPreset.code) : { entities: [], relationships: [] }
  }, [])
  const [erEntities, setErEntities] = useState(initialEr.entities)
  const [erRelationships, setErRelationships] = useState(initialEr.relationships)
  const [selectedErEntityId, setSelectedErEntityId] = useState(initialEr.entities[0]?.id || null)

  // ---------------- State Machine Visual State ----------------
  const initialState = useMemo(() => {
    const statePreset = PRESET_TEMPLATES.find((p) => p.id === 'state-order-lifecycle')
    return statePreset ? parseStateDiagram(statePreset.code) : { states: [], transitions: [] }
  }, [])
  const [stateStates, setStateStates] = useState(initialState.states)
  const [stateTransitions, setStateTransitions] = useState(initialState.transitions)
  const [selectedStateId, setSelectedStateId] = useState(initialState.states[0]?.id || null)

  // ---------------- Class Diagram Visual State ----------------
  const initialClass = useMemo(() => {
    const classPreset = PRESET_TEMPLATES.find((p) => p.id === 'class-clean-architecture')
    return classPreset ? parseClassDiagram(classPreset.code) : { classes: [], relationships: [] }
  }, [])
  const [classClasses, setClassClasses] = useState(initialClass.classes)
  const [classRelationships, setClassRelationships] = useState(initialClass.relationships)
  const [selectedClassId, setSelectedClassId] = useState(initialClass.classes[0]?.id || null)

  // ---------------- Mindmap Visual State ----------------
  const initialMindmap = useMemo(() => {
    const mmPreset = PRESET_TEMPLATES.find((p) => p.id === 'mindmap-devops-roadmap')
    return mmPreset ? parseMindmap(mmPreset.code) : { rootTitle: 'Platform Engineering', nodes: [] }
  }, [])
  const [mindmapRoot, setMindmapRoot] = useState(initialMindmap.rootTitle)
  const [mindmapNodes, setMindmapNodes] = useState(initialMindmap.nodes)
  const [selectedMindmapNodeId, setSelectedMindmapNodeId] = useState(initialMindmap.nodes[0]?.id || null)

  // ---------------- Git Graph Visual State ----------------
  const initialGit = useMemo(() => {
    const gitPreset = PRESET_TEMPLATES.find((p) => p.id === 'git-gitflow')
    return gitPreset ? parseGitGraph(gitPreset.code) : { steps: [] }
  }, [])
  const [gitSteps, setGitSteps] = useState(initialGit.steps)
  const [selectedGitStepId, setSelectedGitStepId] = useState(initialGit.steps[0]?.id || null)

  // Compute Active Selection Symbol and Text for Canvas Highlighting
  const selectedFlowchartSymbol = useMemo(() => {
    if (diagramType !== 'flowchart' || !selectedFlowchartNodeId) return ''
    const idx = flowNodes.findIndex((n) => n.id === selectedFlowchartNodeId)
    if (idx === -1) return ''
    const node = flowNodes[idx]
    const cleanSym = (node.name || 'comp').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24)
    return `N${idx + 1}_${cleanSym}`
  }, [diagramType, selectedFlowchartNodeId, flowNodes])

  const selectedNodeText = useMemo(() => {
    if (diagramType === 'flowchart') {
      return flowNodes.find((n) => n.id === selectedFlowchartNodeId)?.name || ''
    }
    if (diagramType === 'class') {
      return classClasses.find((c) => c.id === selectedClassId)?.name || ''
    }
    if (diagramType === 'sequence') {
      const msg = seqMessages.find((m) => m.id === selectedSeqMessageId)
      if (msg) return msg.text || ''
      const part = seqParticipants.find((p) => p.id === selectedSeqParticipantId)
      if (part) return part.alias || part.name || ''
    }
    if (diagramType === 'er') {
      return erEntities.find((e) => e.id === selectedErEntityId)?.name || ''
    }
    if (diagramType === 'state') {
      return stateStates.find((s) => s.id === selectedStateId)?.name || ''
    }
    if (diagramType === 'git') {
      const step = gitSteps.find((s) => s.id === selectedGitStepId)
      return step ? (step.idLabel || step.name || step.tag || '') : ''
    }
    if (diagramType === 'mindmap') {
      return mindmapNodes.find((n) => n.id === selectedMindmapNodeId)?.text || ''
    }
    return ''
  }, [
    diagramType,
    selectedFlowchartNodeId,
    flowNodes,
    selectedClassId,
    classClasses,
    selectedSeqMessageId,
    seqMessages,
    selectedSeqParticipantId,
    seqParticipants,
    selectedErEntityId,
    erEntities,
    selectedStateId,
    stateStates,
    selectedGitStepId,
    gitSteps,
    selectedMindmapNodeId,
    mindmapNodes
  ])

  // Direct Canvas Node Click to Select
  const handleCanvasNodeClick = useCallback(
    (info) => {
      if (!info) return

      if (diagramType === 'flowchart') {
        // 1. Match by exact node ID in rawId (e.g. flowchart-CDN-0 -> 'CDN', or node_...)
        const foundById = flowNodes.find((n) => n.id && (info.rawId || '').includes(n.id))
        if (foundById) {
          setSelectedFlowchartNodeId(foundById.id)
          return
        }

        // 2. Match by N(\d+)_ index in rawId
        const numMatch = (info.rawId || '').match(/N(\d+)_/)
        if (numMatch) {
          const idx = parseInt(numMatch[1], 10) - 1
          if (flowNodes[idx]) {
            setSelectedFlowchartNodeId(flowNodes[idx].id)
            return
          }
        }

        // 3. Match by index directly if provided
        if (info.index !== undefined && flowNodes[info.index]) {
          setSelectedFlowchartNodeId(flowNodes[info.index].id)
          return
        }

        // 4. Match by label text
        if (info.text) {
          const cleanTarget = info.text.trim().toLowerCase()
          const foundByText = flowNodes.find(
            (n) =>
              (n.name && cleanTarget.includes(n.name.toLowerCase())) ||
              (n.name && n.name.toLowerCase().includes(cleanTarget))
          )
          if (foundByText) {
            setSelectedFlowchartNodeId(foundByText.id)
            return
          }
        }
      } else if (diagramType === 'sequence') {
        if (info.text) {
          const clean = info.text.trim().toLowerCase()
          // 1. Match message text
          const foundMsg = seqMessages.find(
            (m) => m.text && (clean.includes(m.text.trim().toLowerCase()) || m.text.trim().toLowerCase().includes(clean))
          )
          if (foundMsg) {
            setSelectedSeqMessageId(foundMsg.id)
            return
          }
          // 2. Match participant name or alias
          const foundPart = seqParticipants.find(
            (p) =>
              (p.name && clean.includes(p.name.trim().toLowerCase())) ||
              (p.alias && clean.includes(p.alias.trim().toLowerCase()))
          )
          if (foundPart) {
            setSelectedSeqParticipantId(foundPart.id)
            return
          }
        }
      } else if (diagramType === 'er') {
        if (info.text) {
          const clean = info.text.trim().toLowerCase()
          const found = erEntities.find(
            (e) =>
              (e.name && clean.includes(e.name.trim().toLowerCase())) ||
              (e.name && e.name.trim().toLowerCase().includes(clean))
          )
          if (found) {
            setSelectedErEntityId(found.id)
            return
          }
        }
      } else if (diagramType === 'class') {
        const clean = (info.text || '').trim().toLowerCase()
        const found = classClasses.find(
          (c) =>
            (c.name && clean.includes(c.name.toLowerCase())) ||
            (c.name && c.name.toLowerCase().includes(clean)) ||
            (c.id && (info.rawId || '').includes(c.id)) ||
            (c.name && (info.rawId || '').toLowerCase().includes(c.name.toLowerCase()))
        )
        if (found) {
          setSelectedClassId(found.id)
        }
      } else if (diagramType === 'state') {
        const clean = (info.text || '').trim().toLowerCase()
        const found = stateStates.find(
          (s) =>
            (s.name && clean.includes(s.name.toLowerCase())) ||
            (s.name && s.name.toLowerCase().includes(clean)) ||
            (s.name && (info.rawId || '').toLowerCase().includes(s.name.toLowerCase()))
        )
        if (found) {
          setSelectedStateId(found.id)
        }
      } else if (diagramType === 'git') {
        const clean = (info.text || '').trim().toLowerCase()
        const found = gitSteps.find(
          (s) =>
            (s.idLabel && clean.includes(s.idLabel.toLowerCase())) ||
            (s.name && clean.includes(s.name.toLowerCase())) ||
            (s.tag && clean.includes(s.tag.toLowerCase()))
        )
        if (found) {
          setSelectedGitStepId(found.id)
        }
      } else if (diagramType === 'mindmap') {
        const clean = (info.text || '').trim().toLowerCase()
        const found = mindmapNodes.find(
          (n) =>
            (n.text && clean.includes(n.text.toLowerCase())) ||
            (n.text && n.text.toLowerCase().includes(clean))
        )
        if (found) {
          setSelectedMindmapNodeId(found.id)
        }
      }
    },
    [diagramType, flowNodes, classClasses, stateStates, gitSteps, mindmapNodes, seqMessages, seqParticipants, erEntities]
  )

  // Sync Flowchart Visual to Code
  const syncFlowchart = useCallback(
    ({ direction = flowDirection, subgraphs = flowSubgraphs, nodes = flowNodes, edges = flowEdges }) => {
      setFlowDirection(direction)
      setFlowSubgraphs(subgraphs)
      setFlowNodes(nodes)
      setFlowEdges(edges)
      const compiled = compileFlowchart({ direction, subgraphs, nodes, edges })
      setCode(compiled)
    },
    [flowDirection, flowSubgraphs, flowNodes, flowEdges]
  )

  // Sync Sequence Visual to Code
  const syncSequence = useCallback(
    ({ autonumber = seqAutonumber, participants = seqParticipants, messages = seqMessages }) => {
      setSeqAutonumber(autonumber)
      setSeqParticipants(participants)
      setSeqMessages(messages)
      const compiled = compileSequenceDiagram({ autonumber, participants, messages })
      setCode(compiled)
    },
    [seqAutonumber, seqParticipants, seqMessages]
  )

  // Sync ER Visual to Code
  const syncEr = useCallback(
    ({ entities = erEntities, relationships = erRelationships }) => {
      setErEntities(entities)
      setErRelationships(relationships)
      const compiled = compileErDiagram({ entities, relationships })
      setCode(compiled)
    },
    [erEntities, erRelationships]
  )

  // Sync State Visual to Code
  const syncState = useCallback(
    ({ states = stateStates, transitions = stateTransitions }) => {
      setStateStates(states)
      setStateTransitions(transitions)
      const compiled = compileStateDiagram({ states, transitions })
      setCode(compiled)
    },
    [stateStates, stateTransitions]
  )

  // Sync Class Visual to Code
  const syncClass = useCallback(
    ({ classes = classClasses, relationships = classRelationships }) => {
      setClassClasses(classes)
      setClassRelationships(relationships)
      const compiled = compileClassDiagram({ classes, relationships })
      setCode(compiled)
    },
    [classClasses, classRelationships]
  )

  // Sync Mindmap Visual to Code
  const syncMindmap = useCallback(
    ({ rootTitle = mindmapRoot, nodes = mindmapNodes }) => {
      setMindmapRoot(rootTitle)
      setMindmapNodes(nodes)
      const compiled = compileMindmap({ rootTitle, nodes })
      setCode(compiled)
    },
    [mindmapRoot, mindmapNodes]
  )

  // Sync Git Visual to Code
  const syncGit = useCallback(
    ({ steps = gitSteps }) => {
      setGitSteps(steps)
      const compiled = compileGitGraph({ steps })
      setCode(compiled)
    },
    [gitSteps]
  )

  // Apply Blueprint from Presets Catalog
  const handleSelectPreset = (preset) => {
    setCode(preset.code)
    const detectedType = preset.type || detectDiagramType(preset.code)
    setDiagramType(detectedType)

    if (detectedType === 'flowchart') {
      const parsed = parseFlowchart(preset.code)
      setFlowDirection(parsed.direction)
      setFlowSubgraphs(parsed.subgraphs)
      setFlowNodes(parsed.nodes)
      setFlowEdges(parsed.edges)
      setSelectedFlowchartNodeId(parsed.nodes[0]?.id || null)
    } else if (detectedType === 'sequence') {
      const parsed = parseSequenceDiagram(preset.code)
      setSeqAutonumber(parsed.autonumber)
      setSeqParticipants(parsed.participants)
      setSeqMessages(parsed.messages)
      setSelectedSeqMessageId(parsed.messages[0]?.id || null)
      setSelectedSeqParticipantId(parsed.participants[0]?.id || null)
    } else if (detectedType === 'er') {
      const parsed = parseErDiagram(preset.code)
      setErEntities(parsed.entities)
      setErRelationships(parsed.relationships)
      setSelectedErEntityId(parsed.entities[0]?.id || null)
    } else if (detectedType === 'state') {
      const parsed = parseStateDiagram(preset.code)
      setStateStates(parsed.states)
      setStateTransitions(parsed.transitions)
    } else if (detectedType === 'class') {
      const parsed = parseClassDiagram(preset.code)
      setClassClasses(parsed.classes)
      setClassRelationships(parsed.relationships)
      setSelectedClassId(parsed.classes[0]?.id || null)
    } else if (detectedType === 'mindmap') {
      const parsed = parseMindmap(preset.code)
      setMindmapRoot(parsed.rootTitle)
      setMindmapNodes(parsed.nodes)
    } else if (detectedType === 'git') {
      const parsed = parseGitGraph(preset.code)
      setGitSteps(parsed.steps)
    }
  }

  // Handle Mode Change (e.g. Code -> Visual)
  const handleModeChange = (newMode) => {
    if (newMode === 'visual') {
      const detected = detectDiagramType(code)
      setDiagramType(detected)

      if (detected === 'flowchart') {
        const parsed = parseFlowchart(code)
        if (parsed.nodes.length > 0) {
          setFlowDirection(parsed.direction)
          setFlowSubgraphs(parsed.subgraphs)
          setFlowNodes(parsed.nodes)
          setFlowEdges(parsed.edges)
          setSelectedFlowchartNodeId(parsed.nodes[0]?.id || null)
        }
      } else if (detected === 'sequence') {
        const parsed = parseSequenceDiagram(code)
        if (parsed.participants.length > 0) {
          setSeqAutonumber(parsed.autonumber)
          setSeqParticipants(parsed.participants)
          setSeqMessages(parsed.messages)
        }
      } else if (detected === 'er') {
        const parsed = parseErDiagram(code)
        if (parsed.entities.length > 0) {
          setErEntities(parsed.entities)
          setErRelationships(parsed.relationships)
        }
      } else if (detected === 'state') {
        const parsed = parseStateDiagram(code)
        if (parsed.states.length > 0) {
          setStateStates(parsed.states)
          setStateTransitions(parsed.transitions)
        }
      } else if (detected === 'class') {
        const parsed = parseClassDiagram(code)
        if (parsed.classes.length > 0) {
          setClassClasses(parsed.classes)
          setClassRelationships(parsed.relationships)
          setSelectedClassId(parsed.classes[0]?.id || null)
        }
      } else if (detected === 'mindmap') {
        const parsed = parseMindmap(code)
        if (parsed.nodes.length > 0) {
          setMindmapRoot(parsed.rootTitle)
          setMindmapNodes(parsed.nodes)
        }
      } else if (detected === 'git') {
        const parsed = parseGitGraph(code)
        if (parsed.steps.length > 0) {
          setGitSteps(parsed.steps)
        }
      }
    }
    setStudioMode(newMode)
  }

  // Handle Switching Diagram Type
  const handleSwitchDiagramType = (typeId) => {
    setDiagramType(typeId)
    const matchingPreset = PRESET_TEMPLATES.find((p) => p.type === typeId)
    if (matchingPreset) {
      handleSelectPreset(matchingPreset)
    }
  }

  // Chart source with theme injected for live stage rendering
  const activeThemedChart = useMemo(() => {
    return applyThemeDirective(code, themeKey)
  }, [code, themeKey])

  // Markdown code block for insertion
  const markdownBlock = `\`\`\`mermaid\n${activeThemedChart.trim()}\n\`\`\``

  // Insert Handler
  const handleInsert = () => {
    if (!code.trim()) return
    if (typeof onInsertDiagram === 'function') {
      onInsertDiagram(markdownBlock)
    }
  }

  // Header Actions: Blueprints Catalog Button
  const extraHeaderActions = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        className="studio-shell-btn studio-shell-btn-secondary"
        onClick={() => setIsCatalogOpen(true)}
        title="Open blueprints catalog with 24+ architecture presets"
        style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#818cf8' }}>library_books</span>
        <span>Blueprints Catalog ({PRESET_TEMPLATES.length})</span>
      </button>
    </div>
  )

  // Single Clean Canvas Stage Controls Toolbar placed right inside StudioShell's canvas top bar
  const canvasHeaderExtras = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="canvas-header-divider" />

      {/* Flowchart Direction Switcher */}
      {diagramType === 'flowchart' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(0,0,0,0.25)', padding: '2px', borderRadius: '4px' }}>
          {[
            { id: 'TD', label: '⬇️ TD' },
            { id: 'LR', label: '➡️ LR' }
          ].map((dir) => (
            <button
              key={dir.id}
              type="button"
              className={`studio-style-btn ${flowDirection === dir.id ? 'active' : ''}`}
              onClick={() => syncFlowchart({ direction: dir.id })}
              style={{ padding: '2px 6px', fontSize: '10px' }}
            >
              {dir.label}
            </button>
          ))}
        </div>
      )}

      {/* Theme Palette Selector */}
      <select
        value={themeKey}
        onChange={(e) => setThemeKey(e.target.value)}
        className="studio-text-input"
        style={{
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#cbd5e1',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
        title="Mermaid color palette theme"
      >
        {DIAGRAM_THEMES.map((th) => (
          <option key={th.id} value={th.id} style={{ background: '#1e293b', color: '#f8fafc' }}>
            {th.name}
          </option>
        ))}
      </select>

      <span className="canvas-header-divider" />

      {/* Zoom & Fit HUD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <button
          type="button"
          className="studio-shell-btn studio-shell-btn-icon"
          onClick={() => canvasRef.current?.zoomOut()}
          title="Zoom Out"
          style={{ width: '24px', height: '24px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>remove</span>
        </button>
        <span style={{ fontSize: '10.5px', fontFamily: 'monospace', color: '#94a3b8', minWidth: '36px', textAlign: 'center' }}>
          {currentZoom}%
        </span>
        <button
          type="button"
          className="studio-shell-btn studio-shell-btn-icon"
          onClick={() => canvasRef.current?.zoomIn()}
          title="Zoom In"
          style={{ width: '24px', height: '24px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span>
        </button>
        <button
          type="button"
          className="studio-shell-btn studio-shell-btn-icon"
          onClick={() => canvasRef.current?.fit()}
          title="Fit diagram to screen"
          style={{ width: '24px', height: '24px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>fit_screen</span>
        </button>
        <button
          type="button"
          className="studio-shell-btn studio-shell-btn-icon"
          onClick={() => canvasRef.current?.reset()}
          title="Reset Zoom (100%)"
          style={{ width: '24px', height: '24px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>restart_alt</span>
        </button>
      </div>

      <span className="canvas-header-divider" />

      {/* Export Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          type="button"
          className="studio-shell-btn studio-shell-btn-secondary"
          onClick={() => canvasRef.current?.exportSvg()}
          title="Download standalone vector SVG"
          style={{ padding: '2px 7px', fontSize: '10.5px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#10b981' }}>download</span>
          <span>SVG</span>
        </button>

        <button
          type="button"
          className="studio-shell-btn studio-shell-btn-secondary"
          onClick={() => canvasRef.current?.exportPng(2)}
          title="Download high-resolution 2x retina PNG"
          style={{ padding: '2px 7px', fontSize: '10.5px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#38bdf8' }}>image</span>
          <span>PNG</span>
        </button>

        <button
          type="button"
          className="studio-shell-btn studio-shell-btn-secondary"
          onClick={() => canvasRef.current?.exportPng(4)}
          title="Download ultra-high definition 4K PNG"
          style={{ padding: '2px 7px', fontSize: '10.5px' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#a855f7' }}>hd</span>
          <span>4K</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <StudioShell
        studioId="diagrams.studio"
        title="Mermaid Architecture Studio Pro"
        subtitle="Architecture multi-engine workbench & vector export"
        badge="Multi-Engine Pro"
        accentColor="#818cf8"
        icon={<span className="material-symbols-outlined" style={{ fontSize: '20px' }}>schema</span>}
        modes={DIAGRAM_TYPES}
        activeMode={diagramType}
        onModeChange={handleSwitchDiagramType}
        markdownCode={markdownBlock}
        codeLanguage="markdown"
        onInsert={handleInsert}
        insertLabel="Insert Diagram"
        onBackToReadme={onBackToReadme}
        extraHeaderActions={extraHeaderActions}
        canvasHeaderExtras={canvasHeaderExtras}
        defaultSplitWidth={540}
        minSplitWidth={380}
        maxSplitWidth={880}
        inspectorContent={
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', overflowY: 'auto' }}>
            {/* STUDIO MODE SWITCHER: Visual Builder vs Monaco Code Editor */}
            <div className="diagram-mode-switch-bar">
              {STUDIO_MODES.map((sm) => {
                const isActive = studioMode === sm.id
                return (
                  <button
                    key={sm.id}
                    type="button"
                    className={`diagram-mode-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleModeChange(sm.id)}
                    title={sm.id === 'visual' ? 'Interactive visual form controls & node tree' : 'Monaco code editor with Mermaid syntax highlighting'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{sm.icon}</span>
                    <span>{sm.label}</span>
                  </button>
                )
              })}
            </div>

            {/* VISUAL BUILDERS VS MONACO CODE EDITOR */}
            {studioMode === 'visual' ? (
              <div>
                {diagramType === 'flowchart' && (
                  <FlowchartVisualBuilder
                    direction={flowDirection}
                    onDirectionChange={(dir) => syncFlowchart({ direction: dir })}
                    subgraphs={flowSubgraphs}
                    onSubgraphsChange={(sgs) => syncFlowchart({ subgraphs: sgs })}
                    nodes={flowNodes}
                    onNodesChange={(nds) => syncFlowchart({ nodes: nds })}
                    edges={flowEdges}
                    onEdgesChange={(edg) => syncFlowchart({ edges: edg })}
                    selectedNodeId={selectedFlowchartNodeId}
                    onSelectNodeId={setSelectedFlowchartNodeId}
                  />
                )}

                {diagramType === 'sequence' && (
                  <SequenceVisualBuilder
                    autonumber={seqAutonumber}
                    onAutonumberChange={(auto) => syncSequence({ autonumber: auto })}
                    participants={seqParticipants}
                    onParticipantsChange={(parts) => syncSequence({ participants: parts })}
                    messages={seqMessages}
                    onMessagesChange={(msgs) => syncSequence({ messages: msgs })}
                    selectedMessageId={selectedSeqMessageId}
                    onSelectMessageId={setSelectedSeqMessageId}
                    selectedParticipantId={selectedSeqParticipantId}
                    onSelectParticipantId={setSelectedSeqParticipantId}
                  />
                )}

                {diagramType === 'er' && (
                  <ErVisualBuilder
                    entities={erEntities}
                    onEntitiesChange={(ents) => syncEr({ entities: ents })}
                    relationships={erRelationships}
                    onRelationshipsChange={(rels) => syncEr({ relationships: rels })}
                    selectedEntityId={selectedErEntityId}
                    onSelectEntityId={setSelectedErEntityId}
                  />
                )}

                {diagramType === 'state' && (
                  <StateVisualBuilder
                    states={stateStates}
                    onStatesChange={(sts) => syncState({ states: sts })}
                    transitions={stateTransitions}
                    onTransitionsChange={(trns) => syncState({ transitions: trns })}
                    selectedStateId={selectedStateId}
                    onSelectStateId={setSelectedStateId}
                  />
                )}

                {diagramType === 'class' && (
                  <ClassVisualBuilder
                    classes={classClasses}
                    onClassesChange={(cls) => syncClass({ classes: cls })}
                    relationships={classRelationships}
                    onRelationshipsChange={(rels) => syncClass({ relationships: rels })}
                    selectedClassId={selectedClassId}
                    onSelectClassId={setSelectedClassId}
                  />
                )}

                {diagramType === 'mindmap' && (
                  <MindmapVisualBuilder
                    rootTitle={mindmapRoot}
                    onRootTitleChange={(root) => syncMindmap({ rootTitle: root })}
                    nodes={mindmapNodes}
                    onNodesChange={(nds) => syncMindmap({ nodes: nds })}
                    selectedNodeId={selectedMindmapNodeId}
                    onSelectNodeId={setSelectedMindmapNodeId}
                  />
                )}

                {diagramType === 'git' && (
                  <GitVisualBuilder
                    steps={gitSteps}
                    onStepsChange={(stps) => syncGit({ steps: stps })}
                    selectedStepId={selectedGitStepId}
                    onSelectStepId={setSelectedGitStepId}
                  />
                )}
              </div>
            ) : (
              <DiagramCodeEditor
                code={code}
                onChange={(newCode) => setCode(newCode)}
                onApplySnippet={(snip) => setCode((prev) => prev + '\n' + snip)}
              />
            )}
          </div>
        }
        canvasContent={
          <DiagramCanvas
            ref={canvasRef}
            chart={activeThemedChart}
            themeKey={themeKey}
            onZoomChange={setCurrentZoom}
            onNodeClick={handleCanvasNodeClick}
            selectedNodeSymbol={selectedFlowchartSymbol}
            selectedNodeText={selectedNodeText}
          />
        }
      />

      {/* Preset Blueprints Catalog Modal */}
      <PresetCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectPreset={handleSelectPreset}
      />
    </>
  )
}
