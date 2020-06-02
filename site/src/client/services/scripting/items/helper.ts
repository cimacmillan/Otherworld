export function joinAND<T>(
    funcs: Array<((arg: T) => boolean) | undefined>
): (arg: T) => boolean {
    return (arg) =>
        funcs.reduce((prev, curr) => prev && (curr ? curr(arg) : true), true);
}

export function joinOR<T>(
    funcs: Array<((arg: T) => boolean) | undefined>
): (arg: T) => boolean {
    return (arg) =>
        funcs.reduce((prev, curr) => prev || (curr ? curr(arg) : false), false);
}

export function joinADD<T>(
    funcs: Array<((arg: T) => number) | undefined>
): (arg: T) => number {
    return (arg) =>
        funcs.reduce((prev, curr) => prev + (curr ? curr(arg) : 0), 0);
}

export function join<T>(
    funcs: Array<((arg: T) => void) | undefined>
): (arg: T) => void {
    return (arg) => funcs.forEach((func) => func(arg));
}
