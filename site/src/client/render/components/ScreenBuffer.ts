import { Colour } from "../../types";
import { fillPattern } from "../../util/math/SyncedArray";

export class ScreenBuffer {
  // public image_data: ImageData;
  private gl: WebGLRenderingContext;
  public width: number;
  public height: number;

  constructor(gl: WebGLRenderingContext, width: number, height: number) {
    this.gl = gl;
    this.width = width;
    this.height = height;
  }

  public getOpenGL() {
    return this.gl;
  }

  // public putPixel(x: number, y: number, red: number, green: number, blue: number, alpha: number) {
  //     const pixelindex = (y * this.width + x) * 4;
  //     this.image_data.data[pixelindex] = red;
  //     this.image_data.data[pixelindex + 1] = green;
  //     this.image_data.data[pixelindex + 2] = blue;
  //     this.image_data.data[pixelindex + 3] = alpha;
  // }

  // public putPixelColour(x: number, y: number, colour: Colour, depth: number, farClip: number, backgroundColour: Colour) {

  //     let colourMult = (depth / farClip);
  //     colourMult *= colourMult;

  //     // Breaking the rules but it's faster
  //     this.putPixel(x, y,
  //         ~~(colour.r + colourMult * (backgroundColour.r - colour.r)),
  //         ~~(colour.g + colourMult * (backgroundColour.g - colour.g)),
  //         ~~(colour.b + colourMult * (backgroundColour.b - colour.b)),
  //         ~~(colour.a + colourMult * (backgroundColour.a - colour.a)),
  //         );
  // }

  // public fillBackground(red: number, green: number, blue: number, alpha: number) {
  //     fillPattern(this.image_data.data, [red, green, blue, alpha]);
  // }

  // public reset(colour: Colour) {
  //     this.fillBackground(colour.r, colour.g, colour.b, 255);
  // }
}
