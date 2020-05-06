import { CompositeAnimation } from "../animation/CompositeAnimation";
import { GameAnimation } from "../animation/GameAnimation";

export function effectFromAnimation(
    animation: GameAnimation | CompositeAnimation
) {
    return {
        onEnter: () => animation.start(),
        onLeave: () => animation.stop(),
        onUpdate: () => animation.tick(),
    };
}
