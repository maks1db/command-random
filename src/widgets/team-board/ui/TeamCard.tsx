import type { CSSProperties, RefCallback } from 'react'

interface TeamCardProps {
  index: number
  name: string
  count: number
  slotRef: (teamIndex: number, slotIndex: number) => RefCallback<HTMLDivElement>
}

export const TeamCard = ({ index, name, count, slotRef }: TeamCardProps) => (
  <section className="team" style={{ '--i': index } as CSSProperties}>
    <header className="team__head">
      <span className="team__label">Команда {index + 1}</span>
      <h3 className="team__name" key={name}>
        {name}
      </h3>
    </header>
    <div className="team__slots">
      {Array.from({ length: count }, (_, j) => (
        <div className="slot" key={j} ref={slotRef(index, j)} />
      ))}
    </div>
  </section>
)
