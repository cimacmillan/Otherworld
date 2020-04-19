import { SpriteSheet } from "./SpriteSheet";

export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.onload = function () {
            resolve(image);
        };
        image.src = url;
    });
}

export function loadTextureFromImage(
    gl: WebGLRenderingContext,
    image: HTMLImageElement
): WebGLTexture {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
}

export function loadTextureFromURL(
    gl: WebGLRenderingContext,
    url: string
): Promise<WebGLTexture> {
    return loadImage(url).then((image: HTMLImageElement) => {
        return loadTextureFromImage(gl, image);
    });
}

export function loadSpriteSheet(
    gl: WebGLRenderingContext,
    url: string
): Promise<SpriteSheet> {
    return loadImage(url).then((image: HTMLImageElement) => {
        const texture = loadTextureFromImage(gl, image);
        return new SpriteSheet(image.width, image.height, texture, image);
    });
}