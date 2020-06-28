export const MINOR = "0";
export const PHASE = "1";
export const MAJOR = "0";
export const VERSION = `V${MAJOR}.${PHASE}.${MINOR}`;

export const DOM_WIDTH = 1280;
export const DOM_HEIGHT = 680;
export const RES_DIV = 4;
export const WIDTH = DOM_WIDTH / RES_DIV;
export const HEIGHT = DOM_HEIGHT / RES_DIV;

export const ASPECT_RATIO = DOM_WIDTH / DOM_HEIGHT;
export const FOV = 45;
export const ZNEAR = 0.001;
export const ZFAR = 10000;

export const TARGET_FPS = 60;
export const TARGET_MILLIS = Math.floor(1000 / TARGET_FPS);

export const DEFAULT_PLAYER_HEIGHT = 0.5;
export const DEFAULT_PLAYER_RADIUS = 0.5;

export const SCENERY_PIXEL_DENSITY = 16;

export const IS_DEV_MODE = () => window.location.href === "http://localhost/";
