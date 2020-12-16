import { mat4 } from "gl-matrix";
import { SpriteSheets } from "../../resources/manifests/Sprites";
import { ResourceManager } from "../../resources/ResourceManager";
import { Camera } from "../../types";
import { BackgroundRenderService } from "./services/BackgroundRenderService";
import { FloorRenderService } from "./services/FloorRenderService";
import { ParticleRenderService } from "./services/ParticleRenderService";
import { ScreenShakeService } from "./services/ScreenShakeService";
import { SpriteRenderService } from "./services/SpriteRenderService";
import { WallRenderService } from "./services/WallRenderService";
import { RenderInterface } from "./types/RenderInterface";

export class RenderService implements RenderInterface {
    public spriteRenderService: SpriteRenderService;
    public wallRenderService: WallRenderService;
    public floorRenderService: FloorRenderService;
    public screenShakeService: ScreenShakeService;
    public backgroundRenderService: BackgroundRenderService;
    public particleRenderService: ParticleRenderService;
    private gl: WebGLRenderingContext;

    private camera: Camera;

    public constructor(private resourceManager: ResourceManager) {
        this.backgroundRenderService = new BackgroundRenderService();
        this.spriteRenderService = new SpriteRenderService(
            this.backgroundRenderService
        );
        this.wallRenderService = new WallRenderService(
            this.backgroundRenderService
        );
        this.floorRenderService = new FloorRenderService(
            this.backgroundRenderService
        );
        this.screenShakeService = new ScreenShakeService();
        this.particleRenderService = new ParticleRenderService(
            this.backgroundRenderService
        );
    }

    public init(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.backgroundRenderService.init(gl);
        this.spriteRenderService.init(gl);
        this.spriteRenderService.attachSpritesheet(
            this.resourceManager.manifest.spritesheets[
                SpriteSheets.SPRITE
            ].getTexture()
        );
        this.wallRenderService.init(gl);
        this.wallRenderService.attachSpritesheet(
            this.resourceManager.manifest.spritesheets[
                SpriteSheets.SPRITE
            ].getTexture()
        );
        this.floorRenderService.init(gl);
        this.floorRenderService.attachSpritesheet(
            this.resourceManager.manifest.spritesheets[
                SpriteSheets.SPRITE
            ].getTexture()
        );
        this.particleRenderService.init(gl);
    }

    public draw() {
        if (!this.camera) {
            return;
        }

        const {
            modelViewMatrix,
            projectionMatrix,
        } = this.calculateCameraMatrices();
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
        this.particleRenderService.attachViewMatrices(
            modelViewMatrix,
            projectionMatrix
        );

        this.backgroundRenderService.draw();
        this.screenShakeService.update();
        this.particleRenderService.draw();
        this.spriteRenderService.draw();
        this.wallRenderService.draw();
        this.floorRenderService.draw();
    }

    public attachCamera(camera: Camera) {
        this.camera = camera;
    }

    private calculateCameraMatrices() {
        const fieldOfView = (this.camera.fov * Math.PI) / 180; // in radians

        const projectionMatrix = mat4.create();
        const modelViewMatrix = mat4.create();

        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            this.camera.aspectRatio,
            this.camera.zNear,
            this.camera.zFar
        );

        mat4.rotateY(modelViewMatrix, modelViewMatrix, this.camera.angle);

        mat4.translate(modelViewMatrix, modelViewMatrix, [
            -this.camera.position.x,
            -this.camera.height,
            -this.camera.position.y,
        ]);

        this.screenShakeService.applyToMatrices(modelViewMatrix);

        return { modelViewMatrix, projectionMatrix };
    }
}
