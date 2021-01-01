import { GameEventSource } from "../../services/EventRouter";
import { ServiceLocator } from "../../services/ServiceLocator";
import { KeyHintContainerActionType } from "../../ui/actions/KeyHintActions";

let HINT_ID = 1;

export const RegisterKeyHint = (serviceLocator: ServiceLocator) => (arg: {
    code: string[];
    hint: string;
}): number => {
    HINT_ID++;
    const { code, hint } = arg;
    serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
        type: KeyHintContainerActionType.ADD_KEY_HINT,
        id: `${HINT_ID}`,
        keys: code,
        hint,
    });
    return HINT_ID;
};

export const DeregisterKeyHint = (serviceLocator: ServiceLocator) => (
    hintId: number
) => {
    serviceLocator.getEventRouter().routeEvent(GameEventSource.WORLD, {
        type: KeyHintContainerActionType.REMOVE_KEY_HINT,
        id: `${hintId}`,
    });
};
