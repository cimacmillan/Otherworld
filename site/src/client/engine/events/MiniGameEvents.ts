export enum MiniGameEventType {
    LOCKPICK = "LOCKPICK",
}

export type LockpickingResult = boolean;

interface OpenLockpickEvent {
    type: MiniGameEventType.LOCKPICK;
    callback: (result: LockpickingResult) => void;
}

export type MiniGameEvents = OpenLockpickEvent;
