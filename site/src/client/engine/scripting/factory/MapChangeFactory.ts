import { Sprites } from "../../../resources/manifests/Sprites";
import { InteractionType } from "../../../services/interaction/InteractionType";
import { MapDestination } from "../../../services/map/MapService";
import { ServiceLocator } from "../../../services/ServiceLocator";
import {
    onInteractedWith,
    withInteractionHint,
} from "../../components/core/InteractionComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { Entity } from "../../Entity";
import { SpriteRenderState } from "../../state/State";

type LadderStateType = SpriteRenderState & {
    destination: MapDestination;
};

export const createLadderState = (
    x: number,
    y: number,
    sprite: Sprites,
    destination: MapDestination
) => {
    return {
        yOffset: 0,
        position: { x: x + 0.5, y: y + 0.5 },
        height: 0,
        radius: 1,
        angle: 0,
        spriteWidth: 1,
        spriteHeight: 1,
        sprite,
        destination,
    };
};

export const createLadder = (
    serviceLocator: ServiceLocator,
    state: LadderStateType
) => {
    return new Entity<LadderStateType>(
        serviceLocator,
        state,
        SpriteRenderComponent(),
        withInteractionHint(
            serviceLocator,
            InteractionType.INTERACT,
            ["E"],
            "Climb Ladder"
        ),
        onInteractedWith(
            InteractionType.INTERACT,
            (ent: Entity<LadderStateType>) => {
                ent.getServiceLocator()
                    .getMapService()
                    .goToMap(ent.getState().destination);
            }
        )
    );
};
