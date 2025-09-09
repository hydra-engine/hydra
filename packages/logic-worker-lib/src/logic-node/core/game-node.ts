import { EventEmitter, EventMap } from '@webtaku/event-emitter'

export abstract class GameNode<E extends EventMap> extends EventEmitter<E & {
  update: (dt: number) => void
}> {
  #parent?: GameNode<EventMap>
  protected children: GameNode<EventMap>[] = [];
  paused = false

  protected set parent(parent: GameNode<EventMap> | undefined) {
    this.#parent = parent
  }

  protected get parent() {
    return this.#parent
  }

  add(...children: GameNode<EventMap>[]) {
    for (const child of children) {

      // 기존 부모로부터 제거
      if (child.#parent) {
        const idx = child.#parent.children.indexOf(child)
        if (idx !== -1) child.#parent.children.splice(idx, 1)
      }

      // 새로운 부모 설정
      child.parent = this
      this.children.push(child)
    }
  }

  remove() {
    super.remove()

    // 부모로부터 제거
    if (this.#parent) {
      const idx = this.#parent.children.indexOf(this)
      if (idx !== -1) this.#parent.children.splice(idx, 1)
      this.#parent = undefined
    }

    // 자식 노드 제거
    for (const child of this.children) {
      child.parent = undefined
      child.remove()
    }
    this.children.length = 0
  }

  pause() {
    this.paused = true
    for (const child of this.children) {
      child.pause()
    }
  }

  resume() {
    this.paused = false
    for (const child of this.children) {
      child.resume()
    }
  }

  update(dt: number) {
    if (this.paused) return

    for (const child of this.children) {
      if (!child.paused) child.update(dt)
    }

    (this as any).emit('update', dt)
  }
}
