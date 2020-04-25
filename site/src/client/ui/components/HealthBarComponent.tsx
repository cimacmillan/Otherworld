import React = require("react");
import { ServiceLocator } from "../../services/ServiceLocator";
import { Subscription } from "rxjs";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { DOM_HEIGHT, DOM_WIDTH } from "../../Config";
import { getImagePropsFromSprite } from "../../util/math/UI";
import {
    SpriteSheets,
    UISPRITES,
    UIANIMATIONS,
} from "../../services/resources/manifests/Types";
import { GameAnimation } from "../../util/animation/GameAnimation";
import { IntervalDriver } from "../../util/animation/AnimationIntervalDriver";
import { AnimationImageComponent } from "./AnimationImageComponent";
import { GameEventSubject, State } from "../State";
import { connect } from "react-redux";
import { animation } from "../../util/animation/Animations";

const HEALTH_BAR_WIDTH = 0.5;
const HEALTH_BAR_HEIGHT = HEALTH_BAR_WIDTH / 3;

const HEALTH_BAR_BUMP_SPEED = 100;

interface OwnProps {
    serviceLocator: ServiceLocator;
}

interface StateProps {
    showing: boolean;
}

const mapStateToProps = (state: State) => {
    return {
        showing: state.weaponState.showing,
    };
};

export type HealthBarComponentProps = OwnProps & StateProps;

class HealthBarComponent extends React.Component<HealthBarComponentProps> {
    private subscription: Subscription;
    private knockAnimation: GameAnimation;
    private healthBarYOffset = 0;
    constructor(props: HealthBarComponentProps) {
        super(props);
        this.knockAnimation = animation((x: number) => {
            this.healthBarYOffset = Math.sin(x * Math.PI);
            this.forceUpdate();
        })
            .driven()
            .speed(HEALTH_BAR_BUMP_SPEED);
    }

    public componentDidMount() {
        this.subscription = GameEventSubject.subscribe((event) => {
            switch (event.type) {
                case PlayerEventType.PLAYER_DAMAGED:
                    this.knockAnimation.start({
                        onFinish: () => (this.healthBarYOffset = 0),
                    });
                    break;
                case PlayerEventType.PLAYER_KILLED:
                    this.knockAnimation.start({
                        onFinish: () => (this.healthBarYOffset = 0),
                    });
                    break;
            }
        });
    }

    public componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    public render() {
        const health = this.props.serviceLocator
            .getScriptingService()
            .getPlayer()
            .getState().health;

        const width = DOM_HEIGHT * HEALTH_BAR_WIDTH;
        const height = DOM_HEIGHT * HEALTH_BAR_HEIGHT;
        const marginLeft = 10;
        const marginTop = 10;

        const translate = Math.floor(this.healthBarYOffset * 10);

        if (!this.props.showing) {
            return <></>;
        }

        return (
            <div style={{ position: "absolute" }}>
                <AnimationImageComponent
                    serviceLocator={this.props.serviceLocator}
                    spriteSheet={SpriteSheets.UI}
                    animation={UIANIMATIONS.HEALTH_BAR}
                    interp={1 - health}
                    style={{
                        marginLeft,
                        marginTop,
                        width,
                        height,
                        transform: `translate(0, ${translate}px)`,
                    }}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(HealthBarComponent);
