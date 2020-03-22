import { TimeControlledLoop } from "../util/time/TimeControlledLoop";
import { AudioState } from "./audio/AudioState";
import { RenderState } from "./render/RenderState";
import { WorldState } from "./world/WorldState";

export interface GameState {
  loop: TimeControlledLoop;

  world: WorldState;
  render: RenderState;
  audio: AudioState;
}
