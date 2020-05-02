const background_r = 0.22;
const background_g = 0.26;
const background_b = 0.4;

const hazeAmount = 0.2;

export const hazeFunction = `
    lowp vec3 haze(lowp vec3 colour) {

        lowp vec3 hazeColour = vec3(
            ${background_r}, ${background_g}, ${background_b}
        );

        lowp float grad = ${hazeAmount};

        return (grad * hazeColour) + ((1.0 - grad) * colour);
    }
`;
