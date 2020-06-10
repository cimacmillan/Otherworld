import "jest-extended";
import { StateEffect, StateEffectParameters } from "../StateEffect";

describe("StateEffect", () => {
    let stateEffect: StateEffect;
    let stateEffects: StateEffectParameters;

    beforeEach(() => {
        stateEffects = {
            test: {
                onEnter: jest.fn(),
                onLeave: jest.fn(),
                onUpdate: jest.fn(),
            },
            test2: {
                onEnter: jest.fn(),
                onLeave: jest.fn(),
                onUpdate: jest.fn(),
            },
            test3: {
                onEnter: jest.fn(),
                onLeave: jest.fn(),
                onUpdate: jest.fn(),
            },
        };
        stateEffect = new StateEffect(stateEffects, "test");
    });

    describe("setState", () => {
        it("behaves correctly", () => {
            stateEffect.setState("test2");
            stateEffect.update();

            expect(stateEffects.test.onLeave).toHaveBeenCalledTimes(1);
            expect(stateEffects.test2.onEnter).toHaveBeenCalledTimes(1);
            expect(stateEffects.test.onLeave).toHaveBeenCalledBefore(
                stateEffects.test2.onEnter as jest.Mock
            );

            stateEffect.setState("test3");
            stateEffect.update();

            expect(stateEffects.test2.onLeave).toHaveBeenCalledTimes(1);
            expect(stateEffects.test3.onEnter).toHaveBeenCalledTimes(1);
            expect(stateEffects.test2.onLeave).toHaveBeenCalledBefore(
                stateEffects.test3.onEnter as jest.Mock
            );
        });
    });

    describe("update", () => {
        it("behaves correctly", () => {
            stateEffect.setState("test2");
            stateEffect.update();

            expect(stateEffects.test2.onUpdate).toHaveBeenCalledTimes(1);

            stateEffect.update();

            expect(stateEffects.test2.onUpdate).toHaveBeenCalledTimes(2);
        });
    });

    describe("unload", () => {
        it("behaves correctly", () => {
            stateEffect.setState("test2");
            stateEffect.update();
            stateEffect.unload();

            expect(stateEffects.test2.onLeave).toHaveBeenCalledTimes(1);
        });
    });

    describe("load", () => {
        it("behaves correctly", () => {
            stateEffect.load();

            expect(stateEffects.test.onEnter).toHaveBeenCalledTimes(1);
        });
    });
});
