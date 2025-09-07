import { ObjectStateTree, ObjectType } from '@hydraengine/shared';
export type GameObjectOptions = {
    x?: number;
    y?: number;
};
export declare class GameObject {
    #private;
    type: ObjectType;
    protected _rootConfig(id: number, stateTree: ObjectStateTree): void;
    constructor(options?: GameObjectOptions);
    add(...children: GameObject[]): void;
    remove(): void;
    update(dt: number): void;
}
//# sourceMappingURL=game-object.d.ts.map