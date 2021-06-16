import { Vector2D } from "../../types";

export function interpolate(alpha: number, a: number, b: number) {
    return (b - a) * alpha + a;
}

export function convert_unit(x: number, range: number, a: number, b: number) {
    const grad = x / range;
    return interpolate(grad, a, b);
}

export function clipToRange(
    a: number,
    lowerBound: number,
    upperBound: number
): number {
    let result = a;
    result = result < lowerBound ? lowerBound : result;
    result = result > upperBound ? upperBound : result;
    return result;
}

export function toRadians(alpha: number): number {
    return (alpha / 180.0) * Math.PI;
}

export function getGradientIncrementor(
    resultStart: number,
    resultEnd: number,
    distance: number
) {
    return (resultEnd - resultStart) / distance;
}

export function getGradientOffset(
    resultStart: number,
    actualResultStart: number,
    gradientIncrementor: number
) {
    return (actualResultStart - resultStart) * gradientIncrementor;
}

export function getTextureCoordinate(
    spriteSheetWidth: number,
    spriteSheetHeight: number,
    width: number,
    height: number,
    xPixel: number,
    yPixel: number
): {
    textureX: number;
    textureY: number;
    textureWidth: number;
    textureHeight: number;
} {
    return {
        textureX: xPixel / spriteSheetWidth,
        textureY: yPixel / spriteSheetHeight,
        textureWidth: width / spriteSheetWidth,
        textureHeight: height / spriteSheetHeight,
    };
}

export function toGameAngle(x: number, y: number) {
    return Math.atan2(x, -y);
}

export function toGameVector(angle: number): Vector2D {
    return {
        x: Math.sin(angle),
        y: -Math.cos(angle),
    };
}

export function map3D<A, B>(array: A[][][], f: (val: A, x: number, y: number, z: number) => B): B[][][] {
    return array.map(
        (ys, x) => ys.map(
            (zs, y) => zs.map(
                (a, z) => {
                    return f(a, x, y, z);
                }
            )
        )
    )
}

export function forEach3D<A>(array: A[][][], f: (val: A, x: number, y: number, z: number) => void) {
    array.forEach(
        (ys, x) => ys.forEach(
            (zs, y) => zs.forEach(
                (a, z) => {
                    return f(a, x, y, z);
                }
            )
        )
    )
}

export function create3DArray<T>(xCount: number, yCount: number, zCount: number, fill: T): T[][][] {
    const createArray = (length: number) => new Array(length).fill(fill);
    const xArrays: T[][][]  = [];
    for (let x = 0; x < xCount; x++) {
        const yArrays: T[][] = [];
        for (let y = 0; y < yCount; y++) {
            yArrays.push(createArray(zCount));
        }
        xArrays.push(yArrays);
    }
    return xArrays;
}
