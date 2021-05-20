import { ProcedureService } from "../../../services/jobs/ProcedureService";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

export function TimeoutComponent<T>(
    callback: (entity: Entity<T>) => void,
    time: number,
    onPrematureQuit?: () => void
): EntityComponent<T> {
    let timeout: number;
    let done: boolean = false;
    return {
        getActions: (entity: Entity<T>) => ({
            onEntityCreated: () => {
                timeout = ProcedureService.setGameTimeout(() => {
                    done = true;
                    callback(entity);
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
