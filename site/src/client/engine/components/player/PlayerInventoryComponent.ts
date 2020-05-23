import { PlayerState } from "../../../services/scripting/factory/PlayerFactory";
import { Item } from "../../../services/scripting/items/types";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { GameEvent } from "../../events/Event";
import { PlayerEventType } from "../../events/PlayerEvents";

export class PlayerInventoryComponent<T extends PlayerState>
    implements EntityComponent<T> {
    public onObservedEvent(
        entity: Entity<PlayerState>,
        event: GameEvent
    ): void {
        switch (event.type) {
            case PlayerEventType.PLAYER_ITEM_DROP_COLLECTED:
                this.onPickedUp(entity, event.payload.item);
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
                itemMetadata.item.stackable &&
                item.behaviours
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
}
