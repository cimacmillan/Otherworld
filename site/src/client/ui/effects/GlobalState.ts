import React = require("react");
import { skip } from "rxjs/operators";
import { Actions } from "../actions/Actions";
import { dispatch, State, store } from "../State";

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
