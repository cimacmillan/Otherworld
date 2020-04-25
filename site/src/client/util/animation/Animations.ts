import {
    CompositeAnimation,
    CompositeAnimationType,
} from "./CompositeAnimation";
import { AnimationDriverCallback, GameAnimation } from "./GameAnimation";

export const animation = (callback: AnimationDriverCallback) => {
    return new GameAnimation(callback);
};

export const parallel = (
    ...animations: Array<GameAnimation | CompositeAnimation>
) => {
    return new CompositeAnimation({
        type: CompositeAnimationType.PARALLEL,
        animations,
    });
};

export const sequence = (
    ...animations: Array<GameAnimation | CompositeAnimation>
) => {
    return new CompositeAnimation({
        type: CompositeAnimationType.SERIAL,
        animations,
    });
};

export type TweenFunction = (x: number) => number;

export const interpolate = (a: number, b: number) => (x: number) => {
    return (1 - x) * a + x * b;
};

export const identity: TweenFunction = (x: number) => x;

export const floorStepper: (steps: number) => TweenFunction = (
    steps: number
) => {
    return (x: number) => {
        if (x === 1.0) {
            return steps - 1;
        }
        return Math.floor(x * steps);
    };
};

export function sin(x: number): number {
    return Math.sin((x * Math.PI) / 2);
}

// https://easings.net/#easeInOutCirc
export function easeInOutCirc(x: number): number {
    return x < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}
