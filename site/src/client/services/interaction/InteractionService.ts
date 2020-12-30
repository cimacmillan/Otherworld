import { SurfacePosition } from "../../engine/state/State";
import { Vector2D } from "../../types";
import { ConsistentArray } from "../../util/array/ConsistentArray";
import { InteractionSource, InteractionType } from "./InteractionType";

type InteractionEntity = InteractionRegistration;

export interface InteractionRegistration {
    onInteract?: (source: InteractionSource) => void;
    getPosition: () => SurfacePosition;
    source: InteractionSource;
}

interface InteractionInfo {
    canInteract: boolean;
    distance: number;
    ref: InteractionEntity;
}

export class InteractionService {
    private interactionMap: {
        [key in InteractionType]?: ConsistentArray<InteractionEntity>;
    };

    public constructor() {
        this.interactionMap = {};
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
        const interactableEntities = array.filter(
            (entity) =>
                this.canInteract(entity, position, angle, range).canInteract
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
        const interactableEntities = array
            .map((entity) => this.canInteract(entity, position, angle, range))
            .filter((info) => info.canInteract);
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
        const state = entity.getPosition();

        const x1 = position.x;
        const y1 = position.y;

        const x2 = position.x + Math.sin(angle) * range;
        const y2 = position.y - Math.cos(angle) * range;

        const distx = x2 - x1;
        const disty = y2 - y1;

        const cx = state.position.x;
        const cy = state.position.y;
        const r = state.radius;

        const cxDist = cx - x1;
        const cyDist = cy - y1;

        if (cxDist * distx + cyDist * disty < 0) {
            return {
                canInteract: false,
                distance: -1,
                ref: entity,
            };
        }

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

    public registerEntity(entity: InteractionEntity, type: InteractionType) {
        this.interactionMap[type].add(entity);
    }

    public unregisterEntity(entity: InteractionEntity, type: InteractionType) {
        this.interactionMap[type].remove(entity);
    }
}
