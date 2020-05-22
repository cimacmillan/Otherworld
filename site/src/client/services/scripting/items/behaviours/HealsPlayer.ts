import { Entity } from "../../../../engine/Entity";
import { BaseState } from "../../../../engine/state/State";
import { ItemBehaviourImplementation } from "../ItemBehaviours";
import { ItemHealsPlayer } from "../types";

export const HealsPlayerBehaviour: ItemBehaviourImplementation<ItemHealsPlayer> = (
    item: ItemHealsPlayer
) => ({
    onConsume: (entity: Entity<BaseState>) => {},
});
