import { GameEvent } from "../../engine/events/Event";
import {
    GameStartActions,
    GameStartActionType,
} from "../actions/GameStartActions";

export interface WeaponState {
    showing: boolean;
}

const initialWeaponState = {
    showing: false,
};

type WeaponEvents = GameEvent | GameStartActions;

export function weaponReducer(
    state: WeaponState = initialWeaponState,
    action: WeaponEvents
) {
    switch (action.type) {
        case GameStartActionType.START_GAME:
            return {
                ...state,
                showing: true,
            };
        case GameStartActionType.END_GAME:
            return {
                ...state,
                showing: false,
            };
    }
    return state;
}
