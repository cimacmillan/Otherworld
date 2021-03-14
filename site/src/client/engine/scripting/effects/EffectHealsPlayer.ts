import { EffectContext, HealsPlayer, ItemEffectActions } from "./Effects";

export const EffectHealsPlayer = (params: HealsPlayer): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {}
    };
}