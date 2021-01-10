import { Sprites } from "../../../resources/manifests/Sprites";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { Entity } from "../../Entity";
import { SpriteRenderState } from "../../state/State";

type LadderStateType = SpriteRenderState;

export const createLadder = (
    serviceLocator: ServiceLocator,
    x: number,
    y: number,
    sprite: Sprites
) => {
    const initialState: LadderStateType = {
        yOffset: 0,
        position: { x: x + 0.5, y: y + 0.5 },
        height: 0,
        radius: 1,
        angle: 0,
        spriteWidth: 1,
        spriteHeight: 1,
        sprite,
    };

    return new Entity<LadderStateType>(
        undefined,
        serviceLocator,
        initialState,
        SpriteRenderComponent()
    );
};
