export interface StateEffectCallback {
    onEnter?: () => void;
    onLeave?: () => void;
    onUpdate?: () => void;
}

export interface StateEffectParameters {
    [key: string]: StateEffectCallback;
}

export class StateEffect {
    private newState: string;

    constructor(
        private effects: StateEffectParameters,
        private currentState: string
    ) {
        this.newState = currentState;
    }

    public setState(state: string) {
        this.newState = state;
    }

    public update() {
        if (this.newState !== this.currentState) {
            const currentStateCallback = this.effects[this.currentState];
            const newStateCallback = this.effects[this.newState];

            currentStateCallback.onLeave && currentStateCallback.onLeave();
            newStateCallback.onEnter && newStateCallback.onEnter();

            this.currentState = this.newState;
        }
        const currentStateCallback = this.effects[this.currentState];

        currentStateCallback.onUpdate && currentStateCallback.onUpdate();
    }

    public unload() {
        const currentState = this.effects[this.currentState];
        currentState.onLeave && currentState.onLeave();
    }

    public load() {
        const currentState = this.effects[this.currentState];
        currentState.onEnter && currentState.onEnter();
    }
}
