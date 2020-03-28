import * as glm from "gl-matrix";
import { mat4 } from "gl-matrix";
import { ResourceManager } from "../resources/ResourceManager";
import { RenderState } from "../state/render/RenderState";
import { getTextureCoordinate } from "../util/math/Basic";
import { SpriteRenderService } from "./services/SpriteRenderService";
import { WallRenderService } from "./services/WallRenderService";
import { RenderInterface } from "./types/RenderInterface";
import { FloorRenderService } from "./services/FloorRenderService";
import { render } from "react-dom";

export class RenderService implements RenderInterface {
  public spriteRenderService: SpriteRenderService;
  public wallRenderService: WallRenderService;
  public floorRenderService: FloorRenderService;

  private count = 3000;
  private sqr = Math.floor(Math.sqrt(this.count));

  private time = 0;

  public constructor(private resourceManager: ResourceManager) {
    this.spriteRenderService = new SpriteRenderService();
    this.wallRenderService = new WallRenderService();
    this.floorRenderService = new FloorRenderService();
  }

  public init(renderState: RenderState) {
    this.spriteRenderService.init(renderState);
    this.spriteRenderService.attachSpritesheet(this.resourceManager.sprite);
    this.wallRenderService.init(renderState);
    this.wallRenderService.attachSpritesheet(this.resourceManager.wall);
    this.floorRenderService.init(renderState);
    this.floorRenderService.attachSpritesheet(this.resourceManager.floor);
  }

  public draw(renderState: RenderState) {
    const { modelViewMatrix, projectionMatrix } = this.createCameraMatrices(
      renderState
    );
    this.spriteRenderService.attachViewMatrices(
      modelViewMatrix,
      projectionMatrix
    );
    this.wallRenderService.attachViewMatrices(
      modelViewMatrix,
      projectionMatrix
    );
    this.floorRenderService.attachViewMatrices(
      modelViewMatrix,
      projectionMatrix
    );

    this.clearScreen(renderState);
    this.spriteRenderService.draw(renderState);
    this.wallRenderService.draw(renderState);
    this.floorRenderService.draw(renderState);
  }

  private clearScreen(renderState: RenderState) {
    const gl = renderState.screen.getOpenGL();
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    // gl.enable(gl.BLEND);
    // gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  private createCameraMatrices(
    renderState: RenderState
  ): { modelViewMatrix: mat4; projectionMatrix: mat4 } {
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = 1280 / 720;
    const zNear = 0.1;
    const zFar = 10000.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();

    mat4.rotateY(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      renderState.camera.angle
    ); // amount to translate

    mat4.translate(
      modelViewMatrix, // destination matrix
      modelViewMatrix, // matrix to translate
      [
        -renderState.camera.position.x,
        -renderState.camera.height,
        -renderState.camera.position.y,
      ]
    ); // amount to translate

    return { modelViewMatrix, projectionMatrix };
  }
}
