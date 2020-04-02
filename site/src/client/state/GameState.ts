import { TimeControlledLoop } from "../util/time/TimeControlledLoop";
import { RenderState } from "./render/RenderState";

export interface GameState {
    loop: TimeControlledLoop;
    render: RenderState;
}
