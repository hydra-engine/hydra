export class LocalTransform {
    x = 0;
    y = 0;
    scaleX = 1;
    scaleY = 1;
    pivotX = 0;
    pivotY = 0;
    #rotation = 0;
    #cos = 1;
    #sin = 0;
    get cos() { return this.#cos; }
    get sin() { return this.#sin; }
    get rotation() { return this.#rotation; }
    set rotation(v) {
        if (this.#rotation !== v) {
            this.#rotation = v;
            this.#cos = Math.cos(v);
            this.#sin = Math.sin(v);
        }
    }
}
//# sourceMappingURL=transform.js.map