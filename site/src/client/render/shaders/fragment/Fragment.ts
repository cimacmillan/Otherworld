export const fsSource = `
    varying lowp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main() {
      lowp vec4 texColor = texture2D(uSampler, vTextureCoord);
      if(texColor.a < 1.0) {
        discard;
      }
      gl_FragColor = texColor;
    }
  `;
