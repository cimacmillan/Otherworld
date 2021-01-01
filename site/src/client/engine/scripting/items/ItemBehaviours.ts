import { ServiceLocator } from "../../../services/ServiceLocator";
import { Entity } from "../../Entity";
import { HealthState } from "../../state/State";
import { HealsPlayerBehaviour } from "./behaviours/HealsPlayer";
import { MakesNoiseWhenConsumedComponent } from "./behaviours/MakesNoiseWhenConsumed";
import { join, joinOR } from "./helper";
import { Item, ItemComponent, ItemComponentType } from "./types";

interface ItemBehaviour {
    onConsume: (args: ConsumeArgs) => void;
    canConsume: (args: ConsumeArgs) => boolean;
}

export interface ConsumeArgs {
    serviceLocator: ServiceLocator;
    entity: Entity<HealthState & any>;
}

export type ItemBehaviourImplementation<T> = (
    component: T
) => Partial<ItemBehaviour>;

type ItemBehaviourMap = {
    [key in ItemComponentType]: (
        component: ItemComponent
    ) => Partial<ItemBehaviour>;
};

const itemBehaviours: ItemBehaviourMap = {
    [ItemComponentType.HEALS_PLAYER]: HealsPlayerBehaviour,
    [ItemComponentType.MAKES_NOISE_WHEN_CONSUMED]: MakesNoiseWhenConsumedComponent,
};

const defaultBehaviour: ItemBehaviour = {
    onConsume: () => undefined,
    canConsume: () => false,
};

function getItemBehaviours(item: Item) {
    const behaviours = item.behaviours.map((itemBehaviour) =>
        itemBehaviours[itemBehaviour.type](itemBehaviour)
    );

    return {
        ...defaultBehaviour,
        onConsume: join(behaviours.map((behaviour) => behaviour.onConsume)),
        canConsume: joinOR(behaviours.map((behaviour) => behaviour.canConsume)),
    };
}

export const ItemBehaviours = {
    getItemBehaviours,
};
