import {
  EDUCATION,
  EXPERIENCE,
  METRICS,
  PROFILE,
  PROJECTS,
  SKILL_ORBS,
  WORLD,
  ZONES,
  type SkillOrb,
} from '../content/portfolio'

interface WorldDecorProps {
  collectedSkills: Set<string>
}

/**
 * Paint order / z-index map (world space):
 *  0  sky, mountains, zone tints
 *  2  ground
 *  5  jump platforms (behind landmarks)
 * 15  signs, buildings, flags, metrics, contact
 * 20  skill orbs
 * 30  player (GameWorld)
 */
export function WorldDecor({ collectedSkills }: WorldDecorProps) {
  return (
    <>
      <Sky />
      <ParallaxMountains />
      <ZoneBands />
      <Ground />
      <StartSign />
      <EducationLandmarks />
      <ExperienceLandmarks />
      <ProjectFlags />
      <SkillOrbs collected={collectedSkills} />
      <ContactGate />
      <FloatingMetrics />
    </>
  )
}

function Sky() {
  return (
    <div
      className="absolute left-0 top-0 z-0 h-full"
      style={{
        width: WORLD.width,
        background:
          'linear-gradient(180deg, #070b18 0%, #12153a 42%, #2a1a4a 72%, #1a2a3a 100%)',
      }}
    >
      {/* Stars */}
      {Array.from({ length: 80 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{
            left: (i * 137) % WORLD.width,
            top: (i * 97) % 280,
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            opacity: 0.25 + (i % 5) * 0.12,
          }}
        />
      ))}
      {/* Soft moons / glow orbs for atmosphere */}
      <div
        className="absolute rounded-full bg-[#c4b5fd]/20 blur-3xl"
        style={{ left: 900, top: 60, width: 180, height: 180 }}
      />
      <div
        className="absolute rounded-full bg-[#22d3a6]/10 blur-3xl"
        style={{ left: 6400, top: 40, width: 220, height: 220 }}
      />
    </div>
  )
}

function ParallaxMountains() {
  return (
    <svg
      className="absolute left-0 z-0"
      style={{ top: WORLD.groundY - 220, width: WORLD.width, height: 220 }}
      viewBox={`0 0 ${WORLD.width} 220`}
      preserveAspectRatio="none"
    >
      <path
        d={mountainPath(0.35, 80, 0.0011)}
        fill="#121833"
        opacity="0.95"
      />
      <path
        d={mountainPath(0.55, 50, 0.0018)}
        fill="#182044"
        opacity="0.9"
      />
    </svg>
  )
}

function mountainPath(amp: number, base: number, freq: number) {
  const h = 220
  let d = `M0,${h} L0,${h - base}`
  for (let x = 0; x <= WORLD.width; x += 40) {
    const y =
      h -
      base -
      Math.abs(Math.sin(x * freq) * 70 * amp) -
      Math.abs(Math.sin(x * freq * 2.3) * 30 * amp)
    d += ` L${x},${y}`
  }
  d += ` L${WORLD.width},${h} Z`
  return d
}

function ZoneBands() {
  return (
    <>
      {ZONES.map((z) => (
        <div
          key={z.id}
          className="absolute bottom-0 opacity-[0.07]"
          style={{
            left: z.x,
            width: z.width,
            height: WORLD.height,
            background: `linear-gradient(180deg, transparent 30%, ${z.color})`,
          }}
        />
      ))}
      {/* Zone labels floating mid-sky */}
      {ZONES.map((z) => (
        <div
          key={`${z.id}-label`}
          className="absolute select-none"
          style={{ left: z.x + 40, top: 100 }}
        >
          <div
            className="font-[family-name:var(--font-display)] text-[10px] tracking-wide opacity-40"
            style={{ color: z.color }}
          >
            {z.title}
          </div>
        </div>
      ))}
    </>
  )
}

function Ground() {
  const tileW = 48
  const tiles = Math.ceil(WORLD.width / tileW) + 1
  return (
    <div
      className="absolute left-0 z-[2]"
      style={{ top: WORLD.groundY, width: WORLD.width, height: WORLD.height - WORLD.groundY }}
    >
      {/* Grass top */}
      <div className="h-4 w-full border-t-4 border-[#2d8a55] bg-gradient-to-b from-[#3ecf7a] to-[#1f8a4d]" />
      {/* Dirt */}
      <div
        className="h-full w-full bg-gradient-to-b from-[#5c3a1e] via-[#3d2614] to-[#24160c]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent 0 44px, rgba(0,0,0,0.18) 44px 48px), repeating-linear-gradient(0deg, transparent 0 20px, rgba(0,0,0,0.12) 20px 24px)',
        }}
      />
      {/* Decorative bricks along the surface edge */}
      <div className="absolute left-0 top-4 flex">
        {Array.from({ length: tiles }, (_, i) => (
          <div
            key={i}
            className="h-3 border-r border-black/20"
            style={{
              width: tileW,
              background: i % 2 === 0 ? 'rgba(0,0,0,0.12)' : 'transparent',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function StartSign() {
  return (
    <div className="absolute z-[15]" style={{ left: 180, top: WORLD.groundY - 200 }}>
      <div className="animate-float rounded-xl border-2 border-[var(--color-accent-2)] bg-[var(--color-panel)] px-5 py-4 shadow-xl">
        <p className="font-[family-name:var(--font-display)] text-[9px] text-[var(--color-accent)]">
          LEVEL 0
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">{PROFILE.name}</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{PROFILE.title}</p>
        <p className="mt-3 max-w-[240px] text-xs leading-relaxed text-[var(--color-muted)]">
          {PROFILE.oneLiner}
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-[8px] text-white/50">
          → WALK RIGHT TO BEGIN
        </p>
      </div>
      {/* Post */}
      <div className="mx-auto h-16 w-2 bg-[#5c3a1e]" />
    </div>
  )
}

function EducationLandmarks() {
  return (
    <>
      {EDUCATION.map((ed) => (
        <div
          key={ed.id}
          className="absolute z-[15]"
          style={{ left: ed.x - 40, top: WORLD.groundY - 130 }}
        >
          <div className="flex flex-col items-center">
            <div
              className="flex h-16 w-20 items-end justify-center rounded-t-md border-2 border-[#60a5fa] bg-gradient-to-b from-[#1e3a5f] to-[#0f2744] shadow-lg"
              style={{ boxShadow: '0 0 20px rgba(59,130,246,0.35)' }}
            >
              <div className="mb-1 font-[family-name:var(--font-display)] text-[8px] text-[#93c5fd]">
                EDU
              </div>
            </div>
            <div className="mt-1 max-w-[120px] text-center text-[10px] font-medium text-white/80">
              {ed.shortLabel}
            </div>
            <div className="h-8 w-1.5 bg-[#5c3a1e]" />
          </div>
        </div>
      ))}
    </>
  )
}

function ExperienceLandmarks() {
  return (
    <>
      {EXPERIENCE.map((role) => (
        <div
          key={role.id}
          className="absolute z-[15]"
          style={{ left: role.x - 50, top: WORLD.groundY - 170 }}
        >
          <div className="flex flex-col items-center">
            {/* Castle / building */}
            <div
              className="relative w-[100px] rounded-md border-2 bg-[var(--color-panel)] px-2 pb-2 pt-3 shadow-xl"
              style={{
                borderColor: role.accent,
                boxShadow: `0 0 24px ${role.accent}55`,
              }}
            >
              <div
                className="absolute -top-3 left-1/2 h-3 w-10 -translate-x-1/2 rounded-t-sm"
                style={{ background: role.accent }}
              />
              <p className="text-center font-[family-name:var(--font-display)] text-[7px] leading-tight"
                style={{ color: role.accent }}
              >
                {role.end === 'Jun 2026' || role.end.includes('Present')
                  ? 'BOSS'
                  : 'STAGE'}
              </p>
              <p className="mt-1 truncate text-center text-[11px] font-semibold text-white">
                {shortCompany(role.company)}
              </p>
              <p className="truncate text-center text-[9px] text-[var(--color-muted)]">
                {role.start.split(' ')[1]}
              </p>
              {/* Windows */}
              <div className="mt-2 flex justify-center gap-1">
                <span className="h-2 w-2 rounded-[1px] bg-[#fde68a]/80" />
                <span className="h-2 w-2 rounded-[1px] bg-[#fde68a]/80" />
                <span className="h-2 w-2 rounded-[1px] bg-[#fde68a]/50" />
              </div>
            </div>
            <div className="h-10 w-2 bg-[#5c3a1e]" />
            {/* Glow pad on ground */}
            <div
              className="h-2 w-16 rounded-full opacity-70"
              style={{
                background: `radial-gradient(circle, ${role.accent} 0%, transparent 70%)`,
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}

function ProjectFlags() {
  return (
    <>
      {PROJECTS.map((p) => (
        <div
          key={p.id}
          className="absolute z-[18]"
          style={{ left: p.x - 20, top: WORLD.groundY - 175 }}
        >
          <div className="flex flex-col items-center">
            <div className="max-w-[160px] rounded border-2 border-[var(--color-warn)] bg-[var(--color-panel)] px-2.5 py-1.5 text-center text-[9px] font-medium leading-snug text-[var(--color-warn)] shadow-lg">
              {p.title}
            </div>
            <div className="h-16 w-0.5 bg-[var(--color-warn)]" />
          </div>
        </div>
      ))}
    </>
  )
}

function SkillOrbs({ collected }: { collected: Set<string> }) {
  return (
    <>
      {SKILL_ORBS.map((orb) =>
        collected.has(orb.id) ? null : (
          <SkillOrbView key={orb.id} orb={orb} />
        ),
      )}
    </>
  )
}

function SkillOrbView({ orb }: { orb: SkillOrb }) {
  const color = categoryColor(orb.category)
  return (
    <div
      className="absolute z-[22] animate-bob"
      style={{ left: orb.x, top: orb.y, animationDelay: `${orb.x % 5}00ms` }}
    >
      {/* Label above the orb so jump pads never cover the text */}
      <div
        className="absolute bottom-12 left-1/2 z-10 w-max max-w-[9rem] -translate-x-1/2 rounded-md border px-1.5 py-0.5 text-center text-[9px] font-semibold leading-tight shadow-md"
        style={{
          color,
          borderColor: `${color}88`,
          background: 'var(--color-panel)',
        }}
      >
        {orb.label}
      </div>
      <div
        className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-lg"
        style={{
          borderColor: color,
          background: `${color}33`,
          boxShadow: `0 0 16px ${color}88`,
        }}
      >
        <span className="font-[family-name:var(--font-display)] text-[8px] text-white">
          ★
        </span>
      </div>
    </div>
  )
}

function ContactGate() {
  return (
    <div className="absolute z-[15]" style={{ left: 9100, top: WORLD.groundY - 210 }}>
      <div className="rounded-xl border-2 border-[#38bdf8] bg-[var(--color-panel)] px-6 py-5 shadow-2xl"
        style={{ boxShadow: '0 0 32px rgba(56,189,248,0.35)' }}
      >
        <p className="font-[family-name:var(--font-display)] text-[9px] text-[#38bdf8]">
          CONTINUE?
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">Let&apos;s talk</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Walk up and press E — or just approach the gate
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded bg-[#38bdf8] px-3 py-1 font-[family-name:var(--font-display)] text-[9px] text-[var(--color-ink)]">
            Y
          </span>
          <span className="rounded border border-[var(--color-line)] px-3 py-1 font-[family-name:var(--font-display)] text-[9px] text-[var(--color-muted)]">
            N
          </span>
        </div>
      </div>
    </div>
  )
}

function FloatingMetrics() {
  // Impact numbers near BILL zone
  return (
    <div className="absolute z-[15] flex gap-3" style={{ left: 6550, top: 160 }}>
      {METRICS.map((m, i) => (
        <div
          key={m.label}
          className="animate-float rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2"
          style={{ animationDelay: `${i * 0.3}s` }}
        >
          <div className="font-[family-name:var(--font-display)] text-[9px] text-[var(--color-accent)]">
            {m.value}
          </div>
          <div className="mt-1 text-[10px] text-[var(--color-muted)]">{m.label}</div>
        </div>
      ))}
    </div>
  )
}

function shortCompany(name: string) {
  if (name.includes('BILL')) return 'BILL'
  if (name.includes('Rakuten')) return 'Rakuten'
  if (name.includes('NICE')) return 'NICE'
  if (name.includes('Instructure')) return 'Instructure'
  if (name.includes('BYU')) return 'BYU–I'
  return name
}

function categoryColor(cat: SkillOrb['category']) {
  switch (cat) {
    case 'language':
      return '#22d3a6'
    case 'architecture':
      return '#a78bfa'
    case 'platform':
      return '#38bdf8'
    case 'testing':
      return '#fbbf24'
  }
}
