import { InteractionSourceType, InteractionType } from "../../../services/interaction/InteractionType";
import { DamagesTarget, EffectContext, ItemEffectActions } from "./Effects";

export const EffectDamagesTarget = (params: DamagesTarget): ItemEffectActions => {
    return {
        onTrigger: (context: EffectContext) => {
            if (context.type === "PLAYER") {
                const { player, serviceLocator } = context;
                const position = player.getPositon();
                const interacts = serviceLocator
                    .getInteractionService()
                    .getInteractables(
                        InteractionType.ATTACK,
                        position,
                        player.getAngle(),
                        1.5
                    );
                interacts.forEach(interact => {
                    const source = interact.source;
                    if (source.type === InteractionSourceType.ENTITY) {
                        source.entity.getActions().onDamagedByPlayer(params.points);
                    }
                });
            }
        }
    };
}