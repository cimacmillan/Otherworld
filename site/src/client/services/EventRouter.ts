import { GameEvent } from "../engine/events/Event";

export type GameEventListener = (
    event: GameEvent,
    source: GameEventSource
) => void;

export enum GameEventSource {
    ROOT = "ROOT",
    WORLD = "WORLD",
    UI = "UI",
    INPUT = "INPUT",
}

const noop: () => void = () => undefined;

export class EventRouter {
    private listeners: { [key in GameEventSource]: GameEventListener } = {
        [GameEventSource.ROOT]: noop,
        [GameEventSource.WORLD]: noop,
        [GameEventSource.UI]: noop,
        [GameEventSource.INPUT]: noop,
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
                this.listeners[key](event, source);
            }
        });
    }
}
