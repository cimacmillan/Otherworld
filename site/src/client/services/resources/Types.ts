export interface ResourceManifest {
    spritesheets: SpriteSheetManifest;
    sprites: SpriteManifest;
    animations: AnimationManifest;
    audio: AudioManifest;
}

export interface SpriteSheetManifest {
    [key: string]: string;
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
    framecount: number;
    vertical?: boolean;
}

export interface AnimationManifest {
    [key: string]: AnimationInfo;
}

export interface AudioManifest {
    [key: string]: string;
}
