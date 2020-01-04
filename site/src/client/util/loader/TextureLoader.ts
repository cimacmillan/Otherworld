import { Texture } from "../../types";

export type LoadTextureCallback = (img: Texture) => void;

function constructTexture(img: HTMLImageElement): Texture {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return {
        data: ctx.getImageData(0, 0, img.width, img.height),
        width: img.width,
        height: img.height
    };
}

export function loadTextureFromURL (url: string): Promise<Texture> {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => {
            resolve(constructTexture(img))
        };
        img.src = url;
    });
}

