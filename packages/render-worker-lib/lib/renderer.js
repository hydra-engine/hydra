import { ObjectType, ROOT } from '@hydraengine/shared';
import { Container, DOMAdapter, WebWorkerAdapter, autoDetectRenderer } from 'pixi.js';
import { Camera } from './camera';
import { AnimatedSpriteNode } from './rendering-node/animated-sprite';
import { RenderableNode } from './rendering-node/renderable';
import { SpriteNode } from './rendering-node/sprite';
DOMAdapter.set(WebWorkerAdapter);
export class Renderer {
    offscreenCanvas;
    devicePixelRatio;
    animationNames;
    assetSources;
    stateTree;
    options;
    #offscreenCanvas;
    #devicePixelRatio;
    #animationNames;
    #assetSources;
    #stateTree;
    #logicalWidth;
    #logicalHeight;
    #backgroundColor;
    #backgroundAlpha;
    #pixiRenderer;
    camera = new Camera();
    //#layers: { [name: string]: Layer } = {}
    #root = new Container({ sortableChildren: true });
    #nodes = new Map();
    #renderPass = 0;
    canvasWidth = 0;
    canvasHeight = 0;
    canvasLeft = 0;
    canvasTop = 0;
    viewportScale = 1;
    centerX = 0;
    centerY = 0;
    constructor(offscreenCanvas, devicePixelRatio, animationNames, assetSources, stateTree, options) {
        this.offscreenCanvas = offscreenCanvas;
        this.devicePixelRatio = devicePixelRatio;
        this.animationNames = animationNames;
        this.assetSources = assetSources;
        this.stateTree = stateTree;
        this.options = options;
        this.#offscreenCanvas = offscreenCanvas;
        this.#devicePixelRatio = devicePixelRatio;
        this.#animationNames = animationNames;
        this.#assetSources = assetSources;
        this.#stateTree = stateTree;
        if (options) {
            this.#logicalWidth = options.logicalWidth;
            this.#logicalHeight = options.logicalHeight;
            this.#backgroundColor = options.backgroundColor;
            this.#backgroundAlpha = options.backgroundAlpha;
        }
        this.#init();
    }
    async #init() {
        const options = {
            canvas: this.#offscreenCanvas,
            eventMode: 'none',
            resolution: this.#devicePixelRatio,
        };
        if (this.#logicalWidth)
            options.width = this.#logicalWidth;
        if (this.#logicalHeight)
            options.height = this.#logicalHeight;
        if (this.#backgroundColor)
            options.backgroundColor = this.#backgroundColor;
        if (this.#backgroundAlpha)
            options.backgroundAlpha = this.#backgroundAlpha;
        this.#pixiRenderer = await autoDetectRenderer(options);
    }
    #updatePosition() {
        const S = this.camera.scale;
        this.#root.scale = S;
        this.#root.position.set(this.centerX - this.camera.x * S, this.centerY - this.camera.y * S);
    }
    resize(containerWidth, containerHeight) {
        const canvasWidth = this.#logicalWidth ?? containerWidth;
        const canvasHeight = this.#logicalHeight ?? containerHeight;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.centerX = canvasWidth / 2;
        this.centerY = canvasHeight / 2;
        this.#updatePosition();
        const S = Math.min(containerWidth / canvasWidth, containerHeight / canvasHeight);
        this.viewportScale = S;
        const displayWidth = canvasWidth * S;
        const displayHeight = canvasHeight * S;
        const canvasLeft = (containerWidth - displayWidth) / 2;
        const canvasTop = (containerHeight - displayHeight) / 2;
        this.canvasLeft = canvasLeft;
        this.canvasTop = canvasTop;
        this.#pixiRenderer?.resize(canvasWidth, canvasHeight);
    }
    render() {
        const renderer = this.#pixiRenderer;
        if (!renderer)
            return;
        const pass = ++this.#renderPass;
        let zIndex = 0;
        const tree = this.#stateTree;
        tree.forEach((id) => {
            if (id === ROOT)
                return;
            const objectType = tree.getObjectType(id);
            let node = this.#nodes.get(id);
            if (!node) {
                if (objectType === ObjectType.Sprite) {
                    const assetId = tree.getAssetId(id);
                    node = new SpriteNode(assetId, this.#assetSources[assetId]);
                }
                else if (objectType === ObjectType.AnimatedSprite) {
                    const assetId = tree.getAssetId(id);
                    const animation = this.#animationNames[tree.getAnimationId(id)];
                    const source = this.#assetSources[assetId];
                    node = new AnimatedSpriteNode(assetId, source.src, source.atlas, animation);
                }
                else {
                    node = new RenderableNode();
                }
                this.#nodes.set(id, node);
                this.#root.addChild(node.pixiContainer);
            }
            const pc = node.pixiContainer;
            pc.position.set(tree.getWorldX(id), tree.getWorldY(id));
            pc.scale.set(tree.getWorldScaleX(id), tree.getWorldScaleY(id));
            pc.rotation = tree.getWorldRotation(id);
            pc.alpha = tree.getWorldAlpha(id);
            const tint = tree.getTint(id);
            pc.tint = tint === 0 ? 0xffffff : tint - 1;
            pc.zIndex = zIndex++;
            node.seenPass = pass;
        });
        for (const [id, node] of this.#nodes) {
            if (node.seenPass !== pass) {
                this.#root.removeChild(node.pixiContainer);
                this.#nodes.delete(id);
            }
        }
        renderer.render(this.#root);
    }
}
//# sourceMappingURL=renderer.js.map