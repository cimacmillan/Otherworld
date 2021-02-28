import { Actions } from "../../Actions";
import { GameReducer } from "../../util/engine/Store";

export interface GameStartState {
    showingMenu: boolean;
    showingFade: boolean;
    gameLoadPercentage: number;
    fps: number;
}

let initialGameStartState: GameStartState = {
    showingMenu: true,
    showingFade: true,
    gameLoadPercentage: 0,
    fps: 0,
};

export const gameStartReducer: GameReducer<GameStartState, Actions> = {
    getState: () => initialGameStartState,
    actions: {
        startGame: () => {
            initialGameStartState = {
                ...initialGameStartState,
                showingMenu: false,
                showingFade: false,
            };
        },
        fadeBackground: () => {
            initialGameStartState = {
                ...initialGameStartState,
                showingFade: true,
            };
        },
        fadeMenu: () => {
            initialGameStartState = {
                ...initialGameStartState,
                showingMenu: true,
            };
        },
        setGameLoadPercentage: (x: number) => {
            initialGameStartState = {
                ...initialGameStartState,
                gameLoadPercentage: x,
            };
        },
        setGameFPS: (x: number) => {
            initialGameStartState = {
                ...initialGameStartState,
                fps: x,
            };
        },
    },
};
