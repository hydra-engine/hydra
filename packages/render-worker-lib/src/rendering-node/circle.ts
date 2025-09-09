import { FillInput, Graphics, StrokeInput } from 'pixi.js'
import { RenderableNode } from './renderable'

export class CircleNode extends RenderableNode<Graphics> {
  #radius: number
  #fill?: FillInput
  #stroke?: StrokeInput

  constructor(radius: number, fill: FillInput | undefined, stroke: StrokeInput | undefined) {
    super(new Graphics())

    this.#radius = radius
    this.#fill = fill
    this.#stroke = stroke

    this.#draw()
  }

  #draw() {
    this.pixiContainer.clear().circle(0, 0, this.#radius)
    if (this.#fill) this.pixiContainer.fill(this.#fill)
    if (this.#stroke) this.pixiContainer.stroke(this.#stroke)
  }

  get radius() { return this.#radius }
  set radius(v) { this.#radius = v; this.#draw() }

  get fill() { return this.#fill }
  set fill(v) { this.#fill = v; this.#draw() }

  get stroke() { return this.#stroke }
  set stroke(v) { this.#stroke = v; this.#draw() }
}
