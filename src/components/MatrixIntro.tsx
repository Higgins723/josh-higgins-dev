import React, { useRef, useEffect } from 'react'

// Constants for customization
const NAME = "Josh Higgins" // Your name to display
const FONT_SIZE = 16 // Font size in pixels
const START_STAGGER = 100 // Max frames to stagger initial column starts (higher = more gradual start)
const REVEAL_SPREAD = 50 // Max frames variation for name reveal timing (smaller = quicker full name reveal)
const MATRIX_COLOR = "#0F0" // Color of the rain
const NAME_COLOR = "#FFF" // Color of the fixed name and button
const TRANSITION_DURATION = 1000 // Duration in ms for color transition of name letters
const SHADOW_BLUR = 1 // Blur radius for the glow effect on name (reduced for less blur)
const TRAIL_ALPHA = 0.05 // Alpha for the fading trail (smaller = longer trail)
const FRAME_RATE = 33 // Milliseconds per frame (smaller = faster rain)
const RESET_PROB = 0.975 // Probability threshold for resetting a drop (higher = more gaps)
const KATAKANA = "ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズソゾタダチジッツヅテデトドナニヌネノバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺー0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" // Characters for rain

interface ComponentProps {
  continueBtn: () => void
}

const MatrixIntro = ({ continueBtn }: ComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    if (!ctx) return

    let columns: number
    let rows: number
    let nameRow: number
    let nameColStart: number
    let drops: number[]
    let fixed: Record<number, { char: string, revealTime: number }>[]
    let namePositions: { col: number, char: string }[]
    let revealed: number
    let nameCols: Set<number>
    let offsetX: number
    let offsetY: number

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      columns = Math.floor(window.innerWidth / FONT_SIZE)
      rows = Math.floor(window.innerHeight / FONT_SIZE)
      offsetX = (window.innerWidth - columns * FONT_SIZE) / 2
      offsetY = (window.innerHeight - rows * FONT_SIZE) / 2
      nameRow = Math.floor(rows / 2)
      nameColStart = Math.round((columns - NAME.length) / 2)

      drops = new Array(columns).fill(0)
      fixed = Array.from({ length: columns }, () => ({}))
      namePositions = []
      revealed = 0

      // Set up name positions (skipping spaces for revealing, but preserving positions)
      for (let i = 0; i < NAME.length; i++) {
        const col = nameColStart + i
        const char = NAME[i]
        if (char !== " ") {
          namePositions.push({ col, char })
        }
      }

      nameCols = new Set(namePositions.map(p => p.col))

      // Set random delays for name columns
      for (const col of nameCols) {
        drops[col] = -Math.floor(Math.random() * REVEAL_SPREAD)
      }

      // Stagger non-name columns
      for (let i = 0; i < columns; i++) {
        if (!nameCols.has(i)) {
          drops[i] = -Math.floor(Math.random() * START_STAGGER)
        }
      }

      // Setup button position
      if (buttonRef.current) {
        buttonRef.current.style.top = `${offsetY + (nameRow + 1) * FONT_SIZE + FONT_SIZE}px`
        buttonRef.current.style.display = "none"
      }
    }

    // Setup button styles and onclick
    const button = buttonRef.current
    if (button) {
      button.style.position = "fixed"
      button.style.left = "50%"
      button.style.transform = "translateX(-50%)"
      button.style.color = NAME_COLOR
      button.style.background = "transparent"
      button.style.border = `1px solid ${NAME_COLOR}`
      button.style.fontFamily = "monospace"
      button.style.fontSize = `${FONT_SIZE}px`
      button.style.padding = "10px 20px"
      button.style.cursor = "pointer"
      button.style.textShadow = `0 0 5px ${NAME_COLOR}`
      button.style.boxShadow = `0 0 5px ${NAME_COLOR}`
      button.onclick = () => {
        continueBtn()
      }
    }

    init()

    function showButton() {
      if (button) {
        button.style.display = "block"
      }
    }

    function hexToRgb(hex: string): [number, number, number] {
      hex = hex.replace(/^#/, '')
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('')
      }
      const num = parseInt(hex, 16)
      const r = (num >> 16) & 255
      const g = (num >> 8) & 255
      const b = num & 255
      return [r, g, b]
    }

    function rgbToHex(r: number, g: number, b: number): string {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    }

    function interpolateColor(c1: string, c2: string, factor: number): string {
      const [r1, g1, b1] = hexToRgb(c1)
      const [r2, g2, b2] = hexToRgb(c2)
      const r = Math.round(r1 + (r2 - r1) * factor)
      const g = Math.round(g1 + (g2 - g1) * factor)
      const b = Math.round(b1 + (b2 - b1) * factor)
      return rgbToHex(r, g, b)
    }

    function draw() {
      ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_ALPHA})`
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      ctx.font = `${FONT_SIZE}px monospace`

      const currentTime = Date.now()

      // Draw fixed letters glow
      ctx.shadowBlur = SHADOW_BLUR
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      for (let col = 0; col < columns; col++) {
        for (let r in fixed[col]) {
          const { char, revealTime } = fixed[col][r]
          const age = (currentTime - revealTime) / TRANSITION_DURATION
          const factor = Math.min(age, 1)
          const color = interpolateColor(MATRIX_COLOR, NAME_COLOR, factor)
          ctx.fillStyle = color
          ctx.shadowColor = color
          ctx.fillText(char, col * FONT_SIZE + offsetX, Number(r) * FONT_SIZE + offsetY)
        }
      }

      // Draw fixed letters crisp on top
      ctx.shadowBlur = 0
      for (let col = 0; col < columns; col++) {
        for (let r in fixed[col]) {
          const { char, revealTime } = fixed[col][r]
          const age = (currentTime - revealTime) / TRANSITION_DURATION
          const factor = Math.min(age, 1)
          const color = interpolateColor(MATRIX_COLOR, NAME_COLOR, factor)
          ctx.fillStyle = color
          ctx.fillText(char, col * FONT_SIZE + offsetX, Number(r) * FONT_SIZE + offsetY)
        }
      }

      // Draw falling rain
      ctx.fillStyle = MATRIX_COLOR
      for (let i = 0; i < columns; i++) {
        if (drops[i] > 0 && drops[i] <= rows) {
          let text = KATAKANA[Math.floor(Math.random() * KATAKANA.length)]

          // Check if at name row in a name column and not yet revealed
          if (drops[i] === nameRow && nameCols.has(i) && !fixed[i][nameRow]) {
            const pos = namePositions.find(p => p.col === i)
            if (pos) {
              text = pos.char
              fixed[i][nameRow] = { char: text, revealTime: Date.now() }
              revealed++
              if (revealed === namePositions.length) {
                showButton()
              }
            }
          }

          ctx.fillText(text, i * FONT_SIZE + offsetX, drops[i] * FONT_SIZE + offsetY)
        }

        // Reset if off screen
        if ((drops[i] * FONT_SIZE + offsetY) > window.innerHeight && Math.random() > RESET_PROB) {
          drops[i] = 0
        }

        drops[i]++
      }
    }

    const interval = setInterval(draw, FRAME_RATE)

    const handleResize = () => {
      init()
      // Force a redraw after resize
      draw()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, background: 'black' }} />
      <button ref={buttonRef}>Continue</button>
    </>
  )
}

export default MatrixIntro
