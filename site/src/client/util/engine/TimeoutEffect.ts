import { ProcedureService } from "../../services/scripting/ProcedureService";

export function timeoutEffect(
    callback: () => void,
    time: number,
    onQuit?: () => void
) {
    let timeout: number;
    let done: boolean = false;
    return {
        onEnter: () => {
            timeout = ProcedureService.setGameTimeout(() => {
                done = true;
                callback();
            }, time);
        },
        onLeave: () => {
            ProcedureService.clearTimeout(timeout);
            if (done === false) {
                onQuit && onQuit();
            }
        },
    };
}
