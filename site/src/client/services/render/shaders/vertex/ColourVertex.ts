export const vertexPosition = "aVertexPosition";
export const vertexTranslation = "aVertexTranslation";
export const vertexColour = "colour";
export const modelMatrix = "uModelViewMatrix";

export const v = {
    vertexPosition: `aVertexPosition`,
    modelMatrix: `uModelViewMatrix`,
    projectionMatrix: `uProjectionMatrix`,
    colourOverride: `colourOverride`,
    transform0: `transform0`,
    transform1: `transform1`,
    transform2: `transform2`,
    transform3: `transform3`,
};

export const source = `
    attribute vec3 ${v.vertexPosition};
    attribute vec3 ${v.colourOverride};
    attribute vec4 ${v.transform0};
    attribute vec4 ${v.transform1};
    attribute vec4 ${v.transform2};
    attribute vec4 ${v.transform3};

    uniform mat4 ${v.modelMatrix};
    uniform mat4 ${v.projectionMatrix};

    varying lowp vec3 colour;
    varying lowp vec4 position;

    void main() {
      gl_Position = ${v.projectionMatrix} * ${v.modelMatrix} * vec4(${v.vertexPosition}, 1);
      colour = ${v.colourOverride};
      position = gl_Position / 2.0;
    }
  `;

export const ColourVertex = { v, source };
