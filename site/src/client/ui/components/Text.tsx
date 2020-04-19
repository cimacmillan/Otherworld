import React = require("react");

export enum TextSize {
    SMALL,
    MED,
    BIG,
}

export enum TextColour {
    LIGHT = "#c0cbdc",
    DARK = "#3e2731",
}

export interface TextComponentProps {
    text: string;
}

export function TextComponent(props: TextComponentProps) {
    return (
        <div
            style={{
                fontSize: 20,
                color: TextColour.LIGHT,
                transform: "scale(2)",
            }}
        >
            {props.text}
        </div>
    );
}
