import { shuffle } from '@/shared/lib/shuffle'

export interface DiceSlot {
  team: number
  slot: number
}

// Случайно распределяет id кубиков по слотам команд:
// team = номер команды, slot = позиция внутри команды.
export function buildAssignment(ids: number[], teamSize: number): Map<number, DiceSlot> {
  const order = shuffle(ids)
  const assignment = new Map<number, DiceSlot>()

  order.forEach((id, pos) => {
    assignment.set(id, {
      team: Math.floor(pos / teamSize),
      slot: pos % teamSize,
    })
  })

  return assignment
}
