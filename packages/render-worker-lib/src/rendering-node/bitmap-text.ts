import { Container, Rectangle as PixiRectangle, Sprite as PixiSprite, Texture as PixiTexture } from 'pixi.js'
import { bitmapFontLoader } from '../loaders/bitmap-font'
import { RenderableNode } from './renderable'

export class BitmapTextNode extends RenderableNode {
  #assetId: number
  #fnt: string
  #src: string
  #text = ''

  constructor(assetId: number, fnt: string, src: string) {
    super(new Container())
    this.#assetId = assetId
    this.#fnt = fnt
    this.#src = src
  }

  async #load() {
    let font
    if (bitmapFontLoader.checkCached(this.#assetId)) {
      font = bitmapFontLoader.getCached(this.#assetId)
    } else {
      console.info(`Bitmap font not preloaded. Loading now: ${this.#fnt}`)
      font = await bitmapFontLoader.load(this.#assetId, this.#fnt, this.#src)
    }
    if (!font) return

    const sprites: PixiSprite[] = []

    let xPos = 0, yPos = 0
    let minX = Infinity, minY = Infinity
    let maxX = -Infinity, maxY = -Infinity

    for (let i = 0; i < this.#text.length; i++) {
      const charCode = this.#text.charCodeAt(i)

      if (charCode === 10) {
        xPos = 0
        yPos += font.lineHeight
        continue
      }

      const c = font.chars[charCode]
      if (!c) continue

      const frame = new PixiRectangle(c.x, c.y, c.width, c.height)
      const texture = new PixiTexture({ source: font.texture.source, frame })
      const sprite = new PixiSprite(texture)

      const x0 = xPos + c.xoffset
      const y0 = yPos + c.yoffset

      sprite.x = x0
      sprite.y = y0

      sprites.push(sprite)

      const x1 = x0 + c.width
      const y1 = y0 + c.height

      if (x0 < minX) minX = x0
      if (y0 < minY) minY = y0
      if (x1 > maxX) maxX = x1
      if (y1 > maxY) maxY = y1

      xPos += c.xadvance
    }

    if (minX === Infinity) {
      minX = 0
      minY = 0
    }

    if (maxX === -Infinity) {
      maxX = 0
      maxY = 0
    }

    const width = maxX - minX
    const height = maxY - minY

    for (const s of sprites) {
      s.x -= width / 2
      s.y -= height / 2
      this.pixiContainer.addChild(s)
    }
  }

  set text(v: string) {
    if (v !== this.#text) {
      this.#text = v
      this.#load()
    }
  }

  get text() {
    return this.#text
  }

  override remove() {
    bitmapFontLoader.release(this.#assetId)
    super.remove()
  }
}
