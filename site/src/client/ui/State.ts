import React = require("react");
import { BehaviorSubject, Subject } from "rxjs";
import { skip } from "rxjs/operators";
import { Actions } from "./actions/Actions";
import { gameStartReducer, GameStartState } from "./reducers/GameStartReducer";
import { healthBarReducer, HealthBarState } from "./reducers/HealthBarReducer";
import { uiReducer, UIState } from "./reducers/UIReducer";
import { weaponReducer, WeaponState } from "./reducers/WeaponReducer";

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

export const useGlobalState: () => [State, (action: Actions) => void] = () => {
    const [state, setState] = React.useState(store.getValue());
    React.useEffect(() => {
        const sub = store.pipe(skip(1)).subscribe(setState);
        return () => sub.unsubscribe();
    }, []);
    return [state, (action: Actions) => dispatch.next(action)];
};

export const useDispatchListener = (callback: (action: Actions) => void) => {
    React.useEffect(() => {
        const sub = dispatch.subscribe(callback);
        return () => sub.unsubscribe();
    }, []);
};
