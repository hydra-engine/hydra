import { FillInput, Graphics, StrokeInput } from 'pixi.js'
import { RenderableNode } from './renderable'

export class RectangleNode extends RenderableNode<Graphics> {
  #width: number
  #height: number
  #fill?: FillInput
  #stroke?: StrokeInput

  constructor(width: number, height: number, fill: FillInput | undefined, stroke: StrokeInput | undefined) {
    super(new Graphics())

    this.#width = width
    this.#height = height
    this.#fill = fill
    this.#stroke = stroke

    this.#draw()
  }

  #draw() {
    this.pixiContainer.clear().rect(
      -this.#width / 2,
      -this.#height / 2,
      this.#width,
      this.#height,
    )
    if (this.#fill) this.pixiContainer.fill(this.#fill)
    if (this.#stroke) this.pixiContainer.stroke(this.#stroke)
  }

  set width(v) {
    if (v !== this.#width) {
      this.#width = v
      this.#draw()
    }
  }
  get width() { return this.#width }

  set height(v) {
    if (v !== this.#height) {
      this.#height = v
      this.#draw()
    }
  }
  get height() { return this.#height }

  set fill(v) {
    if (v !== this.#fill) {
      this.#fill = v
      this.#draw()
    }
  }
  get fill() { return this.#fill }

  set stroke(v) {
    if (v !== this.#stroke) {
      this.#stroke = v
      this.#draw()
    }
  }
  get stroke() { return this.#stroke }
}
