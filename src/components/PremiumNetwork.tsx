import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

interface PremiumNetworkProps {
  pulseSpeed?: number
}

/**
 * Premium Network Background - Réseau directionnel convergeant vers le centre
 * 
 * Caractéristiques:
 * - Lignes qui convergent vers le prompt central
 * - Pulses lumineux qui voyagent le long des lignes vers le centre
 * - Animation élégante et subtile (style M&A corporate)
 * - Vitesse des pulses ajustable (augmente quand l'utilisateur tape)
 */
export default function PremiumNetwork({ pulseSpeed = 1 }: PremiumNetworkProps) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  // Quand l'utilisateur tape (pulseSpeed > 1), augmenter l'opacité et l'attraction
  const isTyping = pulseSpeed > 1
  const baseOpacity = isTyping ? 0.35 : 0.25
  const linkOpacity = isTyping ? 0.3 : 0.18

  return (
    <Particles
      id="premium-network"
      init={particlesInit}
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
            value: isTyping ? '#7a9bc4' : '#5d7a9a',
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
            color: isTyping ? '#7a9bc4' : '#5d7a9a',
            opacity: linkOpacity,
            width: 1,
            triangles: {
              enable: false,
            },
          },
          move: {
            enable: true,
            speed: 0.2 * pulseSpeed,
            direction: 'none',
            random: false,
            straight: isTyping,
            outModes: {
              default: 'out',
            },
            attract: {
              enable: isTyping,
              rotateX: 1200,
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
              delay: 2 / pulseSpeed,
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
                speed: 2 * pulseSpeed,
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
              delay: 2 / pulseSpeed,
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
                speed: 2 * pulseSpeed,
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
              delay: 2 / pulseSpeed,
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
                speed: 2 * pulseSpeed,
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
              delay: 2 / pulseSpeed,
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
                speed: 2 * pulseSpeed,
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

