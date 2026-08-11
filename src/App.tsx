import { useEffect, useState } from 'react'
import { GameWorld } from './components/GameWorld'
import { MobileExperience } from './components/mobile/MobileExperience'
import { TitleScreen } from './components/TitleScreen'
import { useMediaQuery } from './hooks/useMediaQuery'

type Screen = 'title' | 'game'

/** Compact viewports get the modern mobile surface; desktop keeps Career Quest. */
const MOBILE_QUERY = '(max-width: 768px)'

export default function App() {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [screen, setScreen] = useState<Screen>('title')

  useEffect(() => {
    if (isMobile || screen !== 'title') return
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault()
        setScreen('game')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, isMobile])

  if (isMobile) {
    return <MobileExperience />
  }

  if (screen === 'title') {
    return <TitleScreen onStart={() => setScreen('game')} />
  }

  return <GameWorld />
}
