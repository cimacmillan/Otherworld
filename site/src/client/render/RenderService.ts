import { RenderState } from "../state/render/RenderState";
import { WorldState } from "../state/world/WorldState";
import { initShaderProgram } from "./shaders/ShaderCompiler";
import * as glm from "gl-matrix";
import { vsSource } from "./shaders/basic/Vertex";
import { fsSource } from "./shaders/basic/Fragment";
import { RenderInterface, RenderItem, Sprite } from "./RenderInterface";

interface SpriteRef {
    sprite: Sprite,
    renderId: number;
}

export class RenderService implements RenderInterface {

    private renderIdCounter: number = 0;
    private requireConstruction: boolean = false;
    private requireUpdate: boolean = false;

    private spriteArray: Array<SpriteRef> = [];

    private shaderProgram: WebGLProgram;
    private positionBuffer: WebGLBuffer;
    private colourBuffer: WebGLBuffer;
    private vertexPosition: number;
    private vertexColour: number;
    private projectionMatrix: WebGLUniformLocation;
    private modelMatrix: WebGLUniformLocation;

    private positions: Float32Array;
    private colours: Float32Array;

    private triangles =  10000;

    public init(renderState: RenderState) {
        const gl = renderState.screen.getOpenGL();
        this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.vertexColour = gl.getAttribLocation(this.shaderProgram, 'colour');

        this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.modelMatrix = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');

        this.positionBuffer = gl.createBuffer();
        this.colourBuffer = gl.createBuffer();

        const pos = [];
        for (let i = 0; i < this.triangles; i ++ ){
            pos.push(...[
                -1.0,  1.0, -i - 10,
                1.0,  1.0, -i - 10,
                -1.0, -1.0, -i - 10, 
            ]);
        }

        const colours = [];
        const a = 0.3;
        for (let i = 0; i < this.triangles; i ++ ){
            colours.push(...[
                1, 1, 1, a
            ]);
            colours.push(...[
                1, 1, 1, a
            ]);
            colours.push(...[
                1, 1, 1, a
            ]);
        }


        this.positions = new Float32Array(pos);
        this.colours = new Float32Array(colours);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW); 

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colours, gl.DYNAMIC_DRAW);        
    
    }

    private time = 0;

    public draw(renderState: RenderState) {
        const gl = renderState.screen.getOpenGL();
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = 1280 / 720;
        const zNear = 0.1;
        const zFar = 10000.0;
        const projectionMatrix = glm.mat4.create();

        glm.mat4.perspective(projectionMatrix,
                    fieldOfView,
                    aspect,
                    zNear,
                    zFar);

        const modelViewMatrix = glm.mat4.create();
        
        glm.mat4.rotateY(modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            renderState.camera.angle);  // amount to translate


        glm.mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     // matrix to translate
                    [-renderState.camera.position.x, -renderState.camera.height, -renderState.camera.position.y]);  // amount to translate

   
        this.time += 0.05;

        for (let i = 0; i < this.triangles; i ++ ){
            const index = i * 3 * 3;
            const sin = Math.sin(i * 0.05 + this.time) * 10;

            this.positions[index] = -1.0 + sin;
            this.positions[index + 1] = 1.0;
            this.positions[index + 2] = -i - 10;

            this.positions[index + 3] = 1.0 + sin;
            this.positions[index + 4] = 1.0;
            this.positions[index + 5] = -i - 10;

            this.positions[index + 6] = -1.0 + sin;
            this.positions[index + 7] = -1.0;
            this.positions[index + 8] = -i - 10;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);       

        const numComponents = 3;  
        const type = gl.FLOAT;   
        const normalize = false;
        const stride = 0;
        const offset = 0;       

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.vertexPosition, numComponents, type, normalize, stride, offset); 
        gl.enableVertexAttribArray(this.vertexPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.vertexAttribPointer(this.vertexColour, 4, gl.FLOAT, normalize, stride, offset); 
        gl.enableVertexAttribArray(this.vertexColour);

        gl.useProgram(this.shaderProgram);
        gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(this.modelMatrix, false, modelViewMatrix);

        const vertexCount = this.positions.length / 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    

    public createSprite(param: Sprite) {
        this.renderIdCounter++;
        this.spriteArray.push({sprite: param, renderId: this.renderIdCounter});
        this.requireConstruction = true;
        return {
            renderId: this.renderIdCounter
        }
    }

    public updateSprite(ref: RenderItem, param: Partial<Sprite>) {
        const index = this.findRealIndexOf(ref.renderId);
        if (index >= 0) {
            this.requireUpdate = true;
            this.spriteArray[index] = {...this.spriteArray[index], ...param};
        }
    }

    public freeSprite(ref: RenderItem) {
        const index = this.findRealIndexOf(ref.renderId);
        if (index >= 0) {
            this.requireConstruction = true;
            this.spriteArray.splice(index, 1);
        }
    }

    private findRealIndexOf(renderId: number) {
        let found = false;
        let start = 0;
        let end = this.spriteArray.length;
        let midpoint;
        while (found == false) {
            if (start > end) {
                break;            
            }
            midpoint = ~~((start + end) / 2);
            const checkId = this.spriteArray[midpoint].renderId;
            if (renderId === checkId) {
                found = true;
                break;
            } else if (renderId < checkId) {
                end = midpoint - 1;
            } else if (renderId > checkId) {
                start = midpoint + 1;
            }
        }
        if (found === true) {
            return midpoint;
        }
        return -1;
    }

}