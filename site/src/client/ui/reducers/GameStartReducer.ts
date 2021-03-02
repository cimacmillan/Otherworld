import { Reducer } from "@cimacmillan/refunc";
import { Actions } from "../../Actions";

export interface GameStartState {
    showingMenu: boolean;
    showingFade: boolean;
    gameLoadPercentage: number;
    fps: number;
}

export const gameStartReducer: Reducer<GameStartState, Actions> = {
    state: {
        showingMenu: true,
        showingFade: true,
        gameLoadPercentage: 0,
        fps: 0,
    },
    actions: {
        startGame: (state: GameStartState) => ({
            ...state,
            showingMenu: false,
            showingFade: false,
        }),
        fadeBackground: (state: GameStartState) => ({
            ...state,
            showingFade: true,
        }),
        fadeMenu: (state: GameStartState) => ({
            ...state,
            showingMenu: true,
        }),
        setGameLoadPercentage: (state: GameStartState, x: number) => ({
            ...state,
            gameLoadPercentage: x,
        }),
        setGameFPS: (state: GameStartState, x: number) => ({
            ...state,
            fps: x,
        }),
    },
};
