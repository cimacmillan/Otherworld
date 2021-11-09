import { AccuracyIncrease, AttackSpeedIncrease, EffectContext, ItemEffectActions } from "./Effects";

export const EffectAttackSpeedIncrease = (params: AttackSpeedIncrease): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.attackSpeed = true;
            }
        },
        onTriggerInverse: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const state = context.player.getMutableState();
                state.bonuses.attackSpeed = false;
            }
        },
    };
}
