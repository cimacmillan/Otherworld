import { Subject } from "rxjs";
import { GameEvent } from "../../engine/events/Event";
import { PlayerEventType } from "../../engine/events/PlayerEvents";

export interface WeaponState {
    showing: boolean;
}

const initialWeaponState = {
    showing: true,
};

export const WeaponActionSubject = new Subject<GameEvent>();

export function weaponReducer(
    state: WeaponState = initialWeaponState,
    action: GameEvent
) {
    switch (action.type) {
        case PlayerEventType.PLAYER_ATTACK:
            WeaponActionSubject.next(action);
            break;
    }
    return state;
}
