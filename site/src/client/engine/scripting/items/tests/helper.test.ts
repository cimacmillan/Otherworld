import { join, joinADD, joinAND } from "../helper";

describe("helper", () => {
    it("join", () => {
        const a = jest.fn();
        const b = jest.fn();
        const c = jest.fn();
        const arg = { test: "test" };

        join([a, b, c])(arg);

        expect(a).toHaveBeenCalledWith(arg);
        expect(b).toHaveBeenCalledWith(arg);
        expect(c).toHaveBeenCalledWith(arg);
    });

    it.each([
        [true, true, true, true],
        [false, false, false, false],
        [true, true, false, false],
        [true, false, true, false],
        [false, true, true, false],
    ])(
        "joinAND",
        (ares: boolean, bres: boolean, cres: boolean, result: boolean) => {
            const a = jest.fn(() => ares);
            const b = jest.fn(() => bres);
            const c = jest.fn(() => cres);
            const arg = { test: "test" };

            expect(joinAND([a, b, c])(arg)).toBe(result);
        }
    );

    it("joinADD", () => {
        const a = jest.fn(() => 10);
        const b = jest.fn(() => 20);
        const c = jest.fn(() => 30);
        const arg = { test: "test" };

        expect(joinADD([a, b, c])(arg)).toBe(60);
    });
});
