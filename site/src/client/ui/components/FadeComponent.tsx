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
    startingShown?: boolean;
    fadeInSpeed?: number;
    fadeOutSpeed?: number;
    onFadeIn?: () => void;
    onFadeOut?: () => void;
    render: (x: number, fadingIn: boolean) => React.ReactElement;
}

interface FadeComponentState {
    opacity: number;
}

export class FadeComponent extends React.Component<
    FadeComponentProps,
    FadeComponentState
> {
    private currentAnimation: GameAnimation = null;
    public constructor(props: FadeComponentProps) {
        super(props);
        let opacity = props.shouldShow ? 1 : 0;
        if (props.startingShown !== undefined) {
            opacity = props.startingShown ? 1 : 0;
        }

        this.state = {
            opacity,
        };
    }

    public componentDidMount() {
        this.setAnimation();
    }

    public componentDidUpdate(prevProps: FadeComponentProps) {
        if (prevProps.shouldShow !== this.props.shouldShow) {
            this.setAnimation();
        }
    }

    public setAnimation() {
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }
        this.currentAnimation = animation((x) => this.setState({ opacity: x }))
            .speed(
                this.props.shouldShow
                    ? this.props.fadeInSpeed
                    : this.props.fadeOutSpeed
            )
            .tween(
                interpolate(this.state.opacity, this.props.shouldShow ? 1 : 0)
            )
            .driven(false)
            .start()
            .whenDone(() =>
                this.props.shouldShow
                    ? this.props.onFadeIn && this.props.onFadeIn()
                    : this.props.onFadeOut && this.props.onFadeOut()
            );
    }

    public componentWillUnmount() {
        this.currentAnimation.stop();
    }

    public render() {
        return (
            <>{this.props.render(this.state.opacity, this.props.shouldShow)}</>
        );
    }
}
