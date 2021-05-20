import { SpriteSheet } from "./SpriteSheet";
import { SpriteSheetManifestJson } from "./Types";

export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
        const image = new Image();
        image.onload = function () {
            resolve(image);
        };
        image.onerror = (error) => {
            console.log(`Error loading image ${url}`, error);
        };
        image.src = url;
    });
}

export function loadJson<T>(url: string): Promise<T> {
    return fetch(url).then(response => response.json())
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

export async function loadSpriteSheet(
    gl: WebGLRenderingContext,
    url: string
): Promise<[SpriteSheet, SpriteSheetManifestJson]> {
    const imageUrl = url + ".png";
    const manifestUrl = url + ".json";

    const image = await loadImage(imageUrl);
    const json = await loadJson<SpriteSheetManifestJson>(manifestUrl);

    const texture = loadTextureFromImage(gl, image);
    return [new SpriteSheet(image.width, image.height, texture, image), json];
}

export function getImageData(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    const data = canvas
        .getContext("2d")
        .getImageData(0, 0, img.width, img.height);
    return data;
}

export async function loadImageData(url: string) {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
    const data = canvas
        .getContext("2d")
        .getImageData(0, 0, img.width, img.height);
    return data;
}
