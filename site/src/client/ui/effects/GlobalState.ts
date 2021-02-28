import React = require("react");
import { Actions } from "../../Actions";
import { State, store } from "../State";

export const useGlobalState: () => [State, Actions] = () => {
    const [storeState, setStore] = React.useState(store.getState());
    React.useEffect(() => {
        const callback = () => setStore(store.getState());
        store.addChangeListener(callback);
        return () => store.removeChangeListener(callback);
    }, []);
    return [storeState, store.getActions()];
};
