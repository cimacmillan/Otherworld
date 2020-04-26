import React = require("react");
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";

interface KeyComponentProps {
    keyCode: string;
}

export const KeyComponent: React.FunctionComponent<KeyComponentProps> = (
    props
) => {
    return (
        <TextComponent
            text={props.keyCode}
            font={TextFont.REGULAR}
            size={TextSize.MED}
            colour={TextColour.LIGHT}
            style={{ position: "absolute" }}
        />
    );
};
