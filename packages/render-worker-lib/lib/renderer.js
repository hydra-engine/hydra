import { NONE, ObjectType, ROOT } from '@hydraengine/shared';
import { Container, DOMAdapter, WebWorkerAdapter, autoDetectRenderer } from 'pixi.js';
import { Camera } from './camera';
import { AnimatedSpriteNode } from './rendering-node/animated-sprite';
import { BitmapTextNode } from './rendering-node/bitmap-text';
import { CircleNode } from './rendering-node/circle';
import { RectangleNode } from './rendering-node/rectangle';
import { SpriteNode } from './rendering-node/sprite';
DOMAdapter.set(WebWorkerAdapter);
export class Renderer {
    offscreenCanvas;
    devicePixelRatio;
    animationNames;
    assetSources;
    shapeDescriptors;
    stateTree;
    messageBridge;
    options;
    #offscreenCanvas;
    #devicePixelRatio;
    #animationNames;
    #assetSources;
    #shapeDescriptors;
    #stateTree;
    #messageBridge;
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
    constructor(offscreenCanvas, devicePixelRatio, animationNames, assetSources, shapeDescriptors, stateTree, messageBridge, options) {
        this.offscreenCanvas = offscreenCanvas;
        this.devicePixelRatio = devicePixelRatio;
        this.animationNames = animationNames;
        this.assetSources = assetSources;
        this.shapeDescriptors = shapeDescriptors;
        this.stateTree = stateTree;
        this.messageBridge = messageBridge;
        this.options = options;
        this.#offscreenCanvas = offscreenCanvas;
        this.#devicePixelRatio = devicePixelRatio;
        this.#animationNames = animationNames;
        this.#assetSources = assetSources;
        this.#shapeDescriptors = shapeDescriptors;
        this.#stateTree = stateTree;
        this.#messageBridge = messageBridge;
        if (options) {
            this.#logicalWidth = options.logicalWidth;
            this.#logicalHeight = options.logicalHeight;
            this.#backgroundColor = options.backgroundColor;
            this.#backgroundAlpha = options.backgroundAlpha;
        }
        messageBridge.on('animationChanged', this.#handleAnimationChanged);
        this.#init();
    }
    #handleAnimationChanged = (id, animationId) => {
        const node = this.#nodes.get(id);
        if (node instanceof AnimatedSpriteNode) {
            node.changeAnimation(this.#animationNames[animationId]);
        }
    };
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
                    if (assetId !== NONE) {
                        node = new SpriteNode(assetId, this.#assetSources[assetId]);
                    }
                }
                else if (objectType === ObjectType.AnimatedSprite) {
                    const assetId = tree.getAssetId(id);
                    const animation = this.#animationNames[tree.getAnimationId(id)];
                    const source = this.#assetSources[assetId];
                    if (assetId !== NONE && animation && source) {
                        node = new AnimatedSpriteNode(assetId, source.src, source.atlas, animation);
                    }
                }
                else if (objectType === ObjectType.Rectangle) {
                    const width = tree.getWidth(id);
                    const height = tree.getHeight(id);
                    const shapeId = tree.getShapeId(id);
                    const shapeDescriptor = this.#shapeDescriptors[shapeId];
                    if (width !== NONE && height !== NONE && shapeDescriptor) {
                        node = new RectangleNode(width, height, shapeDescriptor.fill, shapeDescriptor.stroke);
                    }
                }
                else if (objectType === ObjectType.Circle) {
                    const radius = tree.getRadius(id);
                    const shapeId = tree.getShapeId(id);
                    const shapeDescriptor = this.#shapeDescriptors[shapeId];
                    if (radius !== NONE && shapeDescriptor) {
                        node = new CircleNode(radius, shapeDescriptor.fill, shapeDescriptor.stroke);
                    }
                }
                else if (objectType === ObjectType.BitmapText) {
                    const assetId = tree.getAssetId(id);
                    const source = this.#assetSources[assetId];
                    if (assetId !== NONE && source) {
                        node = new BitmapTextNode(assetId, source.fnt, source.src);
                    }
                }
                if (node) {
                    this.#nodes.set(id, node);
                    this.#root.addChild(node.pixiContainer);
                }
            }
            if (node) {
                const pc = node.pixiContainer;
                pc.position.set(tree.getWorldX(id), tree.getWorldY(id));
                pc.scale.set(tree.getWorldScaleX(id), tree.getWorldScaleY(id));
                pc.rotation = tree.getWorldRotation(id);
                pc.alpha = tree.getWorldAlpha(id);
                const tint = tree.getTint(id);
                pc.tint = tint === 0 ? 0xffffff : tint - 1;
                pc.zIndex = zIndex++;
                if (objectType === ObjectType.AnimatedSprite) {
                    const animation = this.#animationNames[tree.getAnimationId(id)];
                    if (animation)
                        node.animation = animation;
                }
                if (objectType === ObjectType.BitmapText) {
                    node.text = this.#messageBridge.getText(id);
                }
                node.seenPass = pass;
            }
        });
        for (const [id, node] of this.#nodes) {
            if (node.seenPass !== pass) {
                node.remove();
                this.#nodes.delete(id);
            }
        }
        renderer.render(this.#root);
    }
}
//# sourceMappingURL=renderer.js.map