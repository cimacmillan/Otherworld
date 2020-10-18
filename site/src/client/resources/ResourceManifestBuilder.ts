import { MapSchema } from "./MapShema";
import {
    AnimationManifest,
    AudioManifest,
    MapManifest,
    ResourceManifest,
    SpriteManifest,
    SpriteSheetManifest,
} from "./Types";

export class ResourceManifestBuilder implements ResourceManifest {
    public spritesheets: {
        [key: string]: SpriteSheetManifest;
    } = {};
    public audio: AudioManifest = {};
    public maps: MapManifest = {};

    public Spritesheet(key: string, manifest: SpriteSheetManifest) {
        this.spritesheets[key] = manifest;
    }

    public Audio(key: string, audio: string) {
        this.audio[key] = audio;
    }

    public Map(key: string, map: MapSchema) {
        this.maps[key] = map;
    }
}

export class SpriteSheetManifestBuilder implements SpriteSheetManifest {
    public url: string = "";
    public sprites: SpriteManifest = {};
    public animations: AnimationManifest = {};

    public constructor(url: string) {
        this.url = url;
    }

    public Sprite(
        key: string,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.sprites[key] = { x, y, width, height };
    }

    public Animation(
        key: string,
        x: number,
        y: number,
        width: number,
        height: number,
        frames: number,
        vertical: boolean = false
    ) {
        this.animations[key] = { x, y, width, height, frames, vertical };
    }
}
