import { GAP } from '../model/constants'

export interface Point {
  x: number
  y: number
}

export interface PoolGridOptions {
  arenaLeft: number
  arenaTop: number
  poolLeft: number
  poolTop: number
  poolWidth: number
  poolHeight: number
  count: number
  dieSize: number
}

// Координаты кубиков, выстроенных по центру общей зоны (в системе координат арены).
export function poolCells(o: PoolGridOptions): Point[] {
  const perRow = Math.max(1, Math.floor((o.poolWidth + GAP) / (o.dieSize + GAP)))
  const rows = Math.ceil(o.count / perRow)
  const contentHeight = rows * (o.dieSize + GAP) - GAP
  const offsetY = Math.max(0, (o.poolHeight - contentHeight) / 2)

  const cells: Point[] = []
  for (let i = 0; i < o.count; i += 1) {
    const row = Math.floor(i / perRow)
    const inRow = Math.min(perRow, o.count - row * perRow)
    const rowWidth = inRow * o.dieSize + (inRow - 1) * GAP
    cells.push({
      x: o.poolLeft - o.arenaLeft + (o.poolWidth - rowWidth) / 2 + (i % perRow) * (o.dieSize + GAP),
      y: o.poolTop - o.arenaTop + offsetY + row * (o.dieSize + GAP),
    })
  }
  return cells
}

// Высота зоны с учётом переноса кубиков на новые строки.
export function poolContentHeight(count: number, poolWidth: number, dieSize: number): number {
  const perRow = Math.max(1, Math.floor((poolWidth + GAP) / (dieSize + GAP)))
  const rows = Math.ceil(count / perRow)
  return rows * (dieSize + GAP) - GAP
}

// Позиция элемента относительно арены.
export function relativePosition(arena: HTMLElement, el: HTMLElement): Point {
  const arenaRect = arena.getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  return { x: rect.left - arenaRect.left, y: rect.top - arenaRect.top }
}
