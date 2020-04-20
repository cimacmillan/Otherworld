import { ResourceManifest } from "../Types";

export enum SpriteSheets {
    SPRITE,
    UI,
}

export enum UIANIMATIONS {
    HEALTH_BAR,
}

export enum UISPRITES {
    PANEL_CENTER,
    PANEL_TL,
    PANEL_TM,
    PANEL_TR,
    PANEL_ML,
    PANEL_MR,
    PANEL_BL,
    PANEL_BM,
    PANEL_BR,
    PANEL_SL,
    PANEL_SM,
    PANEL_SR,
    PANEL_SS,
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
        [SpriteSheets.UI]: {
            url: "img/ui.png",
            animations: {
                [UIANIMATIONS.HEALTH_BAR]: {
                    width: 96,
                    height: 32,
                    x: 0,
                    y: 0,
                    vertical: true,
                    frames: 10,
                },
            },
            sprites: {
                [UISPRITES.PANEL_TL]: {
                    width: 16,
                    height: 16,
                    x: 240,
                    y: 0,
                },
                [UISPRITES.PANEL_TM]: {
                    width: 16,
                    height: 16,
                    x: 256,
                    y: 0,
                },
                [UISPRITES.PANEL_TR]: {
                    width: 16,
                    height: 16,
                    x: 272,
                    y: 0,
                },
                [UISPRITES.PANEL_ML]: {
                    width: 16,
                    height: 16,
                    x: 240,
                    y: 16,
                },
                [UISPRITES.PANEL_CENTER]: {
                    width: 16,
                    height: 16,
                    x: 256,
                    y: 16,
                },
                [UISPRITES.PANEL_MR]: {
                    width: 16,
                    height: 16,
                    x: 272,
                    y: 16,
                },
                [UISPRITES.PANEL_BL]: {
                    width: 16,
                    height: 16,
                    x: 240,
                    y: 32,
                },
                [UISPRITES.PANEL_BM]: {
                    width: 16,
                    height: 16,
                    x: 256,
                    y: 32,
                },
                [UISPRITES.PANEL_BR]: {
                    width: 16,
                    height: 16,
                    x: 272,
                    y: 32,
                },
                [UISPRITES.PANEL_SL]: {
                    width: 16,
                    height: 16,
                    x: 96,
                    y: 32,
                },
                [UISPRITES.PANEL_SM]: {
                    width: 16,
                    height: 16,
                    x: 112,
                    y: 32,
                },
                [UISPRITES.PANEL_SR]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 32,
                },
                [UISPRITES.PANEL_SS]: {
                    width: 16,
                    height: 16,
                    x: 128,
                    y: 64,
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
