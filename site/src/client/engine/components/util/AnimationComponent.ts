import { CompositeAnimation } from "../../../util/animation/CompositeAnimation";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { Entity } from "../../Entity";
import { EntityComponent } from "../../EntityComponent";

type AnimationCreationFunction<T> = (
    entity: Entity<T>
) => GameAnimation | CompositeAnimation;

export function AnimationComponent<T>(
    createAnimation: AnimationCreationFunction<T>
): EntityComponent<T> {
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
