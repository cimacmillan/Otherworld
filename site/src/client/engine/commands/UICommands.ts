import { ServiceLocator } from "../../services/ServiceLocator";

let HINT_ID = 1;

export const RegisterKeyHint = (serviceLocator: ServiceLocator) => (arg: {
    code: string[];
    hint: string;
}): number => {
    HINT_ID++;
    const { code, hint } = arg;
    serviceLocator
        .getEventRouter()
        .actions()
        .addKeyHint({
            id: `${HINT_ID}`,
            keys: code,
            hint,
        });
    return HINT_ID;
};

export const DeregisterKeyHint = (serviceLocator: ServiceLocator) => (
    hintId: number
) => {
    serviceLocator
        .getEventRouter()
        .actions()
        .removeKeyHint({
            id: `${hintId}`,
        });
};
