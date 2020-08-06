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

export function randomSelection<T>(toSelect: T[]): T {
    const randomIndex = Math.floor(Math.random() * toSelect.length);
    return toSelect[randomIndex];
}
