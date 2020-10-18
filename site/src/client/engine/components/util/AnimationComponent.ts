import { CompositeAnimation } from "../../../util/animation/CompositeAnimation";
import { GameAnimation } from "../../../util/animation/GameAnimation";
import { EntityComponent } from "../../EntityComponent";
import { BaseState } from "../../state/State";

export function AnimationComponent(
    animation: GameAnimation | CompositeAnimation
): EntityComponent<BaseState> {
    return {
        onCreate: () => animation.start(),
        onDestroy: () => animation.stop(),
        update: () => animation.tick(),
    };
}
