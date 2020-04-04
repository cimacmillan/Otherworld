import { mat4 } from "gl-matrix";
import { ResourceManager } from "../resources/ResourceManager";
import { Camera } from "../types";
import { FloorRenderService } from "./services/FloorRenderService";
import { SpriteRenderService } from "./services/SpriteRenderService";
import { WallRenderService } from "./services/WallRenderService";
import { RenderInterface } from "./types/RenderInterface";

export class RenderService implements RenderInterface {
    public spriteRenderService: SpriteRenderService;
    public wallRenderService: WallRenderService;
    public floorRenderService: FloorRenderService;
    private gl: WebGLRenderingContext;

    private camera: Camera;

    public constructor(private resourceManager: ResourceManager) {
        this.spriteRenderService = new SpriteRenderService();
        this.wallRenderService = new WallRenderService();
        this.floorRenderService = new FloorRenderService();
    }

    public init(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.spriteRenderService.init(gl);
        this.spriteRenderService.attachSpritesheet(
            this.resourceManager.sprite.getTexture()
        );
        this.wallRenderService.init(gl);
        this.wallRenderService.attachSpritesheet(this.resourceManager.floor);
        this.floorRenderService.init(gl);
        this.floorRenderService.attachSpritesheet(this.resourceManager.floor);
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

        this.clearScreen();
        this.spriteRenderService.draw();
        this.wallRenderService.draw();
        this.floorRenderService.draw();
    }

    public attachCamera(camera: Camera) {
        this.camera = camera;
    }

    private clearScreen() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
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

        mat4.rotateY(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            this.camera.angle
        ); // amount to translate

        mat4.translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            [
                -this.camera.position.x,
                -this.camera.height,
                -this.camera.position.y,
            ]
        ); // amount to translate

        return { modelViewMatrix, projectionMatrix };
    }
}
