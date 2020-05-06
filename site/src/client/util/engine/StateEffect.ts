export interface StateEffectCallback {
    onEnter?: () => void;
    onLeave?: () => void;
    onUpdate?: () => void;
}

interface StateEffectParameters { [key: string]: StateEffectCallback }

export class StateEffect {
    constructor(
        private effects: StateEffectParameters,
        private state: string
    ) {}

    public setState(state: string) {
        const currentState = this.effects[this.state];
        const newState = this.effects[state];

        currentState && currentState.onLeave();
        newState && newState.onEnter();

        this.state = state;
    }

    public update() {
        const currentState = this.effects[this.state];
        currentState.onUpdate();
    }

    public unload() {
        const currentState = this.effects[this.state];
        currentState.onLeave();
    }

    public load() {
        const currentState = this.effects[this.state];
        currentState.onEnter();
    }
}
