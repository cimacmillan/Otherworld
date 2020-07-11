import { fadeFunction } from "./Fade";
import { hazeFunction } from "./Haze";

export const rfsSource = `
    varying lowp vec2 vTextureCoord;
    varying lowp vec2 textureModStart;
    varying lowp vec2 textureModSize;
    uniform sampler2D uSampler;

    varying lowp vec4 position;

    ${fadeFunction}
    ${hazeFunction}

    void main() {
      lowp vec4 texColor = texture2D(uSampler, textureModStart + mod(vTextureCoord - textureModStart, textureModSize));
      if(texColor.a < 1.0) {
        discard;
      }

      lowp float distance = length(floor(position * fadeAccuracy) / fadeAccuracy);
      lowp float multiplier = fade(distance);

      gl_FragColor =  vec4(haze(texColor.rgb, multiplier), 1);
    }
  `;
