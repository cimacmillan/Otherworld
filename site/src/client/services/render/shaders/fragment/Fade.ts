const maxViewDistance = 12;
const minDistance = 8;

export const fadeFunction = `
    lowp float fade(lowp float distance) {

        lowp float minDistance = ${minDistance}.0;
        lowp float maxDistance = ${maxViewDistance}.0;

        lowp float grad = (distance - minDistance) / (maxDistance - minDistance);

        return 1.0 - max(min(grad, 1.0), 0.0);
    }
`;
