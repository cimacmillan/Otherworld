Input is handled in the game using an `InputService`. The purpose of this service is to handle all the keyboard input of the game and to perform actions based on what's been pressed. For instance, pressing `W` causes the player to walk forward. It also handles how to change the input handling depending on context. When the inventory is closed, pressing `I` causes it to open. When it's open, pressing `I` causes it to close.

The input service is very simple. It attaches key up and key down listeners to the window. It contains a map of key code to boolean, which indicates whether the key is down. 

```ts
export class InputService {
    ...
    private keydown: { [key: string]: boolean };

    private attachWindowHooks() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private onKeyUp = (keyboardEvent: KeyboardEvent) => {
        this.keydown[keyboardEvent.code] = false;
    };

    private onKeyDown = (keyboardEvent: KeyboardEvent) => {
        this.keydown[keyboardEvent.code] = true;
    };
}
```

Why is the map of whether a key is down needed? The player walks forwards when `W` is pressed, but needs to continue walking forward until `W` is released. This means on every frame, we need to check whether it's pressed and move the player a small amount. To handle different types of input strategies, the input service takes a `ControlScheme` which can replace the existing behavior depending on the context.

```ts
export interface ControlScheme {
    poll: (keysDown: { [key: string]: boolean }) => void;
    onKeyDown: (key: string, keysDown: { [key: string]: boolean }) => void;
    onKeyUp: (key: string, keysDown: { [key: string]: boolean }) => void;
}

export class InputService {
    ...
    public update() {
        this.controlScheme.poll(this.keydown);
    }

    private onKeyUp = (keyboardEvent: KeyboardEvent) => {
        ...
        this.controlScheme.onKeyUp(keyboardEvent.code, this.keydown);
    };

    private onKeyDown = (keyboardEvent: KeyboardEvent) => {
        ...
        this.controlScheme.onKeyDown(keyboardEvent.code, this.keydown);
    };
}
```

There are 3 control schemes in the game. `DEFAULT`, which is for player interaction; `MENU`, for when the main menu is showing; and `INVENTORY`, for when the inventory is showing. The `DEFAULT` control scheme shows how a player interacts with the game using game command functions:

```ts
public poll(keysDown: { [key: string]: boolean }) {
    if (keysDown.KeyW) {
        Walk(this.serviceLocator)(WalkDirection.FORWARD);
    }
    if (keysDown.KeyS) {
        Walk(this.serviceLocator)(WalkDirection.BACK);
    }
    if (keysDown.KeyA) {
        Walk(this.serviceLocator)(WalkDirection.LEFT);
    }
    if (keysDown.KeyD) {
        Walk(this.serviceLocator)(WalkDirection.RIGHT);
    }

    if (keysDown.ArrowLeft) {
        Turn(this.serviceLocator)(TurnDirection.ANTICLOCKWISE);
    }
    if (keysDown.ArrowRight) {
        Turn(this.serviceLocator)(TurnDirection.CLOCKWISE);
    }

    if (keysDown.KeyE) {
        Interact(this.serviceLocator)();
    }

    if (keysDown.Space) {
        Attack(this.serviceLocator);
    }
}
```

Game command functions are a more abstract way to interact with the game systems. It allows some duplicate logic to be hidden in each function and provides a pleasant way to control the game. It should be seen as a game-specific interface rather than a generic engine interface (the commands are specific to this game). Here's an example for opening the inventory:

```
export const OpenInventory: CommandCreator = (
    serviceLocator: ServiceLocator
) => () => {
    serviceLocator
        .getTutorialService()
        .onEvent(TutorialServiceEvent.OPEN_INVENTORY);
    serviceLocator.getGame().setUpdateWorld(false);
    serviceLocator.getInputService().setInputState(InputState.INVENTORY);
    serviceLocator.getStore().getActions().onPlayerInventoryOpened();
    serviceLocator.getAudioService().play(serviceLocator.getResourceManager().manifest.audio[randomSelection([Audios.MENU_0])]);
};
```

This function notifies the tutorial service that the inventory has been opened. Stops the world from updating (freeze it). Sets the input state to the inventory state. Notify the store (UI) that the inventory is opened. Plays the audio opening sound.


