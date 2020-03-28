import React = require("react");
import { initialiseInput, updateInput } from "./Input";
import { RenderService, ScreenBuffer } from "./render";
import { CanvasComponent } from "./render";
import { ResourceManager } from "./resources/ResourceManager";
import { GameState } from "./state/GameState";
import { Texture } from "./types";
import { initialiseCamera, initialiseMap } from "./util/loader/MapLoader";
import { loadTextureFromURL } from "./util/loader/TextureLoader";
import { loadSound, playSound, Sound } from "./util/sound/Sound";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";
import { ServiceLocator } from "./services/ServiceLocator";
import { World } from "./engine/World";
import { Entity } from "./engine/Entity";
import { SpriteRenderComponent } from "./engine/components/SpriteRenderComponent";
import { SpriteLogicComponent } from "./engine/components/SpriteLogicComponent";

const DOM_WIDTH = 1280;
const DOM_HEIGHT = 720;
const RES_DIV = 4;
const WIDTH = DOM_WIDTH / RES_DIV;
const HEIGHT = DOM_HEIGHT / RES_DIV;

const TARGET_FPS = 60;
const TARGET_MILLIS = Math.floor(1000 / TARGET_FPS);

export class GameComponent extends React.Component {
  private gameState: GameState;
  private resourceManager: ResourceManager;

  private serviceLocator: ServiceLocator;

  public async componentDidMount() {
    this.resourceManager = new ResourceManager();
    await this.resourceManager.load(
      (this.refs.main_canvas as CanvasComponent).getOpenGL()
    );

    this.serviceLocator = new ServiceLocator(
      new World(),
      new RenderService(this.resourceManager)
    );

    this.initState();
  }

  public render() {
    return (
      <CanvasComponent
        ref="main_canvas"
        id={"main_canvas"}
        dom_width={DOM_WIDTH}
        dom_height={DOM_HEIGHT}
        width={WIDTH}
        height={HEIGHT}
        resolution={RES_DIV}
      />
    );
  }

  private initState = () => {
    initialiseInput();

    const screen = new ScreenBuffer(
      (this.refs.main_canvas as CanvasComponent).getOpenGL(),
      WIDTH,
      HEIGHT
    );

    const sound = new Sound();

    const loop = new TimeControlledLoop(TARGET_MILLIS, this.mainLoop);

    this.gameState = {
      loop,
      world: {
        map: initialiseMap(this.resourceManager),
      },
      audio: {
        sound,
      },
      render: {
        screen,
        camera: initialiseCamera(screen),
      },
    };

    this.serviceLocator.getRenderService().init(this.gameState.render);
    this.serviceLocator.getWorld().init();

    const world = this.serviceLocator.getWorld();
    const sprite = new Entity(
      new SpriteRenderComponent(this.serviceLocator),
      new SpriteLogicComponent(this.serviceLocator)
    );
    world.addEntity(sprite);

    // loadSound("audio/intro.mp3", (buffer) => {
    // setTimeout(
    // () => {
    // this.gameState.audio.sound.context.resume();
    // playSound(buffer, this.gameState.audio.sound);
    // }, 2000);
    // }, this.gameState.audio.sound);

    this.gameState.loop.start();
  };

  private update = () => {
    updateInput(this.gameState.render.camera);
    this.serviceLocator.getWorld().update();
  };

  private draw = () => {
    this.serviceLocator.getRenderService().draw(this.gameState.render);
  };

  private mainLoop = (
    instance: TimeControlledLoop,
    actualMilliseconds: number,
    actualProportion?: number
  ) => {
    logFPS();
    setFPSProportion(1 / actualProportion);

    this.update();
    this.draw();
  };
}
