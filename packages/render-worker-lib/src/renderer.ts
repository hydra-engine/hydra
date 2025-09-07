import { ObjectStateTree, ObjectType, ROOT_ID } from '@hydraengine/shared'
import { AutoDetectOptions, Container, DOMAdapter, Renderer as PixiRenderer, WebWorkerAdapter, autoDetectRenderer } from 'pixi.js'
import { AnimatedSpriteNode } from './rendering-node/animated-sprite'
import { RenderableNode } from './rendering-node/renderable'
import { SpriteNode } from './rendering-node/sprite'

DOMAdapter.set(WebWorkerAdapter)

export class Renderer {
  readonly #offscreenCanvas: OffscreenCanvas
  readonly #devicePixelRatio: number
  readonly #animationNames: Record<number, string>
  readonly #stateTree: ObjectStateTree

  #pixiRenderer?: PixiRenderer
  #root = new Container({ sortableChildren: true })
  #nodes = new Map<number, RenderableNode>()
  #renderPass = 0

  constructor(
    readonly offscreenCanvas: OffscreenCanvas,
    readonly devicePixelRatio: number,
    readonly animationNames: Record<number, string>,
    readonly stateTree: ObjectStateTree,
  ) {
    this.#offscreenCanvas = offscreenCanvas
    this.#devicePixelRatio = devicePixelRatio
    this.#animationNames = animationNames
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

    const tree = this.#stateTree
    tree.forEach((id) => {
      if (id === ROOT_ID) return

      const objectType = tree.getObjectType(id)

      let node = this.#nodes.get(id)
      if (!node) {
        if (objectType === ObjectType.Sprite) {
          const assetId = tree.getAssetId(id)
          node = new SpriteNode(assetId)
        } else if (objectType === ObjectType.AnimatedSprite) {
          const assetId = tree.getAssetId(id)
          const animation = this.#animationNames[tree.getAnimationId(id)]
          const fps = tree.getFps(id)
          const loop = tree.getLoop(id)
          node = new AnimatedSpriteNode(assetId, animation, fps, loop)
        } else {
          node = new RenderableNode()
        }

        this.#nodes.set(id, node)
        this.#root.addChild(node.pixiContainer)
      }

      const pc = node.pixiContainer
      pc.x = tree.getX(id)
      pc.y = tree.getY(id)
      pc.zIndex = zIndex++

      node.seenPass = pass
    })

    for (const [id, node] of this.#nodes) {
      if (node.seenPass !== pass) {
        this.#root.removeChild(node.pixiContainer)
        this.#nodes.delete(id)
      }
    }

    renderer.render(this.#root)
  }
}
