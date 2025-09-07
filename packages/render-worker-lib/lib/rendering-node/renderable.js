import { Container } from 'pixi.js';
export class RenderableNode {
    pixiContainer = new Container();
    seenPass;
    remove() {
        this.pixiContainer.destroy();
    }
}
//# sourceMappingURL=renderable.js.map