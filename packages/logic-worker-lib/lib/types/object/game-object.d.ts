import { ObjectStateTree } from '@hydraengine/shared';
export type GameObjectOptions = {
    x?: number;
    y?: number;
};
export declare class GameObject {
    stateTree?: ObjectStateTree;
    constructor(options?: GameObjectOptions);
    add(...children: GameObject[]): void;
    update(dt: number): void;
}
//# sourceMappingURL=game-object.d.ts.map