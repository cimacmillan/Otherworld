import { Entity } from "../../../engine/Entity";
import { BaseState } from "../../../engine/state/State";
import { HealsPlayerBehaviour } from "./behaviours/HealsPlayer";
import { join } from "./helper";
import { Item, ItemComponent, ItemType } from "./types";

interface ItemBehaviour {
    onConsume: (entity: Entity<BaseState>) => void;
}

export type ItemBehaviourImplementation<T> = (
    component: T
) => Partial<ItemBehaviour>;

type ItemBehaviourMap = {
    [key in ItemType]: (component: ItemComponent) => Partial<ItemBehaviour>;
};

const itemBehaviours: ItemBehaviourMap = {
    [ItemType.HEALS_PLAYER]: HealsPlayerBehaviour,
};

const defaultBehaviour: ItemBehaviour = {
    onConsume: () => undefined,
};

function getItemBehaviours(item: Item) {
    const behaviours = item.behaviours.map((itemBehaviour) =>
        itemBehaviours[itemBehaviour.type](itemBehaviour)
    );

    return {
        ...defaultBehaviour,
        onConsume: join(behaviours.map((behaviour) => behaviour.onConsume)),
    };
}

export const ItemBehaviours = {
    getItemBehaviours,
};
