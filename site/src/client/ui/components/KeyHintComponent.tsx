import React = require("react");
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import {
    SpriteSheets,
    UISPRITES,
} from "../../services/resources/manifests/Types";
import { KeyComponent, SELECTED_TEXT_OFFSET } from "./KeyComponent";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { CompositeAnimation } from "../../util/animation/CompositeAnimation";
import { animation, sin } from "../../util/animation/Animations";

interface KeyHintComponent {
    serviceLocator: ServiceLocator;
    keyCode: string;
    selected: boolean;
    text: string;
    style: React.CSSProperties;
    fade: boolean;
    onFadeComplete: () => void;
}

const yFade = 64;
const fadeSpeed = 300;

export const KeyHintComponent: React.FunctionComponent<KeyHintComponent> = (
    props
) => {
    const offset = props.selected ? SELECTED_TEXT_OFFSET : 0;
    const [fadeOffset, setFadeOffset] = React.useState(0);

    React.useEffect(() => {
        if (props.fade) {
            const fadeAnimation = animation((x: number) => setFadeOffset(x))
                .tween(sin)
                .speed(fadeSpeed)
                .driven()
                .start()
                .whenDone(() => {
                    props.onFadeComplete();
                    setFadeOffset(0);
                });
            return () => fadeAnimation.stop();
        }
    }, [props.fade]);

    return (
        <div
            style={{
                display: "flex",
                marginTop: -fadeOffset * yFade,
                opacity: 1 - fadeOffset,
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
