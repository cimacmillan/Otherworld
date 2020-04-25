export enum GameStartActionType {
    START_GAME = "START_GAME",
}

interface GameStartActionStart {
    type: GameStartActionType.START_GAME;
}

export const startGame = () => ({
    type: GameStartActionType.START_GAME,
});

export type GameStartActions = GameStartActionStart;
