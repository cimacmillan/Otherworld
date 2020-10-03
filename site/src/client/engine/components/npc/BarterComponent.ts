import { Entity } from "../../Entity";
import { EntityComponent, EntityComponentType } from "../../EntityComponent";
import { BaseState, InventoryState } from "../../state/State";

interface BarterInternalState {}

export type BarterState = BaseState & BarterInternalState & InventoryState;
type BarterEntity = Entity<BarterState>;

export const BarterComponent: EntityComponent<BarterState> = {
    componentType: EntityComponentType.BarterComponentState,

    // onCreate: (entity: BarterEntity) => {

    // },
    // onDestroy: (entity: BarterEntity) => {

    // },
    onEvent: (entity: BarterEntity) => {},
};
