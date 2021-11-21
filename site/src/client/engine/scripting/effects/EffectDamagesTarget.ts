import { random } from "lodash";
import { InteractionSourceType, InteractionType } from "../../../services/interaction/InteractionType";
import { randomIntRange } from "../../../util/math";
import { DamagesTarget, DamagesTargetInRange, EffectContext, ItemEffectActions } from "./Effects";

function damageTargets(context: EffectContext, amount: number) {
    if (context.type === "PLAYER") {
        const { player, serviceLocator } = context;
        const position = player.getPositon();
        const interacts = serviceLocator
            .getInteractionService()
            .getInteractables(
                InteractionType.ATTACK,
                position,
                player.getAngle(),
                2
            );
        interacts.forEach(interact => {
            const source = interact.source;
            if (source.type === InteractionSourceType.ENTITY) {
                source.entity.getActions().onDamagedByPlayer(amount, player.getMutableState().bonuses.ancientPower);
            }
        });
    }
}

export const EffectDamagesTarget = (params: DamagesTarget): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            damageTargets(context, params.points);
        },
        onTriggerInverse: () => {}
    };
}

export const EffectDamagesTargetInRange = (params: DamagesTargetInRange): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            const rand = (context.type === "PLAYER" && context.player.getMutableState().bonuses.accuracy) ? params.b : randomIntRange(params.a, params.b + 1);
            damageTargets(context, rand);
        },
        onTriggerInverse: () => {}
    };
}