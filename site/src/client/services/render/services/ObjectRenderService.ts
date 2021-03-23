import { mat4, vec3 } from "gl-matrix";
import { identity, transform } from "lodash";
import { ISyncedArrayRef, SyncedArray } from "../../../util/array/SyncedArray";
import { compileSpriteShader, compileVoxelShader } from "../shaders/Shaders";
import { CompiledShader } from "../shaders/types";
import { Sprite } from "../types/RenderInterface";
import { RenderItem, RenderItemInterface } from "../types/RenderItemInterface";
import {
    BackgroundRenderService,
    BackgroundShaderPositions,
} from "./BackgroundRenderService";

interface Object {
    positions: [vec3, vec3, vec3][];
    colour: vec3[];
    transform?: mat4;
}

const IDENTITY = mat4.identity(mat4.create());
const tempMat4 = mat4.create();

export class ObjectRenderService implements RenderItemInterface<Object> {
    private gl: WebGLRenderingContext;

    private objectArray: SyncedArray<Object>;

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
            onReconstruct: (array: Array<ISyncedArrayRef<Object>>) =>
                this.onArrayReconstruct(gl, array),
            onUpdate: (array: Array<ISyncedArrayRef<Object>>) =>
                this.onArrayUpdate(gl),
            onInjection: (index: number, ref: ISyncedArrayRef<Object>) =>
                this.onInjection(index, ref.obj),
        });

        this.positionBuffer = gl.createBuffer();
        this.colourBuffer = gl.createBuffer();
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

        this.gl.useProgram(this.shader.shaderId);
        this.backgroundRenderService.applyShaderArguments(
            this.backgroundShaderPositions
        );

        this.gl.uniformMatrix4fv(
            this.shader.uniform.projectionMatrix,
            false,
            this.projectionMatrix
        );

        const objects = this.objectArray.getArray();
        let start = 0;
        for (let x = 0; x < objects.length; x++) {
            const transform = mat4.multiply(tempMat4, this.modelViewMatrix, objects[0].obj.transform || IDENTITY);
            this.gl.uniformMatrix4fv(
                this.shader.uniform.modelMatrix,
                false,
                transform
            );
            const vertexes = objects[x].obj.colour.length * 3;
            this.gl.drawArrays(this.gl.TRIANGLES, start, vertexes);
            start += vertexes;
        }
    }

    public createItem(param: Object) {
        return {
            renderId: this.objectArray.createItem(param),
        };
    }

    public updateItem(ref: RenderItem, param: Partial<Object>) {
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
        array: Array<ISyncedArrayRef<Object>>
    ) {
        const triangleCount = array.reduce((sum, obj) => sum + obj.obj.colour.length, 0);
        const positionCount = triangleCount * 3;
        const colourCount = triangleCount * 3;

        this.positions = new Float32Array(
            new Array(positionCount * 3).fill(0)
        );

        this.colours = new Float32Array(new Array(colourCount * 3).fill(0));

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

    private onInjection(index: number, object: Object) {
        const { positions, colour } = object;
        const vertexNumber = this.objectArray.getArray().slice(0, index).reduce((sum, obj) => sum + obj.obj.colour.length, 0) * 3;

        const positionIndex = vertexNumber * 3;
        const colourIndex = vertexNumber * 3;

        for (let i = 0; i < object.colour.length; i++) {
            const shift = i * 9;
            this.positions[shift + positionIndex] = positions[i][0][0];
            this.positions[shift + positionIndex + 1] = positions[i][0][1];
            this.positions[shift + positionIndex + 2] = positions[i][0][2];
    
            this.positions[shift + positionIndex + 3] = positions[i][1][0];
            this.positions[shift + positionIndex + 4] = positions[i][1][1];
            this.positions[shift + positionIndex + 5] = positions[i][1][2];
    
            this.positions[shift + positionIndex + 6] = positions[i][2][0];
            this.positions[shift + positionIndex + 7] = positions[i][2][1];
            this.positions[shift + positionIndex + 8] = positions[i][2][2];
    
            this.colours[shift + colourIndex] = colour[i][0];
            this.colours[shift + colourIndex + 1] = colour[i][1];
            this.colours[shift + colourIndex + 2] = colour[i][2];
    
            this.colours[shift + colourIndex + 3] = colour[i][0];
            this.colours[shift + colourIndex + 4] = colour[i][1];
            this.colours[shift + colourIndex + 5] = colour[i][2];
    
            this.colours[shift + colourIndex + 6] = colour[i][0];
            this.colours[shift + colourIndex + 7] = colour[i][1];
            this.colours[shift + colourIndex + 8] = colour[i][2];
        }
    }

}
