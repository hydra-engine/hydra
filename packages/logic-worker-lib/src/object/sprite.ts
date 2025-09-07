import { GameObject, GameObjectOptions } from './game-object'

export type SpriteObjectOptions = {
  asset: number
} & GameObjectOptions

export class SpriteObject extends GameObject {
  constructor(options: SpriteObjectOptions) {
    super(options)
  }
}
