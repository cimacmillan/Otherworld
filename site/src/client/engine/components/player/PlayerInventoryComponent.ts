import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { PlayerEventType } from "../../events/PlayerEvents";
import { PlayerState } from "../../scripting/factory/PlayerFactory";
import { Item } from "../../scripting/items/types";

export class PlayerInventoryComponent<T extends PlayerState>
    implements EntityComponent<T> {
    public onEvent(entity: Entity<PlayerState>, event: GameEvent): void {
        switch (event.type) {
            case PlayerEventType.PLAYER_ITEM_DROP_COLLECTED:
                this.onPickedUp(entity, event.payload.item);
                break;
            case PlayerEventType.PLAYER_ITEM_USED:
                this.onItemUsed(entity, event.payload.item);
                break;
        }
    }

    private onPickedUp(entity: Entity<PlayerState>, item: Item) {
        const { inventory } = entity.getState();

        let countIncreased = false;
        for (let x = 0; x < inventory.items.length; x++) {
            const itemMetadata = inventory.items[x];
            if (
                itemMetadata.item.id === item.id &&
                itemMetadata.item.stackable
            ) {
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

        entity.setState({ inventory });
    }

    private onItemUsed(entity: Entity<PlayerState>, item: Item) {
        const { inventory } = entity.getState();
        const items = [...inventory.items];

        for (let x = 0; x < inventory.items.length; x++) {
            const itemMetadata = items[x];
            if (itemMetadata.item.id === item.id) {
                itemMetadata.count--;
                break;
            }
        }

        const newInventory = {
            items: items.filter((item) => item.count > 0),
        };

        entity.setState({
            inventory: newInventory,
        });
    }
}
