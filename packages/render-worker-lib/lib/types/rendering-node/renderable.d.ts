import { Container } from 'pixi.js';
export declare abstract class RenderableNode<T extends Container = Container> {
    pixiContainer: T;
    seenPass?: number;
    constructor(pixiContainer: T);
    remove(): void;
}
//# sourceMappingURL=renderable.d.ts.map