export const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexTranslation;
    attribute vec4 colour;
    attribute vec2 aTextureCoord;

    varying lowp vec4 vColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec2 vTextureCoord;

    void main() {
      mat4 billboardMatrix = mat4(
        uModelViewMatrix[0][0], 0, uModelViewMatrix[0][2], 0,
        0, 1, 0, 0,
        uModelViewMatrix[2][0], 0, uModelViewMatrix[2][2], 0,
        0, 0, 0, 1
      );
      vec4 rotatedPosition = (aVertexPosition * billboardMatrix) + aVertexTranslation;

      vColor = colour;
      gl_Position = uProjectionMatrix * uModelViewMatrix * rotatedPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

