export class RenderableNode {
    pixiContainer;
    seenPass;
    constructor(pixiContainer) {
        this.pixiContainer = pixiContainer;
    }
    remove() {
        this.pixiContainer.destroy();
    }
}
//# sourceMappingURL=renderable.js.map