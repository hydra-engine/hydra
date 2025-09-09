import { EventEmitter, EventMap } from '@webtaku/event-emitter';
export declare abstract class GameNode<E extends EventMap> extends EventEmitter<E & {
    update: (dt: number) => void;
}> {
    #private;
    protected children: GameNode<EventMap>[];
    paused: boolean;
    protected set parent(parent: GameNode<EventMap> | undefined);
    protected get parent(): GameNode<EventMap> | undefined;
    add(...children: GameNode<EventMap>[]): void;
    remove(): void;
    pause(): void;
    resume(): void;
    update(dt: number): void;
}
//# sourceMappingURL=game-node.d.ts.map