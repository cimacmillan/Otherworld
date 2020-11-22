import { fadeFunction } from "./Fade";
import { hazeFunction } from "./Haze";

export const colourFragment = `
    varying lowp vec4 position;
    varying lowp vec3 colour;

    ${fadeFunction}
    ${hazeFunction}

    void main() {
      lowp float distance = length(floor(position * fadeAccuracy) / fadeAccuracy);
      lowp float multiplier = fade(distance);

      gl_FragColor = vec4(haze(colour, multiplier), 1);
    }
  `;
