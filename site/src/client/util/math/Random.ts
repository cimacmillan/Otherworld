export function randomFloat(): number {
    return Math.random();
}

export function randomIntRange(lowerBound: number, upperBound: number): number {
    return Math.floor(randomFloat() * (upperBound - lowerBound)) + lowerBound;
}

export function randomFloatRange(
    lowerBound: number,
    upperBound: number
): number {
    const alpha = randomFloat();
    return alpha * upperBound + (1 - alpha) * lowerBound;
}

export function randomBool(): boolean {
    return randomFloat() > 0.5 ? true : false;
}