/**
 * Diagram Compilers and Parsers
 * High-fidelity, bi-directional compilers for Flowcharts with Subgraphs, Sequence Diagrams, and ER Schemas.
 */
import { DIAGRAM_THEMES } from './diagramConstants'

/**
 * Detect diagram type from Mermaid raw code
 */
export function detectDiagramType(code = '') {
  const clean = (code || '').replace(/^%%\{.*?\}%%\n?/s, '').trim()
  const firstLine = clean.split('\n')[0] || ''
  
  if (/^(?:graph|flowchart)\b/i.test(firstLine)) return 'flowchart'
  if (/^sequenceDiagram\b/i.test(firstLine)) return 'sequence'
  if (/^erDiagram\b/i.test(firstLine)) return 'er'
  if (/^classDiagram\b/i.test(firstLine)) return 'class'
  if (/^stateDiagram\b/i.test(firstLine)) return 'state'
  if (/^gitGraph\b/i.test(firstLine)) return 'git'
  if (/^mindmap\b/i.test(firstLine)) return 'mindmap'
  return 'flowchart'
}

/**
 * Injects Mermaid %%{init: ...}%% theme directive
 */
export function applyThemeDirective(rawCode = '', themeKey = 'midnight') {
  const themeObj = DIAGRAM_THEMES.find((t) => t.id === themeKey) || DIAGRAM_THEMES[0]
  const cleanedCode = (rawCode || '').replace(/^%%\{init:.*?\}%%\n?/s, '').trim()
  const directive = `%%{init: ${JSON.stringify(themeObj.config)}}%%\n`
  return `${directive}${cleanedCode}`
}

/**
 * Remove any theme directive for clean export or editing
 */
export function stripThemeDirective(rawCode = '') {
  return (rawCode || '').replace(/^%%\{init:.*?\}%%\n?/s, '').trim()
}

// =============================================================================
// FLOWCHART COMPILER & PARSER (WITH SUBGRAPHS / CLUSTERS SUPPORT)
// =============================================================================

export function compileFlowchart({ direction = 'TD', subgraphs = [], nodes = [], edges = [] }) {
  const idMap = new Map()
  nodes.forEach((n, idx) => {
    const cleanSym = (n.name || 'comp').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 24)
    idMap.set(n.id, `N${idx + 1}_${cleanSym}`)
  })

  const formatNodeShape = (n) => {
    const symbol = idMap.get(n.id) || `node_${n.id}`
    const label = (n.name || 'Component').replace(/"/g, "'")
    switch (n.shape) {
      case 'pill':
        return `${symbol}(["${label}"])`
      case 'cylinder':
        return `${symbol}[("${label}")]`
      case 'diamond':
        return `${symbol}{"${label}"}`
      case 'hexagon':
        return `${symbol}{{"${label}"}}`
      case 'circle':
        return `${symbol}(("${label}"))`
      case 'subroutine':
        return `${symbol}[["${label}"]]`
      case 'asymmetric':
        return `${symbol}>"${label}"]`
      case 'box':
      default:
        return `${symbol}["${label}"]`
    }
  }

  const lines = [`flowchart ${direction}`]

  // Track which nodes are assigned to subgraphs
  const nodesInSubgraphs = new Set()
  subgraphs.forEach((sg) => {
    if (Array.isArray(sg.nodeIds)) {
      sg.nodeIds.forEach((nid) => nodesInSubgraphs.add(nid))
    }
  })

  // Render Subgraphs first
  subgraphs.forEach((sg) => {
    const cleanSgId = (sg.title || 'Cluster').replace(/[^a-zA-Z0-9]/g, '_')
    lines.push(`  subgraph ${cleanSgId} ["${sg.title}"]`)
    if (sg.direction) {
      lines.push(`    direction ${sg.direction}`)
    }
    const memberNodes = nodes.filter((n) => (sg.nodeIds || []).includes(n.id))
    memberNodes.forEach((n) => {
      lines.push(`    ${formatNodeShape(n)}`)
    })
    lines.push('  end')
    lines.push('')
  })

  // Render Root / Top-Level Nodes (not in any subgraph)
  const rootNodes = nodes.filter((n) => !nodesInSubgraphs.has(n.id))
  if (rootNodes.length > 0) {
    rootNodes.forEach((n) => {
      lines.push(`  ${formatNodeShape(n)}`)
    })
    lines.push('')
  }

  // Render Edges
  edges.forEach((e) => {
    const fromSymbol = idMap.get(e.from)
    const toSymbol = idMap.get(e.to)
    if (!fromSymbol || !toSymbol) return

    const label = (e.label || '').trim().replace(/"/g, "'")
    let connector = '-->'

    if (e.type === 'dotted') {
      connector = label ? `-. "${label}" .->` : '-.->'
    } else if (e.type === 'thick') {
      connector = label ? `== "${label}" ==>` : '==>'
    } else if (e.type === 'twoway') {
      connector = label ? `<-->|"${label}"|` : '<-->'
    } else if (e.type === 'open') {
      connector = label ? `---|" ${label}"|` : '---'
    } else {
      connector = label ? `-->|"${label}"|` : '-->'
    }

    lines.push(`  ${fromSymbol} ${connector} ${toSymbol}`)
  })

  // Render Color Styles
  const styledNodes = nodes.filter((n) => n.color)
  if (styledNodes.length > 0) {
    lines.push('')
    styledNodes.forEach((n) => {
      const symbol = idMap.get(n.id)
      if (symbol) {
        lines.push(`  style ${symbol} fill:${n.color}25,stroke:${n.color},stroke-width:2px,color:#ffffff`)
      }
    })
  }

  return lines.join('\n')
}

export function parseFlowchart(mermaidCode = '') {
  const cleanCode = stripThemeDirective(mermaidCode)
  const lines = cleanCode.split('\n')
  let direction = 'TD'
  const nodesMap = new Map()
  const edges = []
  const subgraphs = []
  let currentSubgraph = null

  const parseToken = (token = '') => {
    token = token.trim()
    let m = token.match(/^([a-zA-Z0-9_]+)\s*\(\[\s*["']?(.*?)["']?\s*\]\)$/)
    if (m) return { id: m[1], name: m[2], shape: 'pill' }
    m = token.match(/^([a-zA-Z0-9_]+)\s*\[\(\s*["']?(.*?)["']?\s*\)\]$/)
    if (m) return { id: m[1], name: m[2], shape: 'cylinder' }
    m = token.match(/^([a-zA-Z0-9_]+)\s*\(\(\s*["']?(.*?)["']?\s*\)\)$/)
    if (m) return { id: m[1], name: m[2], shape: 'circle' }
    m = token.match(/^([a-zA-Z0-9_]+)\s*\{\{\s*["']?(.*?)["']?\s*\}\}$/)
    if (m) return { id: m[1], name: m[2], shape: 'hexagon' }
    m = token.match(/^([a-zA-Z0-9_]+)\s*\{\s*["']?(.*?)["']?\s*\}$/)
    if (m) return { id: m[1], name: m[2], shape: 'diamond' }
    m = token.match(/^([a-zA-Z0-9_]+)\s*\[\[\s*["']?(.*?)["']?\s*\]\]$/)
    if (m) return { id: m[1], name: m[2], shape: 'subroutine' }
    m = token.match(/^([a-zA-Z0-9_]+)\s*>\s*["']?(.*?)["']?\s*\]$/)
    if (m) return { id: m[1], name: m[2], shape: 'asymmetric' }
    m = token.match(/^([a-zA-Z0-9_]+)\s*\[\s*["']?(.*?)["']?\s*\]$/)
    if (m) return { id: m[1], name: m[2], shape: 'box' }
    m = token.match(/^([a-zA-Z0-9_]+)$/)
    if (m) return { id: m[1], name: m[1], shape: 'box' }
    return null
  }

  for (let rawLine of lines) {
    let line = rawLine.trim()
    if (!line || line.startsWith('%%')) continue

    // Direction check
    const dirMatch = line.match(/^(?:graph|flowchart)\s+(TD|TB|LR|RL|BT)/i)
    if (dirMatch) {
      direction = dirMatch[1].toUpperCase()
      if (direction === 'TB') direction = 'TD'
      continue
    }

    // Subgraph Start
    const sgMatch = line.match(/^subgraph\s+([a-zA-Z0-9_]+)(?:\s*\["?(.*?)"?\])?/i)
    if (sgMatch) {
      currentSubgraph = {
        id: `sg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: sgMatch[2] || sgMatch[1],
        nodeIds: []
      }
      subgraphs.push(currentSubgraph)
      continue
    }

    // Subgraph End
    if (line === 'end') {
      currentSubgraph = null
      continue
    }

    // Skip style lines for edge detection
    if (line.startsWith('style ') || line.startsWith('classDef ') || line.startsWith('class ')) continue

    // Edge check: LeftNode Connector RightNode
    const edgeMatch = line.match(/^(.+?)\s*(-->|-.->|==>|<-->|---|--\s*.*?\s*-->|-\.\s*.*?\s*\.->|==\s*.*?\s*==>)\s*(?:\|["']?(.*?)["']?\|)?\s*(.+)$/)
    if (edgeMatch) {
      const leftPart = edgeMatch[1]
      const rawConnector = edgeMatch[2]
      const inlineLabel = edgeMatch[3]
      const rightPart = edgeMatch[4]

      const leftNode = parseToken(leftPart)
      const rightNode = parseToken(rightPart)

      if (leftNode && !nodesMap.has(leftNode.id)) {
        nodesMap.set(leftNode.id, leftNode)
        if (currentSubgraph) currentSubgraph.nodeIds.push(leftNode.id)
      }
      if (rightNode && !nodesMap.has(rightNode.id)) {
        nodesMap.set(rightNode.id, rightNode)
        if (currentSubgraph) currentSubgraph.nodeIds.push(rightNode.id)
      }

      let edgeType = 'arrow'
      if (rawConnector.includes('-.')) edgeType = 'dotted'
      else if (rawConnector.includes('==')) edgeType = 'thick'
      else if (rawConnector.includes('<-->')) edgeType = 'twoway'
      else if (rawConnector.includes('---')) edgeType = 'open'

      let edgeLabel = inlineLabel || ''
      if (!edgeLabel) {
        const insideMatch = rawConnector.match(/(?:--|-\.|==)\s*["']?(.*?)["']?\s*(?:-->|\.->|==>)/)
        if (insideMatch && insideMatch[1]) edgeLabel = insideMatch[1]
      }

      const fromId = leftNode ? leftNode.id : leftPart.trim()
      const toId = rightNode ? rightNode.id : rightPart.trim()

      edges.push({
        id: `e_${edges.length + 1}`,
        from: fromId,
        to: toId,
        type: edgeType,
        label: (edgeLabel || '').trim()
      })
      continue
    }

    // Standalone node
    const singleNode = parseToken(line)
    if (singleNode && !nodesMap.has(singleNode.id)) {
      nodesMap.set(singleNode.id, singleNode)
      if (currentSubgraph) currentSubgraph.nodeIds.push(singleNode.id)
    }
  }

  // Parse color styles
  for (let rawLine of lines) {
    const styleMatch = rawLine.match(/^style\s+([a-zA-Z0-9_]+)\s+fill:([#a-zA-Z0-9]+)/i)
    if (styleMatch) {
      const n = nodesMap.get(styleMatch[1])
      if (n) {
        n.color = styleMatch[2].slice(0, 7)
      }
    }
  }

  return {
    direction,
    subgraphs,
    nodes: Array.from(nodesMap.values()),
    edges
  }
}

// =============================================================================
// SEQUENCE DIAGRAM COMPILER & PARSER
// =============================================================================

export function compileSequenceDiagram({ autonumber = true, participants = [], messages = [] }) {
  const lines = ['sequenceDiagram']
  if (autonumber) lines.push('  autonumber')

  // Render Participants
  participants.forEach((p) => {
    const type = p.type === 'actor' ? 'actor' : 'participant'
    const name = p.name || 'P'
    const alias = p.alias ? ` as ${p.alias}` : ''
    lines.push(`  ${type} ${name}${alias}`)
  })

  lines.push('')

  // Render Messages
  messages.forEach((m) => {
    if (m.type === 'note') {
      const target = m.target || m.from || 'Alice'
      lines.push(`  Note over ${target}: ${m.text || 'Note'}`)
      return
    }

    const from = m.from || 'Alice'
    const to = m.to || 'Bob'
    const arrow = m.arrow || '->>'
    const text = m.text || 'Message'
    lines.push(`  ${from}${arrow}${to}: ${text}`)

    if (m.activate) {
      lines.push(`  activate ${to}`)
    }
    if (m.deactivate) {
      lines.push(`  deactivate ${to}`)
    }
  })

  return lines.join('\n')
}

export function parseSequenceDiagram(code = '') {
  const cleanCode = stripThemeDirective(code)
  const lines = cleanCode.split('\n')
  const participants = []
  const messages = []
  let autonumber = false

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('%%') || line === 'sequenceDiagram') continue
    if (line === 'autonumber') {
      autonumber = true
      continue
    }

    // Participant or Actor
    const partMatch = line.match(/^(participant|actor)\s+([a-zA-Z0-9_]+)(?:\s+as\s+(.*))?$/i)
    if (partMatch) {
      participants.push({
        id: `p_${participants.length + 1}`,
        type: partMatch[1].toLowerCase(),
        name: partMatch[2],
        alias: (partMatch[3] || '').trim()
      })
      continue
    }

    // Note
    const noteMatch = line.match(/^Note\s+(over|left of|right of)\s+([a-zA-Z0-9_,\s]+):\s*(.*)$/i)
    if (noteMatch) {
      messages.push({
        id: `m_${messages.length + 1}`,
        type: 'note',
        target: noteMatch[2].trim(),
        text: noteMatch[3].trim()
      })
      continue
    }

    // Message: From Arrow To: Text
    const msgMatch = line.match(/^([a-zA-Z0-9_]+)\s*(->>|-->>|->|-->|-x|--x)\s*([a-zA-Z0-9_]+)\s*:\s*(.*)$/)
    if (msgMatch) {
      messages.push({
        id: `m_${messages.length + 1}`,
        from: msgMatch[1],
        arrow: msgMatch[2],
        to: msgMatch[3],
        text: msgMatch[4].trim()
      })
    }
  }

  return { autonumber, participants, messages }
}

// =============================================================================
// DATABASE ER DIAGRAM COMPILER & PARSER
// =============================================================================

export function compileErDiagram({ entities = [], relationships = [] }) {
  const lines = ['erDiagram']

  // Render relationships
  relationships.forEach((r) => {
    const e1 = (r.entity1 || 'TABLE_A').toUpperCase().replace(/[^a-zA-Z0-9_]/g, '_')
    const card = r.cardinality || '||--o{'
    const e2 = (r.entity2 || 'TABLE_B').toUpperCase().replace(/[^a-zA-Z0-9_]/g, '_')
    const label = (r.label || 'relates').replace(/[^a-zA-Z0-9_]/g, '_')
    lines.push(`  ${e1} ${card} ${e2} : ${label}`)
  })

  lines.push('')

  // Render Entities
  entities.forEach((ent) => {
    const tableName = (ent.name || 'ENTITY').toUpperCase().replace(/[^a-zA-Z0-9_]/g, '_')
    lines.push(`  ${tableName} {`)
    ;(ent.attributes || []).forEach((attr) => {
      const type = attr.type || 'string'
      const name = attr.name || 'field'
      const key = attr.key ? ` ${attr.key}` : ''
      const comment = attr.comment ? ` "${attr.comment}"` : ''
      lines.push(`    ${type} ${name}${key}${comment}`)
    })
    lines.push('  }')
    lines.push('')
  })

  return lines.join('\n')
}

export function parseErDiagram(code = '') {
  const cleanCode = stripThemeDirective(code)
  const lines = cleanCode.split('\n')
  const entities = []
  const relationships = []
  let currentEntity = null

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('%%') || line === 'erDiagram') continue

    // Relationship: ENTITY1 ||--o{ ENTITY2 : label
    const relMatch = line.match(/^([a-zA-Z0-9_]+)\s*([|{}o\.\-]+)\s*([a-zA-Z0-9_]+)\s*:\s*(.*)$/)
    if (relMatch) {
      relationships.push({
        id: `r_${relationships.length + 1}`,
        entity1: relMatch[1],
        cardinality: relMatch[2],
        entity2: relMatch[3],
        label: relMatch[4].trim()
      })
      continue
    }

    // Entity Start: ENTITY {
    const entMatch = line.match(/^([a-zA-Z0-9_]+)\s*\{$/)
    if (entMatch) {
      currentEntity = {
        id: `ent_${entities.length + 1}`,
        name: entMatch[1],
        attributes: []
      }
      entities.push(currentEntity)
      continue
    }

    // Entity End: }
    if (line === '}') {
      currentEntity = null
      continue
    }

    // Entity Attribute
    if (currentEntity) {
      const attrMatch = line.match(/^([a-zA-Z0-9_]+)\s+([a-zA-Z0-9_]+)(?:\s+(PK|FK|UK))?(?:\s+"(.*)")?$/i)
      if (attrMatch) {
        currentEntity.attributes.push({
          id: `attr_${currentEntity.attributes.length + 1}`,
          type: attrMatch[1],
          name: attrMatch[2],
          key: (attrMatch[3] || '').toUpperCase(),
          comment: attrMatch[4] || ''
        })
      }
    }
  }

  return { entities, relationships }
}

// =============================================================================
// STATE MACHINE DIAGRAM COMPILER & PARSER
// =============================================================================

export function compileStateDiagram({ states = [], transitions = [] }) {
  const lines = ['stateDiagram-v2']

  // Initial states
  states.filter((s) => s.isInitial).forEach((s) => {
    lines.push(`  [*] --> ${s.name}`)
  })

  // State descriptions / notes
  states.forEach((s) => {
    if (s.description && s.description.trim()) {
      lines.push(`  ${s.name} : ${s.description.trim().replace(/"/g, "'")}`)
    }
  })

  lines.push('')

  // Transitions
  transitions.forEach((t) => {
    const from = t.from || '[*]'
    const to = t.to || '[*]'
    const evt = t.event ? ` : ${t.event.trim().replace(/"/g, "'")}` : ''
    lines.push(`  ${from} --> ${to}${evt}`)
  })

  // Final states
  states.filter((s) => s.isFinal).forEach((s) => {
    lines.push(`  ${s.name} --> [*]`)
  })

  return lines.join('\n')
}

export function parseStateDiagram(code = '') {
  const cleanCode = stripThemeDirective(code)
  const lines = cleanCode.split('\n')
  const statesMap = new Map()
  const transitions = []

  const ensureState = (name) => {
    if (!name || name === '[*]') return
    if (!statesMap.has(name)) {
      statesMap.set(name, {
        id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name,
        description: '',
        isInitial: false,
        isFinal: false
      })
    }
  }

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('%%') || line === 'stateDiagram' || line === 'stateDiagram-v2') continue

    // Transition: From --> To [: Event]
    const transMatch = line.match(/^([*a-zA-Z0-9_]+)\s*-->\s*([*a-zA-Z0-9_]+)(?:\s*:\s*(.*))?$/)
    if (transMatch) {
      const from = transMatch[1]
      const to = transMatch[2]
      const event = (transMatch[3] || '').trim()

      if (from === '[*]' && to !== '[*]') {
        ensureState(to)
        const s = statesMap.get(to)
        if (s) s.isInitial = true
      } else if (to === '[*]' && from !== '[*]') {
        ensureState(from)
        const s = statesMap.get(from)
        if (s) s.isFinal = true
      } else {
        ensureState(from)
        ensureState(to)
        transitions.push({
          id: `t_${transitions.length + 1}`,
          from,
          to,
          event
        })
      }
      continue
    }

    // State Description: StateName : Description
    const descMatch = line.match(/^([a-zA-Z0-9_]+)\s*:\s*(.*)$/)
    if (descMatch) {
      ensureState(descMatch[1])
      const s = statesMap.get(descMatch[1])
      if (s) s.description = descMatch[2].trim()
    }
  }

  return {
    states: Array.from(statesMap.values()),
    transitions
  }
}

// =============================================================================
// CLASS DIAGRAM COMPILER & PARSER
// =============================================================================

export function compileClassDiagram({ classes = [], relationships = [] }) {
  const lines = ['classDiagram']

  // Render Classes
  classes.forEach((cls) => {
    lines.push(`  class ${cls.name} {`)
    if (cls.isInterface) {
      lines.push('    <<interface>>')
    }
    ;(cls.attributes || []).forEach((attr) => {
      const vis = attr.visibility || '+'
      const type = attr.type ? `${attr.type} ` : ''
      lines.push(`    ${vis}${type}${attr.name}`)
    })
    ;(cls.methods || []).forEach((m) => {
      const vis = m.visibility || '+'
      const ret = m.returnType ? ` ${m.returnType}` : ''
      lines.push(`    ${vis}${m.name}(${m.params || ''})${ret}`)
    })
    lines.push('  }')
    lines.push('')
  })

  // Render Relationships
  relationships.forEach((rel) => {
    const from = rel.from || 'ClassA'
    const type = rel.type || '<|--'
    const to = rel.to || 'ClassB'
    const label = rel.label ? ` : ${rel.label}` : ''
    lines.push(`  ${from} ${type} ${to}${label}`)
  })

  return lines.join('\n')
}

export function parseClassDiagram(code = '') {
  const cleanCode = stripThemeDirective(code)
  const lines = cleanCode.split('\n')
  const classes = []
  const relationships = []
  let currentClass = null

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('%%') || line === 'classDiagram') continue

    // Relationship: ClassA <|-- ClassB : label
    const relMatch = line.match(/^([a-zA-Z0-9_]+)\s*(<\|--|\*--|o--|-->|--|\.\.\|\>|\.\.>)\s*([a-zA-Z0-9_]+)(?:\s*:\s*(.*))?$/)
    if (relMatch) {
      relationships.push({
        id: `crel_${relationships.length + 1}`,
        from: relMatch[1],
        type: relMatch[2],
        to: relMatch[3],
        label: (relMatch[4] || '').trim()
      })
      continue
    }

    // Class start: class Name {
    const clsMatch = line.match(/^class\s+([a-zA-Z0-9_]+)\s*\{$/i)
    if (clsMatch) {
      currentClass = {
        id: `cls_${classes.length + 1}`,
        name: clsMatch[1],
        isInterface: false,
        attributes: [],
        methods: []
      }
      classes.push(currentClass)
      continue
    }

    // Class end: }
    if (line === '}') {
      currentClass = null
      continue
    }

    // Interface tag
    if (currentClass && /<<interface>>/i.test(line)) {
      currentClass.isInterface = true
      continue
    }

    // Class members inside class
    if (currentClass) {
      // Method: +methodName(param) returnType
      const methodMatch = line.match(/^([+\-#~])?\s*([a-zA-Z0-9_]+)\((.*?)\)(?:\s+([a-zA-Z0-9_<>[\]]+))?$/)
      if (methodMatch) {
        currentClass.methods.push({
          id: `m_${currentClass.methods.length + 1}`,
          visibility: methodMatch[1] || '+',
          name: methodMatch[2],
          params: methodMatch[3] || '',
          returnType: methodMatch[4] || 'void'
        })
        continue
      }

      // Attribute: +type name or +name
      const attrMatch = line.match(/^([+\-#~])?\s*(?:([a-zA-Z0-9_<>[\]]+)\s+)?([a-zA-Z0-9_]+)$/)
      if (attrMatch) {
        currentClass.attributes.push({
          id: `a_${currentClass.attributes.length + 1}`,
          visibility: attrMatch[1] || '+',
          type: attrMatch[2] || 'String',
          name: attrMatch[3]
        })
      }
    }
  }

  return { classes, relationships }
}

// =============================================================================
// MINDMAP COMPILER & PARSER
// =============================================================================

export function compileMindmap({ rootTitle = 'Central Concept', nodes = [] }) {
  const lines = ['mindmap']
  lines.push(`  root((${rootTitle.replace(/[()]/g, '')}))`)

  const formatShape = (text, shape) => {
    const clean = text.replace(/[[\](){}><]/g, '')
    switch (shape) {
      case 'circle': return `((${clean}))`
      case 'rounded': return `(${clean})`
      case 'square': return `[${clean}]`
      case 'cloud': return `)${clean}(`
      case 'bang': return `}}${clean}{{`
      default: return clean
    }
  }

  nodes.forEach((n) => {
    const indent = '  '.repeat(Math.max(1, (n.depth || 1) + 1))
    lines.push(`${indent}${formatShape(n.text || 'Topic', n.shape || 'default')}`)
  })

  return lines.join('\n')
}

export function parseMindmap(code = '') {
  const cleanCode = stripThemeDirective(code)
  const lines = cleanCode.split('\n')
  let rootTitle = 'Central Concept'
  const nodes = []

  const parseNodeTextAndShape = (raw) => {
    const s = raw.trim()
    let m = s.match(/^\(\((.*?)\)\)$/)
    if (m) return { text: m[1], shape: 'circle' }
    m = s.match(/^\((.*?)\)$/)
    if (m) return { text: m[1], shape: 'rounded' }
    m = s.match(/^\[(.*?)\]$/)
    if (m) return { text: m[1], shape: 'square' }
    m = s.match(/^\)(.*?)\($/)
    if (m) return { text: m[1], shape: 'cloud' }
    m = s.match(/^}}(.*?){{$/)
    if (m) return { text: m[1], shape: 'bang' }
    return { text: s, shape: 'default' }
  }

  for (let rawLine of lines) {
    if (!rawLine.trim() || rawLine.trim().startsWith('%%') || rawLine.trim() === 'mindmap') continue

    // Root detection
    const rootMatch = rawLine.match(/^\s*root\s*(?:\(\((.*?)\)\)|\((.*?)\)|\[(.*?)\]|(.*))$/)
    if (rootMatch) {
      rootTitle = (rootMatch[1] || rootMatch[2] || rootMatch[3] || rootMatch[4] || 'Central Concept').trim()
      continue
    }

    // Leading spaces determine depth
    const leadingSpaces = rawLine.search(/\S/)
    const depth = Math.max(1, Math.round(leadingSpaces / 2) - 1)
    const { text, shape } = parseNodeTextAndShape(rawLine)

    if (text) {
      nodes.push({
        id: `mm_${nodes.length + 1}`,
        text,
        depth,
        shape
      })
    }
  }

  return { rootTitle, nodes }
}

// =============================================================================
// GIT GRAPH COMPILER & PARSER
// =============================================================================

export function compileGitGraph({ steps = [] }) {
  const lines = ['gitGraph']

  steps.forEach((s) => {
    switch (s.type) {
      case 'branch':
        lines.push(`  branch ${s.name}`)
        break
      case 'checkout':
        lines.push(`  checkout ${s.name}`)
        break
      case 'merge': {
        const idPart = s.idLabel ? ` id: "${s.idLabel.replace(/"/g, "'")}"` : ''
        const tagPart = s.tag ? ` tag: "${s.tag.replace(/"/g, "'")}"` : ''
        lines.push(`  merge ${s.target}${idPart}${tagPart}`)
        break
      }
      case 'commit':
      default: {
        const idPart = s.idLabel ? ` id: "${s.idLabel.replace(/"/g, "'")}"` : ''
        const tagPart = s.tag ? ` tag: "${s.tag.replace(/"/g, "'")}"` : ''
        lines.push(`  commit${idPart}${tagPart}`)
        break
      }
    }
  })

  return lines.join('\n')
}

export function parseGitGraph(code = '') {
  const cleanCode = stripThemeDirective(code)
  const lines = cleanCode.split('\n')
  const steps = []

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('%%') || line === 'gitGraph') continue

    // Branch: branch name
    const bMatch = line.match(/^branch\s+([a-zA-Z0-9_\-./]+)$/)
    if (bMatch) {
      steps.push({
        id: `git_${steps.length + 1}`,
        type: 'branch',
        name: bMatch[1]
      })
      continue
    }

    // Checkout: checkout name
    const cMatch = line.match(/^checkout\s+([a-zA-Z0-9_\-./]+)$/)
    if (cMatch) {
      steps.push({
        id: `git_${steps.length + 1}`,
        type: 'checkout',
        name: cMatch[1]
      })
      continue
    }

    // Merge: merge target [id: "..."] [tag: "..."]
    const mMatch = line.match(/^merge\s+([a-zA-Z0-9_\-./]+)(?:\s+id:\s*["']?(.*?)["']?)?(?:\s+tag:\s*["']?(.*?)["']?)?$/)
    if (mMatch) {
      steps.push({
        id: `git_${steps.length + 1}`,
        type: 'merge',
        target: mMatch[1],
        idLabel: mMatch[2] || '',
        tag: mMatch[3] || ''
      })
      continue
    }

    // Commit: commit [id: "..."] [tag: "..."]
    const commitMatch = line.match(/^commit(?:\s+id:\s*["']?(.*?)["']?)?(?:\s+tag:\s*["']?(.*?)["']?)?$/)
    if (commitMatch) {
      steps.push({
        id: `git_${steps.length + 1}`,
        type: 'commit',
        idLabel: commitMatch[1] || `commit_${steps.length + 1}`,
        tag: commitMatch[2] || ''
      })
    }
  }

  return { steps }
}
