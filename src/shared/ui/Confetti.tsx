// Компонент монтируется один раз на каждый завершённый бросок, поэтому
// случайные параметры конфетти вычисляются при монтировании — React Compiler
// здесь не используется, а стабильность рендеров не важна.
/* eslint-disable react-hooks/purity */
import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import './Confetti.scss'

const COLORS = ['#7c5cff', '#22d3ee', '#f472b6', '#fbbf24', '#34d399', '#a78bfa']

interface Piece {
  left: number
  delay: number
  duration: number
  color: string
  drift: string
  rot: string
  round: boolean
}

export const Confetti = () => {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.5,
        color: COLORS[i % COLORS.length],
        drift: `${Math.round(Math.random() * 160 - 80)}px`,
        rot: `${Math.round(360 + Math.random() * 720)}deg`,
        round: Math.random() > 0.65,
      })),
    [],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={
            {
              left: `${p.left}%`,
              background: p.color,
              borderRadius: p.round ? '50%' : '3px',
              '--delay': `${p.delay}s`,
              '--dur': `${p.duration}s`,
              '--drift': p.drift,
              '--rot': p.rot,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
