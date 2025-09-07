import { ROOT_ID } from '@hydraengine/shared';
import { Container, DOMAdapter, WebWorkerAdapter, autoDetectRenderer } from 'pixi.js';
DOMAdapter.set(WebWorkerAdapter);
const SEEN_PASS = Symbol('seenPass');
export class Renderer {
    offscreenCanvas;
    devicePixelRatio;
    stateTree;
    #offscreenCanvas;
    #devicePixelRatio;
    #stateTree;
    #pixiRenderer;
    #root = new Container({ sortableChildren: true });
    #containers = new Map();
    #renderPass = 0;
    constructor(offscreenCanvas, devicePixelRatio, stateTree) {
        this.offscreenCanvas = offscreenCanvas;
        this.devicePixelRatio = devicePixelRatio;
        this.stateTree = stateTree;
        this.#offscreenCanvas = offscreenCanvas;
        this.#devicePixelRatio = devicePixelRatio;
        this.#stateTree = stateTree;
        this.#init();
    }
    async #init() {
        const options = {
            canvas: this.#offscreenCanvas,
            eventMode: 'none',
            resolution: this.#devicePixelRatio,
        };
        this.#pixiRenderer = await autoDetectRenderer(options);
    }
    render() {
        const renderer = this.#pixiRenderer;
        if (!renderer)
            return;
        const pass = ++this.#renderPass;
        let zIndex = 0;
        this.#stateTree.forEach((id) => {
            if (id === ROOT_ID)
                return;
            let container = this.#containers.get(id);
            if (!container) {
                container = new Container();
                this.#containers.set(id, container);
                this.#root.addChild(container);
            }
            container.x = this.#stateTree.getX(id);
            container.y = this.#stateTree.getY(id);
            container.zIndex = zIndex++;
            container[SEEN_PASS] = pass;
        });
        for (const [id, container] of this.#containers) {
            if (container[SEEN_PASS] !== pass) {
                this.#root.removeChild(container);
                this.#containers.delete(id);
            }
        }
        renderer.render(this.#root);
    }
}
//# sourceMappingURL=renderer.js.map