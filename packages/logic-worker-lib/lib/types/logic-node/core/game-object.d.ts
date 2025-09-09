import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from './game-node';
export declare function isGameObject(v: unknown): v is GameObject;
export type GameObjectOptions = {
    x?: number;
    y?: number;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    pivotX?: number;
    pivotY?: number;
    rotation?: number;
    alpha?: number;
    layer?: number;
};
export declare class GameObject<E extends EventMap = EventMap> extends GameNode<E> {
    #private;
    protected id?: number;
    protected stateTree?: ObjectStateTree;
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
    set scale(v: number);
    get scale(): number;
    set scaleX(v: number);
    get scaleX(): number;
    set scaleY(v: number);
    get scaleY(): number;
    set pivotX(v: number);
    get pivotX(): number;
    set pivotY(v: number);
    get pivotY(): number;
    set rotation(v: number);
    get rotation(): number;
    set layer(v: number);
    get layer(): number;
}
//# sourceMappingURL=game-object.d.ts.map