import { useEffect, useRef, useCallback } from 'react'

type BrainMode = 'idle' | 'typing' | 'search'

interface LinkPulse {
  id: number
  nodeIndex: number
  linkIndex: number
  progress: number
  active: boolean
}

interface PathPulse {
  id: number
  nodeIndex: number
  progress: number
  active: boolean
}

interface MajorBeamEffect {
  progress: number
  opacity: number
  active: boolean
  phase: 'contour' | 'vertical'
  contourProgress: number
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
    searchInputLength?: number
  }
}

/**
 * BackgroundPulseLayer - 3-State Neural System
 * 
 * IDLE: Calm electric pulses along existing tsParticles links
 * TYPING: Same pulses but brighter and more frequent
 * SEARCH: Core clusters activate and shoot data into prompt + vertical beam
 */
export default function BackgroundPulseLayer({ isTyping, promptRef }: BackgroundPulseLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const brainModeRef = useRef<BrainMode>('idle')
  const linkPulsesRef = useRef<LinkPulse[]>([])
  const pathPulsesRef = useRef<PathPulse[]>([])
  const coreNodeIndicesRef = useRef<number[]>([])
  const majorBeamRef = useRef<MajorBeamEffect | null>(null)
  const nextIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const nodesCacheRef = useRef<Array<{ x: number; y: number; links: Array<{ x: number; y: number }> }>>([])
  const lastLinkPulseTimeRef = useRef<number>(0)
  const lastPathPulseTimeRef = useRef<number>(0)
  const searchModeStartRef = useRef<number>(0)
  const recentlyUsedNodesRef = useRef<number[]>([]) // Pour éviter les paquets

  // Identifier les 4-6 core nodes UNE SEULE FOIS
  useEffect(() => {
    const updateNodes = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodes = (window as any).premiumNetworkNodes
      if (nodes && nodes.length > 0) {
        nodesCacheRef.current = nodes

        // Identifier les core nodes (4-6 nœuds avec le plus de liens) UNE SEULE FOIS
        if (coreNodeIndicesRef.current.length === 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const nodeDegrees = nodes.map((node: any, index: number) => ({
            index,
            degree: node.links ? node.links.length : 0
          }))

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          nodeDegrees.sort((a: any, b: any) => b.degree - a.degree)

          const coreCount = Math.min(6, Math.max(4, Math.floor(nodes.length * 0.05)))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          coreNodeIndicesRef.current = nodeDegrees.slice(0, coreCount).map((n: any) => n.index)

          console.log('🔥 Core nodes identified:', coreNodeIndicesRef.current.length, 'nodes')
        }
      }
    }

    const interval = setInterval(updateNodes, 500)
    return () => clearInterval(interval)
  }, [])

  // Calculer le point le plus proche sur le rectangle du prompt
  const getClosestPointOnRect = useCallback((nodeX: number, nodeY: number, promptRect: DOMRect): { x: number; y: number } => {
    const x = Math.max(promptRect.left, Math.min(promptRect.right, nodeX))
    const y = Math.max(promptRect.top, Math.min(promptRect.bottom, nodeY))

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

  // Fonction pour déclencher le mode SEARCH
  const triggerMajorPulse = useCallback(() => {
    if (!promptRef.current) return

    brainModeRef.current = 'search'
    searchModeStartRef.current = Date.now()
    
    // Déclencher le beam progressif (contour puis vertical)
    majorBeamRef.current = {
      progress: 0,
      opacity: 0.6,
      active: true,
      phase: 'contour',
      contourProgress: 0,
    }

    // Retour au mode IDLE après la recherche (2s)
    setTimeout(() => {
      brainModeRef.current = 'idle'
      // Nettoyer les PathPulses actifs
      pathPulsesRef.current = []
      recentlyUsedNodesRef.current = []
    }, 1000)
    
    console.log('⚡ SEARCH mode activated')
  }, [promptRef])

  const triggerMinorPulse = useCallback(() => {
    // Cette fonction n'est plus utilisée, mais on la garde pour compatibilité
  }, [])

  // Exposer les fonctions globalement
  useEffect(() => {
    window.triggerMajorPulse = triggerMajorPulse
    window.triggerMinorPulse = triggerMinorPulse
    
    return () => {
      delete window.triggerMajorPulse
      delete window.triggerMinorPulse
    }
  }, [triggerMajorPulse, triggerMinorPulse])

  // Gérer le mode brain en fonction de isTyping
  useEffect(() => {
    if (brainModeRef.current !== 'search') {
      brainModeRef.current = isTyping ? 'typing' : 'idle'
    }
  }, [isTyping])

  // Gérer le reset quand l'utilisateur arrête de taper
  useEffect(() => {
    if (!isTyping && brainModeRef.current !== 'search') {
      linkPulsesRef.current = []
      pathPulsesRef.current = []
      majorBeamRef.current = null
      recentlyUsedNodesRef.current = []
    }
  }, [isTyping])

  // Animation loop principale
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

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

      const now = Date.now()
      const mode = brainModeRef.current

      // ═══════════════════════════════════════════════════════════
      // 1. ÉMETTRE LES LINK PULSES (basé sur le mode)
      // ═══════════════════════════════════════════════════════════

      let linkPulseInterval = 400 // default
      if (mode === 'idle') {
        linkPulseInterval = 300 + Math.random() * 200 // 300-500ms
      } else if (mode === 'typing') {
        linkPulseInterval = 150 + Math.random() * 150 // 150-300ms
      } else if (mode === 'search') {
        linkPulseInterval = 80 + Math.random() * 40 // 80-120ms
      }

      if (now - lastLinkPulseTimeRef.current > linkPulseInterval) {
        if (linkPulsesRef.current.filter(p => p.active).length < 40) {
          // Choisir un nœud aléatoire
          const randomNodeIndex = Math.floor(Math.random() * nodes.length)
          const node = nodes[randomNodeIndex]
          
          if (node && node.links && node.links.length > 0) {
            // Choisir un lien aléatoire
            const randomLinkIndex = Math.floor(Math.random() * node.links.length)
            
            linkPulsesRef.current.push({
              id: nextIdRef.current++,
              nodeIndex: randomNodeIndex,
              linkIndex: randomLinkIndex,
              progress: 0,
              active: true,
            })
          }
        }
        
        lastLinkPulseTimeRef.current = now
      }

      // ═══════════════════════════════════════════════════════════
      // 2. DESSINER LES LINK PULSES (petits dash électriques)
      // ═══════════════════════════════════════════════════════════

      linkPulsesRef.current = linkPulsesRef.current.filter(pulse => {
        if (!pulse.active) return false

        const node = nodes[pulse.nodeIndex]
        if (!node || !node.links || !node.links[pulse.linkIndex]) {
          pulse.active = false
          return false
        }

        pulse.progress += 0.01

        if (pulse.progress >= 1) {
          pulse.active = false
          return false
        }

        const link = node.links[pulse.linkIndex]
        
        // TYPING MODE: Highlight the link line
        if (mode === 'typing') {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(link.x, link.y)
          ctx.strokeStyle = 'rgba(130,190,255,0.12)'
          ctx.lineWidth = 1
          ctx.stroke()
        }
        
        // Interpolation avec easing
        const t = 1 - Math.pow(1 - pulse.progress, 3)
        const x = node.x + (link.x - node.x) * t
        const y = node.y + (link.y - node.y) * t

        // Vecteur direction
        const dx = link.x - node.x
        const dy = link.y - node.y
        const len = Math.hypot(dx, dy)
        
        if (len === 0) {
          pulse.active = false
          return false
        }
        
        const ux = dx / len
        const uy = dy / len

        // Taille et luminosité basées sur le mode
        let dashLength = 10
        let brightness = 0.95
        let shadowBlur = 25

        if (mode === 'search') {
          dashLength = 12
          brightness = 1
          shadowBlur = 30
        }

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - ux * dashLength, y - uy * dashLength)
        ctx.strokeStyle = `rgba(130,190,255,${brightness})`
        ctx.lineWidth = 1.4
        ctx.shadowBlur = shadowBlur
        ctx.shadowColor = `rgba(130,190,255,${brightness})`
        ctx.stroke()
        ctx.shadowBlur = 0

        return true
      })

      // ═══════════════════════════════════════════════════════════
      // 3. ÉMETTRE DES PATH PULSES (basé sur longueur de recherche en TYPING)
      // ═══════════════════════════════════════════════════════════

      if (mode === 'typing' && coreNodeIndicesRef.current.length > 0) {
        // Récupérer la longueur du texte de recherche
        const searchLength = window.searchInputLength || 0
        
        if (searchLength > 0) {
          // Plus le texte est long, plus on émet de pulses et plus ils sont rapides
          const baseInterval = 400 - (searchLength * 15)
          const pathInterval = Math.max(80, baseInterval) + Math.random() * 50
          
          const maxPulses = Math.min(3 + Math.floor(searchLength / 3), 15)
          
          if (now - lastPathPulseTimeRef.current > pathInterval) {
            if (pathPulsesRef.current.filter(p => p.active).length < maxPulses) {
              // Choisir un nœud qui n'a PAS été utilisé récemment pour éviter les paquets
              const availableNodes = coreNodeIndicesRef.current.filter(
                idx => !recentlyUsedNodesRef.current.includes(idx)
              )
              
              // Si tous les nœuds ont été utilisés récemment, réinitialiser
              const nodesToChooseFrom = availableNodes.length > 0 
                ? availableNodes 
                : coreNodeIndicesRef.current
              
              const randomCoreIndex = nodesToChooseFrom[
                Math.floor(Math.random() * nodesToChooseFrom.length)
              ]
              
              // Ajouter à la liste des nœuds récemment utilisés
              recentlyUsedNodesRef.current.push(randomCoreIndex)
              
              // Limiter la taille de l'historique à 3 nœuds
              if (recentlyUsedNodesRef.current.length > 3) {
                recentlyUsedNodesRef.current.shift()
              }
              
              pathPulsesRef.current.push({
                id: nextIdRef.current++,
                nodeIndex: randomCoreIndex,
                progress: 0,
                active: true,
              })
            }
            
            lastPathPulseTimeRef.current = now
          }
        }
      }
      
      // MODE SEARCH: émettre beaucoup de pulses (effet intensif)
      if (mode === 'search' && coreNodeIndicesRef.current.length > 0) {
        const searchElapsed = now - searchModeStartRef.current
        
        // Émettre pendant toute la durée du mode search (2 secondes)
        if (searchElapsed < 2000) {
          const pathInterval = 60 + Math.random() * 40 // Très rapide
          
          if (now - lastPathPulseTimeRef.current > pathInterval) {
            const maxPulses = 25 // Beaucoup de pulses simultanés
            
            if (pathPulsesRef.current.filter(p => p.active).length < maxPulses) {
              // Choisir un nœud différent
              const availableNodes = coreNodeIndicesRef.current.filter(
                idx => !recentlyUsedNodesRef.current.includes(idx)
              )
              
              const nodesToChooseFrom = availableNodes.length > 0 
                ? availableNodes 
                : coreNodeIndicesRef.current
              
              const randomCoreIndex = nodesToChooseFrom[
                Math.floor(Math.random() * nodesToChooseFrom.length)
              ]
              
              recentlyUsedNodesRef.current.push(randomCoreIndex)
              if (recentlyUsedNodesRef.current.length > 3) {
                recentlyUsedNodesRef.current.shift()
              }
              
              pathPulsesRef.current.push({
                id: nextIdRef.current++,
                nodeIndex: randomCoreIndex,
                progress: 0,
                active: true,
              })
            }
            
            lastPathPulseTimeRef.current = now
          }
        }
      }

      // ═══════════════════════════════════════════════════════════
      // 4. DESSINER LES PATH PULSES (core nodes → prompt)
      // ═══════════════════════════════════════════════════════════

      pathPulsesRef.current = pathPulsesRef.current.filter(pulse => {
        if (!pulse.active) return false

        const node = nodes[pulse.nodeIndex]
        if (!node || node.x === undefined || node.y === undefined) {
          pulse.active = false
          return false
        }

        // Vitesse basée sur la longueur du texte (plus long = plus rapide)
        const searchLength = window.searchInputLength || 0
        const speedMultiplier = mode === 'typing' ? Math.min(1 + searchLength / 20, 2.5) : 1
        pulse.progress += 0.006 * speedMultiplier

        if (pulse.progress >= 1) {
          pulse.active = false
          return false
        }

        // Calculer le point cible sur le prompt (utiliser position RÉELLE du nœud)
        const startX = node.x
        const startY = node.y
        const target = getClosestPointOnRect(startX, startY, promptRect)
        const endX = target.x
        const endY = target.y

        // Delta direction
        const deltaX = endX - startX
        const deltaY = endY - startY
        
        if (Math.hypot(deltaX, deltaY) === 0) {
          pulse.active = false
          return false
        }

        // Dessiner un segment représentant 20-25% du chemin total
        const SEGMENT_LENGTH = 0.25
        const oldProgress = Math.max(0, pulse.progress - SEGMENT_LENGTH)
        const newProgress = pulse.progress

        // Easing pour les deux positions
        const oldEased = 1 - Math.pow(1 - oldProgress, 3)
        const newEased = 1 - Math.pow(1 - newProgress, 3)

        // Positions du segment
        const oldX = startX + deltaX * oldEased
        const oldY = startY + deltaY * oldEased
        const newX = startX + deltaX * newEased
        const newY = startY + deltaY * newEased

        // Dessiner le segment de ligne
        ctx.beginPath()
        ctx.moveTo(oldX, oldY)
        ctx.lineTo(newX, newY)
        ctx.strokeStyle = 'rgba(120,200,255,0.95)'
        ctx.lineWidth = 2
        ctx.shadowBlur = 18
        ctx.shadowColor = 'rgba(120,200,255,1)'
        ctx.stroke()
        ctx.shadowBlur = 0

        return true
      })

      // ═══════════════════════════════════════════════════════════
      // 5. BEAM PROGRESSIF (contour du prompt puis vertical)
      // ═══════════════════════════════════════════════════════════

      if (majorBeamRef.current && majorBeamRef.current.active) {
        const beam = majorBeamRef.current
        
        // Calculer le périmètre du prompt
        const perimeterPoints: Array<{x: number, y: number}> = []
        const numPoints = 80 // Nombre de points sur le contour
        const top = promptRect.top
        const bottom = promptRect.bottom
        const left = promptRect.left
        const right = promptRect.right
        const width = promptRect.width
        const height = promptRect.height
        
        // Créer le chemin: haut gauche → droite → bas droite → gauche → haut gauche
        // Top edge (gauche à droite)
        for (let i = 0; i <= numPoints/4; i++) {
          const t = i / (numPoints/4)
          perimeterPoints.push({ x: left + width * t, y: top })
        }
        // Right edge (haut en bas)
        for (let i = 0; i <= numPoints/4; i++) {
          const t = i / (numPoints/4)
          perimeterPoints.push({ x: right, y: top + height * t })
        }
        // Bottom edge (droite à gauche)
        for (let i = 0; i <= numPoints/4; i++) {
          const t = i / (numPoints/4)
          perimeterPoints.push({ x: right - width * t, y: bottom })
        }
        // Left edge (bas en haut)
        for (let i = 0; i <= numPoints/4; i++) {
          const t = i / (numPoints/4)
          perimeterPoints.push({ x: left, y: bottom - height * t })
        }

        if (beam.phase === 'contour') {
          // Phase 1: Parcourir le contour
          beam.contourProgress += 0.04 // Vitesse du parcours
          
          if (beam.contourProgress >= 1) {
            beam.phase = 'vertical'
            beam.progress = 0
          }
          
          // Dessiner plusieurs traits le long du contour (effet de paquet)
          const numTrails = 8 // Nombre de traits dans le paquet
          for (let i = 0; i < numTrails; i++) {
            const offset = i * 0.03 // Espacement entre les traits
            const trailProgress = Math.max(0, Math.min(1, beam.contourProgress - offset))
            
            if (trailProgress > 0) {
              const pointIndex = Math.floor(trailProgress * (perimeterPoints.length - 1))
              const nextIndex = Math.min(pointIndex + 1, perimeterPoints.length - 1)
              
              if (pointIndex < perimeterPoints.length) {
                const p1 = perimeterPoints[pointIndex]
                const p2 = perimeterPoints[nextIndex]
                
                // Fade out pour les traits plus anciens
                const opacity = beam.opacity * (1 - i / numTrails) * 0.8
                
                ctx.beginPath()
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.strokeStyle = `rgba(80, 150, 255, ${opacity})`
                ctx.lineWidth = 2
                ctx.shadowBlur = 15
                ctx.shadowColor = `rgba(80, 150, 255, ${opacity})`
                ctx.stroke()
                ctx.shadowBlur = 0
              }
            }
          }
        } else if (beam.phase === 'vertical') {
          // Phase 2: Traits verticaux vers le bas
          beam.progress += 0.015
          
          if (beam.progress >= 1) {
            beam.active = false
            majorBeamRef.current = null
          }
          
          // Créer plusieurs traits verticaux espacés
          const centerX = promptRect.left + promptRect.width / 2
          const beamCount = 6
          const spacing = 8
          const totalWidth = (beamCount - 1) * spacing
          const startX = centerX - totalWidth / 2
          
          for (let i = 0; i < beamCount; i++) {
            const x = startX + i * spacing
            
            // Chaque trait démarre avec un léger délai
            const delay = i * 0.08
            const adjustedProgress = Math.max(0, beam.progress - delay)
            
            if (adjustedProgress > 0) {
              const maxLength = canvas.height - promptRect.bottom
              const currentLength = maxLength * Math.min(1, adjustedProgress * 1.5)
              
              const opacity = beam.opacity * (1 - adjustedProgress * 0.5)
              
              ctx.beginPath()
              ctx.moveTo(x, promptRect.bottom)
              ctx.lineTo(x, promptRect.bottom + currentLength)
              ctx.strokeStyle = `rgba(80, 150, 255, ${opacity})`
              ctx.lineWidth = 2
              ctx.shadowBlur = 12
              ctx.shadowColor = `rgba(80, 150, 255, ${opacity})`
              ctx.stroke()
              ctx.shadowBlur = 0
            }
          }
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
