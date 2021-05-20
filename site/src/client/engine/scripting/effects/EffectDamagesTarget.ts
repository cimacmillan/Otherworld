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
                source.entity.getActions().onDamagedByPlayer(amount);
            }
        });
    }
}

export const EffectDamagesTarget = (params: DamagesTarget): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            damageTargets(context, params.points);
        }
    };
}

export const EffectDamagesTargetInRange = (params: DamagesTargetInRange): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            const rand = randomIntRange(params.a, params.b + 1);
            damageTargets(context, rand);
        }
    };
}