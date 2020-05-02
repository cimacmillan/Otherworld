import { PanelImageMap } from "../Types";
import { SpriteSheets, UISPRITES } from "./Types";

export const BUTTON_HOVER_SPRITES = {
    [UISPRITES.BUTTON_HOVER_TL]: {
        width: 16,
        height: 16,
        x: 288,
        y: 0,
    },
    [UISPRITES.BUTTON_HOVER_TM]: {
        width: 16,
        height: 16,
        x: 304,
        y: 0,
    },
    [UISPRITES.BUTTON_HOVER_TR]: {
        width: 16,
        height: 16,
        x: 320,
        y: 0,
    },
    [UISPRITES.BUTTON_HOVER_ML]: {
        width: 16,
        height: 16,
        x: 288,
        y: 16,
    },
    [UISPRITES.BUTTON_HOVER_MM]: {
        width: 16,
        height: 16,
        x: 304,
        y: 16,
    },
    [UISPRITES.BUTTON_HOVER_MR]: {
        width: 16,
        height: 16,
        x: 320,
        y: 16,
    },
    [UISPRITES.BUTTON_HOVER_BL]: {
        width: 16,
        height: 16,
        x: 288,
        y: 32,
    },
    [UISPRITES.BUTTON_HOVER_BM]: {
        width: 16,
        height: 16,
        x: 304,
        y: 32,
    },
    [UISPRITES.BUTTON_HOVER_BR]: {
        width: 16,
        height: 16,
        x: 320,
        y: 32,
    },
    [UISPRITES.BUTTON_HOVER_SL]: {
        width: 16,
        height: 16,
        x: 96,
        y: 48,
    },
    [UISPRITES.BUTTON_HOVER_SM]: {
        width: 16,
        height: 16,
        x: 112,
        y: 48,
    },
    [UISPRITES.BUTTON_HOVER_SR]: {
        width: 16,
        height: 16,
        x: 128,
        y: 48,
    },
    [UISPRITES.BUTTON_HOVER_SS]: {
        width: 16,
        height: 16,
        x: 144,
        y: 64,
    },
};

export const BUTTON_HOVER: PanelImageMap = {
    spritesheet: SpriteSheets.UI,

    topLeft: UISPRITES.BUTTON_HOVER_TL,
    topMiddle: UISPRITES.BUTTON_HOVER_TM,
    topRight: UISPRITES.BUTTON_HOVER_TR,
    middleLeft: UISPRITES.BUTTON_HOVER_ML,
    middleMiddle: UISPRITES.BUTTON_HOVER_MM,
    middleRight: UISPRITES.BUTTON_HOVER_MR,
    bottomLeft: UISPRITES.BUTTON_HOVER_BL,
    bottomMiddle: UISPRITES.BUTTON_HOVER_BM,
    bottomRight: UISPRITES.BUTTON_HOVER_BR,

    wideLeft: UISPRITES.BUTTON_HOVER_SL,
    wideMiddle: UISPRITES.BUTTON_HOVER_SM,
    wideRight: UISPRITES.BUTTON_HOVER_SR,

    thinLeft: UISPRITES.BUTTON_HOVER_SL,
    thinMiddle: UISPRITES.BUTTON_HOVER_SM,
    thinight: UISPRITES.BUTTON_HOVER_SR,

    tiny: UISPRITES.BUTTON_HOVER_SS,
};
