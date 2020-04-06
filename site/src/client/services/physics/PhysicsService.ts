import { PhysicsStateType } from "../../engine/components/PhysicsComponent";
import { Entity } from "../../engine/Entity";
import { ConsistentArray } from "../../util/array/ConsistentArray";

type PhysicsEntity = Entity<PhysicsStateType>;

export class PhysicsService {
    private entities: ConsistentArray<PhysicsEntity>;

    public constructor() {
        this.entities = new ConsistentArray();
    }

    public registerPhysicsEntity(entity: PhysicsEntity) {
        this.entities.add(entity);
    }

    public unregisterPhysicsEntity(entity: PhysicsEntity) {
        this.entities.remove(entity);
    }

    public registerWall() {}

    public unregisterWall() {}

    public update() {
        this.entities.sync();
        const array = this.entities.getArray();
        const finalImpulse = {
            x: 0,
            y: 0,
        };
        for (const a of array) {
            const state = a.getState();
            const posA = state.position;
            const radiusA = state.radius;

            for (const b of array) {
                if (a === b) {
                    continue;
                }
                const bState = b.getState();
                const posB = bState.position;
                const radiusB = bState.radius;
                const diffX = posB.x - posA.x;
                const diffY = posB.y - posA.y;

                const boundarySquared =
                    (radiusA + radiusB) * (radiusA * radiusB);
                const distanceSquared = diffX * diffX + diffY * diffY;

                if (distanceSquared > boundarySquared) {
                    continue;
                }

                const force =
                    (1.0 - distanceSquared / boundarySquared) *
                    (bState.mass / state.mass);
                const directionXSquared = diffX / distanceSquared;
                const directionYSquared = diffY / distanceSquared;

                finalImpulse.x += directionXSquared * (-force * 0.02);
                finalImpulse.y += directionYSquared * (-force * 0.02);
            }

            if (finalImpulse.x !== 0 || finalImpulse.y !== 0) {
                state.velocity.x += finalImpulse.x;
                state.velocity.y += finalImpulse.y;
            }

            finalImpulse.x = 0;
            finalImpulse.y = 0;
        }

        for (const a of array) {
            const state = a.getState();

            state.position.x += state.velocity.x;
            state.position.y += state.velocity.y;

            state.velocity.x *= state.friction;
            state.velocity.y *= state.friction;
        }
    }
}
