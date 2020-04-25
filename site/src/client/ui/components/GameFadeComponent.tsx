import React = require("react");
import { Subscription } from "rxjs";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { GameAnimation } from "../../util/animation/Animation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";

interface GameFadeContainerState {
    opacity: number;
}

interface GameFadeComponentProps {
    shouldShow: boolean;
    colour: string;
}

const overlayColour = "#000000";

export class GameFadeComponent extends React.Component<
    GameFadeComponentProps,
    GameFadeContainerState
> {
    state: GameFadeContainerState = {
        opacity: 0,
    };

    private fadeOut: GameAnimation;
    private fadeIn: GameAnimation;

    public constructor(props: GameFadeComponentProps) {
        super(props);
        this.fadeOut = new GameAnimation((x: number) => {
            this.setState({
                opacity: 1 - x,
            });
        }, new IntervalDriver());

        this.fadeIn = new GameAnimation((x: number) => {
            this.setState({
                opacity: x,
            });
        }, new IntervalDriver());
    }

    public componentDidMount() {
        this.setState({
            opacity: this.props.shouldShow ? 1 : 0,
        });
    }

    public componentWillUpdate(nextProps: GameFadeComponentProps) {
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
        return (
            <div
                style={{
                    width: DOM_WIDTH,
                    height: DOM_HEIGHT,
                    position: "absolute",
                    backgroundColor: overlayColour,
                    opacity: this.state.opacity,
                }}
            />
        );
    }
}
