import { GameItem } from "../../resources/manifests/Items";
import { GameEventSource } from "../../services/EventRouter";
import { InputState } from "../../services/input/InputService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { PlayerEventType } from "../events/PlayerEvents";
import {
    createItemDrop,
    ItemDropArguments,
} from "../scripting/factory/ItemFactory";
import { Inventory, Item } from "../scripting/items/types";
import { CommandCreator } from "./Command";

export const OpenInventory: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => {
    serviceLocator.getGame().setUpdateWorld(false);
    serviceLocator.getInputService().setInputState(InputState.INVENTORY);
    serviceLocator.getEventRouter().routeEvent(GameEventSource.INPUT, {
        type: PlayerEventType.PLAYER_INVENTORY_OPENED,
    });
};

export const CloseInventory: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => {
    serviceLocator.getGame().setUpdateWorld(true);
    serviceLocator.getInputService().setInputState(InputState.DEFAULT);
    serviceLocator.getEventRouter().routeEvent(GameEventSource.INPUT, {
        type: PlayerEventType.PLAYER_INVENTORY_CLOSED,
    });
};

export const PlayerUseItemFromInventory = (serviceLocator: ServiceLocator) => (
    item: Item
) => {
    console.log("Used item from inventory ", item);
};

export const PlayerPickUpItem = (serviceLocator: ServiceLocator) => (
    item: Item
) => {
    serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
        type: PlayerEventType.PLAYER_ITEM_DROP_COLLECTED,
        payload: {
            item,
        },
    });
    const playerInventory = serviceLocator
        .getScriptingService()
        .getPlayer()
        .getInventory();
    AddItemToInventory(playerInventory, item);
};

export const AddItemToInventory = (inventory: Inventory, item: Item) => {
    let countIncreased = false;
    for (let x = 0; x < inventory.items.length; x++) {
        const itemMetadata = inventory.items[x];
        if (itemMetadata.item.id === item.id && itemMetadata.item.stackable) {
            itemMetadata.count++;
            countIncreased = true;
            break;
        }
    }
    if (!countIncreased) {
        inventory.items.push({
            item,
            count: 1,
        });
    }
};

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
    const itemEntity = createItemDrop(serviceLocator, item);
    serviceLocator.getWorld().addEntity(itemEntity);
};

export const DoesPlayerHaveItem = (
    serviceLocator: ServiceLocator,
    item: GameItem
) => {
    return DoesHaveItem(
        serviceLocator.getScriptingService().getPlayer().getInventory(),
        item
    );
};

export const DoesHaveItem = (inventory: Inventory, item: GameItem) => {
    return inventory.items.some(
        (inventoryItem) => inventoryItem.item.id === item
    );
};

// public useItemFromInventory(
//     entity: Entity<InventoryState & HealthState>,
//     item: ItemMetadata
// ) {
//     const itemBehaviour = ItemBehaviours.getItemBehaviours(item.item);

//     if (
//         !itemBehaviour.canConsume({
//             entity,
//             serviceLocator: this.serviceLocator,
//         })
//     ) {
//         return;
//     }

//     itemBehaviour.onConsume({
//         entity,
//         serviceLocator: this.serviceLocator,
//     });
//     entity.emit({
//         type: PlayerEventType.PLAYER_ITEM_USED,
//         payload: { item: item.item },
//     });
// }
