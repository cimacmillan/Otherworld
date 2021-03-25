import { EffectContext, HealsPlayer, HealthIncreasePlayer, ItemEffectActions } from "./Effects";

export const EffectHealsPlayer = (params: HealsPlayer): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {}
    };
}

export const EffectIncreaseHealthPlayer = (params: HealthIncreasePlayer): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {}
    };
}