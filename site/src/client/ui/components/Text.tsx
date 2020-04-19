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
        <cavas
            style={{
                fontSize: 10,
                color: TextColour.LIGHT,
                left: 100,
                top: 100,
                transform: "scale(4, 4) translate(100px, 100px)",
            }}
        >
            {props.text}
        </cavas>
    );
}
