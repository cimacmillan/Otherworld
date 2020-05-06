import {
    CrabletLogicComponent,
    MacatorStateType,
} from "../../../engine/components/CrabletLogicComponent";
import {
    EggLogicComponent,
    EggStateType,
} from "../../../engine/components/enemies/EggLogicComponent";
import { InteractionComponent } from "../../../engine/components/InteractionComponent";
import { PhysicsComponent } from "../../../engine/components/physics/PhysicsComponent";
import { SpriteRenderComponent } from "../../../engine/components/rendering/SpriteRenderComponent";
import { Entity } from "../../../engine/Entity";
import { EggState, MacatorState } from "../../../engine/state/Macator";
import { Animations, SpriteSheets } from "../../../resources/manifests/Types";
import { ServiceLocator } from "../../ServiceLocator";

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
        spriteState: {},
        position: { x, y },
        height: DEFAULT_HEIGHT,
        radius: 0.5,
        angle: 0,
        collides: true,
        interactable: {
            ATTACK: true,
        },
    };

    return new Entity<MacatorStateType>(
        serviceLocator,
        initialState,
        new SpriteRenderComponent(),
        new CrabletLogicComponent(x, y),
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
        spriteState: {
            sprite: {
                position: [0, 0],
                size: [SIZE, SIZE],
                height: SIZE / 2,
                texture: firstFrame.textureCoordinate,
            },
        },
        position: { x: 0, y: 0 },
        collides: true,
        height: SIZE / 2,
        angle: 0,
    };

    return new Entity<EggStateType>(
        serviceLocator,
        initialState,
        new SpriteRenderComponent(),
        new PhysicsComponent(),
        new EggLogicComponent()
    );
}
