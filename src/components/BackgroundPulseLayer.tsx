import { useEffect, useRef, useCallback } from 'react'

interface LinkGlow {
  id: number
  fromX: number
  fromY: number
  toX: number
  toY: number
  progress: number
  opacity: number
  active: boolean
}

interface PathPulse {
  id: number
  nodeIndex: number
  progress: number
  active: boolean
}

interface Connection {
  nodeIndex: number
  targetX: number
  targetY: number
}

interface MajorBeamEffect {
  progress: number
  opacity: number
  active: boolean
  phase: 'fade-in' | 'hold' | 'fade-out'
}

interface BackgroundPulseLayerProps {
  isTyping: boolean
  promptRef: React.RefObject<HTMLElement>
}

// Déclaration des types globaux
declare global {
  interface Window {
    triggerMajorPulse?: () => void
    triggerMinorPulse?: () => void
  }
}

/**
 * BackgroundPulseLayer - Dynamic Neuron Grab System
 * 
 * Beams travel along direct connection paths like light in wires:
 * node → closest point on prompt rectangle
 * 
 * Each core node creates exactly ONE connection to the prompt.
 * Connections update LIVE every frame (like tsParticles grab-to-mouse).
 */
export default function BackgroundPulseLayer({ isTyping, promptRef }: BackgroundPulseLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const linkGlowsRef = useRef<LinkGlow[]>([])
  const pathPulsesRef = useRef<PathPulse[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const coreNodeIndicesRef = useRef<number[]>([])
  const majorBeamRef = useRef<MajorBeamEffect | null>(null)
  const nextIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const lastTypingRef = useRef(false)
  const nodesCacheRef = useRef<Array<{ x: number; y: number; links: Array<{ x: number; y: number }> }>>([])
  const lastPulseEmitRef = useRef<number>(0)

  // Mettre à jour le cache des nœuds ET identifier les core nodes (noyaux)
  useEffect(() => {
    const updateNodes = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodes = (window as any).premiumNetworkNodes
      if (nodes && nodes.length > 0) {
        nodesCacheRef.current = nodes
        console.log('✅ Nodes updated:', nodes.length)

        // Identifier les core nodes (4-6 nœuds avec le plus de liens) UNE SEULE FOIS
        if (coreNodeIndicesRef.current.length === 0) {
          // Compter les liens pour chaque nœud
          const nodeDegrees = nodes.map((node: any, index: number) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
            index,
            degree: node.links ? node.links.length : 0
          }))

          // Trier par nombre de liens (DESC)
          nodeDegrees.sort((a: any, b: any) => b.degree - a.degree) // eslint-disable-line @typescript-eslint/no-explicit-any

          // Prendre les 4-6 premiers (selon disponibilité)
          const coreCount = Math.min(6, Math.max(4, Math.floor(nodes.length * 0.05)))
          coreNodeIndicesRef.current = nodeDegrees.slice(0, coreCount).map((n: any) => n.index) // eslint-disable-line @typescript-eslint/no-explicit-any

          console.log('🔥 Core nodes identified:', coreNodeIndicesRef.current.length, 'nodes')
        }
      }
    }

    const interval = setInterval(updateNodes, 500)
    return () => clearInterval(interval)
  }, [])

  // Fonction pour illuminer les liens autour d'un nœud
  const illuminateLinksAround = useCallback((node: { x: number; y: number; links: Array<{ x: number; y: number }> }) => {
    if (!node.links || node.links.length === 0) return

    const currentGlows = linkGlowsRef.current.filter(g => g.active).length
    if (currentGlows >= 5) return

    const linksToIlluminate = Math.min(node.links.length, Math.floor(Math.random() * 2) + 1)
    
    for (let i = 0; i < linksToIlluminate; i++) {
      const link = node.links[Math.floor(Math.random() * node.links.length)]
      
      linkGlowsRef.current.push({
        id: nextIdRef.current++,
        fromX: node.x,
        fromY: node.y,
        toX: link.x,
        toY: link.y,
        progress: 0,
        opacity: 0.25,
        active: true,
      })
    }
  }, [])

  // Calculer le point le plus proche sur le rectangle du prompt
  const getClosestPointOnRect = useCallback((nodeX: number, nodeY: number, promptRect: DOMRect): { x: number; y: number } => {
    // Limiter les coordonnées du nœud aux bords du rectangle
    const x = Math.max(promptRect.left, Math.min(promptRect.right, nodeX))
    const y = Math.max(promptRect.top, Math.min(promptRect.bottom, nodeY))

    // Si le point est à l'intérieur du rectangle, trouver le bord le plus proche
    if (nodeX >= promptRect.left && nodeX <= promptRect.right && nodeY >= promptRect.top && nodeY <= promptRect.bottom) {
      const distTop = Math.abs(nodeY - promptRect.top)
      const distBottom = Math.abs(nodeY - promptRect.bottom)
      const distLeft = Math.abs(nodeX - promptRect.left)
      const distRight = Math.abs(nodeX - promptRect.right)

      const minDist = Math.min(distTop, distBottom, distLeft, distRight)

      if (minDist === distTop) return { x: nodeX, y: promptRect.top }
      if (minDist === distBottom) return { x: nodeX, y: promptRect.bottom }
      if (minDist === distLeft) return { x: promptRect.left, y: nodeY }
      return { x: promptRect.right, y: nodeY }
    }

    return { x, y }
  }, [])

  // Plus besoin de createConnections - les connexions sont recalculées chaque frame

  // Fonction pour déclencher un "major pulse" (appelée sur Enter) - BEAM VERTICAL
  const triggerMajorPulse = useCallback(() => {
    if (!promptRef.current) return

    // Déclencher le beam vertical uniquement
    majorBeamRef.current = {
      progress: 0,
      opacity: 0,
      active: true,
      phase: 'fade-in',
    }
    
    console.log('⚡ Major vertical beam triggered')
  }, [promptRef])

  const triggerMinorPulse = useCallback(() => {
    // Créer un pulse depuis un core node aléatoire
    if (coreNodeIndicesRef.current.length === 0) return
    
    const randomIndex = coreNodeIndicesRef.current[Math.floor(Math.random() * coreNodeIndicesRef.current.length)]
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = nodesCacheRef.current.length > 0 ? nodesCacheRef.current : (window as any).premiumNetworkNodes
    if (!nodes || nodes.length === 0) return
    
    const node = nodes[randomIndex]
    if (!node || node.x === undefined || node.y === undefined) return
    
    // Illuminer les liens autour du nœud
    illuminateLinksAround(node)
  }, [illuminateLinksAround])

  // Exposer la fonction globalement
  useEffect(() => {
    window.triggerMajorPulse = triggerMajorPulse
    window.triggerMinorPulse = triggerMinorPulse
    console.log('✅ BackgroundPulseLayer: minor+major pulse handlers exposed')
    
    return () => {
      delete window.triggerMajorPulse
      delete window.triggerMinorPulse
    }
  }, [triggerMajorPulse, triggerMinorPulse])

  // Gérer l'état typing
  useEffect(() => {
    if (!isTyping && lastTypingRef.current) {
      // L'utilisateur a arrêté de taper : RESET complet (input vidé)
      connectionsRef.current = []
      pathPulsesRef.current = []
      majorBeamRef.current = null
      console.log('🔄 Reset: all connections cleared')
    }
    lastTypingRef.current = isTyping
  }, [isTyping])

  // Animation loop principale
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajuster la taille du canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const promptRect = promptRef.current?.getBoundingClientRect()
      if (!promptRect) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodes = (window as any).premiumNetworkNodes
      if (!nodes || nodes.length === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // 1. DESSINER LES GLOWS DE LIENS
      linkGlowsRef.current = linkGlowsRef.current.filter((glow) => {
        if (!glow.active) return false

        glow.progress += 0.012

        if (glow.progress >= 1) {
          glow.active = false
          return false
        }
        
        // Fade in puis fade out
        let opacity = glow.opacity
        if (glow.progress < 0.3) {
          opacity *= glow.progress / 0.3
        } else if (glow.progress > 0.7) {
          opacity *= (1 - glow.progress) / 0.3
        }

        // Dessiner le lien lumineux (électrique et vivant)
        const intensity = (0.7 + Math.random() * 0.3) * opacity
        
        ctx.beginPath()
        ctx.moveTo(glow.fromX, glow.fromY)
        ctx.lineTo(glow.toX, glow.toY)
        ctx.strokeStyle = `rgba(130, 190, 255, ${intensity})`
        ctx.lineWidth = 1.4
        ctx.shadowBlur = 20 * intensity
        ctx.shadowColor = `rgba(130, 190, 255, ${intensity})`
        ctx.stroke()
        ctx.shadowBlur = 0

        return true
      })

      // 2. RECALCULER LES CONNEXIONS LIVE (chaque frame, pour tous les core nodes)
      connectionsRef.current = coreNodeIndicesRef.current.map(nodeIndex => {
        const node = nodes[nodeIndex]
        if (!node || node.x === undefined || node.y === undefined) {
          return { nodeIndex, targetX: 0, targetY: 0 }
        }
        
        const target = getClosestPointOnRect(node.x, node.y, promptRect)
        return { nodeIndex, targetX: target.x, targetY: target.y }
      }).filter(conn => {
        const node = nodes[conn.nodeIndex]
        return node && node.x !== undefined && node.y !== undefined
      })

      // 3. ÉMETTRE DES PATH PULSES (toutes les 400-800ms pendant typing)
      if (isTyping && coreNodeIndicesRef.current.length > 0) {
        const now = Date.now()
        const interval = 400 + Math.random() * 400 // 400-800ms
        
        if (now - lastPulseEmitRef.current > interval) {
          // Limiter à 8 pulses actifs
          if (pathPulsesRef.current.filter(p => p.active).length < 8) {
            // Choisir un core node aléatoire
            const randomIndex = coreNodeIndicesRef.current[Math.floor(Math.random() * coreNodeIndicesRef.current.length)]
            
            pathPulsesRef.current.push({
              id: nextIdRef.current++,
              nodeIndex: randomIndex,
              progress: 0,
              active: true,
            })
          }
          
          lastPulseEmitRef.current = now
        }
      }

      // 4. DESSINER LES PETITS DASH ÉLECTRIQUES QUI VOYAGENT
      pathPulsesRef.current = pathPulsesRef.current.filter(pulse => {
        if (!pulse.active) return false

        const node = nodes[pulse.nodeIndex]
        if (!node || node.x === undefined || node.y === undefined) {
          pulse.active = false
          return false
        }

        // Trouver la connexion correspondante
        const conn = connectionsRef.current.find(c => c.nodeIndex === pulse.nodeIndex)
        if (!conn) {
          pulse.active = false
          return false
        }

        pulse.progress += 0.008

        if (pulse.progress >= 1) {
          pulse.active = false
          return false
        }

        // Calculer la position du dash avec easing
        const t = 1 - Math.pow(1 - pulse.progress, 3)
        const x = node.x + (conn.targetX - node.x) * t
        const y = node.y + (conn.targetY - node.y) * t

        // Calculer le vecteur direction pour le dash
        const dx = conn.targetX - node.x
        const dy = conn.targetY - node.y
        const len = Math.hypot(dx, dy)
        
        if (len === 0) {
          pulse.active = false
          return false
        }
        
        const ux = dx / len
        const uy = dy / len

        // Dessiner un petit dash électrique de 10px
        const dashLength = 10
        
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - ux * dashLength, y - uy * dashLength)
        ctx.strokeStyle = 'rgba(130,190,255,0.95)'
        ctx.lineWidth = 1.4
        ctx.shadowBlur = 25
        ctx.shadowColor = 'rgba(130,190,255,1)'
        ctx.stroke()
        ctx.shadowBlur = 0

        return true
      })

      // 5. DESSINER LE BEAM VERTICAL (SIMPLE LIGNE 2PX)
      if (majorBeamRef.current && majorBeamRef.current.active) {
        const beam = majorBeamRef.current

        // Gestion des phases : fade-in (120ms), hold (200ms), fade-out (250ms)
        if (beam.phase === 'fade-in') {
          beam.progress += 1 / (120 / 16.67) // 120ms à 60fps
          beam.opacity = beam.progress * 0.5 // Max opacity = 0.5
          if (beam.progress >= 1) {
            beam.phase = 'hold'
            beam.progress = 0
          }
        } else if (beam.phase === 'hold') {
          beam.progress += 1 / (200 / 16.67) // 200ms à 60fps
          if (beam.progress >= 1) {
            beam.phase = 'fade-out'
            beam.progress = 0
          }
        } else if (beam.phase === 'fade-out') {
          beam.progress += 1 / (250 / 16.67) // 250ms à 60fps
          beam.opacity = 0.5 * (1 - beam.progress)
          if (beam.progress >= 1) {
            beam.active = false
            majorBeamRef.current = null
          }
        }

        if (beam.active) {
          // Dessiner une simple ligne verticale de 2px
          const centerX = promptRect.left + promptRect.width / 2
          
          ctx.beginPath()
          ctx.moveTo(centerX, promptRect.bottom)
          ctx.lineTo(centerX, canvas.height)
          ctx.strokeStyle = `rgba(80, 150, 255, ${beam.opacity})`
          ctx.lineWidth = 2
          ctx.shadowBlur = 12
          ctx.shadowColor = `rgba(80, 150, 255, ${beam.opacity})`
          ctx.stroke()
          ctx.shadowBlur = 0
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isTyping, promptRef, getClosestPointOnRect])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  )
}
