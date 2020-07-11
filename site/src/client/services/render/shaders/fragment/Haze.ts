import { UniformPositions } from "../types";

export const hazeFunction = `
    uniform lowp float hazeAmount;
    uniform lowp float hazeR;
    uniform lowp float hazeG;
    uniform lowp float hazeB;

    lowp vec3 haze(lowp vec3 colour, lowp float distance) {

        lowp vec3 hazeColour = vec3(
            hazeR, hazeG, hazeB
        );

        lowp float grad = 1.0 - distance;

        return (grad * hazeColour) + ((1.0 - grad) * colour);
    }
`;

export enum Parameters {
    hazeAmount = `hazeAmount`,
    hazeR = `hazeR`,
    hazeG = `hazeG`,
    hazeB = `hazeB`,
}

export const hazeUniformPositions = (
    shaderId: WebGLProgram,
    gl: WebGLRenderingContext
) => {
    const uniform: UniformPositions = {};
    for (const param in Parameters) {
        uniform[param] = gl.getUniformLocation(shaderId, param);
    }
    return uniform;
};
