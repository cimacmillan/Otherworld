import { mat4, vec3 } from "gl-matrix";
import { ISyncedArrayRef, SyncedArray } from "../../../util/array/SyncedArray";
import { compileSpriteShader, compileVoxelShader } from "../shaders/Shaders";
import { CompiledShader } from "../shaders/types";
import { Sprite } from "../types/RenderInterface";
import { RenderItem, RenderItemInterface } from "../types/RenderItemInterface";
import {
    BackgroundRenderService,
    BackgroundShaderPositions,
} from "./BackgroundRenderService";

interface VoxelObject {
    position: vec3;
    colour: vec3;
}

export class VoxelRenderService implements RenderItemInterface<VoxelObject> {
    private gl: WebGLRenderingContext;

    private objectArray: SyncedArray<VoxelObject>;

    private shader: CompiledShader;

    private positionBuffer: WebGLBuffer;
    private colourBuffer: WebGLBuffer;

    private positions: Float32Array;
    private colours: Float32Array;

    private modelViewMatrix: mat4;
    private projectionMatrix: mat4;

    private backgroundShaderPositions: BackgroundShaderPositions;

    public constructor(
        private backgroundRenderService: BackgroundRenderService
    ) {}

    public init(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.shader = compileVoxelShader(gl);
        this.backgroundShaderPositions = this.shader.uniform as any;

        this.objectArray = new SyncedArray({
            onReconstruct: (array: Array<ISyncedArrayRef<VoxelObject>>) =>
                this.onArrayReconstruct(gl, array),
            onUpdate: (array: Array<ISyncedArrayRef<VoxelObject>>) =>
                this.onArrayUpdate(gl),
            onInjection: (index: number, ref: ISyncedArrayRef<VoxelObject>) =>
                this.onInjection(index, ref.obj),
        });

        this.positionBuffer = gl.createBuffer();
        this.colourBuffer = gl.createBuffer();

        const x = 379.50 / 20;
        const y = 671.84 / 20;
        const h = 0.5;
        this.createItem({
            position: vec3.fromValues(x, h, y - 1),
            colour: vec3.fromValues(0, 0, 1)
        });
    }

    public draw() {
        this.objectArray.sync();
        if (this.objectArray.getArray().length === 0) {
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

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourBuffer);
        this.gl.vertexAttribPointer(
            this.shader.attribute.colourOverride,
            3,
            type,
            normalize,
            stride,
            offset
        );
        this.gl.enableVertexAttribArray(this.shader.attribute.colourOverride);

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

        const vertexCount = this.positions.length / 3;
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
    }

    public createItem(param: VoxelObject) {
        return {
            renderId: this.objectArray.createItem(param),
        };
    }

    public updateItem(ref: RenderItem, param: Partial<VoxelObject>) {
        this.objectArray.updateItem(ref.renderId, param);
    }

    public freeItem(ref: RenderItem) {
        this.objectArray.freeItem(ref.renderId);
    }

    public attachViewMatrices(modelViewMatrix: mat4, projectionMatrix: mat4) {
        this.modelViewMatrix = modelViewMatrix;
        this.projectionMatrix = projectionMatrix;
    }

    private onArrayReconstruct(
        gl: WebGLRenderingContext,
        array: Array<ISyncedArrayRef<VoxelObject>>
    ) {
        const length = array.length;

        this.positions = new Float32Array(
            new Array(length * 2 * 3 * 3).fill(0)
        );

        this.colours = new Float32Array(new Array(length * 2 * 3 * 3).fill(0));

        for (let i = 0; i < array.length; i++) {
            this.onInjection(i, array[i].obj);
        }

        this.onArrayUpdate(gl);
    }

    private onArrayUpdate(gl: WebGLRenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colours, gl.DYNAMIC_DRAW);
    }

    private onInjection(index: number, object: VoxelObject) {
        const { position, colour } = object;
        const [r, g, b] = colour;
        
        const t1i = index * 2 * 3 * 3;
        const col = index * 2 * 3 * 3;

        const halfWidth = 0.2;
        const halfHeight = 0.2;
        const x = position[0];
        const y = position[1];
        const z = position[2];

        // T1
        this.positions[t1i] = -halfWidth + x;
        this.positions[t1i + 1] = halfHeight + y;
        this.positions[t1i + 2] = z;

        this.positions[t1i + 3] = halfWidth + x;
        this.positions[t1i + 4] = halfHeight + y;
        this.positions[t1i + 5] = z;

        this.positions[t1i + 6] = -halfWidth + x;
        this.positions[t1i + 7] = -halfHeight + y;
        this.positions[t1i + 8] = z;

        // T2
        this.positions[t1i + 9] = +halfWidth + x;
        this.positions[t1i + 10] = halfHeight + y;
        this.positions[t1i + 11] = z;

        this.positions[t1i + 12] = +halfWidth + x;
        this.positions[t1i + 13] = -halfHeight + y;
        this.positions[t1i + 14] = z;

        this.positions[t1i + 15] = -halfWidth + x;
        this.positions[t1i + 16] = -halfHeight + y;
        this.positions[t1i + 17] = z;

        // T1
        this.colours[col] = r;
        this.colours[col + 1] = g;
        this.colours[col + 2] = b;

        this.colours[col + 3] = r;
        this.colours[col + 4] = g;
        this.colours[col + 5] = b;

        this.colours[col + 6] = r;
        this.colours[col + 7] = g;
        this.colours[col + 8] = b;

        // T2
        this.colours[col + 9] = r;
        this.colours[col + 10] = g;
        this.colours[col + 11] = b;

        this.colours[col + 12] = r;
        this.colours[col + 13] = g;
        this.colours[col + 14] = b;

        this.colours[col + 15] = r;
        this.colours[col + 16] = g;
        this.colours[col + 17] = b;
    }
}
