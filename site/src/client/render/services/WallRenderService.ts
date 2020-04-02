import { mat4 } from "gl-matrix";
import { RenderState } from "../../state/render/RenderState";
import { ISyncedArrayRef, SyncedArray } from "../../util/array/SyncedArray";
import { compileTextureRepeatShader } from "../shaders/Shaders";
import { Wall } from "../types/RenderInterface";
import { RenderItem, RenderItemInterface } from "../types/RenderItemInterface";

export class WallRenderService implements RenderItemInterface<Wall> {
    private wallArray: SyncedArray<Wall>;

    private shader: CompiledShader;

    private positionBuffer: WebGLBuffer;
    private spritesheet: WebGLTexture;
    private textureBuffer: WebGLBuffer;
    private textureStartBuffer: WebGLBuffer;
    private textureSizeBuffer: WebGLBuffer;

    private positions: Float32Array;
    private texture: Float32Array;
    private textureStart: Float32Array;
    private textureSize: Float32Array;

    private modelViewMatrix: mat4;
    private projectionMatrix: mat4;

    public init(renderState: RenderState) {
        const gl = renderState.screen.getOpenGL();

        this.shader = compileTextureRepeatShader(gl);

        this.wallArray = new SyncedArray({
            onReconstruct: (array: Array<ISyncedArrayRef<Wall>>) =>
                this.onArrayReconstruct(gl, array),
            onUpdate: (array: Array<ISyncedArrayRef<Wall>>) =>
                this.onArrayUpdate(gl),
            onInjection: (index: number, ref: ISyncedArrayRef<Wall>) =>
                this.onInjection(index, ref.obj),
        });

        this.positionBuffer = gl.createBuffer();
        this.textureBuffer = gl.createBuffer();
        this.textureStartBuffer = gl.createBuffer();
        this.textureSizeBuffer = gl.createBuffer();
    }

    public draw(renderState: RenderState) {
        this.wallArray.sync();
        if (this.wallArray.getArray().length === 0) {
            return;
        }

        const gl = renderState.screen.getOpenGL();

        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            this.shader.attribute.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(this.shader.attribute.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(
            this.shader.attribute.texturePosition,
            2,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(this.shader.attribute.texturePosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureStartBuffer);
        gl.vertexAttribPointer(
            this.shader.attribute.textureStart,
            2,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(this.shader.attribute.textureStart);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureSizeBuffer);
        gl.vertexAttribPointer(
            this.shader.attribute.textureSize,
            2,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(this.shader.attribute.textureSize);

        gl.useProgram(this.shader.shaderId);
        gl.uniformMatrix4fv(
            this.shader.uniform.projectionMatrix,
            false,
            this.projectionMatrix
        );
        gl.uniformMatrix4fv(
            this.shader.uniform.modelMatrix,
            false,
            this.modelViewMatrix
        );

        gl.activeTexture(gl.TEXTURE0);
        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.spritesheet);
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(this.shader.attribute.textureSampler, 0);

        const vertexCount = this.positions.length / 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    public createItem(param: Wall) {
        return {
            renderId: this.wallArray.createItem(param),
        };
    }

    public updateItem(ref: RenderItem, param: Partial<Wall>) {
        this.wallArray.updateItem(ref.renderId, param);
    }

    public freeItem(ref: RenderItem) {
        this.wallArray.freeItem(ref.renderId);
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
        array: Array<ISyncedArrayRef<Wall>>
    ) {
        const length = array.length;

        this.positions = new Float32Array(
            new Array(length * 2 * 3 * 3).fill(0)
        );
        this.texture = new Float32Array(new Array(length * 2 * 3 * 2).fill(0));
        this.textureStart = new Float32Array(
            new Array(length * 2 * 3 * 2).fill(0)
        );
        this.textureSize = new Float32Array(
            new Array(length * 2 * 3 * 2).fill(0)
        );

        for (let i = 0; i < array.length; i++) {
            this.onInjection(i, array[i].obj);
        }

        this.onArrayUpdate(gl);
    }

    private onArrayUpdate(gl: WebGLRenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texture, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureStartBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureStart, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureSizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.textureSize, gl.STATIC_DRAW);
    }

    private onInjection(index: number, wall: Wall) {
        const tex = index * 2 * 3 * 2;
        const t1i = index * 2 * 3 * 3;

        const {
            startPos,
            endPos,
            startHeight,
            startOffset,
            endHeight,
            endOffset,
            textureX,
            textureY,
            textureWidth,
            textureHeight,
            repeatWidth,
            repeatHeight,
        } = wall;

        this.positions[t1i] = startPos[0];
        this.positions[t1i + 1] = startHeight + startOffset;
        this.positions[t1i + 2] = startPos[1];

        this.positions[t1i + 3] = endPos[0];
        this.positions[t1i + 4] = endHeight + endOffset;
        this.positions[t1i + 5] = endPos[1];

        this.positions[t1i + 6] = startPos[0];
        this.positions[t1i + 7] = startOffset;
        this.positions[t1i + 8] = startPos[1];

        this.positions[t1i + 9] = startPos[0];
        this.positions[t1i + 10] = endOffset;
        this.positions[t1i + 11] = startPos[1];

        this.positions[t1i + 12] = endPos[0];
        this.positions[t1i + 13] = endHeight + endOffset;
        this.positions[t1i + 14] = endPos[1];

        this.positions[t1i + 15] = endPos[0];
        this.positions[t1i + 16] = endOffset;
        this.positions[t1i + 17] = endPos[1];

        this.texture[tex] = textureX;
        this.texture[tex + 1] = textureY;

        this.texture[tex + 2] = textureX + textureWidth;
        this.texture[tex + 3] = textureY;

        this.texture[tex + 4] = textureX;
        this.texture[tex + 5] = textureY + textureHeight;

        this.texture[tex + 6] = textureX;
        this.texture[tex + 7] = textureY + textureHeight;

        this.texture[tex + 8] = textureX + textureWidth;
        this.texture[tex + 9] = textureY;

        this.texture[tex + 10] = textureX + textureWidth;
        this.texture[tex + 11] = textureY + textureHeight;

        this.textureStart[tex] = textureX;
        this.textureStart[tex + 1] = textureY;

        this.textureStart[tex + 2] = textureX;
        this.textureStart[tex + 3] = textureY;

        this.textureStart[tex + 4] = textureX;
        this.textureStart[tex + 5] = textureY;

        this.textureStart[tex + 6] = textureX;
        this.textureStart[tex + 7] = textureY;

        this.textureStart[tex + 8] = textureX;
        this.textureStart[tex + 9] = textureY;

        this.textureStart[tex + 10] = textureX;
        this.textureStart[tex + 11] = textureY;

        this.textureSize[tex] = repeatWidth;
        this.textureSize[tex + 1] = repeatHeight;

        this.textureSize[tex + 2] = repeatWidth;
        this.textureSize[tex + 3] = repeatHeight;

        this.textureSize[tex + 4] = repeatWidth;
        this.textureSize[tex + 5] = repeatHeight;

        this.textureSize[tex + 6] = repeatWidth;
        this.textureSize[tex + 7] = repeatHeight;

        this.textureSize[tex + 8] = repeatWidth;
        this.textureSize[tex + 9] = repeatHeight;

        this.textureSize[tex + 10] = repeatWidth;
        this.textureSize[tex + 11] = repeatHeight;
    }
}
