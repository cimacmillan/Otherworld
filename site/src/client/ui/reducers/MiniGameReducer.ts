import { Reducer } from "@cimacmillan/refunc";
import { Actions } from "../../Actions";
import { LockpickGameConfiguration } from "../containers/minigame/LockPickContainer";

export interface MiniGameUIState {
    visible: boolean;
    onComplete: (result: boolean) => void;
    configuration?: LockpickGameConfiguration;
}

export const minigameReducer: Reducer<MiniGameUIState, Actions> = {
    state: {
        visible: false,
        onComplete: () => {},
    },
    actions: {
        closeMiniGame: (state: MiniGameUIState) => ({
            ...state,
            visible: false,
            onComplete: () => undefined,
        }),
        openLockpickEvent: (
            state: MiniGameUIState,
            callback: (result: boolean) => void,
            configuration: LockpickGameConfiguration
        ) => ({
            ...state,
            visible: true,
            onComplete: callback,
            configuration: configuration,
        }),
    },
};
