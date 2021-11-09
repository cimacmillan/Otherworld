import { AccuracyIncrease, EffectContext, ItemEffectActions, SpeedIncrease } from "./Effects";

export const EffectSpeedIncrease = (params: SpeedIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {},
        onTriggerInverse: (context: EffectContext) => {},
    };
}
