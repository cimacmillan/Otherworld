export enum MiniGameUIActionType {
    MINI_GAME_CLOSE = "MINI_GAME_CLOSE",
}

interface CloseMiniGame {
    type: MiniGameUIActionType.MINI_GAME_CLOSE;
}

export type MiniGameUIActions = CloseMiniGame;
