import { Entity } from "../../engine/Entity";
import { PlayerState } from "../../engine/scripting/factory/PlayerFactory";

export enum InteractionType {
    ATTACK = "ATTACK",
    BARTER = "BARTER",
    INTERACT = "INTERACT",
}

export enum InteractionSourceType {
    PLAYER = "PLAYER",
}

export interface InteractionSourcePlayer {
    type: InteractionSourceType.PLAYER;
    entity: Entity<PlayerState>;
}

export type InteractionSource = InteractionSourcePlayer;
