import { GameObject, GameObjectOptions } from './game-object';
export type SpriteObjectOptions = {
    asset: number;
} & GameObjectOptions;
export declare class SpriteObject extends GameObject {
    constructor(options: SpriteObjectOptions);
}
//# sourceMappingURL=sprite.d.ts.map