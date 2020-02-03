import { Colour, FastTexture, Texture } from "../../types";

export type LoadTextureCallback = (img: Texture) => void;

function constructTexture(img: HTMLImageElement): Texture {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return {
        data: ctx.getImageData(0, 0, img.width, img.height),
        width: img.width,
        height: img.height,
    };
}

export function loadTextureFromURL(url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
        let img = new Image();
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