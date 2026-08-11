import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  EDUCATION,
  EXPERIENCE,
  METRICS,
  PROFILE,
  PROJECTS,
  SKILL_ORBS,
  type ExperienceRole,
  type SkillOrb,
} from '../../content/portfolio'

const CATEGORY_META: Record<
  SkillOrb['category'],
  { label: string; color: string }
> = {
  language: { label: 'Languages', color: '#22d3a6' },
  architecture: { label: 'Architecture', color: '#a78bfa' },
  platform: { label: 'Platform', color: '#38bdf8' },
  testing: { label: 'Testing', color: '#fbbf24' },
}

export function MobileExperience() {
  const reduceMotion = useReducedMotion()
  const [booting, setBooting] = useState(!reduceMotion)
  const [expandedId, setExpandedId] = useState<string | null>('bill')
  const scrollerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({ container: scrollerRef })
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  })
  const progressWidth = useTransform(progress, [0, 1], ['0%', '100%'])

  // Newest roles first for recruiters
  const roles = useMemo(() => [...EXPERIENCE].reverse(), [])
  const education = useMemo(() => [...EDUCATION].reverse(), [])

  const skillsByCategory = useMemo(() => {
    const map = new Map<SkillOrb['category'], SkillOrb[]>()
    for (const orb of SKILL_ORBS) {
      const list = map.get(orb.category) ?? []
      list.push(orb)
      map.set(orb.category, list)
    }
    return map
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      setBooting(false)
      return
    }
    const t = window.setTimeout(() => setBooting(false), 2400)
    return () => window.clearTimeout(t)
  }, [reduceMotion])

  return (
    <div className="mobile-shell relative h-full w-full bg-[var(--color-ink)] text-[var(--color-text)]">
      <AnimatePresence mode="wait">
        {booting ? (
          <BootSequence key="boot" onSkip={() => setBooting(false)} />
        ) : (
          <motion.div
            key="main"
            className="relative flex h-full flex-col"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            {/* Scroll progress rail */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-50 h-[2px] bg-white/5">
              <motion.div
                className="h-full origin-left bg-gradient-to-r from-[var(--color-accent-2)] via-[var(--color-accent)] to-[#38bdf8]"
                style={{ width: progressWidth }}
              />
            </div>

            <div
              ref={scrollerRef}
              className="mobile-scroll relative flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
            >
              <MeshBackground />

              <div className="relative z-10 mx-auto max-w-lg px-4 pb-28 pt-[max(1.25rem,env(safe-area-inset-top))]">
                <Hero />
                <MetricsGrid />
                <SectionLabel index="01" title="Impact systems" mono="MISSION_LOG" />
                <ExperienceList
                  roles={roles}
                  expandedId={expandedId}
                  onToggle={(id) =>
                    setExpandedId((cur) => (cur === id ? null : id))
                  }
                />
                <SectionLabel index="02" title="Stack" mono="CAPABILITY_MATRIX" />
                <SkillsGrid skillsByCategory={skillsByCategory} />
                <SectionLabel index="03" title="Selected work" mono="SHIPPED" />
                <ProjectsList />
                <SectionLabel index="04" title="Training" mono="EDU" />
                <EducationList items={education} />
                <ContactBlock />
                <p className="mt-10 pb-4 text-center text-[10px] tracking-wide text-[var(--color-muted)]/70">
                  Desktop loads Career Quest · a side-scrolling portfolio
                </p>
              </div>
            </div>

            <StickyDock />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function BootSequence({ onSkip }: { onSkip: () => void }) {
  const lines = [
    '> init portfolio.runtime',
    '> load profile — Joshua Higgins',
    '> hydrate metrics · experience · stack',
    '> mount mobile surface',
    'OK ready.',
  ]

  return (
    <motion.div
      className="absolute inset-0 z-[60] flex flex-col justify-end bg-[var(--color-ink)] px-5 pb-16 pt-10"
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.4 }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-[var(--color-accent-2)] blur-[100px]" />
        <div className="absolute -right-10 bottom-32 h-56 w-56 rounded-full bg-[var(--color-accent)] blur-[90px]" />
      </div>

      <div className="relative font-mono text-[11px] leading-relaxed text-[var(--color-accent)] sm:text-xs">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.28, duration: 0.35 }}
            className={i === lines.length - 1 ? 'mt-2 text-white' : ''}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.div
        className="relative mt-8 h-1 overflow-hidden rounded-full bg-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent-2)] to-[var(--color-accent)]"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.1, ease: 'easeInOut' }}
        />
      </motion.div>

      <button
        type="button"
        onClick={onSkip}
        className="relative mt-6 self-start text-xs text-[var(--color-muted)] underline-offset-4 hover:text-white hover:underline"
      >
        Skip
      </button>
    </motion.div>
  )
}

function MeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#16122e_0%,_#070b16_55%,_#05070f_100%)]" />
      <div className="mobile-mesh absolute -left-1/4 top-0 h-[50vh] w-[80vw] rounded-full bg-[var(--color-accent-2)]/25 blur-[80px]" />
      <div className="mobile-mesh-delay absolute -right-1/4 top-[30%] h-[40vh] w-[70vw] rounded-full bg-[var(--color-accent)]/20 blur-[90px]" />
      <div className="mobile-mesh absolute bottom-[10%] left-1/3 h-[30vh] w-[60vw] rounded-full bg-[#38bdf8]/10 blur-[70px]" />
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 85%)',
        }}
      />
    </div>
  )
}

function Hero() {
  return (
    <motion.header
      className="pt-6"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-accent)] backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        </span>
        Systems online
      </div>

      <p className="font-mono text-[11px] text-[var(--color-muted)]">
        {PROFILE.location} · joshhiggins.dev
      </p>
      <h1 className="mt-2 text-[2.15rem] font-semibold leading-[1.05] tracking-tight text-white">
        {PROFILE.name}
      </h1>
      <p className="mt-1 text-base font-medium text-[var(--color-accent)]">
        {PROFILE.title}
      </p>
      <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-muted)]">
        {PROFILE.tagline}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={PROFILE.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-ink)] shadow-[0_0_24px_rgba(34,211,166,0.35)] active:scale-[0.98]"
        >
          Resume PDF
        </a>
        <a
          href={`mailto:${PROFILE.email}`}
          className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur active:scale-[0.98]"
        >
          Email
        </a>
      </div>
    </motion.header>
  )
}

function MetricsGrid() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-2.5">
      {METRICS.map((m, i) => (
        <motion.div
          key={m.label}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
        >
          <div
            className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-40 blur-2xl"
            style={{
              background:
                i % 2 === 0 ? 'var(--color-accent)' : 'var(--color-accent-2)',
            }}
          />
          <p className="relative font-mono text-lg font-semibold tracking-tight text-white">
            {m.value}
          </p>
          <p className="relative mt-1 text-[11px] leading-snug text-[var(--color-muted)]">
            {m.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

function SectionLabel({
  index,
  title,
  mono,
}: {
  index: string
  title: string
  mono: string
}) {
  return (
    <motion.div
      className="mb-4 mt-12 flex items-end justify-between gap-3 border-b border-white/10 pb-3"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
    >
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-accent-2)]">
          {index} · {mono}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>
    </motion.div>
  )
}

function ExperienceList({
  roles,
  expandedId,
  onToggle,
}: {
  roles: ExperienceRole[]
  expandedId: string | null
  onToggle: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {roles.map((role, i) => {
        const open = expandedId === role.id
        return (
          <motion.article
            key={role.id}
            layout
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: Math.min(i * 0.05, 0.2) }}
            style={{
              boxShadow: open ? `0 0 0 1px ${role.accent}55, 0 12px 40px ${role.accent}18` : undefined,
            }}
          >
            <button
              type="button"
              onClick={() => onToggle(role.id)}
              className="flex w-full items-start gap-3 p-4 text-left"
            >
              <span
                className="mt-1 h-10 w-1 shrink-0 rounded-full"
                style={{ background: role.accent }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">
                      {role.company}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)]">{role.title}</p>
                  </div>
                  <motion.span
                    animate={{ rotate: open ? 45 : 0 }}
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-lg leading-none text-white/70"
                  >
                    +
                  </motion.span>
                </div>
                <p className="mt-1 font-mono text-[10px] text-white/40">
                  {role.start} – {role.end} · {role.duration}
                </p>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/5 px-4 pb-4 pt-1">
                    <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                      {role.summary}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {role.highlights.map((h) => (
                        <li key={h} className="flex gap-2 text-[13px] leading-snug text-white/85">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: role.accent }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {role.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-[var(--color-muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        )
      })}
    </div>
  )
}

function SkillsGrid({
  skillsByCategory,
}: {
  skillsByCategory: Map<SkillOrb['category'], SkillOrb[]>
}) {
  return (
    <div className="space-y-4">
      {[...skillsByCategory.entries()].map(([cat, skills], ci) => {
        const meta = CATEGORY_META[cat]
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.05 }}
          >
            <p
              className="mb-2 font-mono text-[10px] tracking-[0.16em]"
              style={{ color: meta.color }}
            >
              {meta.label.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <motion.span
                  key={s.id}
                  className="rounded-xl border px-3 py-1.5 text-[12px] font-medium text-white"
                  style={{
                    borderColor: `${meta.color}44`,
                    background: `${meta.color}14`,
                    boxShadow: `0 0 20px ${meta.color}18`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.04 * i }}
                  whileTap={{ scale: 0.96 }}
                >
                  {s.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function ProjectsList() {
  return (
    <div className="space-y-3">
      {PROJECTS.map((p, i) => (
        <motion.div
          key={p.id}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.45 }}
        >
          <div className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-[var(--color-warn)]/15 blur-2xl" />
          <p className="font-mono text-[10px] tracking-wider text-[var(--color-warn)]">
            PROJECT
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
            {p.blurb}
          </p>
          <p className="mt-2 text-[12px] font-medium text-[var(--color-accent)]">
            {p.impact}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function EducationList({
  items,
}: {
  items: typeof EDUCATION
}) {
  return (
    <div className="space-y-3">
      {items.map((ed, i) => (
        <motion.div
          key={ed.id}
          className="rounded-2xl border border-[#60a5fa]/25 bg-[#60a5fa]/8 p-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
        >
          <p className="font-mono text-[10px] text-[#93c5fd]">{ed.years}</p>
          <h3 className="mt-1 text-[15px] font-semibold text-white">{ed.school}</h3>
          <p className="text-sm text-[var(--color-muted)]">{ed.degree}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-white/80">
            {ed.summary}
          </p>
          {ed.highlights.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {ed.highlights.slice(0, 2).map((h) => (
                <li key={h} className="text-[12px] leading-snug text-[var(--color-muted)]">
                  · {h}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function ContactBlock() {
  return (
    <motion.section
      className="mt-12 overflow-hidden rounded-3xl border border-[var(--color-accent)]/30 bg-gradient-to-b from-[var(--color-accent)]/15 to-transparent p-5"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--color-accent)]">
        CONTINUE?
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Let&apos;s build</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
        Product-minded frontend, platform migrations, and systems that make hard
        workflows feel easy.
      </p>
      <a
        href={`mailto:${PROFILE.email}`}
        className="mt-4 block break-all text-sm font-medium text-[var(--color-accent)]"
      >
        {PROFILE.email}
      </a>
    </motion.section>
  )
}

function StickyDock() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/95 to-transparent px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-8">
      <div className="pointer-events-auto mx-auto flex max-w-lg gap-2 rounded-2xl border border-white/10 bg-[var(--color-panel)]/90 p-2 shadow-2xl backdrop-blur-xl">
        <a
          href={PROFILE.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center rounded-xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-[var(--color-ink)] active:scale-[0.98]"
        >
          Resume
        </a>
        <a
          href={`mailto:${PROFILE.email}`}
          className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Email
        </a>
      </div>
    </div>
  )
}
