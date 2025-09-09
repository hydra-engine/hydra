import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from '../core/game-node'

export class IntervalNode extends GameNode<EventMap> {
  interval: number
  #accumulated = 0
  #callback: () => void

  constructor(interval: number, callback: () => void) {
    super()
    this.interval = interval
    this.#callback = callback
  }

  override update(dt: number) {
    if (this.paused) return
    super.update(dt)

    this.#accumulated += dt
    if (this.#accumulated >= this.interval) {
      this.#accumulated %= this.interval
      this.#callback()
    }
  }
}
