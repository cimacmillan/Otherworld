import { ProcedureService } from "../../../services/jobs/ProcedureService";
import { EntityComponent } from "../../EntityComponent";
import { BaseState } from "../../state/State";

export function TimeoutComponent<T extends BaseState>(
    callback: () => void,
    time: number,
    onPrematureQuit?: () => void
): EntityComponent<T> {
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
