import { AudioObject } from "../audio/AudioObject";
import { loadSound } from "../audio/AudioService";
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
    CRABLET_BROWN_ATTACK = "CRABLET_BROWN_ATTACK",
    CRABLET_GREEN_ATTACK = "CRABLET_GREEN_ATTACK",
    CRABLET_BLUE_ATTACK = "CRABLET_BLUE_ATTACK",
}

export enum Sprites {
    SWORD = "SWORD",
    MACATOR_DAMAGED = "MACATOR_DAMAGED",
    MACATOR_DEAD_BROWN = "MACATOR_DEAD_BROWN",
    MACATOR_DEAD_GREEN = "MACATOR_DEAD_GREEN",
    MACATOR_DEAD_BLUE = "MACATOR_DEAD_BLUE",
}

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

        this.sprite.registerAnimation(
            Animations.CRABLET_BROWN_ATTACK,
            16,
            16,
            128,
            64,
            8
        );

        this.sprite.registerAnimation(
            Animations.CRABLET_GREEN_ATTACK,
            16,
            16,
            128,
            80,
            8
        );

        this.sprite.registerAnimation(
            Animations.CRABLET_BLUE_ATTACK,
            16,
            16,
            128,
            96,
            8
        );

        this.sprite.registerSprite(Sprites.SWORD, 16, 32, 128, 32);
        this.sprite.registerSprite(Sprites.MACATOR_DAMAGED, 16, 16, 0, 112);
        this.sprite.registerSprite(Sprites.MACATOR_DEAD_BROWN, 16, 16, 16, 112);
        this.sprite.registerSprite(Sprites.MACATOR_DEAD_GREEN, 16, 16, 32, 112);
        this.sprite.registerSprite(Sprites.MACATOR_DEAD_BLUE, 16, 16, 48, 112);

        this.wall = await loadTextureFromURL(gl, "img/wall.png");
        this.floor = await loadTextureFromURL(gl, "img/floor.png");
        // this.sprite = await loadTexture(gl, "img/glorp.png");

        this.intro = await loadSound("audio/intro.mp3", audio);
        this.boing = await loadSound("audio/boing.mp3", audio);
        this.point = await loadSound("audio/point.mp3", audio);
        this.slam = await loadSound("audio/slam.mp3", audio);
        this.whoosh = await loadSound("audio/whoosh.mp3", audio);
        this.playerHit = await loadSound("audio/player_hit.mp3", audio);
        this.end = await loadSound("audio/end.mp3", audio);
        this.hiss = await loadSound("audio/hiss.mp3", audio);

        this.uiImage = await loadImage("img/floor.png");
    }
}
