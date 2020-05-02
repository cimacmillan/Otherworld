import { fadeFunction, fadePixelAccuracy } from "./Fade";
import { hazeFunction } from "./Haze";

export const fsSource = `
    varying lowp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    varying lowp vec4 position;

    ${fadeFunction}
    ${hazeFunction}

    void main() {
      lowp vec4 texColor = texture2D(uSampler, vTextureCoord);
      if(texColor.a < 1.0) {
        discard;
      }

      lowp float fadeAccuracy = ${fadePixelAccuracy}.0;
      lowp float distance = length(floor(position * fadeAccuracy) / fadeAccuracy);
      lowp float multiplier = fade(distance);

      gl_FragColor = vec4(haze(texColor.rgb * multiplier), 1);
    }
  `;
