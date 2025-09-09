import { Graphics } from 'pixi.js';
import { RenderableNode } from './renderable';
export class RectangleNode extends RenderableNode {
    #width;
    #height;
    #fill;
    #stroke;
    constructor(width, height, fill, stroke) {
        super(new Graphics());
        this.#width = width;
        this.#height = height;
        this.#fill = fill;
        this.#stroke = stroke;
        this.#draw();
    }
    #draw() {
        this.pixiContainer.clear().rect(-this.#width / 2, -this.#height / 2, this.#width, this.#height);
        if (this.#fill)
            this.pixiContainer.fill(this.#fill);
        if (this.#stroke)
            this.pixiContainer.stroke(this.#stroke);
    }
    get width() { return this.#width; }
    set width(v) { this.#width = v; this.#draw(); }
    get height() { return this.#height; }
    set height(v) { this.#height = v; this.#draw(); }
    get fill() { return this.#fill; }
    set fill(v) { this.#fill = v; this.#draw(); }
    get stroke() { return this.#stroke; }
    set stroke(v) { this.#stroke = v; this.#draw(); }
}
//# sourceMappingURL=rectangle.js.map