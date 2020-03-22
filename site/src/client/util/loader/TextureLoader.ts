import { Colour, FastTexture, Texture } from "../../types";

export type LoadTextureCallback = (img: Texture) => void;

function constructTexture(img: HTMLImageElement): Texture {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return {
        data: ctx.getImageData(0, 0, img.width, img.height),
        width: img.width,
        height: img.height,
    };
}

export function loadTextureFromURL(url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(constructTexture(img));
        };
        img.src = url;
    });
}

export function convertToFastTexture(texture: Texture): FastTexture {
    const colours: Colour[][] = [];

    for (let x = 0; x < texture.width; x++) {
        const column: Colour[] = [];
        for (let y = 0; y < texture.height; y++) {
            const index = (x + (y * texture.width)) * 4;
            column.push({
                r: texture.data.data[index],
                g: texture.data.data[index + 1],
                b: texture.data.data[index + 2],
                a: texture.data.data[index + 3],
            });
        }
        colours.push(column);
    }

    return {
        data: colours,
        width: texture.width,
        height: texture.height,
    };
}

export function loadTexture(gl: WebGLRenderingContext, url: string): Promise<WebGLTexture>  {
    return new Promise<WebGLTexture>((resolve, reject) => {
        const image = new Image();
        image.onload = function() {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            resolve(texture);
        };
        image.src = url;
    });
  }

function isPowerOf2(value: number) {
    return (value & (value - 1)) == 0;
  }
