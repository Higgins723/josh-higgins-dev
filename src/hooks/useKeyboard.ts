import { useEffect, useRef } from 'react'

export interface KeyState {
  left: boolean
  right: boolean
  jump: boolean
  interact: boolean
}

const initial: KeyState = {
  left: false,
  right: false,
  jump: false,
  interact: false,
}

function mapKey(code: string): keyof KeyState | null {
  switch (code) {
    case 'ArrowLeft':
    case 'KeyA':
      return 'left'
    case 'ArrowRight':
    case 'KeyD':
      return 'right'
    case 'ArrowUp':
    case 'KeyW':
    case 'Space':
      return 'jump'
    case 'KeyE':
    case 'Enter':
      return 'interact'
    default:
      return null
  }
}

/** Mutable key state updated outside React render — read from game loop. */
export function useKeyboard(enabled: boolean) {
  const keys = useRef<KeyState>({ ...initial })

  useEffect(() => {
    if (!enabled) {
      keys.current = { ...initial }
      return
    }

    const down = (e: KeyboardEvent) => {
      const k = mapKey(e.code)
      if (!k) return
      // Prevent page scroll on arrows/space while playing
      if (
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'ArrowUp' ||
        e.code === 'Space'
      ) {
        e.preventDefault()
      }
      keys.current[k] = true
    }

    const up = (e: KeyboardEvent) => {
      const k = mapKey(e.code)
      if (!k) return
      keys.current[k] = false
    }

    const blur = () => {
      keys.current = { ...initial }
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [enabled])

  return keys
}
