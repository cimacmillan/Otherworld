import { mat4, vec3 } from "gl-matrix";
import { identity } from "lodash";
import { ISyncedArrayRef, SyncedArray } from "../../../util/array/SyncedArray";
import { compileSpriteShader, compileVoxelShader } from "../shaders/Shaders";
import { CompiledShader } from "../shaders/types";
import { Sprite } from "../types/RenderInterface";
import { RenderItem, RenderItemInterface } from "../types/RenderItemInterface";
import {
    BackgroundRenderService,
    BackgroundShaderPositions,
} from "./BackgroundRenderService";

interface Triangle {
    positions: [vec3, vec3, vec3];
    colour: vec3;
    transform?: mat4;
}

const IDENTITY = mat4.identity(mat4.create());

export class TriangleRenderService implements RenderItemInterface<Triangle> {
    private gl: WebGLRenderingContext;

    private objectArray: SyncedArray<Triangle>;

    private shader: CompiledShader;

    private positionBuffer: WebGLBuffer;
    private colourBuffer: WebGLBuffer;
    private transform0Buffer: WebGLBuffer;
    private transform1Buffer: WebGLBuffer;
    private transform2Buffer: WebGLBuffer;
    private transform3Buffer: WebGLBuffer;

    private positions: Float32Array;
    private colours: Float32Array;
    private transform0: Float32Array;
    private transform1: Float32Array;
    private transform2: Float32Array;
    private transform3: Float32Array;

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
            onReconstruct: (array: Array<ISyncedArrayRef<Triangle>>) =>
                this.onArrayReconstruct(gl, array),
            onUpdate: (array: Array<ISyncedArrayRef<Triangle>>) =>
                this.onArrayUpdate(gl),
            onInjection: (index: number, ref: ISyncedArrayRef<Triangle>) =>
                this.onInjection(index, ref.obj),
        });

        this.positionBuffer = gl.createBuffer();
        this.colourBuffer = gl.createBuffer();
        this.transform0Buffer = gl.createBuffer();
        this.transform1Buffer = gl.createBuffer();
        this.transform2Buffer = gl.createBuffer();
        this.transform3Buffer = gl.createBuffer();

        const x = 379.50 / 20;
        const y = 671.84 / 20;
        const h = 0.5;
        this.createItem({
            positions: 
                [
                    vec3.fromValues(x, h + 0.5, y - 2),
                    vec3.fromValues(x + 1, h + 0.5, y - 2),
                    vec3.fromValues(x, h - 0.5, y - 2)
                ],
            colour: vec3.fromValues(1, 1, 1),
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
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        this.gl.enableVertexAttribArray(this.shader.attribute.colourOverride);

        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transform0Buffer);
        // this.gl.vertexAttribPointer(
        //     this.shader.attribute.transform0,
        //     4,
        //     type,
        //     normalize,
        //     stride,
        //     offset
        // );
        // this.gl.enableVertexAttribArray(this.shader.attribute.transform0);

        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transform1Buffer);
        // this.gl.vertexAttribPointer(
        //     this.shader.attribute.transform1,
        //     4,
        //     type,
        //     normalize,
        //     stride,
        //     offset
        // );
        // this.gl.enableVertexAttribArray(this.shader.attribute.transform1);

        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transform2Buffer);
        // this.gl.vertexAttribPointer(
        //     this.shader.attribute.transform2,
        //     4,
        //     type,
        //     normalize,
        //     stride,
        //     offset
        // );
        // this.gl.enableVertexAttribArray(this.shader.attribute.transform2);

        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transform3Buffer);
        // this.gl.vertexAttribPointer(
        //     this.shader.attribute.transform3,
        //     4,
        //     type,
        //     normalize,
        //     stride,
        //     offset
        // );
        // this.gl.enableVertexAttribArray(this.shader.attribute.transform3);

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

        const vertexCount = this.objectArray.getArray().length * 3;
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexCount);
    }

    public createItem(param: Triangle) {
        return {
            renderId: this.objectArray.createItem(param),
        };
    }

    public updateItem(ref: RenderItem, param: Partial<Triangle>) {
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
        array: Array<ISyncedArrayRef<Triangle>>
    ) {
        const triangleCount = array.length;
        const positionCount = triangleCount * 3;
        const colourCount = triangleCount * 3;

        this.positions = new Float32Array(
            new Array(positionCount * 3).fill(0)
        );

        this.colours = new Float32Array(new Array(colourCount * 3).fill(0));

        this.transform0 = new Float32Array(new Array(colourCount * 4).fill(0));
        this.transform1 = new Float32Array(new Array(colourCount * 4).fill(0));
        this.transform2 = new Float32Array(new Array(colourCount * 4).fill(0));
        this.transform3 = new Float32Array(new Array(colourCount * 4).fill(0));

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
        gl.bindBuffer(gl.ARRAY_BUFFER, this.transform0Buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.transform0, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.transform1Buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.transform1, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.transform2Buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.transform2, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.transform3Buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.transform3, gl.DYNAMIC_DRAW);
    }

    private onInjection(index: number, object: Triangle) {
        const { positions, colour } = object;
        const transform = object.transform || IDENTITY;

        const positionIndex = index * 3 * 3;
        const colourIndex = index * 3 * 3;
        const vertex = index * 3;

        this.positions[positionIndex] = positions[0][0];
        this.positions[positionIndex + 1] = positions[0][1];
        this.positions[positionIndex + 2] = positions[0][2];

        this.positions[positionIndex + 3] = positions[1][0];
        this.positions[positionIndex + 4] = positions[1][1];
        this.positions[positionIndex + 5] = positions[1][2];

        this.positions[positionIndex + 6] = positions[2][0];
        this.positions[positionIndex + 7] = positions[2][1];
        this.positions[positionIndex + 8] = positions[2][2];

        this.colours[colourIndex] = colour[0];
        this.colours[colourIndex + 1] = colour[1];
        this.colours[colourIndex + 2] = colour[2];

        this.colours[colourIndex + 3] = colour[0];
        this.colours[colourIndex + 4] = colour[1];
        this.colours[colourIndex + 5] = colour[2];

        this.colours[colourIndex + 6] = colour[0];
        this.colours[colourIndex + 7] = colour[1];
        this.colours[colourIndex + 8] = colour[2];

        for (let x = 0; x < 3; x++) {
            const transformIndex = vertex + (x * 4);
            this.transform0[transformIndex] = transform[0];
            this.transform0[transformIndex + 1] = transform[1];
            this.transform0[transformIndex + 2] = transform[2];
            this.transform0[transformIndex + 3] = transform[3];
        } 

        for (let x = 0; x < 3; x++) {
            const transformIndex = vertex + (x * 4);
            this.transform1[transformIndex] = transform[4];
            this.transform1[transformIndex + 1] = transform[5];
            this.transform1[transformIndex + 2] = transform[6];
            this.transform1[transformIndex + 3] = transform[7];
        } 

        for (let x = 0; x < 3; x++) {
            const transformIndex = vertex + (x * 4);
            this.transform2[transformIndex] = transform[8];
            this.transform2[transformIndex + 1] = transform[9];
            this.transform2[transformIndex + 2] = transform[10];
            this.transform2[transformIndex + 3] = transform[11];
        } 

        for (let x = 0; x < 3; x++) {
            const transformIndex = vertex + (x * 4);
            this.transform3[transformIndex] = transform[12];
            this.transform3[transformIndex + 1] = transform[13];
            this.transform3[transformIndex + 2] = transform[14];
            this.transform3[transformIndex + 3] = transform[15];
        } 
    }

}
