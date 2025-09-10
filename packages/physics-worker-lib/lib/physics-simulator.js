import { NONE, ObjectType } from '@hydraengine/shared';
import { PhysicsObject } from './physics-node/physics-object';
import { PhysicsWorld } from './physics-node/physics-world';
export class PhysicsSimulator {
    stateTree;
    worldDescriptors;
    bodyDescriptors;
    #stateTree;
    #worldDescriptors;
    #bodyDescriptors;
    #worlds = new Map();
    #objects = new Map();
    #simulationStep = 0;
    constructor(stateTree, worldDescriptors, bodyDescriptors) {
        this.stateTree = stateTree;
        this.worldDescriptors = worldDescriptors;
        this.bodyDescriptors = bodyDescriptors;
        this.#stateTree = stateTree;
        this.#worldDescriptors = worldDescriptors;
        this.#bodyDescriptors = bodyDescriptors;
    }
    update(dt) {
        const dts = dt * 1000;
        const matterDt = dts > 16.666 ? 16.666 : dts;
        this.#worlds.forEach((world) => world.update(matterDt));
        const step = ++this.#simulationStep;
        const tree = this.#stateTree;
        tree.forEach((id) => {
            const objectType = tree.getObjectType(id);
            if (objectType === ObjectType.PhysicsWorld) {
                let world = this.#worlds.get(id);
                if (!world) {
                    const worldId = tree.getWorldId(id);
                    const wd = this.#worldDescriptors[worldId];
                    if (wd) {
                        world = new PhysicsWorld(wd.gravity);
                        this.#worlds.set(id, world);
                    }
                }
                if (world)
                    world.processedStep = step;
            }
            if (objectType === ObjectType.PhysicsObject) {
                let object = this.#objects.get(id);
                if (!object) {
                    const bodyId = tree.getBodyId(id);
                    const bd = this.#bodyDescriptors[bodyId];
                    if (bd) {
                        object = new PhysicsObject(tree.getLocalX(id), tree.getLocalY(id), bodyId, bd.rigidbody, bd.fixedRotation, bd.isStatic);
                        this.#objects.set(id, object);
                    }
                }
                if (object) {
                    if (!object.world) {
                        object.world = this.#worlds.get(tree.getParent(id));
                    }
                    if (!object.isStatic) {
                        object.velocityX = tree.getVelocityX(id);
                        object.velocityY = tree.getVelocityY(id);
                        tree.setTargetX(id, object.x);
                        tree.setTargetY(id, object.y);
                    }
                    object.processedStep = step;
                    const bodyId = tree.getBodyId(id);
                    if (object.bodyId !== bodyId) {
                        if (bodyId === NONE) {
                            object.remove();
                            this.#objects.delete(id);
                        }
                        else {
                            const bd = this.#bodyDescriptors[bodyId];
                            if (bd)
                                object.changeBody(bodyId, bd.rigidbody);
                        }
                    }
                }
            }
        });
        for (const [id, world] of this.#worlds) {
            if (world.processedStep !== step) {
                world.remove();
                this.#worlds.delete(id);
            }
        }
        for (const [id, object] of this.#objects) {
            if (object.processedStep !== step) {
                object.remove();
                this.#objects.delete(id);
            }
        }
    }
}
//# sourceMappingURL=physics-simulator.js.map