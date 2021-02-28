import { ConsumeArgs, ItemBehaviourImplementation } from "../ItemBehaviours";
import { ItemHealsPlayer } from "../types";

export const HealsPlayerBehaviour: ItemBehaviourImplementation<ItemHealsPlayer> = (
    item: ItemHealsPlayer
) => ({
    onConsume: (args: ConsumeArgs) => {},
    canConsume: (args: ConsumeArgs) => {
        const healthLessThanOne = args.entity.getState().health < 1;
        return healthLessThanOne;
    },
});
