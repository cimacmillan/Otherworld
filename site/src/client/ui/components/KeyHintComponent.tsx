import React = require("react");
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
    TextShadow,
} from "./TextComponent";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
// import { SpriteSheets, UISPRITES } from "../../resources/manifests/Types";
import { KeyComponent, SELECTED_TEXT_OFFSET } from "./KeyComponent";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { CompositeAnimation } from "../../util/animation/CompositeAnimation";
import { animation, sin } from "../../util/animation/Animations";

export interface KeyHintComponentProps {
    keyCode: string[];
    selected: boolean;
    text: string;
    style: React.CSSProperties;
    x: number;
}

export const KeyHintComponent: React.FunctionComponent<KeyHintComponentProps> = (
    props
) => {
    const offset = props.selected ? SELECTED_TEXT_OFFSET : 0;

    const keyComponent = props.keyCode.map((code) => (
        <KeyComponent
            key={code}
            keyCode={code}
            selected={props.selected}
            style={{}}
        />
    ));

    return (
        <div
            style={{
                ...props.style,
                display: "flex",
                alignItems: "center",
            }}
        >
            {keyComponent}
            <TextComponent
                text={props.text}
                font={TextFont.REGULAR}
                size={TextSize.MED}
                colour={TextColour.LIGHT}
                shadow={TextShadow.LARGE}
                style={{
                    transform: `translate(0px, ${offset}px)`,
                }}
            />
        </div>
    );
};
