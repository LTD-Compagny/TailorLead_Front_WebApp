import { useEffect, useRef, useCallback } from 'react'

type BrainMode = 'idle' | 'typing' | 'search'

interface LinkPulse {
  id: number
  nodeIndex: number
  linkIndex: number
  progress: number
  active: boolean
  loopCount: number // Nombre de fois que le pulse a parcouru le lien
  flashPhase: number // Phase du flash (0-1) pour l'effet éclair
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
  const coreNodeIndicesRef = useRef<number[]>([])
  const majorBeamRef = useRef<MajorBeamEffect | null>(null)
  const nextIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const nodesCacheRef = useRef<Array<{ x: number; y: number; links: Array<{ x: number; y: number }> }>>([])
  const lastLinkPulseTimeRef = useRef<number>(0)
  const searchModeStartRef = useRef<number>(0)

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
      majorBeamRef.current = null
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
        // Augmenter le nombre max de pulses, surtout en mode typing
        const maxPulses = mode === 'typing' ? 80 : 40
        
        if (linkPulsesRef.current.filter(p => p.active).length < maxPulses) {
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
              loopCount: 0,
              flashPhase: 0, // Commence avec un flash intense
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

        // Vitesse du pulse (plus rapide en mode typing)
        const speed = mode === 'typing' ? 0.015 : 0.01
        pulse.progress += speed

        // Boucler le pulse au lieu de le supprimer (surtout en mode typing)
        if (pulse.progress >= 1) {
          if (mode === 'typing') {
            // En mode typing, faire boucler le pulse plusieurs fois
            pulse.loopCount++
            pulse.progress = 0
            pulse.flashPhase = 0 // Nouveau flash à chaque loop
            // Continuer jusqu'à ce que l'utilisateur arrête de taper (géré par le mode)
          } else {
            // En mode idle/search, supprimer après quelques loops
            if (pulse.loopCount >= 2) {
              pulse.active = false
              return false
            } else {
              pulse.loopCount++
              pulse.progress = 0
              pulse.flashPhase = 0
            }
          }
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

        // Effet éclair (flash) : très brillant au début puis moins brillant
        // flashPhase augmente avec le progress pour créer l'effet de fade
        pulse.flashPhase = Math.min(1, pulse.progress * 2) // Flash rapide au début
        
        // Calcul de la luminosité : très brillant (1.0) au début, puis fade vers 0.4
        const flashBrightness = mode === 'typing' 
          ? 1.0 - (pulse.flashPhase * 0.6) // De 1.0 à 0.4 en mode typing
          : 0.95 - (pulse.flashPhase * 0.5) // De 0.95 à 0.45 en mode idle
        
        // Taille et luminosité basées sur le mode
        let dashLength = mode === 'typing' ? 12 : 10
        let shadowBlur = mode === 'typing' ? 35 : 25

        if (mode === 'search') {
          dashLength = 14
          shadowBlur = 40
        }

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - ux * dashLength, y - uy * dashLength)
        ctx.strokeStyle = `rgba(130,190,255,${flashBrightness})`
        ctx.lineWidth = mode === 'typing' ? 2.0 : 1.4
        ctx.shadowBlur = shadowBlur * flashBrightness
        ctx.shadowColor = `rgba(130,190,255,${flashBrightness})`
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
