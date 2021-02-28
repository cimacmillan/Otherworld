import { FunctionEventSubscriber } from "./FunctionEventSubscriber";

type Callback = () => void;

export type GameReducer<State, Actions> = {
    getState: () => State;
    actions: Partial<Actions>;
};

export class Store<State, Actions> {
    private eventListeners: FunctionEventSubscriber<Actions>;
    private changeListeners: Callback[] = [];

    public constructor(
        private reducer: GameReducer<State, Actions>,
        emptyActions: Actions
    ) {
        this.eventListeners = new FunctionEventSubscriber<Actions>(
            emptyActions
        );
        this.eventListeners.subscribe(reducer.actions);
        this.eventListeners.subscribe(
            mapEmptyActionsToCallback(emptyActions, () => {
                this.changeListeners.forEach((listener) => listener());
            })
        );
    }

    public getState(): State {
        return this.reducer.getState();
    }

    public getActions(): Actions {
        return this.eventListeners.actions();
    }

    public subscribe(actions: Partial<Actions>) {
        this.eventListeners.subscribe(actions);
    }

    public unsubscribe(actions: Partial<Actions>) {
        this.eventListeners.unsubscribe(actions);
    }

    public addChangeListener(callback: Callback) {
        this.changeListeners.push(callback);
    }

    public removeChangeListener(callback: Callback) {
        const index = this.changeListeners.indexOf(callback);
        if (index < 0) {
            return;
        }
        this.changeListeners.splice(index, 1);
    }
}

// Can't work out these types
export function combineReducers<Actions>(
    reducers: Record<string, GameReducer<any, Actions>>,
    emptyActions: Actions
): GameReducer<any, Actions> {
    const eventListeners = new FunctionEventSubscriber<Actions>(emptyActions);

    Object.keys(reducers).forEach((key) => {
        const reducer = reducers[key];
        eventListeners.subscribe(reducer.actions);
    });

    const getState = () => {
        leconsttate = {};
        Object.keys(reducers).forEach((key) => {
            const reducer = reducers[key];
            Object.assign(state, {
                [key]: reducer.getState(),
            });
        });
        return state;
    };

    return {
        getState,
        actions: eventListeners.actions(),
    };
}

function mapEmptyActionsToCallback<T extends {}>(
    actions: T,
    callback: Callback
) {
    const newActions: Partial<T> = {};
    Object.keys(actions).forEach((key) => {
        newActions[key as keyof T] = callback as any;
    });
    return newActions;
}

// const combineReducers = <T, A>(reducers: {[key: string]: GameReducer<T>}, onAction: () => void): GameReducer<T> => {
//     let actions: any = {};
//     Object.values(reducers).forEach((reducer) => {
//         const actionEntries = Object.entries(reducer.actions);
//         for (let [key, value] of actionEntries) {
//             if (actions[key]) {
//                 actions[key] = (...args: any) => {
//                     actions[key](args);
//                     value(args);
//                     onAction();
//                 }
//             } else {
//                 actions[key] = (...args: any[]) => {
//                     value(args);
//                     onAction();
//                 };
//             }
//         }
//     });
//     return {
//         actions,
//         getState: () => {
//             let state: any = {};
//             Object.entries(reducers).forEach(([key, value]) => {
//                 state[key] = value.getState();
//             })
//             return state;
//         }
//     }
// }

// class StoreSubscribe {
//     private subscriptions: (() => void)[] = [];

//     public onAction() {
//         this.subscriptions.forEach(sub => sub());
//     }

//     public subscribe(callback: () => void) {
//         this.subscriptions.push(callback);
//     }

//     public unsubscribe(callback: () => void) {
//         const index = this.subscriptions.indexOf(callback);
//         if (index < 0) {
//             return;
//         }
//         this.subscriptions.splice(index, 1);
//     }
// }
// const storeSubscribe = new StoreSubscribe();

// const reducer = combineReducers(reducers, () => storeSubscribe.onAction());

// export const Store = {
//     getState: (): State => reducer.getState(),
//     actions: reducer.actions,
//     subscribe: (callback: () => void) => storeSubscribe.subscribe(callback),
//     unsubscribe: (callback: () => void) => storeSubscribe.unsubscribe(callback)
// }
