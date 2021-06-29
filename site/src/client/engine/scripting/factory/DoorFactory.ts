import { vec3 } from "gl-matrix";
import { Audios } from "../../../resources/manifests/Audios";
import { GameItem } from "../../../resources/manifests/Items";
import { InteractionType } from "../../../services/interaction/InteractionType";
import {
    LineEmitter,
    LineEmitterType,
} from "../../../services/particle/emitters/LineEmitter";
import { GravityDropParticle } from "../../../services/particle/particles/GravityDropParticle";
import { ParticleEmitter } from "../../../services/particle/ParticleService";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { LockpickGameConfiguration } from "../../../ui/containers/minigame/LockPickContainer";
import { animation } from "../../../util/animation/Animations";
import { vec } from "../../../util/math";
import { DoesPlayerHaveItem } from "../../commands/InventoryCommands";
import { OpenLockpickingChallenge } from "../../commands/MiniGameCommands";
import { DeregisterKeyHint, RegisterKeyHint } from "../../commands/UICommands";
import {
    BoundaryComponent,
    BoundaryStateType,
} from "../../components/core/BoundaryComponent";
import {
    InteractionStateType,
    onCanBeInteractedWithByPlayer,
    onInteractedWith,
} from "../../components/core/InteractionComponent";
import {
    WallRenderComponent,
    WallState,
} from "../../components/core/WallRenderComponent";
import { AnimationComponent } from "../../components/util/AnimationComponent";
import { JoinComponent } from "../../components/util/JoinComponent";
import {
    SwitchComponent,
    SwitchComponents,
} from "../../components/util/SwitchComponent";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

enum DoorOpenState {
    OPEN = "OPEN",
    OPENING = "OPENING",
    CLOSED = "CLOSED",
}

interface DoorState {
    open: DoorOpenState;
}

interface LockedDoorState extends DoorState {
    keyId?: GameItem;
    configuration?: LockpickGameConfiguration;
}

type DoorStateType = WallState &
    BoundaryStateType &
    InteractionStateType &
    DoorState;

type LockedDoorStateType = WallState &
    BoundaryStateType &
    InteractionStateType &
    LockedDoorState;

export const emitsParticles = <T>(
    emitter: ParticleEmitter
): EntityComponent<T> => {
    return {
        getActions: (entity: Entity<T>) => ({
            onEntityCreated: () => {
                entity
                    .getServiceLocator()
                    .getParticleService()
                    .addEmitter(emitter);
            },
            onEntityDeleted: () => {
                entity
                    .getServiceLocator()
                    .getParticleService()
                    .removeEmitter(emitter);
            },
        }),
    };
};

const createDoorDustEmitter = (args: {
    initialStart: vec3;
    initialEnd: vec3;
}): LineEmitterType => {
    const { initialStart, initialEnd } = args;
    return LineEmitter({
        creator: (pos: vec3) => {
            const noise = Math.random() * 0.2;
            return GravityDropParticle({
                life: 30,
                r: 45 / 255 + noise,
                g: 48 / 255 + noise,
                b: 54 / 255 + noise,
                start: pos,
            });
        },
        initialStart,
        initialEnd,
        initialRate: 1,
    });
};

export const playsEffect = <T>(
    audio: Audios,
    gain: number
): EntityComponent<T> => {
    let audioRef: AudioBufferSourceNode;
    return {
        getActions: (entity: Entity<T>) => ({
            onEntityCreated: () => {
                audioRef = entity
                    .getServiceLocator()
                    .getAudioService()
                    .play(
                        entity.getServiceLocator().getResourceManager().manifest
                            .audio[audio],
                        gain
                    );
            },
            onEntityDeleted: () => {
                if (audioRef) {
                    audioRef.stop();
                }
            },
        }),
    };
};

export const doorOpensWithParticles = (
    start: Vector2D,
    end: Vector2D,
    initialState: DoorOpenState
): EntityComponent<DoorStateType> => {
    const getDoorPosition = (x: number) => {
        const diff = vec.vec_sub(start, end);
        const offsetVal = -0.9 * x + Math.random() * 0.06;
        const offset = vec.vec_mult_scalar(diff, offsetVal);
        const newStart = vec.vec_sub(start, offset);
        const newEnd = vec.vec_sub(end, offset);
        return [newStart, newEnd];
    };

    const lineEmitter = createDoorDustEmitter({
        initialStart: [start.x, 1, start.y],
        initialEnd: [end.x, 1, end.y],
    });

    const doorSwitch: SwitchComponents = {
        ["OPENING"]: JoinComponent<DoorStateType>([
            AnimationComponent<DoorStateType>(
                (entity: Entity<DoorStateType>) => {
                    return animation((x: number) => {
                        const [newStart, newEnd] = getDoorPosition(x);
                        entity.setState({
                            wallStart: newStart,
                            wallEnd: newEnd,
                        });
                        // lineEmitter.setStart([newStart.x, 1, newStart.y]);
                        lineEmitter.setEnd([newEnd.x, 1, newEnd.y]);
                    })
                        .speed(2000)
                        .whenDone(() =>
                            entity.setState({
                                open: DoorOpenState.OPEN,
                            })
                        );
                }
            ),
            emitsParticles<DoorStateType>(lineEmitter.emitter),
            playsEffect(Audios.DOOR_OPEN, 0.2),
        ]),
    };
    return new SwitchComponent(
        doorSwitch,
        initialState,
        (ent) => ent.getState().open
    );
};

export const createDoorState = (
    start: Vector2D,
    end: Vector2D,
    sprite: string
): DoorStateType => {
    const collides = true;
    return {
        boundaryState: {
            boundary: {
                start,
                end,
            },
            collides,
        },
        wallSprite: sprite,
        wallStart: start,
        wallEnd: end,
        position: vec.vec_mult_scalar(vec.vec_add(start, end), 0.5),
        height: 0,
        yOffset: 0,
        radius: 0.5,
        angle: 0,
        open: DoorOpenState.CLOSED,
    };
};

export const createDoor = (
    serviceLocator: ServiceLocator,
    state: DoorStateType
) => {
    const { wallStart, wallEnd, open } = state;
    let interactHintId: number | undefined;
    const doorSwitch: SwitchComponents = {
        ["CLOSED"]: JoinComponent<DoorStateType>([
            new BoundaryComponent(),
            onInteractedWith<DoorStateType>(
                InteractionType.INTERACT,
                (ent, source) => {
                    ent.setState({
                        open: DoorOpenState.OPENING,
                    });
                    if (interactHintId !== undefined) {
                        DeregisterKeyHint(serviceLocator)(interactHintId);
                    }
                }
            ),
            onCanBeInteractedWithByPlayer(
                InteractionType.INTERACT,
                () => {
                    interactHintId = RegisterKeyHint(serviceLocator)({
                        code: ["E"],
                        hint: "Open Door",
                    });
                },
                () => {
                    if (interactHintId !== undefined) {
                        DeregisterKeyHint(serviceLocator)(interactHintId);
                    }
                }
            ),
        ]),
    };

    return new Entity<DoorStateType>(
        serviceLocator,
        state,
        WallRenderComponent(),
        new SwitchComponent(doorSwitch, open, (ent) => ent.getState().open),
        doorOpensWithParticles(wallStart, wallEnd, open)
    );
};

interface LockedDoorConfig {
    start: Vector2D;
    end: Vector2D;
    spriteString: string;
    configuration?: LockpickGameConfiguration;
    keyId?: GameItem;
}

export const createLockedDoorState = (
    args: LockedDoorConfig
): LockedDoorStateType => {
    const { start, end, spriteString, configuration, keyId } = args;

    const collides = true;

    return {
        boundaryState: {
            boundary: {
                start,
                end,
            },
            collides,
        },
        wallSprite: spriteString,
        wallStart: start,
        wallEnd: end,
        position: vec.vec_mult_scalar(vec.vec_add(start, end), 0.5),
        height: 0,
        yOffset: 0,
        radius: 0.5,
        angle: 0,
        open: DoorOpenState.CLOSED,
        configuration,
        keyId,
    };
};

export const createLockedDoor = (
    serviceLocator: ServiceLocator,
    state: LockedDoorStateType
) => {
    const { wallStart, wallEnd, configuration, keyId, open } = state;

    let interactHintId: number | undefined;

    // TODO emit particles here
    const doorSwitch: SwitchComponents = {
        ["CLOSED"]: JoinComponent<DoorStateType>([
            new BoundaryComponent(),
            onInteractedWith<DoorStateType>(
                InteractionType.INTERACT,
                (ent, source) => {
                    if (keyId && DoesPlayerHaveItem(serviceLocator, keyId)) {
                        ent.setState({
                            open: DoorOpenState.OPENING,
                        });
                        serviceLocator
                            .getAudioService()
                            .play(
                                serviceLocator.getResourceManager().manifest
                                    .audio[Audios.DOOR_UNLOCK],
                                0.5
                            );
                        if (interactHintId !== undefined) {
                            DeregisterKeyHint(serviceLocator)(interactHintId);
                        }
                    } else if (configuration) {
                        OpenLockpickingChallenge(serviceLocator)(
                            (result: boolean) => {
                                ent.setState({
                                    open: result
                                        ? DoorOpenState.OPENING
                                        : DoorOpenState.CLOSED,
                                });
                                serviceLocator
                                    .getAudioService()
                                    .play(
                                        serviceLocator.getResourceManager()
                                            .manifest.audio[Audios.DOOR_UNLOCK],
                                        0.5
                                    );
                            },
                            configuration
                        );
                        if (interactHintId !== undefined) {
                            DeregisterKeyHint(serviceLocator)(interactHintId);
                        }
                    }
                }
            ),
            onCanBeInteractedWithByPlayer(
                InteractionType.INTERACT,
                () => {
                    if (keyId && DoesPlayerHaveItem(serviceLocator, keyId)) {
                        interactHintId = RegisterKeyHint(serviceLocator)({
                            code: ["E"],
                            hint: "Unlock Door",
                        });
                    } else if (configuration) {
                        interactHintId = RegisterKeyHint(serviceLocator)({
                            code: ["E"],
                            hint: "Lockpick Door",
                        });
                    } else {
                        interactHintId = RegisterKeyHint(serviceLocator)({
                            code: ["?"],
                            hint: "Locked",
                        });
                    }
                },
                () => {
                    if (interactHintId !== undefined) {
                        DeregisterKeyHint(serviceLocator)(interactHintId);
                    }
                }
            ),
        ]),
    };

    return new Entity<DoorStateType>(
        serviceLocator,
        state,
        WallRenderComponent(),
        new SwitchComponent(doorSwitch, open, (ent) => ent.getState().open),
        doorOpensWithParticles(wallStart, wallEnd, open)
    );
};
