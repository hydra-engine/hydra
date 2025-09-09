import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { EventMap } from '@webtaku/event-emitter';
import { MessageBridge } from '../../message-bridge';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type SpriteNodeOptions = {
    asset: number;
} & GameObjectOptions;
export declare class SpriteNode<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    type: ObjectType;
    constructor(options: SpriteNodeOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree, messageBridge: MessageBridge): number;
}
//# sourceMappingURL=sprite.d.ts.map