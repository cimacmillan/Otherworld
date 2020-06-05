import { ProcedureService } from "../../services/scripting/ProcedureService";
import { ANIMATION_RESOLUTION } from "./GameAnimation";

export class IntervalDriver {
    private intervalId?: number;
    public constructor(private gameTime: boolean) {}

    public drive(callback: () => void) {
        this.maybeStopTimer();
        this.intervalId = this.gameTime
            ? ProcedureService.setGameInterval(callback, ANIMATION_RESOLUTION)
            : ProcedureService.setInterval(callback, ANIMATION_RESOLUTION);
        return this;
    }

    public undrive() {
        this.maybeStopTimer();
    }

    private maybeStopTimer() {
        if (this.intervalId) {
            ProcedureService.clearInterval(this.intervalId);
        }
        this.intervalId = undefined;
    }
}
