import { FunctionEventSubscriber } from "@cimacmillan/refunc";
import { Entity } from "../../Entity";
import { Player } from "../../player/Player";
import { EffectDamagesTarget } from "./EffectDamagesTarget";
import { EffectHealsPlayer, EffectIncreaseHealthPlayer } from "./EffectHealsPlayer";

export enum EffectType {
    HEALS_SELF = "HEALS_SELF",
    DAMAGES_TARGET = "DAMAGES_TARGET",
    HEALTH_INCREASE = "HEALTH_INCREASE"
}

export interface HealsPlayer {
    type: EffectType.HEALS_SELF;
    points: number;
}

export interface HealthIncreasePlayer {
    type: EffectType.HEALTH_INCREASE;
    points: number;
}

export interface DamagesTarget {
    type: EffectType.DAMAGES_TARGET;
    points: number;
}

export type Effect = HealsPlayer | DamagesTarget | HealthIncreasePlayer;

export type EffectContext = {
    type: "PLAYER";
    player: Player;
} | {
    type: "ENTITY";
    entity: Entity<any>;
} 

export const emptyItemActions = {
    onTrigger: (context: EffectContext) => {}
}

export type ItemEffectActions = typeof emptyItemActions;

export const getEffect = (effects: Effect): ItemEffectActions => {
    switch (effects.type) {
        case EffectType.HEALS_SELF: return EffectHealsPlayer(effects);
        case EffectType.DAMAGES_TARGET: return EffectDamagesTarget(effects);
        case EffectType.HEALTH_INCREASE: return EffectIncreaseHealthPlayer(effects);
    }
}

