import { FunctionEventSubscriber } from "@cimacmillan/refunc";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Entity } from "../../Entity";
import { Player } from "../../player/Player";
import { EffectDamagesTarget, EffectDamagesTargetInRange } from "./EffectDamagesTarget";
import { EffectHealsPlayer, EffectIncreaseHealthPlayer } from "./EffectHealsPlayer";

export enum EffectType {
    HEALS_SELF = "HEALS_SELF",
    DAMAGES_TARGET = "DAMAGES_TARGET",
    DAMAGES_TARGET_IN_RANGE = "DAMAGES_TARGET_IN_RANGE",
    HEALTH_INCREASE = "HEALTH_INCREASE",
    ANCIENT_POWER = "ANCIENT_POWER",
    ATTACK_SPEED_INCREASE = "ATTACK_SPEED_INCREASE",
    ACCURACY_INCREASE = "ACCURACY_INCREASE",
    PROTECTION_INCREASE = "PROTECTION_INCREASE",
    SPEED_INCREASE = "SPEED_INCREASE"
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

export interface DamagesTargetInRange {
    type: EffectType.DAMAGES_TARGET_IN_RANGE;
    a: number;
    b: number
}

export interface AncientPower {
    type: EffectType.ANCIENT_POWER;
}

export interface AttackSpeedIncrease {
    type: EffectType.ATTACK_SPEED_INCREASE;
}

export interface AccuracyIncrease {
    type: EffectType.ACCURACY_INCREASE;
}

export interface ProtectionIncrease {
    type: EffectType.PROTECTION_INCREASE;
}

export interface SpeedIncrease {
    type: EffectType.SPEED_INCREASE;
}

export type Effect = HealsPlayer | 
    DamagesTarget | 
    HealthIncreasePlayer | 
    DamagesTargetInRange | 
    AncientPower |
    AttackSpeedIncrease |
    AccuracyIncrease | 
    ProtectionIncrease |
    SpeedIncrease;

export type EffectContext = ({
    type: "PLAYER";
    player: Player;
} | {
    type: "ENTITY";
    entity: Entity<any>;
}) & {
    serviceLocator: ServiceLocator
}

export const emptyItemActions = {
    onTrigger: (context: EffectContext) => {}
}

export type ItemEffectActions = typeof emptyItemActions;

export const getEffect = (effects: Effect): ItemEffectActions => {
    switch (effects.type) {
        case EffectType.HEALS_SELF: return EffectHealsPlayer(effects);
        case EffectType.DAMAGES_TARGET: return EffectDamagesTarget(effects);
        case EffectType.DAMAGES_TARGET_IN_RANGE: return EffectDamagesTargetInRange(effects);
        case EffectType.HEALTH_INCREASE: return EffectIncreaseHealthPlayer(effects);
    }
    return emptyItemActions;
}

