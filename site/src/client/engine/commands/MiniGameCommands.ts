import { GameEventSource } from "../../services/EventRouter";
import { InputState } from "../../services/input/InputService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { LockpickingResult, MiniGameEventType } from "../events/MiniGameEvents";
import { CommandCreator } from "./Command";

export const OpenLockpickingChallenge: CommandCreator = (
    serviceLocator: ServiceLocator
) => (callback: (result: LockpickingResult) => void) => {
    serviceLocator.getGame().setUpdateWorld(false);
    serviceLocator.getInputService().setInputState(InputState.INVENTORY);
    serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
        type: MiniGameEventType.LOCKPICK,
        callback: (result: LockpickingResult) => {
            serviceLocator.getGame().setUpdateWorld(true);
            serviceLocator.getInputService().setInputState(InputState.DEFAULT);
            callback(result);
        },
    });
};
