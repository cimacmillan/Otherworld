import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";
import { useGlobalState } from "../effects/GlobalState";
import React = require("react");
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { animation, sin } from "../../util/animation/Animations";
import { Actions } from "../../Actions";
import {
    ShadowComponentStyle,
    ShadowComponentStyleAlpha,
} from "../components/ShadowComponent";

export const ScoreContainer: React.FunctionComponent = (props) => {
    const [state, dispatch] = useGlobalState();
    const [scale, setScale] = React.useState(1);

    let bounce: GameAnimation;
    React.useEffect(() => {
        bounce = animation((x: number) => {
            setScale(1 + x);
        })
            .tween((x) => x * 2)
            .tween(sin)
            .speed(300)
            .driven(false);
    }, []);

    const transform = `scale(${scale})`;
    return (
        <div
            style={{
                width: DOM_WIDTH,
                height: DOM_HEIGHT,
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                alignItems: "flex-start",
            }}
        >
            <TextComponent
                text={`Under Construction`}
                font={TextFont.REGULAR}
                size={TextSize.SMALL}
                colour={TextColour.LIGHT}
                style={{
                    transform,
                    transformOrigin: "top center",
                    ...ShadowComponentStyleAlpha(),
                }}
            />
        </div>
    );
};
