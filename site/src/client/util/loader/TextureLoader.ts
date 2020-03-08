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

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                    width, height, border, srcFormat, srcType,
                    pixel);
    
        const image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                            srcFormat, srcType, image);
        
            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                // Yes, it's a power of 2. Generate mips.
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn off mips and set
                // wrapping to clamp to edge
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
            resolve(texture);
        };
        image.src = url;
    });
  }
  
  function isPowerOf2(value: number) {
    return (value & (value - 1)) == 0;
  }