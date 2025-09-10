import { Graphics } from 'pixi.js';
import { RenderableNode } from './renderable';
export class CircleNode extends RenderableNode {
    #radius;
    #fill;
    #stroke;
    constructor(radius, fill, stroke) {
        super(new Graphics());
        this.#radius = radius;
        this.#fill = fill;
        this.#stroke = stroke;
        this.#draw();
    }
    #draw() {
        this.pixiContainer.clear().circle(0, 0, this.#radius);
        if (this.#fill)
            this.pixiContainer.fill(this.#fill);
        if (this.#stroke)
            this.pixiContainer.stroke(this.#stroke);
    }
    set radius(v) {
        if (v !== this.#radius) {
            this.#radius = v;
            this.#draw();
        }
    }
    get radius() { return this.#radius; }
    set fill(v) {
        if (v !== this.#fill) {
            this.#fill = v;
            this.#draw();
        }
    }
    get fill() { return this.#fill; }
    set stroke(v) {
        if (v !== this.#stroke) {
            this.#stroke = v;
            this.#draw();
        }
    }
    get stroke() { return this.#stroke; }
}
//# sourceMappingURL=circle.js.map