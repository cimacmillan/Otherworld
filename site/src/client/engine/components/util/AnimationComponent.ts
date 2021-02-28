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
        getActions: (entity: Entity<T>) => ({
            onEntityCreated: () => {
                animation = createAnimation(entity);
                animation.start();
            },
            onEntityDeleted: () => animation.stop(),
        }),
        update: () => animation.tick(),
    };
}
