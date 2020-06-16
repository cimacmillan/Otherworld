import { SerialisationObject } from "./SerialisationService";

const SAVE_KEY = "OTHERWORLD_SAVE";

export class GameStorage {
    public isSaveAvailable(): boolean {
        const save = localStorage.getItem(SAVE_KEY);
        return !!save;
    }

    public getSaveGame(): SerialisationObject {
        const save = localStorage.getItem(SAVE_KEY);
        return JSON.parse(save) as SerialisationObject;
    }

    public setSaveGame(save: SerialisationObject) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    }
}
