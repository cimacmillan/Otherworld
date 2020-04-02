import { GameEvent } from "./events/Event";

export type GameEventListener = (event: GameEvent) => void;

export enum GameEventSource {
    WORLD = "WORLD",
    UI = "UI",
}

export class EventRouter {
    private listeners: { [key in GameEventSource]: GameEventListener } = {
        [GameEventSource.WORLD]: () => {},
        [GameEventSource.UI]: () => {},
    };

    public attachEventListener(
        source: GameEventSource,
        listener: GameEventListener
    ) {
        this.listeners[source] = listener;
    }

    public routeEvent(source: GameEventSource, event: GameEvent) {
        Object.keys(this.listeners).forEach((key: GameEventSource) => {
            if (key !== source) {
                this.listeners[key](event);
            }
        });
    }
}
