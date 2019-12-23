export function interpolate(alpha: number, a: number, b: number) {
    return (a * (1 - alpha)) + (b * alpha);
}

export function convert_unit(x: number, range: number, a: number, b: number) {
    let grad = x / range;
    return interpolate(grad, a, b);
}