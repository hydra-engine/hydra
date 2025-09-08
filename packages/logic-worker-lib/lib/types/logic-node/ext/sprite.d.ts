import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type SpriteObjectOptions = {
    asset: number;
} & GameObjectOptions;
export declare class SpriteObject extends GameObject {
    #private;
    type: ObjectType;
    constructor(options: SpriteObjectOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): number;
}
//# sourceMappingURL=sprite.d.ts.map