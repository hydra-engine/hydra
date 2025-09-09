import { ROOT } from '@hydraengine/shared';
import { GameObject } from './game-object';
export class RootObject extends GameObject {
    constructor(stateTree, messageBridge) {
        super();
        this.id = ROOT;
        this.stateTree = stateTree;
        this.messageBridge = messageBridge;
        stateTree.setWorldScaleX(ROOT, 1);
        stateTree.setWorldScaleY(ROOT, 1);
        stateTree.setWorldCos(ROOT, 1);
        stateTree.setWorldAlpha(ROOT, 1);
    }
}
//# sourceMappingURL=root-object.js.map