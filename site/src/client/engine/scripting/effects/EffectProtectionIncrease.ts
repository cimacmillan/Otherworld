import { AccuracyIncrease, EffectContext, ItemEffectActions, ProtectionIncrease } from "./Effects";

export const EffectProtectionIncrease = (params: ProtectionIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.protection = true;
            }
        },
        onTriggerInverse: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.protection = false;
            }
        },
    };
}
