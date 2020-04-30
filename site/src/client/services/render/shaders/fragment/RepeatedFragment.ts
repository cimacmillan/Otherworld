import { fadeFunction } from "./Fade";

export const rfsSource = `
    varying lowp vec2 vTextureCoord;
    varying lowp vec2 textureModStart;
    varying lowp vec2 textureModSize;
    uniform sampler2D uSampler;

    varying lowp float distance;

    ${fadeFunction}

    void main() {
      lowp vec4 texColor = texture2D(uSampler, textureModStart + mod(vTextureCoord - textureModStart, textureModSize));
      if(texColor.a < 1.0) {
        discard;
      }

      lowp float multiplier = fade(distance);

      gl_FragColor =  vec4(texColor.rgb * multiplier, 1);
    }
  `;
