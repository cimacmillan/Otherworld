import { Sprite, Wall } from "../types/RenderInterface";
import { RenderItemInterface, RenderItem } from "../types/RenderItemInterface";
import { RenderState } from "../../state/render/RenderState";
import { vec2, mat4 } from "gl-matrix";
import { SyncedArray, ISyncedArrayRef } from "../../util/math";
import { compileSpriteShader } from "../shaders/Shaders";

export class WallRenderService implements RenderItemInterface<Wall> {
    private wallArray: SyncedArray<Wall>;

    private shader: CompiledShader;

    private positionBuffer: WebGLBuffer;
    private spritesheet: WebGLTexture;
    private textureBuffer: WebGLBuffer;

    private positions: Float32Array;
    private texture: Float32Array;

    public init(renderState: RenderState) {
        const gl = renderState.screen.getOpenGL();

        this.shader = compileSpriteShader(gl);

        this.wallArray = new SyncedArray({
            onReconstruct: (array: Array<ISyncedArrayRef<Wall>>) => this.onArrayReconstruct(gl, array),
            onUpdate: (array: Array<ISyncedArrayRef<Wall>>) => this.onArrayUpdate(gl),
            onInjection: (index: number, ref: ISyncedArrayRef<Wall>) => this.onInjection(index, ref.obj)
        });

        this.positionBuffer = gl.createBuffer();
        this.textureBuffer = gl.createBuffer();
    
    }

    public draw(renderState: RenderState) {
        // this.spriteArray.sync();

        // const gl = renderState.screen.getOpenGL();
        // gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        // gl.clearDepth(1.0);                 // Clear everything
        // gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        // gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
        // // gl.enable(gl.BLEND);
        // // gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // const fieldOfView = 45 * Math.PI / 180;   // in radians
        // const aspect = 1280 / 720;
        // const zNear = 0.1;
        // const zFar = 10000.0;
        // const projectionMatrix = mat4.create();

        // mat4.perspective(projectionMatrix,
        //             fieldOfView,
        //             aspect,
        //             zNear,
        //             zFar);

        // const modelViewMatrix = mat4.create();
        
        // mat4.rotateY(modelViewMatrix,     // destination matrix
        //     modelViewMatrix,     // matrix to translate
        //     renderState.camera.angle);  // amount to translate

        // mat4.translate(modelViewMatrix,     // destination matrix
        //             modelViewMatrix,     // matrix to translate
        //             [-renderState.camera.position.x, -renderState.camera.height, -renderState.camera.position.y]);  // amount to translate

        // const numComponents = 3;  
        // const type = gl.FLOAT;   
        // const normalize = false;
        // const stride = 0;
        // const offset = 0;       

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        // gl.vertexAttribPointer(this.shader.attribute.vertexPosition, numComponents, type, normalize, stride, offset); 
        // gl.enableVertexAttribArray(this.shader.attribute.vertexPosition);

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.translationBuffer);
        // gl.vertexAttribPointer(this.shader.attribute.vertexTranslation, numComponents, type, normalize, stride, offset); 
        // gl.enableVertexAttribArray(this.shader.attribute.vertexTranslation);

        // gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        // gl.vertexAttribPointer(this.shader.attribute.texturePosition, 2, type, normalize, stride, offset); 
        // gl.enableVertexAttribArray(this.shader.attribute.texturePosition);

        // gl.useProgram(this.shader.shaderId);
        // gl.uniformMatrix4fv(this.shader.uniform.projectionMatrix, false, projectionMatrix);
        // gl.uniformMatrix4fv(this.shader.uniform.modelMatrix, false, modelViewMatrix);

        // gl.activeTexture(gl.TEXTURE0);
        // // Bind the texture to texture unit 0
        // gl.bindTexture(gl.TEXTURE_2D, this.spritesheet);
        // // Tell the shader we bound the texture to texture unit 0
        // gl.uniform1i(this.shader.attribute.textureSampler, 0);

        // const vertexCount = this.positions.length / 3;
        // gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }

    private onArrayReconstruct(gl: WebGLRenderingContext, array: Array<ISyncedArrayRef<Wall>>) {
        const length = array.length;

        this.positions = new Float32Array(new Array(
            length * 2 * 3 * 3
        ).fill(0));

        this.texture = new Float32Array(new Array(
            length * 2 * 3 * 2
        ).fill(0));

        for (let i = 0; i < array.length; i++) {
            this.onInjection(i, array[i].obj);
        }

        this.onArrayUpdate(gl);
    }

    private onArrayUpdate(gl: WebGLRenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW); 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.texture, gl.DYNAMIC_DRAW);     
    }

    private onInjection(index: number, sprite: Wall) {
        // const t1i = index * 2 * 3 * 3;
        // const tex = index * 2 * 3 * 2;

        // const halfWidth = sprite.size[0] / 2;
        // const halfHeight = sprite.size[1] / 2;
        // const x = sprite.position[0];
        // const y = sprite.height;
        // const z = sprite.position[1];

        // this.positions[t1i] = -halfWidth;
        // this.positions[t1i + 1] = halfHeight;
        // this.positions[t1i + 2] = 0;

        // this.positions[t1i + 3] = halfWidth;
        // this.positions[t1i + 4] = halfHeight;
        // this.positions[t1i + 5] = 0;

        // this.positions[t1i + 6] = -halfWidth;
        // this.positions[t1i + 7] = -halfHeight;
        // this.positions[t1i + 8] = 0;


        // this.positions[t1i + 9] = +halfWidth;
        // this.positions[t1i + 10] = halfHeight;
        // this.positions[t1i + 11] = 0;

        // this.positions[t1i + 12] = +halfWidth;
        // this.positions[t1i + 13] = -halfHeight;
        // this.positions[t1i + 14] = 0;

        // this.positions[t1i + 15] = -halfWidth;
        // this.positions[t1i + 16] = -halfHeight;
        // this.positions[t1i + 17] = 0;

        // // 

        // this.translations[t1i] = x;
        // this.translations[t1i + 1] = y;
        // this.translations[t1i + 2] = z;

        // this.translations[t1i + 3] = x;
        // this.translations[t1i + 4] = y;
        // this.translations[t1i + 5] = z;

        // this.translations[t1i + 6] = x;
        // this.translations[t1i + 7] = y;
        // this.translations[t1i + 8] = z;


        // this.translations[t1i + 9] = x;
        // this.translations[t1i + 10] = y;
        // this.translations[t1i + 11] = z;

        // this.translations[t1i + 12] = x;
        // this.translations[t1i + 13] = y;
        // this.translations[t1i + 14] = z;

        // this.translations[t1i + 15] = x;
        // this.translations[t1i + 16] = y;
        // this.translations[t1i + 17] = z;

        // const texX = sprite.textureX;
        // const texY = sprite.textureY;
        // const texWidth = sprite.textureWidth;
        // const texHeight = sprite.textureHeight;

        // // t1

        // this.texture[tex] = texX;
        // this.texture[tex + 1] = texY;

        // this.texture[tex + 2] = texX + texWidth;
        // this.texture[tex + 3] = texY;

        // this.texture[tex + 4] = texX;
        // this.texture[tex + 5] = texY + texHeight;

        // // t2

        // this.texture[tex + 6] = texX + texWidth;
        // this.texture[tex + 7] = texY;

        // this.texture[tex + 8] = texX + texWidth;
        // this.texture[tex + 9] = texY + texHeight;

        // this.texture[tex + 10] = texX
        // this.texture[tex + 11] = texY + texHeight;

    }

    public createItem(param: Wall) {
        return {
            renderId: this.wallArray.createItem(param)
        };
    }

    public updateItem(ref: RenderItem, param: Partial<Wall>) {
        this.wallArray.updateItem(ref.renderId, param);
    }

    public freeItem(ref: RenderItem) {
        this.wallArray.freeItem(ref.renderId,);
    }

    public attachSpritesheet(spritesheet: WebGLTexture) {
        this.spritesheet = spritesheet;
    }
}