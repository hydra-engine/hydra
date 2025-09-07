import { ObjectStateTree, ObjectType } from '@hydraengine/shared'
import { GameObject, GameObjectOptions } from './game-object'

export type AnimatedSpriteObjectOptions = {
  asset: number
  animation: number,
  fps: number,
  loop?: boolean,
} & GameObjectOptions

export class AnimatedSpriteObject extends GameObject {
  type = ObjectType.AnimatedSprite
  #assetId: number
  #animationId: number
  #fps: number
  #loop: boolean

  constructor(options: AnimatedSpriteObjectOptions) {
    super(options)
    this.#assetId = options.asset
    this.#animationId = options.animation
    this.#fps = options.fps
    this.#loop = options.loop ?? true
  }

  protected override attachToStateTree(parentId: number, stateTree: ObjectStateTree) {
    const id = super.attachToStateTree(parentId, stateTree)
    stateTree.setAssetId(id, this.#assetId)
    stateTree.setAnimationId(id, this.#animationId)
    stateTree.setFps(id, this.#fps)
    stateTree.setLoop(id, this.#loop)
    return id
  }
}
