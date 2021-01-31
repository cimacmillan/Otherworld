import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../Config";
import { GameEventSource } from "../../services/EventRouter";
import {
    InteractionSourceType,
    InteractionType,
} from "../../services/interaction/InteractionType";
import { PhysicsRegistration } from "../../services/physics/PhysicsService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Camera, Vector2D } from "../../types";
import { ActionDelay } from "../../util/time/ActionDelay";
import { InteractionStateType } from "../components/core/InteractionComponent";
import { PhysicsStateType } from "../components/core/PhysicsComponent";
import { Entity } from "../Entity";
import { PlayerEventType } from "../events/PlayerEvents";
import { TurnDirection, WalkDirection } from "../events/TravelEvents";
import { getEmptyInventory, Inventory } from "../scripting/items/types";
import { CameraState, HealthState } from "../state/State";
import { PlayerMovement } from "./PlayerMovement";

type InternalEntityState = PhysicsStateType & HealthState & CameraState;

export interface PlayerSerialisation {}

export class Player {
    public inventory: Inventory = getEmptyInventory();
    public movement: PlayerMovement;
    public surface: PhysicsStateType;
    private serviceLocator: ServiceLocator;
    private attackDelay: ActionDelay;
    private interactDelay: ActionDelay;

    private killed = false;
    private health = 1;

    private physicsRegistration: PhysicsRegistration;

    public constructor(
        serviceLocator: ServiceLocator,
        serialisation?: PlayerSerialisation
    ) {
        this.serviceLocator = serviceLocator;
        this.attackDelay = new ActionDelay(300);
        this.interactDelay = new ActionDelay(300);

        this.surface = {
            // position: { x: 40.5, y: 30.5 },
            position: { x: 31.5, y: 31.5 },
            height: 0,
            angle: 0,
            yOffset: 0,
            radius: DEFAULT_PLAYER_RADIUS,
            heightVelocity: 0,
            velocity: { x: 0, y: 0 },
            friction: 0.8,
            mass: 1,
            elastic: 0,
            collidesEntities: true,
            collidesWalls: true,
        };

        this.movement = new PlayerMovement(
            this.serviceLocator,
            () => this.surface,
            (vec: Vector2D) => (this.surface.velocity = vec),
            (ang: number) => (this.surface.angle = ang)
        );

        this.attackDelay = new ActionDelay(300);
        this.serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
            type: PlayerEventType.PLAYER_INFO_CHANGE,
            payload: {
                health: this.health,
            },
        });

        this.physicsRegistration = {
            collidesEntities: true,
            collidesWalls: true,
            setHeight: (height: number) => (this.surface.height = height),
            setHeightVelocity: (heightVelocity: number) =>
                (this.surface.heightVelocity = heightVelocity),
            setVelocity: (x: number, y: number) =>
                (this.surface.velocity = { x, y }),
            setPosition: (x: number, y: number) => {
                this.surface.position = { x, y };
            },
            getPhysicsInformation: () => this.surface,
        };
        this.serviceLocator
            .getPhysicsService()
            .registerPhysicsEntity(this.physicsRegistration);
    }

    public update(): void {
        this.movement.update();
    }

    public onStateTransition(
        entity: Entity<InteractionStateType>,
        from: InternalEntityState,
        to: InternalEntityState
    ): void {
        entity.emitGlobally({
            type: PlayerEventType.PLAYER_INFO_CHANGE,
            payload: {
                health: to.health,
            },
        });
    }

    public getCamera(): Camera {
        const { position, height, angle } = this.surface;
        const cameraHeight =
            height + this.movement.getHeadbobOffset() + DEFAULT_PLAYER_HEIGHT;
        return {
            position,
            angle,
            height: cameraHeight,
            fov: FOV,
            aspectRatio: ASPECT_RATIO,
            zNear: ZNEAR,
            zFar: ZFAR,
        };
    }

    public getPositon() {
        return this.surface.position;
    }

    public getInventory() {
        return this.inventory;
    }

    public interact() {
        if (!this.interactDelay.canAction()) {
            return;
        }
        this.interactDelay.onAction();
        const state = this.surface;
        const interacts = this.serviceLocator
            .getInteractionService()
            .getInteractables(
                InteractionType.INTERACT,
                state.position,
                state.angle,
                1.5
            );
        interacts.forEach((ent) => {
            // if (ent.entity === this.entity) {
            //     return;
            // }

            ent.onInteract &&
                ent.onInteract({
                    type: InteractionSourceType.PLAYER,
                    player: this,
                });
        });
    }

    public walk(direction: WalkDirection) {
        this.movement.walk(direction);
    }

    public turn(direction: TurnDirection) {
        this.movement.turn(direction);
    }

    public serialise(): PlayerSerialisation {
        return {};
    }

    public destroy() {
        this.serviceLocator
            .getPhysicsService()
            .unregisterPhysicsEntity(this.physicsRegistration);
    }
}
