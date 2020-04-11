import { InteractionStateType } from "../../engine/components/InteractionComponent";
import { Entity } from "../../engine/Entity";
import { Vector2D } from "../../types";
import { ConsistentArray } from "../../util/array/ConsistentArray";
import { InteractionType } from "./InteractionType";

type InteractionEntity = Entity<InteractionStateType>;

interface InteractionInfo {
    canInteract: boolean;
    distance: number;
    ref: InteractionEntity;
}

export class InteractionService {
    private interactionMap: {
        [key in InteractionType]: ConsistentArray<InteractionEntity>;
    };

    public constructor() {
        for (const key in InteractionType) {
            this.interactionMap[key as InteractionType] = new ConsistentArray();
        }
    }

    public update() {
        for (const key in InteractionType) {
            this.interactionMap[key as InteractionType].sync();
        }
    }

    public getInteractables(
        type: InteractionType,
        position: Vector2D,
        angle: number,
        range: number
    ): InteractionEntity[] {
        const array = this.interactionMap[type].getArray();
        const interactableEntities = array.filter((entity) =>
            this.canInteract(entity, position, angle, range)
        );
        return interactableEntities;
    }

    public getInteractable(
        type: InteractionType,
        position: Vector2D,
        angle: number,
        range: number
    ): InteractionEntity | undefined {
        const array = this.interactionMap[type].getArray();
        const interactableEntities = array.map((entity) =>
            this.canInteract(entity, position, angle, range)
        );
        if (interactableEntities.length === 0) {
            return undefined;
        }
        return interactableEntities.sort(
            (a: InteractionInfo, b: InteractionInfo) => a.distance - b.distance
        )[0].ref;
    }

    public canInteract(
        entity: InteractionEntity,
        position: Vector2D,
        angle: number,
        range: number
    ): InteractionInfo {
        const state = entity.getState();

        const x1 = position.x;
        const y1 = position.y;

        const x2 = position.x + Math.sin(angle) * range;
        const y2 = position.y - Math.cos(angle) * range;

        const distx = x2 - x1;
        const disty = y2 - y1;

        const cx = state.position.x;
        const cy = state.position.y;
        const r = state.radius;

        const len = Math.sqrt(distx * distx + disty * disty);
        let dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / (len * len);

        dot = Math.min(1, Math.max(dot, 0));

        const closestX = x1 + dot * distx;
        const closestY = y1 + dot * disty;

        const diffX = cx - closestX;
        const diffY = cy - closestY;

        const distance = Math.sqrt(diffX * diffX + diffY * diffY);

        const canInteract = distance < r;
        return {
            canInteract,
            distance,
            ref: entity,
        };
    }

    public registerEntity(
        entity: Entity<InteractionStateType>,
        type: InteractionType
    ) {
        this.interactionMap[type].add(entity);
    }

    public unregisterEntity(
        entity: Entity<InteractionStateType>,
        type: InteractionType
    ) {
        this.interactionMap[type].remove(entity);
    }
}
