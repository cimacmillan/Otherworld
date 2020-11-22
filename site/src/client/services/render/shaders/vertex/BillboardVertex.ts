export const vertexPosition = "aVertexPosition";
export const vertexTranslation = "aVertexTranslation";
export const vertexColour = "colour";
export const modelMatrix = "uModelViewMatrix";

const v = {
    vertexPosition: `aVertexPosition`,
    vertexTranslation: `aVertexTranslation`,
    modelMatrix: `uModelViewMatrix`,
    textureSampler: `uSampler`,
    projectionMatrix: `uProjectionMatrix`,
    texturePosition: `aTextureCoord`,
    colourOverride: `colourOverride`,
};

const source = `
    attribute vec4 ${v.vertexPosition};
    attribute vec4 ${v.vertexTranslation};
    attribute vec2 ${v.texturePosition};
    attribute vec4 ${v.colourOverride};

    uniform mat4 ${v.modelMatrix};
    uniform mat4 ${v.projectionMatrix};

    varying lowp vec2 vTextureCoord;
    varying lowp vec4 position;
    varying lowp vec4 colour;

    void main() {
      mat4 billboardMatrix = mat4(
        ${v.modelMatrix}[0][0], 0, ${v.modelMatrix}[0][2], 0,
        0, 1, 0, 0,
        ${v.modelMatrix}[2][0], 0, ${v.modelMatrix}[2][2], 0,
        0, 0, 0, 1
      );
      vec4 rotatedPosition = (${v.vertexPosition} * billboardMatrix) + ${v.vertexTranslation};

      gl_Position = ${v.projectionMatrix} * ${v.modelMatrix} * rotatedPosition;
      vTextureCoord = ${v.texturePosition};
      colour = ${v.colourOverride};
      position = gl_Position / 2.0;
    }
  `;

export const BilloardVertex = { v, source };
