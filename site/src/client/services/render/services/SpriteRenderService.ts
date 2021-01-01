import { mat4 } from "gl-matrix";
import { ISyncedArrayRef, SyncedArray } from "../../../util/array/SyncedArray";
import { compileSpriteShader } from "../shaders/Shaders";
import { CompiledShader } from "../shaders/types";
import { Sprite } from "../types/RenderInterface";
import { RenderItem, RenderItemInterface } from "../types/RenderItemInterface";
import {
    BackgroundRenderService,
    BackgroundShaderPositions,
} from "./BackgroundRenderService";

export class SpriteRenderService implements RenderItemInterface<Sprite> {
    private gl: WebGLRenderingContext;

    private spriteArray: SyncedArray<Sprite>;

    private shader: CompiledShader;

    private positionBuffer: WebGLBuffer;
    private spritesheet: WebGLTexture;
    private translationBuffer: WebGLBuffer;
    private textureBuffer: WebGLBuffer;
    private colourBuffer: WebGLBuffer;

    private positions: Float32Array;
    private translations: Float32Array;
    private texture: Float32Array;
    private colours: Float32Array;

    private modelViewMatrix: mat4;
    private projectionMatrix: mat4;

    private backgroundShaderPositions: BackgroundShaderPositions;

    public constructor(
        private backgroundRenderService: BackgroundRenderService
    ) {}

    public init(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.shader = compileSpriteShader(gl);
        this.backgroundShaderPositions = this.shader.uniform as any;

        this.spriteArray = new SyncedArray({
            onReconstruct: (array: Array<ISyncedArrayRef<Sprite>>) =>
                this.onArrayReconstruct(gl, array),
            onUpdate: (array: Array<ISyncedArrayRef<Sprite>>) =>
                this.onArrayUpdate(gl),
            onInjection: (index: number, ref: ISyncedArrayRef<Sprite>) =>
                this.onInjection(index, ref.obj),
        });

        this.positionBuffer = gl.createBuffer();
        this.translationBuffer = gl.createBuffer();
        this.textureBuffer = gl.createBuffer();
        this.colourBuffer = gl.createBuffer();
    }

    public draw() {
        this.spriteArray.sync();
        if (this.spriteArray.getArray().length === 0) {
            return;
        }

        const numComponents = 3;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(
            this.shader.attribute.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        this.gl.enableVertexAttribArray(this.shader.attribute.vertexPosition);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.translationBuffer);
        this.gl.vertexAttribPointer(
            this.shader.attribute.vertexTranslation,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        this.gl.enableVertexAttribArray(
            this.shader.attribute.vertexTranslation
        );

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourBuffer);
        this.gl.vertexAttribPointer(
            this.shader.attribute.colourOverride,
            4,
            type,
            normalize,
            stride,
            offset
        );
        this.gl.enableVertexAttribArray(this.shader.attribute.colourOverride);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.vertexAttribPointer(
            this.shader.attribute.texturePosition,
            2,
            type,
            normalize,
            stride,
            offset
        );
        this.gl.enableVertexAttribArray(this.shader.attribute.texturePosition);

        this.gl.useProgram(this.shader.shaderId);
        this.backgroundRenderService.applyShaderArguments(
            this.backgroundShaderPositions
        );

        this.gl.uniformMatrix4fv(
            this.shader.uniform.projectionMatrix,
            false,
            this.projectionMatrix
        );
        this.gl.uniformMatrix4fv(
            this.shader.uniform.modelMatrix,
            false,
            this.modelViewMatrix
        );

        this.gl.activeTexture(this.gl.TEXTURE0);
        // Bind the texture to texture unit 0
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.spritesheet);
        // Tell the shader we bound the texture to texture unit 0
        this.gl.uniform1i(this.shader.attribute.textureSampler, 0);

        const vertexCount = this.positions.length / 3;
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
    }

    public createItem(param: Sprite) {
        return {
            renderId: this.spriteArray.createItem(param),
        };
    }

    public updateItem(ref: RenderItem, param: Partial<Sprite>) {
        this.spriteArray.updateItem(ref.renderId, param);
    }

    public freeItem(ref: RenderItem) {
        this.spriteArray.freeItem(ref.renderId);
    }

    public attachSpritesheet(spritesheet: WebGLTexture) {
        this.spritesheet = spritesheet;
    }

    public attachViewMatrices(modelViewMatrix: mat4, projectionMatrix: mat4) {
        this.modelViewMatrix = modelViewMatrix;
        this.projectionMatrix = projectionMatrix;
    }

    private onArrayReconstruct(
        gl: WebGLRenderingContext,
        array: Array<ISyncedArrayRef<Sprite>>
    ) {
        const length = array.length;

        this.positions = new Float32Array(
            new Array(length * 2 * 3 * 3).fill(0)
        );

        this.texture = new Float32Array(new Array(length * 2 * 3 * 2).fill(0));

        this.translations = new Float32Array(
            new Array(length * 2 * 3 * 3).fill(0)
        );

        this.colours = new Float32Array(new Array(length * 2 * 3 * 4).fill(0));

        for (let i = 0; i < array.length; i++) {
            this.onInjection(i, array[i].obj);
        }

        this.onArrayUpdate(gl);
    }

    private onArrayUpdate(gl: WebGLRenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.translationBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.translations, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texture, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colours, gl.DYNAMIC_DRAW);
    }

    private onInjection(index: number, sprite: Sprite) {
        const t1i = index * 2 * 3 * 3;
        const tex = index * 2 * 3 * 2;
        const col = index * 2 * 3 * 4;

        const halfWidth = sprite.size[0] / 2;
        const halfHeight = sprite.size[1] / 2;
        const x = sprite.position[0] * 2;
        const y = sprite.height;
        const z = sprite.position[1] * 2;

        this.positions[t1i] = -halfWidth;
        this.positions[t1i + 1] = halfHeight;
        this.positions[t1i + 2] = 0;

        this.positions[t1i + 3] = halfWidth;
        this.positions[t1i + 4] = halfHeight;
        this.positions[t1i + 5] = 0;

        this.positions[t1i + 6] = -halfWidth;
        this.positions[t1i + 7] = -halfHeight;
        this.positions[t1i + 8] = 0;

        this.positions[t1i + 9] = +halfWidth;
        this.positions[t1i + 10] = halfHeight;
        this.positions[t1i + 11] = 0;

        this.positions[t1i + 12] = +halfWidth;
        this.positions[t1i + 13] = -halfHeight;
        this.positions[t1i + 14] = 0;

        this.positions[t1i + 15] = -halfWidth;
        this.positions[t1i + 16] = -halfHeight;
        this.positions[t1i + 17] = 0;

        //

        this.translations[t1i] = x;
        this.translations[t1i + 1] = y;
        this.translations[t1i + 2] = z;

        this.translations[t1i + 3] = x;
        this.translations[t1i + 4] = y;
        this.translations[t1i + 5] = z;

        this.translations[t1i + 6] = x;
        this.translations[t1i + 7] = y;
        this.translations[t1i + 8] = z;

        this.translations[t1i + 9] = x;
        this.translations[t1i + 10] = y;
        this.translations[t1i + 11] = z;

        this.translations[t1i + 12] = x;
        this.translations[t1i + 13] = y;
        this.translations[t1i + 14] = z;

        this.translations[t1i + 15] = x;
        this.translations[t1i + 16] = y;
        this.translations[t1i + 17] = z;

        const floatCorrection = 0.0001;
        const texX = sprite.texture.textureX + floatCorrection;
        const texY = sprite.texture.textureY + floatCorrection;
        const texWidth = sprite.texture.textureWidth - floatCorrection;
        const texHeight = sprite.texture.textureHeight - floatCorrection;

        // t1

        this.texture[tex] = texX;
        this.texture[tex + 1] = texY;

        this.texture[tex + 2] = texX + texWidth;
        this.texture[tex + 3] = texY;

        this.texture[tex + 4] = texX;
        this.texture[tex + 5] = texY + texHeight;

        // t2

        this.texture[tex + 6] = texX + texWidth;
        this.texture[tex + 7] = texY;

        this.texture[tex + 8] = texX + texWidth;
        this.texture[tex + 9] = texY + texHeight;

        this.texture[tex + 10] = texX;
        this.texture[tex + 11] = texY + texHeight;

        // T1
        this.colours[col] = sprite.shade.r;
        this.colours[col + 1] = sprite.shade.g;
        this.colours[col + 2] = sprite.shade.b;
        this.colours[col + 3] = sprite.shade.intensity;

        this.colours[col + 4] = sprite.shade.r;
        this.colours[col + 5] = sprite.shade.g;
        this.colours[col + 6] = sprite.shade.b;
        this.colours[col + 7] = sprite.shade.intensity;

        this.colours[col + 8] = sprite.shade.r;
        this.colours[col + 9] = sprite.shade.g;
        this.colours[col + 10] = sprite.shade.b;
        this.colours[col + 11] = sprite.shade.intensity;

        // T2
        this.colours[col + 12] = sprite.shade.r;
        this.colours[col + 13] = sprite.shade.g;
        this.colours[col + 14] = sprite.shade.b;
        this.colours[col + 15] = sprite.shade.intensity;

        this.colours[col + 16] = sprite.shade.r;
        this.colours[col + 17] = sprite.shade.g;
        this.colours[col + 18] = sprite.shade.b;
        this.colours[col + 19] = sprite.shade.intensity;

        this.colours[col + 20] = sprite.shade.r;
        this.colours[col + 21] = sprite.shade.g;
        this.colours[col + 22] = sprite.shade.b;
        this.colours[col + 23] = sprite.shade.intensity;
    }
}
