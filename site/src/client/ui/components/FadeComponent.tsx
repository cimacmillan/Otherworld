import React = require("react");
import { Subscription } from "rxjs";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
import {
    easeInOutCirc,
    sin,
    interpolate,
    animation,
} from "../../util/animation/Animations";

interface FadeComponentProps {
    shouldShow: boolean;
    fadeInSpeed?: number;
    fadeOutSpeed?: number;
}

export const FadeComponent: React.FunctionComponent<FadeComponentProps> = (
    props
) => {
    const [opacity, setOpacity] = React.useState(props.shouldShow ? 1 : 0);

    React.useEffect(() => {
        const fade = animation(setOpacity)
            .speed(props.shouldShow ? props.fadeInSpeed : props.fadeOutSpeed)
            .tween(interpolate(opacity, props.shouldShow ? 1 : 0))
            .driven()
            .start({});

        return () => {
            fade.stop();
        };
    }, [props.shouldShow]);

    if (opacity === 0) {
        return <></>;
    }

    return (
        <div
            style={{
                opacity: opacity,
                width: "100%",
                height: "100%",
                position: "absolute",
            }}
        >
            {props.children}
        </div>
    );
};
