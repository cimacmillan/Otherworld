import { AccuracyIncrease, EffectContext, ItemEffectActions, SpeedIncrease } from "./Effects";

export const EffectSpeedIncrease = (params: SpeedIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.moveSpeed = true;
            }
        },
        onTriggerInverse: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.moveSpeed = false;
            }
        },
    };
}
