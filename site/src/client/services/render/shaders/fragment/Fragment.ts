import { fadeFunction } from "./Fade";
import { hazeFunction } from "./Haze";

export const fsSource = `
    varying lowp vec2 vTextureCoord;
    uniform sampler2D uSampler;

    varying lowp vec4 position;
    varying lowp vec4 colour;

    ${fadeFunction}
    ${hazeFunction}

    void main() {
      lowp vec4 texColor = texture2D(uSampler, vTextureCoord);
      if(texColor.a < 1.0) {
        discard;
      }

      lowp float distance = length(floor(position * fadeAccuracy) / fadeAccuracy);
      lowp float multiplier = fade(distance);

      lowp vec3 col = (colour.rgb * colour.a) + ((1.0 - colour.a) * texColor.rgb);

      gl_FragColor = vec4(haze(col, multiplier), 1);
    }
  `;
