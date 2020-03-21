import { BilloardVertex } from "./vertex/BillboardVertex";
import { Vertex } from "./vertex/Vertex";
import { fsSource } from "./fragment/Fragment";
import { rfsSource } from "./fragment/RepeatedFragment";
import { initShaderProgram } from "./ShaderCompiler";

export function compileSpriteShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(gl, BilloardVertex.source, fsSource);
    const uniform: UniformPositions = {
        textureSampler: gl.getUniformLocation(shaderId, BilloardVertex.v.textureSampler),
        projectionMatrix: gl.getUniformLocation(shaderId, BilloardVertex.v.projectionMatrix),
        modelMatrix: gl.getUniformLocation(shaderId, BilloardVertex.v.modelMatrix),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(shaderId, BilloardVertex.v.vertexPosition),
        vertexTranslation: gl.getAttribLocation(shaderId, BilloardVertex.v.vertexTranslation),
        texturePosition: gl.getAttribLocation(shaderId, BilloardVertex.v.texturePosition)
    };
    return {shaderId, uniform, attribute}
}

export function compileModelShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(gl, Vertex.source, rfsSource);
    const uniform: UniformPositions = {
        textureSampler: gl.getUniformLocation(shaderId, Vertex.v.textureSampler),
        projectionMatrix: gl.getUniformLocation(shaderId, Vertex.v.projectionMatrix),
        modelMatrix: gl.getUniformLocation(shaderId, Vertex.v.modelMatrix),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(shaderId, Vertex.v.vertexPosition),
        texturePosition: gl.getAttribLocation(shaderId, Vertex.v.texturePosition)
    };
    return {shaderId, uniform, attribute}
}
