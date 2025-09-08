const PR = window.devicePixelRatio
const WIDTH = 80 * PR
const HEIGHT = 48 * PR
const TEXT_X = 3 * PR
const TEXT_Y = 2 * PR
const GRAPH_X = 3 * PR
const GRAPH_Y = 15 * PR
const GRAPH_WIDTH = 74 * PR
const GRAPH_HEIGHT = 30 * PR

const round = Math.round

// ---------- Color helpers ----------
function hexToRgb(hex: string) {
  const s = hex.replace('#', '')
  const v = s.length === 3
    ? s.split('').map(ch => ch + ch).join('')
    : s
  const num = parseInt(v, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max - min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60
  }
  return { h, s, l }
}

function hslToHex(h: number, s: number, l: number) {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0

  if (0 <= h && h < 60) { r = c; g = x; b = 0 }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0 }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c }
  else { r = c; g = 0; b = x }

  const toHex = (v: number) => {
    const n = Math.round((v + m) * 255)
    return n.toString(16).padStart(2, '0')
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function shiftHexHue(hex: string, hueDelta: number, lightnessDelta = 0) {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  const h2 = (h + hueDelta) % 360
  const l2 = Math.max(0, Math.min(1, l + lightnessDelta))
  return hslToHex(h2 < 0 ? h2 + 360 : h2, s, l2)
}

// ---------- FPS Display ----------
export class FpsDisplay {
  static #instanceCount = 0

  #canvas: HTMLCanvasElement
  #context: CanvasRenderingContext2D

  #title: string
  #min = Infinity
  #max = 0
  #currentFps = 0

  #intervalId: number

  // per-instance palette
  #fg: string
  #bg: string

  constructor(container: HTMLElement, title: string) {
    this.#title = title

    // palette: base colors + small shift per instance
    const idx = FpsDisplay.#instanceCount++
    const hueStep = 18 // degrees per instance (조금씩 변화)
    this.#fg = shiftHexHue('#0ff', idx * hueStep, 0)      // 밝은 전경
    this.#bg = shiftHexHue('#002', idx * hueStep, 0.02)   // 너무 어둡지 않게 살짝 밝게

    const canvas = document.createElement('canvas')
    container.appendChild(canvas)

    canvas.width = WIDTH
    canvas.height = HEIGHT
    canvas.style.cssText = 'width:80px;height:48px'

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D context not available')

    // text & baseline
    ctx.font = `bold ${9 * PR}px Helvetica,Arial,sans-serif`
    ctx.textBaseline = 'top'

    // background
    ctx.globalAlpha = 1
    ctx.fillStyle = this.#bg
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    // title + graph frame
    ctx.fillStyle = this.#fg
    ctx.fillText(title, TEXT_X, TEXT_Y)
    ctx.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

    // graph area overlay
    ctx.fillStyle = this.#bg
    ctx.globalAlpha = 0.9
    ctx.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

    this.#canvas = canvas
    this.#context = ctx

    // start updating once per second
    this.#intervalId = setInterval(() => this.#drawGraph(), 1000) as unknown as number
  }

  #drawGraph() {
    const ctx = this.#context
    if (this.#min === Infinity) return

    // header area
    ctx.globalAlpha = 1
    ctx.fillStyle = this.#bg
    ctx.fillRect(0, 0, WIDTH, GRAPH_Y)

    ctx.fillStyle = this.#fg
    const label = `${round(this.#currentFps)} ${this.#title} (${round(this.#min)}-${round(this.#max)})`
    ctx.fillText(label, TEXT_X, TEXT_Y)

    // scroll graph left by 1px (PR units)
    ctx.drawImage(
      this.#canvas,
      GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT,
      GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT
    )

    // rightmost new column background
    ctx.fillStyle = this.#fg
    ctx.globalAlpha = 1
    ctx.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT)

    // draw value column
    ctx.fillStyle = this.#bg
    ctx.globalAlpha = 0.9
    const max = this.#max < 100 ? 100 : this.#max
    const emptyHeight = round((1 - (this.#currentFps / max)) * GRAPH_HEIGHT)
    ctx.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, emptyHeight)

    // restore alpha for next pass
    ctx.globalAlpha = 1
  }

  set fps(fps: number) {
    this.#min = Math.min(this.#min, fps)
    this.#max = Math.max(this.#max, fps)
    this.#currentFps = fps
  }

  get fps() { return this.#currentFps }

  remove() {
    clearInterval(this.#intervalId)
    this.#canvas.remove()
  }
}
