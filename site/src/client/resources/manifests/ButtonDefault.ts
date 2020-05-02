import { PanelImageMap } from "../Types";
import { SpriteSheets, UISPRITES } from "./Types";

export const BUTTON_DEFAULT_SPRITES = {
    [UISPRITES.BUTTON_DEFAULT_TL]: {
        width: 16,
        height: 16,
        x: 144,
        y: 0,
    },
    [UISPRITES.BUTTON_DEFAULT_TM]: {
        width: 16,
        height: 16,
        x: 160,
        y: 0,
    },
    [UISPRITES.BUTTON_DEFAULT_TR]: {
        width: 16,
        height: 16,
        x: 176,
        y: 0,
    },
    [UISPRITES.BUTTON_DEFAULT_ML]: {
        width: 16,
        height: 16,
        x: 144,
        y: 16,
    },
    [UISPRITES.BUTTON_DEFAULT_MM]: {
        width: 16,
        height: 16,
        x: 160,
        y: 16,
    },
    [UISPRITES.BUTTON_DEFAULT_MR]: {
        width: 16,
        height: 16,
        x: 176,
        y: 16,
    },
    [UISPRITES.BUTTON_DEFAULT_BL]: {
        width: 16,
        height: 16,
        x: 144,
        y: 32,
    },
    [UISPRITES.BUTTON_DEFAULT_BM]: {
        width: 16,
        height: 16,
        x: 160,
        y: 32,
    },
    [UISPRITES.BUTTON_DEFAULT_BR]: {
        width: 16,
        height: 16,
        x: 176,
        y: 32,
    },
    [UISPRITES.BUTTON_DEFAULT_SL]: {
        width: 16,
        height: 16,
        x: 96,
        y: 0,
    },
    [UISPRITES.BUTTON_DEFAULT_SM]: {
        width: 16,
        height: 16,
        x: 112,
        y: 0,
    },
    [UISPRITES.BUTTON_DEFAULT_SR]: {
        width: 16,
        height: 16,
        x: 128,
        y: 0,
    },
    [UISPRITES.BUTTON_DEFAULT_SS]: {
        width: 16,
        height: 16,
        x: 96,
        y: 64,
    },
};

export const BUTTON_DEFAULT: PanelImageMap = {
    spritesheet: SpriteSheets.UI,

    topLeft: UISPRITES.BUTTON_DEFAULT_TL,
    topMiddle: UISPRITES.BUTTON_DEFAULT_TM,
    topRight: UISPRITES.BUTTON_DEFAULT_TR,
    middleLeft: UISPRITES.BUTTON_DEFAULT_ML,
    middleMiddle: UISPRITES.BUTTON_DEFAULT_MM,
    middleRight: UISPRITES.BUTTON_DEFAULT_MR,
    bottomLeft: UISPRITES.BUTTON_DEFAULT_BL,
    bottomMiddle: UISPRITES.BUTTON_DEFAULT_BM,
    bottomRight: UISPRITES.BUTTON_DEFAULT_BR,

    wideLeft: UISPRITES.BUTTON_DEFAULT_SL,
    wideMiddle: UISPRITES.BUTTON_DEFAULT_SM,
    wideRight: UISPRITES.BUTTON_DEFAULT_SR,

    thinLeft: UISPRITES.BUTTON_DEFAULT_SL,
    thinMiddle: UISPRITES.BUTTON_DEFAULT_SM,
    thinight: UISPRITES.BUTTON_DEFAULT_SR,

    tiny: UISPRITES.BUTTON_DEFAULT_SS,
};
