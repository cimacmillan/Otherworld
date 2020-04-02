import { combineReducers } from "redux";
import { BallEventType } from "../../engine/events/BallEvents";
import { GameEvent } from "../../engine/events/Event";

export interface UIState {
	bounceCount: number;
}

export interface State {
	uiState: UIState;
}
const initialUIState = {
	bounceCount: 0,
};

function uiReducer(state: UIState = initialUIState, action: GameEvent) {
	switch (action.type) {
		case BallEventType.BOUNCE:
			return { bounceCount: state.bounceCount + 1 };
	}

	return state;
}

export const reducers = combineReducers({
	uiState: uiReducer,
});
