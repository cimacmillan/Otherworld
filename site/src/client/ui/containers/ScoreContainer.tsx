import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";
import { useGlobalState, useDispatchListener } from "../effects/GlobalState";
import React = require("react");
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { animation, sin } from "../../util/animation/Animations";
import { Actions } from "../actions/Actions";
import { EnemyEventType } from "../../engine/events/EnemyEvents";

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
            .driven();
    }, []);

    useDispatchListener((action: Actions) => {
        if (action.type === EnemyEventType.ENEMY_KILLED) {
            bounce.start().whenDone(() => setScale(1));
        }
    });

    const transform = `scale(${scale})`;
    return (
        <div
            style={{
                width: DOM_WIDTH,
                height: DOM_HEIGHT,
                display: "flex",
                justifyContent: "flex-end",
                position: "absolute",
            }}
        >
            <TextComponent
                text={`${state.gameStart.currentScore}`}
                font={TextFont.REGULAR}
                size={TextSize.MED}
                colour={TextColour.LIGHT}
                style={{
                    transform,
                    transformOrigin: "top right",
                }}
            />
        </div>
    );
};