import { AnimatePresence, motion } from 'framer-motion'
import type { EducationItem, ExperienceRole } from '../content/portfolio'

type PanelContent =
  | { kind: 'experience'; data: ExperienceRole }
  | { kind: 'education'; data: EducationItem }
  | { kind: 'start' }
  | { kind: 'contact' }
  | { kind: 'skills'; collected: string[] }

interface DetailPanelProps {
  content: PanelContent | null
  onClose: () => void
}

export function DetailPanel({ content, onClose }: DetailPanelProps) {
  return (
    <AnimatePresence>
      {content && (
        <motion.aside
          key={panelKey(content)}
          className="pointer-events-auto absolute bottom-20 left-3 right-3 z-40 mx-auto max-w-xl sm:bottom-8 sm:left-auto sm:right-6 sm:w-[min(420px,calc(100vw-3rem))]"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <div className="overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)]/95 shadow-2xl backdrop-blur-md">
            <div
              className="h-1.5 w-full"
              style={{ background: accentFor(content) }}
            />
            <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-4">
              <div>
                <p className="font-[family-name:var(--font-display)] text-[9px] text-[var(--color-accent)]">
                  {kindLabel(content)}
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-snug text-white">
                  {titleFor(content)}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  {subtitleFor(content)}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[var(--color-line)] px-2 py-1 text-xs text-[var(--color-muted)] hover:bg-white/5 hover:text-white"
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[40vh] overflow-y-auto px-4 pb-4 text-sm leading-relaxed text-[var(--color-text)]/90">
              {content.kind === 'experience' && (
                <>
                  <p className="text-[var(--color-muted)]">{content.data.summary}</p>
                  <ul className="mt-3 space-y-2">
                    {content.data.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {content.data.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--color-line)] bg-[var(--color-ink)]/60 px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {content.kind === 'education' && (
                <>
                  <p className="text-[var(--color-muted)]">{content.data.summary}</p>
                  {content.data.highlights.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {content.data.highlights.map((h) => (
                        <li key={h} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#60a5fa]" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {content.data.tech && content.data.tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {content.data.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-[var(--color-line)] bg-[var(--color-ink)]/60 px-2 py-0.5 text-[11px] text-[var(--color-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}

              {content.kind === 'start' && (
                <>
                  <p>
                    Welcome to Career Quest. Walk right to explore education,
                    roles, skills, and how to reach me.
                  </p>
                  <p className="mt-2 text-[var(--color-muted)]">
                    Walk up to glowing landmarks — cards open when you get close
                    (or press <strong>E</strong> / the E button). Collect
                    floating skill orbs for power-ups; jump to reach the high
                    ones.
                  </p>
                </>
              )}

              {content.kind === 'skills' && (
                <>
                  <p className="text-[var(--color-muted)]">
                    Touch the floating orbs to collect them. Stack I ship with:
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {content.collected.length === 0 ? (
                      <span className="text-[var(--color-muted)]">
                        None yet — jump for the high ones!
                      </span>
                    ) : (
                      content.collected.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-[var(--color-accent)]/15 px-2 py-0.5 text-[11px] text-[var(--color-accent)]"
                        >
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </>
              )}

              {content.kind === 'contact' && (
                <ContactBody />
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function ContactBody() {
  return (
    <div className="space-y-3">
      <p>
        Want to build something ambitious together? I&apos;m especially
        interested in product-minded frontend, platform migrations, and systems
        that make hard workflows feel easy.
      </p>
      <div className="flex flex-col gap-2">
        <a
          className="rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent)]/10 px-3 py-2 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20"
          href="mailto:joshuamichaelhiggins@gmail.com"
        >
          joshuamichaelhiggins@gmail.com
        </a>
        <a
          className="rounded-lg border border-[var(--color-line)] px-3 py-2 text-[var(--color-muted)] hover:border-[var(--color-accent-2)] hover:text-white"
          href="/Joshua-Higgins-Resume-2026.pdf"
          target="_blank"
          rel="noreferrer"
        >
          Download resume (PDF)
        </a>
        <a
          className="rounded-lg border border-[var(--color-line)] px-3 py-2 text-[var(--color-muted)] hover:border-[var(--color-accent-2)] hover:text-white"
          href="https://joshhiggins.dev"
          target="_blank"
          rel="noreferrer"
        >
          joshhiggins.dev
        </a>
      </div>
    </div>
  )
}

function panelKey(c: PanelContent) {
  if (c.kind === 'experience') return c.data.id
  if (c.kind === 'education') return c.data.id
  if (c.kind === 'skills') return 'skills'
  return c.kind
}

function kindLabel(c: PanelContent) {
  switch (c.kind) {
    case 'experience':
      return 'QUEST LOG · EXPERIENCE'
    case 'education':
      return 'QUEST LOG · EDUCATION'
    case 'start':
      return 'TUTORIAL'
    case 'skills':
      return 'POWER-UP VAULT'
    case 'contact':
      return 'FINAL STAGE'
  }
}

function titleFor(c: PanelContent) {
  switch (c.kind) {
    case 'experience':
      return c.data.company
    case 'education':
      return c.data.school
    case 'start':
      return 'How to play'
    case 'skills':
      return 'Skills collected'
    case 'contact':
      return "Let's connect"
  }
}

function subtitleFor(c: PanelContent) {
  switch (c.kind) {
    case 'experience':
      return `${c.data.title} · ${c.data.start} – ${c.data.end}`
    case 'education':
      return c.data.years
    case 'start':
      return 'Controls & goals'
    case 'skills':
      return 'Walk into orbs to collect'
    case 'contact':
      return 'Provo, UT · Open to great opportunities'
  }
}

function accentFor(c: PanelContent) {
  if (c.kind === 'experience') return c.data.accent
  if (c.kind === 'education') return '#3b82f6'
  if (c.kind === 'skills') return '#a78bfa'
  if (c.kind === 'contact') return '#38bdf8'
  return '#7c5cff'
}
