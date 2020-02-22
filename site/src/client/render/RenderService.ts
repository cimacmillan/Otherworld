import { RenderState } from "../state/render/RenderState";
import { WorldState } from "../state/world/WorldState";
import { initShaderProgram } from "./shaders/ShaderCompiler";
import * as glm from "gl-matrix";
import { vsSource } from "./shaders/basic/Vertex";
import { fsSource } from "./shaders/basic/Fragment";
import { RenderInterface, RenderItem, Sprite } from "./RenderInterface";

export class RenderService implements RenderInterface {

    private shaderProgram: WebGLProgram;
    private positionBuffer: WebGLBuffer;
    private vertexPosition: number;
    private projectionMatrix: WebGLUniformLocation;
    private modelMatrix: WebGLUniformLocation;


    private positions: Float32Array;

    private triangles =  10000;

    public init(renderState: RenderState) {
        const gl = renderState.screen.getOpenGL();
        this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.modelMatrix = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');

        this.positionBuffer = gl.createBuffer();

        const pos = [];
        for (let i = 0; i < this.triangles; i ++ ){
            pos.push(...[
                -1.0,  1.0, -i - 10,
                1.0,  1.0, -i - 10,
                -1.0, -1.0, -i - 10, 
            ]);
        }
        this.positions = new Float32Array(pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);        
    
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

        gl.useProgram(this.shaderProgram);
        gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(this.modelMatrix, false, modelViewMatrix);

        const vertexCount = this.positions.length / 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    public createSprite() {
        return {
            renderId: 0
        }
    }

    public updateSprite(ref: RenderItem, param: Partial<Sprite>) {

    }

    public freeSprite(ref: RenderItem) {

    }

}