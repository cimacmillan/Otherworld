import 'jest-extended';
import { toGameAngle } from "../Basic";

const ANGLE_ERROR = 0.0001;

describe("toGameAngle", () => {
    test.each([
        [0, -1, 0],
        [0, 1, 180],
        [1, 0, 90],
        [-1, 0, 270],
    ])("when x is %s and y is %s game angle is %s", (x, y, deg) => {
        const targetRadians = (deg / 180) * Math.PI;
        const targetSin = Math.sin(targetRadians);
        const targetCos = Math.cos(targetRadians);

        const radians = toGameAngle(x, y);
        const actualSin = Math.sin(radians);
        const actualCos = Math.cos(radians);

        expect(actualSin).toBeWithin(
            targetSin - ANGLE_ERROR,
            targetSin + ANGLE_ERROR
        );
        expect(actualCos).toBeWithin(
            targetCos - ANGLE_ERROR,
            targetCos + ANGLE_ERROR
        );
    });
});
