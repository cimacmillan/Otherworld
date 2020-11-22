import { CompositeAnimation } from "../../../util/animation/CompositeAnimation";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";
import { BaseState } from "../../state/State";

type AnimationCreationFunction<T extends BaseState> = (
    entity: Entity<T>
) => GameAnimation | CompositeAnimation;

export function AnimationComponent<T extends BaseState>(
    createAnimation: AnimationCreationFunction<T>
): EntityComponent<BaseState> {
    let animation: GameAnimation | CompositeAnimation;
    return {
        onCreate: (entity: Entity<T>) => {
            animation = createAnimation(entity);
            animation.start();
        },
        onDestroy: () => animation.stop(),
        update: () => animation.tick(),
    };
}
