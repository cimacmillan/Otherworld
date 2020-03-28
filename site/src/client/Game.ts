import React = require("react");
import { SpriteLogicComponent } from "./engine/components/SpriteLogicComponent";
import { SpriteRenderComponent } from "./engine/components/SpriteRenderComponent";
import { Entity } from "./engine/Entity";
import { GameEvent } from "./engine/events/Event";
import { World } from "./engine/World";
import { initialiseInput, updateInput } from "./Input";
import { RenderService, ScreenBuffer } from "./render";
import { CanvasComponent } from "./render";
import { ResourceManager } from "./resources/ResourceManager";
import { ServiceLocator } from "./services/ServiceLocator";
import { GameState } from "./state/GameState";
import { Texture } from "./types";
import { initialiseCamera, initialiseMap } from "./util/loader/MapLoader";
import { loadTextureFromURL } from "./util/loader/TextureLoader";
import { AudioService, loadSound, playSound } from "./util/sound/AudioService";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";

const DOM_WIDTH = 1280;
const DOM_HEIGHT = 720;
const RES_DIV = 4;
const WIDTH = DOM_WIDTH / RES_DIV;
const HEIGHT = DOM_HEIGHT / RES_DIV;

const TARGET_FPS = 60;
const TARGET_MILLIS = Math.floor(1000 / TARGET_FPS);

export class Game {
  private gameState: GameState;
  private serviceLocator: ServiceLocator;
  private initialised: boolean = false;

  public async init(
    openGL: WebGLRenderingContext,
    worldDispatch: (event: GameEvent) => void
  ) {
    const audioContext = new AudioContext();

    const resourceManager = new ResourceManager();
    await resourceManager.load(openGL, audioContext);

    const world = new World(worldDispatch);
    this.serviceLocator = new ServiceLocator(
      resourceManager,
      world,
      new RenderService(resourceManager),
      new AudioService(audioContext)
    );

    initialiseInput();

    const screen = new ScreenBuffer(openGL, WIDTH, HEIGHT);

    const loop = new TimeControlledLoop(TARGET_MILLIS, this.mainLoop);

    this.gameState = {
      loop,
      render: {
        screen,
        camera: initialiseCamera(screen),
      },
    };

    this.serviceLocator
      .getAudioService()
      .attachCamera(this.gameState.render.camera);
    this.serviceLocator.getRenderService().init(this.gameState.render);
    this.serviceLocator.getWorld().init();

    for (let i = 0; i < 10; i++) {
      const sprite = new Entity(
        this.serviceLocator,
        new SpriteRenderComponent(),
        new SpriteLogicComponent()
      );
      world.addEntity(sprite);
    }

    this.serviceLocator.getRenderService().floorRenderService.createItem({
      startPos: [10, 10],
      endPos: [-10, -10],
      height: 0,
      textureX: 0,
      textureY: 0,
      textureWidth: 20,
      textureHeight: 20,
      repeatWidth: 1,
      repeatHeight: 1,
    });

    // this.serviceLocator.getAudioService().play(this.serviceLocator.getResourceManager().intro);

    this.gameState.loop.start();

    this.initialised = true;
  }

  public isInitialised() {
    return this.initialised;
  }

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
    logFPS((fps) => {
      console.log(
        `FPS: ${fps} EntityCount: ${
          this.serviceLocator.getWorld().getEntityArray().getArray().length
        }`
      );
    });
    setFPSProportion(1 / actualProportion);

    this.update();
    this.draw();
  };
}
