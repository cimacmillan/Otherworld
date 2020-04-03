import {
    loadImage,
    loadSpriteSheet,
    loadTextureFromURL,
} from "../util/loader/TextureLoader";
import { loadSound } from "../util/sound/AudioService";
import { SpriteSheet } from "./SpriteSheet";

export class ResourceManager {
    public sprite: SpriteSheet;
    public wall: WebGLTexture;
    public floor: WebGLTexture;
    public glorp: WebGLTexture;

    public intro: AudioBuffer;
    public boing: AudioBuffer;

    public uiImage: HTMLImageElement;

    public async load(gl: WebGLRenderingContext, audio: AudioContext) {
        this.sprite = await loadSpriteSheet(gl, "img/sprite.png");
        this.wall = await loadTextureFromURL(gl, "img/wall.png");
        this.floor = await loadTextureFromURL(gl, "img/floor.png");
        // this.sprite = await loadTexture(gl, "img/glorp.png");

        this.intro = await loadSound("audio/intro.mp3", audio);
        this.boing = await loadSound("audio/boing.mp3", audio);

        this.uiImage = await loadImage("img/floor.png");
    }
}
