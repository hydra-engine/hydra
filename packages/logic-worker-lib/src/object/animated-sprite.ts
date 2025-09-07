import { GameObject, GameObjectOptions } from './game-object'

export type AnimatedSpriteObjectOptions = {
  asset: number
  animation: number,
  fps: number,
  loop?: boolean,
} & GameObjectOptions

export class AnimatedSpriteObject extends GameObject {
  constructor(options: AnimatedSpriteObjectOptions) {
    super(options)
  }
}
