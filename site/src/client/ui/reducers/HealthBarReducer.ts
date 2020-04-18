import { GameEvent } from "../../engine/events/Event";

export interface HealthBarState {
    showing: boolean;
}

const initialHealthState = {
    showing: true,
};

export function healthBarReducer(
    state: HealthBarState = initialHealthState,
    action: GameEvent
) {
    return state;
}
