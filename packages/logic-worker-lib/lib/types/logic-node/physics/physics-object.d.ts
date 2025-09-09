import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { EventMap } from '@webtaku/event-emitter';
import { MessageBridge } from '../../message-bridge';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type PhysicsObjectOptions = {
    body: number;
    velocityX?: number;
    velocityY?: number;
} & GameObjectOptions;
export declare class PhysicsObject<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    type: ObjectType;
    constructor(options: PhysicsObjectOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge): number;
    set body(body: number);
    get body(): number;
    set velocityX(velocity: number);
    get velocityX(): number;
    set velocityY(velocity: number);
    get velocityY(): number;
}
//# sourceMappingURL=physics-object.d.ts.map