export function timeoutEffect(
    callback: () => void,
    time: number,
    onQuit?: () => void
) {
    let timeout: NodeJS.Timeout;
    let done: boolean = false;
    return {
        onEnter: () => {
            timeout = setTimeout(() => {
                done = true;
                callback();
            }, time);
        },
        onLeave: () => {
            clearTimeout(timeout);
            if (done === false) {
                onQuit && onQuit();
            }
        },
    };
}
