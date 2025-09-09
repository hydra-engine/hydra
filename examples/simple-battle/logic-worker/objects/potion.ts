import { AnimatedSpriteNode, CircleCollider, CircleNode, ColliderType, GameObject, GameObjectOptions } from '@hydraengine/logic-worker-lib'
import { debugMode } from '@hydraengine/shared'
import { AnimationState } from '../../shared/animations'
import { AssetId } from '../../shared/assets'
import { Layer } from '../../shared/layers'
import { ShapeId } from '../../shared/shapes'

export type PotionOptions = {
  healAmount?: number
} & GameObjectOptions

export class Potion extends GameObject {
  triggerCollider: CircleCollider = { type: ColliderType.Circle, radius: 16 }
  healAmount: number

  constructor(options?: PotionOptions) {
    super({ ...options, useYSort: true })
    this.healAmount = options?.healAmount ?? 100

    this.add(new AnimatedSpriteNode({
      asset: AssetId.SPRITE_POTION,
      animation: AnimationState.Animation,
      scale: 2
    }))

    if (debugMode) {
      this.add(new CircleNode({ shape: ShapeId.DEBUG_POTION_TRIGGER, ...this.triggerCollider, alpha: 0.5, layer: Layer.HUD }))
    }
  }
}
