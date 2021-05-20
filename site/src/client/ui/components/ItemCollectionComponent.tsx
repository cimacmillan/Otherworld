import {
    ShadowComponentStyle,
    ShadowComponentStyleSmall,
} from "./ShadowComponent";
import React = require("react");
import { TextComponent, TextFont, TextSize, TextColour } from "./TextComponent";
import { SpriteImageComponent } from "./SpriteImageComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
// import { SpriteSheets, Sprites } from "../../resources/manifests/Types";
import { animation } from "../../util/animation/Animations";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { ProcedureService } from "../../services/jobs/ProcedureService";
import { SpriteSheets } from "../../resources/manifests";

const Y_FADE = 32;
const DING = 200;
const PERSISTANCE = 2000;
const FADE_IN = 300;
const FADE_OUT = 100;
const SCALE = 0.5;

export interface ItemCollectionComponentProps {
    serviceLocator: ServiceLocator;
    amount: number;
    sprite: string;
    name: string;

    onRemove: () => void;
}

export const ItemCollectionComponent: React.FunctionComponent<ItemCollectionComponentProps> = (
    props
) => {
    const { serviceLocator, amount, sprite, name } = props;
    const [fade, setFade] = React.useState(0);
    const [numberDing, setNumberDing] = React.useState(0);
    const [fadeOutAnimation, setFadeOutAnimation] = React.useState(
        undefined as GameAnimation
    );

    React.useEffect(() => {
        const anim = animation(setFade).speed(FADE_IN).driven(false).start();
        setFadeOutAnimation(
            animation((x) => setFade(1 - x))
                .speed(FADE_OUT)
                .driven(false)
                .whenDone(props.onRemove)
        );
        return () => anim.stop();
    }, []);

    React.useEffect(() => {
        const dingAnimation = animation((x) => setNumberDing(1 - x))
            .speed(DING)
            .whenDone(() => setNumberDing(0))
            .driven(false);
        if (amount > 1) {
            dingAnimation.start();
        }
        const timeout = ProcedureService.setTimeout(
            () => fadeOutAnimation && fadeOutAnimation.start(),
            PERSISTANCE
        );
        return () => {
            setNumberDing(0);
            dingAnimation.stop();
            ProcedureService.clearTimeout(timeout);
        };
    }, [amount, fadeOutAnimation]);

    React.useEffect(() => {
        if (fadeOutAnimation) {
            setFadeOutAnimation(fadeOutAnimation.whenDone(props.onRemove));
        }
    }, [props.onRemove]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                opacity: fade,
                marginBottom: -Y_FADE * (1 - fade),
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 4,
                    marginBottom: 4,
                    ...ShadowComponentStyleSmall(),
                }}
            >
                {amount > 1 ? (
                    AmountComponent(amount, numberDing * SCALE + 1)
                ) : (
                    <></>
                )}
                <SpriteImageComponent
                    spriteSheet={SpriteSheets.SPRITE}
                    sprite={sprite}
                    style={{
                        width: 32,
                        height: 32,
                        marginRight: 4,
                        marginLeft: 4,
                    }}
                />
                <TextComponent
                    text={name}
                    font={TextFont.REGULAR}
                    size={TextSize.SMALL}
                    colour={TextColour.LIGHT}
                    style={{}}
                />
            </div>
        </div>
    );
};

const AmountComponent = (amount: number, ding: number) => (
    <TextComponent
        text={`x${amount}`}
        font={TextFont.REGULAR}
        size={TextSize.SMALL}
        colour={TextColour.LIGHT}
        style={{
            transformOrigin: "center",
            transform: `scale(${ding})`,
        }}
    />
);
