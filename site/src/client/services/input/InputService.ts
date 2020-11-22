import { GameEvent } from "../../engine/events/Event";
import { GameEventSource } from "../EventRouter";
import { ServiceLocator } from "../ServiceLocator";
import { ControlScheme } from "./ControlScheme";
import { DefaultControlScheme } from "./DefaultControlScheme";
import { InventoryControlScheme } from "./InventoryControlScheme";
import { MenuControlScheme } from "./MenuControlScheme";

export enum InputState {
    DEFAULT = "DEFAULT",
    INVENTORY = "INVENTORY",
    MENU = "MENU",
    MINIGAME = "MINIGAME",
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
        this.setInputState(InputState.MENU);
        this.attachWindowHooks();
    }

    public update() {
        this.controlScheme.poll(this.keydown);
    }

    public setInputState = (inputState: InputState) => {
        this.inputState = inputState;
        switch (inputState) {
            case InputState.DEFAULT:
                this.controlScheme = new DefaultControlScheme(
                    this.serviceLocator
                );
                break;
            case InputState.MENU:
                this.controlScheme = new MenuControlScheme(this.serviceLocator);
                break;
            case InputState.INVENTORY:
                this.controlScheme = new InventoryControlScheme(
                    this.serviceLocator
                );
                break;
        }
    };

    public getInputState = () => this.inputState;

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
}
