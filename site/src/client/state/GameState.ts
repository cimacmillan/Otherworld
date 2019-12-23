import { WorldState } from "./world/WorldState";
import { RenderState } from "./render/RenderState";
import { TimeControlledLoop } from "../util/time/TimeControlledLoop";
import { AudioState } from "./audio/AudioState";

export interface GameState {

    loop: TimeControlledLoop;

    world: WorldState;
    render: RenderState;
    audio: AudioState;
}

