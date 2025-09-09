import { ObjectType } from '@hydraengine/shared';
import { GameNode } from './game-node';
import { LocalTransform } from './local-transform';
import { WorldTransform } from './world-transform';
export function isGameObject(v) {
    return v.attachToStateTree !== undefined;
}
export class GameObject extends GameNode {
    id;
    stateTree;
    messageBridge;
    type = ObjectType.GameObject;
    #localTransform = new LocalTransform();
    worldTransform = new WorldTransform();
    alpha = 1;
    #layer = 0;
    #tint = 0xffffff;
    constructor(options) {
        super();
        if (options) {
            if (options.x !== undefined)
                this.x = options.x;
            if (options.y !== undefined)
                this.y = options.y;
            if (options.scale !== undefined)
                this.scale = options.scale;
            if (options.scaleX !== undefined)
                this.scaleX = options.scaleX;
            if (options.scaleY !== undefined)
                this.scaleY = options.scaleY;
            if (options.pivotX !== undefined)
                this.pivotX = options.pivotX;
            if (options.pivotY !== undefined)
                this.pivotY = options.pivotY;
            if (options.rotation !== undefined)
                this.rotation = options.rotation;
            if (options.alpha !== undefined)
                this.alpha = options.alpha;
            if (options.layer !== undefined)
                this.layer = options.layer;
        }
    }
    attachToStateTree(parentId, stateTree, messageBridge) {
        this.#detachFromStateTree();
        const id = stateTree.newChild(parentId);
        stateTree.setObjectType(id, this.type);
        stateTree.setLayer(id, this.#layer);
        stateTree.setTint(id, this.#tint + 1);
        this.id = id;
        this.stateTree = stateTree;
        this.messageBridge = messageBridge;
        this.#localTransform.setStateTree(id, stateTree);
        this.worldTransform.setStateTree(id, stateTree);
        stateTree.setLocalAlpha(id, this.alpha);
        for (const child of this.children) {
            if (isGameObject(child)) {
                child.attachToStateTree(id, stateTree, messageBridge);
            }
        }
        return id;
    }
    #detachFromStateTree() {
        if (this.id !== undefined && this.stateTree)
            this.stateTree.remove(this.id);
        this.id = undefined;
        this.stateTree = undefined;
        this.#localTransform.clearStateTree();
        this.worldTransform.clearStateTree();
    }
    add(...children) {
        super.add(...children);
        if (this.id !== undefined && this.stateTree && this.messageBridge) {
            for (const child of children) {
                if (isGameObject(child)) {
                    child.attachToStateTree(this.id, this.stateTree, this.messageBridge);
                }
            }
        }
    }
    remove() {
        this.#detachFromStateTree();
        super.remove();
    }
    set x(v) { this.#localTransform.x = v; }
    get x() { return this.#localTransform.x; }
    set y(v) { this.#localTransform.y = v; }
    get y() { return this.#localTransform.y; }
    set scale(v) { this.#localTransform.scaleX = v; this.#localTransform.scaleY = v; }
    get scale() { return this.#localTransform.scaleX; }
    set scaleX(v) { this.#localTransform.scaleX = v; }
    get scaleX() { return this.#localTransform.scaleX; }
    set scaleY(v) { this.#localTransform.scaleY = v; }
    get scaleY() { return this.#localTransform.scaleY; }
    set pivotX(v) { this.#localTransform.pivotX = v; }
    get pivotX() { return this.#localTransform.pivotX; }
    set pivotY(v) { this.#localTransform.pivotY = v; }
    get pivotY() { return this.#localTransform.pivotY; }
    set rotation(v) { this.#localTransform.rotation = v; }
    get rotation() { return this.#localTransform.rotation; }
    set layer(v) {
        if (!isNaN(v) && this.#layer !== v) {
            this.#layer = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setLayer(this.id, v);
            }
        }
    }
    get layer() { return this.#layer; }
    set tint(v) {
        if (!isNaN(v) && this.#tint !== v) {
            this.#tint = v;
            if (this.id !== undefined && this.stateTree) {
                this.stateTree.setTint(this.id, v + 1);
            }
        }
    }
    get tint() { return this.#tint; }
}
//# sourceMappingURL=game-object.js.map