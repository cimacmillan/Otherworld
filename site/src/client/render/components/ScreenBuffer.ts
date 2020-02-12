import { Colour } from "../../types";
import { fillPattern } from "../../util/math/Array";

export class ScreenBuffer {

    public image_data: ImageData;
    public width: number;
    public height: number;

    constructor(image_data: ImageData, width: number, height: number) {
        this.image_data = image_data;
        this.width = width;
        this.height = height;
    }

    public putPixel(x: number, y: number, red: number, green: number, blue: number, alpha: number) {
        const pixelindex = (y * this.width + x) * 4;
        this.image_data.data[pixelindex] = red;
        this.image_data.data[pixelindex + 1] = green;
        this.image_data.data[pixelindex + 2] = blue;
        this.image_data.data[pixelindex + 3] = alpha;
    }

    public putPixelColour(x: number, y: number, colour: Colour, depth: number, farClip: number, backgroundColour: Colour) {

        let colourMult = (depth / farClip);
        colourMult *= colourMult;

        // Breaking the rules but it's faster
        this.putPixel(x, y,
            ~~(colour.r + colourMult * (backgroundColour.r - colour.r)),
            ~~(colour.g + colourMult * (backgroundColour.g - colour.g)),
            ~~(colour.b + colourMult * (backgroundColour.b - colour.b)),
            ~~(colour.a + colourMult * (backgroundColour.a - colour.a)),
            );
    }

    public fillBackground(red: number, green: number, blue: number, alpha: number) {
        fillPattern(this.image_data.data, [red, green, blue, alpha]);
    }

    public reset(colour: Colour) {
        this.fillBackground(colour.r, colour.g, colour.b, 255);
    }

}
