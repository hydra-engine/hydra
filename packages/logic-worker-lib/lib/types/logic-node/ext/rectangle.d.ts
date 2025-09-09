import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { MessageBridge } from '../../message-bridge';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type RectangleNodeOptions = {
    shape: number;
    width: number;
    height: number;
} & GameObjectOptions;
export declare class RectangleNode extends GameObject {
    #private;
    type: ObjectType;
    constructor(options: RectangleNodeOptions);
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge): number;
}
//# sourceMappingURL=rectangle.d.ts.map