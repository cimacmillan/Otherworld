import { RenderState } from "../state/render/RenderState";
import { WorldState } from "../state/world/WorldState";
import { initShaderProgram } from "./shaders/ShaderCompiler";
import { render } from "react-dom";
import * as glm from "gl-matrix";
import { vsSource } from "./shaders/basic/Vertex";
import { fsSource } from "./shaders/basic/Fragment";


export class RenderService {

    private shaderProgram: WebGLProgram;
    private positionBuffer: WebGLBuffer;
    private vertexPosition: number;
    private projectionMatrix: WebGLUniformLocation;
    private modelMatrix: WebGLUniformLocation;

    private positions: number[];

    public init(renderState: RenderState) {

        const gl = renderState.screen.getOpenGL();
        this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.modelMatrix = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');

        // Create a buffer for the square's positions.
        
        this.positionBuffer = gl.createBuffer();
        
        // Select the positionBuffer as the one to apply buffer
        // operations to from here out.
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        
        // Now create an array of positions for the square.
        


        this.positions = [];

        for (let i = 0; i < 10; i ++ ){
            this.positions = this.positions.concat([
                -1.0,  1.0, i,
                1.0,  1.0, i,
                -1.0, -1.0, i, 
            ]);
        }
        
        // Now pass the list of positions into WebGL to build the
        // shape. We do this by creating a Float32Array from the
        // JavaScript array, then use it to fill the current buffer.
        
        gl.bufferData(gl.ARRAY_BUFFER,
                        new Float32Array(this.positions),
                        gl.STATIC_DRAW);        
    }

    public createImage(renderState: RenderState, worldState: WorldState) {

        const { screen } = renderState;

        const gl = screen.getOpenGL();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = 1280 / 720;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = glm.mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        glm.mat4.perspective(projectionMatrix,
                    fieldOfView,
                    aspect,
                    zNear,
                    zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        const modelViewMatrix = glm.mat4.create();

        // Now move the drawing position a bit to where we want to
        // start drawing the square.

        glm.mat4.rotateY(modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            worldState.camera.angle);  // amount to translate


        glm.mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     // matrix to translate
                    [-worldState.camera.position.x, -worldState.camera.height, -worldState.camera.position.y]);  // amount to translate

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.

        const numComponents = 3;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
        this.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
        gl.enableVertexAttribArray(
            this.vertexPosition);


        // Tell WebGL to use our program when drawing

        gl.useProgram(this.shaderProgram);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
        this.projectionMatrix,
        false,
        projectionMatrix);
        gl.uniformMatrix4fv(
        this.modelMatrix,
        false,
        modelViewMatrix);


        const vertexCount = 12;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

        // drawBackground(screen, depthBuffer, worldState.map.backgroundColour);
        // drawPlanes(screen, depthBuffer, worldState.camera, worldState.map.backgroundColour, worldState.map.floor);
        // drawSprites(screen, depthBuffer, worldState.camera, worldState.map.sprites, worldState.map.backgroundColour);
        // drawWalls(screen, depthBuffer, worldState.camera, worldState.map.wall_buffer, worldState.map.backgroundColour);

    }

}