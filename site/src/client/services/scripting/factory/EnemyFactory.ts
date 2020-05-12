import {
    EggLogicComponent,
    EggStateType,
} from "../../../engine/components/enemies/EggLogicComponent";
import {
    MacatorLogicComponent,
    MacatorStateType,
} from "../../../engine/components/enemies/macator/MacatorLogicComponent";
import { MacatorRenderComponent } from "../../../engine/components/enemies/macator/MacatorRenderComponent";
import { InteractionComponent } from "../../../engine/components/InteractionComponent";
import { PhysicsComponent } from "../../../engine/components/physics/PhysicsComponent";
import { SpriteRenderComponent } from "../../../engine/components/rendering/SpriteRenderComponent";
import { Entity } from "../../../engine/Entity";
import { EggState, MacatorState } from "../../../engine/state/Macator";
import { Animations, SpriteSheets } from "../../../resources/manifests/Types";
import { TextureCoordinate } from "../../../resources/SpriteSheet";
import { ServiceLocator } from "../../ServiceLocator";

const noTexture: TextureCoordinate = {
    textureX: 0,
    textureY: 0,
    textureWidth: 0,
    textureHeight: 0,
};

export function createMacator(
    serviceLocator: ServiceLocator,
    x: number,
    y: number
) {
    const DEFAULT_HEIGHT = 0.5;

    const initialState: MacatorStateType = {
        macatorState: MacatorState.WALKING,
        velocity: { x: 0, y: 0 },
        friction: 0.8,
        mass: 0.4,
        elastic: 0,
        health: 1,
        exists: false,
        position: { x, y },
        height: DEFAULT_HEIGHT,
        radius: 0.5,
        angle: 0,
        collidesEntities: true,
        collidesWalls: true,
        interactable: {
            ATTACK: true,
        },
        shouldRender: true,
        textureCoordinate: noTexture,
        spriteWidth: 1,
        spriteHeight: 1,
        macatorType: Math.floor(Math.random() * 3),
    };

    return new Entity<MacatorStateType>(
        serviceLocator,
        initialState,
        new SpriteRenderComponent(),
        new MacatorRenderComponent(),
        new MacatorLogicComponent(),
        new PhysicsComponent(),
        new InteractionComponent()
    );
}

export function createEgg(serviceLocator: ServiceLocator) {
    const SIZE = 3;

    const spritesheet = serviceLocator.getResourceManager().manifest
        .spritesheets[SpriteSheets.SPRITE];
    const firstFrame = spritesheet.getAnimationFrame(Animations.EGG_CHARGE, 0);

    const initialState: EggStateType = {
        logicState: EggState.IDLE,
        targetCount: 1,
        currentLiving: 0,
        velocity: { x: 0, y: 0 },
        friction: 0.5,
        mass: 1,
        elastic: 0,
        radius: SIZE / 2,
        exists: false,
        textureCoordinate: firstFrame.textureCoordinate,
        spriteWidth: SIZE,
        spriteHeight: SIZE,
        position: { x: 0, y: 0 },
        collidesEntities: true,
        collidesWalls: true,
        height: SIZE / 2,
        angle: 0,
        shouldRender: true,
    };

    return new Entity<EggStateType>(
        serviceLocator,
        initialState,
        new SpriteRenderComponent(),
        new PhysicsComponent(),
        new EggLogicComponent()
    );
}
