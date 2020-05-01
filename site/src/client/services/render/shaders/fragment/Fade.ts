const maxViewDistance = 20;
const minDistance = 6;

export const fadeAccuracy = 8;
export const fadePixelAccuracy = 4;

export const fadeFunction = `
    lowp float fade(lowp float distance) {

        lowp float accuracy = ${fadeAccuracy}.0;
        lowp float minDistance = ${minDistance}.0;
        lowp float maxDistance = ${maxViewDistance}.0;

        lowp float grad = (distance - minDistance) / (maxDistance - minDistance);

        grad = floor(grad * accuracy) / accuracy;

        return 1.0 - max(min(grad, 1.0), 0.0);
    }
`;
