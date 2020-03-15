import { vsSource } from "./vertex/Vertex";
import { fsSource } from "./fragment/Fragment";
import { initShaderProgram } from "./ShaderCompiler";

export function compileSpriteShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(gl, vsSource, fsSource);
    const uniform: UniformPositions = {
        textureSampler: gl.getUniformLocation(shaderId, 'uSampler'),
        projectionMatrix: gl.getUniformLocation(shaderId, 'uProjectionMatrix'),
        modelMatrix: gl.getUniformLocation(shaderId, 'uModelViewMatrix'),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(shaderId, 'aVertexPosition'),
        vertexColour: gl.getAttribLocation(shaderId, 'colour'),
        vertexTranslation: gl.getAttribLocation(shaderId, 'aVertexTranslation'),
        texturePosition: gl.getAttribLocation(shaderId, 'aTextureCoord')
    };
    return {shaderId, uniform, attribute}
}
