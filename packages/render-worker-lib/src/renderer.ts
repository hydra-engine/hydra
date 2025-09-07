import { ObjectStateTree, ROOT_ID } from '@hydraengine/shared'
import { AutoDetectOptions, Container, DOMAdapter, Renderer as PixiRenderer, WebWorkerAdapter, autoDetectRenderer } from 'pixi.js'

DOMAdapter.set(WebWorkerAdapter)
const SEEN_PASS = Symbol('seenPass')

export class Renderer {
  readonly #offscreenCanvas: OffscreenCanvas
  readonly #devicePixelRatio: number
  readonly #stateTree: ObjectStateTree

  #pixiRenderer?: PixiRenderer
  #root = new Container({ sortableChildren: true })
  #containers = new Map<number, Container>()
  #renderPass = 0

  constructor(
    readonly offscreenCanvas: OffscreenCanvas,
    readonly devicePixelRatio: number,
    readonly stateTree: ObjectStateTree
  ) {
    this.#offscreenCanvas = offscreenCanvas
    this.#devicePixelRatio = devicePixelRatio
    this.#stateTree = stateTree
    this.#init()
  }

  async #init() {
    const options: Partial<AutoDetectOptions> = {
      canvas: this.#offscreenCanvas,
      eventMode: 'none',
      resolution: this.#devicePixelRatio,
    }

    this.#pixiRenderer = await autoDetectRenderer(options)
  }

  render() {
    const renderer = this.#pixiRenderer
    if (!renderer) return

    const pass = ++this.#renderPass
    let zIndex = 0

    this.#stateTree.forEach((id) => {
      if (id === ROOT_ID) return

      let container = this.#containers.get(id)
      if (!container) {
        container = new Container()
        this.#containers.set(id, container)
        this.#root.addChild(container)
      }

      container.x = this.#stateTree.getX(id)
      container.y = this.#stateTree.getY(id)
      container.zIndex = zIndex++
      (container as any)[SEEN_PASS] = pass
    })

    for (const [id, container] of this.#containers) {
      if ((container as any)[SEEN_PASS] !== pass) {
        this.#root.removeChild(container)
        this.#containers.delete(id)
      }
    }

    renderer.render(this.#root)
  }
}
