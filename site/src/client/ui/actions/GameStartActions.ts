export enum GameStartActionType {
    START_GAME = "START_GAME",
    END_GAME = "END_GAME",
}

interface GameStartActionStart {
    type: GameStartActionType.START_GAME;
}

interface GameStartActionEnd {
    type: GameStartActionType.END_GAME;
}

export const startGame = () => ({
    type: GameStartActionType.START_GAME,
});

export const endGame = () => ({
    type: GameStartActionType.END_GAME,
});

export type GameStartActions = GameStartActionStart | GameStartActionEnd;
