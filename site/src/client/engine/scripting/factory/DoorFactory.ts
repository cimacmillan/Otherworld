import { InteractionType } from "../../../services/interaction/InteractionType";
import { Wall } from "../../../services/render/types/RenderInterface";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { LockpickGameConfiguration } from "../../../ui/containers/minigame/LockPickContainer";
import { animation } from "../../../util/animation/Animations";
import { vec } from "../../../util/math";
import { OpenLockpickingChallenge } from "../../commands/MiniGameCommands";
import { DeregisterUIHint, RegisterUIHint } from "../../commands/UICommands";
import {
    BoundaryComponent,
    BoundaryStateType,
} from "../../components/core/BoundaryComponent";
import {
    InteractionComponent,
    InteractionStateType,
    onCanBeInteractedWithByPlayer,
    onInteractedWith,
} from "../../components/core/InteractionComponent";
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
import { LockpickingResult } from "../../events/MiniGameEvents";
import { createWallType } from "./SceneryFactory";

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
                ent.setState({
                    open: DoorOpenState.OPEN,
                });
                if (interactHintId !== undefined) {
                    DeregisterUIHint(serviceLocator)(interactHintId);
                }
            }),
            onCanBeInteractedWithByPlayer(
                InteractionType.INTERACT,
                () => {
                    interactHintId = RegisterUIHint(serviceLocator)(
                        "E",
                        "Open Door"
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

export const createLockedDoor = (
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