import React = require("react");
import { connect } from "react-redux";
import { ServiceLocator } from "../../services/ServiceLocator";
import {
    TextComponent,
    TextFont,
    TextSize,
    TextColour,
} from "../components/TextComponent";
import { GameButtonContainer } from "./GameButtonContainer";
import { Subscription } from "rxjs";
import { FadeComponent } from "../components/FadeComponent";
import { useGlobalState } from "../effects/GlobalState";
import { startGame } from "../actions/GameStartActions";
import { KeyComponent } from "../components/KeyComponent";
import { KeyHintComponent } from "../components/KeyHintComponent";
import { DOM_WIDTH, DOM_HEIGHT } from "../../Config";
import { useServiceLocator } from "../effects/GameEffect";

interface GameMenuContainerProps {}

export const GameMenuContainer: React.FunctionComponent<GameMenuContainerProps> = (
    props
) => {
    const [state, dispatch] = useGlobalState();
    const serviceLocator = useServiceLocator();

    const onStartPress = () => {
        dispatch(startGame());
        serviceLocator.getScriptingService().startGame();
    };

    const showBestScore = state.gameStart.bestScore !== undefined;

    return (
        <FadeComponent
            startingShown={false}
            shouldShow={state.gameStart.showingMenu}
            fadeInSpeed={1000}
            fadeOutSpeed={150}
        >
            <div
                style={{
                    width: DOM_WIDTH,
                    height: DOM_HEIGHT,
                    position: "absolute",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <TextComponent
                    text={"Otherworld"}
                    style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: 10,
                    }}
                    font={TextFont.REGULAR}
                    size={TextSize.BIG}
                    colour={TextColour.LIGHT}
                />
                <GameButtonContainer
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
                    onSelect={onStartPress}
                >
                    <TextComponent
                        text={"New Game"}
                        style={{}}
                        font={TextFont.REGULAR}
                        size={TextSize.SMALL}
                        colour={TextColour.LIGHT}
                    />
                </GameButtonContainer>

                <TextComponent
                    text={"Copyright \u00a9 2020 Callum Macmillan"}
                    style={{
                        marginTop: 100,
                    }}
                    font={TextFont.REGULAR}
                    size={TextSize.SMALL}
                    colour={TextColour.LIGHT}
                />
            </div>
        </FadeComponent>
    );
};
