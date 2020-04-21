import { PanelImageMap } from "../Types";
import { SpriteSheets, UISPRITES } from "./Types";

export const BUTTON_PRESS_SPRITES = {
    [UISPRITES.BUTTON_PRESS_TL]: {
        width: 16,
        height: 16,
        x: 192,
        y: 0,
    },
    [UISPRITES.BUTTON_PRESS_TM]: {
        width: 16,
        height: 16,
        x: 208,
        y: 0,
    },
    [UISPRITES.BUTTON_PRESS_TR]: {
        width: 16,
        height: 16,
        x: 224,
        y: 0,
    },
    [UISPRITES.BUTTON_PRESS_ML]: {
        width: 16,
        height: 16,
        x: 192,
        y: 16,
    },
    [UISPRITES.BUTTON_PRESS_MM]: {
        width: 16,
        height: 16,
        x: 208,
        y: 16,
    },
    [UISPRITES.BUTTON_PRESS_MR]: {
        width: 16,
        height: 16,
        x: 224,
        y: 16,
    },
    [UISPRITES.BUTTON_PRESS_BL]: {
        width: 16,
        height: 16,
        x: 192,
        y: 32,
    },
    [UISPRITES.BUTTON_PRESS_BM]: {
        width: 16,
        height: 16,
        x: 208,
        y: 32,
    },
    [UISPRITES.BUTTON_PRESS_BR]: {
        width: 16,
        height: 16,
        x: 224,
        y: 32,
    },
    [UISPRITES.BUTTON_PRESS_SL]: {
        width: 16,
        height: 16,
        x: 96,
        y: 16,
    },
    [UISPRITES.BUTTON_PRESS_SM]: {
        width: 16,
        height: 16,
        x: 112,
        y: 16,
    },
    [UISPRITES.BUTTON_PRESS_SR]: {
        width: 16,
        height: 16,
        x: 128,
        y: 16,
    },
    [UISPRITES.BUTTON_PRESS_SS]: {
        width: 16,
        height: 16,
        x: 112,
        y: 64,
    },
};

export const BUTTON_PRESS: PanelImageMap = {
    spritesheet: SpriteSheets.UI,

    topLeft: UISPRITES.BUTTON_PRESS_TL,
    topMiddle: UISPRITES.BUTTON_PRESS_TM,
    topRight: UISPRITES.BUTTON_PRESS_TR,
    middleLeft: UISPRITES.BUTTON_PRESS_ML,
    middleMiddle: UISPRITES.BUTTON_PRESS_MM,
    middleRight: UISPRITES.BUTTON_PRESS_MR,
    bottomLeft: UISPRITES.BUTTON_PRESS_BL,
    bottomMiddle: UISPRITES.BUTTON_PRESS_BM,
    bottomRight: UISPRITES.BUTTON_PRESS_BR,

    wideLeft: UISPRITES.BUTTON_PRESS_SL,
    wideMiddle: UISPRITES.BUTTON_PRESS_SM,
    wideRight: UISPRITES.BUTTON_PRESS_SR,

    thinLeft: UISPRITES.BUTTON_PRESS_SL,
    thinMiddle: UISPRITES.BUTTON_PRESS_SM,
    thinight: UISPRITES.BUTTON_PRESS_SR,

    tiny: UISPRITES.BUTTON_PRESS_SS,
};
