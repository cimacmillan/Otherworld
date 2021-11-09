import { AccuracyIncrease, EffectContext, ItemEffectActions, ProtectionIncrease } from "./Effects";

export const EffectProtectionIncrease = (params: ProtectionIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {},
        onTriggerInverse: (context: EffectContext) => {},
    };
}
