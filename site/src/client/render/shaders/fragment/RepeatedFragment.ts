export const rfsSource = `
    varying lowp vec2 vTextureCoord;
    varying lowp vec2 textureModStart;
    varying lowp vec2 textureModSize;
    uniform sampler2D uSampler;

    void main() {
      lowp vec4 texColor = texture2D(uSampler, textureModStart + mod(vTextureCoord - textureModStart, textureModSize));
      if(texColor.a < 1.0) {
        discard;
      }
      gl_FragColor = texColor;
    }
  `;
