import { AudioObject } from "../audio/AudioObject";
import { loadSound } from "../audio/AudioService";
import { SpriteSheet } from "./SpriteSheet";
import {
    loadImage,
    loadSpriteSheet,
    loadTextureFromURL,
} from "./TextureLoader";
import { ResourceManifest } from "./Types";

export class ResourceManager {
    public sprite: SpriteSheet;

    public wall: WebGLTexture;
    public floor: WebGLTexture;
    public glorp: WebGLTexture;

    public intro: AudioObject;
    public boing: AudioObject;
    public whoosh: AudioObject;
    public slam: AudioObject;
    public point: AudioObject;
    public playerHit: AudioObject;
    public end: AudioObject;
    public hiss: AudioObject;

    public uiImage: HTMLImageElement;

    public async load(gl: WebGLRenderingContext, audio: AudioContext) {
        this.wall = await loadTextureFromURL(gl, "img/wall.png");
        this.floor = await loadTextureFromURL(gl, "img/floor.png");
        this.uiImage = await loadImage("img/floor.png");
    }
}
