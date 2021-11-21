import {
    ASPECT_RATIO,
    DEFAULT_PLAYER_HEIGHT,
    DEFAULT_PLAYER_RADIUS,
    FOV,
    ZFAR,
    ZNEAR,
} from "../../Config";
import {
    InteractionSourceType,
    InteractionType,
} from "../../services/interaction/InteractionType";
import { PhysicsRegistration } from "../../services/physics/PhysicsService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Camera, Vector2D } from "../../types";
import { ActionDelay } from "../../util/time/ActionDelay";
import { TurnDirection, WalkDirection } from "../commands/PlayerCommands";
import { PhysicsStateType } from "../components/core/PhysicsComponent";
import { getEmptyInventory, Inventory } from "../scripting/items/ItemTypes";
import { CameraState, HealthState } from "../state/State";
import { PlayerMovement } from "./PlayerMovement";
import { PlayerEquipment } from "./PlayerEquipment";
import { vec } from "../../util/math";
import { createBasicFood } from "../../resources/manifests/Items";

type InternalEntityState = PhysicsStateType & HealthState & CameraState;

export interface PlayerBonuses {
    moveSpeed: boolean,
    accuracy: boolean,
    ancientPowerCount: number,
    ancientPower: boolean,
    attackSpeed: boolean,
    protection: boolean
}

export interface PlayerSerialisation {
    inventory: Inventory;
    surface: PhysicsStateType;
    health: {
        current: number, 
        max: number
    };
    bonuses: PlayerBonuses,
    beatenGame: boolean;
}

const BASE_HEALTH = 10;

const getDefaultPlayerState = (): PlayerSerialisation => ({
    inventory: getEmptyInventory(),
    surface: {
        position: { x: 39, y: 29 },
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
    },
    health: {
        current: 10,
        max: BASE_HEALTH
    },
    bonuses: {
        moveSpeed: false,
        accuracy: false,
        ancientPowerCount: 0,
        ancientPower: false,
        attackSpeed: false,
        protection: false
    },
    beatenGame: false
});

export class Player {
    public state: PlayerSerialisation;
    public movement: PlayerMovement;
    public equipment: PlayerEquipment;

    private serviceLocator: ServiceLocator;

    private interactDelay: ActionDelay;
    private physicsRegistration: PhysicsRegistration;

    public constructor(
        serviceLocator: ServiceLocator,
        serialisation?: PlayerSerialisation
    ) {
        this.serviceLocator = serviceLocator;
        this.state = {...getDefaultPlayerState(), ...serialisation};
        this.interactDelay = new ActionDelay(300);

        this.movement = new PlayerMovement(
            this.serviceLocator,
            () => this.state.surface,
            (vec: Vector2D) => (this.state.surface.velocity = vec),
            (ang: number) => (this.state.surface.angle = ang),
            () => this.state.bonuses
        );

        this.equipment = new PlayerEquipment(
            this.serviceLocator,
            () => this,
            () => {
                const { x, y } = this.state.surface.position;
                return [x, this.state.surface.height, y];
            },
            () => this.state.surface.angle,
            () => this.state.bonuses
        );

        this.physicsRegistration = {
            collidesEntities: true,
            collidesWalls: true,
            setHeight: (height: number) => (this.state.surface.height = height),
            setHeightVelocity: (heightVelocity: number) =>
                (this.state.surface.heightVelocity = heightVelocity),
            setVelocity: (x: number, y: number) =>
                (this.state.surface.velocity = { x, y }),
            setPosition: (x: number, y: number) => {
                this.state.surface.position = { x, y };
            },
            getPhysicsInformation: () => this.state.surface,
        };
        this.serviceLocator
            .getPhysicsService()
            .registerPhysicsEntity(this.physicsRegistration);
    }

    public init() {
        this.equipment.init();
        this.serviceLocator.getStore().getActions().onPlayerHealth(this.state.health);
    }

    public update(): void {
        this.movement.update();
        this.equipment.update();
    }

    public getCamera(): Camera {
        const { position, height, angle } = this.state.surface;
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
        return this.state.surface.position;
    }

    public setPosition(x: number, y: number) {
        this.state.surface.position = { x, y };
    }

    public setAngle(angle: number) {
        this.state.surface.angle = angle;
    }

    public getAngle() {
        return this.state.surface.angle;
    }

    public getInventory() {
        return this.state.inventory;
    }

    public interact() {
        if (!this.interactDelay.canAction()) {
            return;
        }
        this.interactDelay.onAction();
        const state = this.state.surface;
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
                    player: this
                });
        });
    }

    public onDamage(amountBeforeBonus: number, push: Vector2D) {
        const amount = this.state.bonuses.protection ? amountBeforeBonus / 2 : amountBeforeBonus;
        this.state.health.current -= amount;
        if (this.state.health.current <= 0) {
            this.state.health.current = 0;
            this.onDeath();
        }
        this.serviceLocator.getStore().getActions().onPlayerHealth(this.state.health);
        this.serviceLocator.getStore().getActions().onPlayerDamaged();
        this.serviceLocator.getRenderService().screenShakeService.shake(amount);
        
        const difference = vec.vec_sub(this.getPositon(), push);
        if (difference.x > 0 || difference.y > 0) {
            const normal = vec.vec_normalize(difference);
            const force = amount * 0.1;

            this.state.surface.velocity.x += normal.x * force;
            this.state.surface.velocity.y += normal.y * force;
        }
    }

    public setHealthBonus(amount: number) {
        const diff = amount - this.state.health.max;
        this.state.health.current += diff;
        this.state.health.max = amount;
        if (this.state.health.current <= 0) {
            this.state.health.current = 1;
        }
    }

    // Crap but it works
    public getMutableState() {
        return this.state;
    }

    public getHealthBonus() {
        return this.state.health.max;
    }

    public onHealed(amount: number) {
        this.state.health.current = Math.min(this.state.health.current + amount, this.state.health.max);
        this.serviceLocator.getStore().getActions().onPlayerHealth(this.state.health);
    }

    private onDeath() {
        this.serviceLocator.getScriptingService().stopGame();
    }

    public attack() {
        this.equipment.attack();
    }

    public walk(direction: WalkDirection) {
        this.movement.walk(direction);
    }

    public turn(direction: TurnDirection) {
        this.movement.turn(direction);
    }

    public serialise(): PlayerSerialisation {
        return this.state;
    }

    public destroy() {
        this.serviceLocator
            .getPhysicsService()
            .unregisterPhysicsEntity(this.physicsRegistration);
        this.equipment.destroy();
    }
}
