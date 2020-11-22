import { LockpickGameConfiguration } from "../../ui/containers/minigame/LockPickContainer";

export enum MiniGameEventType {
    LOCKPICK = "LOCKPICK",
}

export type LockpickingResult = boolean;

interface OpenLockpickEvent {
    type: MiniGameEventType.LOCKPICK;
    callback: (result: LockpickingResult) => void;
    configuration: LockpickGameConfiguration;
}

export type MiniGameEvents = OpenLockpickEvent;
