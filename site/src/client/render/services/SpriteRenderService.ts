
// TODO change
import { Sprite } from "../RenderInterface";
import { RenderItemInterface, RenderItem } from "../RenderItemInterface";
import { RenderState } from "../../state/render/RenderState";
import { initShaderProgram } from "../shaders/ShaderCompiler";
import { vsSource } from "../shaders/basic/Vertex";
import { fsSource } from "../shaders/basic/Fragment";
import { vec2, mat4 } from "gl-matrix";

interface SpriteRef {
    sprite: Sprite,
    renderId: number;
    requireUpdate: boolean;
}

export class SpriteRenderService implements RenderItemInterface<Sprite> {

    private renderIdCounter: number = 0;
    private requireConstruction: boolean = false;
    private requireUpdate: boolean = false;

    private spriteArray: Array<SpriteRef> = [];

    private shaderProgram: WebGLProgram;
    private positionBuffer: WebGLBuffer;
    private colourBuffer: WebGLBuffer;    
    private translationBuffer: WebGLBuffer;
    private textureBuffer: WebGLBuffer;

    private vertexPosition: number;
    private vertexColour: number;
    private vertexTranslation: number;
    private texturePosition: number;
    private textureSampler: WebGLUniformLocation;

    private projectionMatrix: WebGLUniformLocation;
    private modelMatrix: WebGLUniformLocation;

    private positions: Float32Array;
    private colours: Float32Array;
    private translations: Float32Array;
    private texture: Float32Array;

    constructor (private spriteSheet: WebGLTexture) {

    }

    public init(renderState: RenderState) {
        const gl = renderState.screen.getOpenGL();

        this.shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        this.vertexPosition = gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
        this.vertexColour = gl.getAttribLocation(this.shaderProgram, 'colour');
        this.vertexTranslation = gl.getAttribLocation(this.shaderProgram, 'aVertexTranslation');
        this.texturePosition = gl.getAttribLocation(this.shaderProgram, 'aTextureCoord');
        this.textureSampler = gl.getUniformLocation(this.shaderProgram, 'uSampler');
        this.projectionMatrix = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix');
        this.modelMatrix = gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix');

        this.positionBuffer = gl.createBuffer();
        this.translationBuffer = gl.createBuffer();
        this.colourBuffer = gl.createBuffer();
        this.textureBuffer = gl.createBuffer();
    
    }

    public draw(renderState: RenderState) {
        if (this.requireConstruction) {
            this.reconstructArray(renderState.screen.getOpenGL());
        }

        if (this.requireUpdate) {
            this.updateArray(renderState.screen.getOpenGL());
        }

        const gl = renderState.screen.getOpenGL();
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = 1280 / 720;
        const zNear = 0.1;
        const zFar = 10000.0;
        const projectionMatrix = mat4.create();

        mat4.perspective(projectionMatrix,
                    fieldOfView,
                    aspect,
                    zNear,
                    zFar);

        const modelViewMatrix = mat4.create();
        
        mat4.rotateY(modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            renderState.camera.angle);  // amount to translate

        mat4.translate(modelViewMatrix,     // destination matrix
                    modelViewMatrix,     // matrix to translate
                    [-renderState.camera.position.x, -renderState.camera.height, -renderState.camera.position.y]);  // amount to translate

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

        gl.bindBuffer(gl.ARRAY_BUFFER, this.translationBuffer);
        gl.vertexAttribPointer(this.vertexTranslation, numComponents, type, normalize, stride, offset); 
        gl.enableVertexAttribArray(this.vertexTranslation);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.vertexAttribPointer(this.texturePosition, 2, type, normalize, stride, offset); 
        gl.enableVertexAttribArray(this.texturePosition);

        gl.useProgram(this.shaderProgram);
        gl.uniformMatrix4fv(this.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(this.modelMatrix, false, modelViewMatrix);

        gl.activeTexture(gl.TEXTURE0);
        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.spriteSheet);
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(this.textureSampler, 0);

        const vertexCount = this.positions.length / 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    private reconstructArray(gl: WebGLRenderingContext) {

        const length = this.spriteArray.length;

        this.positions = new Float32Array(new Array(
            length * 2 * 3 * 3
        ).fill(0));

        this.texture = new Float32Array(new Array(
            length * 2 * 3 * 2
        ).fill(0));

        this.translations = new Float32Array(new Array(
            length * 2 * 3 * 3
        ).fill(0));

        this.colours = new Float32Array(new Array(
            length * 2 * 3 * 4
        ).fill(0));

        for (let i = 0; i < this.spriteArray.length; i++) {
            this.inject(i, this.spriteArray[i].sprite);
            this.spriteArray[i].requireUpdate = false;
        }

        this.updateArray(gl);
        this.requireConstruction = false;
    }

    private updateArray(gl: WebGLRenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW); 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.translationBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.translations, gl.DYNAMIC_DRAW); 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colourBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.colours, gl.DYNAMIC_DRAW); 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texture, gl.DYNAMIC_DRAW); 
        this.requireUpdate = false;      
    }

    private inject(index: number, sprite: Sprite) {
        const t1i = index * 2 * 3 * 3;
        const tex = index * 2 * 3 * 2;

        const c1i = index * 2 * 3 * 4;

        const halfWidth = sprite.size[0] / 2;
        const halfHeight = sprite.size[1] / 2;
        const x = sprite.position[0];
        const y = sprite.height;
        const z = sprite.position[1];

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

        // t1

        this.texture[tex] = 0.0;
        this.texture[tex + 1] = 0.0;

        this.texture[tex + 2] = 1.0;
        this.texture[tex + 3] = 0.0;

        this.texture[tex + 4] = 0.0;
        this.texture[tex + 5] = 1.0;

        // t2

        this.texture[tex + 6] = 1.0;
        this.texture[tex + 7] = 0.0;

        this.texture[tex + 8] = 1.0;
        this.texture[tex + 9] = 1.0;

        this.texture[tex + 10] = 0.0;
        this.texture[tex + 11] = 1.0;

        // 

        this.colours[c1i] = 1;
        this.colours[c1i + 1] = 1;
        this.colours[c1i + 2] = 1;
        this.colours[c1i + 3] = 1;

        this.colours[c1i + 4] = 1;
        this.colours[c1i + 5] = 1;
        this.colours[c1i + 6] = 1;
        this.colours[c1i + 7] = 1;

        this.colours[c1i + 8] = 1;
        this.colours[c1i + 9] = 1;
        this.colours[c1i + 10] = 1;
        this.colours[c1i + 11] = 1;


        this.colours[c1i + 12] = 1;
        this.colours[c1i + 13] = 1;
        this.colours[c1i + 14] = 1;
        this.colours[c1i + 15] = 1;

        this.colours[c1i + 16] = 1;
        this.colours[c1i + 17] = 1;
        this.colours[c1i + 18] = 1;
        this.colours[c1i + 19] = 1;

        this.colours[c1i + 20] = 1;
        this.colours[c1i + 21] = 1;
        this.colours[c1i + 22] = 1;
        this.colours[c1i + 23] = 1;

    }

    public createItem(param: Sprite) {
        this.renderIdCounter++;
        this.spriteArray.push({sprite: param, renderId: this.renderIdCounter, requireUpdate: false});
        this.requireConstruction = true;
        return {
            renderId: this.renderIdCounter
        }
    }

    public updateItem(ref: RenderItem, param: Partial<Sprite>) {
        const index = this.findRealIndexOf(ref.renderId);
        if (index >= 0) {
            this.inject(index, {...this.spriteArray[index].sprite, ...param});
            this.requireUpdate = true;
        }
    }

    public freeItem(ref: RenderItem) {
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