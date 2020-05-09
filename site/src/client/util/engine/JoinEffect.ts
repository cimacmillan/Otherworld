import { StateEffectCallback } from "./StateEffect";

export function joinEffect(
    ...effects: StateEffectCallback[]
): StateEffectCallback {
    return {
        onEnter: () =>
            effects.forEach((effect) => effect.onEnter && effect.onEnter()),
        onLeave: () =>
            effects.forEach((effect) => effect.onLeave && effect.onLeave()),
        onUpdate: () =>
            effects.forEach((effect) => effect.onUpdate && effect.onUpdate()),
    };
}
