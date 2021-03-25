export const vertexPosition = "aVertexPosition";
export const vertexTranslation = "aVertexTranslation";
export const vertexColour = "colour";
export const modelMatrix = "uModelViewMatrix";

export const v = {
    vertexPosition: `aVertexPosition`,
    modelMatrix: `uModelViewMatrix`,
    projectionMatrix: `uProjectionMatrix`,
    colourOverride: `colourOverride`,

};

export const source = `
    attribute vec3 ${v.vertexPosition};
    attribute vec3 ${v.colourOverride};

    uniform mat4 ${v.modelMatrix};
    uniform mat4 ${v.projectionMatrix};

    varying lowp vec3 colour;
    varying lowp vec4 position;

    void main() {
        vec4 pos = ${v.projectionMatrix} * ${v.modelMatrix} * vec4(${v.vertexPosition}, 1);
        gl_Position = vec4(pos.x, pos.y, pos.z, pos.w);
        colour = ${v.colourOverride};
        position = pos / 2.0;
    }
  `;

export const ColourVertex = { v, source };
