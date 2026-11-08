import { RETURN_MS, TRAVEL_MS, TUMBLE_MS } from '../model/constants'

// Анимации кручения кубика через Web Animations API.
// Все ключевые кадры заканчиваются на углах, кратных 360°,
// поэтому смена анимаций происходит без визуального рывка.

const cubeOf = (el: HTMLElement | null): HTMLElement | null =>
  el?.querySelector('.die-cube') ?? null

export const stopCube = (el: HTMLElement | null): void => {
  cubeOf(el)?.getAnimations().forEach((a) => a.cancel())
}

// Бесконечное кручение на месте после броска.
export const tumbleCube = (el: HTMLElement | null): void => {
  const cube = cubeOf(el)
  if (!cube) return
  stopCube(el)
  cube.animate(
    [
      { transform: 'rotateX(0deg) rotateY(0deg)' },
      { transform: 'rotateX(360deg) rotateY(720deg)' },
    ],
    { duration: TUMBLE_MS, iterations: Infinity },
  )
}

// Кручение во время перелёта к слоту команды; финал — лицевая грань.
export const travelCube = (el: HTMLElement | null): void => {
  const cube = cubeOf(el)
  if (!cube) return
  stopCube(el)
  cube.animate(
    [
      { transform: 'rotateX(0deg) rotateY(0deg)' },
      { transform: 'rotateX(720deg) rotateY(360deg)' },
    ],
    { duration: TRAVEL_MS, easing: 'cubic-bezier(.4,.6,.4,1)', fill: 'forwards' },
  )
}

// Плавный полный оборот при возврате кубиков в общую зону.
export const settleCube = (el: HTMLElement | null, duration = RETURN_MS): void => {
  const cube = cubeOf(el)
  if (!cube) return
  stopCube(el)
  cube.animate(
    [
      { transform: 'rotateX(0deg) rotateY(0deg)' },
      { transform: 'rotateX(360deg) rotateY(360deg)' },
    ],
    { duration, easing: 'ease-in-out', fill: 'forwards' },
  )
}
