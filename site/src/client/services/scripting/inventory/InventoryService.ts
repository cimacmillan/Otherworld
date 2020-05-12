import { ServiceLocator } from "../../ServiceLocator";
import { Item } from "../../../types/TypesItem";
import { createItemDrop, ItemDropArguments } from "../factory/ItemFactory";

export class InventoryService {

    public constructor(
        private serviceLocator: ServiceLocator
    ) {

    }

    public dropItems(item: ItemDropArguments, amount: number) {
        for (let i = 0; i < amount; i++) {
            this.dropItem(item);
        }
    }

    public dropItem(item: ItemDropArguments) {
        const itemEntity = createItemDrop(this.serviceLocator, item);
        this.serviceLocator.getWorld().addEntity(itemEntity);
    }

}

