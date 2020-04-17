import { ResourceManifest } from "../Types";

export enum SpriteSheets {
    SPRITE,
}

export enum Animations {
    CRABLET_BROWN,
    CRABLET_GREEN,
    CRABLET_BLUE,
    CRABLET_BROWN_ATTACK,
    CRABLET_GREEN_ATTACK,
    CRABLET_BLUE_ATTACK,
}

export enum Sprites {
    SWORD,
    MACATOR_DAMAGED,
    MACATOR_DEAD_BROWN,
    MACATOR_DEAD_GREEN,
    MACATOR_DEAD_BLUE,
}

export enum Audios {
    INTRO,
    BOING,
    POINT,
    SLAM,
    WHOOSH,
    PLAYER_HIT,
    END,
    HISS,
}

export const defaultManifest: ResourceManifest = {
    spritesheets: {
        [SpriteSheets.SPRITE]: {
            url: "img/sprite.png",
            animations: {
                [Animations.CRABLET_BROWN]: {
                    width: 16,
                    height: 16,
                    x: 0,
                    y: 64,
                    frames: 8,
                },
                [Animations.CRABLET_GREEN]: {
                    width: 16,
                    height: 16,
                    x: 0,
                    y: 80,
                    frames: 8,
                },
                [Animations.CRABLET_BLUE]: {
                    width: 16,
                    height: 16,
                    x: 0,
                    y: 96,
                    frames: 8,
                },
                [Animations.CRABLET_BROWN_ATTACK]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 64,
                    frames: 8,
                },
                [Animations.CRABLET_GREEN_ATTACK]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 80,
                    frames: 8,
                },
                [Animations.CRABLET_BLUE_ATTACK]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 96,
                    frames: 8,
                },
            },
            sprites: {
                [Sprites.SWORD]: {
                    width: 16,
                    height: 32,
                    x: 128,
                    y: 32,
                },
                [Sprites.MACATOR_DAMAGED]: {
                    width: 16,
                    height: 16,
                    x: 0,
                    y: 112,
                },
                [Sprites.MACATOR_DEAD_BROWN]: {
                    width: 16,
                    height: 16,
                    x: 16,
                    y: 112,
                },
                [Sprites.MACATOR_DEAD_GREEN]: {
                    width: 16,
                    height: 16,
                    x: 32,
                    y: 112,
                },
                [Sprites.MACATOR_DEAD_BLUE]: {
                    width: 16,
                    height: 16,
                    x: 48,
                    y: 112,
                },
            },
        },
    },
    audio: {
        [Audios.INTRO]: "audio/intro.mp3",
        [Audios.BOING]: "audio/boing.mp3",
        [Audios.POINT]: "audio/point.mp3",
        [Audios.SLAM]: "audio/slam.mp3",
        [Audios.WHOOSH]: "audio/whoosh.mp3",
        [Audios.PLAYER_HIT]: "audio/player_hit.mp3",
        [Audios.END]: "audio/end.mp3",
        [Audios.HISS]: "audio/hiss.mp3",
    },
};
