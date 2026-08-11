export type ZoneKind =
  | 'start'
  | 'education'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'contact'

export interface Metric {
  label: string
  value: string
}

export interface ExperienceRole {
  id: string
  company: string
  title: string
  location: string
  start: string
  end: string
  duration: string
  summary: string
  highlights: string[]
  tech: string[]
  accent: string
  /** World x position (center of landmark) */
  x: number
}

export interface EducationItem {
  id: string
  school: string
  /** Short label on the world landmark */
  shortLabel: string
  degree: string
  years: string
  summary: string
  highlights: string[]
  tech?: string[]
  x: number
}

export interface SkillOrb {
  id: string
  label: string
  category: 'language' | 'architecture' | 'platform' | 'testing'
  x: number
  y: number
}

export interface Project {
  id: string
  title: string
  blurb: string
  impact: string
  tags: string[]
  x: number
}

export interface Zone {
  id: string
  kind: ZoneKind
  title: string
  subtitle: string
  /** World x start */
  x: number
  /** Zone width */
  width: number
  color: string
}

export const PROFILE = {
  name: 'Joshua Higgins',
  shortName: 'Josh',
  title: 'Senior Software Engineer',
  location: 'Provo, UT',
  email: 'joshuamichaelhiggins@gmail.com',
  site: 'https://joshhiggins.dev',
  resumeUrl: '/Joshua-Higgins-Resume-2026.pdf',
  tagline:
    '9+ years building full-stack web apps — fintech integrations, micro-frontends, and migrations that actually ship.',
  oneLiner:
    'I own complex frontend systems, cut setup friction, and turn legacy platforms into experiences customers actually finish.',
} as const

export const METRICS: Metric[] = [
  { label: 'Years shipping', value: '9+' },
  { label: 'Setup time cut', value: 'days → min' },
  { label: 'Setup errors down', value: '95%' },
  { label: 'Customers migrated', value: '100%' },
]

/**
 * World layout + physics.
 * moveSpeed / gravity / jumpVelocity are tuned as “per 60fps frame” units;
 * GameWorld scales them by dt so 60Hz, 144Hz, and 240Hz feel the same.
 */
export const WORLD = {
  width: 9800,
  height: 720,
  groundY: 560,
  /** px/frame @ 60fps → scaled by dt in the game loop */
  gravity: 0.55,
  moveSpeed: 6.0,
  jumpVelocity: -13.8,
  /** Reference frame duration (ms) the physics numbers were tuned for */
  frameMs: 1000 / 60,
  playerWidth: 36,
  playerHeight: 48,
} as const

export const ZONES: Zone[] = [
  {
    id: 'start',
    kind: 'start',
    title: 'Spawn Point',
    subtitle: 'Who I am',
    x: 0,
    width: 1200,
    color: '#7c5cff',
  },
  {
    id: 'education',
    kind: 'education',
    title: 'Training Grounds',
    subtitle: 'Education',
    x: 1200,
    width: 1100,
    color: '#3b82f6',
  },
  {
    id: 'early',
    kind: 'experience',
    title: 'Level 1 · Foundations',
    subtitle: 'Early career',
    x: 2300,
    width: 1400,
    color: '#22d3a6',
  },
  {
    id: 'nice',
    kind: 'experience',
    title: 'Level 2 · Reliability',
    subtitle: 'NICE inContact',
    x: 3700,
    width: 1100,
    color: '#f59e0b',
  },
  {
    id: 'rakuten',
    kind: 'experience',
    title: 'Level 3 · Analytics',
    subtitle: 'Rakuten Advertising',
    x: 4800,
    width: 1400,
    color: '#ec4899',
  },
  {
    id: 'bill',
    kind: 'experience',
    title: 'Level 4 · Fintech Boss',
    subtitle: 'BILL (Divvy)',
    x: 6200,
    width: 1500,
    color: '#22d3a6',
  },
  {
    id: 'skills',
    kind: 'skills',
    title: 'Power-Up Vault',
    subtitle: 'Skills',
    x: 7700,
    width: 1100,
    color: '#a78bfa',
  },
  {
    id: 'contact',
    kind: 'contact',
    title: 'Continue? Y / N',
    subtitle: "Let's talk",
    x: 8800,
    width: 1000,
    color: '#38bdf8',
  },
]

/** World order is chronological left → right: Dixie first, BYU–Idaho (degree) last. */
export const EDUCATION: EducationItem[] = [
  {
    id: 'dixie',
    school: 'Dixie State University',
    shortLabel: 'Dixie',
    degree: 'Computer Science coursework',
    years: '2014 – 2015',
    summary:
      'Started my CS path at Dixie State before transferring to finish a software engineering degree.',
    highlights: [
      'Foundational computer science coursework that set up the transfer to BYU–Idaho.',
    ],
    x: 1550,
  },
  {
    id: 'byui',
    school: 'Brigham Young University – Idaho',
    shortLabel: 'BYU–I',
    degree: 'B.S. Computer Software Engineering',
    years: '2015 – 2018',
    summary:
      'Completed my B.S. in Computer Software Engineering. Senior project: a small automated greenhouse with sensors, actuators, and a local management website.',
    highlights: [
      'Senior project: built a small greenhouse instrumented with soil moisture, air humidity, temperature, and related sensors.',
      'If soil was too dry, the system automatically turned on a water pump; if it was too cold, it turned on a heat lamp.',
      'Ran a local website to view live stats and a camera feed, and to manually control pumps, lamps, and other actuators when needed.',
      'End-to-end embedded + web system: sensing, automation logic, and a human-friendly control UI.',
    ],
    tech: [
      'Sensors',
      'IoT / embedded',
      'Automation',
      'Local web UI',
      'Live camera feed',
    ],
    x: 1950,
  },
]

export const EXPERIENCE: ExperienceRole[] = [
  {
    id: 'byui-work',
    company: 'BYU–Idaho',
    title: 'Backend Developer',
    location: 'Rexburg, ID',
    start: 'Jun 2015',
    end: 'Dec 2016',
    duration: '1 yr 7 mos',
    summary: 'Built CMS page types with Ingeniux while finishing my degree.',
    highlights: [
      'Created reusable page types and backend patterns for university content.',
      'Learned shipping under real editorial deadlines.',
    ],
    tech: ['C#', 'CMS', 'Ingeniux'],
    accent: '#3b82f6',
    x: 2500,
  },
  {
    id: 'instructure',
    company: 'Instructure',
    title: 'Software Engineer Intern',
    location: 'Salt Lake City, UT',
    start: 'Jan 2017',
    end: 'Apr 2017',
    duration: '4 mos',
    summary: 'Internship on production education software.',
    highlights: [
      'Contributed to real product work in a high-velocity engineering culture.',
      'Leveled up collaboration, code review, and delivery habits.',
    ],
    tech: ['JavaScript', 'Ruby', 'Education tech'],
    accent: '#ef4444',
    x: 3000,
  },
  {
    id: 'nice',
    company: 'NICE inContact',
    title: 'Software Engineer',
    location: 'Sandy, UT',
    start: 'May 2017',
    end: 'Mar 2018',
    duration: '11 mos',
    summary:
      'Built high-availability tooling for safe blue-green style environment switchovers.',
    highlights: [
      'Developed an internal HA maintenance tool so admins could see the active environment and perform safe primary/secondary switchovers.',
      'Implemented full failover: spin up standby, validate readiness, shut down previous instance — with safeguards against data loss.',
      'Saved sysadmins hours on routine environment management during migrations.',
    ],
    tech: ['Full-stack', 'Cloud HA', 'Ops tooling'],
    accent: '#f59e0b',
    x: 4100,
  },
  {
    id: 'rakuten',
    company: 'Rakuten Advertising',
    title: 'Full Stack Developer',
    location: 'Cottonwood Heights, UT',
    start: 'Mar 2018',
    end: 'Sep 2021',
    duration: '3 yrs 7 mos',
    summary:
      'Helped design and ship Insights & Analytics Portal — then migrated 100% of customers off the legacy system.',
    highlights: [
      'Co-built IAP, the next-gen reporting platform for publishers and networks.',
      'Built Annotations: threaded discussion on specific chart data points, replacing screenshot-and-Slack workflows.',
      'Implemented interactive visualization with custom D3.js charts.',
      'Created a Django migration tool that automated legacy → new platform data transfer, saving support weeks of work.',
    ],
    tech: ['React', 'D3.js', 'Django', 'Analytics'],
    accent: '#ec4899',
    x: 5400,
  },
  {
    id: 'bill',
    company: 'BILL (Divvy)',
    title: 'Software Engineer',
    location: 'Remote · Draper, UT',
    start: 'Sep 2021',
    end: 'Jun 2026',
    duration: '4 yrs 10 mos',
    summary:
      'Primary frontend engineer for accounting integrations after the Divvy–BILL acquisition.',
    highlights: [
      'Owned integrations with QuickBooks, NetSuite, Sage Intacct, Acumatica, Rillet, and more — cutting full customer setup from up to a day down to 5 minutes–1 hour.',
      'Designed Mandalore, an MFE proof of concept that extracted accounting integrations from a monolith and informed later micro-frontend work.',
      'Built DataDog dashboards for page-load, errors, and key flows; used them to find and fix performance issues.',
      'Built migration systems (global alerts, real-time progress, background jobs) that moved 100% of customers to the new setup experience.',
      'Reduced setup errors by 95%, freeing product from constant troubleshooting.',
    ],
    tech: ['React', 'TypeScript', 'MFE', 'GraphQL', 'DataDog'],
    accent: '#22d3a6',
    x: 6900,
  },
]

/** Orb y is the circle top; labels draw above. Keep orbs above nearby pads. */
export const SKILL_ORBS: SkillOrb[] = [
  { id: 'react', label: 'React', category: 'language', x: 7900, y: 400 },
  { id: 'ts', label: 'TypeScript', category: 'language', x: 8050, y: 340 },
  { id: 'js', label: 'JavaScript', category: 'language', x: 8200, y: 400 },
  { id: 'python', label: 'Python / Django', category: 'language', x: 8350, y: 350 },
  { id: 'mfe', label: 'Micro-frontends', category: 'architecture', x: 8000, y: 260 },
  { id: 'fullstack', label: 'Full-stack', category: 'architecture', x: 8180, y: 230 },
  { id: 'migration', label: 'Platform migrations', category: 'architecture', x: 8360, y: 270 },
  { id: 'graphql', label: 'GraphQL', category: 'platform', x: 7920, y: 500 },
  { id: 'pg', label: 'PostgreSQL', category: 'platform', x: 8120, y: 505 },
  { id: 'docker', label: 'Docker', category: 'platform', x: 8300, y: 500 },
  { id: 'datadog', label: 'DataDog', category: 'platform', x: 8480, y: 415 },
  { id: 'jest', label: 'Jest + RTL', category: 'testing', x: 8450, y: 310 },
]

export const PROJECTS: Project[] = [
  {
    id: 'iap',
    title: 'Insights & Analytics Portal',
    blurb:
      'Next-gen reporting platform for Rakuten Advertising publishers and networks.',
    impact: '100% customer migration off the legacy system.',
    tags: ['React', 'D3.js', 'Analytics'],
    // Sit in clear air after Rakuten landmark (5400), before mid platforms
    x: 5520,
  },
  {
    id: 'annotations',
    title: 'Chart Annotations',
    blurb:
      'Threaded comments on specific data points inside interactive D3 charts.',
    impact: 'Replaced screenshot-and-Slack collaboration.',
    tags: ['D3.js', 'UX', 'Collaboration'],
    x: 5900,
  },
  {
    id: 'mandalore',
    title: 'Mandalore MFE',
    blurb:
      'Micro-frontend proof of concept that extracted accounting integrations from a large monolith.',
    impact: 'Informed the architecture of improved setup flows.',
    tags: ['MFE', 'React', 'Migration'],
    // After BILL landmark (6900), clear of approach pads
    x: 7200,
  },
]

export function zoneAt(x: number): Zone {
  for (let i = ZONES.length - 1; i >= 0; i--) {
    const z = ZONES[i]
    if (x >= z.x) return z
  }
  return ZONES[0]
}

export function nearestExperience(x: number, radius = 160): ExperienceRole | null {
  let best: ExperienceRole | null = null
  let bestDist = radius
  for (const role of EXPERIENCE) {
    const d = Math.abs(role.x - x)
    if (d < bestDist) {
      bestDist = d
      best = role
    }
  }
  return best
}

export function nearestEducation(x: number, radius = 140): EducationItem | null {
  let best: EducationItem | null = null
  let bestDist = radius
  for (const item of EDUCATION) {
    const d = Math.abs(item.x - x)
    if (d < bestDist) {
      bestDist = d
      best = item
    }
  }
  return best
}
