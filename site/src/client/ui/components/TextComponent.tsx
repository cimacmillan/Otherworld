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
    style: React.CSSProperties;

    font: TextFont;
    size: TextSize;
    colour: TextColour;
}

const selectNone =
    "-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;";

export function TextComponent(props: TextComponentProps) {
    return (
        <div
            style={{
                fontFamily: props.font,
                fontSize: props.size,
                color: props.colour,

                MozUserSelect: "none",
                WebkitUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",

                ...props.style,
            }}
        >
            {props.text}
        </div>
    );
}
