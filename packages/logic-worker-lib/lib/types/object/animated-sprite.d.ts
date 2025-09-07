import { GameObject, GameObjectOptions } from './game-object';
export type AnimatedSpriteObjectOptions = {
    asset: number;
    animation: number;
    fps: number;
    loop?: boolean;
} & GameObjectOptions;
export declare class AnimatedSpriteObject extends GameObject {
    constructor(options: AnimatedSpriteObjectOptions);
}
//# sourceMappingURL=animated-sprite.d.ts.map