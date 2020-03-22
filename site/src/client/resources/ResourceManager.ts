import { FastTexture, Texture } from "../types";
import { convertToFastTexture, loadTexture, loadTextureFromURL } from "../util/loader/TextureLoader";

export class ResourceManager {

    public sprite: WebGLTexture;
    public wall: WebGLTexture;
    public floor: WebGLTexture;

    public async load(gl: WebGLRenderingContext) {
        this.sprite = await loadTexture(gl, "img/sprite.png");
        this.wall = await loadTexture(gl, "img/wall.png");
        this.floor = await loadTexture(gl, "img/floor.png");
    }

}
