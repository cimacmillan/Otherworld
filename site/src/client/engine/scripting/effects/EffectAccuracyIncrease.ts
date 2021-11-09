import { AccuracyIncrease, EffectContext, ItemEffectActions } from "./Effects";

export const EffectAccuracyIncrease = (params: AccuracyIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {},
        onTriggerInverse: (context: EffectContext) => {},
    };
}
