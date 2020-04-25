export enum GameStartActionType {
    START_GAME = "START_GAME",
    FADE_BACKGROUND = "FADE_BACKGROUND",
    FADE_MENU = "FADE_MENU",
}

interface GameStartActionStart {
    type: GameStartActionType.START_GAME;
}

interface FadeBackground {
    type: GameStartActionType.FADE_BACKGROUND;
}

interface FadeMenu {
    type: GameStartActionType.FADE_MENU;
}

export const startGame = () => ({
    type: GameStartActionType.START_GAME,
});

export type GameStartActions = GameStartActionStart | FadeBackground | FadeMenu;
