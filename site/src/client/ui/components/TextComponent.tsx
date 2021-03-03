import React = require("react");

export enum TextFont {
    REGULAR = "yoster_islandregular",
}

export enum TextSize {
    VSMALL = 14,
    SMALL = 20,
    MED = 36,
    BIG = 50,
}

export enum TextColour {
    LIGHT = "#c0cbdc",
    LESS_LIGHT = "#5a6988",
    DARK = "#3e2731",
    RED = "#e43b44",
    YELLOW = "#feae34",
    GOLD = "#fee761",
    STEEL = "#98a198"
}

export enum TextShadow {
    SMALL = "0px 0px 8px #000000",
    LARGE = "0px 0px 16px #000000",
}

export interface TextComponentProps {
    text?: string;
    style?: React.CSSProperties;

    font?: TextFont;
    size?: TextSize;
    colour?: TextColour;
    shadow?: TextShadow;

    clickable?: () => void;
}

const ignoreFont = [""];

const getPropsOrDefault = (
    props: Partial<TextComponentProps>
): TextComponentProps => {
    return {
        text: "Default",
        style: {},
        font: TextFont.REGULAR,
        size: TextSize.MED,
        colour: TextColour.LIGHT,
        ...props,
    };
};

export const TextComponent: React.FunctionComponent<TextComponentProps> = (
    props_
) => {
    const props = getPropsOrDefault(props_);

    const shouldBeIgnored = ignoreFont.find((ignore) => ignore === props.text);
    const fontFamily = shouldBeIgnored
        ? {}
        : {
              fontFamily: props.font,
          };
    const pointer = props.clickable
        ? {
              cursor: "pointer",
          }
        : {};

    const shadowText = props.shadow || "";

    return (
        <div
            style={{
                ...fontFamily,
                fontSize: props.size,
                color: props.colour,

                MozUserSelect: "none",
                WebkitUserSelect: "none",
                msUserSelect: "none",
                userSelect: "none",
                textShadow: shadowText,
                ...pointer,
                ...props.style,
            }}
            onClick={() => props.clickable && props.clickable()}
        >
            {props.text}
        </div>
    );
};
