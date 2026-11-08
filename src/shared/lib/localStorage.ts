const STORAGE_KEY = 'command-random:setup'

export interface SavedSetup {
  participants: string[]
  teamSize: number
}

export function loadSetup(): SavedSetup | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const data = JSON.parse(raw) as Partial<SavedSetup>
    if (!Array.isArray(data.participants) || typeof data.teamSize !== 'number') return null

    return {
      participants: data.participants.filter((p): p is string => typeof p === 'string'),
      teamSize: data.teamSize,
    }
  } catch {
    return null
  }
}

export function saveSetup(setup: SavedSetup): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setup))
  } catch {
    // Хранилище недоступно (приватный режим и т.п.) — просто не сохраняем.
  }
}
