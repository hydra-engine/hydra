import { ROOT } from '@kiwiengine/core';
import { autoDetectRenderer, Container, DOMAdapter, WebWorkerAdapter } from 'pixi.js';
const SEEN_GEN = Symbol('seenGen');
export class Renderer {
    #canvas;
    #objectStateTree;
    #pixiRenderer;
    #root = new Container({ sortableChildren: true });
    #containers = new Map();
    #generation = 0;
    constructor(canvas, objectStateTree) {
        this.#canvas = canvas;
        this.#objectStateTree = objectStateTree;
        this.#init();
    }
    async #init() {
        this.#pixiRenderer = await autoDetectRenderer({
            canvas: this.#canvas,
        });
    }
    render() {
        const renderer = this.#pixiRenderer;
        if (!renderer)
            return;
        const gen = ++this.#generation;
        let zIndex = 0;
        this.#objectStateTree.forEach((id) => {
            if (id === ROOT)
                return;
            let container = this.#containers.get(id);
            if (!container) {
                container = new Container();
                this.#containers.set(id, container);
                this.#root.addChild(container);
            }
            container.x = this.#objectStateTree.getX(id);
            container.y = this.#objectStateTree.getY(id);
            container.zIndex = zIndex++;
            container[SEEN_GEN] = gen;
        });
        for (const [id, container] of this.#containers) {
            if (container[SEEN_GEN] !== gen) {
                this.#root.removeChild(container);
                this.#containers.delete(id);
            }
        }
        renderer.render(this.#root);
    }
}
export class WebWorkerRenderer extends Renderer {
    constructor(canvas, objectStateTree) {
        DOMAdapter.set(WebWorkerAdapter);
        super(canvas, objectStateTree);
    }
}
//# sourceMappingURL=renderer.js.map