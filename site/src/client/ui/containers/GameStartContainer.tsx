import React = require("react");
import { connect } from "react-redux";
import { State, GameEventSubject } from "../State";
import { Game } from "../../Game";
import { GamePanelComponent } from "../components/GamePanelComponent";
import { ServiceLocator } from "../../services/ServiceLocator";
import { DARK_PANEL } from "../../services/resources/manifests/DarkPanel";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";
import { GameButtonContainer } from "./GameButtonContainer";
import { BUTTON_DEFAULT } from "../../services/resources/manifests/ButtonDefault";
import { BUTTON_HOVER } from "../../services/resources/manifests/ButtonHover";
import { BUTTON_PRESS } from "../../services/resources/manifests/ButtonPress";
import { startGame } from "../actions/GameStartActions";
import { Subscription } from "rxjs";
import { PlayerEventType } from "../../engine/events/PlayerEvents";
import { FadeComponent } from "../components/FadeComponent";

interface OwnProps {
    serviceLocator: ServiceLocator;
}

interface StateProps {
    showing: boolean;
    currentScore: number;
    bestScore?: number;
}

function mapStateToProps(state: State) {
    return {
        showing: state.gameStart.showing,
        currentScore: state.gameStart.currentScore,
        bestScore: state.gameStart.bestScore,
    };
}

interface DispatchProps {
    gameStart: () => void;
}

const mapDispatchToProps = {
    gameStart: startGame,
};

type GameStartContainerProps = OwnProps & StateProps & DispatchProps;

class GameStartContainer extends React.Component<GameStartContainerProps> {
    private subscription: Subscription;

    public componentDidMount() {
        this.subscription = GameEventSubject.subscribe((event) => {});
    }

    public componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    public render() {
        // if (!this.props.showing) {
        //     return <> </>;
        // }

        return (
            <FadeComponent
                shouldShow={this.props.showing}
                fadeInSpeed={1000}
                fadeOutSpeed={150}
            >
                {this.getPanel()}
            </FadeComponent>
        );
    }

    private getPanel = () => {
        const showBestScore = this.props.bestScore !== undefined;

        return (
            <GamePanelComponent
                serviceLocator={this.props.serviceLocator}
                width={500}
                height={showBestScore ? 300 : 200}
                style={{
                    marginLeft: 400,
                    marginTop: 200,
                    position: "absolute",
                }}
                childStyle={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
                panelMap={DARK_PANEL}
            >
                <TextComponent
                    text={"Otherworld"}
                    style={{
                        // position: "absolute",
                        width: "100%",
                        textAlign: "center",
                        marginTop: 10,
                    }}
                    font={TextFont.REGULAR}
                    size={TextSize.BIG}
                    colour={TextColour.LIGHT}
                />

                {this.getScoreComponent()}

                <GameButtonContainer
                    serviceLocator={this.props.serviceLocator}
                    width={256}
                    height={46}
                    style={{
                        marginTop: 30,
                    }}
                    childStyle={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    panelMapDefault={BUTTON_DEFAULT}
                    panelMapHover={BUTTON_HOVER}
                    panelMapPress={BUTTON_PRESS}
                    onSelect={this.onStartPress}
                >
                    <TextComponent
                        text={"New Game"}
                        style={{}}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                    />
                </GameButtonContainer>
            </GamePanelComponent>
        );
    };

    private getScoreComponent = () => {
        const showBestScore = this.props.bestScore !== undefined;
        if (!showBestScore) {
            return <></>;
        }
        return (
            <>
                <TextComponent
                    text={`Score: ${this.props.currentScore}`}
                    style={{}}
                    font={TextFont.REGULAR}
                    size={TextSize.SMALL}
                    colour={TextColour.LIGHT}
                />
                <TextComponent
                    text={`Best: ${this.props.bestScore}`}
                    style={{}}
                    font={TextFont.REGULAR}
                    size={TextSize.SMALL}
                    colour={TextColour.LIGHT}
                />
            </>
        );
    };

    private onStartPress = () => {
        this.props.gameStart();
        this.props.serviceLocator.getScriptingService().startGame();
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameStartContainer);
