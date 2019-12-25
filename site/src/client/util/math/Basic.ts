export function interpolate(alpha: number, a: number, b: number) {
    return (a * (1 - alpha)) + (b * alpha);
}

export function convert_unit(x: number, range: number, a: number, b: number) {
    let grad = x / range;
    return interpolate(grad, a, b);
}

export function clipToRange(a: number, lowerBound: number, upperBound: number): number {
    let result = a;
    result = result < lowerBound ? lowerBound : result;
    result = result > upperBound ? upperBound : result;
    return result;
}

export function toRadians(alpha: number): number {
    return (alpha / 180.0) * Math.PI;
}