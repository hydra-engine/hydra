import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type AnimatedSpriteNodeOptions = {
    asset: number;
    animation: number;
} & GameObjectOptions;
export declare class AnimatedSpriteNode<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    type: ObjectType;
    constructor(options: AnimatedSpriteNodeOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): number;
}
//# sourceMappingURL=animated-sprite.d.ts.map