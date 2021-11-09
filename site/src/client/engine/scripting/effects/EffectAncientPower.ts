import { AccuracyIncrease, AncientPower, EffectContext, ItemEffectActions } from "./Effects";

export const EffectAncientPower = (params: AncientPower): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {},
        onTriggerInverse: (context: EffectContext) => {},
    };
}
