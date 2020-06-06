export interface Serialisable<T> {
    serialise: () => T;
    deserialise: (data: T) => void;
}
