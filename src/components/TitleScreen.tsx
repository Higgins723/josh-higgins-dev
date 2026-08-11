import { motion } from 'framer-motion'
import { METRICS, PROFILE } from '../content/portfolio'

interface TitleScreenProps {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[var(--color-ink)]">
      {/* Animated sky layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-sky-top)] via-[#14122e] to-[#1e1540]" />
      <Stars />
      <Hills />

      <div className="scanlines absolute inset-0 z-20 opacity-40" />
      <div className="crt-vignette absolute inset-0 z-20" />

      <motion.div
        className="relative z-30 mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className="mb-4 font-[family-name:var(--font-display)] text-[10px] tracking-widest text-[var(--color-accent)] sm:text-xs">
          PLAYER 1 READY
        </p>

        <h1 className="font-[family-name:var(--font-display)] text-2xl leading-relaxed text-white drop-shadow-[0_4px_0_#000] sm:text-4xl sm:leading-relaxed md:text-5xl">
          {PROFILE.name.toUpperCase()}
        </h1>

        <p className="mt-4 max-w-xl text-base text-[var(--color-muted)] sm:text-lg">
          {PROFILE.title} · Interactive portfolio quest
        </p>
        <p className="mt-2 max-w-lg text-sm text-[var(--color-muted)]/80 sm:text-base">
          {PROFILE.tagline}
        </p>

        <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/80 px-3 py-3 backdrop-blur"
            >
              <div className="font-[family-name:var(--font-display)] text-[10px] text-[var(--color-accent)] sm:text-[11px]">
                {m.value}
              </div>
              <div className="mt-1 text-[11px] text-[var(--color-muted)]">{m.label}</div>
            </div>
          ))}
        </div>

        <motion.button
          type="button"
          onClick={onStart}
          className="pixel-border mt-10 rounded-md bg-[var(--color-accent)] px-8 py-4 font-[family-name:var(--font-display)] text-[11px] text-[var(--color-ink)] transition hover:brightness-110 active:translate-y-0.5 sm:text-xs"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          PRESS START
        </motion.button>

        <p className="mt-5 animate-blink font-[family-name:var(--font-display)] text-[9px] text-white/70 sm:text-[10px]">
          ENTER / CLICK TO BEGIN
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--color-muted)]">
          <span className="rounded border border-[var(--color-line)] px-2 py-1">
            ← → / A D move
          </span>
          <span className="rounded border border-[var(--color-line)] px-2 py-1">
            SPACE / W jump
          </span>
          <span className="rounded border border-[var(--color-line)] px-2 py-1">
            E inspect
          </span>
        </div>
      </motion.div>

      {/* Ground strip at bottom of title */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-16 border-t-4 border-[#1a3d2a] bg-gradient-to-b from-[#1f6b45] to-[#0f3d28]">
        <div
          className="h-full w-full opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0 28px, rgba(0,0,0,0.25) 28px 32px)',
          }}
        />
      </div>
    </div>
  )
}

function Stars() {
  const stars = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 70}%`,
    size: 1 + (i % 3),
    delay: (i % 8) * 0.2,
  }))

  return (
    <div className="absolute inset-0 z-0">
      {stars.map((s) => (
        <span
          key={s.id}
          className="animate-sparkle absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

function Hills() {
  return (
    <div className="absolute bottom-16 left-0 right-0 z-[1] h-40 overflow-hidden">
      <svg
        className="absolute bottom-0 h-full w-[200%] animate-[slide_40s_linear_infinite]"
        viewBox="0 0 1200 160"
        preserveAspectRatio="none"
        style={{ animation: 'none' }}
      >
        <path
          d="M0,160 L0,90 Q100,40 200,90 T400,90 T600,90 T800,90 T1000,90 T1200,90 L1200,160 Z"
          fill="#161b3a"
        />
        <path
          d="M0,160 L0,110 Q150,60 300,110 T600,110 T900,110 T1200,110 L1200,160 Z"
          fill="#1c2348"
          opacity="0.9"
        />
      </svg>
    </div>
  )
}
