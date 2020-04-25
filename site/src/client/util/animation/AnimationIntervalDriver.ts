import { ANIMATION_RESOLUTION } from "./GameAnimation";

export class IntervalDriver {
    private intervalId?: NodeJS.Timeout;

    public drive(callback: () => void) {
        this.maybeStopTimer();
        this.intervalId = setInterval(callback, ANIMATION_RESOLUTION);
        return this;
    }

    public undrive() {
        this.maybeStopTimer();
    }

    private maybeStopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = undefined;
    }
}
