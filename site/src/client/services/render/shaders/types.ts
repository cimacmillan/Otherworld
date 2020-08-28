export interface UniformPositions {
    [key: string]: WebGLUniformLocation;
}

export interface AttributePositions {
    [key: string]: number;
}

export interface CompiledShader {
    shaderId: WebGLProgram;
    uniform: UniformPositions;
    attribute: AttributePositions;
}
