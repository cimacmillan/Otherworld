import { getHexFromRGB } from "../UI";

describe("getHexFromRGB", () => {
    it.each([
        [255, 0, 0, "ff0000"],
        [0, 255, 0, "00ff00"],
        [0, 0, 255, "0000ff"],
    ])(
        "maps r %s g %s b %s, to %s",
        (r: number, g: number, b: number, expected: string) => {
            expect(getHexFromRGB(r, g, b)).toEqual(expected);
        }
    );
});
