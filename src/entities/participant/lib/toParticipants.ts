import type { Participant } from '../model/types'

export const toParticipants = (names: string[]): Participant[] =>
  names.map((name, id) => ({ id, name }))
