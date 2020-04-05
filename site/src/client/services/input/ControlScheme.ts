export interface ControlScheme {
    poll: (keysDown: { [key: string]: boolean }) => void;
    onKeyDown: (key: string, keysDown: { [key: string]: boolean }) => void;
    onKeyUp: (key: string, keysDown: { [key: string]: boolean }) => void;
}
