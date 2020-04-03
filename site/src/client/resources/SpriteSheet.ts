export class SpriteSheet {
    public constructor(
        private width: number,
        private height: number,
        private texture: WebGLTexture
    ) {}

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getTexture() {
        return this.texture;
    }

    public getTextureCoordinate(
        width: number,
        height: number,
        xPixel: number,
        yPixel: number
    ): {
        textureX: number;
        textureY: number;
        textureWidth: number;
        textureHeight: number;
    } {
        return {
            textureX: xPixel / this.width,
            textureY: yPixel / this.height,
            textureWidth: width / this.width,
            textureHeight: height / this.height,
        };
    }
}
