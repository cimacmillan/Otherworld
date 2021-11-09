import { AccuracyIncrease, AttackSpeedIncrease, EffectContext, ItemEffectActions } from "./Effects";

export const EffectAttackSpeedIncrease = (params: AttackSpeedIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {},
        onTriggerInverse: (context: EffectContext) => {},
    };
}
