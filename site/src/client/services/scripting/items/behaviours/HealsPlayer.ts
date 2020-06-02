import { PlayerEventType } from "../../../../engine/events/PlayerEvents";
import { ConsumeArgs, ItemBehaviourImplementation } from "../ItemBehaviours";
import { ItemHealsPlayer } from "../types";

export const HealsPlayerBehaviour: ItemBehaviourImplementation<ItemHealsPlayer> = (
    item: ItemHealsPlayer
) => ({
    onConsume: (args: ConsumeArgs) => {
        args.entity.onObservedEvent({
            type: PlayerEventType.PLAYER_HEALED,
            payload: {
                amount: item.amount,
            },
        });
    },
    canConsume: (args: ConsumeArgs) => {
        const healthLessThanOne = args.entity.getState().health < 1;
        return healthLessThanOne;
    },
});
