import { Atlas } from '@hydraengine/shared';
import { RenderableNode } from './renderable';
export declare class AnimatedSpriteNode extends RenderableNode {
    #private;
    constructor(assetId: number, src: string, atlas: Atlas, animation: string);
    set animation(v: string);
    get animation(): string;
    changeAnimation(animation: string): void;
    remove(): void;
}
//# sourceMappingURL=animated-sprite.d.ts.map