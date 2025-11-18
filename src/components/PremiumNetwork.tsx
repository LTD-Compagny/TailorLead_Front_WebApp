import { useCallback, memo, useRef, useEffect } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

// Déclaration des types globaux pour tsParticles
declare global {
  interface Window {
    premiumNetworkNodes?: Array<{
      x: number
      y: number
      links: Array<{ x: number; y: number }>
    }>
  }
}

/**
 * Premium Network Background - Réseau directionnel statique
 * 
 * Ce composant ne re-render JAMAIS pour éviter de redémarrer l'animation.
 * Les effets visuels de typing sont gérés par BackgroundPulseLayer.
 * 
 * Caractéristiques:
 * - Lignes statiques qui ne bougent pas
 * - Animation isolée, ne dépend d'aucun state React
 * - Pulses lumineux subtils en fond continu
 * - Expose les nœuds et liens réels via window.premiumNetworkNodes
 */
function PremiumNetworkComponent() {
  const containerRef = useRef<unknown>(null)
  const intervalRef = useRef<number | null>(null)

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  // Callback appelé quand tsParticles est chargé - MÉTHODE CORRECTE
  const particlesLoaded = useCallback(async (container?: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cont = container as any
    if (!cont || !cont.particles) {
      console.warn("⚠️ PremiumNetwork: container not ready")
      return
    }

    containerRef.current = cont

    const extractNodes = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentContainer = containerRef.current as any
        if (!currentContainer) return

        const particlesArray = currentContainer.particles.array || []
        
        if (particlesArray.length === 0) {
          console.warn("⚠️ PremiumNetwork: No particles in array")
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nodes = particlesArray.map((p: any) => ({
          x: p.position.x,
          y: p.position.y,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          links: (p.links || []).map((l: any) => ({
            x: l.destination?.position?.x || 0,
            y: l.destination?.position?.y || 0,
          })),
        }))

        window.premiumNetworkNodes = nodes
        console.log("🔥 PremiumNetwork: Extracted", nodes.length, "nodes with links")
      } catch (error) {
        console.warn("⚠️ PremiumNetwork: Extraction error", error)
      }
    }

    // Extraction initiale
    extractNodes()

    // Nettoyer l'ancien intervalle s'il existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Mettre à jour périodiquement pour suivre les mouvements des particules
    intervalRef.current = window.setInterval(extractNodes, 1000)
  }, [])

  // Nettoyer l'intervalle lors du démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Configuration statique (ne change jamais)
  const baseOpacity = 0.25
  const linkOpacity = 0.18
  const isTyping = false

  return (
    <Particles
      id="premium-network"
      init={particlesInit}
      loaded={particlesLoaded}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: -10 }}
      options={{
        background: {
          color: {
            value: '#0d1b2a',
          },
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: '#5d7a9a',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: baseOpacity,
            random: false,
          },
          size: {
            value: 2,
            random: { enable: true, minimumValue: 1 },
          },
          links: {
            enable: true,
            distance: 150,
            color: '#5d7a9a',
            opacity: linkOpacity,
            width: 1,
            triangles: {
              enable: false,
            },
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: 'none',
            random: false,
            straight: false,
            outModes: {
              default: 'out',
            },
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detectsOn: 'window',
          events: {
            onHover: {
              enable: true,
              mode: 'grab',
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        // Particules "pulse" qui voyagent vers le centre
        emitters: [
          {
            direction: 'top',
            rate: {
              quantity: 1,
              delay: 2,
            },
            size: {
              width: 100,
              height: 0,
            },
            position: {
              x: 50,
              y: 0,
            },
            particles: {
              color: {
                value: isTyping ? '#7a9bc4' : '#5d7a9a',
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: isTyping ? 4 : 3,
              },
              opacity: {
                value: isTyping ? 0.8 : 0.5,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0,
                  sync: false,
                },
              },
              move: {
                enable: true,
                speed: 2,
                direction: 'bottom',
                outModes: {
                  default: 'destroy',
                },
              },
              life: {
                duration: {
                  value: 3,
                },
              },
            },
          },
          {
            direction: 'bottom',
            rate: {
              quantity: 1,
              delay: 2,
            },
            size: {
              width: 100,
              height: 0,
            },
            position: {
              x: 50,
              y: 100,
            },
            particles: {
              color: {
                value: isTyping ? '#7a9bc4' : '#5d7a9a',
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: isTyping ? 4 : 3,
              },
              opacity: {
                value: isTyping ? 0.8 : 0.5,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0,
                  sync: false,
                },
              },
              move: {
                enable: true,
                speed: 2,
                direction: 'top',
                outModes: {
                  default: 'destroy',
                },
              },
              life: {
                duration: {
                  value: 3,
                },
              },
            },
          },
          {
            direction: 'right',
            rate: {
              quantity: 1,
              delay: 2,
            },
            size: {
              width: 0,
              height: 100,
            },
            position: {
              x: 0,
              y: 50,
            },
            particles: {
              color: {
                value: isTyping ? '#7a9bc4' : '#5d7a9a',
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: isTyping ? 4 : 3,
              },
              opacity: {
                value: isTyping ? 0.8 : 0.5,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0,
                  sync: false,
                },
              },
              move: {
                enable: true,
                speed: 2,
                direction: 'right',
                outModes: {
                  default: 'destroy',
                },
              },
              life: {
                duration: {
                  value: 3,
                },
              },
            },
          },
          {
            direction: 'left',
            rate: {
              quantity: 1,
              delay: 2,
            },
            size: {
              width: 0,
              height: 100,
            },
            position: {
              x: 100,
              y: 50,
            },
            particles: {
              color: {
                value: isTyping ? '#7a9bc4' : '#5d7a9a',
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: isTyping ? 4 : 3,
              },
              opacity: {
                value: isTyping ? 0.8 : 0.5,
                animation: {
                  enable: true,
                  speed: 1,
                  minimumValue: 0,
                  sync: false,
                },
              },
              move: {
                enable: true,
                speed: 2,
                direction: 'left',
                outModes: {
                  default: 'destroy',
                },
              },
              life: {
                duration: {
                  value: 3,
                },
              },
            },
          },
        ],
        detectRetina: true,
      }}
    />
  )
}

// Mémoïsation pour éviter tout re-render (aucune prop acceptée)
const PremiumNetwork = memo(PremiumNetworkComponent)
PremiumNetwork.displayName = 'PremiumNetwork'

export default PremiumNetwork

