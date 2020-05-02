import { AudioObject } from "../services/audio/AudioObject";
import { MapSchema } from "./MapShema";
import { SpriteSheet } from "./SpriteSheet";

export interface LoadedManifest {
    spritesheets: {
        [key: string]: SpriteSheet;
    };
    audio: {
        [key: string]: AudioObject;
    };
    maps: MapManifest;
}

export interface ResourceManifest {
    spritesheets: SpriteSheetManifest;
    audio: AudioManifest;
    maps: MapManifest;
}

export interface MapManifest {
    [key: string]: MapSchema;
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

export interface PanelImageMap {
    spritesheet: number;

    topLeft: number;
    topMiddle: number;
    topRight: number;
    middleLeft: number;
    middleMiddle: number;
    middleRight: number;
    bottomLeft: number;
    bottomMiddle: number;
    bottomRight: number;

    wideLeft: number;
    wideMiddle: number;
    wideRight: number;

    thinLeft: number;
    thinMiddle: number;
    thinight: number;

    tiny: number;
}
