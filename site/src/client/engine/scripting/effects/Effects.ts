import { FunctionEventSubscriber } from "@cimacmillan/refunc";
import { ServiceLocator } from "../../../services/ServiceLocator";
import { Entity } from "../../Entity";
import { Player } from "../../player/Player";
import { EffectAccuracyIncrease } from "./EffectAccuracyIncrease";
import { EffectAncientPower } from "./EffectAncientPower";
import { EffectAttackSpeedIncrease } from "./EffectAttackSpeedIncrease";
import { EffectDamagesTarget, EffectDamagesTargetInRange } from "./EffectDamagesTarget";
import { EffectHealsPlayer, EffectIncreaseHealthPlayer } from "./EffectHealsPlayer";
import { EffectProtectionIncrease } from "./EffectProtectionIncrease";
import { EffectSpeedIncrease } from "./EffectSpeedIncrease";

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

type BaseEffect = {
    inverse?: boolean;
}

export type Effect = BaseEffect & (HealsPlayer | 
    DamagesTarget | 
    HealthIncreasePlayer | 
    DamagesTargetInRange | 
    AncientPower |
    AttackSpeedIncrease |
    AccuracyIncrease | 
    ProtectionIncrease |
    SpeedIncrease);

export type EffectContext = ({
    type: "PLAYER";
    player: Player;
} | {
    type: "ENTITY";
    entity: Entity<any>;
}) & {
    serviceLocator: ServiceLocator
}

export const inverse = (effect: Effect): Effect => {
    return {
        ...effect,
        inverse: true
    }
};

export const emptyItemActions = {
    onTrigger: (context: EffectContext) => {},
    onTriggerInverse: (content: EffectContext) => {},
}

export type ItemEffectActions = typeof emptyItemActions;

const effectTypeMap: Record<EffectType, (...params: any[]) => ItemEffectActions> = {
    HEALS_SELF: EffectHealsPlayer,
    DAMAGES_TARGET: EffectDamagesTarget,
    DAMAGES_TARGET_IN_RANGE: EffectDamagesTargetInRange,
    HEALTH_INCREASE: EffectIncreaseHealthPlayer,
    ANCIENT_POWER: EffectAncientPower,
    ATTACK_SPEED_INCREASE: EffectAttackSpeedIncrease,
    ACCURACY_INCREASE: EffectAccuracyIncrease,
    PROTECTION_INCREASE: EffectProtectionIncrease,
    SPEED_INCREASE: EffectSpeedIncrease
};

export const getEffect = (effects: Effect): ItemEffectActions => {
    const effect =  effectTypeMap[effects.type](effects);
    if (effects.inverse) {
        return {
            onTrigger: effect.onTriggerInverse,
            onTriggerInverse: effect.onTrigger
        }
    }
    return effect;
}

