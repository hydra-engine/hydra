import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from './game-node';
export declare function isGameObject(v: unknown): v is GameObject;
export type GameObjectOptions = {
    x?: number;
    y?: number;
    layer?: number;
};
export declare class GameObject<E extends EventMap = EventMap> extends GameNode<E> {
    #private;
    type: ObjectType;
    alpha: number;
    protected _rootConfig(id: number, stateTree: ObjectStateTree): void;
    constructor(options?: GameObjectOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): number;
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set layer(v: number);
    get layer(): number;
}
//# sourceMappingURL=game-object.d.ts.map