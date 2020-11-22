import { ProcedureService } from "../../services/jobs/ProcedureService";

type Callback = (...args: any) => void;

export function throttle(callback: Callback, time: number): Callback {
    let canTrigger = true;
    return (args) => {
        if (canTrigger) {
            canTrigger = false;
            ProcedureService.setTimeout(() => (canTrigger = true), time);
            callback(args);
        }
    };
}
