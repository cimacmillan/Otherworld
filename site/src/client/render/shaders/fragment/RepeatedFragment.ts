export const rfsSource = `
    varying lowp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main() {
      lowp vec4 texColor = texture2D(uSampler, mod(vTextureCoord, 1.0));
      if(texColor.a < 1.0) {
        discard;
      }
      gl_FragColor = texColor;
    }
  `;
