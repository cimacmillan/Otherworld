import { joinEffect } from "../JoinEffect";
import { StateEffectCallback } from "../StateEffect";

describe("JoinEffect", () => {
    it("joins effects", () => {
        const effect1: StateEffectCallback = {
            onEnter: jest.fn(),
            onUpdate: jest.fn(),
            onLeave: jest.fn(),
        };
        const effect2: StateEffectCallback = {
            onEnter: jest.fn(),
            onUpdate: jest.fn(),
            onLeave: jest.fn(),
        };
        const joinedEffects = joinEffect(effect1, effect2);

        joinedEffects.onEnter();
        joinedEffects.onUpdate();
        joinedEffects.onLeave();

        expect(effect1.onEnter).toHaveBeenCalledTimes(1);
        expect(effect1.onUpdate).toHaveBeenCalledTimes(1);
        expect(effect1.onLeave).toHaveBeenCalledTimes(1);
        expect(effect2.onEnter).toHaveBeenCalledTimes(1);
        expect(effect2.onUpdate).toHaveBeenCalledTimes(1);
        expect(effect2.onLeave).toHaveBeenCalledTimes(1);
    });
});
