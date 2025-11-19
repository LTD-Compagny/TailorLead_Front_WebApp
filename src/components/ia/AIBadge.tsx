import { ReactNode } from 'react'
import TailorIAIconMiniNetwork from './TailorIAIconMiniNetwork'

interface AIBadgeProps {
  children: ReactNode
  className?: string
  networkSize?: 'sm' | 'md' | 'lg'
  networkOpacity?: number
}

/**
 * Badge réutilisable avec background animé PremiumNetwork
 * À utiliser pour tous les éléments liés à l'IA
 */
export default function AIBadge({ 
  children, 
  className = '', 
  networkSize = 'sm',
  networkOpacity = 0.5 // Augmenté pour meilleure visibilité
}: AIBadgeProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background animé - Mini Network */}
      <div className="absolute inset-0" style={{ opacity: networkOpacity }}>
        <TailorIAIconMiniNetwork size={networkSize} fill={true} />
      </div>

      {/* Contenu par-dessus */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

