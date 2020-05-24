export enum GameStartActionType {
    START_GAME = "START_GAME",
    FADE_BACKGROUND = "FADE_BACKGROUND",
    FADE_MENU = "FADE_MENU",
    SET_GAME_LOAD_PERCENTAGE = "SET_GAME_LOAD_PERCENTAGE",
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

interface SetGameLoadPercentage {
    type: GameStartActionType.SET_GAME_LOAD_PERCENTAGE;
    payload: { percentage: number };
}

export const startGame = () =>
    ({
        type: GameStartActionType.START_GAME,
    } as GameStartActionStart);

export const setLoadPercentage: (
    percentage: number
) => SetGameLoadPercentage = (percentage: number) => ({
    type: GameStartActionType.SET_GAME_LOAD_PERCENTAGE,
    payload: {
        percentage,
    },
});

export type GameStartActions =
    | GameStartActionStart
    | FadeBackground
    | FadeMenu
    | SetGameLoadPercentage;
