import React = require("react");
import { HEIGHT, TARGET_MILLIS, WIDTH } from "./Config";
import { FlowerLogicComponent } from "./engine/components/FlowerLogicComponent";
import { SpriteLogicComponent } from "./engine/components/SpriteLogicComponent";
import { SpriteRenderComponent } from "./engine/components/SpriteRenderComponent";
import { Entity } from "./engine/Entity";
import { EventRouter, GameEventSource } from "./engine/EventRouter";
import { GameEvent } from "./engine/events/Event";
import { World } from "./engine/World";
import { initialiseInput, updateInput } from "./Input";
import { CanvasComponent } from "./render";
import { RenderService, ScreenBuffer } from "./render";
import { ResourceManager } from "./resources/ResourceManager";
import { ServiceLocator } from "./services/ServiceLocator";
import { GameState } from "./state/GameState";
import { Texture } from "./types";
import { initialiseCamera, initialiseMap } from "./util/loader/MapLoader";
import { loadTextureFromURL } from "./util/loader/TextureLoader";
import { getTextureCoordinate } from "./util/math";
import { AudioService, loadSound, playSound } from "./util/sound/AudioService";
import { logFPS, setFPSProportion } from "./util/time/GlobalFPSController";
import { TimeControlledLoop } from "./util/time/TimeControlledLoop";

export class Game {
  private gameState: GameState;
  private serviceLocator: ServiceLocator;
  private initialised: boolean = false;

  public async init(
    openGL: WebGLRenderingContext,
    uiListener: (event: GameEvent) => void
  ) {
    const audioContext = new AudioContext();

    const resourceManager = new ResourceManager();
    await resourceManager.load(openGL, audioContext);

    const router = new EventRouter();
    router.attachEventListener(GameEventSource.UI, uiListener);

    const world = new World((event: GameEvent) =>
      router.routeEvent(GameEventSource.WORLD, event)
    );
    router.attachEventListener(GameEventSource.WORLD, (event: GameEvent) =>
      world.emitIntoWorld(event)
    );

    this.serviceLocator = new ServiceLocator(
      resourceManager,
      world,
      new RenderService(resourceManager),
      new AudioService(audioContext),
      router
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

    for (let i = 0; i < 10000; i++) {
      const sprite = new Entity(
        this.serviceLocator,
        new SpriteRenderComponent(),
        new FlowerLogicComponent()
      );
      world.addEntity(sprite);
    }

    const floorTexture = getTextureCoordinate(32, 64, 32, 32, 0, 32);
    this.serviceLocator.getRenderService().floorRenderService.createItem({
      startPos: [-10, -10],
      endPos: [10, 10],
      height: 0,
      textureX: floorTexture.textureX,
      textureY: floorTexture.textureY,
      textureWidth: 20,
      textureHeight: 20,
      repeatWidth: floorTexture.textureWidth,
      repeatHeight: floorTexture.textureHeight,
    });

    const wallTexture = getTextureCoordinate(32, 64, 32, 32, 0, 0);
    this.serviceLocator.getRenderService().wallRenderService.createItem({
      startPos: [-10, -10],
      endPos: [10, -10],
      startHeight: 1,
      endHeight: 1,
      startOffset: 0,
      endOffset: 0,
      textureX: wallTexture.textureX,
      textureY: wallTexture.textureY,
      textureWidth: 20,
      textureHeight: wallTexture.textureHeight,
      repeatWidth: wallTexture.textureWidth,
      repeatHeight: wallTexture.textureHeight,
    });

    this.serviceLocator.getRenderService().wallRenderService.createItem({
      startPos: [10, -10],
      endPos: [10, 10],
      startHeight: 1,
      endHeight: 1,
      startOffset: 0,
      endOffset: 0,
      textureX: wallTexture.textureX,
      textureY: wallTexture.textureY,
      textureWidth: 20,
      textureHeight: wallTexture.textureHeight,
      repeatWidth: wallTexture.textureWidth,
      repeatHeight: wallTexture.textureHeight,
    });

    this.serviceLocator.getRenderService().wallRenderService.createItem({
      startPos: [10, 10],
      endPos: [-10, 10],
      startHeight: 1,
      endHeight: 1,
      startOffset: 0,
      endOffset: 0,
      textureX: wallTexture.textureX,
      textureY: wallTexture.textureY,
      textureWidth: 20,
      textureHeight: wallTexture.textureHeight,
      repeatWidth: wallTexture.textureWidth,
      repeatHeight: wallTexture.textureHeight,
    });

    this.serviceLocator.getRenderService().wallRenderService.createItem({
      startPos: [-10, 10],
      endPos: [-10, -10],
      startHeight: 1,
      endHeight: 1,
      startOffset: 0,
      endOffset: 0,
      textureX: wallTexture.textureX,
      textureY: wallTexture.textureY,
      textureWidth: 20,
      textureHeight: wallTexture.textureHeight,
      repeatWidth: wallTexture.textureWidth,
      repeatHeight: wallTexture.textureHeight,
    });

    // this.serviceLocator.getAudioService().play(this.serviceLocator.getResourceManager().intro);

    this.gameState.loop.start();

    this.initialised = true;
  }

  public isInitialised() {
    return this.initialised;
  }

  public getServiceLocator() {
    return this.serviceLocator;
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
