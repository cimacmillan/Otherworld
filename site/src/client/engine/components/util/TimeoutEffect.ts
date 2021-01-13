import { ProcedureService } from "../../../services/jobs/ProcedureService";
import { EntityComponent } from "../../EntityComponent";

export function TimeoutComponent<T>(
    callback: () => void,
    time: number,
    onPrematureQuit?: () => void
): EntityComponent<void> {
    let timeout: number;
    let done: boolean = false;
    return {
        onCreate: () => {
            timeout = ProcedureService.setGameTimeout(() => {
                done = true;
                callback();
            }, time);
        },
        onDestroy: () => {
            ProcedureService.clearTimeout(timeout);
            if (done === false) {
                onPrematureQuit && onPrematureQuit();
            }
        },
    };
}
