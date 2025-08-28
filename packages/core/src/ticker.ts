export class Ticker {
  #fixedFps?: number
  #frameId = 0;

  constructor(onTick: (deltaTime: number) => void, fixedFps?: number) {
    this.#fixedFps = fixedFps !== undefined && fixedFps > 0 ? fixedFps : undefined

    let lastTime = performance.now()
    let lagSeconds = 0

    const tick = (timestamp: number) => {
      this.#frameId = requestAnimationFrame(tick)
      const deltaTime = (timestamp - lastTime) / 1000
      if (deltaTime <= 0) return
      lastTime = timestamp

      if (this.#fixedFps !== undefined) {
        const fixedStep = 1 / this.#fixedFps
        lagSeconds += deltaTime

        if (lagSeconds >= fixedStep) {
          onTick(fixedStep)
          if (lagSeconds >= fixedStep * 2) {
            onTick(deltaTime)
            lagSeconds = 0
          } else {
            lagSeconds -= fixedStep
          }
        }
      } else {
        onTick(deltaTime)
      }
    }

    this.#frameId = requestAnimationFrame(tick)
  }

  setFixedFps(fps: number) {
    this.#fixedFps = fps > 0 ? fps : undefined
  }

  disableFixedFps() {
    this.#fixedFps = undefined
  }

  destroy() {
    cancelAnimationFrame(this.#frameId)
  }
}
