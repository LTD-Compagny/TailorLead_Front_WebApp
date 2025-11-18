import { useEffect, useRef, useCallback } from 'react'

interface PulseParticle {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  progress: number
  opacity: number
  active: boolean
}

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

interface OrbitalPulse {
  id: number
  angle: number // Angle en degrés (0-360)
  radius: number // Rayon de l'orbite
  speed: number // Vitesse de rotation en degrés/frame
  opacity: number
  active: boolean
  centerX: number // Centre X du prompt
  centerY: number // Centre Y du prompt
}

interface BeamEffect {
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
  }
}

/**
 * BackgroundPulseLayer - Ultimate Neural Background (CORRIGÉ)
 * 
 * Corrections:
 * - Les pulses partent VRAIMENT des positions réelles des particules tsParticles
 * - Les pulses orbitaux tournent VRAIMENT en cercle autour du prompt
 */
export default function BackgroundPulseLayer({ isTyping, promptRef }: BackgroundPulseLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<PulseParticle[]>([])
  const linkGlowsRef = useRef<LinkGlow[]>([])
  const orbitalsRef = useRef<OrbitalPulse[]>([])
  const beamRef = useRef<BeamEffect | null>(null)
  const nextIdRef = useRef(0)
  const animationFrameRef = useRef<number>()
  const lastTypingRef = useRef(false)
  const nodesCacheRef = useRef<Array<{ x: number; y: number; links: Array<{ x: number; y: number }> }>>([])

  // Mettre à jour le cache des nœuds périodiquement
  useEffect(() => {
    const updateNodes = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nodes = (window as any).premiumNetworkNodes
      if (nodes && nodes.length > 0) {
        nodesCacheRef.current = nodes
        console.log('✅ Nodes updated:', nodes.length)
      }
    }

    const interval = setInterval(updateNodes, 500)
    return () => clearInterval(interval)
  }, [])

  // Fonction pour illuminer les liens autour d'un nœud
  const illuminateLinksAround = (node: { x: number; y: number; links: Array<{ x: number; y: number }> }) => {
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
  }

  // Fonction pour générer des pulses depuis les VRAIS nœuds tsParticles
  const generatePulses = useCallback(() => {
    if (!promptRef.current || !canvasRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = nodesCacheRef.current.length > 0 ? nodesCacheRef.current : (window as any).premiumNetworkNodes
    if (!nodes || nodes.length === 0) {
      console.warn('⚠️ No nodes available')
      return
    }

    // Limiter à 2 pulses actifs maximum
    const activePulses = particlesRef.current.filter(p => p.active).length
    if (activePulses >= 2) return

    const promptRect = promptRef.current.getBoundingClientRect()
    const count = Math.floor(Math.random() * 2) + 1 // 1-2 pulses

    for (let i = 0; i < count; i++) {
      // Choisir un nœud aléatoire parmi les vrais nœuds tsParticles
      const startNode = nodes[Math.floor(Math.random() * nodes.length)]
      
      // DEBUG: Vérifier que le nœud a des coordonnées valides
      if (!startNode || startNode.x === undefined || startNode.y === undefined) {
        console.warn('⚠️ Invalid node:', startNode)
        continue
      }

      console.log('📍 Pulse from node:', startNode.x, startNode.y)
      
      // Illuminer les liens autour de ce nœud
      illuminateLinksAround(startNode)

      // Utiliser DIRECTEMENT les coordonnées du nœud (déjà dans le système de coordonnées du canvas)
      const startX = startNode.x
      const startY = startNode.y

      // Point d'arrivée sur le prompt
      const side = Math.floor(Math.random() * 4)
      let endX = promptRect.left + promptRect.width / 2
      let endY = promptRect.top + promptRect.height / 2

      switch (side) {
        case 0: // top
          endX = promptRect.left + Math.random() * promptRect.width
          endY = promptRect.top
          break
        case 1: // right
          endX = promptRect.right
          endY = promptRect.top + Math.random() * promptRect.height
          break
        case 2: // bottom
          endX = promptRect.left + Math.random() * promptRect.width
          endY = promptRect.bottom
          break
        case 3: // left
          endX = promptRect.left
          endY = promptRect.top + Math.random() * promptRect.height
          break
      }

      particlesRef.current.push({
        id: nextIdRef.current++,
        startX,
        startY,
        endX,
        endY,
        progress: 0,
        opacity: 0.3,
        active: true,
      })
    }
  }, [promptRef])

  // Fonction pour déclencher un "major pulse" (appelée sur Enter)
  const triggerMajorPulse = useCallback(() => {
    if (!promptRef.current || !canvasRef.current) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = nodesCacheRef.current.length > 0 ? nodesCacheRef.current : (window as any).premiumNetworkNodes
    if (!nodes || nodes.length === 0) return

    const promptRect = promptRef.current.getBoundingClientRect()
    const pulsesToCreate = Math.floor(Math.random() * 6) + 3 // 3-8 pulses

    for (let i = 0; i < pulsesToCreate; i++) {
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      
      if (!node || node.x === undefined || node.y === undefined) continue

      // Illuminer les liens
      illuminateLinksAround(node)

      // Point d'arrivée sur le prompt
      const side = Math.floor(Math.random() * 4)
      let endX = promptRect.left + promptRect.width / 2
      let endY = promptRect.top + promptRect.height / 2

      switch (side) {
        case 0:
          endX = promptRect.left + Math.random() * promptRect.width
          endY = promptRect.top
          break
        case 1:
          endX = promptRect.right
          endY = promptRect.top + Math.random() * promptRect.height
          break
        case 2:
          endX = promptRect.left + Math.random() * promptRect.width
          endY = promptRect.bottom
          break
        case 3:
          endX = promptRect.left
          endY = promptRect.top + Math.random() * promptRect.height
          break
      }

      particlesRef.current.push({
        id: nextIdRef.current++,
        startX: node.x,
        startY: node.y,
        endX,
        endY,
        progress: 0,
        opacity: 0.25,
        active: true,
      })
    }

    // Déclencher le beam après un court délai
    setTimeout(() => {
      beamRef.current = {
        progress: 0,
        opacity: 0,
        active: true,
        phase: 'fade-in',
      }
    }, 400)
  }, [promptRef])

  // Exposer la fonction globalement
  useEffect(() => {
    window.triggerMajorPulse = triggerMajorPulse
    console.log('✅ BackgroundPulseLayer: triggerMajorPulse exposed')
    
    return () => {
      delete window.triggerMajorPulse
    }
  }, [triggerMajorPulse])

  // Générer des pulses quand l'utilisateur tape
  useEffect(() => {
    if (isTyping && !lastTypingRef.current && promptRef.current) {
      generatePulses()
    }
    lastTypingRef.current = isTyping
  }, [isTyping, promptRef, generatePulses])

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

        // Dessiner le lien lumineux
        ctx.beginPath()
        ctx.moveTo(glow.fromX, glow.fromY)
        ctx.lineTo(glow.toX, glow.toY)
        ctx.strokeStyle = `rgba(58, 163, 255, ${opacity})`
        ctx.lineWidth = 1.5
        ctx.shadowBlur = 10
        ctx.shadowColor = `rgba(58, 163, 255, ${opacity})`
        ctx.stroke()
        ctx.shadowBlur = 0

        return true
      })

      // 2. DESSINER LES PULSES
      particlesRef.current = particlesRef.current.filter((particle) => {
        if (!particle.active) return false

        particle.progress += 0.012

        // Convertir en orbital à 95% de progression
        if (particle.progress >= 0.95 && isTyping && orbitalsRef.current.length < 2 && promptRect) {
          // Calculer le centre et le rayon pour l'orbite
          const centerX = promptRect.left + promptRect.width / 2
          const centerY = promptRect.top + promptRect.height / 2
          // Rayon qui englobe le rectangle (diagonale / 2 + marge)
          const radius = Math.max(promptRect.width, promptRect.height) / 2 + 30

          // Angle initial basé sur la position actuelle du pulse
          const dx = particle.endX - centerX
          const dy = particle.endY - centerY
          const initialAngle = Math.atan2(dy, dx) * (180 / Math.PI)

          orbitalsRef.current.push({
            id: nextIdRef.current++,
            angle: initialAngle,
            radius,
            speed: 0.5 + Math.random() * 0.3, // 0.5-0.8 degrés par frame (rotation lente et fluide)
            opacity: 0.2,
            active: true,
            centerX,
            centerY,
          })
        }

        if (particle.progress >= 1) {
          particle.active = false
          return false
        }

        // Easing power2.out
        const easedProgress = 1 - Math.pow(1 - particle.progress, 3)
        const x = particle.startX + (particle.endX - particle.startX) * easedProgress
        const y = particle.startY + (particle.endY - particle.startY) * easedProgress

        // Fade out progressif
        const opacity = particle.progress > 0.8
          ? particle.opacity * (1 - (particle.progress - 0.8) / 0.2)
          : particle.opacity

        // Dessiner le pulse
        ctx.beginPath()
        ctx.arc(x, y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(58, 163, 255, ${Math.min(opacity, 0.35)})`
        ctx.shadowBlur = 12
        ctx.shadowColor = `rgba(58, 163, 255, ${opacity})`
        ctx.fill()
        ctx.shadowBlur = 0

        return true
      })

      // 3. DESSINER LES PULSES ORBITAUX (CORRIGÉ - vraie orbite circulaire)
      if (promptRect) {
        orbitalsRef.current = orbitalsRef.current.filter((orbital) => {
          if (!orbital.active) return false

          // Fade out quand on arrête de taper
          if (!isTyping) {
            orbital.opacity -= 0.01
            if (orbital.opacity <= 0) {
              orbital.active = false
              return false
            }
          }

          // Mise à jour de l'angle (rotation continue)
          orbital.angle += orbital.speed
          
          // Normaliser l'angle entre 0 et 360
          if (orbital.angle >= 360) orbital.angle -= 360
          if (orbital.angle < 0) orbital.angle += 360

          // Calculer la position sur le cercle (ORBITE VRAIE)
          const rad = (orbital.angle * Math.PI) / 180
          const x = orbital.centerX + Math.cos(rad) * orbital.radius
          const y = orbital.centerY + Math.sin(rad) * orbital.radius

          // Dessiner le pulse orbital
          ctx.beginPath()
          ctx.arc(x, y, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(58, 163, 255, ${Math.min(orbital.opacity, 0.25)})`
          ctx.shadowBlur = 8
          ctx.shadowColor = `rgba(58, 163, 255, ${orbital.opacity})`
          ctx.fill()
          ctx.shadowBlur = 0

          return true
        })
      }

      // 4. DESSINER LE BEAM DESCENDANT
      if (beamRef.current && beamRef.current.active && promptRect) {
        const beam = beamRef.current

        // Gestion des phases
        if (beam.phase === 'fade-in') {
          beam.progress += 0.05 // 150ms à 60fps
          beam.opacity = beam.progress * 0.25
          if (beam.progress >= 1) {
            beam.phase = 'hold'
            beam.progress = 0
          }
        } else if (beam.phase === 'hold') {
          beam.progress += 0.05
          if (beam.progress >= 1) {
            beam.phase = 'fade-out'
            beam.progress = 0
          }
        } else if (beam.phase === 'fade-out') {
          beam.progress += 0.025 // 300ms à 60fps
          beam.opacity = 0.25 * (1 - beam.progress)
          if (beam.progress >= 1) {
            beam.active = false
            beamRef.current = null
          }
        }

        if (beam.active) {
          // Dessiner le beam vertical
          const gradient = ctx.createLinearGradient(
            promptRect.left + promptRect.width / 2,
            promptRect.bottom,
            promptRect.left + promptRect.width / 2,
            canvas.height
          )
          gradient.addColorStop(0, `rgba(58, 163, 255, ${beam.opacity})`)
          gradient.addColorStop(0.5, `rgba(58, 163, 255, ${beam.opacity * 0.6})`)
          gradient.addColorStop(1, `rgba(58, 163, 255, 0)`)

          ctx.beginPath()
          ctx.moveTo(promptRect.left + 20, promptRect.bottom)
          ctx.lineTo(promptRect.right - 20, promptRect.bottom)
          ctx.lineTo(promptRect.left + promptRect.width / 2 + 100, canvas.height)
          ctx.lineTo(promptRect.left + promptRect.width / 2 - 100, canvas.height)
          ctx.closePath()
          ctx.fillStyle = gradient
          ctx.shadowBlur = 14
          ctx.shadowColor = `rgba(58, 163, 255, ${beam.opacity})`
          ctx.fill()
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
  }, [isTyping, promptRef])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -5 }}
    />
  )
}
