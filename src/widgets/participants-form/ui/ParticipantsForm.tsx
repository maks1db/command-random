import { useMemo, useState } from 'react'

import { parseNames } from '@/features/participants-input'
import { plural } from '@/shared/lib/plural'

import './ParticipantsForm.scss'

interface ParticipantsFormProps {
  initialNames: string[]
  teamSize: number
  onTeamSizeChange: (size: number) => void
  onStart: (names: string[]) => void
}

export const ParticipantsForm = ({
  initialNames,
  teamSize,
  onTeamSizeChange,
  onStart,
}: ParticipantsFormProps) => {
  const [text, setText] = useState(initialNames.join('\n'))
  const names = useMemo(() => parseNames(text), [text])
  const teamCount = Math.max(1, Math.ceil(names.length / teamSize))
  const canStart = names.length >= 2 && teamSize >= 1

  // Размер команды задаётся свободно — независимо от числа введённых имён.
  const MIN_TEAM_SIZE = 1
  const MAX_TEAM_SIZE = 50

  const changeSize = (delta: number) => {
    onTeamSizeChange(Math.min(Math.max(MIN_TEAM_SIZE, teamSize + delta), MAX_TEAM_SIZE))
  }

  const removeName = (name: string) => {
    setText(names.filter((n) => n !== name).join('\n'))
  }

  return (
    <div className="setup__card">
      <label className="field">
        <span className="field__label">Участники</span>
        <textarea
          className="field__input"
          rows={6}
          placeholder={'Введи имена — каждое с новой строки\nили через запятую'}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>

      {names.length > 0 && (
        <div className="chips">
          {names.map((name) => (
            <span className="chip" key={name}>
              {name}
              <button
                type="button"
                aria-label={`Удалить ${name}`}
                onClick={() => removeName(name)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="setup__row">
        <div className="stepper">
          <span className="stepper__label">В команде</span>
          <div className="stepper__controls">
            <button
              type="button"
              onClick={() => changeSize(-1)}
              aria-label="Меньше"
              disabled={teamSize <= MIN_TEAM_SIZE}
            >
              −
            </button>
            <span className="stepper__value">{teamSize}</span>
            <button
              type="button"
              onClick={() => changeSize(1)}
              aria-label="Больше"
              disabled={teamSize >= MAX_TEAM_SIZE}
            >
              +
            </button>
          </div>
        </div>
        <div className="setup__info">
          {names.length > 0
            ? `${names.length} ${plural(names.length, 'участник', 'участника', 'участников')} → ` +
              `${teamCount} ${plural(teamCount, 'команда', 'команды', 'команд')} по ${teamSize}`
            : 'Добавь хотя бы двух участников'}
        </div>
      </div>

      <button
        className="btn-primary"
        type="button"
        disabled={!canStart}
        onClick={() => onStart(names)}
      >
        Разбить на команды
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12h15m0 0-6-6m6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}
