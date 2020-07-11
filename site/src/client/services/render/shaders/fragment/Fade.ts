import { UniformPositions } from "../types";

export const fadeFunction = `

    uniform lowp float fadeAccuracy;
    uniform lowp float fadePixelAccuracy;
    uniform lowp float minViewDistance;
    uniform lowp float maxViewDistance;

    lowp float fade(lowp float distance) {

        lowp float accuracy = fadeAccuracy;
        lowp float minDistance = minViewDistance;
        lowp float maxDistance = maxViewDistance;

        lowp float grad = (distance - minDistance) / (maxDistance - minDistance);

        grad = floor(grad * accuracy) / accuracy;

        return 1.0 - max(min(grad, 1.0), 0.0);
    }
`;

export enum Parameters {
    fadeAccuracy = `fadeAccuracy`,
    fadePixelAccuracy = `fadePixelAccuracy`,
    minViewDistance = `minViewDistance`,
    maxViewDistance = `maxViewDistance`,
}

export const fadeUniformPositions = (
    shaderId: WebGLProgram,
    gl: WebGLRenderingContext
) => {
    const uniform: UniformPositions = {};
    for (const param in Parameters) {
        uniform[param] = gl.getUniformLocation(shaderId, param);
    }
    return uniform;
};
