import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { MessageBridge } from '../../message-bridge';
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
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge): number;
}
//# sourceMappingURL=circle.d.ts.map