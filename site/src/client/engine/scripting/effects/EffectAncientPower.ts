import { AccuracyIncrease, AncientPower, EffectContext, ItemEffectActions } from "./Effects";

export const EffectAncientPower = (params: AncientPower): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.ancientPowerCount = Math.min(6, state.bonuses.ancientPowerCount + 1);
                state.bonuses.ancientPower = state.bonuses.ancientPowerCount === 6;            }
        },
        onTriggerInverse: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.ancientPowerCount = Math.max(0, state.bonuses.ancientPowerCount - 1);
                state.bonuses.ancientPower = false;
            }
        },
    };
}
