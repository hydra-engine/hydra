import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { EventMap } from '@webtaku/event-emitter';
import { MessageBridge } from '../../message-bridge';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type PhysicsObjectOptions = {
    world: number;
} & GameObjectOptions;
export declare class PhysicsWorld<E extends EventMap = {}> extends GameObject<E> {
    #private;
    type: ObjectType;
    constructor(options: PhysicsObjectOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge): number;
}
//# sourceMappingURL=physics-world.d.ts.map