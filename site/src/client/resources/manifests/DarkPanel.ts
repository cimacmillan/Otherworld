import { PanelImageMap } from "../Types";
import { SpriteSheets, UISPRITES } from "./Types";

export const DARK_PANEL_SPRITES = {
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
};

export const DARK_PANEL: PanelImageMap = {
    spritesheet: SpriteSheets.UI,

    topLeft: UISPRITES.PANEL_TL,
    topMiddle: UISPRITES.PANEL_TM,
    topRight: UISPRITES.PANEL_TR,
    middleLeft: UISPRITES.PANEL_ML,
    middleMiddle: UISPRITES.PANEL_CENTER,
    middleRight: UISPRITES.PANEL_MR,
    bottomLeft: UISPRITES.PANEL_BL,
    bottomMiddle: UISPRITES.PANEL_BM,
    bottomRight: UISPRITES.PANEL_BR,

    wideLeft: UISPRITES.PANEL_SL,
    wideMiddle: UISPRITES.PANEL_SM,
    wideRight: UISPRITES.PANEL_SR,

    thinLeft: UISPRITES.PANEL_SL,
    thinMiddle: UISPRITES.PANEL_SM,
    thinight: UISPRITES.PANEL_SR,

    tiny: UISPRITES.PANEL_SS,
};
