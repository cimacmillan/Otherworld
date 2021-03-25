import { DamagesTarget, EffectContext, ItemEffectActions } from "./Effects";

export const EffectDamagesTarget = (params: DamagesTarget): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {}
    };
}