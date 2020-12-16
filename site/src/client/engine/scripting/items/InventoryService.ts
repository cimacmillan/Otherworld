import { ServiceLocator } from "../../../services/ServiceLocator";
import { Entity } from "../../Entity";
import { PlayerEventType } from "../../events/PlayerEvents";
import { HealthState, InventoryState } from "../../state/State";
import { createItemDrop, ItemDropArguments } from "../factory/ItemFactory";
import { ItemBehaviours } from "./ItemBehaviours";
import { ItemMetadata } from "./types";

export class InventoryService {
    public constructor(private serviceLocator: ServiceLocator) {}

    public dropItems(item: ItemDropArguments, amount: number) {
        for (let i = 0; i < amount; i++) {
            this.dropItem(item);
        }
    }

    public dropItem(item: ItemDropArguments) {
        const itemEntity = createItemDrop(this.serviceLocator, item);
        this.serviceLocator.getWorld().addEntity(itemEntity);
    }

    public useItemFromInventory(
        entity: Entity<InventoryState & HealthState>,
        item: ItemMetadata
    ) {
        const itemBehaviour = ItemBehaviours.getItemBehaviours(item.item);

        if (
            !itemBehaviour.canConsume({
                entity,
                serviceLocator: this.serviceLocator,
            })
        ) {
            return;
        }

        itemBehaviour.onConsume({
            entity,
            serviceLocator: this.serviceLocator,
        });
        entity.emit({
            type: PlayerEventType.PLAYER_ITEM_USED,
            payload: { item: item.item },
        });
    }
}
