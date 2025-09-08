import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
export type GameObjectOptions = {
    x?: number;
    y?: number;
    layer?: number;
};
export declare class GameObject {
    #private;
    type: ObjectType;
    alpha: number;
    protected _rootConfig(id: number, stateTree: ObjectStateTree): void;
    constructor(options?: GameObjectOptions);
    protected attachToStateTree(parentId: number, stateTree: ObjectStateTree): number;
    add(...children: GameObject[]): void;
    remove(): void;
    update(dt: number): void;
    set x(v: number);
    get x(): number;
    set y(v: number);
    get y(): number;
    set layer(v: number);
    get layer(): number;
}
//# sourceMappingURL=game-object.d.ts.map