import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type CircleNodeOptions = {
    shape: number;
    radius: number;
} & GameObjectOptions;
export declare class CircleNode extends GameObject {
    #private;
    type: ObjectType;
    constructor(options: CircleNodeOptions);
    get radius(): number;
    set radius(v: number);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): number;
}
//# sourceMappingURL=circle.d.ts.map