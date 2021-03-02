import { ActionType } from "@cimacmillan/refunc";
import { Item } from "./engine/scripting/items/types";
import {
    InteractionSource,
    InteractionType,
} from "./services/interaction/InteractionType";
import { Vector2D } from "./types";
import { LockpickGameConfiguration } from "./ui/containers/minigame/LockPickContainer";

const undef: () => void = () => undefined;

export interface Actions extends ActionType {
    onGameInitialised: () => void;

    fadeBackground: () => void;
    fadeMenu: () => void;
    setGameFPS: (fps: number) => void;
    setGameLoadPercentage: (percentage: number) => void;
    startGame: () => void;

    closeMiniGame: () => void;

    addKeyHint: (args: { id: string; keys: string[]; hint: string }) => void;
    removeKeyHint: (args: { id: string }) => void;

    onEntityCreated: () => void;
    onEntityDeleted: () => void;
    onStateTransition: (from: any, to: any) => void;

    onInteract: (type: InteractionType, source: InteractionSource) => void;

    openLockpickEvent: (
        callback: (result: boolean) => void,
        configuration: LockpickGameConfiguration
    ) => void;

    onPhysicsImpulse: (velocity: Vector2D) => void;

    onPlayerAttack: () => void;
    onPlayerDamaged: () => void;
    onPlayerKilled: () => void;
    onPlayerInfoChanged: () => void;
    onPlayerItemDropCollected: (item: Item) => void;
    onPlayerItemUsed: (item: Item) => void;
    onPlayerHealed: (amount: number) => void;
    onPlayerInventoryOpened: () => void;
    onPlayerInventoryClosed: () => void;
}

export const emptyActions = {
    onGameInitialised: undef,

    fadeBackground: undef,
    fadeMenu: undef,
    setGameFPS: undef,
    setGameLoadPercentage: undef,
    startGame: undef,

    closeMiniGame: undef,

    addKeyHint: undef,
    removeKeyHint: undef,

    onEntityCreated: undef,
    onEntityDeleted: undef,
    onStateTransition: undef,

    onInteract: undef,

    openLockpickEvent: undef,

    onPhysicsImpulse: undef,

    onPlayerAttack: undef,
    onPlayerDamaged: undef,
    onPlayerKilled: undef,
    onPlayerInfoChanged: undef,
    onPlayerItemDropCollected: undef,
    onPlayerItemUsed: undef,
    onPlayerHealed: undef,
    onPlayerInventoryOpened: undef,
    onPlayerInventoryClosed: undef,
};
