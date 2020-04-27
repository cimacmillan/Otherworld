import React = require("react");
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import {
    SpriteSheets,
    UISPRITES,
} from "../../services/resources/manifests/Types";
import { KeyComponent, SELECTED_TEXT_OFFSET } from "./KeyComponent";

interface KeyHintComponent {
    serviceLocator: ServiceLocator;
    keyCode: string;
    selected: boolean;
    text: string;
    style: React.CSSProperties;
}

export const KeyHintComponent: React.FunctionComponent<KeyHintComponent> = (
    props
) => {
    const offset = props.selected ? SELECTED_TEXT_OFFSET : 0;

    return (
        <div
            style={{
                display: "flex",
            }}
        >
            <KeyComponent
                serviceLocator={props.serviceLocator}
                keyCode={props.keyCode}
                selected={props.selected}
                style={{}}
            />
            <TextComponent
                text={props.text}
                font={TextFont.REGULAR}
                size={TextSize.MED}
                colour={TextColour.LIGHT}
                style={{
                    transform: `translate(0px, ${offset}px)`,
                }}
            />
        </div>
    );
};
