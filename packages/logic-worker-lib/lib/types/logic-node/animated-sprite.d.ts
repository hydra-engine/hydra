import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { GameObject, GameObjectOptions } from '../game-object';
export type AnimatedSpriteObjectOptions = {
    asset: number;
    animation: number;
} & GameObjectOptions;
export declare class AnimatedSpriteObject extends GameObject {
    #private;
    type: ObjectType;
    constructor(options: AnimatedSpriteObjectOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): any;
}
//# sourceMappingURL=animated-sprite.d.ts.map