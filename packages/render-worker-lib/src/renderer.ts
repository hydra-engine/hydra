import { ObjectStateTree, ObjectType, ROOT_ID } from '@hydraengine/shared'
import { AutoDetectOptions, ColorSource, Container, DOMAdapter, Renderer as PixiRenderer, WebWorkerAdapter, autoDetectRenderer } from 'pixi.js'
import { Camera } from './camera'
import { AnimatedSpriteNode } from './rendering-node/animated-sprite'
import { RenderableNode } from './rendering-node/renderable'
import { SpriteNode } from './rendering-node/sprite'

DOMAdapter.set(WebWorkerAdapter)

export type RendererOptions = {
  logicalWidth?: number
  logicalHeight?: number
  backgroundColor?: ColorSource
  backgroundAlpha?: number
  layers?: { id: number; drawOrder: number }[]
}

export class Renderer {
  readonly #offscreenCanvas: OffscreenCanvas
  readonly #devicePixelRatio: number
  readonly #animationNames: Record<number, string>
  readonly #stateTree: ObjectStateTree

  readonly #logicalWidth?: number
  readonly #logicalHeight?: number
  readonly #backgroundColor?: ColorSource
  readonly #backgroundAlpha?: number

  #pixiRenderer?: PixiRenderer
  camera = new Camera()
  //#layers: { [name: string]: Layer } = {}
  #root = new Container({ sortableChildren: true })
  #nodes = new Map<number, RenderableNode>()
  #renderPass = 0

  canvasWidth = 0
  canvasHeight = 0
  canvasLeft = 0
  canvasTop = 0
  viewportScale = 1
  centerX = 0
  centerY = 0

  constructor(
    readonly offscreenCanvas: OffscreenCanvas,
    readonly devicePixelRatio: number,
    readonly animationNames: Record<number, string>,
    readonly stateTree: ObjectStateTree,
    readonly options?: RendererOptions,
  ) {
    this.#offscreenCanvas = offscreenCanvas
    this.#devicePixelRatio = devicePixelRatio
    this.#animationNames = animationNames
    this.#stateTree = stateTree

    if (options) {
      this.#logicalWidth = options.logicalWidth
      this.#logicalHeight = options.logicalHeight
      this.#backgroundColor = options.backgroundColor
      this.#backgroundAlpha = options.backgroundAlpha
    }

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

  #updatePosition() {
    const S = this.camera.scale
    this.#root.scale = S
    this.#root.position.set(
      this.centerX - this.camera.x * S,
      this.centerY - this.camera.y * S
    )
  }

  resize(containerWidth: number, containerHeight: number) {
    const canvasWidth = this.#logicalWidth ?? containerWidth
    const canvasHeight = this.#logicalHeight ?? containerHeight
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.centerX = canvasWidth / 2
    this.centerY = canvasHeight / 2
    this.#updatePosition()

    const S = Math.min(containerWidth / canvasWidth, containerHeight / canvasHeight)
    this.viewportScale = S

    const displayWidth = canvasWidth * S
    const displayHeight = canvasHeight * S

    const canvasLeft = (containerWidth - displayWidth) / 2
    const canvasTop = (containerHeight - displayHeight) / 2
    this.canvasLeft = canvasLeft
    this.canvasTop = canvasTop

    this.#pixiRenderer?.resize(canvasWidth, canvasHeight)
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
