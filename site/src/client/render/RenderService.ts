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

    public init(renderState: RenderState) {
        const gl = renderState.screen.getOpenGL();
        this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.modelMatrix = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');

        this.positionBuffer = gl.createBuffer();
    }

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
            worldState.camera.angle);  // amount to translate


        glm.mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     // matrix to translate
                    [-worldState.camera.position.x, -worldState.camera.height, -worldState.camera.position.y]);  // amount to translate

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


    // private positions: Float32Array;

    // public init(renderState: RenderState) {

    //     const gl = renderState.screen.getOpenGL();
    //     this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    //     this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    //     this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
    //     this.modelMatrix = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');

    //     // Create a buffer for the square's positions.
        
    //     this.positionBuffer = gl.createBuffer();
        
    //     // Select the positionBuffer as the one to apply buffer
    //     // operations to from here out.
        
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        
    //     // Now create an array of positions for the square.
        


    //     const pos = [];

    //     for (let i = 0; i < triangles; i ++ ){
    //         pos.push(...[
    //             -1.0,  1.0, -i - 10,
    //             1.0,  1.0, -i - 10,
    //             -1.0, -1.0, -i - 10, 
    //         ]);
    //     }

    //     this.positions = new Float32Array(pos);
        
    //     // Now pass the list of positions into WebGL to build the
    //     // shape. We do this by creating a Float32Array from the
    //     // JavaScript array, then use it to fill the current buffer.
        
    //     gl.bufferData(gl.ARRAY_BUFFER,
    //         this.positions,
    //         gl.DYNAMIC_DRAW);        
    // }

    // private time = 0;

    // public createImage(renderState: RenderState, worldState: WorldState) {
    //     const { screen } = renderState;
    //     const gl = screen.getOpenGL();

    //     this.time += 0.05;

    //     for (let i = 0; i < triangles; i ++ ){
    //         const index = i * 3 * 3;
    //         const sin = Math.sin((i / triangles) * 10 + this.time) * 10;

    //         this.positions[index] = -1.0 + sin;
    //         this.positions[index + 1] = 1.0;
    //         this.positions[index + 2] = -i - 10;

    //         this.positions[index + 3] = 1.0 + sin;
    //         this.positions[index + 4] = 1.0;
    //         this.positions[index + 5] = -i - 10;

    //         this.positions[index + 6] = -1.0 + sin;
    //         this.positions[index + 7] = -1.0;
    //         this.positions[index + 8] = -i - 10;
    //     }

    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    //     gl.bufferData(gl.ARRAY_BUFFER,
    //         this.positions,
    //         gl.DYNAMIC_DRAW);     


    //     gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    //     gl.clearDepth(1.0);                 // Clear everything
    //     gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    //     gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    //     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //     const fieldOfView = 45 * Math.PI / 180;   // in radians
    //     const aspect = 1280 / 720;
    //     const zNear = 0.1;
    //     const zFar = 10000.0;
    //     const projectionMatrix = glm.mat4.create();

    //     // note: glmatrix.js always has the first argument
    //     // as the destination to receive the result.
    //     glm.mat4.perspective(projectionMatrix,
    //                 fieldOfView,
    //                 aspect,
    //                 zNear,
    //                 zFar);

    //     // Set the drawing position to the "identity" point, which is
    //     // the center of the scene.
    //     const modelViewMatrix = glm.mat4.create();

    //     // Now move the drawing position a bit to where we want to
    //     // start drawing the square.

    //     glm.mat4.rotateY(modelViewMatrix,     // destination matrix
    //         modelViewMatrix,     // matrix to translate
    //         worldState.camera.angle);  // amount to translate


    //     glm.mat4.translate(modelViewMatrix,     // destination matrix
    //                 modelViewMatrix,     // matrix to translate
    //                 [-worldState.camera.position.x, -worldState.camera.height, -worldState.camera.position.y]);  // amount to translate

    //     // Tell WebGL how to pull out the positions from the position
    //     // buffer into the vertexPosition attribute.

    //     const numComponents = 3;  // pull out 3 values per iteration
    //     const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    //     const normalize = false;  // don't normalize
    //     const stride = 0;         // how many bytes to get from one set of values to the next
    //                             // 0 = use type and numComponents above
    //     const offset = 0;         // how many bytes inside the buffer to start from
    //     gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    //     gl.vertexAttribPointer(
    //     this.vertexPosition,
    //     numComponents,
    //     type,
    //     normalize,
    //     stride,
    //     offset);
    //     gl.enableVertexAttribArray(this.vertexPosition);


    //     // Tell WebGL to use our program when drawing

    //     gl.useProgram(this.shaderProgram);

    //     // Set the shader uniforms

    //     gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
    //     gl.uniformMatrix4fv(this.modelMatrix, false, modelViewMatrix);

    //     const vertexCount = this.positions.length / 3;
    //     gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

    //     // drawBackground(screen, depthBuffer, worldState.map.backgroundColour);
    //     // drawPlanes(screen, depthBuffer, worldState.camera, worldState.map.backgroundColour, worldState.map.floor);
    //     // drawSprites(screen, depthBuffer, worldState.camera, worldState.map.sprites, worldState.map.backgroundColour);
    //     // drawWalls(screen, depthBuffer, worldState.camera, worldState.map.wall_buffer, worldState.map.backgroundColour);

    // }

}