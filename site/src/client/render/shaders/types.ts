
interface UniformPositions {
    [key: string]: WebGLUniformLocation;
}

interface AttributePositions {
    [key: string]: number;
}

interface CompiledShader {
    shaderId: WebGLProgram;
    uniform: UniformPositions;
    attribute: AttributePositions;
}
