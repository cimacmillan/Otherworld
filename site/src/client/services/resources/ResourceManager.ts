import { loadSound } from "../../util/sound/AudioService";
import { SpriteSheet } from "./SpriteSheet";
import {
    loadImage,
    loadSpriteSheet,
    loadTextureFromURL,
} from "./TextureLoader";

export enum Animations {
    CRABLET_BROWN = "CRABLET_BROWN",
    CRABLET_GREEN = "CRABLET_GREEN",
    CRABLET_BLUE = "CRABLET_BLUE",
}

export enum Sprites {
    SWORD = "SWORD",
}

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

        this.sprite.registerAnimation(
            Animations.CRABLET_BROWN,
            16,
            16,
            0,
            64,
            8
        );

        this.sprite.registerAnimation(
            Animations.CRABLET_GREEN,
            16,
            16,
            0,
            80,
            8
        );

        this.sprite.registerAnimation(
            Animations.CRABLET_BLUE,
            16,
            16,
            0,
            96,
            8
        );

        this.sprite.registerSprite(Sprites.SWORD, 16, 32, 128, 32);

        this.wall = await loadTextureFromURL(gl, "img/wall.png");
        this.floor = await loadTextureFromURL(gl, "img/floor.png");
        // this.sprite = await loadTexture(gl, "img/glorp.png");

        this.intro = await loadSound("audio/intro.mp3", audio);
        this.boing = await loadSound("audio/boing.mp3", audio);

        this.uiImage = await loadImage("img/floor.png");
    }
}
