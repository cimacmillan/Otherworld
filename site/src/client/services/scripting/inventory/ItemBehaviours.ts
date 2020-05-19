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
    canConsume: (entity: Entity<BaseState>) => boolean;
    onConsume: (entity: Entity<BaseState>) => void;

    canTraded: () => void;
    tradingPrice: () => number;
}

type ItemBehaviourMap = {
    [key in ItemType]: (component: ItemComponent) => Partial<ItemBehaviour>;
};

export function getItemBehaviours(item: Item) {
    const resultingBehaviours = item.behaviours.map((itemBehaviour) =>
        itemBehaviours[itemBehaviour.type](itemBehaviour)
    );
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

const itemBehaviours: ItemBehaviourMap = {
    [ItemType.HEALS_PLAYER]: healsPlayerBehaviour,
    [ItemType.CAN_BE_TRADED]: canBeTradedBehaviour,
};
