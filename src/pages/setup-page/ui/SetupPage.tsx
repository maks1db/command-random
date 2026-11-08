import { ParticipantsForm } from '@/widgets/participants-form'
import { DecoCube } from '@/shared/ui/DecoCube'

import './SetupPage.scss'

interface SetupPageProps {
  initialNames: string[]
  teamSize: number
  onTeamSizeChange: (size: number) => void
  onStart: (names: string[]) => void
}

export const SetupPage = (props: SetupPageProps) => (
  <div className="setup">
    <DecoCube className="deco-cube--1" />
    <DecoCube className="deco-cube--2" />
    <DecoCube className="deco-cube--3" />

    <div className="setup__intro">
      <h1 className="setup__title">
        {'Это рандом'.split('').map((ch, i) => (
          <span key={i} style={{ '--i': i } as React.CSSProperties}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </h1>
      <p className="setup__subtitle">
        Собери участников — приложение честно разобьёт их на команды и само придумает
        для каждой название
      </p>
    </div>

    <ParticipantsForm {...props} />
  </div>
)
