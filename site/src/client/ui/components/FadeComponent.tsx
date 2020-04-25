import React = require("react");
import { Subscription } from "rxjs";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/Animation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
import { easeInOutCirc, sin } from "../../util/animation/TweenFunction";

interface FadeContainerState {
    opacity: number;
}

interface FadeComponentProps {
    shouldShow: boolean;
    fadeInSpeed?: number;
    fadeOutSpeed?: number;
}

export class FadeComponent extends React.Component<
    FadeComponentProps,
    FadeContainerState
> {
    state: FadeContainerState = {
        opacity: 0,
    };

    private fadeOut: GameAnimation;
    private fadeIn: GameAnimation;

    public constructor(props: FadeComponentProps) {
        super(props);

        console.log(props.fadeInSpeed, props.fadeOutSpeed);

        this.fadeOut = new GameAnimation((x: number) => {
            this.setState({
                opacity: 1 - x,
            });
        }, new IntervalDriver()).speed(
            props.fadeOutSpeed
        ).tween(sin);

        this.fadeIn = new GameAnimation((x: number) => {
            this.setState({
                opacity: x,
            });
        }, new IntervalDriver()).speed(
            props.fadeInSpeed
        ).tween(sin);
    }

    public componentDidMount() {
        this.setState({
            opacity: this.props.shouldShow ? 1 : 0,
        });
    }

    public componentWillUpdate(nextProps: FadeComponentProps) {
        if (nextProps.shouldShow && !this.props.shouldShow) {
            this.fadeOut.stop();
            this.fadeIn.start({});
        }

        if (!nextProps.shouldShow && this.props.shouldShow) {
            this.fadeIn.stop();
            this.fadeOut.start({});
        }
    }

    public render() {
        if (this.state.opacity === 0) {
            return <></>;
        }

        return (
            <div style={{opacity: this.state.opacity, width: "100%", height: "100%", position: "absolute"}}>
                {this.props.children}
            </div>
        );
    }
}
