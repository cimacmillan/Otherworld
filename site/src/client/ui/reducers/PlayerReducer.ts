import { Reducer } from "@cimacmillan/refunc";
import { Actions } from "../../Actions";

export interface PlayerReducerState {
    health?: { current: number, max: number}
}

export const playerReducer: Reducer<PlayerReducerState, Actions> = {
    state: {
    },
    actions: {
        onPlayerHealth: (state: PlayerReducerState, health: { current: number, max: number}) => ({
            ...state,
            health
        })
    },
};


