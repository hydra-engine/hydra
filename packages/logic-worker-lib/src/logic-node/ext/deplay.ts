import { EventMap } from '@webtaku/event-emitter'
import { GameNode } from '../core/game-node'

export class DelayNode extends GameNode<EventMap> {
  #delay: number
  #accumulated = 0
  #callback: () => void

  constructor(delay: number, callback: () => void) {
    super()
    this.#delay = delay
    this.#callback = callback
  }

  override update(dt: number) {
    if (this.paused) return
    super.update(dt)

    this.#accumulated += dt
    if (this.#accumulated >= this.#delay) {
      this.#callback()
      this.remove()
    }
  }
}
