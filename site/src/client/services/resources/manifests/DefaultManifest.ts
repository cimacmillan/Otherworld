import { ResourceManifest } from "../Types";
import { BUTTON_DEFAULT_SPRITES } from "./ButtonDefault";
import { BUTTON_HOVER_SPRITES } from "./ButtonHover";
import { BUTTON_PRESS_SPRITES } from "./ButtonPress";
import { DARK_PANEL_SPRITES } from "./DarkPanel";
import {
    Animations,
    Audios,
    SCENERYSPRITES,
    Sprites,
    SpriteSheets,
    UIANIMATIONS,
    UISPRITES,
} from "./Types";

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
                [Animations.EGG_CHARGE]: {
                    width: 32,
                    height: 32,
                    x: 0,
                    y: 128,
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
                [UISPRITES.KEY_UP]: {
                    x: 96,
                    y: 80,
                    width: 16,
                    height: 16,
                },
                [UISPRITES.KEY_DOWN]: {
                    x: 112,
                    y: 80,
                    width: 16,
                    height: 16,
                },
                ...DARK_PANEL_SPRITES,
                ...BUTTON_DEFAULT_SPRITES,
                ...BUTTON_HOVER_SPRITES,
                ...BUTTON_PRESS_SPRITES,
            },
        },
        [SpriteSheets.SCENERY]: {
            url: "img/scenery.png",
            animations: {},
            sprites: {
                [SCENERYSPRITES.WALL]: {
                    x: 0,
                    y: 0,
                    width: 32,
                    height: 32,
                },
                [SCENERYSPRITES.FLOOR]: {
                    x: 0,
                    y: 32,
                    width: 32,
                    height: 32,
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
        [Audios.INCOMING]: "audio/incoming.mp3",
    },
};
