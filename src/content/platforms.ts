/** Simple axis-aligned platforms the player can land on (world coords). */
export interface Platform {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Keep clear of landmark / flag centers (approx):
 *   edu 1550, 1950
 *   jobs 2500, 3000, 4100, 5400, 6900
 *   project flags 5520, 5900, 7200
 *   start ~180–400 · contact ~9100
 *
 * Skills-zone pads (7850+) intentionally under orbs.
 */
export const PLATFORMS: Platform[] = [
  // Education — between posts, not on them
  { x: 1320, y: 495, width: 90, height: 16 },
  { x: 1720, y: 455, width: 90, height: 16 },
  { x: 2140, y: 495, width: 90, height: 16 },

  // Early career corridor
  { x: 2280, y: 490, width: 100, height: 16 },
  { x: 2740, y: 445, width: 90, height: 16 },
  { x: 3240, y: 490, width: 100, height: 16 },

  // NICE approaches (landmark 4100)
  { x: 3780, y: 490, width: 100, height: 16 },
  { x: 4320, y: 455, width: 90, height: 16 },

  // Rakuten approaches (landmark 5400) — stay left of project flags
  { x: 4920, y: 490, width: 100, height: 16 },
  { x: 5120, y: 430, width: 90, height: 16 },

  // After Rakuten project flags, before BILL
  { x: 6120, y: 480, width: 110, height: 16 },
  { x: 6300, y: 430, width: 90, height: 16 },

  // BILL approaches (landmark 6900) — left of Mandalore flag at 7200
  { x: 6480, y: 490, width: 100, height: 16 },
  { x: 6680, y: 445, width: 90, height: 16 },
  { x: 7420, y: 475, width: 100, height: 16 },

  // Skills vault — pads sit under orb circles (labels render above orbs).
  // Orb anchors ≈ 7900–8480; pad y is just below each cluster.
  { x: 7885, y: 475, width: 70, height: 14 }, // React / GraphQL cluster
  { x: 8025, y: 415, width: 70, height: 14 }, // TS / MFE
  { x: 8170, y: 385, width: 70, height: 14 }, // Full-stack / JS mid
  { x: 8335, y: 425, width: 70, height: 14 }, // Python / Docker
  { x: 8465, y: 495, width: 70, height: 14 }, // DataDog / Jest low step
]
