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

export const TextComponent: React.FunctionComponent<TextComponentProps> = (
    props
) => {
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
};
