import { TimeControlledLoop } from "../util/time/TimeControlledLoop";
import { RenderState } from "./render/RenderState";
import { WorldState } from "./world/WorldState";

export interface GameState {
  loop: TimeControlledLoop;

  world: WorldState;
  render: RenderState;
}
