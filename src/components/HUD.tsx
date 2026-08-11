import type { Zone } from '../content/portfolio'
import { PROFILE } from '../content/portfolio'

interface HUDProps {
  zone: Zone
  skillsCollected: number
  skillsTotal: number
  progress: number
  onOpenMenu?: () => void
}

export function HUD({
  zone,
  skillsCollected,
  skillsTotal,
  progress,
}: HUDProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50 p-3 sm:p-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-3">
        {/* Zone badge */}
        <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/90 px-3 py-2 shadow-lg backdrop-blur-md">
          <div className="font-[family-name:var(--font-display)] text-[9px] text-[var(--color-accent)] sm:text-[10px]">
            {zone.title}
          </div>
          <div className="mt-1 text-xs text-[var(--color-muted)]">{zone.subtitle}</div>
        </div>

        {/* Center identity (desktop) */}
        <div className="hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/90 px-4 py-2 text-center shadow-lg backdrop-blur-md sm:block">
          <div className="text-sm font-semibold tracking-wide text-white">
            {PROFILE.shortName.toUpperCase()}
          </div>
          <div className="text-[11px] text-[var(--color-muted)]">{PROFILE.title}</div>
        </div>

        {/* Skills + progress */}
        <div className="min-w-[160px] rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/90 px-3 py-2 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="text-[var(--color-muted)]">Power-ups</span>
            <span className="font-[family-name:var(--font-display)] text-[9px] text-[var(--color-warn)]">
              {skillsCollected}/{skillsTotal}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-ink)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-2)] to-[var(--color-accent)] transition-[width] duration-300"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <div className="mt-1 text-[10px] text-[var(--color-muted)]">
            Map {Math.round(progress * 100)}%
          </div>
        </div>
      </div>

      {/* Bottom controls hint */}
      <div className="pointer-events-none absolute left-1/2 top-auto mt-0 hidden -translate-x-1/2 sm:fixed sm:bottom-4 sm:block">
        <div className="rounded-full border border-[var(--color-line)] bg-[var(--color-panel)]/85 px-4 py-1.5 text-[11px] text-[var(--color-muted)] backdrop-blur">
          <span className="mr-3">← → move</span>
          <span className="mr-3">SPACE jump</span>
          <span>E inspect</span>
        </div>
      </div>
    </div>
  )
}
