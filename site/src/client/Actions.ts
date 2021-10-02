import { ActionType } from "@cimacmillan/refunc";
import { Item } from "./engine/scripting/items/ItemTypes";
import {
    InteractionSource,
    InteractionType,
} from "./services/interaction/InteractionType";
import { Vector2D } from "./types";
import { LockpickGameConfiguration } from "./ui/containers/minigame/LockPickContainer";

export const emptyActions = {
    onGameInitialised: () => {},

    fadeBackground: () => {},
    fadeMenu: () => {},
    setGameFPS: (fps: number) => {},
    setGameLoadPercentage: (percentage: number) => {},
    startGame: () => {},
    stopGame: () => {},

    closeMiniGame: () => {},

    addKeyHint: (args: { id: string; keys: string[]; hint: string }) => {},
    removeKeyHint: (args: { id: string }) => {},

    onEntityCreated: () => {},
    onEntityDeleted: () => {},
    onStateTransition: (from: any, to: any) => {},

    onInteract: (type: InteractionType, source: InteractionSource) => {},

    openLockpickEvent: (
        callback: (result: boolean) => void,
        configuration: LockpickGameConfiguration
    ) => {},

    onPhysicsImpulse: (velocity: Vector2D) => {},

    onPlayerHealth: (health: { current: number, max: number}) => {},
    onPlayerAttack: () => {},
    onPlayerDamaged: () => {},
    onPlayerKilled: () => {},
    onPlayerInfoChanged: () => {},
    onPlayerItemDropCollected: (item: Item) => {},
    onPlayerItemUsed: (item: Item) => {},
    onPlayerHealed: (amount: number) => {},
    onPlayerInventoryOpened: () => {},
    onPlayerInventoryClosed: () => {},
    onPlayerItemEquipped: (item: Item) => {},

    onDamagedByPlayer: (damage: number) => {},
    

    // Game script events
    onChestOpened: () => {},
    onEnemyKilled: () => {},
    onStageReached: (stage: number) => {}
}

export type Actions = typeof emptyActions;
