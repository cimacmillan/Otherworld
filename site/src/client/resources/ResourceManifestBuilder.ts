import { AudioMetadata } from "../services/audio/AudioObject";
import { UnloadedMap } from "./maps/MapTypes";
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

    public Audio(key: string, audio: string, metadata?: AudioMetadata) {
        this.audio[key] = {
            url: audio,
            metadata,
        };
    }

    public Map(key: string, map: UnloadedMap) {
        this.maps[key] = map;
    }

    public Builder(builder: ResourceManifestBuilder) {
        this.spritesheets = {
            ...this.spritesheets,
            ...builder.spritesheets,
        };
        this.audio = {
            ...this.audio,
            ...builder.audio,
        };
        this.maps = {
            ...this.maps,
            ...builder.maps,
        };
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
