import { Player } from "../../engine/player/Player";

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
    player: Player;
}

export type InteractionSource = InteractionSourcePlayer;
