import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type AnimatedSpriteObjectOptions = {
    asset: number;
    animation: number;
} & GameObjectOptions;
export declare class AnimatedSpriteObject extends GameObject {
    #private;
    type: ObjectType;
    constructor(options: AnimatedSpriteObjectOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): number;
}
//# sourceMappingURL=animated-sprite.d.ts.map