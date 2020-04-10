export interface TextureCoordinate {
    textureX: number;
    textureY: number;
    textureWidth: number;
    textureHeight: number;
}

interface SpriteHash {
    [name: string]: TextureCoordinate;
}
interface AnimationHash {
    [name: string]: TextureCoordinate[];
}

export class SpriteSheet {
    private spriteHash: SpriteHash = {};
    private animationHash: AnimationHash = {};

    public constructor(
        private width: number,
        private height: number,
        private texture: WebGLTexture,
        private image: HTMLImageElement
    ) {}

    public registerSprite(
        name: string,
        width: number,
        height: number,
        xPixel: number,
        yPixel: number
    ) {
        this.spriteHash[name] = this.getTextureCoordinate(
            width,
            height,
            xPixel,
            yPixel
        );
    }

    public registerAnimation(
        name: string,
        width: number,
        height: number,
        xPixel: number,
        yPixel: number,
        frameCount: number,
        horizontal: boolean = true
    ) {
        const spriteWidth = width;
        const spriteHeight = height;

        let xPos = xPixel;
        const yPos = yPixel;

        this.animationHash[name] = [];

        for (let i = 0; i < frameCount; i++) {
            this.animationHash[name].push(
                this.getTextureCoordinate(spriteWidth, spriteHeight, xPos, yPos)
            );
            xPos += spriteWidth;
        }
    }

    public getSprite(name: string) {
        if (!this.spriteHash[name]) {
            console.log(`SpriteSheet ${name} missing`);
        }
        return this.spriteHash[name];
    }

    public getAnimationFrame(name: string, frame: number) {
        const animation = this.animationHash[name];
        if (!animation) {
            console.log(`Animation ${name} missing`);
            return;
        }

        if (frame >= animation.length) {
            return animation[animation.length - 1];
        }

        return this.animationHash[name][frame];
    }

    public getAnimationInterp(name: string, interp: number) {
        const animation = this.animationHash[name];
        if (!animation) {
            console.log(`Animation ${name} missing`);
        }
        const frame = Math.floor(interp * animation.length);
        return this.getAnimationFrame(name, frame);
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getTexture() {
        return this.texture;
    }

    public getImage() {
        return this.image;
    }

    public getTextureCoordinate(
        width: number,
        height: number,
        xPixel: number,
        yPixel: number
    ): TextureCoordinate {
        return {
            textureX: xPixel / this.width,
            textureY: yPixel / this.height,
            textureWidth: width / this.width,
            textureHeight: height / this.height,
        };
    }
}
