import { GameEvent } from "../../engine/events/Event";

export interface WeaponState {
    showing: boolean;
}

const initialWeaponState = {
    showing: true,
};

export function weaponReducer(
    state: WeaponState = initialWeaponState,
    action: GameEvent
) {
    return state;
}
