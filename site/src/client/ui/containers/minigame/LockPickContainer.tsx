import { LockMatrixComponent } from "../../components/LockMatrixComponent";
import React = require("react");
import { Colours } from "../../../resources/design/Colour";
import { cloneDeep } from "lodash";

interface LockPickContainerProps {
    onComplete: () => void;
    configuration: LockpickGameConfiguration;
}

export interface LockpickGameConfiguration {
    width: number;
    height: number;
    shouldReset: boolean;
}

const generateNumberMap = (width: number, height: number) => {
    const result = new Array(width)
        .fill(undefined)
        .map(() => new Array(height));
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            result[x][y] = x + y * width;
        }
    }
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const destX = Math.floor(Math.random() * width);
            const destY = Math.floor(Math.random() * height);
            const temp = result[x][y];
            result[x][y] = result[destX][destY];
            result[destX][destY] = temp;
        }
    }
    return result;
};

const generateSelected = (width: number, height: number) =>
    new Array(width).fill(undefined).map(() => new Array(height).fill(false));

export const LockPickContainer: React.FunctionComponent<LockPickContainerProps> = (
    props
) => {
    const { width, height, shouldReset } = props.configuration;
    const [selected, setSelected] = React.useState(
        generateSelected(width, height)
    );
    const [numberMap, setNumberMap] = React.useState(
        generateNumberMap(width, height)
    );
    const [designated, setDesignated] = React.useState(0);

    const reset = () => {
        setSelected(generateSelected(width, height));
        setDesignated(0);
    };

    const onMatrixPress = (x: number, y: number) => {
        const num = numberMap[x][y];
        if (num === designated) {
            const newSelected = cloneDeep(selected);
            newSelected[x][y] = true;
            setSelected(newSelected);
            setDesignated(designated + 1);
            if (designated + 1 >= width * height) {
                props.onComplete();
            }
        } else {
            shouldReset && reset();
        }
    };

    return (
        <LockMatrixComponent
            selected={selected}
            onPress={onMatrixPress}
            style={{}}
            colourPrimary={Colours.LOCK_GOLD}
            colourSecondary={Colours.LOCK_GOLD_DARK}
            colourBackground={Colours.LOCK_GOLD_DARKER}
        />
    );
};
