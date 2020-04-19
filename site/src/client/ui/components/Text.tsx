import React = require("react");

export enum TextFont {
    REGULAR = "yoster_islandregular",
}

export enum TextSize {
    SMALL = 20,
    MED = 36,
    BIG = 50,
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
                fontFamily: TextFont.REGULAR,
                fontSize: TextSize.BIG,
                color: TextColour.LIGHT,
                left: 100,
                top: 100,
            }}
        >
            {props.text}
        </div>
    );
}
