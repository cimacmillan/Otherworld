export const vertexPosition = "aVertexPosition";
export const vertexTranslation = "aVertexTranslation";
export const vertexColour = "colour";
export const modelMatrix = "uModelViewMatrix";

export const v = {
  vertexPosition: `aVertexPosition`,
  modelMatrix: `uModelViewMatrix`,
  textureSampler: `uSampler`,
  projectionMatrix: `uProjectionMatrix`,
  texturePosition: `aTextureCoord`,
};

export const source = `
    attribute vec4 ${v.vertexPosition};
    attribute vec2 ${v.texturePosition};

    uniform mat4 ${v.modelMatrix};
    uniform mat4 ${v.projectionMatrix};

    varying lowp vec2 vTextureCoord;

    void main() {
      gl_Position = ${v.projectionMatrix} * ${v.modelMatrix} * ${v.vertexPosition};
      vTextureCoord = ${v.texturePosition};
    }
  `;

export const Vertex = {v, source};
