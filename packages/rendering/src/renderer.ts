import { ObjectStateTree, ROOT } from '@kiwiengine/core'
import { autoDetectRenderer, Container, DOMAdapter, ICanvas, Renderer as PixiRenderer, WebWorkerAdapter } from 'pixi.js'

const SEEN_GEN = Symbol('seenGen')

export class Renderer {
  readonly #canvas: ICanvas
  readonly #objectStateTree: ObjectStateTree

  #pixiRenderer?: PixiRenderer
  readonly #root = new Container({ sortableChildren: true })
  readonly #containers = new Map<number, Container>()
  #generation = 0

  constructor(
    canvas: ICanvas,
    objectStateTree: ObjectStateTree,
  ) {
    this.#canvas = canvas
    this.#objectStateTree = objectStateTree
    this.#init()
  }

  async #init() {
    this.#pixiRenderer = await autoDetectRenderer({
      canvas: this.#canvas,
    })
  }

  render() {
    const renderer = this.#pixiRenderer
    if (!renderer) return

    const gen = ++this.#generation
    let zIndex = 0

    this.#objectStateTree.forEach((id) => {
      if (id === ROOT) return

      let container = this.#containers.get(id)
      if (!container) {
        container = new Container()
        this.#containers.set(id, container)
        this.#root.addChild(container)
      }

      container.x = this.#objectStateTree.getX(id)
      container.y = this.#objectStateTree.getY(id)
      container.zIndex = zIndex++
      (container as any)[SEEN_GEN] = gen
    })

    for (const [id, container] of this.#containers) {
      if ((container as any)[SEEN_GEN] !== gen) {
        this.#root.removeChild(container)
        this.#containers.delete(id)
      }
    }

    renderer.render(this.#root)
  }
}

export class WebWorkerRenderer extends Renderer {
  constructor(canvas: ICanvas, objectStateTree: ObjectStateTree) {
    DOMAdapter.set(WebWorkerAdapter)
    super(canvas, objectStateTree)
  }
}
