export class ScreenBuffer {

    image_data: ImageData;
    width: number;
    height: number;

    constructor(image_data: ImageData, width: number, height: number) {
        this.image_data = image_data;
        this.width = width;
        this.height = height;
    }

    putPixel(x: number, y: number, red: number, green: number, blue: number, alpha: number) {
        var pixelindex = (y * this.width + x) * 4;
        this.image_data.data[pixelindex] = red;
        this.image_data.data[pixelindex + 1] = green;
        this.image_data.data[pixelindex + 2] = blue;
        this.image_data.data[pixelindex + 3] = alpha;
    }

}
