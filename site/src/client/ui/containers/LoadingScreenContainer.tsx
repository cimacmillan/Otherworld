import React = require("react");
import { useGlobalState } from "../effects/GlobalState";
import { ViewportComponent } from "../components/ViewportComponent";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";

const LOADING_WIDTH = 256;
const LOADING_HEIGHT = 32;

export const LoadingScreenContainer: React.FunctionComponent = (props) => {
    const [state, dispatch] = useGlobalState();

    return (
        <ViewportComponent
            x={0}
            y={0}
            width={DOM_WIDTH}
            height={DOM_HEIGHT}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <LoadingBar
                percentage={state.gameStart.gameLoadPercentage}
                width={LOADING_WIDTH}
                height={LOADING_HEIGHT}
            />
        </ViewportComponent>
    );
};

interface LoadingBarProps {
    percentage: number;
    width: number;
    height: number;
}

const borderColor = "gray";
const backgroundColor = "gray";
const borderWidth = 2;

export const LoadingBar: React.FunctionComponent<LoadingBarProps> = (props) => {
    const width = (props.width - borderWidth * 2) * props.percentage;
    const height = props.height - borderWidth * 2;

    return (
        <div
            style={{
                borderStyle: "solid",
                borderColor,
                borderWidth: `${borderWidth}px`,
                width: props.width,
                height: props.height,
                backgroundColor: "",
            }}
        >
            <div
                style={{
                    width,
                    height,
                    backgroundColor,
                }}
            ></div>
        </div>
    );
};
