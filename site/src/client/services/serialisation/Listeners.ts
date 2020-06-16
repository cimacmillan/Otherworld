import { ServiceLocator } from "../ServiceLocator";
import { GameStorage } from "./Storage";

const attachWindowExitListener = (
    serviceLocator: ServiceLocator,
    gameStorage: GameStorage
) => {
    window.onbeforeunload = () => {
        const serialisation = serviceLocator
            .getSerialisationService()
            .serialise();
        console.log("Saving game", serialisation);
        gameStorage.setSaveGame(serialisation);
    };
};

export const SerialisationListeners = {
    attachWindowExitListener,
};
