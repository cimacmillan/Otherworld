import { AccuracyIncrease, EffectContext, ItemEffectActions } from "./Effects";

export const EffectAccuracyIncrease = (params: AccuracyIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.accuracy = true;
            }
        },
        onTriggerInverse: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.accuracy = false;
            }
        },
    };
}
