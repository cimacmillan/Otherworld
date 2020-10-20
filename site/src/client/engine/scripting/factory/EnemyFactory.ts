import {
    Sprites,
    SpriteSheets,
} from "../../../resources/manifests/DefaultManifest";
import { ServiceLocator } from "../../../services/ServiceLocator";
import {
    PhysicsComponent,
    PhysicsState,
} from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { Entity } from "../../Entity";
import { BaseState, SpriteRenderState } from "../../state/State";

export type SlimeState = BaseState & SpriteRenderState & PhysicsState;

export function createSlime(
    serviceLocator: ServiceLocator,
    state: SlimeState
): Entity<SlimeState> {
    return new Entity<SlimeState>(
        undefined,
        serviceLocator,
        state,
        new SpriteRenderComponent(),
        new PhysicsComponent()
    );
}

export function getSlimeState(
    serviceLocator: ServiceLocator,
    x: number,
    y: number
): SlimeState {
    const {
        textureCoordinate,
    } = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(Sprites.SLIME);
    return {
        exists: true,
        shouldRender: true,
        textureCoordinate,
        spriteWidth: 1,
        spriteHeight: 1,
        position: { x, y },
        height: 1,
        radius: 1,
        angle: 0,
        velocity: { x: 0, y: 0 },
        friction: 0.9,
        mass: 1,
        elastic: 0.9,
        collidesEntities: true,
        collidesWalls: true,
    };
}
