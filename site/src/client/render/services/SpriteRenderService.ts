import { mat4, vec2 } from "gl-matrix";
import { RenderState } from "../../state/render/RenderState";
import { ISyncedArrayRef, SyncedArray } from "../../util/math";
import { compileSpriteShader } from "../shaders/Shaders";
import { Sprite } from "../types/RenderInterface";
import { RenderItem, RenderItemInterface } from "../types/RenderItemInterface";

export class SpriteRenderService implements RenderItemInterface<Sprite> {
  private spriteArray: SyncedArray<Sprite>;

  private shader: CompiledShader;

  private positionBuffer: WebGLBuffer;
  private spritesheet: WebGLTexture;
  private translationBuffer: WebGLBuffer;
  private textureBuffer: WebGLBuffer;

  private positions: Float32Array;
  private translations: Float32Array;
  private texture: Float32Array;

  private modelViewMatrix: mat4;
  private projectionMatrix: mat4;

  public init(renderState: RenderState) {
    const gl = renderState.screen.getOpenGL();

    this.shader = compileSpriteShader(gl);

    this.spriteArray = new SyncedArray({
      onReconstruct: (array: Array<ISyncedArrayRef<Sprite>>) =>
        this.onArrayReconstruct(gl, array),
      onUpdate: (array: Array<ISyncedArrayRef<Sprite>>) =>
        this.onArrayUpdate(gl),
      onInjection: (index: number, ref: ISyncedArrayRef<Sprite>) =>
        this.onInjection(index, ref.obj),
    });

    this.positionBuffer = gl.createBuffer();
    this.translationBuffer = gl.createBuffer();
    this.textureBuffer = gl.createBuffer();
  }

  public draw(renderState: RenderState) {
    this.spriteArray.sync();
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

    gl.bindBuffer(gl.ARRAY_BUFFER, this.translationBuffer);
    gl.vertexAttribPointer(
      this.shader.attribute.vertexTranslation,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(this.shader.attribute.vertexTranslation);

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

  public createItem(param: Sprite) {
    return {
      renderId: this.spriteArray.createItem(param),
    };
  }

  public updateItem(ref: RenderItem, param: Partial<Sprite>) {
    this.spriteArray.updateItem(ref.renderId, param);
  }

  public freeItem(ref: RenderItem) {
    this.spriteArray.freeItem(ref.renderId);
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
    array: Array<ISyncedArrayRef<Sprite>>
  ) {
    const length = array.length;

    this.positions = new Float32Array(new Array(length * 2 * 3 * 3).fill(0));

    this.texture = new Float32Array(new Array(length * 2 * 3 * 2).fill(0));

    this.translations = new Float32Array(new Array(length * 2 * 3 * 3).fill(0));

    for (let i = 0; i < array.length; i++) {
      this.onInjection(i, array[i].obj);
    }

    this.onArrayUpdate(gl);
  }

  private onArrayUpdate(gl: WebGLRenderingContext) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.translationBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.translations, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.texture, gl.DYNAMIC_DRAW);
  }

  private onInjection(index: number, sprite: Sprite) {
    const t1i = index * 2 * 3 * 3;
    const tex = index * 2 * 3 * 2;

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

    const texX = sprite.textureX;
    const texY = sprite.textureY;
    const texWidth = sprite.textureWidth;
    const texHeight = sprite.textureHeight;

    // t1

    this.texture[tex] = texX;
    this.texture[tex + 1] = texY;

    this.texture[tex + 2] = texX + texWidth;
    this.texture[tex + 3] = texY;

    this.texture[tex + 4] = texX;
    this.texture[tex + 5] = texY + texHeight;

    // t2

    this.texture[tex + 6] = texX + texWidth;
    this.texture[tex + 7] = texY;

    this.texture[tex + 8] = texX + texWidth;
    this.texture[tex + 9] = texY + texHeight;

    this.texture[tex + 10] = texX;
    this.texture[tex + 11] = texY + texHeight;
  }
}