import { EnemyEventType } from "../../engine/events/EnemyEvents";
import { GameEvent } from "../../engine/events/Event";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import {
    GameStartActions,
    GameStartActionType,
} from "../actions/GameStartActions";

export interface GameStartState {
    showing: boolean;
    currentScore: number;
    bestScore?: number;
}

const initialGameStartState = {
    showing: true,
    currentScore: 0,
};

type GameStartEvents = GameEvent | GameStartActions;

export function gameStartReducer(
    state: GameStartState = initialGameStartState,
    action: GameStartEvents
) {
    switch (action.type) {
        case GameStartActionType.START_GAME:
            return {
                ...state,
                showing: false,
                currentScore: 0,
            };
        case PlayerEventType.PLAYER_KILLED:
            let bestScore = state.currentScore;
            if (state.bestScore && state.bestScore > state.currentScore) {
                bestScore = state.bestScore;
            }
            return {
                ...state,
                showing: true,
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
