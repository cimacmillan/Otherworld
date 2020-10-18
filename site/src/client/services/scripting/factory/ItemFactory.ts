import {
    PhysicsComponent,
    PhysicsStateType,
} from "../../../engine/components/core/PhysicsComponent";
import {
    ItemDropComponent,
    ItemDropComponentState,
} from "../../../engine/components/items/ItemDropComponent";
import {
    SpriteRenderComponent,
    SpriteStateType,
} from "../../../engine/components/rendering/SpriteRenderComponent";
import { Entity } from "../../../engine/Entity";
import { SpriteSheets } from "../../../resources/manifests/DefaultManifest";
import { Vector2D } from "../../../types";
import { vec } from "../../../util/math";
import { ServiceLocator } from "../../ServiceLocator";
import { Item } from "../items/types";

const ITEM_SIZE = 0.4;
const ITEM_SPEED = 0.1;
const ITEM_SPAWN_RADIUS = 0.1;

const ITEM_FRICTION = 0.8;
const ITEM_MASS = 1;
const ITEM_ELASTIC = 1;

export interface ItemDropArguments {
    item: Item;
    position: Vector2D;
    force?: Vector2D;
}

type ItemStateType = SpriteStateType &
    PhysicsStateType &
    ItemDropComponentState;

export function createItemDrop(
    serviceLocator: ServiceLocator,
    arg: ItemDropArguments
) {
    const { item, position } = arg;

    const angle = Math.random() * 2 * Math.PI;
    const posDiff = { x: Math.sin(angle), y: Math.cos(angle) };
    let velocity = vec.vec_mult_scalar(posDiff, ITEM_SPEED);

    velocity = arg.force ? vec.vec_add(velocity, arg.force) : velocity;

    const newPosition = vec.vec_add(
        position,
        vec.vec_mult_scalar(posDiff, ITEM_SPAWN_RADIUS)
    );

    const initialState: ItemStateType = {
        exists: false,
        position: newPosition,
        height: ITEM_SIZE / 2,
        radius: ITEM_SIZE / 2,
        angle: 0,
        shouldRender: true,
        spriteWidth: ITEM_SIZE,
        spriteHeight: ITEM_SIZE,
        textureCoordinate: serviceLocator
            .getResourceManager()
            .manifest.spritesheets[SpriteSheets.SPRITE].getSprite(
                item.spriteIcon
            ).textureCoordinate,
        velocity,
        friction: ITEM_FRICTION,
        mass: ITEM_MASS,
        elastic: ITEM_ELASTIC,
        collidesEntities: false,
        collidesWalls: true,
        item: arg.item,
    };

    return new Entity<ItemStateType>(
        serviceLocator,
        initialState,
        new SpriteRenderComponent(),
        new PhysicsComponent(),
        new ItemDropComponent()
    );
}
