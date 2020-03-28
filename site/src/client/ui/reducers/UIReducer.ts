import { combineReducers } from "redux";

export interface UIState {
  text: string;
}

export interface State {
  uiState: UIState;
}

export const SEND_MESSAGE = "SEND_MESSAGE";
export const DELETE_MESSAGE = "DELETE_MESSAGE";

interface SendMessageAction {
  type: typeof SEND_MESSAGE;
  payload: string;
}

interface DeleteMessageAction {
  type: typeof DELETE_MESSAGE;
  meta: {
    timestamp: number;
  };
}

export type ChatActionTypes = SendMessageAction | DeleteMessageAction;

const initialUIState = {
  text: "Hello WOrl",
};

function uiReducer(state: UIState = initialUIState, action: ChatActionTypes) {
  return state;
}

export const reducers = combineReducers({
  uiState: uiReducer,
});
