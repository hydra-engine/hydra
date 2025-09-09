import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { EventMap } from '@webtaku/event-emitter';
import { GameObject, GameObjectOptions } from '../core/game-object';
export type BitmapTextNodeOptions = {
    asset: number;
} & GameObjectOptions;
export declare class BitmapTextNode<E extends EventMap = EventMap> extends GameObject<E> {
    #private;
    type: ObjectType;
    constructor(options: BitmapTextNodeOptions);
    get asset(): number;
    set asset(v: number);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): number;
}
//# sourceMappingURL=bitmap-text.d.ts.map