import { EffectContext, HealsPlayer, HealthIncreasePlayer, ItemEffectActions } from "./Effects";

export const EffectHealsPlayer = (params: HealsPlayer): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                context.serviceLocator.getStore().getActions().onPlayerHealed(params.points);
                context.player.onHealed(params.points);
            }
        }
    };
}

export const EffectIncreaseHealthPlayer = (params: HealthIncreasePlayer): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {}
    };
}