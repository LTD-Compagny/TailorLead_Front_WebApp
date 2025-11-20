import { useCallback, memo } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

interface TailorIAIconMiniNetworkProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  fill?: boolean // Si true, remplit tout l'espace disponible (pour badges)
}

const sizeConfig = {
  xs: { 
    container: 'w-6 h-6', 
    particles: 12, // Moins de particules pour très petits badges
    density: 100,
    distance: 80, // Distance liens réduite pour petits espaces
    linkWidth: 0.8, // Traits plus fins
    particleSize: 1.5, // Points plus petits
    particleOpacity: 0.5, // Légèrement plus visible
    linkOpacity: 0.35, // Légèrement plus visible
  },
  sm: { 
    container: 'w-10 h-10', 
    particles: 20, // Réduit pour petits badges
    density: 160,
    distance: 100, // Distance liens réduite
    linkWidth: 0.9,
    particleSize: 1.8,
    particleOpacity: 0.45,
    linkOpacity: 0.32,
  },
  md: { 
    container: 'w-14 h-14', 
    particles: 30, // Réduit pour badges moyens
    density: 250,
    distance: 120, // Distance liens légèrement réduite
    linkWidth: 1,
    particleSize: 2,
    particleOpacity: 0.4,
    linkOpacity: 0.3,
  },
  lg: { 
    container: 'w-20 h-20', 
    particles: 40, // Paramètres de la landing page
    density: 350,
    distance: 150, // Distance liens de la landing page
    linkWidth: 1,
    particleSize: 2,
    particleOpacity: 0.4,
    linkOpacity: 0.3,
  },
}

function TailorIAIconMiniNetworkComponent({ size = 'md', fill = false }: TailorIAIconMiniNetworkProps) {
  const config = sizeConfig[size]
  
  // Pour les très petits badges (xs), on désactive les emitters pour éviter la surcharge
  const useEmitters = size !== 'xs'

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
              value: '#6d8ab0', // Couleur légèrement plus claire pour meilleure visibilité
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: config.particleOpacity,
              random: false,
            },
            size: {
              value: config.particleSize,
              random: size !== 'xs' ? { enable: true, minimumValue: config.particleSize * 0.5 } : false,
            },
            links: {
              enable: true,
              distance: config.distance,
              color: '#6d8ab0', // Couleur légèrement plus claire pour meilleure visibilité
              opacity: config.linkOpacity,
              width: config.linkWidth,
              triangles: {
                enable: false,
              },
            },
            move: {
              enable: true,
              speed: size === 'xs' ? 0.15 : size === 'sm' ? 0.18 : 0.2, // Vitesse réduite pour petits badges
              direction: 'none',
              random: false,
              straight: false,
              outModes: {
                default: 'bounce', // bounce pour garder dans le conteneur
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
                enable: true, // Activé pour l'interactivité au survol
                mode: 'grab', // Mode grab comme la landing page
              },
              onClick: {
                enable: false,
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 140, // Distance de grab comme la landing page
                links: {
                  opacity: 0.5, // Opacité des liens au survol
                },
              },
            },
          },
          // Emitters identiques à PremiumNetwork (même timing) - désactivés pour xs
          emitters: useEmitters ? [
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
          ] : [],
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
