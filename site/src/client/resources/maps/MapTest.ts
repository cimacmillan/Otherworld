import { AddItemToInventory, PlayerPickUpItem, PlayerUseItemFromInventory } from "../../engine/commands/InventoryCommands";
import { ServiceLocator } from "../../services/ServiceLocator";
import { Audios } from "../manifests/Audios";
import { GameItems } from "../manifests/Items";
import { UnloadedMap } from "./MapTypes";

export const MapTest: UnloadedMap = {
    url: "map/test.tmx",
    metadata: {
        onStart: (serviceLocator: ServiceLocator) => {
            PlayerPickUpItem(serviceLocator)(GameItems.WEAPON_WOOD_STICK);
            PlayerUseItemFromInventory(serviceLocator)(GameItems.WEAPON_WOOD_STICK);

        },
    }
}