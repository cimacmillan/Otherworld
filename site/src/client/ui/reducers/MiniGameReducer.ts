import { Actions } from "../../Actions";
import { GameReducer } from "../../util/engine/Store";
import { LockpickGameConfiguration } from "../containers/minigame/LockPickContainer";

export interface MiniGameUIState {
    visible: boolean;
    onComplete: (result: boolean) => void;
    configuration?: LockpickGameConfiguration;
}

const initialMiniGameState: MiniGameUIState = {
    visible: false,
    onComplete: () => undefined,
};

export const minigameReducer: GameReducer<MiniGameUIState, Actions> = {
    getState: () => initialMiniGameState,
    actions: {
        closeMiniGame: () => {
            initialMiniGameState.visible = false;
            initialMiniGameState.onComplete = () => undefined;
        },
        openLockpickEvent: (
            callback: (result: boolean) => void,
            configuration: LockpickGameConfiguration
        ) => {
            initialMiniGameState.visible = true;
            initialMiniGameState.onComplete = callback;
            initialMiniGameState.configuration = configuration;
        },
    },
};
