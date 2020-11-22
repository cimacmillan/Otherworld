import React = require("react");
import { LockButtonComponent } from "./LockButtonComponent";

interface LockMatrixComponentProps {
    selected: boolean[][];
    onPress: (x: number, y: number) => void;
    style: React.CSSProperties;
    colourPrimary: string;
    colourSecondary: string;
}

export const LockMatrixComponent: React.FunctionComponent<LockMatrixComponentProps> = (
    props
) => {
    const rows = props.selected.map((selected, i) => (
        <LockMatrixRow
            key={`row${i}`}
            selected={selected}
            onPress={(y: number) => props.onPress(i, y)}
            colourPrimary={props.colourPrimary}
            colourSecondary={props.colourSecondary}
        />
    ));

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            {rows}
        </div>
    );
};

interface LockMatrixRowProps {
    selected: boolean[];
    onPress: (x: number) => void;
    colourPrimary: string;
    colourSecondary: string;
}

const LockMatrixRow: React.FunctionComponent<LockMatrixRowProps> = (props) => {
    const buttons = props.selected.map((selected, i) => {
        return (
            <LockButtonComponent
                key={`but${i}`}
                selected={selected}
                onPress={() => props.onPress(i)}
                style={{}}
                colourPrimary={props.colourPrimary}
                colourSecondary={props.colourSecondary}
            />
        );
    });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {buttons}
        </div>
    );
};
