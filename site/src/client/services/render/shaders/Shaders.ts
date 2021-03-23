import { colourFragment } from "./fragment/ColourFragment";
import { fadeUniformPositions } from "./fragment/Fade";
import { fsSource } from "./fragment/Fragment";
import { hazeUniformPositions } from "./fragment/Haze";
import { rfsSource } from "./fragment/RepeatedFragment";
import { initShaderProgram } from "./ShaderCompiler";
import { AttributePositions, UniformPositions } from "./types";
import { BilloardVertex } from "./vertex/BillboardVertex";
import { ColourVertex } from "./vertex/ColourVertex";
import { ParticleVertex } from "./vertex/ParticleVertex";
import { RepeatedVertex } from "./vertex/RepeatedVertex";
import { Vertex } from "./vertex/Vertex";

export function compileSpriteShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(gl, BilloardVertex.source, fsSource);
    const uniform: UniformPositions = {
        ...fadeUniformPositions(shaderId, gl),
        ...hazeUniformPositions(shaderId, gl),
        textureSampler: gl.getUniformLocation(
            shaderId,
            BilloardVertex.v.textureSampler
        ),
        projectionMatrix: gl.getUniformLocation(
            shaderId,
            BilloardVertex.v.projectionMatrix
        ),
        modelMatrix: gl.getUniformLocation(
            shaderId,
            BilloardVertex.v.modelMatrix
        ),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(
            shaderId,
            BilloardVertex.v.vertexPosition
        ),
        vertexTranslation: gl.getAttribLocation(
            shaderId,
            BilloardVertex.v.vertexTranslation
        ),
        texturePosition: gl.getAttribLocation(
            shaderId,
            BilloardVertex.v.texturePosition
        ),
    };
    return { shaderId, uniform, attribute };
}

export function compileParticleShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(
        gl,
        ParticleVertex.source,
        colourFragment
    );
    const uniform: UniformPositions = {
        ...fadeUniformPositions(shaderId, gl),
        ...hazeUniformPositions(shaderId, gl),
        projectionMatrix: gl.getUniformLocation(
            shaderId,
            BilloardVertex.v.projectionMatrix
        ),
        modelMatrix: gl.getUniformLocation(
            shaderId,
            BilloardVertex.v.modelMatrix
        ),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(
            shaderId,
            BilloardVertex.v.vertexPosition
        ),
        vertexTranslation: gl.getAttribLocation(
            shaderId,
            BilloardVertex.v.vertexTranslation
        ),
    };
    return { shaderId, uniform, attribute };
}

export function compileModelShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(gl, Vertex.source, fsSource);
    const uniform: UniformPositions = {
        ...fadeUniformPositions(shaderId, gl),
        ...hazeUniformPositions(shaderId, gl),

        textureSampler: gl.getUniformLocation(
            shaderId,
            Vertex.v.textureSampler
        ),
        projectionMatrix: gl.getUniformLocation(
            shaderId,
            Vertex.v.projectionMatrix
        ),
        modelMatrix: gl.getUniformLocation(shaderId, Vertex.v.modelMatrix),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(shaderId, Vertex.v.vertexPosition),
        texturePosition: gl.getAttribLocation(
            shaderId,
            Vertex.v.texturePosition
        ),
    };
    return { shaderId, uniform, attribute };
}

export function compileVoxelShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(gl, ColourVertex.source, colourFragment);
    const uniform: UniformPositions = {
        ...fadeUniformPositions(shaderId, gl),
        ...hazeUniformPositions(shaderId, gl),
        projectionMatrix: gl.getUniformLocation(
            shaderId,
            ColourVertex.v.projectionMatrix
        ),
        modelMatrix: gl.getUniformLocation(
            shaderId,
            ColourVertex.v.modelMatrix
        ),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(
            shaderId,
            ColourVertex.v.vertexPosition
        ),
        colourOverride: gl.getAttribLocation(
            shaderId,
            ColourVertex.v.colourOverride
        ),
        transform: gl.getAttribLocation(
            shaderId,
            ColourVertex.v.transform
        ),
    };
    return { shaderId, uniform, attribute };
}

export function compileTextureRepeatShader(gl: WebGLRenderingContext) {
    const shaderId = initShaderProgram(gl, RepeatedVertex.source, rfsSource);
    const uniform: UniformPositions = {
        ...fadeUniformPositions(shaderId, gl),
        ...hazeUniformPositions(shaderId, gl),

        textureSampler: gl.getUniformLocation(
            shaderId,
            RepeatedVertex.v.textureSampler
        ),
        projectionMatrix: gl.getUniformLocation(
            shaderId,
            RepeatedVertex.v.projectionMatrix
        ),
        modelMatrix: gl.getUniformLocation(
            shaderId,
            RepeatedVertex.v.modelMatrix
        ),
    };
    const attribute: AttributePositions = {
        vertexPosition: gl.getAttribLocation(
            shaderId,
            RepeatedVertex.v.vertexPosition
        ),
        texturePosition: gl.getAttribLocation(
            shaderId,
            RepeatedVertex.v.texturePosition
        ),
        textureStart: gl.getAttribLocation(
            shaderId,
            RepeatedVertex.v.textureStart
        ),
        textureSize: gl.getAttribLocation(
            shaderId,
            RepeatedVertex.v.textureSize
        ),
    };
    return { shaderId, uniform, attribute };
}
