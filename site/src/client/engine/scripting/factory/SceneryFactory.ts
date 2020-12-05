import { SCENERY_PIXEL_DENSITY } from "../../../Config";
import { SpriteSheets } from "../../../resources/manifests/Resources";
import {
    InteractionSource,
    InteractionType,
} from "../../../services/interaction/InteractionType";
import { Floor, Wall } from "../../../services/render/types/RenderInterface";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { LockpickGameConfiguration } from "../../../ui/containers/minigame/LockPickContainer";
import { animation } from "../../../util/animation/Animations";
import { vec } from "../../../util/math/Vector";
import { throttleCount } from "../../../util/time/Throttle";
import { OpenLockpickingChallenge } from "../../commands/MiniGameCommands";
import { DeregisterUIHint, RegisterUIHint } from "../../commands/UICommands";
import {
    BoundaryComponent,
    BoundaryStateType,
} from "../../components/core/BoundaryComponent";
import {
    FloorRenderComponent,
    FloorStateType,
} from "../../components/core/FloorRenderComponent";
import {
    InteractionComponent,
    InteractionStateType,
} from "../../components/core/InteractionComponent";
import {
    SpriteRenderComponent,
    SpriteStateType,
} from "../../components/core/SpriteRenderComponent";
import {
    WallRenderComponent,
    WallStateType,
} from "../../components/core/WallRenderComponent";
import { AnimationComponent } from "../../components/util/AnimationComponent";
import { JoinComponent } from "../../components/util/JoinComponent";
import {
    SwitchComponent,
    SwitchComponents,
} from "../../components/util/SwitchComponent";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { LockpickingResult } from "../../events/MiniGameEvents";

export function createStaticFloor(
    serviceLocator: ServiceLocator,
    spriteString: string,
    height: number,
    start: Vector2D,
    end: Vector2D
) {
    const {
        textureCoordinate,
        pixelCoordinate,
    } = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(spriteString);

    const floor: Floor = {
        startPos: [start.x, start.y],
        endPos: [end.x, end.y],
        height,
        textureX: textureCoordinate.textureX,
        textureY: textureCoordinate.textureY,
        textureWidth:
            (Math.abs(end.x - start.x) *
                textureCoordinate.textureWidth *
                SCENERY_PIXEL_DENSITY) /
            pixelCoordinate.textureWidth,
        textureHeight:
            (Math.abs(end.y - start.y) *
                textureCoordinate.textureHeight *
                SCENERY_PIXEL_DENSITY) /
            pixelCoordinate.textureWidth,
        repeatWidth: textureCoordinate.textureWidth,
        repeatHeight: textureCoordinate.textureHeight,
    };

    const initialState: FloorStateType = {
        floorState: {
            floor,
        },
        exists: false,
    };

    return new Entity<FloorStateType>(
        undefined,
        serviceLocator,
        initialState,
        new FloorRenderComponent()
    );
}

export function createStaticWall(
    serviceLocator: ServiceLocator,
    spriteString: string,
    start: Vector2D,
    end: Vector2D,
    height: number = 1,
    offset: number = 0,
    collides: boolean = true
) {
    const wall = createWallType(
        serviceLocator,
        spriteString,
        start,
        end,
        height,
        offset
    );

    const initialState: WallStateType & BoundaryStateType = {
        exists: false,
        boundaryState: {
            boundary: {
                start,
                end,
            },
            collides,
        },
        wallState: {
            wall,
        },
    };

    return new Entity<WallStateType & BoundaryStateType>(
        undefined,
        serviceLocator,
        initialState,
        new WallRenderComponent(),
        new BoundaryComponent()
    );
}

export function createStaticSprite(
    serviceLocator: ServiceLocator,
    spriteString: string,
    position: Vector2D,
    height: number,
    spriteWidth: number,
    spriteHeight: number
) {
    const sprite = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(spriteString);

    const initialState: SpriteStateType = {
        yOffset: 0,
        exists: true,
        position,
        height,
        radius: 0,
        angle: 0,
        shouldRender: true,
        textureCoordinate: sprite.textureCoordinate,
        spriteWidth,
        spriteHeight,
    };

    return new Entity<SpriteStateType>(
        undefined,
        serviceLocator,
        initialState,
        new SpriteRenderComponent()
    );
}

export const createBlock = (
    serviceLocator: ServiceLocator,
    x: number,
    y: number,
    sprite: string
) => {
    const vec1 = { x, y };
    const vec2 = { x: x + 1, y };
    const vec3 = { x: x + 1, y: y + 1 };
    const vec4 = { x, y: y + 1 };
    return [
        createStaticWall(serviceLocator, sprite, vec1, vec2),
        createStaticWall(serviceLocator, sprite, vec2, vec3),
        createStaticWall(serviceLocator, sprite, vec3, vec4),
        createStaticWall(serviceLocator, sprite, vec4, vec1),
    ];
};

const createWallType = (
    serviceLocator: ServiceLocator,
    spriteString: string,
    start: Vector2D,
    end: Vector2D,
    height: number = 1,
    offset: number = 0
): Wall => {
    const sprite = serviceLocator
        .getResourceManager()
        .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(spriteString);

    const textureWidth =
        (Math.sqrt(
            Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
        ) *
            sprite.textureCoordinate.textureWidth *
            SCENERY_PIXEL_DENSITY) /
        sprite.pixelCoordinate.textureWidth;
    const textureHeight =
        (sprite.textureCoordinate.textureHeight *
            height *
            SCENERY_PIXEL_DENSITY) /
        sprite.pixelCoordinate.textureHeight;

    return {
        startPos: [start.x, start.y],
        endPos: [end.x, end.y],
        startHeight: height,
        endHeight: height,
        startOffset: offset,
        endOffset: offset,
        textureX: sprite.textureCoordinate.textureX,
        textureY: sprite.textureCoordinate.textureY,
        textureWidth,
        textureHeight,
        repeatWidth: sprite.textureCoordinate.textureWidth,
        repeatHeight: sprite.textureCoordinate.textureHeight,
    };
};

const onInteractedWith = <T extends InteractionStateType>(
    type: InteractionType,
    callback: (entity: Entity<T>, source: InteractionSource) => void
): EntityComponent<T> => {
    return {
        onEvent: (entity: Entity<T>, event: GameEvent) => {
            if (event.type === type) {
                callback(entity, event.source);
            }
        },
    };
};

const onCanBeInteractedWithByPlayer = <T extends InteractionStateType>(
    type: InteractionType,
    onEnter: () => void,
    onLeave: () => void
): EntityComponent<T> => {
    let canBeInteractedWith = false;

    const onUpdate = (entity: Entity<T>) => {
        const player = entity
            .getServiceLocator()
            .getScriptingService()
            .getPlayer();
        const { position, angle } = player.getCamera();
        const interacts = entity
            .getServiceLocator()
            .getInteractionService()
            .getInteractables(InteractionType.INTERACT, position, angle, 1.5);
        const isInteractable = interacts.some(
            (interactable) => interactable === entity
        );
        if (isInteractable && canBeInteractedWith === false) {
            onEnter();
            canBeInteractedWith = true;
        }
        if (!isInteractable && canBeInteractedWith === true) {
            onLeave();
            canBeInteractedWith = false;
        }
    };

    return {
        update: throttleCount(onUpdate, 5),
    };
};

enum DoorOpenState {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
}

interface DoorState {
    open: DoorOpenState;
}

type DoorStateType = WallStateType &
    BoundaryStateType &
    InteractionStateType &
    DoorState;

export const createDoor = (
    serviceLocator: ServiceLocator,
    x: number,
    y: number,
    spriteString: string,
    configuration: LockpickGameConfiguration,
    horizontal: boolean = true
) => {
    const start = horizontal ? { x, y: y + 0.5 } : { x: x + 0.5, y: y + 1 };
    const end = horizontal ? { x: x + 1, y: y + 0.5 } : { x: x + 0.5, y };
    const collides = true;

    const wall: Wall = createWallType(serviceLocator, spriteString, start, end);

    const initialState = {
        exists: false,
        boundaryState: {
            boundary: {
                start,
                end,
            },
            collides,
        },
        wallState: {
            wall,
        },
        position: vec.vec_mult_scalar(vec.vec_add(start, end), 0.5),
        height: 0,
        yOffset: 0,
        radius: 0.5,
        angle: 0,
        interactable: {
            [InteractionType.INTERACT]: true,
        },
        open: DoorOpenState.CLOSED,
    };

    let interactHintId: number | undefined;

    // TODO emit particles here
    const doorSwitch: SwitchComponents = {
        ["OPEN"]: AnimationComponent<DoorStateType>(
            (entity: Entity<DoorStateType>) => {
                return animation((x: number) => {
                    const offsetVal = 0.9 * x + Math.random() * 0.06;
                    const offset = horizontal
                        ? {
                              x: offsetVal,
                              y: 0,
                          }
                        : {
                              x: 0,
                              y: -offsetVal,
                          };
                    const newStart = vec.vec_sub(start, offset);
                    const newEnd = vec.vec_sub(end, offset);

                    const newWall = createWallType(
                        serviceLocator,
                        spriteString,
                        newStart,
                        newEnd
                    );

                    entity.setState({
                        wallState: {
                            wall: newWall,
                        },
                    });
                }).speed(2000);
            }
        ),
        ["CLOSED"]: JoinComponent<DoorStateType>([
            new BoundaryComponent(),
            new InteractionComponent(),
            onInteractedWith(InteractionType.INTERACT, (ent, source) => {
                OpenLockpickingChallenge(serviceLocator)(
                    (result: LockpickingResult) => {
                        ent.setState({
                            open: result
                                ? DoorOpenState.OPEN
                                : DoorOpenState.CLOSED,
                        });
                    },
                    configuration
                );
                if (interactHintId !== undefined) {
                    DeregisterUIHint(serviceLocator)(interactHintId);
                }
            }),
            onCanBeInteractedWithByPlayer(
                InteractionType.INTERACT,
                () => {
                    interactHintId = RegisterUIHint(serviceLocator)(
                        "E",
                        "Unlock Door"
                    );
                },
                () => {
                    if (interactHintId !== undefined) {
                        DeregisterUIHint(serviceLocator)(interactHintId);
                    }
                }
            ),
        ]),
    };

    return new Entity<DoorStateType>(
        undefined,
        serviceLocator,
        initialState,
        new WallRenderComponent(),
        new SwitchComponent(
            doorSwitch,
            initialState.open,
            (ent) => ent.getState().open
        )
    );
};
