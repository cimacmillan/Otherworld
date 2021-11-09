import { AccuracyIncrease, AncientPower, EffectContext, ItemEffectActions } from "./Effects";

export const EffectAncientPower = (params: AncientPower): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.ancientPowerCount++;
                state.bonuses.ancientPower = state.bonuses.ancientPowerCount === 6;
            }
        },
        onTriggerInverse: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.ancientPowerCount--;
                state.bonuses.ancientPower = false;
            }
        },
    };
}
