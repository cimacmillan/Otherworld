import { GameEventSource } from "../../services/EventRouter";
import { ServiceLocator } from "../../services/ServiceLocator";
import { KeyHintContainerActionType } from "../../ui/actions/KeyHintActions";

let HINT_ID = 0;

export const RegisterUIHint = (serviceLocator: ServiceLocator) => (
    code: string,
    hint: string
): number => {
    HINT_ID++;
    serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
        type: KeyHintContainerActionType.ADD_KEY_HINT,
        id: `${HINT_ID}`,
        key: code,
        hint,
    });
    return HINT_ID;
};

export const DeregisterUIHint = (serviceLocator: ServiceLocator) => (
    hintId: number
) => {
    serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
        type: KeyHintContainerActionType.REMOVE_KEY_HINT,
        id: `${hintId}`,
    });
};
