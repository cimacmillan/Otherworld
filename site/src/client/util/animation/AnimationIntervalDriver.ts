import { ANIMATION_RESOLUTION } from "./GameAnimation";
import { ProcedureService } from "../../services/scripting/ProcedureService";

export class IntervalDriver {
    private intervalId?: number;
    public drive(callback: () => void) {
        this.maybeStopTimer();
        this.intervalId = ProcedureService.setInterval(callback, ANIMATION_RESOLUTION);
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
