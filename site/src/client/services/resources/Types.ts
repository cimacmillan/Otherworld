import { AudioObject } from "../audio/AudioObject";
import { SpriteSheet } from "./SpriteSheet";

export interface LoadedManifest {
    spritesheets: {
        [key: string]: SpriteSheet;
    };
    audio: {
        [key: string]: AudioObject;
    };
}

export interface ResourceManifest {
    spritesheets: SpriteSheetManifest;
    audio: AudioManifest;
}

export interface SpriteSheetManifest {
    [key: string]: {
        url: string;
        sprites: SpriteManifest;
        animations: AnimationManifest;
    };
}

export interface SpriteInfo {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface SpriteManifest {
    [key: string]: SpriteInfo;
}

export interface AnimationInfo {
    width: number;
    height: number;
    x: number;
    y: number;
    frames: number;
    vertical?: boolean;
}

export interface AnimationManifest {
    [key: string]: AnimationInfo;
}

export interface AudioManifest {
    [key: string]: string;
}