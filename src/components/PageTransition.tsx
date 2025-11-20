import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <div
      key={location.pathname}
      className="page-transition-enter"
      style={{
        animation: 'slideInFromRight 0.6s ease-out forwards',
      }}
    >
      {children}
    </div>
  )
}

