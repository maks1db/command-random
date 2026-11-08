import { forwardRef } from 'react'
import type { CSSProperties } from 'react'
import './Die.scss'

interface DieProps {
  name: string
  index: number
}

export const Die = forwardRef<HTMLDivElement, DieProps>(({ name, index }, ref) => {
  const length = name.length

  return (
    <div
      ref={ref}
      className={`die ${length > 8 ? 'is-long' : ''} ${length > 12 ? 'is-xlong' : ''}`}
      style={{ '--i': index } as CSSProperties}
    >
      <div className="die-tilt">
        <div className="die-cube">
          <div className="die-face die-face--front">
            <span>{name}</span>
          </div>
          <div className="die-face die-face--back" />
          <div className="die-face die-face--right" />
          <div className="die-face die-face--left" />
          <div className="die-face die-face--top" />
          <div className="die-face die-face--bottom" />
        </div>
      </div>
    </div>
  )
})

Die.displayName = 'Die'
