import { Container } from 'pixi.js'

export class RenderableNode {
  pixiContainer = new Container()
  seenPass?: number

  remove() {
    this.pixiContainer.destroy()
  }
}
