import { GameEvent } from "../../engine/events/Event";
import { GameEventSource } from "../EventRouter";
import { ControlScheme } from "./ControlScheme";
import { DefaultControlScheme } from "./DefaultControlScheme";
import { ServiceLocator } from "../ServiceLocator";

export enum InputState {
    DEFAULT = "DEFAULT",
}

/**
 * Service for handling input and window events
 * Depending on what state we're in, changes what commands
 * are fired.
 */
export class InputService {
    private keydown: { [key: string]: boolean };
    private serviceLocator: ServiceLocator;
    private controlScheme: ControlScheme;
    private inputState: InputState;

    public constructor() {
        this.keydown = {};
    }

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
        this.serviceLocator
            .getEventRouter()
            .attachEventListener(GameEventSource.INPUT, this.onGameEvent);
        this.setInputState(InputState.DEFAULT);
        this.attachWindowHooks();
    }

    public update() {
        this.controlScheme.poll(this.keydown);
    }

    private attachWindowHooks() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private onKeyUp = (keyboardEvent: KeyboardEvent) => {
        this.keydown[keyboardEvent.code] = false;
        this.controlScheme.onKeyUp(keyboardEvent.code, this.keydown);
    };

    private onKeyDown = (keyboardEvent: KeyboardEvent) => {
        this.keydown[keyboardEvent.code] = true;
        this.controlScheme.onKeyDown(keyboardEvent.code, this.keydown);
    };

    private onGameEvent = (event: GameEvent, source: GameEventSource) => {};

    private setInputState = (inputState: InputState) => {
        this.inputState = inputState;
        switch (inputState) {
            case InputState.DEFAULT:
                this.controlScheme = new DefaultControlScheme(
                    this.serviceLocator
                );
        }
    };
}
