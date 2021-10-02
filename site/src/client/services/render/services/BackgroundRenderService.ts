interface Background {
    colour: {
        r: number;
        g: number;
        b: number;
    };
    hazeAmount: number;
    fog: {
        minDepth: number;
        maxDepth: number;
        pixelAccuracy: number;
        depthAccuracy: number;
    };
}

export const Backgrounds = {
    OutdoorBackground: {
        colour: {
            r: 135 / 255,
            g: 206 / 255,
            b: 235 / 255,
        },
        hazeAmount: 0.2,
        fog: {
            minDepth: 10,
            maxDepth: 100,
            pixelAccuracy: 4,
            depthAccuracy: 8,
        },
    },
    CaveBackground: {
        colour: {
            r: 0.3,
            g: 0.26 * 0.2,
            b: 0.4 * 0.2,
        },
        hazeAmount: 1,
        fog: {
            minDepth: 0,
            maxDepth: 30,
            pixelAccuracy: 8,
            depthAccuracy: 16,
        },
    },
};

export interface BackgroundShaderPositions {
    hazeR: WebGLUniformLocation;
    hazeG: WebGLUniformLocation;
    hazeB: WebGLUniformLocation;
    hazeAmount: WebGLUniformLocation;

    fadeAccuracy: WebGLUniformLocation;
    fadePixelAccuracy: WebGLUniformLocation;
    minViewDistance: WebGLUniformLocation;
    maxViewDistance: WebGLUniformLocation;
}

export class BackgroundRenderService {
    private gl: WebGLRenderingContext;
    private currentBackground: Background = Backgrounds.CaveBackground;

    public init(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    public setBackground(background: Background) {
        this.currentBackground = background;
    }

    public applyShaderArguments(positions: BackgroundShaderPositions) {
        const { colour, hazeAmount, fog } = this.currentBackground;
        const { r, g, b } = colour;
        const { minDepth, maxDepth, pixelAccuracy, depthAccuracy } = fog;

        // this.gl.uniform3f(positions.colour, r, g, b);
        // this.gl.uniform1f(positions.hazeAmount, hazeAmount);

        this.gl.uniform1f(positions.fadePixelAccuracy, pixelAccuracy);
        this.gl.uniform1f(positions.fadeAccuracy, depthAccuracy);
        this.gl.uniform1f(positions.minViewDistance, minDepth);
        this.gl.uniform1f(positions.maxViewDistance, maxDepth);

        this.gl.uniform1f(positions.hazeAmount, hazeAmount);
        this.gl.uniform1f(positions.hazeR, r);
        this.gl.uniform1f(positions.hazeG, g);
        this.gl.uniform1f(positions.hazeB, b);
    }

    public draw() {
        const { r, g, b } = this.currentBackground.colour;
        this.gl.clearColor(r, g, b, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}
