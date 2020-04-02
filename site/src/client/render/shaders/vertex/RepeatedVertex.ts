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
	textureStart: `textureStart`,
	textureSize: `textureSize`,
};

export const source = `
    attribute vec4 ${v.vertexPosition};
    attribute vec2 ${v.texturePosition};
    attribute vec2 ${v.textureStart};
    attribute vec2 ${v.textureSize};

    uniform mat4 ${v.modelMatrix};
    uniform mat4 ${v.projectionMatrix};

    varying lowp vec2 vTextureCoord;
    varying lowp vec2 textureModStart;
    varying lowp vec2 textureModSize;

    void main() {
      gl_Position = ${v.projectionMatrix} * ${v.modelMatrix} * ${v.vertexPosition};
      vTextureCoord = ${v.texturePosition};
      textureModStart = ${v.textureStart};
      textureModSize = ${v.textureSize};
    }
  `;

export const RepeatedVertex = { v, source };
