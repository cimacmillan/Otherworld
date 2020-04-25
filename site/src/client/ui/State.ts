import { BehaviorSubject, Subject } from "rxjs";
import { Actions } from "./actions/Actions";
import { gameStartReducer, GameStartState } from "./reducers/GameStartReducer";
import { healthBarReducer, HealthBarState } from "./reducers/HealthBarReducer";
import { uiReducer, UIState } from "./reducers/UIReducer";
import { weaponReducer, WeaponState } from "./reducers/WeaponReducer";
import { Sagas } from "./saga/Saga";

export interface State {
    uiState: UIState;
    weaponState: WeaponState;
    healthState: HealthBarState;
    gameStart: GameStartState;
}

export const reducers: { [key: string]: (...args: any[]) => any } = {
    uiState: uiReducer,
    weaponState: weaponReducer,
    healthState: healthBarReducer,
    gameStart: gameStartReducer,
};

export const farmState = (currentState: State | undefined, action: Actions) => {
    return Object.keys(reducers).reduce((accumState, reducerKey) => {
        const existingState = currentState && (currentState as any)[reducerKey];
        return {
            ...accumState,
            [reducerKey]: reducers[reducerKey](existingState, action),
        };
    }, {} as State);
};

const initialState = farmState(undefined, { type: -1 } as any);

export const dispatch = new Subject<Actions>();
export const store = new BehaviorSubject<State>(initialState);

dispatch.subscribe((gameEvent: Actions) => {
    const currentState = store.getValue();
    const newState = farmState(currentState, gameEvent);
    store.next(newState);
});

for (const listener of Sagas) {
    dispatch.subscribe((event: Actions) => listener.next(event));
}
