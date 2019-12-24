
// This is needed as Screen data does not have functions like push or pop
interface ArrayLike<T> {
    length: number;
    [n: number]: T;
}

export function fillPattern<T>(array: ArrayLike<T>, value: ArrayLike<T>) {
    for (let x = 0; x < array.length; x++) {
        array[x] = value[x % value.length];
    }
}

export function fill<T>(array: ArrayLike<T>, value: T) {
    for (let x = 0; x < array.length; x++) {
        array[x] = value;
    }
}
