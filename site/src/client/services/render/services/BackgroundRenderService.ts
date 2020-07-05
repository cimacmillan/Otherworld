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

export const OutdoorBackground: Background = {
    colour: {
        r: 0.22,
        g: 0.26,
        b: 0.4,
    },
    hazeAmount: 0.2,
    fog: {
        minDepth: 6,
        maxDepth: 20,
        pixelAccuracy: 4,
        depthAccuracy: 8,
    },
};

export const CaveBackground: Background = {
    colour: {
        r: 0.22,
        g: 0.26,
        b: 0.4,
    },
    hazeAmount: 0.2,
    fog: {
        minDepth: 6,
        maxDepth: 20,
        pixelAccuracy: 4,
        depthAccuracy: 8,
    },
};

export class BackgroundRenderService {
    private currentBackground: Background;

    public setBackground(background: Background) {
        this.currentBackground = background;
    }
}
