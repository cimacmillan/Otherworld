export function timeoutEffect(
    timeoutFunction: (callback: () => void, time: number) => number,
    clearTimeoutFunction: (id: number) => void,
    callback: () => void,
    time: number,
    onQuit?: () => void
) {
    let timeout: number;
    let done: boolean = false;
    return {
        onEnter: () => {
            timeout = timeoutFunction(() => {
                done = true;
                callback();
            }, time);
        },
        onLeave: () => {
            clearTimeoutFunction(timeout);
            if (done === false) {
                onQuit && onQuit();
            }
        },
    };
}
