export const vertexPosition = "aVertexPosition";
export const vertexTranslation = "aVertexTranslation";
export const vertexColour = "colour";
export const modelMatrix = "uModelViewMatrix";

const v = {
    vertexPosition: `aVertexPosition`,
    vertexTranslation: `aVertexTranslation`,
    modelMatrix: `uModelViewMatrix`,
    projectionMatrix: `uProjectionMatrix`,
    colourOverride: `colourOverride`,
};

const source = `
    attribute vec4 ${v.vertexPosition};
    attribute vec4 ${v.vertexTranslation};
    attribute vec3 ${v.colourOverride};

    uniform mat4 ${v.modelMatrix};
    uniform mat4 ${v.projectionMatrix};

    varying lowp vec4 position;
    varying lowp vec3 colour;

    void main() {
      mat4 billboardMatrix = mat4(
        ${v.modelMatrix}[0][0], 0, ${v.modelMatrix}[0][2], 0,
        0, 1, 0, 0,
        ${v.modelMatrix}[2][0], 0, ${v.modelMatrix}[2][2], 0,
        0, 0, 0, 1
      );
      vec4 rotatedPosition = (${v.vertexPosition} * billboardMatrix) + ${v.vertexTranslation};

      gl_Position = ${v.projectionMatrix} * ${v.modelMatrix} * rotatedPosition;
      colour = ${v.colourOverride};
      position = gl_Position / 2.0;
    }
  `;

export const ParticleVertex = { v, source };
