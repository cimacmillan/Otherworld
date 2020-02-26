export const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 colour;

    varying lowp vec4 vColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      vColor = colour;
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

