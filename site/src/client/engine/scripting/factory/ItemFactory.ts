import { ServiceLocator } from "../../../services/ServiceLocator";
import { Vector2D } from "../../../types";
import { animation } from "../../../util/animation/Animations";
import { vec } from "../../../util/math";
import { PlayerPickUpItem } from "../../commands/InventoryCommands";
import {
    PhysicsComponent,
    PhysicsStateType,
} from "../../components/core/PhysicsComponent";
import { SpriteRenderComponent } from "../../components/core/SpriteRenderComponent";
import { AnimationComponent } from "../../components/util/AnimationComponent";
import { SwitchComponent } from "../../components/util/SwitchComponent";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import {
    SpriteRenderState,
    SurfacePosition,
} from "../../state/State";
import { Item } from "../items/ItemTypes";

const ITEM_SIZE_DEFAULT = 0.4;
const ITEM_SPEED = 0.1;
const ITEM_SPAWN_RADIUS = 0.1;

const ITEM_FRICTION = 0.8;
const ITEM_MASS = 1;
const ITEM_ELASTIC = 1;

export interface ItemDropArguments {
    item: Item;
    position: Vector2D;
    force?: Vector2D;
    withVelocity?: boolean;
}

type ItemStateType = SpriteRenderState &
    PhysicsStateType & {
        item: Item;
        attracting: "true" | "false";
    };

const ITEM_SIZE_CHANGE = 0.08;
const ITEM_HEIGHT_CHANGE = 0.2;
const ITEM_ATTRACTION_FORCE = 0.05;
const ITEM_COLLECT_DISTANCE = 0.5;
const ITEM_ATTRACT_DISTANCE = 1;

const HoversAnimation = (
    initialSpriteWidth: number,
    initialSpriteHeight: number,
    change: number
) =>
    AnimationComponent((entity: Entity<ItemStateType>) =>
        animation((x: number) => {
            const phase = Math.sin(x * Math.PI);
            const newSpriteWidth = initialSpriteWidth + phase * change;
            const newSpriteHeight = initialSpriteHeight + phase * change;
            entity.setState({
                spriteWidth: newSpriteWidth,
                spriteHeight: newSpriteHeight,
            });
        })
            .speed(350)
            .withOffset(Math.random())
            .looping()
    );

export const WhenInPlayerVicinity = <T extends SurfacePosition>(
    threshold: number,
    onEnter: (entity: Entity<T>) => void,
    onLeave: (entity: Entity<T>) => void
): EntityComponent<T> => {
    let entered = false;
    return {
        update: (entity: Entity<T>) => {
            const player = entity
                .getServiceLocator()
                .getScriptingService()
                .getPlayer();
            const { position } = entity.getState();
            const playerPosition = player.getPositon();
            const difference = vec.vec_sub(playerPosition, position);
            const distance = vec.vec_distance(difference);

            if (entered) {
                if (distance > threshold) {
                    entered = false;
                    onLeave(entity);
                }
            } else {
                if (distance <= threshold) {
                    entered = true;
                    onEnter(entity);
                }
            }
        },
        getActions: () => ({
            onEntityCreated: () => entered = false,
        }),
    };
};

const AttractedToPosition = (
    getPosition: (entity: Entity<PhysicsStateType>) => Vector2D,
    forceMult: number
) => {
    return {
        update: (entity: Entity<PhysicsStateType>) => {
            const { velocity, position } = entity.getState();
            const playerPosition = getPosition(entity);
            const difference = vec.vec_sub(playerPosition, position);
            const distance = vec.vec_distance(difference);
            const force = forceMult / (distance + 1);
            const attractor = vec.vec_mult_scalar(
                vec.vec_normalize(difference),
                force
            );
            entity.setState(
                {
                    velocity: vec.vec_add(velocity, attractor),
                },
                false
            );
        },
        getActions: () => ({}),
    };
};

export function createItemDropState(arg: ItemDropArguments) {
    const { item, position } = arg;

    const angle = Math.random() * 2 * Math.PI;
    const posDiff = { x: Math.sin(angle), y: Math.cos(angle) };
    let velocity = arg.withVelocity
        ? vec.vec_mult_scalar(posDiff, ITEM_SPEED)
        : { x: 0, y: 0 };

    velocity = arg.force ? vec.vec_add(velocity, arg.force) : velocity;

    const newPosition = vec.vec_add(
        position,
        vec.vec_mult_scalar(posDiff, ITEM_SPAWN_RADIUS)
    );

    const size = item.dropSize ? ITEM_SIZE_DEFAULT * item.dropSize : ITEM_SIZE_DEFAULT;

    return {
        yOffset: 0,
        position: newPosition,
        height: 0,
        heightVelocity: 0,
        radius: size / 2,
        angle: 0,
        spriteWidth: size,
        spriteHeight: size,
        sprite: item.spriteIcon,
        velocity,
        friction: ITEM_FRICTION,
        mass: ITEM_MASS,
        elastic: ITEM_ELASTIC,
        collidesEntities: false,
        collidesWalls: true,
        item: arg.item,
        attracting: "false",
    };
}

export function createItemDrop(
    serviceLocator: ServiceLocator,
    state: ItemStateType
) {
    const size = state.item.dropSize ? ITEM_SIZE_DEFAULT * state.item.dropSize : ITEM_SIZE_DEFAULT;
    const change = state.item.dropSize ? ITEM_SIZE_CHANGE * state.item.dropSize : ITEM_SIZE_CHANGE;

    return new Entity<ItemStateType>(
        serviceLocator,
        state,
        SpriteRenderComponent(),
        PhysicsComponent(),
        HoversAnimation(size, size, change),
        WhenInPlayerVicinity(
            ITEM_COLLECT_DISTANCE,
            (entity: Entity<ItemStateType>) => {
                entity.delete();
                PlayerPickUpItem(entity.getServiceLocator())(
                    entity.getState().item
                );
            },
            () => undefined
        ),
        new SwitchComponent(
            {
                ["false"]: WhenInPlayerVicinity(
                    ITEM_ATTRACT_DISTANCE,
                    (entity: Entity<ItemStateType>) => {
                        entity.setState({
                            attracting: "true",
                        });
                    },
                    () => undefined
                ),
                ["true"]: AttractedToPosition(
                    (ent) =>
                        ent
                            .getServiceLocator()
                            .getScriptingService()
                            .getPlayer()
                            .getPositon(),
                    ITEM_ATTRACTION_FORCE
                ),
            },
            "false",
            (entity: Entity<ItemStateType>) => entity.getState().attracting
        )
    );
}
