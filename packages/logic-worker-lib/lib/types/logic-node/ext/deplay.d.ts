import { EventMap } from '@webtaku/event-emitter';
import { GameNode } from '../core/game-node';
export declare class DelayNode extends GameNode<EventMap> {
    #private;
    constructor(delay: number, callback: () => void);
    update(dt: number): void;
}
//# sourceMappingURL=deplay.d.ts.map