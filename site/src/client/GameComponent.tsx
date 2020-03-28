import React = require("react");
import { initialiseInput, updateInput } from "./Input";
import { RenderService, ScreenBuffer } from "./render";
import { CanvasComponent } from "./render";
import { ResourceManager } from "./resources/ResourceManager";
import { GameState } from "./state/GameState";
import { Texture } from "./types";
import { initialiseCamera, initialiseMap } from "./util/loader/MapLoader";
import { loadTextureFromURL } from "./util/loader/TextureLoader";
import { loadSound, playSound, AudioService } from "./util/sound/AudioService";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";
import { Game } from "./Game";
import UIContainer from "./ui/UIContainer";
import { GameEvent } from "./engine/events/Event";

const DOM_WIDTH = 1280;
const DOM_HEIGHT = 720;
const RES_DIV = 4;
const WIDTH = DOM_WIDTH / RES_DIV;
const HEIGHT = DOM_HEIGHT / RES_DIV;

export interface GameComponentProps {
  game: Game;
  worldDispatch: (event: GameEvent) => void;
}

export class GameComponent extends React.Component<GameComponentProps> {
  public async componentDidMount() {
    this.props.game.init(
      (this.refs.main_canvas as CanvasComponent).getOpenGL(),
      this.props.worldDispatch
    );
  }

  public render() {
    return (
      <>
        <UIContainer game={this.props.game} />
        <CanvasComponent
          ref="main_canvas"
          id={"main_canvas"}
          dom_width={DOM_WIDTH}
          dom_height={DOM_HEIGHT}
          width={WIDTH}
          height={HEIGHT}
          resolution={RES_DIV}
        />
      </>
    );
  }
}
