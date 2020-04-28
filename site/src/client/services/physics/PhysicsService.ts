import { PhysicsStateType } from "../../engine/components/PhysicsComponent";
import { Entity } from "../../engine/Entity";
import { Vector2D } from "../../types";
import { ConsistentArray } from "../../util/array/ConsistentArray";
import { vec_normalize } from "../../util/math";

type PhysicsEntity = Entity<PhysicsStateType>;

export interface PhysicsBoundary {
    start: Vector2D;
    end: Vector2D;
}

const FORCE_CONSTANT = 0.2;

export class PhysicsService {
    private entities: ConsistentArray<PhysicsEntity>;
    private boundaries: ConsistentArray<PhysicsBoundary>;

    public constructor() {
        this.entities = new ConsistentArray();
        this.boundaries = new ConsistentArray();
    }

    public registerPhysicsEntity(entity: PhysicsEntity) {
        this.entities.add(entity);
    }

    public unregisterPhysicsEntity(entity: PhysicsEntity) {
        this.entities.remove(entity);
    }

    public registerBoundary(boundary: PhysicsBoundary) {
        this.boundaries.add(boundary);
    }

    public unregisterBoundary(boundary: PhysicsBoundary) {
        this.boundaries.remove(boundary);
    }

    public update() {
        this.entities.sync();
        this.boundaries.sync();

        const array = this.entities.getArray();
        const boundaries = this.boundaries.getArray();

        for (const a of array) {
            this.calculateEntityCollisionImpulse(a, array);
        }

        for (const a of array) {
            this.calculateEntityBoundaryCollisionImpulse(a, boundaries);
        }

        this.moveEntities(array);
    }

    private calculateEntityBoundaryCollisionImpulse(
        entity: PhysicsEntity,
        boundaries: PhysicsBoundary[]
    ) {
        const state = entity.getState();
        for (const boundary of boundaries) {
            const x1 = boundary.start.x;
            const y1 = boundary.start.y;

            const x2 = boundary.end.x;
            const y2 = boundary.end.y;

            const distx = x2 - x1;
            const disty = y2 - y1;

            const cx = state.position.x;
            const cy = state.position.y;
            const r = state.radius;

            const len = Math.sqrt(distx * distx + disty * disty);
            let dot =
                ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / (len * len);

            dot = Math.min(1, Math.max(dot, 0));

            const closestX = x1 + dot * distx;
            const closestY = y1 + dot * disty;

            const diffX = cx - closestX;
            const diffY = cy - closestY;

            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            if (distance > r) {
                continue;
            }

            const normal = vec_normalize({ x: diffX, y: diffY });

            const velocityAlongNormal =
                normal.x * state.velocity.x + normal.y * state.velocity.y;

            const resultingMove =
                velocityAlongNormal > 0
                    ? 0
                    : velocityAlongNormal * (1 + state.elastic);

            state.velocity.x = state.velocity.x - resultingMove * normal.x;
            state.velocity.y = state.velocity.y - resultingMove * normal.y;
        }
    }

    private calculateEntityCollisionImpulse(
        entity: PhysicsEntity,
        entities: PhysicsEntity[]
    ) {
        const state = entity.getState();
        const posA = state.position;
        const radiusA = state.radius;

        const finalImpulse = {
            x: 0,
            y: 0,
        };

        for (const b of entities) {
            if (entity === b) {
                continue;
            }
            const bState = b.getState();
            const posB = bState.position;
            const radiusB = bState.radius;
            const diffX = posB.x - posA.x;
            const diffY = posB.y - posA.y;

            // Distance that the entities should be at ^2
            const boundarySquared = (radiusA + radiusB) * (radiusA * radiusB);

            // Distance the entities are at ^2
            const distanceSquared = diffX * diffX + diffY * diffY;

            if (distanceSquared > boundarySquared) {
                continue;
            }

            const force =
                (1.0 - distanceSquared / boundarySquared) *
                (bState.mass / state.mass);
            const directionXSquared = diffX;
            const directionYSquared = diffY;

            finalImpulse.x += directionXSquared * (-force * FORCE_CONSTANT);
            finalImpulse.y += directionYSquared * (-force * FORCE_CONSTANT);
        }

        if (finalImpulse.x !== 0 || finalImpulse.y !== 0) {
            state.velocity.x += finalImpulse.x;
            state.velocity.y += finalImpulse.y;
        }
    }

    private moveEntities(entities: PhysicsEntity[]) {
        for (const entity of entities) {
            const state = entity.getState();

            state.position.x += state.velocity.x;
            state.position.y += state.velocity.y;

            state.velocity.x *= state.friction;
            state.velocity.y *= state.friction;
        }
    }
}
