import { EnemyEventType } from "../../engine/events/EnemyEvents";
import { GameEvent } from "../../engine/events/Event";
import {
    GameStartActions,
    GameStartActionType,
} from "../actions/GameStartActions";

export interface GameStartState {
    showingMenu: boolean;
    showingFade: boolean;
    currentScore: number;
    bestScore?: number;
}

const initialGameStartState = {
    showingMenu: true,
    showingFade: true,
    currentScore: 0,
};

type GameStartEvents = GameEvent | GameStartActions;

export function gameStartReducer(
    state: GameStartState = initialGameStartState,
    action: GameStartEvents
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
    }
    return state;
}
