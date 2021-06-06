import { GameItem, GameItems } from "../../resources/manifests/Items";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Vector2D } from "../../types";
import { randomFloat } from "../../util/math";
import { EntityFactory } from "../scripting/factory/EntityFactory";
import { createItemDropState, ItemDropArguments } from "../scripting/factory/ItemFactory";
import { ItemDropDistribution } from "../scripting/items/ItemDrops";
import { Item } from "../scripting/items/ItemTypes";

export const DropItems = (
    serviceLocator: ServiceLocator,
    item: ItemDropArguments,
    amount: number
) => {
    for (let i = 0; i < amount; i++) {
        DropItem(serviceLocator, item);
    }
};

export const DropItem = (
    serviceLocator: ServiceLocator,
    item: ItemDropArguments
) => {
    const itemEntity = EntityFactory.ITEM_DROP(
        serviceLocator,
        createItemDropState(item)
    );
    serviceLocator.getWorld().addEntity(itemEntity);
};

export const DropItemDistribution = (
    serviceLocator: ServiceLocator,
    drops: ItemDropDistribution,
    position: Vector2D,
    force?: Vector2D,
    withVelocity?: boolean,
) => {
    const itemDrops = Object.entries(drops);
    itemDrops.forEach(([idString, val]) => {
        const [perc, amount] = val;
        const rand = randomFloat();
        const id = idString as GameItem;
        if (rand <= perc) {
            DropItems(serviceLocator, {
                item: GameItems[id],
                position,
                force,
                withVelocity
            }, amount);
        }
    })
}

