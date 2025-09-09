import { GameNode } from '../core/game-node';
export class IntervalNode extends GameNode {
    interval;
    #accumulated = 0;
    #callback;
    constructor(interval, callback) {
        super();
        this.interval = interval;
        this.#callback = callback;
    }
    update(dt) {
        if (this.paused)
            return;
        super.update(dt);
        this.#accumulated += dt;
        if (this.#accumulated >= this.interval) {
            this.#accumulated %= this.interval;
            this.#callback();
        }
    }
}
//# sourceMappingURL=interval.js.map