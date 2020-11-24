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

export function throttleCount(callback: Callback, count: number): Callback {
    let i = 0;
    return (args) => {
        if (i >= count) {
            i = 0;
            callback(args);
        } else {
            i++;
        }
    };
}
