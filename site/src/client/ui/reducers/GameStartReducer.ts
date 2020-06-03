import { EnemyEventType } from "../../engine/events/EnemyEvents";
import { Actions } from "../actions/Actions";
import {
    GameStartActionType,
} from "../actions/GameStartActions";

export interface GameStartState {
    showingMenu: boolean;
    showingFade: boolean;
    currentScore: number;
    bestScore?: number;
    gameLoadPercentage: number;
}

const initialGameStartState = {
    showingMenu: true,
    showingFade: true,
    currentScore: 0,
    gameLoadPercentage: 0,
};

export function gameStartReducer(
    state: GameStartState = initialGameStartState,
    action: Actions
): GameStartState {
    switch (action.type) {
        case GameStartActionType.START_GAME:
            return {
                ...state,
                showingMenu: false,
                showingFade: false,
                currentScore: 0,
            };
        case GameStartActionType.FADE_BACKGROUND:
            return {
                ...state,
                showingFade: true,
            };
        case GameStartActionType.FADE_MENU:
            let bestScore = state.currentScore;
            if (state.bestScore && state.bestScore > state.currentScore) {
                bestScore = state.bestScore;
            }
            return {
                ...state,
                showingMenu: true,
                bestScore,
            };
        case EnemyEventType.ENEMY_KILLED:
            return {
                ...state,
                currentScore: state.currentScore + 1,
            };
        case GameStartActionType.SET_GAME_LOAD_PERCENTAGE:
            return {
                ...state,
                gameLoadPercentage: action.payload.percentage,
            };
    }
    return state;
}
