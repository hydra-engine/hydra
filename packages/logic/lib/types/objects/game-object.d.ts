import { ObjectStateTree, ObjectType } from '@kiwiengine/core';
export type GameObjectOptions = {
    type: ObjectType;
};
export declare class GameObject {
    #private;
    protected _id?: number;
    protected _tree?: ObjectStateTree;
    constructor(options: GameObjectOptions);
    add(...children: GameObject[]): void;
    destroy(): void;
}
export declare class RootObject extends GameObject {
    constructor(tree: ObjectStateTree);
}
//# sourceMappingURL=game-object.d.ts.map