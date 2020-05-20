import { Entity } from "../../../engine/Entity";
import { BaseState } from "../../../engine/state/State";
import {
    Item,
    ItemCanBeTraded,
    ItemComponent,
    ItemHealsPlayer,
    ItemType,
} from "../../../types/TypesItem";

interface ItemBehaviour {
    // anything with can should be an item property
    canConsume: (entity: Entity<BaseState>) => boolean;
    onConsume: (entity: Entity<BaseState>) => void;
    canTraded: (entity: Entity<BaseState>) => boolean;
    tradingPrice: () => number;
}

const defaultBehaviour: ItemBehaviour = {
    canConsume: () => false,
    onConsume: () => undefined,
    canTraded: () => false,
    tradingPrice: () => 0,
};

export function getItemBehaviours(item: Item) {
    const resultingBehaviours = item.behaviours.map((itemBehaviour) =>
        itemBehaviours[itemBehaviour.type](itemBehaviour)
    );

    // TODO this is long:
    return {
        canConsume: (entity: Entity<BaseState>) =>
            resultingBehaviours.reduce(
                (prev, curr) =>
                    prev && (curr.canConsume ? curr.canConsume(entity) : true),
                true
            ),
        canTraded: (entity: Entity<BaseState>) =>
            resultingBehaviours.reduce(
                (prev, curr) =>
                    prev && (curr.canTraded ? curr.canTraded(entity) : true),
                true
            ),
    };
}

const healsPlayerBehaviour = (item: ItemHealsPlayer) => ({
    canConsume: () => true,
    onConsume: (entity: Entity<BaseState>) => {
        // heal entity
    },
});

const canBeTradedBehaviour = (item: ItemCanBeTraded) => ({
    canBeTraded: () => true,
    tradingPrice: () => item.price,
});

type ItemBehaviourMap = {
    [key in ItemType]: (component: ItemComponent) => Partial<ItemBehaviour>;
};

const itemBehaviours: ItemBehaviourMap = {
    [ItemType.HEALS_PLAYER]: healsPlayerBehaviour,
    [ItemType.CAN_BE_TRADED]: canBeTradedBehaviour,
};
