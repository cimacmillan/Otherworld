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
        getActions: () => ({
            onEntityCreated: () => {
                timeout = ProcedureService.setGameTimeout(() => {
                    done = true;
                    callback();
                }, time);
            },
            onEntityDeleted: () => {
                ProcedureService.clearTimeout(timeout);
                if (done === false) {
                    onPrematureQuit && onPrematureQuit();
                }
            },
        }),
    };
}
