import { GameItem } from "../../resources/manifests/Items";
import { InputState } from "../../services/input/InputService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { getEffect } from "../scripting/effects/Effects";
import { EntityFactory } from "../scripting/factory/EntityFactory";
import {
    createItemDropState,
    ItemDropArguments,
} from "../scripting/factory/ItemFactory";
import { EquipableItem, Inventory, Item, ItemType } from "../scripting/items/ItemTypes";
import { TutorialServiceEvent } from "../scripting/TutorialService";
import { CommandCreator } from "./Command";

export const OpenInventory: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => {
    serviceLocator
        .getTutorialService()
        .onEvent(TutorialServiceEvent.OPEN_INVENTORY);

    serviceLocator.getGame().setUpdateWorld(false);
    serviceLocator.getInputService().setInputState(InputState.INVENTORY);
    serviceLocator.getStore().getActions().onPlayerInventoryOpened();
};

export const CloseInventory: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => {
    serviceLocator
        .getTutorialService()
        .onEvent(TutorialServiceEvent.CLOSE_INVENTORY);

    serviceLocator.getGame().setUpdateWorld(true);
    serviceLocator.getInputService().setInputState(InputState.DEFAULT);
    serviceLocator.getStore().getActions().onPlayerInventoryClosed();
};

export const PlayerUseItemFromInventory = (serviceLocator: ServiceLocator) => (
    item: Item
) => {
    switch (item.type) {
        case ItemType.EQUIPMENT:
            EquipItemFromInventory(serviceLocator, item);
            break;
    }
};

export const EquipItemFromInventory = (serviceLocator: ServiceLocator, item: EquipableItem) => {
    const playerInventory = serviceLocator
        .getScriptingService()
        .getPlayer()
        .getInventory();
    RemoveItemFromInventory(playerInventory, item);
    const alreadyEquipped = playerInventory.equipped[item.equipmentType];
    if (alreadyEquipped) {
        AddItemToInventory(playerInventory, item);
        alreadyEquipped.onUnEquip?.forEach(effect => getEffect(effect).onTrigger({
            type: "PLAYER",
            player: serviceLocator.getScriptingService().getPlayer()
        }));
    }
    playerInventory.equipped[item.equipmentType] = item;
    serviceLocator.getStore().getActions().onPlayerItemEquipped(item);
    item.onEquip?.forEach(effect => getEffect(effect).onTrigger({
        type: "PLAYER",
        player: serviceLocator.getScriptingService().getPlayer()
    }));
    serviceLocator.getScriptingService().getPlayer().equipment.onEquip(item);
}

export const UnequipItemFromInventory =  (serviceLocator: ServiceLocator, item: EquipableItem) => {
    const playerInventory = serviceLocator
        .getScriptingService()
        .getPlayer()
        .getInventory();
    playerInventory.equipped[item.equipmentType] = undefined;
    AddItemToInventory(playerInventory, item);
    item.onUnEquip?.forEach(effect => getEffect(effect).onTrigger({
        type: "PLAYER",
        player: serviceLocator.getScriptingService().getPlayer()
    }));
    serviceLocator.getScriptingService().getPlayer().equipment.onUnequip(item);
}


export const PlayerPickUpItem = (serviceLocator: ServiceLocator) => (
    item: Item
) => {
    serviceLocator.getStore().getActions().onPlayerItemDropCollected(item);
    serviceLocator
        .getTutorialService()
        .onEvent(TutorialServiceEvent.PICKED_UP_ITEM);
    const playerInventory = serviceLocator
        .getScriptingService()
        .getPlayer()
        .getInventory();
    AddItemToInventory(playerInventory, item);
};

export const RemoveItemFromInventory = (inventory: Inventory, item: Item) => {
    for (let x = 0; x < inventory.items.length; x++) {
        const itemMetadata = inventory.items[x];
        if (itemMetadata.item.id === item.id) {
            itemMetadata.count--;
            if (itemMetadata.count <= 0) {
                inventory.items.splice(x, 1);
            }
            break;
        }
    }
}

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
    const itemEntity = EntityFactory.ITEM_DROP(
        serviceLocator,
        createItemDropState(item)
    );
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
