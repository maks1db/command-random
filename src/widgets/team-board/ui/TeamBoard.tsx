import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { RefCallback } from 'react'

import type { Participant } from '@/entities/participant'
import { generateTeamNames } from '@/entities/team'
import { buildAssignment } from '@/features/roll-teams'
import type { DiceSlot } from '@/features/roll-teams'
import { Confetti } from '@/shared/ui/Confetti'
import { DiceIcon } from '@/shared/ui/DiceIcon'

import { settleCube, travelCube, tumbleCube } from '../lib/diceAnimation'
import { poolCells, poolContentHeight, relativePosition } from '../lib/grid'
import {
  DIE_SIZE,
  POOL_MIN_HEIGHT,
  RETURN_MS,
  START_DELAY,
  STAGGER,
  TRAVEL_EASE,
  TRAVEL_MS,
} from '../model/constants'
import type { Phase } from '../model/constants'
import { Die } from './Die'
import { TeamCard } from './TeamCard'
import './TeamBoard.scss'

interface TeamBoardProps {
  participants: Participant[]
  teamSize: number
}

export const TeamBoard = ({ participants, teamSize }: TeamBoardProps) => {
  const teamCount = Math.max(1, Math.ceil(participants.length / teamSize))

  const counts = useMemo(() => {
    const arr = Array.from({ length: teamCount }, () => teamSize)
    arr[teamCount - 1] = participants.length - teamSize * (teamCount - 1)
    return arr
  }, [participants.length, teamSize, teamCount])

  const [teams, setTeams] = useState<string[]>(() => generateTeamNames(teamCount))
  const [phase, setPhase] = useState<Phase>('idle')

  const arenaRef = useRef<HTMLDivElement | null>(null)
  const poolRef = useRef<HTMLDivElement | null>(null)
  const dieRefs = useRef<(HTMLDivElement | null)[]>([])
  const slotRefs = useRef<(HTMLDivElement | null)[][]>([])
  const timersRef = useRef<number[]>([])
  const phaseRef = useRef<Phase>('idle')
  const assignmentRef = useRef<Map<number, DiceSlot> | null>(null)
  // Первый бросок сохраняет названия команд, сгенерированные при входе;
  // последующие перебросы генерируют новые.
  const hasRolledRef = useRef(false)

  const updatePhase = (p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }

  const later = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms))
  }

  const setDiePos = (
    el: HTMLDivElement,
    x: number,
    y: number,
    animate: boolean,
    duration = RETURN_MS,
    ease = 'cubic-bezier(.35,.7,.3,1)',
  ) => {
    el.style.transition = animate ? `transform ${duration}ms ${ease}` : 'none'
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const layoutPool = (animate: boolean) => {
    const arena = arenaRef.current
    const pool = poolRef.current
    if (!arena || !pool) return

    const arenaRect = arena.getBoundingClientRect()
    const poolRect = pool.getBoundingClientRect()
    const count = participants.length
    if (count === 0) return

    pool.style.height = `${Math.max(poolContentHeight(count, poolRect.width, DIE_SIZE), POOL_MIN_HEIGHT)}px`

    const cells = poolCells({
      arenaLeft: arenaRect.left,
      arenaTop: arenaRect.top,
      poolLeft: poolRect.left,
      poolTop: poolRect.top,
      poolWidth: poolRect.width,
      poolHeight: pool.clientHeight,
      count,
      dieSize: DIE_SIZE,
    })

    cells.forEach(({ x, y }, i) => {
      const el = dieRefs.current[i]
      if (el) setDiePos(el, x, y, animate)
    })
  }

  const snapToSlots = () => {
    const arena = arenaRef.current
    const assignment = assignmentRef.current
    if (!arena || !assignment) return

    participants.forEach((p, i) => {
      const el = dieRefs.current[i]
      const place = assignment.get(p.id)
      const slot = place ? slotRefs.current[place.team]?.[place.slot] : undefined
      if (!el || !slot) return
      const pos = relativePosition(arena, slot)
      setDiePos(el, pos.x, pos.y, false)
    })
  }

  const roll = (force = false) => {
    if (!force && phaseRef.current === 'rolling') return
    assignmentRef.current = null

    if (hasRolledRef.current) {
      setTeams(generateTeamNames(teamCount))
    }
    hasRolledRef.current = true
    updatePhase('rolling')

    const assignment = buildAssignment(
      participants.map((p) => p.id),
      teamSize,
    )
    assignmentRef.current = assignment

    participants.forEach((_, i) => tumbleCube(dieRefs.current[i]))

    participants.forEach((p, i) => {
      later(() => {
        const el = dieRefs.current[i]
        const place = assignment.get(p.id)
        const slotEl = place ? slotRefs.current[place.team]?.[place.slot] : undefined
        const arena = arenaRef.current
        if (!el || !slotEl || !arena) return
        const pos = relativePosition(arena, slotEl)
        el.style.transition = `transform ${TRAVEL_MS}ms ${TRAVEL_EASE}`
        el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
        travelCube(el)
      }, START_DELAY + (i % 10) * STAGGER)
    })

    const total = START_DELAY + Math.min(participants.length, 10) * STAGGER + TRAVEL_MS + 200
    later(() => updatePhase('done'), total)
  }

  const reroll = () => {
    if (phaseRef.current !== 'done') return
    updatePhase('rolling')
    participants.forEach((_, i) => settleCube(dieRefs.current[i]))
    layoutPool(true)
    later(() => roll(true), RETURN_MS + 80)
  }

  useLayoutEffect(() => {
    if (phaseRef.current === 'idle') layoutPool(false)
  })

  useEffect(() => {
    const onResize = () => {
      if (phaseRef.current === 'idle') layoutPool(false)
      else if (phaseRef.current === 'done') snapToSlots()
    }

    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(() => {
      if (phaseRef.current === 'idle') layoutPool(false)
    })

    return () => {
      window.removeEventListener('resize', onResize)
      timersRef.current.forEach((t) => clearTimeout(t))
      timersRef.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setSlotRef =
    (team: number, slot: number): RefCallback<HTMLDivElement> =>
    (el) => {
      if (!slotRefs.current[team]) slotRefs.current[team] = []
      slotRefs.current[team][slot] = el
    }

  const teamsClass =
    phase === 'rolling' ? 'teams is-rolling' : phase === 'done' ? 'teams is-done' : 'teams'

  const rollLabel = phase === 'rolling' ? 'Бросаем…' : phase === 'done' ? 'Перебросить' : 'Это рандом'

  return (
    <div className="arena" ref={arenaRef}>
      <button
        className="btn-roll"
        type="button"
        disabled={phase === 'rolling'}
        onClick={phase === 'done' ? reroll : () => roll()}
      >
        <DiceIcon />
        <span>{rollLabel}</span>
      </button>

      <div className="pool" ref={poolRef} />

      <div className={teamsClass}>
        {teams.map((name, i) => (
          <TeamCard key={i} index={i} name={name} count={counts[i]} slotRef={setSlotRef} />
        ))}
      </div>

      {participants.map((p, i) => (
        <Die
          key={p.id}
          name={p.name}
          index={i}
          ref={(el) => {
            dieRefs.current[i] = el
          }}
        />
      ))}

      {phase === 'done' && <Confetti />}
    </div>
  )
}
