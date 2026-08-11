import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EXPERIENCE,
  PROFILE,
  SKILL_ORBS,
  WORLD,
  nearestEducation,
  nearestExperience,
  zoneAt,
  type EducationItem,
  type ExperienceRole,
  type Zone,
} from '../content/portfolio'
import { PLATFORMS } from '../content/platforms'
import { useGameLoop } from '../hooks/useGameLoop'
import { useKeyboard } from '../hooks/useKeyboard'
import { DetailPanel } from './DetailPanel'
import { HUD } from './HUD'
import { MobileControls } from './MobileControls'
import { WorldDecor } from './WorldDecor'

type PanelContent =
  | { kind: 'experience'; data: ExperienceRole }
  | { kind: 'education'; data: EducationItem }
  | { kind: 'start' }
  | { kind: 'contact' }
  | { kind: 'skills'; collected: string[] }

interface SimState {
  x: number
  y: number
  vx: number
  vy: number
  facing: 1 | -1
  grounded: boolean
  jumpHeld: boolean
}

/** Point-landmark dismiss distance (experience / education signs). */
const PANEL_CLOSE_DISTANCE = 260
/** Auto-open when player center enters this radius of a point landmark. */
const AUTO_OPEN_RADIUS = 110
/** Slightly wider for intentional E / mobile inspect. */
const MANUAL_OPEN_RADIUS = 160

const SPAWN: SimState = {
  x: 120,
  y: WORLD.groundY - WORLD.playerHeight,
  vx: 0,
  vy: 0,
  facing: 1,
  grounded: true,
  jumpHeld: false,
}

function panelId(panel: PanelContent): string {
  switch (panel.kind) {
    case 'experience':
      return `exp:${panel.data.id}`
    case 'education':
      return `edu:${panel.data.id}`
    case 'start':
      return 'start'
    case 'skills':
      return 'skills'
    case 'contact':
      return 'contact'
  }
}

/**
 * Whether the player is still close enough that the open card should stay up.
 * Zone-wide panels (skills, contact, start) stay open across the whole area —
 * a single point anchor was wrongly dismissing the power-up vault mid-zone.
 */
function isNearPanel(px: number, panel: PanelContent): boolean {
  switch (panel.kind) {
    case 'experience':
      return Math.abs(px - panel.data.x) <= PANEL_CLOSE_DISTANCE
    case 'education':
      return Math.abs(px - panel.data.x) <= PANEL_CLOSE_DISTANCE
    case 'start':
      return px < 700
    case 'skills': {
      const z = zoneAt(px)
      if (z.kind === 'skills') return true
      // small hysteresis past zone edges
      return px >= 7660 && px < 8840
    }
    case 'contact':
      return px >= 8760 || zoneAt(px).kind === 'contact'
  }
}

function skillsPanel(collected: Set<string>): PanelContent {
  const labels = SKILL_ORBS.filter((o) => collected.has(o.id)).map((o) => o.label)
  return { kind: 'skills', collected: labels }
}

/** Resolve what (if anything) is inspectable at world x. */
function resolveInspectable(
  px: number,
  radius: number,
  collected: Set<string>,
): { id: string; panel: PanelContent } | null {
  const exp = nearestExperience(px, radius)
  if (exp) {
    const panel: PanelContent = { kind: 'experience', data: exp }
    return { id: panelId(panel), panel }
  }

  const edu = nearestEducation(px, radius * 0.9)
  if (edu) {
    const panel: PanelContent = { kind: 'education', data: edu }
    return { id: panelId(panel), panel }
  }

  const z = zoneAt(px)

  // Entire power-up vault is one inspectable region (not a single x point)
  if (z.kind === 'skills') {
    const panel = skillsPanel(collected)
    return { id: panelId(panel), panel }
  }

  if (z.kind === 'contact' || px > 9000) {
    if (px > 8950 || z.kind === 'contact') {
      const panel: PanelContent = { kind: 'contact' }
      return { id: panelId(panel), panel }
    }
  }

  if (z.kind === 'start' || px < 500) {
    const panel: PanelContent = { kind: 'start' }
    // Only near spawn sign — not the whole first chunk of the map
    if (px < 550) return { id: panelId(panel), panel }
    return null
  }

  // Manual-only fallback: looser experience grab
  if (radius >= MANUAL_OPEN_RADIUS) {
    const nearest = nearestExperience(px, 280)
    if (nearest) {
      const panel: PanelContent = { kind: 'experience', data: nearest }
      return { id: panelId(panel), panel }
    }
  }

  return null
}

export function GameWorld() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const legsL = useRef<HTMLDivElement>(null)
  const legsR = useRef<HTMLDivElement>(null)
  const promptRef = useRef<HTMLDivElement>(null)

  const sim = useRef<SimState>({ ...SPAWN })
  const touch = useRef({ left: false, right: false, jump: false })
  const keys = useKeyboard(true)
  const interactLatch = useRef(false)
  const viewportW = useRef(800)
  const frame = useRef(0)

  const [collected, setCollected] = useState<Set<string>>(() => new Set())
  const [panel, setPanel] = useState<PanelContent | null>({ kind: 'start' })
  const [zone, setZone] = useState<Zone>(() => zoneAt(SPAWN.x))
  const [progress, setProgress] = useState(0)
  const [skillsCount, setSkillsCount] = useState(0)

  const collectedRef = useRef(collected)
  collectedRef.current = collected

  const panelRef = useRef<PanelContent | null>(panel)
  panelRef.current = panel
  /** Last landmark we auto-opened; cleared when player leaves its area so re-entry reopens. */
  const autoOpenIdRef = useRef<string | null>('start')

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      viewportW.current = entry.contentRect.width
    })
    ro.observe(el)
    viewportW.current = el.clientWidth
    return () => ro.disconnect()
  }, [])

  const tryInteract = useCallback(() => {
    const px = sim.current.x + WORLD.playerWidth / 2
    const hit = resolveInspectable(px, MANUAL_OPEN_RADIUS, collectedRef.current)
    if (!hit) return
    autoOpenIdRef.current = hit.id
    setPanel(hit.panel)
  }, [])

  useGameLoop(true, () => {
    const s = sim.current
    const k = keys.current
    const t = touch.current
    frame.current += 1

    const left = k.left || t.left
    const right = k.right || t.right
    const jump = k.jump || t.jump

    let vx = 0
    if (left) vx -= WORLD.moveSpeed
    if (right) vx += WORLD.moveSpeed
    s.vx = vx
    if (vx < 0) s.facing = -1
    if (vx > 0) s.facing = 1

    if (jump && s.grounded && !s.jumpHeld) {
      s.vy = WORLD.jumpVelocity
      s.grounded = false
    }
    s.jumpHeld = jump

    s.vy += WORLD.gravity
    const prevY = s.y
    s.x += s.vx
    s.y += s.vy

    s.x = Math.max(0, Math.min(WORLD.width - WORLD.playerWidth, s.x))

    // Ground
    const groundTop = WORLD.groundY - WORLD.playerHeight
    let onSurface = false
    if (s.y >= groundTop) {
      s.y = groundTop
      s.vy = 0
      onSurface = true
    }

    // Platforms (only land when falling onto them)
    if (s.vy >= 0) {
      const feet = s.y + WORLD.playerHeight
      const prevFeet = prevY + WORLD.playerHeight
      for (const p of PLATFORMS) {
        const withinX =
          s.x + WORLD.playerWidth > p.x + 4 && s.x < p.x + p.width - 4
        if (!withinX) continue
        if (prevFeet <= p.y + 2 && feet >= p.y) {
          s.y = p.y - WORLD.playerHeight
          s.vy = 0
          onSurface = true
          break
        }
      }
    }
    s.grounded = onSurface

    // Skill orbs
    const cx = s.x + WORLD.playerWidth / 2
    const cy = s.y + WORLD.playerHeight / 2
    let newSkill: string | null = null
    for (const orb of SKILL_ORBS) {
      if (collectedRef.current.has(orb.id)) continue
      const dx = cx - (orb.x + 20)
      const dy = cy - (orb.y + 20)
      if (dx * dx + dy * dy < 42 * 42) {
        newSkill = orb.id
        break
      }
    }
    if (newSkill) {
      setCollected((prev) => {
        if (prev.has(newSkill!)) return prev
        const next = new Set(prev)
        next.add(newSkill!)
        setSkillsCount(next.size)
        return next
      })
    }

    if (k.interact) {
      if (!interactLatch.current) {
        interactLatch.current = true
        tryInteract()
      }
    } else {
      interactLatch.current = false
    }

    // Camera + DOM (no React render every frame)
    const vw = viewportW.current
    let cam = s.x + WORLD.playerWidth / 2 - vw / 2
    cam = Math.max(0, Math.min(WORLD.width - vw, cam))

    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(${-cam}px, 0, 0)`
    }
    if (playerRef.current) {
      playerRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) scaleX(${s.facing})`
    }

    const walking = Math.abs(s.vx) > 0.1 && s.grounded
    const phase = walking && Math.floor(frame.current / 6) % 2 === 0
    if (legsL.current && legsR.current) {
      legsL.current.style.transform = phase ? 'rotate(18deg)' : 'rotate(0deg)'
      legsR.current.style.transform = phase ? 'rotate(-18deg)' : 'rotate(0deg)'
    }

    // Nearby prompt
    if (promptRef.current) {
      const near =
        nearestExperience(cx, 150) ||
        nearestEducation(cx, 130) ||
        zoneAt(cx).kind === 'contact' ||
        zoneAt(cx).kind === 'skills' ||
        zoneAt(cx).kind === 'start'
      promptRef.current.style.opacity = near ? '1' : '0'
    }

    // Throttle HUD React updates, auto-open on approach, walk-away dismiss
    if (frame.current % 8 === 0) {
      const z = zoneAt(cx)
      setZone((prev) => (prev.id === z.id ? prev : z))
      setProgress(
        Math.min(1, Math.max(0, cx / (WORLD.width - 200))),
      )

      const open = panelRef.current
      if (open && !isNearPanel(cx, open)) {
        setPanel(null)
      }

      // Entering a landmark / zone opens its card (walk or jump into range).
      // Re-open only after leaving so manual close with ✕ isn't immediately undone.
      const near = resolveInspectable(cx, AUTO_OPEN_RADIUS, collectedRef.current)
      if (near) {
        if (near.id !== autoOpenIdRef.current) {
          autoOpenIdRef.current = near.id
          setPanel(near.panel)
        } else if (
          near.panel.kind === 'skills' &&
          open?.kind === 'skills' &&
          near.panel.collected.length !== open.collected.length
        ) {
          // Refresh power-up list while you stay in the vault
          setPanel(near.panel)
        }
      } else if (!open || !isNearPanel(cx, open)) {
        autoOpenIdRef.current = null
      }
    }
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') setPanel(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div
      ref={viewportRef}
      className="game-root relative h-full w-full overflow-hidden bg-[var(--color-ink)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070b18] to-[#1a1140]" />

      <div
        ref={worldRef}
        className="absolute left-0 top-0 h-full will-change-transform"
        style={{ width: WORLD.width, height: '100%' }}
      >
        <div
          className="relative"
          style={{
            width: WORLD.width,
            height: WORLD.height,
            marginTop: 'max(0px, calc(50vh - 360px))',
          }}
        >
          {/* Platforms under landmarks; player on top */}
          <PlatformLayer />
          <WorldDecor collectedSkills={collected} />

          {/* Player (DOM-driven transform) */}
          <div
            ref={playerRef}
            className="absolute z-30 will-change-transform"
            style={{
              left: 0,
              top: 0,
              width: WORLD.playerWidth,
              height: WORLD.playerHeight,
              transform: `translate3d(${SPAWN.x}px, ${SPAWN.y}px, 0)`,
            }}
            aria-hidden
          >
            <div className="absolute bottom-0 left-1/2 h-2 w-7 -translate-x-1/2 rounded-full bg-black/40" />
            <div className="absolute inset-x-1 bottom-1 top-0">
              <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-sm bg-[#f0c8a0] shadow-[0_0_0_1px_#1a1020]">
                <div className="absolute left-[3px] top-[6px] h-[3px] w-[3px] rounded-full bg-[#1a1020]" />
                <div className="absolute right-[3px] top-[6px] h-[3px] w-[3px] rounded-full bg-[#1a1020]" />
                <div className="absolute -top-1 left-0 right-0 h-2 rounded-t-sm bg-[#3d2914]" />
              </div>
              <div className="absolute left-1/2 top-[15px] h-[18px] w-[18px] -translate-x-1/2 rounded-sm bg-[var(--color-accent-2)] shadow-[0_0_0_1px_#1a1020]">
                <div className="absolute left-1/2 top-1 h-2 w-2 -translate-x-1/2 rounded-[1px] bg-[var(--color-accent)]" />
              </div>
              <div className="absolute left-[2px] top-[16px] h-4 w-2 rounded-[1px] bg-[#94a3b8] shadow-[0_0_0_1px_#1a1020]" />
              <div
                ref={legsL}
                className="absolute bottom-0 left-[8px] h-3 w-[5px] origin-top rounded-sm bg-[#1e293b]"
                style={{ transition: 'transform 90ms linear' }}
              />
              <div
                ref={legsR}
                className="absolute bottom-0 right-[8px] h-3 w-[5px] origin-top rounded-sm bg-[#1e293b]"
                style={{ transition: 'transform 90ms linear' }}
              />
              <div className="absolute left-[2px] top-[18px] h-2 w-[5px] rounded-sm bg-[#f0c8a0]" />
              <div className="absolute right-[2px] top-[18px] h-2 w-[5px] rounded-sm bg-[#f0c8a0]" />
            </div>
          </div>

          {EXPERIENCE.map((role) => (
            <div
              key={`pad-${role.id}`}
              className="pointer-events-none absolute z-10 font-[family-name:var(--font-display)] text-[8px] text-white/30"
              style={{ left: role.x - 10, top: WORLD.groundY - 24 }}
            >
              E
            </div>
          ))}
        </div>
      </div>

      <div className="scanlines absolute inset-0 z-[45] opacity-30" />
      <div className="crt-vignette absolute inset-0 z-[45]" />

      <HUD
        zone={zone}
        skillsCollected={skillsCount}
        skillsTotal={SKILL_ORBS.length}
        progress={progress}
      />

      <div
        ref={promptRef}
        className="pointer-events-none absolute bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[var(--color-accent)] bg-[var(--color-panel)]/90 px-4 py-2 text-xs text-[var(--color-accent)] shadow-lg transition-opacity sm:bottom-16"
        style={{ opacity: 0 }}
      >
        Approach or press E
      </div>

      <DetailPanel content={panel} onClose={() => setPanel(null)} />

      <MobileControls
        onLeft={(d) => {
          touch.current.left = d
        }}
        onRight={(d) => {
          touch.current.right = d
        }}
        onJump={(d) => {
          touch.current.jump = d
        }}
        onInteract={tryInteract}
      />

      <a
        href={PROFILE.resumeUrl}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto absolute bottom-4 left-4 z-50 hidden rounded border border-[var(--color-line)] bg-[var(--color-panel)]/80 px-2 py-1 text-[10px] text-[var(--color-muted)] hover:text-white sm:block"
      >
        Resume PDF
      </a>
    </div>
  )
}

function PlatformLayer() {
  return (
    <>
      {PLATFORMS.map((p, i) => (
        <div
          key={i}
          className="absolute z-[5] rounded-sm border-b-4 border-[#166534] bg-gradient-to-b from-[#4ade80] to-[#16a34a] shadow-md pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.width,
            height: p.height,
            boxShadow: '0 0 12px rgba(34,211,166,0.25)',
          }}
        />
      ))}
    </>
  )
}
