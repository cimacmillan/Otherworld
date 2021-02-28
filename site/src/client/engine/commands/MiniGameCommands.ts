import { InputState } from "../../services/input/InputService";
import { ServiceLocator } from "../../services/ServiceLocator";
import { LockpickGameConfiguration } from "../../ui/containers/minigame/LockPickContainer";

export const OpenLockpickingChallenge = (serviceLocator: ServiceLocator) => (
    callback: (result: boolean) => void,
    configuration: LockpickGameConfiguration
) => {
    serviceLocator.getGame().setUpdateWorld(false);
    serviceLocator.getInputService().setInputState(InputState.INVENTORY);
    serviceLocator
        .getStore()
        .getActions()
        .openLockpickEvent((result: boolean) => {
            serviceLocator.getGame().setUpdateWorld(true);
            serviceLocator.getInputService().setInputState(InputState.DEFAULT);
            callback(result);
        }, configuration);
};
