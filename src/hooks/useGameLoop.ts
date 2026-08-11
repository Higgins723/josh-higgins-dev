import { useEffect, useRef } from 'react'

/**
 * Runs a rAF loop. The callback receives dt in ms (clamped).
 * Stable if `running` is true.
 */
export function useGameLoop(
  running: boolean,
  onFrame: (dt: number) => void,
) {
  const cb = useRef(onFrame)
  cb.current = onFrame

  useEffect(() => {
    if (!running) return

    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const raw = now - last
      last = now
      // Clamp to avoid spiral-of-death after tab switch
      const dt = Math.min(raw, 32)
      cb.current(dt)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])
}
