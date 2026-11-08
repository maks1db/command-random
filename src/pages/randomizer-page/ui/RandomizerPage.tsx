import { useMemo } from 'react'

import { toParticipants } from '@/entities/participant'
import { plural } from '@/shared/lib/plural'
import { TeamBoard } from '@/widgets/team-board'

import './RandomizerPage.scss'

interface RandomizerPageProps {
  participants: string[]
  teamSize: number
  onBack: () => void
}

export const RandomizerPage = ({ participants, teamSize, onBack }: RandomizerPageProps) => {
  const dice = useMemo(() => toParticipants(participants), [participants])
  const teamCount = Math.max(1, Math.ceil(participants.length / teamSize))

  return (
    <div className="play">
      <div className="play__top">
        <button className="btn-ghost" type="button" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M20 12H5m0 0 6-6m-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Назад
        </button>
        <div className="play__meta">
          {participants.length} {plural(participants.length, 'участник', 'участника', 'участников')}{' '}
          · {teamCount} {plural(teamCount, 'команда', 'команды', 'команд')} · по {teamSize}
        </div>
      </div>

      <TeamBoard participants={dice} teamSize={teamSize} />
    </div>
  )
}
