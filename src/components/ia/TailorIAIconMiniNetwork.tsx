import { useCallback, memo } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

interface TailorIAIconMiniNetworkProps {
  size?: 'sm' | 'md' | 'lg'
  fill?: boolean // Si true, remplit tout l'espace disponible (pour badges)
}

const sizeConfig = {
  sm: { 
    container: 'w-10 h-10', 
    particles: 6, // Divisé par 2 (était 12)
    density: 160,
    distance: 20,
  },
  md: { 
    container: 'w-14 h-14', 
    particles: 9, // Divisé par 2 (était 18)
    density: 250,
    distance: 28,
  },
  lg: { 
    container: 'w-20 h-20', 
    particles: 12, // Divisé par 2 (était 25, arrondi à 12)
    density: 350,
    distance: 40,
  },
}

function TailorIAIconMiniNetworkComponent({ size = 'md', fill = false }: TailorIAIconMiniNetworkProps) {
  const config = sizeConfig[size]

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  // Configuration EXACTEMENT comme PremiumNetwork mais adaptée pour petit conteneur
  const isTyping = false

  // Si fill=true, on utilise w-full h-full au lieu de la taille fixe
  const containerClass = fill 
    ? 'relative w-full h-full bg-[#0d1b2a] overflow-hidden' 
    : `relative ${config.container} rounded-xl border border-[#E1E5EB] bg-[#0d1b2a] overflow-hidden`

  return (
    <div className={containerClass}>
      <Particles
        id={`tailor-ia-mini-${size}`}
        init={particlesInit}
        className="absolute inset-0"
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
        options={{
          background: {
            color: {
              value: '#0d1b2a',
            },
          },
          fpsLimit: 120,
          particles: {
            number: {
              value: config.particles,
              density: {
                enable: false, // Désactivé pour nombre fixe de particules (plus prévisible)
              },
            },
            color: {
              value: '#8bb7ff',
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.95,
              random: false,
            },
            size: {
              value: 2.4,
              random: false,
            },
            links: {
              enable: true,
              distance: 50,
              color: '#8bb7ff',
              opacity: 0.45,
              width: 1.1,
              triangles: {
                enable: false,
              },
            },
            move: {
              enable: true,
              speed: 0.2, // EXACTEMENT comme PremiumNetwork
              direction: 'none',
              random: false, // EXACTEMENT comme PremiumNetwork
              straight: false,
              outModes: {
                default: 'bounce', // bounce pour garder dans le conteneur (différent de 'out' mais nécessaire)
              },
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detectsOn: 'parent',
            events: {
              onHover: {
                enable: false,
              },
              onClick: {
                enable: false,
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
          // Emitters identiques à PremiumNetwork (même timing)
          emitters: [
            {
              direction: 'top',
              rate: {
                quantity: 1,
                delay: 2, // EXACTEMENT comme PremiumNetwork
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
                  speed: 2, // EXACTEMENT comme PremiumNetwork
                  direction: 'bottom',
                  outModes: {
                    default: 'destroy',
                  },
                },
                life: {
                  duration: {
                    value: 3, // EXACTEMENT comme PremiumNetwork
                  },
                },
              },
            },
            {
              direction: 'bottom',
              rate: {
                quantity: 1,
                delay: 2, // EXACTEMENT comme PremiumNetwork
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
                  speed: 2, // EXACTEMENT comme PremiumNetwork
                  direction: 'top',
                  outModes: {
                    default: 'destroy',
                  },
                },
                life: {
                  duration: {
                    value: 3, // EXACTEMENT comme PremiumNetwork
                  },
                },
              },
            },
            {
              direction: 'right',
              rate: {
                quantity: 1,
                delay: 2, // EXACTEMENT comme PremiumNetwork
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
                  speed: 2, // EXACTEMENT comme PremiumNetwork
                  direction: 'right',
                  outModes: {
                    default: 'destroy',
                  },
                },
                life: {
                  duration: {
                    value: 3, // EXACTEMENT comme PremiumNetwork
                  },
                },
              },
            },
            {
              direction: 'left',
              rate: {
                quantity: 1,
                delay: 2, // EXACTEMENT comme PremiumNetwork
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
                  speed: 2, // EXACTEMENT comme PremiumNetwork
                  direction: 'left',
                  outModes: {
                    default: 'destroy',
                  },
                },
                life: {
                  duration: {
                    value: 3, // EXACTEMENT comme PremiumNetwork
                  },
                },
              },
            },
          ],
          detectRetina: true,
        }}
      />
    </div>
  )
}

// Mémoïsation pour éviter les re-renders
const TailorIAIconMiniNetwork = memo(TailorIAIconMiniNetworkComponent)
TailorIAIconMiniNetwork.displayName = 'TailorIAIconMiniNetwork'

export default TailorIAIconMiniNetwork
