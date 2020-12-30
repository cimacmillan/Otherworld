import { Entity } from "../../engine/Entity";
import { Player } from "../../engine/player/Player";

export enum InteractionType {
    ATTACK = "ATTACK",
    BARTER = "BARTER",
    INTERACT = "INTERACT",
}

export enum InteractionSourceType {
    PLAYER = "PLAYER",
    ENTITY = "ENTITY",
}

export interface InteractionSourcePlayer {
    type: InteractionSourceType.PLAYER;
    player: Player;
}

export interface InteractionSourceEntity {
    type: InteractionSourceType.ENTITY;
    entity: Entity<any>;
}

export type InteractionSource =
    | InteractionSourcePlayer
    | InteractionSourceEntity;
