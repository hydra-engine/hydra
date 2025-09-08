import { Atlas } from '@hydraengine/shared'
import { AnimatedSprite as PixiAnimatedSprite } from 'pixi.js'
import { SpritesheetData, spritesheetLoader } from '../loaders/spritesheet'
import { RenderableNode } from './renderable'

export class AnimatedSpriteNode extends RenderableNode {
  #assetId: number
  #src: string
  #atlas: Atlas
  #animation: string

  #data?: SpritesheetData
  #sprite?: PixiAnimatedSprite

  constructor(assetId: number, src: string, atlas: Atlas, animation: string) {
    super()
    this.#assetId = assetId
    this.#src = src
    this.#atlas = atlas
    this.#animation = animation
    this.#load()
  }

  async #load() {
    if (spritesheetLoader.checkCached(this.#assetId)) {
      this.#data = spritesheetLoader.getCached(this.#assetId)
    } else {
      console.info(`Spritesheet not preloaded. Loading now: ${this.#src}`)
      this.#data = await spritesheetLoader.load(this.#assetId, this.#src, this.#atlas)
    }

    this.#updateAnimation()
  }

  #updateAnimation() {
    this.#sprite?.destroy()
    this.#sprite = undefined

    const d = this.#data
    if (d) {
      if (!d.pixiSpritesheet.animations[this.#animation]) {
        console.error(`Animation not found: ${this.#animation}`)
        return
      }

      const s = new PixiAnimatedSprite(d.pixiSpritesheet.animations[this.#animation])
      s.anchor.set(0.5, 0.5)

      const a = d.atlas.animations[this.#animation]
      s.loop = a.loop
      s.animationSpeed = a.fps / 60
      s.play()

      this.pixiContainer.addChild(s)
      this.#sprite = s
    }
  }

  override remove() {
    spritesheetLoader.release(this.#assetId)
    super.remove()
  }
}
