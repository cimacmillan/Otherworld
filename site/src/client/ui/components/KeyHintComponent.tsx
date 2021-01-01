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

interface KeyHintComponent {
    keyCode: string;
    selected: boolean;
    text: string;
    style: React.CSSProperties;
    fade: boolean;
    onFadeComplete: () => void;
}

const yFade = 64;
const fadeSpeed = 200;
const initialFade: GameAnimation | undefined = undefined;

export const KeyHintComponent: React.FunctionComponent<KeyHintComponent> = (
    props
) => {
    const offset = props.selected ? SELECTED_TEXT_OFFSET : 0;
    const [fadeOffset, setFadeOffset] = React.useState(1);
    const [fadeOutAnimation, setFadeOutAnimation] = React.useState(initialFade);
    const [fadeInAnimation, setFadeInAnimation] = React.useState(initialFade);

    React.useEffect(() => {
        setFadeOutAnimation(
            animation((x: number) => setFadeOffset(x))
                .tween(sin)
                .speed(fadeSpeed)
                .whenDone(props.onFadeComplete)
                .driven(false)
        );
    }, []);

    React.useEffect(() => {
        const fadeIn = animation((x: number) => setFadeOffset(1 - x))
            .tween(sin)
            .speed(fadeSpeed)
            .driven(false)
            .start();
        setFadeInAnimation(fadeIn);
    }, []);

    React.useEffect(() => {
        if (fadeOutAnimation) {
            setFadeOutAnimation(
                fadeOutAnimation.whenDone(props.onFadeComplete)
            );
        }
    }, [props.onFadeComplete]);

    React.useEffect(() => {
        if (props.fade && fadeOutAnimation) {
            fadeInAnimation.stop();
            fadeOutAnimation.start();
        }
    }, [props.fade]);

    return (
        <div
            style={{
                ...props.style,
                display: "flex",
                marginTop: -fadeOffset * yFade,
                opacity: 1 - fadeOffset,
            }}
        >
            <KeyComponent
                keyCode={props.keyCode}
                selected={props.selected}
                style={{}}
            />
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
