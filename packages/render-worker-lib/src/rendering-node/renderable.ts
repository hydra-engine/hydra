import { Container } from 'pixi.js'

export class RenderableNode<T extends Container = Container> {
  seenPass?: number

  constructor(public pixiContainer: T) { }

  remove() {
    this.pixiContainer.destroy()
  }
}
