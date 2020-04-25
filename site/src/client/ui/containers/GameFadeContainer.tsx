import React = require("react");
import { connect } from "react-redux";
import { State, GameEventSubject } from "../State";
import { Subscription } from "rxjs";
import { ServiceLocator } from "../../services/ServiceLocator";
import { startGame } from "../actions/GameStartActions";
import { FadeComponent } from "../components/FadeComponent";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";

interface StateProps {
    showing: boolean;
}

function mapStateToProps(state: State) {
    return {
        showing: state.gameStart.showing,
    };
}

interface DispatchProps {
    gameStart: () => void;
}

const mapDispatchToProps = {
    gameStart: startGame,
};

interface OwnProps {
    serviceLocator: ServiceLocator;
}

interface GameFadeContainerState {
    opacity: number;
}

type GameFadeContainerProps = OwnProps & StateProps & DispatchProps;

class GameFadeContainer extends React.Component<
    GameFadeContainerProps,
    GameFadeContainerState
> {
    state: GameFadeContainerState = {
        opacity: 0,
    };

    private subscription: Subscription;

    public constructor(props: GameFadeContainerProps) {
        super(props);
    }

    public componentDidMount() {
        this.subscription = GameEventSubject.subscribe((event) => {});
    }

    public componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    public render() {
        return (
            <FadeComponent
                shouldShow={this.props.showing}
                fadeInSpeed={1000}
                fadeOutSpeed={300}
            >
                <div
                    style={{
                        width: DOM_WIDTH,
                        height: DOM_HEIGHT,
                        position: "absolute",
                        backgroundColor: "#000000",
                    }}
                />
            </FadeComponent>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameFadeContainer);
